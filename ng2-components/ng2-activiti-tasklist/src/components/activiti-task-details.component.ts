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
import { TaskDetailsModel } from '../models/task-details.model';
import { User } from '../models/user.model';
import { FormModel, FormService } from 'ng2-activiti-form';
import { TaskQueryRequestRepresentationModel } from '../models/filter.model';


declare let componentHandler: any;

@Component({
    selector: 'activiti-task-details',
    moduleId: module.id,
    templateUrl: './activiti-task-details.component.html',
    styleUrls: ['./activiti-task-details.component.css']
})
export class ActivitiTaskDetails implements OnInit, OnChanges {

    @ViewChild('activiticomments')
    activiticomments: any;

    @ViewChild('activitichecklist')
    activitichecklist: any;

    @Input()
    taskId: string;

    @Input()
    showNextTask: boolean = true;

    @Input()
    showFormTitle: boolean = true;

    @Input()
    showFormCompleteButton: boolean = true;

    @Input()
    showFormSaveButton: boolean = true;

    @Input()
    readOnlyForm: boolean = false;

    @Input()
    showFormRefreshButton: boolean = true;

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

    /**
     * Check if the task has a form
     * @returns {TaskDetailsModel|string|boolean}
     */
    hasFormKey() {
        return (this.taskDetails
            && this.taskDetails.formKey
            && this.taskDetails.formKey !== 'null');
    }

    isTaskActive() {
        return this.taskDetails && this.taskDetails.duration === null;
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
                    this.readOnlyForm = !!(endDate && !isNaN(endDate.getTime()));

                    if (this.taskDetails && this.taskDetails.involvedPeople) {
                        this.taskDetails.involvedPeople.forEach((user) => {
                            this.taskPeople.push(new User(user));
                        });
                    }
                }
            );
        } else {
            this.reset();
        }
    }

    /**
     * Retrieve the next open task
     * @param processInstanceId
     * @param processDefinitionId
     */
    loadNextTask(processInstanceId: string, processDefinitionId: string) {
        let requestNode = new TaskQueryRequestRepresentationModel(
            {
                processInstanceId: processInstanceId,
                processDefinitionId: processDefinitionId
            }
        );
        this.activitiTaskList.getTasks(requestNode).subscribe(
            (response) => {
                if (response.data && response.data.length > 0) {
                    this.taskDetails = response.data[0];
                } else {
                    this.reset();
                }
            }, (error) => {
                console.error(error);
                this.onError.emit(error);
            });
    }

    /**
     * Complete the activiti task
     */
    onComplete() {
        this.activitiTaskList.completeTask(this.taskId).subscribe(
            (res) => {
                console.log(res);
                this.formCompleted.emit(res);
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
        if (this.isShowNextTask()) {
            this.loadNextTask(this.taskDetails.processInstanceId, this.taskDetails.processDefinitionId);
        }
    }

    /**
     * Emit the form loaded event
     * @param data
     */
    formLoadedEmitter(data: any) {
        this.formLoaded.emit(data);
    }

    /**
     * Emit the error event of the form
     * @param data
     */
    onErrorEmitter(err: any) {
        this.onError.emit(err);
    }

    /**
     * Emit the execute outcome of the form
     * @param data
     */
    executeOutcomeEmitter(data: any) {
        this.executeOutcome.emit(data);
    }

    /**
     * Return the showNexTask value
     * @returns {boolean}
     */
    isShowNextTask(): boolean {
        return this.showNextTask;
    }
}
