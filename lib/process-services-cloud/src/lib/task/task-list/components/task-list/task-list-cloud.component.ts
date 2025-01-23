/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import {
    AdfDateFnsAdapter,
    AppConfigService,
    ColumnsSelectorComponent,
    DataTableComponent,
    EmptyContentComponent,
    LoadingContentTemplateDirective,
    MainMenuDataTableTemplateDirective,
    MOMENT_DATE_FORMATS,
    NoContentTemplateDirective,
    UserPreferencesService
} from '@alfresco/adf-core';
import { TaskListRequestModel, TaskQueryCloudRequestModel } from '../../../../models/filter-cloud-model';
import { BaseTaskListCloudComponent } from '../base-task-list-cloud.component';
import { TaskCloudService } from '../../../services/task-cloud.service';
import { TASK_LIST_CLOUD_TOKEN, TASK_LIST_PREFERENCES_SERVICE_TOKEN } from '../../../../services/cloud-token.service';
import { PreferenceCloudServiceInterface } from '../../../../services/preference-cloud.interface';
import { TaskListCloudServiceInterface } from '../../../../services/task-list-cloud.service.interface';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { VariableMapperService } from '../../../../services/variable-mapper.sevice';
import { ProcessListDataColumnCustomData } from '../../../../models/data-column-custom-data';
import { TaskCloudModel } from '../../../../models/task-cloud.model';
import { PaginatedEntries } from '@alfresco/js-api';
import { TaskInstanceCloudListViewModel } from '../../models/task-cloud-view.model';
import { TasksListDatatableAdapter } from './datatable/task-list-datatable-adapter';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskListRequestSortingModel } from '../../../../models/task-list-sorting.model';
import { ProcessVariableFilterModel } from '../../../../models/process-variable-filter.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

const PRESET_KEY = 'adf-cloud-task-list.presets';

