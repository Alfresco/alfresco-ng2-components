/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, ViewEncapsulation, Input, Inject, OnDestroy } from '@angular/core';
import { AppConfigService, UserPreferencesService } from '@alfresco/adf-core';
import { TaskQueryCloudRequestModel } from '../../../models/filter-cloud-model';
import { BaseTaskListCloudComponent } from './base-task-list-cloud.component';
import { TaskCloudService } from '../../services/task-cloud.service';
import { TASK_LIST_CLOUD_TOKEN, TASK_LIST_PREFERENCES_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { PreferenceCloudServiceInterface } from '../../../services/preference-cloud.interface';
import { TaskListCloudServiceInterface } from '../../../services/task-list-cloud.service.interface';
import { Subject, of, BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { VariableMapperService } from '../../../services/variable-mapper.sevice';
import { ProcessListDataColumnCustomData } from '../../../models/data-column-custom-data';
import { TaskCloudModel } from '../../../models/task-cloud.model';
import { PaginatedEntries } from '@alfresco/js-api';
import { TaskInstanceCloudListViewModel } from '../models/task-cloud-view.model';
import { TasksListDatatableAdapter } from '../datatable/task-list-datatable-adapter';

const PRESET_KEY = 'adf-cloud-task-list.presets';

@Component({
    selector: 'adf-cloud-task-list',
    templateUrl: './base-task-list-cloud.component.html',
    styleUrls: ['./base-task-list-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskListCloudComponent extends BaseTaskListCloudComponent<ProcessListDataColumnCustomData> implements OnDestroy {
    /**
     * The assignee of the process. Possible values are: "assignee" (the current user is the assignee),
     * "candidate" (the current user is a task candidate", "group_x" (the task is assigned to a group
     * where the current user is a member, no value (the current user is involved).
     */
    @Input()
    assignee: string = '';

    /** Filter the tasks. Display only tasks created on the supplied date. */
    @Input()
    createdDate: Date;

    /** Filter the tasks. Display only tasks with createdFrom equal to the supplied date. */
    @Input()
    createdFrom: string = '';

    /** Filter the tasks. Display only tasks with createdTo equal to the supplied date. */
    @Input()
    createdTo: string = '';

    /** Filter the tasks. Display only tasks with dueDate equal to the supplied date. */
    @Input()
    dueDate: Date;

    /** Filter the tasks. Display only tasks with lastModifiedFrom equal to the supplied date. */
    @Input()
    lastModifiedFrom: string = '';

    /** Filter the tasks. Display only tasks with lastModifiedTo equal to the supplied date. */
    @Input()
    lastModifiedTo: string = '';

    /** Filter the tasks. Display only tasks with dueDate greater or equal than the supplied date. */
    @Input()
    dueDateFrom: string = '';

    /** Filter the tasks. Display only tasks with dueDate less or equal to the supplied date. */
    @Input()
    dueDateTo: string = '';

    /** Filter the tasks. Display only tasks with id equal to the supplied value. */
    @Input()
    id: string = '';

    /** Filter the tasks. Display only tasks with the supplied name. */
    @Input()
    name: string = '';

    /** Filter the tasks to display only the ones with this environment ID. */
    @Input()
    environmentId: string;

    /** Filter the tasks. Display only tasks with parentTaskId equal to the supplied value. */
    @Input()
    parentTaskId: string = '';

    /** Filter the tasks. Display only tasks with processDefinitionName equal to the supplied value. */
    @Input()
    processDefinitionName: string = '';

    /** Filter the tasks. Display only tasks with processDefinitionId equal to the supplied value. */
    @Input()
    processDefinitionId: string = '';

    /** Filter the tasks. Display only tasks with processInstanceId equal to the supplied value. */
    @Input()
    processInstanceId: string = '';

    /** Filter the tasks. Display only tasks with status equal to the supplied value. */
    @Input()
    status: string = '';

    /** Filter the tasks. Display only tasks with owner equal to the supplied value. */
    @Input()
    owner: string = '';

    /** Filter the tasks. Display only tasks with priority equal to the supplied value. */
    @Input()
    priority: number;

    /** Filter the tasks. Display only tasks with createdBy equal to the supplied value. */
    @Input()
    completedBy: number;

    /** Filter the tasks. Display only the tasks that belong to a process in case is false or tasks that doesn't belong to a process in case of true. */
    @Input()
    standalone: boolean = false;

    /** Filter the tasks. Display only tasks with completedDate equal to the supplied date. */
    @Input()
    completedDate: string = '';

    /** Filter the tasks. Display only tasks with completedFrom equal to the supplied date. */
    @Input()
    completedFrom: string = '';

    /** Filter the tasks. Display only tasks with completedTo equal to the supplied date. */
    @Input()
    completedTo: string = '';

    /** Filter the tasks. Display only tasks with candidateGroups equal to the supplied value. */
    @Input()
    candidateGroupId: string = '';

    private onDestroyTaskList$ = new Subject<boolean>();

    rows: TaskInstanceCloudListViewModel[] = [];
    dataAdapter: TasksListDatatableAdapter | undefined;

    private isReloadingSubject$ = new BehaviorSubject<boolean>(false);
    isLoading$ = combineLatest([
        this.isLoadingPreferences$,
        this.isReloadingSubject$
    ]).pipe(
        map(([isLoadingPreferences, isReloading]) => isLoadingPreferences || isReloading)
    );

    constructor(@Inject(TASK_LIST_CLOUD_TOKEN) public taskListCloudService: TaskListCloudServiceInterface,
                appConfigService: AppConfigService,
                taskCloudService: TaskCloudService,
                userPreferences: UserPreferencesService,
                @Inject(TASK_LIST_PREFERENCES_SERVICE_TOKEN) cloudPreferenceService: PreferenceCloudServiceInterface,
                private viewModelCreator: VariableMapperService
            ) {
        super(appConfigService, taskCloudService, userPreferences, PRESET_KEY, cloudPreferenceService);
    }

    ngOnDestroy() {
        this.onDestroyTaskList$.next(true);
        this.onDestroyTaskList$.complete();
    }

    reload() {
        this.isReloadingSubject$.next(true);

        this.isColumnSchemaCreated$.pipe(
            switchMap(() => of(this.createRequestNode())),
            tap((requestNode) => this.requestNode = requestNode),
            switchMap((requestNode) => this.taskListCloudService.getTaskByRequest(requestNode)),
            takeUntil(this.onDestroyTaskList$)
        ).subscribe((tasks: { list: PaginatedEntries<TaskCloudModel> }) => {
            const tasksWithVariables = tasks.list.entries.map((task) => ({
                ...task,
                variables: task.processVariables
            }));

            this.rows = this.viewModelCreator.mapVariablesByColumnTitle(
                tasksWithVariables,
                this.columns
            );

            this.dataAdapter = new TasksListDatatableAdapter(this.rows, this.columns);

            this.success.emit(tasks);
            this.isReloadingSubject$.next(false);
            this.pagination.next(tasks.list.pagination);
        }, (error) => {
            this.error.emit(error);
            this.isReloadingSubject$.next(false);
        });
    }

    createRequestNode(): TaskQueryCloudRequestModel {
        const requestNode = {
            appName: this.appName,
            assignee: this.assignee,
            id: this.id,
            name: this.name,
            environmentId: this.environmentId,
            parentTaskId: this.parentTaskId,
            processDefinitionName: this.processDefinitionName,
            processDefinitionId: this.processDefinitionId,
            processInstanceId: this.processInstanceId,
            owner: this.owner,
            priority: this.priority,
            lastModifiedFrom: this.lastModifiedFrom,
            lastModifiedTo: this.lastModifiedTo,
            dueDateFrom: this.dueDateFrom,
            dueDateTo: this.dueDateTo,
            status: this.status,
            dueDate: this.dueDate,
            createdDate: this.createdDate,
            createdFrom: this.createdFrom,
            createdTo: this.createdTo,
            maxItems: this.size,
            skipCount: this.skipCount,
            sorting: this.sorting,
            standalone: this.standalone,
            completedBy: this.completedBy,
            completedFrom: this.completedFrom,
            completedTo: this.completedTo,
            completedDate: this.completedDate,
            candidateGroupId: this.candidateGroupId,
            variableKeys: this.getRequestNodeVariables()
        };

        return new TaskQueryCloudRequestModel(requestNode);
    }

    private getRequestNodeVariables(): string[] | undefined {
        const displayedVariableColumns: string[] = (this.columns ?? [])
            .filter(column =>
                column.customData?.columnType === 'process-variable-column' &&
                column.isHidden !== true
            )
            .map(column => {
                const variableDefinitionsPayload = column.customData.variableDefinitionsPayload;
                return variableDefinitionsPayload;
            })
            .reduce((allRequestKeys, requestKeys) => [...requestKeys, ...allRequestKeys], []);

        return displayedVariableColumns.length ? displayedVariableColumns : undefined;
    }
}
