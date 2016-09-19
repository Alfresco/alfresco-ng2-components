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

import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService, CONTEXT_MENU_DIRECTIVES, CONTEXT_MENU_PROVIDERS } from 'ng2-alfresco-core';
import { ALFRESCO_DATATABLE_DIRECTIVES, ObjectDataTableAdapter, DataRowEvent } from 'ng2-alfresco-datatable';
import { ActivitiProcessService } from '../services/activiti-process.service';
import { UserProcessInstanceFilterRepresentationModel, TaskQueryRequestRepresentationModel } from '../models/filter.model';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'activiti-process-instance-list',
    styles: [
      `
              :host h1 {
                  font-size:22px
              }
          `
    ],
    templateUrl: './activiti-processlist.component.html',
    directives: [ ALFRESCO_DATATABLE_DIRECTIVES, CONTEXT_MENU_DIRECTIVES ],
    providers: [ CONTEXT_MENU_PROVIDERS, ActivitiProcessService ]
})
export class ActivitiProcessInstanceListComponent implements OnInit, OnChanges {

    errorMessage: string;
    data: ObjectDataTableAdapter;
    currentProcessInstanceId: string;

    @Input()
    filter: UserProcessInstanceFilterRepresentationModel;

    @Input()
    schemaColumn: any[] = [
        {type: 'text', key: 'id', title: 'Id', sortable: true},
        {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
        {type: 'text', key: 'started', title: 'Started', sortable: true},
        {type: 'text', key: 'startedBy.email', title: 'Started By', sortable: true}
    ];

    @Output()
    rowClick: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    onSuccess: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onError: EventEmitter<any> = new EventEmitter<any>();

    constructor (private processService: ActivitiProcessService, private translate: AlfrescoTranslationService) {
        if (translate !== null) {
            translate.addTranslationFolder('node_modules/ng2-activiti-processlist/src');
        }
    }

    ngOnInit() {
        this.data = new ObjectDataTableAdapter(
            [],
            this.schemaColumn
        );
        if (this.filter) {
            let requestNode = this.convertProcessInstanceToTaskQuery(this.filter);
            this.load(requestNode);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        let filter = changes['filter'];
        if (filter && filter.currentValue) {
            let requestNode = this.convertProcessInstanceToTaskQuery(filter.currentValue);
            this.load(requestNode);
            return;
        }
    }

    load(requestNode: TaskQueryRequestRepresentationModel) {
        this.processService.getProcessInstances(requestNode)
            .subscribe(
                (processInstances) => {
                    this.renderProcessInstances(processInstances);
                    this.selectFirstProcess();
                    this.onSuccess.emit(processInstances);
                },
                error => {
                    this.errorMessage = <any>error;
                    this.onError.emit(error);
                });
    }

    /**
     * Render the process list
     *
     * @param processInstances
     */
    private renderProcessInstances(processInstances: any[]) {
        processInstances = this.optimizeProcessNames(processInstances);
        this.data = new ObjectDataTableAdapter(
            processInstances,
            this.schemaColumn
        );
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
            t.name = t.name || 'No name';
            if (t.name.length > 50) {
                t.name = t.name.substring(0, 50) + '...';
            }
            return t;
        });
        return tasks;
    }

    private convertProcessInstanceToTaskQuery(processFilter: UserProcessInstanceFilterRepresentationModel) {
        let requestNode = {appDefinitionId: processFilter.appId,
            processDefinitionKey: processFilter.filter.processDefinitionKey,
            text: processFilter.filter.name,
            state: processFilter.filter.state,
            sort: processFilter.filter.sort};
        return new TaskQueryRequestRepresentationModel(requestNode);
    }
}
