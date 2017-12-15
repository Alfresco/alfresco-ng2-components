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

import { DataColumn, DataRowEvent, DataTableAdapter, ObjectDataColumn, ObjectDataRow, ObjectDataTableAdapter } from '@alfresco/adf-core';
import { AppConfigService, DataColumnListComponent } from '@alfresco/adf-core';
import { AfterContentInit, Component, ContentChild, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
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
    selectionMode: string = 'single'; // none|single|multiple

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
    layoutPresets = {};

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
        this.loadLayoutPresets();
        this.setupSchema();
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
        this.initStream();
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
               ? this.taskListService.findAllTasksWithoutState(this.requestNode)
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

    private loadLayoutPresets(): void {
        const externalSettings = this.appConfig.get('adf-task-list.presets', null);

        if (externalSettings) {
            this.layoutPresets = Object.assign({}, taskPresetsDefaultModel, externalSettings);
        } else {
            this.layoutPresets = taskPresetsDefaultModel;
        }
    }

    getSchema(): any {
        let customSchemaColumns = [];
        customSchemaColumns = _.concat(customSchemaColumns, this.getSchemaFromConfig(this.presetColumn));
        customSchemaColumns = _.concat(customSchemaColumns, this.getSchemaFromHtml());
        if (customSchemaColumns.length === 0) {
            customSchemaColumns = this.getDefaultLayoutPreset();
        }
        return customSchemaColumns;
    }

    getSchemaFromHtml(): any {
        let schema = [];
        if (this.columnList && this.columnList.columns && this.columnList.columns.length > 0) {
            schema = this.columnList.columns.map(c => <DataColumn> c);
        }
        return schema;
    }

    private getSchemaFromConfig(name: string): DataColumn[] {
        return name ? (this.layoutPresets[name]).map(col => new ObjectDataColumn(col)) : [];
    }

    private getDefaultLayoutPreset(): DataColumn[] {
        return (this.layoutPresets['default']).map(col => new ObjectDataColumn(col));
    }
}
