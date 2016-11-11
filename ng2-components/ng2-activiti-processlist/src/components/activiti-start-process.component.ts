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

import { Component, EventEmitter, Input, Output, OnInit, ViewChild, DebugElement, OnChanges, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiStartForm } from 'ng2-activiti-form';
import { ActivitiProcessService } from './../services/activiti-process.service';

declare let componentHandler: any;
declare let dialogPolyfill: any;

@Component({
    selector: 'activiti-start-process-instance',
    moduleId: module.id,
    templateUrl: './activiti-start-process.component.html',
    styleUrls: ['./activiti-start-process.component.css']
})
export class ActivitiStartProcessButton implements OnInit, OnChanges {

    @Input()
    appId: string;

    @Output()
    start: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('dialog')
    dialog: DebugElement;

    @ViewChild('startForm')
    startForm: ActivitiStartForm;

    processDefinitions: any[] = [];

    name: string;

    currentProcessDef: any;

    constructor(private translate: AlfrescoTranslationService,
                private activitiProcess: ActivitiProcessService) {

        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-processlist/src');
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
        this.reset();
        this.activitiProcess.getProcessDefinitions(this.appId).subscribe(
            (res: any[]) => {
                this.processDefinitions = res;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    public showDialog() {
        if (!this.dialog.nativeElement.showModal) {
            dialogPolyfill.registerDialog(this.dialog.nativeElement);
        }
        this.dialog.nativeElement.showModal();
    }

    public startProcess() {
        if (this.currentProcessDef.id && this.name) {
            let formValues = this.startForm ? this.startForm.form.values : undefined;
            this.activitiProcess.startProcess(this.currentProcessDef.id, this.name, formValues).subscribe(
                (res: any) => {
                    this.name = '';
                    this.start.emit(res);
                    this.cancel();
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    }

    public cancel() {
        this.dialog.nativeElement.close();
    }

    onChange(processDefinitionId) {
        let processDef = this.processDefinitions.find((processDefinition) => {
            return processDefinition.id === processDefinitionId;
        });
        let clone = JSON.parse(JSON.stringify(processDef));
        this.currentProcessDef = clone;
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

    reset() {
        this.currentProcessDef = {};
    }
}
