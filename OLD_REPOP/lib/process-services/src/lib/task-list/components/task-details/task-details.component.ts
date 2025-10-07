/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    ADF_COMMENTS_SERVICE,
    CardViewUpdateService,
    ClickNotification,
    ContentLinkModel,
    FormFieldValidator,
    FormModel,
    FormOutcomeEvent,
    InfoDrawerComponent,
    InfoDrawerTabComponent,
    UpdateNotification
} from '@alfresco/adf-core';
import {
    Component,
    DestroyRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable, Observer, of } from 'rxjs';
import { TaskListService } from '../../services/tasklist.service';
import { catchError, share } from 'rxjs/operators';
import { TaskFormComponent } from '../task-form/task-form.component';
import { PeopleProcessService } from '../../../services/people-process.service';
import { LightUserRepresentation, TaskQueryRepresentation, TaskRepresentation } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AttachFormComponent } from '../attach-form/attach-form.component';
import { PeopleComponent, PeopleSearchComponent } from '../../../people';
import { TaskHeaderComponent } from '../task-header/task-header.component';
import { TaskCommentsComponent, TaskCommentsService } from '../../../task-comments';
import { ChecklistComponent } from '../checklist/checklist.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/** @deprecated no longer used anywhere, and can be safely removed */
@Component({
    selector: 'adf-task-details',
    imports: [
        CommonModule,
        TranslatePipe,
        TaskFormComponent,
        AttachFormComponent,
        PeopleSearchComponent,
        TaskHeaderComponent,
        PeopleComponent,
        TaskCommentsComponent,
        ChecklistComponent,
        MatDialogModule,
        MatButtonModule,
        InfoDrawerTabComponent,
        InfoDrawerComponent,
        MatCardModule
    ],
    providers: [
        {
            provide: ADF_COMMENTS_SERVICE,
            useClass: TaskCommentsService
        }
    ],
    templateUrl: './task-details.component.html',
    styleUrls: ['./task-details.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskDetailsComponent implements OnInit, OnChanges {
    @ViewChild('errorDialog')
    errorDialog: TemplateRef<any>;

    @ViewChild('taskForm')
    taskFormComponent: TaskFormComponent;

    /** (**required**) The id of the task whose details we are asking for. */
    @Input({ required: true })
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

    /**
     * Toggles read-only state of the form. All form widgets render as read-only
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
    formSaved = new EventEmitter<FormModel>();

    /** Emitted when the form is submitted with the `Complete` outcome. */
    @Output()
    formCompleted = new EventEmitter<FormModel>();

    /** Emitted when the form field content is clicked. */
    @Output()
    formContentClicked = new EventEmitter<ContentLinkModel>();

    /** Emitted when the form is loaded or reloaded. */
    @Output()
    formLoaded = new EventEmitter<FormModel>();

    /** Emitted when a checklist task is created. */
    @Output()
    taskCreated = new EventEmitter<TaskRepresentation>();

    /** Emitted when a checklist task is deleted. */
    @Output()
    taskDeleted = new EventEmitter<string>();

    /** Emitted when an error occurs. */
    @Output()
    error = new EventEmitter<any>();

    /**
     * Emitted when any outcome is executed. Default behaviour can be prevented
     * via `event.preventDefault()`.
     */
    @Output()
    executeOutcome = new EventEmitter<FormOutcomeEvent>();

    /** Emitted when a task is assigned. */
    @Output()
    assignTask = new EventEmitter<void>();

    /** Emitted when a task is claimed. */
    @Output()
    claimedTask = new EventEmitter<string>();

    /** Emitted when a task is unclaimed. */
    @Output()
    unClaimedTask = new EventEmitter<string>();

    taskDetails: TaskRepresentation;
    taskFormName: string = null;
    taskPeople: LightUserRepresentation[] = [];
    noTaskDetailsTemplateComponent: TemplateRef<any>;
    showAssignee = false;
    showAttachForm = false;
    internalReadOnlyForm = false;
    errorDialogRef: MatDialogRef<TemplateRef<any>>;
    peopleSearch: Observable<LightUserRepresentation[]>;
    data: any;

    private peopleSearchObserver: Observer<LightUserRepresentation[]>;

    constructor(
        private readonly taskListService: TaskListService,
        private readonly peopleProcessService: PeopleProcessService,
        private readonly cardViewUpdateService: CardViewUpdateService,
        private readonly dialog: MatDialog,
        private readonly destroyRef: DestroyRef
    ) {}

    ngOnInit() {
        this.peopleSearch = new Observable<LightUserRepresentation[]>((observer) => (this.peopleSearchObserver = observer)).pipe(share());

        if (this.taskId) {
            this.loadDetails(this.taskId);
        }

        this.cardViewUpdateService.itemUpdated$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(this.updateTaskDetails.bind(this));

        this.cardViewUpdateService.itemClicked$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(this.clickTaskDetails.bind(this));
    }

    ngOnChanges(changes: SimpleChanges): void {
        const taskId = changes.taskId;
        this.showAssignee = false;

        if (taskId && !taskId.currentValue) {
            this.reset();
        } else if (taskId?.currentValue) {
            this.loadDetails(taskId.currentValue);
        }
    }

    isAssigned(): boolean {
        return !!this.taskDetails.assignee;
    }

    /**
     * Complete button clicked
     */
    onComplete(): void {
        this.onFormCompleted(null);
    }

    onShowAttachForm() {
        this.showAttachForm = true;
    }

    onCancelAttachForm() {
        this.showAttachForm = false;
    }

    onCompleteAttachForm() {
        this.taskFormName = null;
        this.showAttachForm = false;
        this.taskFormComponent.loadTask(this.taskId);
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
        this.taskFormName = form?.name;
        this.formLoaded.emit(form);
    }

    onChecklistTaskCreated(task: TaskRepresentation): void {
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

    searchUser(searchedWord: string) {
        this.peopleProcessService.getWorkflowUsers(null, searchedWord).subscribe((users) => {
            users = users.filter((user) => user.id !== this.taskDetails.assignee.id);
            this.peopleSearchObserver.next(users);
        });
    }

    onCloseSearch() {
        this.showAssignee = false;
    }

    assignTaskToUser(selectedUser: LightUserRepresentation) {
        this.taskListService.assignTask(this.taskDetails.id, selectedUser).subscribe(() => {
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
        return this.taskDetails?.isCompleted() && this.taskPeople?.length === 0;
    }

    private reset() {
        this.taskDetails = null;
    }

    private updateTaskDetails(updateNotification: UpdateNotification) {
        this.taskListService
            .updateTask(this.taskId, updateNotification.changed)
            .pipe(
                catchError(() => {
                    this.cardViewUpdateService.updateElement(updateNotification.target);
                    return of(null);
                })
            )
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

    private loadDetails(taskId: string) {
        this.taskPeople = [];

        if (taskId) {
            this.taskListService.getTaskDetails(taskId).subscribe((res) => {
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

                if (this.taskDetails?.involvedPeople) {
                    this.taskPeople.push(...this.taskDetails.involvedPeople);
                }
            });
        }
    }

    private loadNextTask(processInstanceId: string, processDefinitionId: string): void {
        const requestNode = new TaskQueryRepresentation({
            processInstanceId,
            processDefinitionId
        });
        this.taskListService.getTasks(requestNode).subscribe(
            (response) => {
                if (response && response.length > 0) {
                    this.taskDetails = new TaskRepresentation(response[0]);
                } else {
                    this.reset();
                }
            },
            (error) => {
                this.error.emit(error);
            }
        );
    }
}
