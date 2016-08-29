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
import { AlfrescoTranslationService, AlfrescoAuthenticationService, AlfrescoPipeTranslate } from 'ng2-alfresco-core';
import { ActivitiProcessService } from './../services/activiti-process.service';

declare let componentHandler: any;
declare let __moduleName: string;

@Component({
    selector: 'activiti-start-process',
    moduleId: __moduleName,
    templateUrl: './activiti-start-process.component.html',
    styleUrls: ['./activiti-start-process.component.css'],
    providers: [ActivitiProcessService],
    pipes: [ AlfrescoPipeTranslate ]

})
export class ActivitiStartProcessButton implements OnInit {

    @Input()
    appId: string;

    @ViewChild('dialog')
    dialog: any;

    processDefinitions: any[] = [];

    name: string;
    processDefinition: string;

    /**
     * Constructor
     * @param auth
     * @param translate
     * @param activitiProcess
     */
    constructor(private auth: AlfrescoAuthenticationService,
                private translate: AlfrescoTranslationService,
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
        if (this.processDefinition && this.name) {
            this.activitiProcess.startProcess(this.processDefinition, this.name).subscribe(
                (res: any) => {
                    console.log('Created process', res);
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
}