@Component({
    selector: 'adf-cloud-task-list',
    imports: [
        CommonModule,
        ColumnsSelectorComponent,
        MainMenuDataTableTemplateDirective,
        TranslateModule,
        EmptyContentComponent,
        NoContentTemplateDirective,
        MatProgressSpinnerModule,
        LoadingContentTemplateDirective,
        DataTableComponent
    ],
    providers: [
        { provide: DateAdapter, useClass: AdfDateFnsAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS }
    ],
    templateUrl: './task-list-cloud.component.html',
    styleUrls: ['./task-list-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskListCloudComponent extends BaseTaskListCloudComponent<ProcessListDataColumnCustomData> {
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

    /** From Activiti 8.7.0 forward, use the 'POST' value and array inputs to enable advanced filtering. */
    @Input()
    searchApiMethod: 'GET' | 'POST' = 'GET';

    /**
     * Filter the tasks. Display only tasks with names matching any of the supplied strings.
     * This input will be used only if searchApiMethod input is provided with 'POST' value.
     */
    @Input()
    names: string[] = [];

    /**
     * Filter the tasks. Display only tasks with assignees whose usernames are present in the array.
     * This input will be used only if searchApiMethod input is provided with 'POST' value.
     */
    @Input()
    assignees: string[] = [];

    /**
     * Filter the tasks. Display only tasks with provided statuses.
     * This input will be used only if searchApiMethod input is provided with 'POST' value.
     */
    @Input()
    statuses: string[] = [];

    /**
     * Filter the tasks. Display only tasks under processes with provided definition names.
     * This input will be used only if searchApiMethod input is provided with 'POST' value.
     */
    @Input()
    processDefinitionNames: string[] = [];

    /**
     * Filter the tasks. Display only tasks with Ids matching any of the supplied strings.
     * This input will be used only if searchApiMethod input is provided with 'POST' value.
     */
    @Input()
    ids: string[] = [];

    /**
     * Filter the tasks. Display only tasks with parentTaskIds matching any of the supplied strings.
     * This input will be used only if searchApiMethod input is provided with 'POST' value.
     */
    @Input()
    parentIds: string[] = [];

    /**
     * Filter the tasks. Display only tasks with processInstanceIds matching any of the supplied strings.
     * This input will be used only if searchApiMethod input is provided with 'POST' value.
     */
    @Input()
    processInstanceIds: string[] = [];

    /**
     * Filter the tasks. Display only tasks under processes with provided names.
     * This input will be used only if searchApiMethod input is provided with 'POST' value.
     */
    @Input()
    processNames: string[] = [];

    /**
     * Filter the tasks. Display only tasks with provided priorities.
     * This input will be used only if searchApiMethod input is provided with 'POST' value.
     */
    @Input()
    priorities: string[] = [];

    /**
     * Filter the tasks. Display only tasks completed by users whose usernames are present in the array.
     * This input will be used only if searchApiMethod input is provided with 'POST' value.
     */
    @Input()
    completedByUsers: string[] = [];

    /**
     * Filter the processes. Display only processes with specific process variables.
     * This input will be used only if searchApiMethod input is provided with 'POST' value.
     */
    @Input()
    processVariableFilters: ProcessVariableFilterModel[];

    rows: TaskInstanceCloudListViewModel[] = [];
    dataAdapter: TasksListDatatableAdapter | undefined;

    private isReloadingSubject$ = new BehaviorSubject<boolean>(false);
    isLoading$ = combineLatest([this.isLoadingPreferences$, this.isReloadingSubject$]).pipe(
        map(([isLoadingPreferences, isReloading]) => isLoadingPreferences || isReloading)
    );

    private fetchProcessesTrigger$ = new Subject<void>();

    constructor(
        @Inject(TASK_LIST_CLOUD_TOKEN) public taskListCloudService: TaskListCloudServiceInterface,
        appConfigService: AppConfigService,
        taskCloudService: TaskCloudService,
        userPreferences: UserPreferencesService,
        @Inject(TASK_LIST_PREFERENCES_SERVICE_TOKEN) cloudPreferenceService: PreferenceCloudServiceInterface,
        private viewModelCreator: VariableMapperService
    ) {
        super(appConfigService, taskCloudService, userPreferences, PRESET_KEY, cloudPreferenceService);

        combineLatest([this.isLoadingPreferences$, this.isColumnSchemaCreated$, this.fetchProcessesTrigger$])
            .pipe(
                tap(() => this.isReloadingSubject$.next(true)),
                filter(([isLoadingPreferences, isColumnSchemaCreated]) => !isLoadingPreferences && !!isColumnSchemaCreated),
                switchMap(() => {
                    if (this.searchApiMethod === 'POST') {
                        const requestNode = this.createTaskListRequestNode();
                        return this.taskListCloudService.fetchTaskList(requestNode).pipe(take(1));
                    } else {
                        const requestNode = this.createRequestNode();
                        this.requestNode = requestNode;
                        return this.taskListCloudService.getTaskByRequest(requestNode);
                    }
                }),
                takeUntilDestroyed()
            )
            .subscribe({
                next: (tasks: { list: PaginatedEntries<TaskCloudModel> }) => {
                    const tasksWithVariables = tasks.list.entries.map((task) => ({
                        ...task,
                        variables: task.processVariables
                    }));

                    this.rows = this.viewModelCreator.mapVariablesByColumnTitle(tasksWithVariables, this.columns);

                    this.dataAdapter = new TasksListDatatableAdapter(this.rows, this.columns);

                    this.success.emit(tasks);
                    this.isReloadingSubject$.next(false);
                    this.pagination.next(tasks.list.pagination);
                },
                error: (error) => {
                    console.error(error);
                    this.error.emit(error);
                    this.isReloadingSubject$.next(false);
                }
            });
    }

    reload() {
        this.isReloadingSubject$.next(true);
        this.fetchProcessesTrigger$.next();
    }

    private createTaskListRequestNode(): TaskListRequestModel {
        const requestNode: TaskListRequestModel = {
            appName: this.appName,
            pagination: {
                maxItems: this.size,
                skipCount: this.skipCount
            },
            sorting: this.getTaskListRequestSorting(),
            onlyStandalone: this.standalone,
            name: this.names,
            processDefinitionName: this.processDefinitionNames,
            id: this.ids,
            parentId: this.parentIds,
            processName: this.processNames,
            processInstanceId: this.processInstanceIds,
            priority: this.priorities,
            status: this.statuses,
            completedBy: this.completedByUsers,
            assignee: this.assignees,
            createdFrom: this.createdFrom,
            createdTo: this.createdTo,
            lastModifiedFrom: this.lastModifiedFrom,
            lastModifiedTo: this.lastModifiedTo,
            dueDateFrom: this.dueDateFrom,
            dueDateTo: this.dueDateTo,
            completedFrom: this.completedFrom,
            completedTo: this.completedTo,
            processVariableKeys: this.getRequestNodeVariables(),
            processVariableFilters: this.processVariableFilters ?? []
        };

        return new TaskListRequestModel(requestNode);
    }

    private createRequestNode(): TaskQueryCloudRequestModel {
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
            .filter((column) => column.customData?.columnType === 'process-variable-column' && column.isHidden !== true)
            .map((column) => {
                const variableDefinitionsPayload = column.customData.variableDefinitionsPayload;
                return variableDefinitionsPayload;
            })
            .reduce((allRequestKeys, requestKeys) => [...requestKeys, ...allRequestKeys], []);

        return displayedVariableColumns.length ? displayedVariableColumns : undefined;
    }

    private getTaskListRequestSorting(): TaskListRequestSortingModel {
        if (!this.sorting?.length) {
            return new TaskListRequestSortingModel({
                orderBy: this.defaultSorting.key,
                direction: this.defaultSorting.direction,
                isFieldProcessVariable: false
            });
        }

        const orderBy = this.sorting[0]?.orderBy;
        const direction = this.sorting[0]?.direction;
        const orderByColumn = this.columnList?.columns.find((column) => column.key === orderBy);
        const isFieldProcessVariable = orderByColumn?.customData?.columnType === 'process-variable-column';

        if (isFieldProcessVariable) {
            const processDefinitionKey = orderByColumn.customData.variableDefinitionsPayload[0].split('/')[0];
            const variableName = orderByColumn.customData.variableDefinitionsPayload[0].split('/')[1];
            return new TaskListRequestSortingModel({
                orderBy: variableName,
                direction,
                isFieldProcessVariable: true,
                processVariableData: {
                    processDefinitionKey,
                    type: orderByColumn.customData.variableType
                }
            });
        } else {
            return new TaskListRequestSortingModel({ orderBy, direction, isFieldProcessVariable: false });
        }
    }
}
