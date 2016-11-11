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

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ObjectDataTableAdapter, DataRowEvent, DataTableAdapter, ObjectDataRow } from 'ng2-alfresco-datatable';
import { TaskQueryRequestRepresentationModel, FilterRepresentationModel } from 'ng2-activiti-tasklist';
import { ActivitiProcessService } from '../services/activiti-process.service';

@Component({
    moduleId: module.id,
    selector: 'activiti-process-instance-list',
    styleUrls: [ './activiti-processlist.component.css' ],
    templateUrl: './activiti-processlist.component.html'
})
export class ActivitiProcessInstanceListComponent implements OnInit, OnChanges {

    @Input()
    filter: FilterRepresentationModel;

    @Input()
    data: DataTableAdapter;

    @Output()
    rowClick: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    onSuccess: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onError: EventEmitter<any> = new EventEmitter<any>();

    errorMessage: string;
    currentProcessInstanceId: string;

    private defaultSchemaColumn: any[] = [
        {type: 'text', key: 'id', title: 'Id', sortable: true},
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
        let filter = changes['filter'];
        if (filter && filter.currentValue) {
            let requestNode = this.convertProcessInstanceToTaskQuery(filter.currentValue);
            this.load(requestNode);
            return;
        }
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

    load(requestNode: TaskQueryRequestRepresentationModel) {
        this.processService.getProcessInstances(requestNode)
            .subscribe(
                (processInstances) => {
                    let processRow = this.createDataRow(processInstances);
                    this.renderProcessInstances(processRow);
                    this.selectFirstProcess();
                    this.onSuccess.emit(processInstances);
                },
                error => {
                    this.errorMessage = <any>error;
                    this.onError.emit(error);
                });
    }

    /**
     * Create an array of ObjectDataRow
     * @param processes
     * @returns {ObjectDataRow[]}
     */
    private createDataRow(processes: any[]): ObjectDataRow[] {
        let processRows: ObjectDataRow[] = [];
        processes.forEach((row) => {
            processRows.push(new ObjectDataRow({
                id: row.id,
                name: row.name,
                started: row.started
            }));
        });
        return processRows;
    }

    /**
     * Render the process list
     *
     * @param processInstances
     */
    private renderProcessInstances(processInstances: any[]) {
        processInstances = this.optimizeProcessNames(processInstances);
        this.data.setRows(processInstances);
    }

    /**
     * Select the first process of a process list if present
     */
    private selectFirstProcess() {
        if (!this.isListEmpty()) {
            this.currentProcessInstanceId = this.data.getRows()[0].getValue('id');
        } else {
            this.currentProcessInstanceId = null;
        }
    }

    /**
     * Return the current process
     * @returns {string}
     */
    getCurrentProcessId(): string {
        return this.currentProcessInstanceId;
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
        this.currentProcessInstanceId = item.value.getValue('id');
        this.rowClick.emit(this.currentProcessInstanceId);
    }

    /**
     * Optimize process name field
     * @param tasks
     * @returns {any[]}
     */
    private optimizeProcessNames(tasks: any[]) {
        tasks = tasks.map(t => {
            t.obj.name = t.obj.name || 'No name';
            if (t.obj.name.length > 50) {
                t.obj.name = t.obj.name.substring(0, 50) + '...';
            }
            return t;
        });
        return tasks;
    }

    public reload() {
        if (this.filter) {
            let requestNode = this.convertProcessInstanceToTaskQuery(this.filter);
            this.load(requestNode);
        }
    }

    private convertProcessInstanceToTaskQuery(processFilter: FilterRepresentationModel) {
        let requestNode = {
            appDefinitionId: processFilter.appId,
            processDefinitionKey: processFilter.filter.processDefinitionKey,
            text: processFilter.filter.name,
            state: processFilter.filter.state,
            sort: processFilter.filter.sort
        };
        return new TaskQueryRequestRepresentationModel(requestNode);
    }
}
