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

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AlfrescoTranslationService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { TaskDetailsModel } from '../models/task-details.model';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';

declare let componentHandler: any;
declare let __moduleName: string;

@Component({
    selector: 'activiti-start-task',
    moduleId: __moduleName,
    templateUrl: './activiti-start-task.component.html',
    styleUrls: ['./activiti-start-task.component.css'],
    providers: [ActivitiTaskListService]
})
export class ActivitiStartProcessButton implements OnInit {

    @Input()
    appId: string;

    @Output()
    onSuccess: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('dialog')
    dialog: any;

    name: string;
    description: string;

    /**
     * Constructor
     * @param auth
     * @param translate
     * @param taskService
     */
    constructor(private auth: AlfrescoAuthenticationService,
                private translate: AlfrescoTranslationService,
                private taskService: ActivitiTaskListService) {

        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-tasklist/src');
        }
    }

    ngOnInit() {
    }

    public start() {
        if (this.name) {
            this.taskService.createNewTask(new TaskDetailsModel({
                name: this.name,
                description: this.description,
                category: this.appId ? '' + this.appId : null
            })).subscribe(
                (res: any) => {
                    this.onSuccess.emit(res);
                    this.closeDialog();
                    this.resetForm();
                },
                (err) => {
                    window.alert('An error occurred while trying to add the task');
                    console.log(err);
                }
            );
        }
    }

    public cancel() {
        this.closeDialog();
    }

    public showDialog() {
        if (this.dialog) {
            this.dialog.nativeElement.showModal();
        }
    }

    private closeDialog() {
        if (this.dialog) {
            this.dialog.nativeElement.close();
        }
    }

    private resetForm() {
        this.name = '';
        this.description = '';
    }
}
