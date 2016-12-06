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

import { Component, EventEmitter, Input, Output, ViewChild, DebugElement } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiStartProcessInstance } from './activiti-start-process.component';
import { ProcessInstance } from './../models/process-instance.model';

declare let componentHandler: any;
declare let dialogPolyfill: any;

@Component({
    selector: 'activiti-start-process-dialog',
    templateUrl: './activiti-start-process-dialog.component.html',
    styleUrls: ['./activiti-start-process-dialog.component.css']
})
export class ActivitiStartProcessInstanceDialog {

    @Input()
    appId: string;

    @Input()
    showButton: boolean = true;

    @Output()
    start: EventEmitter<ProcessInstance> = new EventEmitter<ProcessInstance>();

    @ViewChild('dialog')
    dialog: DebugElement;

    @ViewChild(ActivitiStartProcessInstance)
    startProcessComponent: ActivitiStartProcessInstance;

    constructor(private translate: AlfrescoTranslationService) {
        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-processlist/src');
        }
    }

    public showDialog() {
        if (!this.dialog.nativeElement.showModal) {
            dialogPolyfill.registerDialog(this.dialog.nativeElement);
        }
        this.dialog.nativeElement.showModal();
    }

    validateForm() {
        return this.startProcessComponent.validateForm();
    }

    public startProcess() {
        this.startProcessComponent.startProcess();
    }

    public closeDialog() {
        this.startProcessComponent.reset();
        this.dialog.nativeElement.close();
    }

    onStartProcessInstance(processInstance: ProcessInstance) {
        this.start.emit(processInstance);
    }
}
