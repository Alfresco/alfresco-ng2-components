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

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AlfrescoTranslateService, LogService } from 'ng2-alfresco-core';
import { ObjectDataTableAdapter, DataTableAdapter, DataRowEvent, ObjectDataRow } from 'ng2-alfresco-datatable';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';
import { TaskQueryRequestRepresentationModel } from '../models/filter.model';

declare let componentHandler: any;

@Component({
    selector: 'activiti-tasklist',
    moduleId: module.id,
    templateUrl: './activiti-tasklist.component.html',
    styleUrls: ['./activiti-tasklist.component.css']
})
export class ActivitiTaskList implements OnInit, OnChanges {

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

    requestNode: TaskQueryRequestRepresentationModel;

    @Input()
    data: DataTableAdapter;

    @Output()
    rowClick: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    onSuccess: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onError: EventEmitter<any> = new EventEmitter<any>();

    currentInstanceId: string;

    private defaultSchemaColumn: any[] = [
        {type: 'text', key: 'id', title: 'Id'},
        {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
        {type: 'text', key: 'formKey', title: 'Form Key', sortable: true},
        {type: 'text', key: 'created', title: 'Created', sortable: true}
    ];

    constructor(private translateService: AlfrescoTranslateService,
                private taskListService: ActivitiTaskListService,
                private logService: LogService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'node_modules/ng2-activiti-tasklist/src');
        }
    }

    ngOnInit() {
        if (!this.data) {
            this.data = this.initDefaultSchemaColumns();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isPropertyChanged(changes)) {
            this.reload();
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
        }
        return changed;
    }

    public reload() {
        this.requestNode = this.createRequestNode();
        this.load(this.requestNode);
    }

    /**
     * Return an initDefaultSchemaColumns instance with the default Schema Column
     * @returns {ObjectDataTableAdapter}
     */
    initDefaultSchemaColumns(): ObjectDataTableAdapter {
        return new ObjectDataTableAdapter(
            [],
            this.defaultSchemaColumn
        );
    }

    private load(requestNode: TaskQueryRequestRepresentationModel) {
        this.taskListService.getTotalTasks(requestNode).subscribe(
            (res) => {
                requestNode.size = res.total;
                this.taskListService.getTasks(requestNode).subscribe(
                    (response) => {
                        let instancesRow = this.createDataRow(response);
                        this.renderInstances(instancesRow);
                        this.selectTask(requestNode.landingTaskId);
                        this.onSuccess.emit(response);
                    }, (error) => {
                        this.logService.error(error);
                        this.onError.emit(error);
                    });
            }, (err) => {
                this.logService.error(err);
                this.onError.emit(err);
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
            instancesRows.push(new ObjectDataRow({
                id: row.id,
                name: row.name,
                created: row.created
            }));
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
    selectTask(taskIdToSelect: string) {
        if (!this.isListEmpty()) {
            let rows = this.data.getRows();
            if (rows.length > 0) {
                let dataRow = rows.find(row => row.getValue('id') ===  taskIdToSelect) || rows[0];
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
