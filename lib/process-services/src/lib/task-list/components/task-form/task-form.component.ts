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

import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import {
  FormModel,
  ContentLinkModel,
  FormFieldValidator,
  FormOutcomeEvent,
  AuthenticationService,
  TranslationService,
  FormFieldModel
} from '@alfresco/adf-core';
import { TaskDetailsModel } from '../../models/task-details.model';
import { TaskListService } from '../../services/tasklist.service';
import { UserRepresentation } from '@alfresco/js-api';
import { Observable } from 'rxjs';

@Component({
  selector: 'adf-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {

  /** (**required**) The id of the task whose details we are asking for. */
  @Input()
  taskId: string;

  /** Toggles rendering of the form title. */
  @Input()
  showFormTitle: boolean = false;

  /** Toggles rendering of the `Complete` outcome button. */
  @Input()
  showFormCompleteButton: boolean = true;

  /** Toggles rendering of the `Save` outcome button. */
  @Input()
  showFormSaveButton: boolean = true;

  /** Toggle rendering of the `Cancel` button. */
  @Input()
  showCancelButton: boolean = true;

  /** Toggles read-only state of the form. All form widgets render as read-only
   * if enabled.
   */
  @Input()
  readOnlyForm: boolean = false;

  /** Toggles rendering of the `Refresh` button. */
  @Input()
  showFormRefreshButton: boolean = true;

  /** Toggle rendering of the validation icon next to the form title. */
  @Input()
  showFormValidationIcon: boolean = true;

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

  /** Emitted when the form associated with the form task is attached. */
  @Output()
  showAttachForm: EventEmitter<void> = new EventEmitter<void>();

  /** Emitted when any outcome is executed. Default behaviour can be prevented
   * via `event.preventDefault()`.
   */
  @Output()
  executeOutcome = new EventEmitter<FormOutcomeEvent>();

  /** Emitted when the form associated with the task is completed. */
  @Output()
  completed = new EventEmitter<void>();

  /** Emitted when the supplied form values have a validation error. */
  @Output()
  formError: EventEmitter<FormFieldModel[]> = new EventEmitter<FormFieldModel[]>();

  /** Emitted when an error occurs. */
  @Output()
  error = new EventEmitter<any>();

  /** Emitted when the "Cancel" button is clicked. */
  @Output()
  cancel = new EventEmitter<void>();

  /** Emitted when the task is claimed. */
  @Output()
  claim: EventEmitter<any> = new EventEmitter<any>();

  /** Emitted when the task is unclaimed (ie, requeued). */
  @Output()
  unclaim: EventEmitter<any> = new EventEmitter<any>();

  taskDetails: TaskDetailsModel;
  currentLoggedUser: UserRepresentation;
  loading: boolean = false;
  completedTaskMessage: string;
  internalReadOnlyForm: boolean = false;

  constructor(
    private taskListService: TaskListService,
    private authService: AuthenticationService,
    private translationService: TranslationService
  ) {
  }

  ngOnInit() {
    this.authService.getBpmLoggedUser().subscribe(user => {
      this.currentLoggedUser = user;
    });
    this.loadTask(this.taskId);
  }

  ngOnChanges(changes: SimpleChanges) {
    const taskId = changes['taskId'];
    if (taskId && taskId.currentValue) {
        this.loadTask(this.taskId);
        return;
    }
  }

  loadTask(taskId: string) {
    this.loading = true;
    if (taskId) {
      this.taskListService.getTaskDetails(taskId).subscribe(
        (res: TaskDetailsModel) => {
            this.taskDetails = res;

            if (!this.taskDetails.name) {
                this.taskDetails.name = 'No name';
            }

            const endDate: any = res.endDate;
            if (endDate && !isNaN(endDate.getTime())) {
              this.internalReadOnlyForm = true;
            } else {
                this.internalReadOnlyForm = this.readOnlyForm;
            }
            this.loading = false;
        });
    }
  }

  onFormSaved(savedForm: FormModel) {
    this.formSaved.emit(savedForm);
  }

  onFormCompleted(form: FormModel) {
      this.formCompleted.emit(form);
  }

  onFormLoaded(form: FormModel): void {
    this.formLoaded.emit(form);
  }

  onFormContentClick(content: ContentLinkModel): void {
      this.formContentClicked.emit(content);
  }

  onFormExecuteOutcome(outcome: FormOutcomeEvent) {
    this.executeOutcome.emit(outcome);
  }

  onFormError(error: any) {
    this.formError.emit(error);
  }

  onError(error: any) {
    this.error.emit(error);
  }

  onCompleteTask() {
    this.taskListService.completeTask(this.taskDetails.id).subscribe(
      () => this.completed.emit(),
      (error) => this.error.emit(error));
  }

  onCancel() {
    this.cancel.emit();
  }

  onShowAttachForm() {
    this.showAttachForm.emit();
  }

  hasFormKey(): boolean {
    return (this.taskDetails && (!!this.taskDetails.formKey));
  }

  isStandaloneTask(): boolean {
    return !(this.taskDetails && (!!this.taskDetails.processDefinitionId));
  }

  isTaskLoaded(): boolean {
      return !!this.taskDetails;
  }

  isCompletedTask(): boolean {
      return this.taskDetails && this.taskDetails.endDate !== undefined && this.taskDetails.endDate !== null;
  }

  isCompleteButtonVisible(): boolean {
      return !this.hasFormKey() && this.isTaskActive() && this.isCompleteButtonEnabled();
  }

  isTaskActive() {
    return this.taskDetails && this.taskDetails.duration === null;
  }

  isAssigned(): boolean {
    return !!this.taskDetails.assignee;
  }

  private hasEmailAddress(): boolean {
        return this.taskDetails.assignee.email ? true : false;
  }

  isAssignedToMe(): boolean {
      return this.isAssigned() && this.hasEmailAddress() ?
          this.isEmailEqual() :
          this.isExternalIdEqual();
  }

  private isEmailEqual(): boolean {
    return (this.taskDetails.assignee && this.currentLoggedUser) && ( this.taskDetails.assignee.email.toLocaleLowerCase() === this.currentLoggedUser.email.toLocaleLowerCase());
  }

  private isExternalIdEqual(): boolean {
    return (this.taskDetails.assignee && this.currentLoggedUser) && (this.taskDetails.assignee.externalId === this.currentLoggedUser.externalId);
  }

  isCompleteButtonEnabled(): boolean {
    return this.isAssignedToMe() || this.canInitiatorComplete();
  }

  canInitiatorComplete(): boolean {
      return this.taskDetails.initiatorCanCompleteTask;
  }

  isReadOnlyForm(): boolean {
      return this.internalReadOnlyForm || !(this.isAssignedToMe() || this.canInitiatorComplete());
  }

  isSaveButtonVisible(): boolean {
    return this.showFormSaveButton && (!this.canInitiatorComplete() || this.isAssignedToMe());
  }

  canCompleteTask(): boolean {
    return !this.isCompletedTask() && this.isAssignedToMe();
  }

  getCompletedTaskTranslatedMessage(): Observable<string> {
    return this.translationService.get('ADF_TASK_FORM.COMPLETED_TASK.TITLE', { taskName: this.taskDetails.name });
  }

  isCandidateMember(): boolean {
      return this.taskDetails.managerOfCandidateGroup || this.taskDetails.memberOfCandidateGroup || this.taskDetails.memberOfCandidateUsers;
  }

  public isTaskClaimable(): boolean {
      return this.isCandidateMember() && !this.isAssigned();
  }

  public isTaskClaimedByCandidateMember(): boolean {
    return this.isCandidateMember() && this.isAssignedToMe() && !this.isCompletedTask();
  }

  reloadTask(taskId: string) {
    this.loadTask(taskId);
  }

  onClaimTask(taskId: string) {
    this.claim.emit(taskId);
  }

  onUnclaimTask(taskId: string) {
    this.unclaim.emit(taskId);
  }
}
