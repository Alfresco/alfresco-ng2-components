/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewEncapsulation, OnChanges } from '@angular/core';
import {
    FormModel,
    ContentLinkModel,
    FormFieldValidator,
    FormOutcomeEvent,
    TranslationService,
    FormFieldModel
} from '@alfresco/adf-core';
import { TaskDetailsModel } from '../../models/task-details.model';
import { TaskListService } from '../../services/tasklist.service';
import { UserRepresentation, LightGroupRepresentation, LightUserRepresentation } from '@alfresco/js-api';
import { Observable } from 'rxjs';
import { PeopleProcessService } from '../../../common/services/people-process.service';

@Component({
  selector: 'adf-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskFormComponent implements OnInit, OnChanges {

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
  showAttachForm = new EventEmitter<void>();

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
  formError = new EventEmitter<FormFieldModel[]>();

  /** Emitted when an error occurs. */
  @Output()
  error = new EventEmitter<any>();

  /** Emitted when the "Cancel" button is clicked. */
  @Output()
  cancel = new EventEmitter<void>();

  /** Emitted when the task is claimed. */
  @Output()
  taskClaimed = new EventEmitter<string>();

  /** Emitted when the task is unclaimed (ie, requeued).. */
  @Output()
  taskUnclaimed = new EventEmitter<string>();

  taskDetails: TaskDetailsModel;
  currentLoggedUser: UserRepresentation;
  loading: boolean = false;
  completedTaskMessage: string;
  internalReadOnlyForm: boolean = false;

  constructor(
    private taskListService: TaskListService,
    private peopleProcessService: PeopleProcessService,
    private translationService: TranslationService
  ) {
  }

  ngOnInit() {
    this.peopleProcessService.getCurrentUserInfo().subscribe(user => {
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

  isAssignedToMe(): boolean {
      return this.isAssigned() && this.hasEmailAddress() ?
          this.isEmailEqual() :
          this.isExternalIdEqual();
  }

  isCompleteButtonEnabled(): boolean {
    return this.isAssignedToMe() || this.canInitiatorComplete();
  }

  canInitiatorComplete(): boolean {
      return this.taskDetails.initiatorCanCompleteTask;
  }

  isReadOnlyForm(): boolean {
    let readOnlyForm: boolean;
    if (this.isCandidateMember()) {
      readOnlyForm = this.internalReadOnlyForm || !this.isAssignedToMe();
    } else {
      readOnlyForm = this.internalReadOnlyForm || !(this.isAssignedToMe() || this.canCurrentUserAsInitiatorComplete() || this.isCurrentUserInvolved());
    }

    return readOnlyForm;
  }

  isCurrentUserInvolved(): boolean {
    let isInvolved = false;
    if (this.taskDetails.involvedPeople && this.currentLoggedUser) {
      const userInvolved = this.taskDetails.involvedPeople.find(
        (involvedUser: LightUserRepresentation) =>
          involvedUser.email.toLocaleLowerCase() === this.currentLoggedUser.email.toLocaleLowerCase() ||
          involvedUser.id + '' === this.currentLoggedUser.externalId
        );
      isInvolved = !!userInvolved;
    }

    if (this.taskDetails.involvedGroups?.length && this.currentLoggedUser.groups?.length && !isInvolved) {
        const userGroup = this.taskDetails.involvedGroups.find(
            (involvedGroup: LightGroupRepresentation) =>
                this.currentLoggedUser.groups.find(
                    group => group.name === involvedGroup.name.toLocaleLowerCase() || group.id === involvedGroup.id
                )
        );
        isInvolved = !!userGroup;
    }
    return isInvolved;
  }

  canCurrentUserAsInitiatorComplete(): boolean {
    return this.canInitiatorComplete() && this.isProcessInitiator();
  }

  isProcessInitiator(): boolean {
    return this.currentLoggedUser && ( this.currentLoggedUser.id === +this.taskDetails.processInstanceStartUserId);
  }

  isSaveButtonVisible(): boolean {
    return this.showFormSaveButton && (!this.canInitiatorComplete() || this.isAssignedToMe() || this.isCurrentUserInvolved());
  }

  canCompleteNoFormTask(): boolean {
    return this.isReadOnlyForm();
  }

  getCompletedTaskTranslatedMessage(): Observable<string> {
    return this.translationService.get('ADF_TASK_FORM.COMPLETED_TASK.TITLE', { taskName: this.taskDetails.name });
  }

  isCandidateMember(): boolean {
      return this.taskDetails.managerOfCandidateGroup || this.taskDetails.memberOfCandidateGroup || this.taskDetails.memberOfCandidateUsers;
  }

  isTaskClaimable(): boolean {
      return this.isCandidateMember() && !this.isAssigned();
  }

  isTaskClaimedByCandidateMember(): boolean {
    return this.isCandidateMember() && this.isAssignedToMe() && !this.isCompletedTask();
  }

  reloadTask() {
    this.loadTask(this.taskId);
  }

  onClaimTask(taskId: string) {
    this.taskClaimed.emit(taskId);
  }

  onClaimTaskError(error: any) {
    this.error.emit(error);
  }

  onUnclaimTask(taskId: string) {
    this.taskUnclaimed.emit(taskId);
  }

  onUnclaimTaskError(error: any) {
    this.error.emit(error);
  }

  private hasEmailAddress(): boolean {
    return this.taskDetails.assignee.email ? true : false;
  }

  private isEmailEqual(): boolean {
    return (this.taskDetails.assignee && this.currentLoggedUser) && ( this.taskDetails.assignee.email.toLocaleLowerCase() === this.currentLoggedUser.email.toLocaleLowerCase());
  }

  private isExternalIdEqual(): boolean {
    return (this.taskDetails.assignee && this.currentLoggedUser) && (this.taskDetails.assignee.externalId === this.currentLoggedUser.externalId);
  }
}
