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

import {Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlfrescoPipeTranslate, AlfrescoTranslationService, CONTEXT_MENU_DIRECTIVES, CONTEXT_MENU_PROVIDERS } from 'ng2-alfresco-core';
import { ALFRESCO_DATATABLE_DIRECTIVES, ObjectDataTableAdapter, DataRowEvent } from 'ng2-alfresco-datatable';
import { ActivitiProcessService } from '../services/activiti-process.service';
import { FilterModel } from '../models/filter.model';

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
    pipes: [ AlfrescoPipeTranslate ],
    providers: [ CONTEXT_MENU_PROVIDERS, ActivitiProcessService ]
})
export class ActivitiProcessInstanceListComponent implements OnInit {

    errorMessage: string;
    data: ObjectDataTableAdapter;
    currentProcessInstanceId: string;

    @Input()
    filter: FilterModel;

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
            this.load(this.filter);
        }
    }

    load(filter: FilterModel) {
        this.processService.getProcessInstances(filter)
            .subscribe(
                (processInstances) => {
                    this.renderProcessInstances(processInstances);
                    this.onSuccess.emit(processInstances);
                },
                error => {
                    this.errorMessage = <any>error;
                    this.onError.emit(error);
                });
    }

    reload() {
        this.load(this.filter);
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
}
