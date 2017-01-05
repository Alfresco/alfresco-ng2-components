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

import { AlfrescoTranslateService } from 'ng2-alfresco-core';
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

    @ViewChild('addDialog')
    addDialog: DebugElement;

    @ViewChild('editDialog')
    editDialog: DebugElement;

    @ViewChild('errorDialog')
    errorDialog: DebugElement;

    private defaultSchemaColumn: any[] = [
        {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
        {type: 'text', key: 'value', title: 'Value', sortable: true},
        {type: 'text', key: 'scope', title: 'Scope', sortable: true}
    ];

    variableName: string;
    variableValue: string;
    variableScope: string;

    /**
     * Constructor
     * @param translate Translation service
     * @param activitiProcess Process service
     */
    constructor(private translate: AlfrescoTranslateService,
                private activitiProcess: ActivitiProcessService) {

        if (translate) {
            translate.addTranslationFolder('ng2-activiti-processlist', 'node_modules/ng2-activiti-processlist/src');
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
        if (this.data) {
            this.data.setRows([]);
        }
    }

    private polyfillDialog(dialog: DebugElement) {
        if (!dialog.nativeElement.showModal) {
            dialogPolyfill.registerDialog(dialog.nativeElement);
        }
    }

    public showAddDialog() {
        this.resetForm();
        this.polyfillDialog(this.addDialog);
        this.addDialog.nativeElement.showModal();
    }

    public showEditDialog(row: ObjectDataRow) {
        this.variableName = row.getValue('name');
        this.variableValue = row.getValue('value');
        this.variableScope = row.getValue('scope');
        this.polyfillDialog(this.editDialog);
        this.editDialog.nativeElement.showModal();
    }

    public showErrorDialog() {
        this.polyfillDialog(this.errorDialog);
        this.errorDialog.nativeElement.showModal();
    }

    public add() {
        this.activitiProcess.createOrUpdateProcessInstanceVariables(this.processInstanceId, [new ProcessInstanceVariable({
            name: this.variableName,
            value: this.variableValue,
            scope: this.variableScope
        })]).subscribe(
            (res: ProcessInstanceVariable[]) => {
                this.getProcessInstanceVariables(this.processInstanceId);
                this.resetForm();
            },
            (err) => {
                this.showErrorDialog();
                this.error.emit(err);
            }
        );
        this.closeAddDialog();
    }

    public edit() {
        this.activitiProcess.createOrUpdateProcessInstanceVariables(this.processInstanceId, [new ProcessInstanceVariable({
            name: this.variableName,
            value: this.variableValue,
            scope: this.variableScope
        })]).subscribe(
            (res: ProcessInstanceVariable[]) => {
                this.getProcessInstanceVariables(this.processInstanceId);
                this.resetForm();
            },
            (err) => {
                this.showErrorDialog();
                this.error.emit(err);
            }
        );
        this.closeEditDialog();
    }

    public closeAddDialog() {
        this.addDialog.nativeElement.close();
    }

    public closeEditDialog() {
        this.editDialog.nativeElement.close();
    }

    public closeErrorDialog() {
        this.errorDialog.nativeElement.close();
    }

    private resetForm() {
        this.variableName = '';
        this.variableValue = '';
        this.variableScope = 'global';
    }

    private onDeleteVariable(row: ObjectDataRow) {
        this.activitiProcess.deleteProcessInstanceVariable(this.processInstanceId, row.getValue('name')).subscribe(() => {
            this.getProcessInstanceVariables(this.processInstanceId);
        },
        (err) => {
            this.showErrorDialog();
            this.error.emit(err);
        });
    }

    onExecuteRowAction(event) {
        let row: ObjectDataRow = event.args.row;
        let action = event.args.action;
        if (action && action.id === 'delete') {
            this.onDeleteVariable(row);
        }
        if (action && action.id === 'edit') {
            this.showEditDialog(row);
        }
    }

    onShowRowActionsMenu(event) {
        event.args.actions = [{
            id: 'delete',
            title: 'Delete'
        }, {
            id: 'edit',
            title: 'Edit'
        }];
    }
}
