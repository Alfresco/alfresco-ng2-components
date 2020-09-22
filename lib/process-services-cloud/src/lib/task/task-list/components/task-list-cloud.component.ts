/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, ViewEncapsulation, OnChanges, Input, SimpleChanges, Output, EventEmitter, ContentChild, AfterContentInit, OnDestroy, OnInit } from '@angular/core';
import {
    AppConfigService, UserPreferencesService,
    DataTableSchema, UserPreferenceValues,
    PaginatedComponent, PaginationModel,
    DataRowEvent, CustomEmptyContentTemplateDirective, DataCellEvent, DataRowActionEvent
} from '@alfresco/adf-core';
import { taskPresetsCloudDefaultModel } from '../models/task-preset-cloud.model';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { TaskQueryCloudRequestModel, ServiceTaskQueryCloudRequestModel } from '../models/filter-cloud-model';
import { TaskListCloudService } from '../services/task-list-cloud.service';
import { TaskListCloudSortingModel } from '../models/task-list-sorting.model';
import { takeUntil } from 'rxjs/operators';
import { TaskType } from '../../task-filters/models/filter-cloud.model';

@Component({
    selector: 'adf-cloud-task-list',
    templateUrl: './task-list-cloud.component.html',
    styleUrls: ['./task-list-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class TaskListCloudComponent extends DataTableSchema implements OnChanges, AfterContentInit, PaginatedComponent, OnDestroy, OnInit {

    static PRESET_KEY = 'adf-cloud-service-task-list.presets';
    static ENTRY_PREFIX = 'entry.';

    @ContentChild(CustomEmptyContentTemplateDirective)
    emptyCustomContent: CustomEmptyContentTemplateDirective;

    /** The name of the application. */
    @Input()
    appName: string = '';

    /**
     * The assignee of the process. Possible values are: "assignee" (the current user is the assignee),
     * "candidate" (the current user is a task candidate", "group_x" (the task is assigned to a group
     * where the current user is a member, no value (the current user is involved).
     */
    @Input()
    assignee: string = '';

    /** Filter the tasks. Display only tasks created on the supplied date. */
    @Input()
    createdDate: string = '';

    /** Filter the tasks. Display only tasks with dueDate equal to the supplied date. */
    @Input()
    dueDate: string = '';

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

    /** Filter the tasks. Display only the tasks that belong to a process in case is false or tasks that doesn't belong to a process in case of true. */
    @Input()
    standalone: boolean = false;

    /**
     * Row selection mode. Can be none, `single` or `multiple`. For `multiple` mode,
     * you can use the Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for
     * multiple rows.
     */
    @Input()
    selectionMode: string = 'single'; // none|single|multiple

    /** Toggles multiple row selection, rendering a checkbox at the beginning of each row. */
    @Input()
    multiselect: boolean = false;

    /** Toggles the sticky header mode. */
    @Input()
    stickyHeader: boolean = false;

    /**
     * Specifies how the table should be sorted. The parameters are for BE sorting.
     */
    @Input()
    sorting: TaskListCloudSortingModel[];

    /** Toggles the data actions column. */
    @Input()
    showActions: boolean = false;

    /** Position of the actions dropdown menu. Can be "left" or "right". */
    @Input()
    actionsPosition: string = 'right'; // left|right

    /** Toggles custom context menu for the component. */
    @Input()
    showContextMenu: boolean = false;

    /** Task type: userTask | serviceTask */
    @Input()
    taskType = TaskType.UserTask;

    /** An object that contains properties used to query the task list */
    @Input()
    queryParams: any = {};

    /** Emitted before the context menu is displayed for a row. */
    @Output()
    showRowContextMenu = new EventEmitter<DataCellEvent>();

    /** Emitted before the actions menu is displayed for a row. */
    @Output()
    showRowActionsMenu = new EventEmitter<DataCellEvent>();

    /** Emitted when the user executes a row action. */
    @Output()
    executeRowAction = new EventEmitter<DataRowActionEvent>();

    /** Emitted when a task in the list is clicked */
    @Output()
    rowClick: EventEmitter<string> = new EventEmitter<string>();

    /** Emitted when rows are selected/unselected */
    @Output()
    rowsSelected: EventEmitter<any[]> = new EventEmitter<any[]>();

    /** Emitted when the task list is loaded */
    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    pagination: BehaviorSubject<PaginationModel>;

    requestNode: TaskQueryCloudRequestModel;
    rows: any[] = [];
    size: number;
    skipCount: number = 0;
    currentInstanceId: any;
    isLoading = true;
    selectedInstances: any[];
    formattedSorting: any[];
    private defaultSorting = { key: 'startDate', direction: 'desc' };

    private onDestroy$ = new Subject<boolean>();

    constructor(private taskListCloudService: TaskListCloudService,
                appConfigService: AppConfigService,
                private userPreferences: UserPreferencesService) {
        super(appConfigService, TaskListCloudComponent.PRESET_KEY, taskPresetsCloudDefaultModel);
        this.size = userPreferences.paginationSize;

        this.pagination = new BehaviorSubject<PaginationModel>(<PaginationModel> {
            maxItems: this.size,
            skipCount: 0,
            totalItems: 0
        });

    }

    ngOnInit() {
        this.userPreferences
            .select(UserPreferenceValues.PaginationSize)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(pageSize => this.size = pageSize);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isPropertyChanged(changes, 'sorting')) {
            this.formatSorting(changes['sorting'].currentValue);
        }
        if (this.isAnyPropertyChanged(changes)) {
            this.reload();
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    ngAfterContentInit() {
        this.createDatatableSchema();
    }

    getCurrentId(): string {
        return this.currentInstanceId;
    }

    private isAnyPropertyChanged(changes: SimpleChanges): boolean {
        for (const property in changes) {
            if (this.isPropertyChanged(changes, property)) {
                return true;
            }
        }
        return false;
    }

    private isPropertyChanged(changes: SimpleChanges, property: string): boolean {
        return changes.hasOwnProperty(property);
    }

    reload() {
        this.requestNode = this.createRequestNode();
        if (this.requestNode.appName || this.requestNode.appName === '') {
            this.load(this.requestNode);
        } else {
            this.rows = [];
        }
    }

    private load(requestNode: TaskQueryCloudRequestModel) {
        this.isLoading = true;
        let taskRequest: Observable<any>;
        if (this.taskType === TaskType.UserTask) {
            taskRequest = this.taskListCloudService.getTaskByRequest(<TaskQueryCloudRequestModel> requestNode);
        } else {
            taskRequest = this.taskListCloudService.getServiceTaskByRequest(<ServiceTaskQueryCloudRequestModel> requestNode);
        }

        taskRequest.subscribe(
            (tasks) => {
                this.rows = tasks.list.entries;
                this.success.emit(tasks);
                this.isLoading = false;
                this.pagination.next(tasks.list.pagination);
            }, (error) => {
                this.error.emit(error);
                this.isLoading = false;
            });
    }

    isListEmpty(): boolean {
        return !this.rows || this.rows.length === 0;
    }

    /**
     * Resets the pagination values
     */
    resetPagination() {
        this.skipCount = 0;
        this.size = this.userPreferences.paginationSize;
        this.pagination.next({
            skipCount: 0,
            maxItems: this.size
        });
    }

    /**
     * Resets the pagination values and
     * Reloads the task list
     * @param pagination Pagination values to be set
     */
    updatePagination(pagination: PaginationModel) {
        this.size = pagination.maxItems;
        this.skipCount = pagination.skipCount;
        this.pagination.next(pagination);
        this.reload();
    }

    onSortingChanged(event: CustomEvent) {
        this.setSorting(event.detail);
        this.formatSorting(this.sorting);
        this.reload();
    }

    onRowClick(item: DataRowEvent) {
        this.currentInstanceId = item.value.getValue('entry.id');
        this.rowClick.emit(this.currentInstanceId);
    }

    onRowSelect(event: CustomEvent) {
        this.selectedInstances = [...event.detail.selection];
        this.rowsSelected.emit(this.selectedInstances);
    }

    onRowUnselect(event: CustomEvent) {
        this.selectedInstances = [...event.detail.selection];
        this.rowsSelected.emit(this.selectedInstances);
    }

    onRowKeyUp(event: CustomEvent) {
        if (event.detail.keyboardEvent.key === 'Enter') {
            event.preventDefault();
            this.currentInstanceId = event.detail.row.getValue('entry.id');
            this.rowClick.emit(this.currentInstanceId);
        }
    }

    onShowRowActionsMenu(event: DataCellEvent) {
        this.showRowActionsMenu.emit(event);
    }

    onShowRowContextMenu(event: DataCellEvent) {
        this.showRowContextMenu.emit(event);
    }

    onExecuteRowAction(row: DataRowActionEvent) {
        this.executeRowAction.emit(row);
    }

    private createRequestNode() {
        if (this.taskType === TaskType.UserTask) {
            return this.createUserTaskRequest();
        } else {
           return this.createServiceTaskRequest();
        }
    }

    createUserTaskRequest() {
        const requestNode = {
            appName: this.appName,
            assignee: this.assignee,
            id: this.id,
            name: this.name,
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
            maxItems: this.size,
            skipCount: this.skipCount,
            sorting: this.sorting,
            standalone: this.standalone
        };
        return new TaskQueryCloudRequestModel(requestNode);
    }

    createServiceTaskRequest() {
        const requestNode = {
            appName: this.appName,
            activityName: this.queryParams.activityName,
            activityType: this.queryParams.activityType,
            completedDate: this.queryParams.completedDate,
            elementId: this.queryParams.elementId,
            executionId: this.queryParams.executionId,
            processDefinitionId: this.queryParams.processDefinitionId,
            processDefinitionKey: this.queryParams.processDefinitionKey,
            processDefinitionVersion: this.queryParams.processDefinitionVersion,
            processInstanceId: this.queryParams.processInstanceId,
            serviceFullName: this.queryParams.serviceFullName,
            serviceName: this.queryParams.serviceName,
            serviceVersion: this.queryParams.serviceVersion,
            startedDate: this.queryParams.startedDate,
            status: this.queryParams.status,
            maxItems: this.size,
            skipCount: this.skipCount,
            sorting: this.sorting
        };
        return new ServiceTaskQueryCloudRequestModel(requestNode);
    }

    setSorting(sortDetail) {
        const sorting = sortDetail ? {
            orderBy: sortDetail.key.replace(TaskListCloudComponent.ENTRY_PREFIX, ''),
            direction: sortDetail.direction.toUpperCase()
        } : { ... this.defaultSorting };
        this.sorting = [new TaskListCloudSortingModel(sorting)];
    }

    formatSorting(sorting: TaskListCloudSortingModel[]) {
        this.formattedSorting = this.isValidSorting(sorting) ? [
            TaskListCloudComponent.ENTRY_PREFIX + sorting[0].orderBy,
            sorting[0].direction.toLocaleLowerCase()
        ] : null;
    }

    isValidSorting(sorting: TaskListCloudSortingModel[]) {
        return sorting.length && sorting[0].orderBy && sorting[0].direction;
    }
}
