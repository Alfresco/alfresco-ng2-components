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

import { DataColumn, DataRowEvent, DataTableAdapter, ObjectDataColumn,
    ObjectDataRow, ObjectDataTableAdapter, EmptyCustomContentDirective } from '@alfresco/adf-core';
import {
    AppConfigService, DataColumnListComponent, PaginationComponent, PaginatedComponent,
    UserPreferencesService, UserPreferenceValues, PaginationModel } from '@alfresco/adf-core';
import {
    AfterContentInit, Component, ContentChild, EventEmitter,
    Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TaskQueryRequestRepresentationModel } from '../models/filter.model';
import { TaskListModel } from '../models/task-list.model';
import { taskPresetsDefaultModel } from '../models/task-preset.model';
import { TaskListService } from './../services/tasklist.service';

@Component({
    selector: 'adf-tasklist',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.css']
})
export class TaskListComponent extends DataColumnSchemaAssembler implements OnChanges, AfterContentInit, PaginatedComponent {

    requestNode: TaskQueryRequestRepresentationModel;

    @ContentChild(DataColumnListComponent) columnList: DataColumnListComponent;
    @ContentChild(EmptyCustomContentDirective) emptyCustomContent: EmptyCustomContentDirective;

    /** The id of the app. */
    @Input()
    appId: number;

    /** The Instance Id of the process. */
    @Input()
    processInstanceId: string;

    /** The Definition Key of the process.
     * @deprecated 2.4.0
     */
    @Input()
    processDefinitionKey: string;

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

    /** Define the sort order of the processes. Possible values are : `created-desc`,
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

    /** Data source object that represents the number and the type of the columns that
     * you want to show.
     */
    @Input()
    data: DataTableAdapter;

    /** Row selection mode. Can be none, `single` or `multiple`. For `multiple` mode,
     * you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for
     * multiple rows.
     */
    @Input()
    selectionMode: string = 'single'; // none|single|multiple

    /** Custom preset column schema in JSON format. */
    @Input()
    presetColumn: string;

    /** Toggles multiple row selection, renders checkboxes at the beginning of each row */
    @Input()
    multiselect: boolean = false;

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
    taskListPresetKey = 'adf-task-list.presets';
    pagination: BehaviorSubject<PaginationModel>;

    /** The page number of the tasks to fetch. */
    @Input()
    page: number = 0;

    /** The number of tasks to fetch. Default value: 25. */
    @Input()
    size: number = PaginationComponent.DEFAULT_PAGINATION.maxItems;

    isLoading: boolean = true;

    /**
     * Toggles custom data source mode.
     * When enabled the component reloads data from it's current source instead of the server side.
     * This allows generating and displaying custom data sets (i.e. filtered out content).
     *
     * @memberOf TaskListComponent
     */
    hasCustomDataSource: boolean = false;

    constructor(private taskListService: TaskListService,
                private appConfigService: AppConfigService,
                private userPreferences: UserPreferencesService) {
        super();
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
        this.loadLayoutPresets(this.taskListPresetKey);
        this.setupSchema();
        if (this.appId) {
            this.reload();
        }
    }

    /**
     * Setup html-based (html definitions) or code behind (data adapter) schema.
     * If component is assigned with an empty data adater the default schema settings applied.
     */
    setupSchema(): void {
        let schema = this.getSchema();
        if (!this.data) {
            this.data = new ObjectDataTableAdapter([], schema);
        } else if (this.data.getColumns().length === 0) {
            this.data.setColumns(schema);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isPropertyChanged(changes)) {
            this.reload();
        }
    }

    setCustomDataSource(rows: ObjectDataRow[]): void {
        if (this.data) {
            this.data.setRows(rows);
            this.hasCustomDataSource = true;
        }
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
        }
    }

    private load(requestNode: TaskQueryRequestRepresentationModel) {
        this.isLoading = true;
        this.loadTasksByState().subscribe(
            (tasks) => {
                let instancesRow = this.createDataRow(tasks.data);
                this.renderInstances(instancesRow);
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
     * Create an array of ObjectDataRow
     * @param instances
     */
    private createDataRow(instances: any[]): ObjectDataRow[] {
        let instancesRows: ObjectDataRow[] = [];
        instances.forEach((row) => {
            instancesRows.push(new ObjectDataRow(row));
        });
        return instancesRows;
    }

    /**
     * Render the instances list
     *
     * @param instances
     */
    private renderInstances(instances: any[]) {
        instances = this.optimizeNames(instances);
        this.data.setRows(instances);
    }

    /**
     * Select the task given in input if present
     */
    selectTask(taskIdSelected: string): void {
        if (!this.isListEmpty()) {
            let rows = this.data.getRows();
            if (rows.length > 0) {
                let dataRow;
                if (taskIdSelected) {
                    dataRow = rows.find((currentRow: any) => {
                        return currentRow.getValue('id') === taskIdSelected;
                    });

                    if (!dataRow) {
                        dataRow = rows[0];
                    }
                } else {
                    dataRow = rows[0];
                }

                this.data.selectedRow = dataRow;
                dataRow.isSelected = true;
                this.currentInstanceId = dataRow.getValue('id');
            }
        } else {
            if (this.data) {
                this.data.selectedRow = null;
            }

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
        return this.currentInstanceId === taskId ? true : false;
    }

    /**
     * Check if the list is empty
     */
    isListEmpty(): boolean {
        return this.data === undefined ||
            (this.data && this.data.getRows() && this.data.getRows().length === 0);
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
     * @param istances
     */
    private optimizeNames(istances: any[]): any[] {
        istances = istances.map(t => {
            t.obj.name = t.obj.name || 'No name';
            return t;
        });
        return istances;
    }

    private createRequestNode() {

        let requestNode = {
            appDefinitionId: this.appId,
            processInstanceId: this.processInstanceId,
            processDefinitionKey: this.processDefinitionKey,
            text: this.name,
            assignment: this.assignment,
            state: this.state,
            sort: this.sort,
            landingTaskId: this.landingTaskId,
            page: this.page,
            size: this.size,
            start: 0
        };
        return new TaskQueryRequestRepresentationModel(requestNode);
    }

    getAppConfigService(): AppConfigService {
        return this.appConfigService;
    }

    getColumnList(): DataColumnListComponent {
        return this.columnList;
    }

    getPresetColoumn(): string {
        return this.presetColumn;
    }

    getPresetsModel() {
        return taskPresetsDefaultModel;
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

    get supportedPageSizes(): number[] {
        return this.userPreferences.getDefaultPageSizes();
    }
}
