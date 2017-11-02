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

import { AfterContentInit, Component, ContentChild, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AppConfigService, DataColumnListComponent } from 'ng2-alfresco-core';
import { DataColumn, DataRowEvent, DataTableAdapter, ObjectDataRow, ObjectDataTableAdapter, ObjectDataColumn } from 'ng2-alfresco-datatable';
import { Observable } from 'rxjs/Rx';
import { TaskQueryRequestRepresentationModel } from '../models/filter.model';
import { TaskListModel } from '../models/task-list.model';
import { taskPresetsDefaultModel } from '../models/task-preset.model';
import { TaskListService } from './../services/tasklist.service';

const DEFAULT_SIZE = 5;
@Component({
    selector: 'adf-tasklist',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnChanges, OnInit, AfterContentInit {

    requestNode: TaskQueryRequestRepresentationModel;

    @ContentChild(DataColumnListComponent) columnList: DataColumnListComponent;

    @Input()
    appId: number;

    @Input()
    processInstanceId: string;

    @Input()
    processDefinitionKey: string;

    @Input()
    state: string;

    @Input()
    assignment: string;

    @Input()
    sort: string;

    @Input()
    name: string;

    @Input()
    landingTaskId: string;

    @Input()
    data: DataTableAdapter;

    @Input()
    selectionMode: string = 'none'; // none|single|multiple

    @Input()
    presetColumn: string;

    @Input()
    multiselect: boolean = false;

    @Output()
    rowClick: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    rowsSelected: EventEmitter<any[]> = new EventEmitter<any[]>();

    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    currentInstanceId: string;
    selectedInstances: any[];
    private layoutPresets = {};

    @Input()
    page: number = 0;

    @Input()
    size: number = DEFAULT_SIZE;

    isLoading: boolean = true;

    /**
     * Toggles custom data source mode.
     * When enabled the component reloads data from it's current source instead of the server side.
     * This allows generating and displaying custom data sets (i.e. filtered out content).
     *
     * @type {boolean}
     * @memberOf TaskListComponent
     */
    hasCustomDataSource: boolean = false;
    isStreamLoaded = false;

    constructor(private taskListService: TaskListService,
                private appConfig: AppConfigService) {
    }

    initStream() {
        if (!this.isStreamLoaded) {
            this.isStreamLoaded = true;
            this.taskListService.tasksList$.subscribe(
                (tasks) => {
                    let instancesRow = this.createDataRow(tasks.data);
                    this.renderInstances(instancesRow);
                    this.selectTask(this.landingTaskId);
                    this.success.emit(tasks);
                    this.isLoading = false;
                }, (error) => {
                    this.error.emit(error);
                    this.isLoading = false;
                });
        }
    }

    ngOnInit() {
        if (this.data === undefined) {
            this.data = new ObjectDataTableAdapter();
        }
        this.initStream();
    }

    ngAfterContentInit() {
        this.setupSchema();
    }

    /**
     * Setup html-based (html definitions) or code behind (data adapter) schema.
     * If component is assigned with an empty data adater the default schema settings applied.
     */
    setupSchema(): void {
        let schema: DataColumn[] = [];

        if (this.columnList && this.columnList.columns && this.columnList.columns.length > 0) {
            schema = this.columnList.columns.map(c => <DataColumn> c);
        }

        if (!this.data) {
            this.data = new ObjectDataTableAdapter([], schema.length > 0 ? schema :  this.presetColumn  ? this.getLayoutPreset(this.presetColumn) : this.getLayoutPreset());

        } else {
            if (schema && schema.length > 0) {
                this.data.setColumns(schema);
            } else if (this.data.getColumns().length === 0) {
                this.presetColumn ? this.setupDefaultColumns(this.presetColumn) : this.setupDefaultColumns();
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initStream();
        if (this.isPropertyChanged(changes)) {
            this.reload();
            this.loadLayoutPresets();
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
        if (landingTaskId && landingTaskId.currentValue && this.isEqualToCurrentId(landingTaskId.currentValue)) {
            changed = false;
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
        this.loadTasksByState().subscribe();
    }

    private loadTasksByState(): Observable<TaskListModel> {
        return this.requestNode.state === 'all'
               ? this.taskListService.findAllTasksWhitoutState(this.requestNode)
               : this.taskListService.findTasksByState(this.requestNode);
    }

    /**
     * Create an array of ObjectDataRow
     * @param instances
     * @returns {ObjectDataRow[]}
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
    selectTask(taskIdToSelect: string): void {
        if (!this.isListEmpty()) {
            let rows = this.data.getRows();
            if (rows.length > 0) {
                let dataRow = rows.find(row => row.getValue('id') === taskIdToSelect) || rows[0];
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
     * @returns {string}
     */
    getCurrentId(): string {
        return this.currentInstanceId;
    }

    /**
     * Check if the taskId is the same of the selected task
     * @param taskId
     * @returns {boolean}
     */
    isEqualToCurrentId(taskId: string) {
        return this.currentInstanceId === taskId ? true : false;
    }

    /**
     * Check if the list is empty
     * @returns {ObjectDataTableAdapter|boolean}
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
     * @returns {any[]}
     */
    private optimizeNames(istances: any[]) {
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

    setupDefaultColumns(preset: string = 'default'): void {
        if (this.data) {
            const columns = this.getLayoutPreset(preset);
            this.data.setColumns(columns);
        }
    }

    private loadLayoutPresets(): void {
        const externalSettings = this.appConfig.get('adf-task-list.presets', null);

        if (externalSettings) {
            this.layoutPresets = Object.assign({}, taskPresetsDefaultModel, externalSettings);
        } else {
            this.layoutPresets = taskPresetsDefaultModel;
        }

    }

    private getLayoutPreset(name: string = 'default'): DataColumn[] {
        return (this.layoutPresets[name] || this.layoutPresets['default']).map(col => new ObjectDataColumn(col));
    }
}
