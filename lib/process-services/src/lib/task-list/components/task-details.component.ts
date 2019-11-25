/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
    PeopleProcessService, UserProcessModel,
    AuthenticationService,
    CardViewUpdateService,
    ClickNotification,
    LogService,
    UpdateNotification,
    CommentsComponent,
    ContentLinkModel, FormFieldValidator, FormModel, FormOutcomeEvent
} from '@alfresco/adf-core';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    OnDestroy
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Observer, Subject } from 'rxjs';
import { TaskQueryRequestRepresentationModel } from '../models/filter.model';
import { TaskDetailsModel } from '../models/task-details.model';
import { TaskListService } from './../services/tasklist.service';
import { UserRepresentation } from '@alfresco/js-api';
import { share, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adf-task-details',
    templateUrl: './task-details.component.html',
    styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit, OnChanges, OnDestroy {

    @ViewChild('activitiComments', { static: false })
    activitiComments: CommentsComponent;

    @ViewChild('activitiChecklist', { static: false })
    activitiChecklist: any;

    @ViewChild('errorDialog', { static: false })
    errorDialog: TemplateRef<any>;

    /** Toggles debug mode. */
    @Input()
    debugMode: boolean = false;

    /** (**required**) The id of the task whose details we are asking for. */
    @Input()
    taskId: string;

    /** Automatically renders the next task when the current one is completed. */
    @Input()
    showNextTask: boolean = true;

    /** Toggles task details Header component. */
    @Input()
    showHeader: boolean = true;

    /** Toggles collapsed/expanded state of the Header component. */
    @Input()
    showHeaderContent: boolean = true;

    /** Toggles `Involve People` feature for the Header component. */
    @Input()
    showInvolvePeople: boolean = true;

    /** Toggles `Comments` feature for the Header component. */
    @Input()
    showComments: boolean = true;

    /** Toggles `Checklist` feature for the Header component. */
    @Input()
    showChecklist: boolean = true;

    /** Toggles rendering of the form title. */
    @Input()
    showFormTitle: boolean = false;

    /** Toggles rendering of the `Complete` outcome button. */
    @Input()
    showFormCompleteButton: boolean = true;

    /** Toggles rendering of the `Save` outcome button. */
    @Input()
    showFormSaveButton: boolean = true;

    /** Toggles read-only state of the form. All form widgets render as read-only
     * if enabled.
     */
    @Input()
    readOnlyForm: boolean = false;

    /** Toggles rendering of the `Refresh` button. */
    @Input()
    showFormRefreshButton: boolean = true;

    /** Field validators for use with the form. */
    @Input()
    fieldValidators: FormFieldValidator[] = [];

    /** Emitted when the form is submitted with the `Save` or custom outcomes. */
    @Output()
    formSaved: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    /** Emitted when the form is submitted with the `Complete` outcome. */
    @Output()
    formCompleted: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    /** Emitted when the form field content is clicked. */
    @Output()
    formContentClicked: EventEmitter<ContentLinkModel> = new EventEmitter<ContentLinkModel>();

    /** Emitted when the form is loaded or reloaded. */
    @Output()
    formLoaded: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    /** Emitted when a checklist task is created. */
    @Output()
    taskCreated: EventEmitter<TaskDetailsModel> = new EventEmitter<TaskDetailsModel>();

    /** Emitted when a checklist task is deleted. */
    @Output()
    taskDeleted: EventEmitter<string> = new EventEmitter<string>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when any outcome is executed. Default behaviour can be prevented
     * via `event.preventDefault()`.
     */
    @Output()
    executeOutcome: EventEmitter<FormOutcomeEvent> = new EventEmitter<FormOutcomeEvent>();

    /** Emitted when a task is assigned. */
    @Output()
    assignTask: EventEmitter<void> = new EventEmitter<void>();

    /** Emitted when a task is claimed. */
    @Output()
    claimedTask: EventEmitter<string> = new EventEmitter<string>();

    /** Emitted when a task is unclaimed. */
    @Output()
    unClaimedTask: EventEmitter<string> = new EventEmitter<string>();

    taskDetails: TaskDetailsModel;
    taskFormName: string = null;
    taskPeople: UserProcessModel[] = [];
    noTaskDetailsTemplateComponent: TemplateRef<any>;
    showAssignee: boolean = false;
    showAttachForm: boolean = false;
    internalReadOnlyForm: boolean = false;

    private peopleSearchObserver: Observer<UserProcessModel[]>;
    public errorDialogRef: MatDialogRef<TemplateRef<any>>;
    private onDestroy$ = new Subject<boolean>();

    peopleSearch: Observable<UserProcessModel[]>;

    currentLoggedUser: UserRepresentation;
    data: any;

    constructor(private taskListService: TaskListService,
                private authService: AuthenticationService,
                private peopleProcessService: PeopleProcessService,
                private logService: LogService,
                private cardViewUpdateService: CardViewUpdateService,
                private dialog: MatDialog) {
    }

    ngOnInit() {
        this.peopleSearch = new Observable<UserProcessModel[]>((observer) => this.peopleSearchObserver = observer).pipe(share());
        this.authService.getBpmLoggedUser().subscribe(user => {
            this.currentLoggedUser = user;
        });

        if (this.taskId) {
            this.loadDetails(this.taskId);
        }

        this.cardViewUpdateService.itemUpdated$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(this.updateTaskDetails.bind(this));

        this.cardViewUpdateService.itemClicked$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(this.clickTaskDetails.bind(this));
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const taskId = changes.taskId;
        this.showAssignee = false;

        if (taskId && !taskId.currentValue) {
            this.reset();
        } else if (taskId && taskId.currentValue) {
            this.loadDetails(taskId.currentValue);
        }
    }

    isStandaloneTask(): boolean {
        return !(this.taskDetails && (!!this.taskDetails.processDefinitionId));
    }

    isStandaloneTaskWithForm(): boolean {
        return this.isStandaloneTask() && this.hasFormKey();
    }

    isStandaloneTaskWithoutForm(): boolean {
        return this.isStandaloneTask() && !this.hasFormKey();
    }

    isFormComponentVisible(): boolean {
        return this.hasFormKey() && !this.isShowAttachForm();
    }

    isTaskStandaloneComponentVisible(): boolean {
        return this.isStandaloneTaskWithoutForm() && !this.isShowAttachForm();
    }

    isShowAttachForm(): boolean {
        return this.showAttachForm;
    }

    /**
     * Reset the task details
     */
    private reset() {
        this.taskDetails = null;
    }

    /**
     * Check if the task has a form
     */
    hasFormKey(): boolean {
        return (this.taskDetails && (!!this.taskDetails.formKey));
    }

    isTaskActive() {
        return this.taskDetails && this.taskDetails.duration === null;
    }

    /**
     * Save a task detail and update it after a successful response
     *
     * @param updateNotification
     */
    private updateTaskDetails(updateNotification: UpdateNotification) {
        this.taskListService
            .updateTask(this.taskId, updateNotification.changed)
            .subscribe(() => this.loadDetails(this.taskId));
    }

    private clickTaskDetails(clickNotification: ClickNotification) {
        if (clickNotification.target.key === 'assignee') {
            this.showAssignee = true;
        }
        if (clickNotification.target.key === 'formName') {
            this.showAttachForm = true;
        }
    }

    /**
     * Load the activiti task details
     * @param taskId
     */
    private loadDetails(taskId: string) {
        this.taskPeople = [];
        this.taskFormName = null;

        if (taskId) {
            this.taskListService.getTaskDetails(taskId).subscribe(
                (res: TaskDetailsModel) => {
                    this.showAttachForm = false;
                    this.taskDetails = res;

                    if (this.taskDetails.name === 'null') {
                        this.taskDetails.name = 'No name';
                    }

                    const endDate: any = res.endDate;
                    if (endDate && !isNaN(endDate.getTime())) {
                        this.internalReadOnlyForm = true;
                    } else {
                        this.internalReadOnlyForm = this.readOnlyForm;
                    }

                    if (this.taskDetails && this.taskDetails.involvedPeople) {
                        this.taskDetails.involvedPeople.forEach((user) => {
                            this.taskPeople.push(new UserProcessModel(user));
                        });
                    }
                });
        }
    }

    isAssigned(): boolean {
        return !!this.taskDetails.assignee;
    }

    private hasEmailAddress(): boolean {
        return this.taskDetails.assignee.email ? true : false;
    }

    isAssignedToMe(): boolean {
        return this.isAssigned() && this.hasEmailAddress() ?
            this.isEmailEqual(this.taskDetails.assignee.email, this.currentLoggedUser.email) :
            this.isExternalIdEqual(this.taskDetails.assignee.externalId, this.currentLoggedUser.externalId);
    }

    private isEmailEqual(assigneeMail: string, currentLoggedEmail: string): boolean {
        return assigneeMail.toLocaleLowerCase() === currentLoggedEmail.toLocaleLowerCase();
    }

    private isExternalIdEqual(assigneeExternalId: string, currentUserExternalId: string): boolean {
        return assigneeExternalId.toLocaleLowerCase() === currentUserExternalId.toLocaleLowerCase();
    }

    isCompleteButtonEnabled(): boolean {
        return this.isAssignedToMe() || this.canInitiatorComplete();
    }

    isCompleteButtonVisible(): boolean {
        return !this.hasFormKey() && this.isTaskActive() && this.isCompleteButtonEnabled();
    }

    canInitiatorComplete(): boolean {
        return this.taskDetails.initiatorCanCompleteTask;
    }

    isSaveButtonVisible(): boolean {
        return this.hasSaveButton() && (!this.canInitiatorComplete() || this.isAssignedToMe());
    }

    hasSaveButton(): boolean {
        return this.showFormSaveButton;
    }

    /**
     * Retrieve the next open task
     * @param processInstanceId
     * @param processDefinitionId
     */
    private loadNextTask(processInstanceId: string, processDefinitionId: string): void {
        const requestNode = new TaskQueryRequestRepresentationModel(
            {
                processInstanceId: processInstanceId,
                processDefinitionId: processDefinitionId
            }
        );
        this.taskListService.getTasks(requestNode).subscribe(
            (response) => {
                if (response && response.length > 0) {
                    this.taskDetails = new TaskDetailsModel(response[0]);
                } else {
                    this.reset();
                }
            }, (error) => {
                this.error.emit(error);
            });
    }

    /**
     * Complete button clicked
     */
    onComplete(): void {
        this.taskListService
            .completeTask(this.taskId)
            .subscribe(() => this.onFormCompleted(null));
    }

    onShowAttachForm() {
        this.showAttachForm = true;
    }

    onCancelAttachForm() {
        this.showAttachForm = false;
    }

    onCompleteAttachForm() {
        this.showAttachForm = false;
        this.loadDetails(this.taskId);
    }

    onFormContentClick(content: ContentLinkModel): void {
        this.formContentClicked.emit(content);
    }

    onFormSaved(form: FormModel): void {
        this.formSaved.emit(form);
    }

    onFormCompleted(form: FormModel): void {
        this.formCompleted.emit(form);
        if (this.showNextTask && (this.taskDetails.processInstanceId || this.taskDetails.processDefinitionId)) {
            this.loadNextTask(this.taskDetails.processInstanceId, this.taskDetails.processDefinitionId);
        }
    }

    onFormLoaded(form: FormModel): void {
        this.taskFormName = (form && form.name ? form.name : null);
        this.formLoaded.emit(form);
    }

    onChecklistTaskCreated(task: TaskDetailsModel): void {
        this.taskCreated.emit(task);
    }

    onChecklistTaskDeleted(taskId: string): void {
        this.taskDeleted.emit(taskId);
    }

    onFormError(error: any): void {
        this.errorDialogRef = this.dialog.open(this.errorDialog, { width: '500px' });
        this.error.emit(error);
    }

    onFormExecuteOutcome(event: FormOutcomeEvent): void {
        this.executeOutcome.emit(event);
    }

    closeErrorDialog(): void {
        this.dialog.closeAll();
    }

    onClaimAction(taskId: string): void {
        this.claimedTask.emit(taskId);
        this.loadDetails(taskId);
    }

    onUnclaimAction(taskId: string): void {
        this.unClaimedTask.emit(taskId);
        this.loadDetails(taskId);
    }

    isCompletedTask(): boolean {
        return this.taskDetails && this.taskDetails.endDate ? true : undefined;
    }

    searchUser(searchedWord: string) {
        this.peopleProcessService.getWorkflowUsers(null, searchedWord)
            .subscribe(
                users => {
                    users = users.filter((user) => user.id !== this.taskDetails.assignee.id);
                    this.peopleSearchObserver.next(users);
                },
                () => this.logService.error('Could not load users')
            );
    }

    onCloseSearch() {
        this.showAssignee = false;
    }

    assignTaskToUser(selectedUser: UserProcessModel) {
        this.taskListService
            .assignTask(this.taskDetails.id, selectedUser)
            .subscribe(() => {
                this.logService.info('Task Assigned to ' + selectedUser.email);
                this.assignTask.emit();
            });
        this.showAssignee = false;
    }

    getTaskHeaderViewClass(): string {
        if (this.showAssignee) {
            return 'assign-edit-view';
        } else {
            return 'default-view';
        }
    }

    isReadOnlyComment(): boolean {
        return (this.taskDetails && this.taskDetails.isCompleted()) && (this.taskPeople && this.taskPeople.length === 0);
    }
}
