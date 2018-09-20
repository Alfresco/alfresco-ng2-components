/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { DataRowEvent, DataTableAdapter, DataTableSchema, EmptyCustomContentDirective } from '@alfresco/adf-core';
import {
    AppConfigService, PaginationComponent, PaginatedComponent,
    UserPreferencesService, UserPreferenceValues, PaginationModel } from '@alfresco/adf-core';
import {
    AfterContentInit, Component, ContentChild, EventEmitter,
    Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { TaskQueryRequestRepresentationModel } from '../models/filter.model';
import { TaskListModel } from '../models/task-list.model';
import { taskPresetsDefaultModel } from '../models/task-preset.model';
import { TaskListService } from './../services/tasklist.service';
import moment from 'moment-es6';

@Component({
    selector: 'adf-tasklist',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.css']
})
export class TaskListComponent extends DataTableSchema implements OnChanges, AfterContentInit, PaginatedComponent {

    static PRESET_KEY = 'adf-task-list.presets';

    @ContentChild(EmptyCustomContentDirective) emptyCustomContent: EmptyCustomContentDirective;

    requestNode: TaskQueryRequestRepresentationModel;

    /** The id of the app. */
    @Input()
    appId: number;

    /** The Instance Id of the process. */
    @Input()
    processInstanceId: string;

    /** The Definition Id of the process. */
    @Input()
    processDefinitionId: string;

    /** Current state of the process. Possible values are: `completed`, `active`. */
    @Input()
    state: string;

    /** The assignment of the process. Possible values are: "assignee" (the current user
     * is the assignee), candidate (the current user is a task candidate", "group_x" (the task
     * is assigned to a group where the current user is a member,
     * no value(the current user is involved).
     */
    @Input()
    assignment: string;

    /** Define the sort order of the tasks. Possible values are : `created-desc`,
     * `created-asc`, `due-desc`, `due-asc`
     */
    @Input()
    sort: string;

    /** Name of the tasklist. */
    @Input()
    name: string;

    /** Define which task id should be selected after reloading. If the task id doesn't
     * exist or nothing is passed then the first task will be selected.
     */
    @Input()
    landingTaskId: string;

    /** Row selection mode. Can be none, `single` or `multiple`. For `multiple` mode,
     * you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for
     * multiple rows.
     */
    @Input()
    selectionMode: string = 'single'; // none|single|multiple

    /** Toggles multiple row selection, renders checkboxes at the beginning of each row */
    @Input()
    multiselect: boolean = false;

    /** Toggles default selection of the first row */
    @Input()
    selectFirstRow: boolean = true;

    /** The id of a task */
    @Input()
    taskId: string;

    /** Toggles inclusion of Process Instances */
    @Input()
    includeProcessInstance: boolean;

    /** Starting point of the */
    @Input()
    start: number = 0;

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

    currentInstanceId: string;
    selectedInstances: any[];
    pagination: BehaviorSubject<PaginationModel>;

    /** The page number of the tasks to fetch. */
    @Input()
    page: number = 0;

    /** The number of tasks to fetch. Default value: 25. */
    @Input()
    size: number = PaginationComponent.DEFAULT_PAGINATION.maxItems;

    /** Filter the tasks. Display only tasks with created_date after dueAfter. */
    @Input()
    dueAfter: string;

    /** Filter the tasks. Display only tasks with created_date before dueBefore. */
    @Input()
    dueBefore: string;

    rows: any[] = [];
    isLoading: boolean = true;
    sorting: any[] = ['created', 'desc'];

    /**
     * Toggles custom data source mode.
     * When enabled the component reloads data from it's current source instead of the server side.
     * This allows generating and displaying custom data sets (i.e. filtered out content).
     *
     * @memberOf TaskListComponent
     */
    hasCustomDataSource: boolean = false;

    constructor(private taskListService: TaskListService,
                appConfigService: AppConfigService,
                private userPreferences: UserPreferencesService) {
        super(appConfigService, TaskListComponent.PRESET_KEY, taskPresetsDefaultModel);
        this.userPreferences.select(UserPreferenceValues.PaginationSize).subscribe((pageSize) => {
            this.size = pageSize;
        });

        this.pagination = new BehaviorSubject<PaginationModel>(<PaginationModel> {
            maxItems: this.size,
            skipCount: 0,
            totalItems: 0
        });
    }

    ngAfterContentInit() {
        this.createDatatableSchema();
        if (this.data && this.data.getColumns().length === 0) {
            this.data.setColumns(this.columns);
        }

        if (this.appId) {
            this.reload();
        }
    }

    setCustomDataSource(rows: any[]): void {
        if (rows) {
            this.rows = rows;
            this.hasCustomDataSource = true;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isPropertyChanged(changes)) {
            if (this.isSortChanged(changes)) {
                this.sorting = this.sort ? this.sort.split('-') : this.sorting;
            }
            this.reload();
        }
    }

    private isSortChanged(changes: SimpleChanges): boolean {
        const actualSort = changes['sort'];
        return actualSort && actualSort.currentValue && actualSort.currentValue !== actualSort.previousValue;
    }

    private isPropertyChanged(changes: SimpleChanges): boolean {
        let changed: boolean = true;

        let landingTaskId = changes['landingTaskId'];
        let page = changes['page'];
        let size = changes['size'];
        if (landingTaskId && landingTaskId.currentValue && this.isEqualToCurrentId(landingTaskId.currentValue)) {
            changed = false;
        } else if (page && page.currentValue !== page.previousValue) {
            changed = true;
        } else if (size && size.currentValue !== size.previousValue) {
            changed = true;
        }

        return changed;
    }

    reload(): void {
        if (!this.hasCustomDataSource) {
            this.requestNode = this.createRequestNode();
            this.load(this.requestNode);
        } else {
            this.isLoading = false;
        }
    }

    private load(requestNode: TaskQueryRequestRepresentationModel) {
        this.isLoading = true;
        this.loadTasksByState().subscribe(
            (tasks) => {
                this.rows = this.optimizeNames(tasks.data);
                this.selectTask(this.landingTaskId);
                this.success.emit(tasks);
                this.isLoading = false;
                this.pagination.next({
                    count: tasks.data.length,
                    maxItems: this.size,
                    skipCount: this.page * this.size,
                    totalItems: tasks.total
                });
            }, (error) => {
                this.error.emit(error);
                this.isLoading = false;
            });
    }

    private loadTasksByState(): Observable<TaskListModel> {
        return this.requestNode.state === 'all'
            ? this.taskListService.findAllTasksWithoutState(this.requestNode)
            : this.taskListService.findTasksByState(this.requestNode);
    }

    /**
     * Select the task given in input if present
     */
    selectTask(taskIdSelected: string): void {
        if (!this.isListEmpty()) {
            let dataRow = null;
            if (taskIdSelected) {
                dataRow = this.rows.find((currentRow: any) => {
                    return currentRow['id'] === taskIdSelected;
                });
            }
            if (!dataRow && this.selectFirstRow) {
                dataRow = this.rows[0];
            }
            if (dataRow) {
                dataRow.isSelected = true;
                this.currentInstanceId = dataRow['id'];
            }
        } else {
            this.currentInstanceId = null;
        }
    }

    /**
     * Return the current id
     */
    getCurrentId(): string {
        return this.currentInstanceId;
    }

    /**
     * Check if the taskId is the same of the selected task
     * @param taskId
     */
    isEqualToCurrentId(taskId: string): boolean {
        return this.currentInstanceId === taskId;
    }

    /**
     * Check if the list is empty
     */
    isListEmpty(): boolean {
        return !this.rows || this.rows.length === 0;
    }

    onRowClick(item: DataRowEvent) {
        this.currentInstanceId = item.value.getValue('id');
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
            this.currentInstanceId = event.detail.row.getValue('id');
            this.rowClick.emit(this.currentInstanceId);
        }
    }

    /**
     * Optimize name field
     * @param instances
     */
    private optimizeNames(instances: any[]): any[] {
        instances = instances.map(t => {
            if (!t.name) {
                t.name = 'No name';
            }
            return t;
        });
        return instances;
    }

    private createRequestNode() {

        let requestNode = {
            appDefinitionId: this.appId,
            dueAfter: this.dueAfter ? moment(this.dueAfter).toDate() : null,
            dueBefore: this.dueBefore ? moment(this.dueBefore).toDate() : null,
            processInstanceId: this.processInstanceId,
            processDefinitionId: this.processDefinitionId,
            processDefinitionKey: this.processDefinitionKey,
            text: this.name,
            assignment: this.assignment,
            state: this.state,
            sort: this.sort,
            page: this.page,
            size: this.size,
            start: this.start,
            taskId: this.taskId,
            includeProcessInstance: this.includeProcessInstance
        };
        return new TaskQueryRequestRepresentationModel(requestNode);
    }

    updatePagination(params: PaginationModel) {
        const needsReload = params.maxItems || params.skipCount;
        this.size = params.maxItems;
        this.page = this.currentPage(params.skipCount, params.maxItems);
        if (needsReload) {
            this.reload();
        }
    }

    currentPage(skipCount: number, maxItems: number): number {
        return (skipCount && maxItems) ? Math.floor(skipCount / maxItems) : 0;
    }
}
