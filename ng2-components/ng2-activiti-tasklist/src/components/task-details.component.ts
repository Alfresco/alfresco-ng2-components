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

import { Component,
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
import { AlfrescoTranslationService, LogService } from 'ng2-alfresco-core';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';
import { TaskDetailsModel } from '../models/task-details.model';
import { User } from '../models/user.model';
import { FormService, FormModel, FormOutcomeEvent, ContentLinkModel } from 'ng2-activiti-form';
import { TaskQueryRequestRepresentationModel } from '../models/filter.model';

declare var require: any;
declare let dialogPolyfill: any;

@Component({
    selector: 'activiti-task-details',
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

    @ViewChild('dialogPeople')
    peopleDialog: any;

    @Input()
    debugMode: boolean = false;

    @Input()
    taskId: string;

    @Input()
    showNextTask: boolean = true;

    @Input()
    showHeader: boolean = true;

    @Input()
    showHeaderContent: boolean = true;

    @Input()
    showInvolvePeople: boolean = true;

    @Input()
    showComments: boolean = true;

    @Input()
    showChecklist: boolean = true;

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

    @Input()
    peopleIconImageUrl: string = require('../assets/images/user.jpg');

    @Output()
    formSaved: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    formCompleted: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    formContentClicked: EventEmitter<ContentLinkModel> = new EventEmitter<ContentLinkModel>();

    @Output()
    formLoaded: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    taskCreated: EventEmitter<TaskDetailsModel> = new EventEmitter<TaskDetailsModel>();

    @Output()
    taskDeleted: EventEmitter<string> = new EventEmitter<string>();

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
    constructor(private translateService: AlfrescoTranslationService,
                private activitiForm: FormService,
                private activitiTaskList: ActivitiTaskListService,
                private logService: LogService) {

        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'assets/ng2-activiti-tasklist');
        }
    }

    ngOnInit() {
        if (this.taskId) {
            this.loadDetails(this.taskId);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        let taskId = changes.taskId;

        if (taskId && !taskId.currentValue) {
            this.reset();
        } else if (taskId && taskId.currentValue) {
            this.loadDetails(taskId.currentValue);
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
                    this.readOnlyForm = this.readOnlyForm ? this.readOnlyForm : !!(endDate && !isNaN(endDate.getTime()));
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
    private loadNextTask(processInstanceId: string, processDefinitionId: string): void {
        let requestNode = new TaskQueryRequestRepresentationModel(
            {
                processInstanceId: processInstanceId,
                processDefinitionId: processDefinitionId
            }
        );
        this.activitiTaskList.getTasks(requestNode).subscribe(
            (response) => {
                if (response && response.length > 0) {
                    this.taskDetails = new TaskDetailsModel(response[0]);
                } else {
                    this.reset();
                }
            }, (error) => {
                this.onError.emit(error);
            });
    }

    /**
     * Complete button clicked
     */
    onComplete(): void {
        this.activitiTaskList.completeTask(this.taskId).subscribe(
            (res) => this.onFormCompleted(null)
        );
    }

    onFormContentClick(content: ContentLinkModel): void {
        this.formContentClicked.emit(content);
    }

    onFormSaved(form: FormModel): void {
        this.formSaved.emit(form);
    }

    onFormCompleted(form: FormModel): void {
        this.formCompleted.emit(form);
        if (this.showNextTask) {
            this.loadNextTask(this.taskDetails.processInstanceId, this.taskDetails.processDefinitionId);
        }
    }

    onFormLoaded(form: FormModel): void {
        this.taskFormName = null;
        if (form && form.name) {
            this.taskFormName = form.name;
        }
        this.formLoaded.emit(form);
    }

    onChecklistTaskCreated(task: TaskDetailsModel): void {
        this.taskCreated.emit(task);
    }

    onChecklistTaskDeleted(taskId: string): void {
        this.taskDeleted.emit(taskId);
    }

    onFormError(error: any): void {
        this.errorDialog.nativeElement.showModal();
        this.onError.emit(error);
    }

    onFormExecuteOutcome(event: FormOutcomeEvent): void {
        this.executeOutcome.emit(event);
    }

    closeErrorDialog(): void {
        this.errorDialog.nativeElement.close();
    }

    public showPeopleDialog(): void {
        if (!this.peopleDialog.nativeElement.showModal) {
            dialogPolyfill.registerDialog(this.peopleDialog.nativeElement);
        }
        this.peopleDialog.nativeElement.showModal();
    }

    public closePeopleDialog(): void {
        if (this.peopleDialog) {
            this.peopleDialog.nativeElement.close();
        }
    }

    onClaimTask(taskId: string): void {
        this.loadDetails(taskId);
    }

    toggleHeaderContent(): void {
        this.showHeaderContent = !this.showHeaderContent;
    }

    isCompletedTask(): boolean {
        return this.taskDetails && this.taskDetails.endDate ? true : undefined;
    }
}
