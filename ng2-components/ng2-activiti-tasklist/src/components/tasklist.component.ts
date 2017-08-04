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

import {
    AfterContentInit,
    Component,
    ContentChild,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';
import { AlfrescoTranslationService, DataColumnListComponent } from 'ng2-alfresco-core';
import {
    DataColumn,
    DataRowEvent,
    DataTableAdapter,
    ObjectDataRow,
    ObjectDataTableAdapter
} from 'ng2-alfresco-datatable';
import { TaskQueryRequestRepresentationModel } from '../models/filter.model';
import { TaskListService } from './../services/tasklist.service';

@Component({
    selector: 'adf-tasklist, activiti-tasklist',
    templateUrl: './tasklist.component.html',
    styleUrls: ['./tasklist.component.css']
})
export class TaskListComponent implements OnChanges, AfterContentInit {

    requestNode: TaskQueryRequestRepresentationModel;

    @ContentChild(DataColumnListComponent) columnList: DataColumnListComponent;

    @Input()
    appId: string;

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

    @Output()
    rowClick: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    onSuccess: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onError: EventEmitter<any> = new EventEmitter<any>();

    currentInstanceId: string;

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

    private defaultSchemaColumn: DataColumn[] = [
        { type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true },
        { type: 'text', key: 'created', title: 'Created', cssClass: 'hidden', sortable: true }
    ];

    constructor(translateService: AlfrescoTranslationService,
                private taskListService: TaskListService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'assets/ng2-activiti-tasklist');
        }
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
            this.data = new ObjectDataTableAdapter([], schema.length > 0 ? schema : this.defaultSchemaColumn);
        } else {
            if (schema && schema.length > 0) {
                this.data.setColumns(schema);
            } else if (this.data.getColumns().length === 0) {
                this.data.setColumns(this.defaultSchemaColumn);
            }
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
        let changed: boolean = false;

        let appId = changes['appId'];
        let processDefinitionKey = changes['processDefinitionKey'];
        let state = changes['state'];
        let sort = changes['sort'];
        let name = changes['name'];
        let assignment = changes['assignment'];
        let landingTaskId = changes['landingTaskId'];
        if (appId && appId.currentValue) {
            changed = true;
        } else if (processDefinitionKey && processDefinitionKey.currentValue) {
            changed = true;
        } else if (state && state.currentValue) {
            changed = true;
        } else if (sort && sort.currentValue) {
            changed = true;
        } else if (name && name.currentValue) {
            changed = true;
        } else if (assignment && assignment.currentValue) {
            changed = true;
        } else if (landingTaskId && landingTaskId.currentValue && !this.isEqualToCurrentId(landingTaskId.currentValue)) {
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
        this.taskListService.getTotalTasks(requestNode).subscribe(
            (res) => {
                requestNode.size = res.total;
                this.taskListService.getTasks(requestNode).subscribe(
                    (response) => {
                        let instancesRow = this.createDataRow(response);
                        this.renderInstances(instancesRow);
                        this.selectTask(requestNode.landingTaskId);
                        this.onSuccess.emit(response);
                        this.isLoading = false;
                    }, (error) => {
                        this.onError.emit(error);
                        this.isLoading = false;
                    });
            }, (err) => {
                this.onError.emit(err);
                this.isLoading = false;
            });
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

    /**
     * Emit the event rowClick passing the current task id when the row is clicked
     * @param event
     */
    onRowClick(event: DataRowEvent) {
        let item = event;
        this.currentInstanceId = item.value.getValue('id');
        this.rowClick.emit(this.currentInstanceId);
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
            processDefinitionKey: this.processDefinitionKey,
            text: this.name,
            assignment: this.assignment,
            state: this.state,
            sort: this.sort,
            landingTaskId: this.landingTaskId
        };
        return new TaskQueryRequestRepresentationModel(requestNode);
    }
}
