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

import {
    Component,
    Input,
    OnInit,
    ViewChild,
    Output,
    EventEmitter,
    TemplateRef,
    OnChanges,
    SimpleChanges,
    DebugElement
} from '@angular/core';
import { AlfrescoTranslateService } from 'ng2-alfresco-core';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';
import { TaskDetailsModel } from '../models/task-details.model';
import { User } from '../models/user.model';
import { FormService, FormModel, FormOutcomeEvent } from 'ng2-activiti-form';
import { TaskQueryRequestRepresentationModel } from '../models/filter.model';

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

    @ViewChild('errorDialog')
    errorDialog: DebugElement;

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
    formSaved: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    formCompleted: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    formLoaded: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    onError: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    executeOutcome: EventEmitter<FormOutcomeEvent> = new EventEmitter<FormOutcomeEvent>();

    taskDetails: TaskDetailsModel;
    taskFormName: string = null;

    taskPeople: User[] = [];

    noTaskDetailsTemplateComponent: TemplateRef<any>;

    /**
     * Constructor
     * @param auth Authentication service
     * @param translate Translation service
     * @param activitiForm Form service
     * @param activitiTaskList Task service
     */
    constructor(private translateService: AlfrescoTranslateService,
                private activitiForm: FormService,
                private activitiTaskList: ActivitiTaskListService) {

        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'node_modules/ng2-activiti-tasklist/src');
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
     * Reset the task details
     */
    private reset() {
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
    private loadDetails(taskId: string) {
        this.taskPeople = [];
        this.taskFormName = null;
        if (taskId) {
            this.activitiTaskList.getTaskDetails(taskId).subscribe(
                (res: TaskDetailsModel) => {
                    this.taskDetails = res;

                    if (this.taskDetails.name === 'null') {
                        this.taskDetails.name = 'No name';
                    }

                    let endDate: any = res.endDate;
                    this.readOnlyForm = !!(endDate && !isNaN(endDate.getTime()));

                    if (this.taskDetails && this.taskDetails.involvedPeople) {
                        this.taskDetails.involvedPeople.forEach((user) => {
                            this.taskPeople.push(new User(user));
                        });
                    }
                });
        }
    }

    isAssignedToMe(): boolean {
        return this.taskDetails.assignee ? true : false;
    }

    /**
     * Retrieve the next open task
     * @param processInstanceId
     * @param processDefinitionId
     */
    private loadNextTask(processInstanceId: string, processDefinitionId: string) {
        let requestNode = new TaskQueryRequestRepresentationModel(
            {
                processInstanceId: processInstanceId,
                processDefinitionId: processDefinitionId
            }
        );
        this.activitiTaskList.getTasks(requestNode).subscribe(
            (response) => {
                if (response && response.length > 0) {
                    this.taskDetails = response[0];
                } else {
                    this.reset();
                }
            }, (error) => {
                console.error(error);
                this.onError.emit(error);
            });
    }

    /**
     * Complete button clicked
     */
    onComplete() {
        this.activitiTaskList.completeTask(this.taskId).subscribe(
            (res) => this.onFormCompleted(null)
        );
    }

    onFormSaved(form: FormModel) {
        this.formSaved.emit(form);
    }

    onFormCompleted(form: FormModel) {
        this.formCompleted.emit(form);
        if (this.showNextTask) {
            this.loadNextTask(this.taskDetails.processInstanceId, this.taskDetails.processDefinitionId);
        }
    }

    onFormLoaded(form: FormModel) {
        this.taskFormName = null;
        if (form && form.name) {
            this.taskFormName = form.name;
        }
        this.formLoaded.emit(form);
    }

    onFormError(error: any) {
        this.errorDialog.nativeElement.showModal();
        this.onError.emit(error);
    }

    onFormExecuteOutcome(event: FormOutcomeEvent) {
        this.executeOutcome.emit(event);
    }

    closeErrorDialog(): void {
        this.errorDialog.nativeElement.close();
    }

    onClaimTask(taskId: string) {
        this.loadDetails(taskId);
    }
}
