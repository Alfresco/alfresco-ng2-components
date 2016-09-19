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

import { Component, Input, OnInit, ViewChild, Output, EventEmitter, TemplateRef, OnChanges, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';
import { ActivitiTaskHeader } from './activiti-task-header.component';
import { ActivitiComments } from './activiti-comments.component';
import { ActivitiChecklist } from './activiti-checklist.component';
import { ActivitiPeople } from './activiti-people.component';
import { TaskDetailsModel } from '../models/task-details.model';
import { User } from '../models/user.model';
import { ActivitiForm, FormModel, FormService } from 'ng2-activiti-form';


declare let componentHandler: any;
declare let __moduleName: string;

@Component({
    selector: 'activiti-task-details',
    moduleId: __moduleName,
    templateUrl: './activiti-task-details.component.html',
    styleUrls: ['./activiti-task-details.component.css'],
    providers: [ActivitiTaskListService, FormService],
    directives: [ActivitiTaskHeader, ActivitiPeople, ActivitiComments, ActivitiChecklist, ActivitiForm]
})
export class ActivitiTaskDetails implements OnInit, OnChanges {

    @Input()
    taskId: string;

    @ViewChild('activiticomments')
    activiticomments: any;

    @ViewChild('activitichecklist')
    activitichecklist: any;

    @Input()
    showTitle: boolean = true;

    @Input()
    showCompleteButton: boolean = true;

    @Input()
    showSaveButton: boolean = true;

    @Input()
    readOnly: boolean = false;

    @Input()
    showRefreshButton: boolean = true;

    @Output()
    formSaved = new EventEmitter();

    @Output()
    formCompleted = new EventEmitter();

    @Output()
    formLoaded = new EventEmitter();

    @Output()
    onError = new EventEmitter();

    @Output()
    executeOutcome = new EventEmitter();

    taskDetails: TaskDetailsModel;

    taskForm: FormModel;

    taskPeople: User[] = [];

    noTaskDetailsTemplateComponent: TemplateRef<any>;

    /**
     * Constructor
     * @param auth
     * @param translate
     */
    constructor(private auth: AlfrescoAuthenticationService,
                private translate: AlfrescoTranslationService,
                private activitiForm: FormService,
                private activitiTaskList: ActivitiTaskListService) {

        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-tasklist/src');
        }
    }

    ngOnInit() {
        if (this.taskId) {
            this.loadDetails(this.taskId);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        let taskId = changes['taskId'];
        if (taskId && !taskId.currentValue) {
            this.reset();
            return;
        }
        if (taskId && taskId.currentValue) {
            this.loadDetails(taskId.currentValue);
            return;
        }
    }

    /**
     * Reset the task detail to undefined
     */
    reset() {
        this.taskDetails = null;
    }

    hasFormKey() {
        return this.taskDetails
            && this.taskDetails.formKey
            && this.taskDetails.formKey !== 'null';
    }

    /**
     * Load the activiti task details
     * @param taskId
     */
    loadDetails(taskId: string) {
        this.taskForm = null;
        this.taskPeople = [];
        if (taskId) {
            this.activitiTaskList.getTaskDetails(taskId).subscribe(
                (res: TaskDetailsModel) => {
                    this.taskDetails = res;

                    let endDate: any = res.endDate;
                    this.readOnly = !!(endDate && !isNaN(endDate.getTime()));

                    if (this.taskDetails && this.taskDetails.involvedPeople) {
                        this.taskDetails.involvedPeople.forEach((user) => {
                            this.taskPeople.push(new User(user));
                        });
                    }
                    if (this.activiticomments) {
                        this.activiticomments.load(this.taskDetails.id);
                    }

                    if (this.activitichecklist) {
                        this.activitichecklist.load(this.taskDetails.id);
                    }
                    console.log(this.taskDetails);

                }
            );
        } else {
            this.reset();
        }
    }

    /**
     * Complete the activiti task
     */
    onComplete() {
        this.activitiTaskList.completeTask(this.taskId).subscribe(
            (res) => {
                console.log(res);
            }
        );
    }

    /**
     * Emit the form saved event
     * @param data
     */
    formSavedEmitter(data: any) {
        this.formSaved.emit(data);
    }

    /**
     * Emit the form completed event
     * @param data
     */
    formCompletedEmitter(data: any) {
        this.formCompleted.emit(data);
    }

    /**
     * Emit the form loaded event
     * @param data
     */
    formLoadedEmitter(data: any) {
        this.formLoaded.emit(data);
    }

    onErrorEmitter(err: any) {
        this.onError.emit(err);
    }

    executeOutcomeEmitter(data: any) {
        this.executeOutcome.emit(data);
    }
}
