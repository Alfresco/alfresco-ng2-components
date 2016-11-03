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

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiStartForm } from 'ng2-activiti-form';
import { ActivitiProcessService } from './../services/activiti-process.service';

declare let componentHandler: any;

@Component({
    selector: 'activiti-start-process-instance',
    moduleId: module.id,
    templateUrl: './activiti-start-process.component.html',
    styleUrls: ['./activiti-start-process.component.css']
})
export class ActivitiStartProcessButton implements OnInit {

    @Input()
    appId: string;

    @ViewChild('dialog')
    dialog: any;

    @ViewChild('startForm')
    startForm: ActivitiStartForm;

    processDefinitions: any[] = [];

    name: string;
    processDefinitionId: string;

    constructor(private translate: AlfrescoTranslationService,
                private activitiProcess: ActivitiProcessService) {

        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-processlist/src');
        }
    }

    ngOnInit() {
        this.load(this.appId);
    }

    public load(appId: string) {
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
        if (this.dialog) {
            this.dialog.nativeElement.showModal();
        }
    }

    public startProcess() {
        if (this.processDefinitionId && this.name) {
            let formValues = this.startForm ? this.startForm.form.values : undefined;
            this.activitiProcess.startProcess(this.processDefinitionId, this.name, formValues).subscribe(
                (res: any) => {
                    this.cancel();
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    }

    public cancel() {
        if (this.dialog) {
            this.dialog.nativeElement.close();
        }
    }

    private getSelectedProcess(): any {
        return this.processDefinitions.filter((processDefinition) => {
            return processDefinition.id === this.processDefinitionId;
        })[0];
    }

    hasStartForm() {
        let selectedProcessDefinition = this.getSelectedProcess();
        return selectedProcessDefinition && selectedProcessDefinition.hasStartForm;
    }

    isStartFormMissingOrValid() {
        return !this.startForm || this.startForm.form.isValid;
    }

    validateForm() {
        return this.processDefinitionId && this.name && this.isStartFormMissingOrValid();
    }
}
