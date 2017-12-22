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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges,  ViewChild, ViewEncapsulation } from '@angular/core';
import { StartFormComponent
    , FormRenderingService
} from '@alfresco/adf-core';
import { ProcessInstanceVariable } from '../models/process-instance-variable.model';
import { ProcessDefinitionRepresentation } from './../models/process-definition.model';
import { ProcessInstance } from './../models/process-instance.model';
import { ProcessService } from './../services/process.service';
import { ShareAttachWidgetComponent } from './share-attach-widget.component';

@Component({
    selector: 'adf-start-process',
    templateUrl: './start-process.component.html',
    styleUrls: ['./start-process.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StartProcessInstanceComponent implements OnChanges {

    @Input()
    appId: number;

    @Input()
    variables: ProcessInstanceVariable[];

    @Output()
    start: EventEmitter<ProcessInstance> = new EventEmitter<ProcessInstance>();

    @Output()
    cancel: EventEmitter<ProcessInstance> = new EventEmitter<ProcessInstance>();

    @Output()
    error: EventEmitter<ProcessInstance> = new EventEmitter<ProcessInstance>();

    @ViewChild(StartFormComponent)
    startForm: StartFormComponent;

    processDefinitions: ProcessDefinitionRepresentation[] = [];

    name: string;

    currentProcessDef: ProcessDefinitionRepresentation = new ProcessDefinitionRepresentation();

    errorMessageId: string = '';

    constructor(private activitiProcess: ProcessService
        ,private formRenderingService: FormRenderingService
    ) {

        this.formRenderingService.setComponentTypeResolver('upload', () => ShareAttachWidgetComponent, true);
    }

    ngOnChanges(changes: SimpleChanges) {
        let appIdChange = changes['appId'];
        let appId = appIdChange ? appIdChange.currentValue : null;
        this.load(appId);
    }

    public load(appId?: number) {
        this.resetSelectedProcessDefinition();
        this.resetErrorMessage();
        this.activitiProcess.getProcessDefinitions(appId).subscribe(
            (res) => {
                this.processDefinitions = res;
            },
            () => {
                this.errorMessageId = 'ADF_PROCESS_LIST.START_PROCESS.ERROR.LOAD_PROCESS_DEFS';
            }
        );
    }

    public startProcess(outcome?: string) {
        if (this.currentProcessDef.id && this.name) {
            this.resetErrorMessage();
            let formValues = this.startForm ? this.startForm.form.values : undefined;
            this.activitiProcess.startProcess(this.currentProcessDef.id, this.name, outcome, formValues, this.variables).subscribe(
                (res) => {
                    this.name = '';
                    this.start.emit(res);
                },
                (err) => {
                    this.errorMessageId = 'ADF_PROCESS_LIST.START_PROCESS.ERROR.START';
                    this.error.error(err);
                }
            );
        }
    }

    compareProcessDef = (processDefId) => {
        if (this.processDefinitions && this.processDefinitions.length === 1 && processDefId === this.processDefinitions[0].id) {
            this.onProcessDefChange(processDefId);
            return true;
        }
    }

    onProcessDefChange(processDefinitionId) {
        let processDef = this.processDefinitions.find((processDefinition) => {
            return processDefinition.id === processDefinitionId;
        });
        if (processDef) {
            this.currentProcessDef = JSON.parse(JSON.stringify(processDef));
        } else {
            this.resetSelectedProcessDefinition();
        }
    }

    public cancelStartProcess() {
        this.cancel.emit();
    }

    hasStartForm() {
        return this.currentProcessDef && this.currentProcessDef.hasStartForm;
    }

    isProcessDefinitionEmpty() {
        return this.processDefinitions ? (this.processDefinitions.length > 0 || this.errorMessageId) : this.errorMessageId;
    }

    isStartFormMissingOrValid() {
        if (this.startForm) {
            return this.startForm.form && this.startForm.form.isValid;
        } else {
            return true;
        }
    }

    validateForm() {
        return this.currentProcessDef.id && this.name && this.isStartFormMissingOrValid();
    }

    private resetSelectedProcessDefinition() {
        this.currentProcessDef = new ProcessDefinitionRepresentation();
    }

    private resetErrorMessage(): void {
        this.errorMessageId = '';
    }

    hasErrorMessage() {
        return this.processDefinitions.length === 0 && !this.errorMessageId;
    }

    public onOutcomeClick(outcome: string) {
        this.startProcess(outcome);
    }

    public reset() {
        this.resetSelectedProcessDefinition();
        this.name = '';
        if (this.startForm) {
            this.startForm.data = {};
        }
        this.resetErrorMessage();
    }

    hasProcessName(): boolean {
        return this.name ? true : false;
    }
}
