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
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ObjectDataTableAdapter, DataTableAdapter, DataRowEvent, ObjectDataRow } from 'ng2-alfresco-datatable';
import { TaskQueryRequestRepresentationModel } from 'ng2-activiti-tasklist';

import { ProcessInstance } from '../models/process-instance.model';
import { ActivitiProcessService } from '../services/activiti-process.service';

@Component({
    moduleId: module.id,
    selector: 'activiti-process-instance-list',
    styleUrls: [ './activiti-processlist.component.css' ],
    templateUrl: './activiti-processlist.component.html'
})
export class ActivitiProcessInstanceListComponent implements OnInit, OnChanges {

    @Input()
    appId: string;

    @Input()
    processDefinitionKey: string;

    @Input()
    state: string;

    @Input()
    sort: string;

    @Input()
    name: string;

    requestNode: TaskQueryRequestRepresentationModel;

    @Input()
    data: DataTableAdapter;

    @Output()
    rowClick: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    onSuccess: EventEmitter<ProcessInstance[]> = new EventEmitter<ProcessInstance[]>();

    @Output()
    onError: EventEmitter<any> = new EventEmitter<any>();

    currentInstanceId: string;

    private defaultSchemaColumn: any[] = [
        {type: 'text', key: 'id', title: 'Id'},
        {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
        {type: 'text', key: 'started', title: 'Started', sortable: true},
        {type: 'text', key: 'startedBy.email', title: 'Started By', sortable: true}
    ];

    constructor(private processService: ActivitiProcessService, private translate: AlfrescoTranslationService) {
        if (translate !== null) {
            translate.addTranslationFolder('node_modules/ng2-activiti-processlist/src');
        }
    }

    ngOnInit() {
        if (!this.data) {
            this.data = this.initDefaultSchemaColumns();
        }
        this.reload();
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
        }
        return changed;
    }

    public reload(emit?: boolean) {
        this.requestNode = this.createRequestNode();
        this.load(this.requestNode, emit);
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

    private load(requestNode: TaskQueryRequestRepresentationModel, emit?: boolean) {
        emit = emit !== false;
        this.processService.getProcessInstances(requestNode)
            .subscribe(
                (response) => {
                    let instancesRow = this.createDataRow(response);
                    this.renderInstances(instancesRow);
                    this.selectFirst();
                    if (emit) {
                        this.onSuccess.emit(response);
                    }
                },
                error => {
                    this.onError.emit(error);
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
                started: row.started
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
     * Select the first instance of a list if present
     */
    selectFirst() {
        if (!this.isListEmpty()) {
            this.currentInstanceId = this.data.getRows()[0].getValue('id');
        } else {
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
     * @param instances
     * @returns {any[]}
     */
    private optimizeNames(instances: any[]) {
        instances = instances.map(t => {
            t.obj.name = t.obj.name || 'No name';
            if (t.obj.name.length > 50) {
                t.obj.name = t.obj.name.substring(0, 50) + '...';
            }
            return t;
        });
        return instances;
    }

    private createRequestNode() {
        let requestNode = {
            appDefinitionId: this.appId,
            processDefinitionKey: this.processDefinitionKey,
            text: this.name,
            state: this.state,
            sort: this.sort
        };
        return new TaskQueryRequestRepresentationModel(requestNode);
    }
}
