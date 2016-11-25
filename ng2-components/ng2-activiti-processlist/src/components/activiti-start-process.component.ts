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

import { Component, EventEmitter, Input, Output, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiStartForm } from 'ng2-activiti-form';
import { ProcessInstance } from './../models/process-instance.model';
import { ProcessDefinitionRepresentation } from './../models/process-definition.model';
import { ActivitiProcessService } from './../services/activiti-process.service';

declare let componentHandler: any;
declare let dialogPolyfill: any;

@Component({
    selector: 'activiti-start-process',
    moduleId: module.id,
    templateUrl: './activiti-start-process.component.html',
    styleUrls: ['./activiti-start-process.component.css']
})
export class ActivitiStartProcessInstance implements OnInit, OnChanges {

    @Input()
    appId: string;

    @Input()
    showStartButton: boolean = true;

    @Output()
    start: EventEmitter<ProcessInstance> = new EventEmitter<ProcessInstance>();

    @ViewChild(ActivitiStartForm)
    startForm: ActivitiStartForm;

    processDefinitions: ProcessDefinitionRepresentation[] = [];

    name: string;

    currentProcessDef: ProcessDefinitionRepresentation = new ProcessDefinitionRepresentation();

    errorMessageId: string = '';

    constructor(private translate: AlfrescoTranslationService,
                private activitiProcess: ActivitiProcessService) {

        if (translate) {
            translate.addTranslationFolder('ng2-activiti-processlist', 'node_modules/ng2-activiti-processlist/dist/src');
        }
    }

    ngOnInit() {
        this.load(this.appId);
    }

    ngOnChanges(changes: SimpleChanges) {
        let appId = changes['appId'];
        if (appId && (appId.currentValue || appId.currentValue === null)) {
            this.load(appId.currentValue);
            return;
        }
    }

    public load(appId: string) {
        this.resetSelectedProcessDefinition();
        this.resetErrorMessage();
        this.activitiProcess.getProcessDefinitions(appId).subscribe(
            (res) => {
                this.processDefinitions = res;
            },
            () => {
                this.errorMessageId = 'START_PROCESS.ERROR.LOAD_PROCESS_DEFS';
            }
        );
    }

    public startProcess() {
        if (this.currentProcessDef.id && this.name) {
            this.resetErrorMessage();
            let formValues = this.startForm ? this.startForm.form.values : undefined;
            this.activitiProcess.startProcess(this.currentProcessDef.id, this.name, formValues).subscribe(
                (res) => {
                    this.name = '';
                    this.start.emit(res);
                },
                (err) => {
                    this.errorMessageId = 'START_PROCESS.ERROR.START';
                    this.start.error(err);
                }
            );
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

    hasStartForm() {
        return this.currentProcessDef && this.currentProcessDef.hasStartForm;
    }

    isStartFormMissingOrValid() {
        return !this.startForm || this.startForm.form.isValid;
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

    public reset() {
        this.resetSelectedProcessDefinition();
        this.name = '';
        if (this.startForm) {
            this.startForm.data = {};
        }
        this.resetErrorMessage();
    }
}
