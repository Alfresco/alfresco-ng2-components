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

import { Component, DebugElement, EventEmitter, Input, Output, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ObjectDataTableAdapter, DataTableAdapter, ObjectDataRow } from 'ng2-alfresco-datatable';
import { ProcessInstanceVariable } from './../models/process-instance-variable.model';
import { ActivitiProcessService } from './../services/activiti-process.service';

declare let componentHandler: any;
declare let dialogPolyfill: any;

@Component({
    selector: 'activiti-process-instance-variables',
    moduleId: module.id,
    templateUrl: './activiti-process-instance-variables.component.html',
    styleUrls: [],
    providers: [ActivitiProcessService]
})
export class ActivitiProcessInstanceVariables implements OnInit, OnChanges {

    @Input()
    processInstanceId: string;

    @Input()
    data: DataTableAdapter;

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('dialog')
    dialog: DebugElement;

    private defaultSchemaColumn: any[] = [
        {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
        {type: 'text', key: 'value', title: 'Value', sortable: true},
        {type: 'text', key: 'scope', title: 'Scope', sortable: true}
    ];

    variableName: string;
    variableValue: string;

    /**
     * Constructor
     * @param translate Translation service
     * @param activitiProcess Process service
     */
    constructor(private translate: AlfrescoTranslationService,
                private activitiProcess: ActivitiProcessService) {

        if (translate) {
            translate.addTranslationFolder('ng2-activiti-processlist', 'node_modules/ng2-activiti-processlist/dist/src');
        }

    }

    ngOnInit() {
        if (!this.data) {
            this.data = this.initDefaultSchemaColumns();
        }
        if (this.processInstanceId) {
            this.getProcessInstanceVariables(this.processInstanceId);
            return;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        let processInstanceId = changes['processInstanceId'];
        if (processInstanceId) {
            if (processInstanceId.currentValue) {
                this.getProcessInstanceVariables(processInstanceId.currentValue);
            } else {
                this.resetVariables();
            }
        }
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
     * Return an initDefaultSchemaColumns instance with the default Schema Column
     * @returns {ObjectDataTableAdapter}
     */
    private initDefaultSchemaColumns(): ObjectDataTableAdapter {
        return new ObjectDataTableAdapter(
            [],
            this.defaultSchemaColumn
        );
    }

    /**
     * Create an array of ObjectDataRow
     * @param instances
     * @returns {ObjectDataRow[]}
     */
    private createDataRow(instances: ProcessInstanceVariable[]): ObjectDataRow[] {
        let instancesRows: ObjectDataRow[] = [];
        instances.forEach((row) => {
            instancesRows.push(new ObjectDataRow({
                name: row.name,
                value: row.value,
                scope: row.scope
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
        this.data.setRows(instances);
    }

    private getProcessInstanceVariables(processInstanceId: string) {
        if (processInstanceId) {
            this.activitiProcess.getProcessInstanceVariables(processInstanceId).subscribe(
                (res: ProcessInstanceVariable[]) => {
                    let instancesRow = this.createDataRow(res);
                    this.renderInstances(instancesRow);
                },
                (err) => {
                    this.error.emit(err);
                }
            );
        } else {
            this.resetVariables();
        }
    }

    private resetVariables() {
        this.data.setRows([]);
    }

    public showDialog() {
        if (!this.dialog.nativeElement.showModal) {
            dialogPolyfill.registerDialog(this.dialog.nativeElement);
        }
        if (this.dialog) {
            this.dialog.nativeElement.showModal();
        }
    }

    public add() {
        this.activitiProcess.createOrUpdateProcessInstanceVariables(this.processInstanceId, [new ProcessInstanceVariable({
            name: this.variableName,
            value: this.variableValue,
            scope: 'global'
        })]).subscribe(
            (res: ProcessInstanceVariable[]) => {
                this.getProcessInstanceVariables(this.processInstanceId);
                this.resetForm();
            },
            (err) => {
                this.error.emit(err);
            }
        );
        this.cancel();
    }

    public cancel() {
        if (this.dialog) {
            this.dialog.nativeElement.close();
        }
    }

    private resetForm() {
        this.variableName = '';
        this.variableValue = '';
    }
}
