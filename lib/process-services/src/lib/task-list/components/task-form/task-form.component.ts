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
import { FormModel, ContentLinkModel, FormRenderingService, FormFieldValidator, FormOutcomeEvent, AuthenticationService, TranslationService } from '@alfresco/adf-core';
import { TaskDetailsModel } from '../../models/task-details.model';
import { TaskListService } from '../../services/tasklist.service';
import { UserRepresentation } from '@alfresco/js-api';
import { AttachFileWidgetComponent } from '../../../content-widget/attach-file-widget.component';
import { AttachFolderWidgetComponent } from '../../../content-widget/attach-folder-widget.component';
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

  /** Toggles rendering of the `Complete` button. */
  @Input()
  showAttacheFormButton: boolean = true;

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

  /** Emitted when any outcome is executed. Default behaviour can be prevented
   * via `event.preventDefault()`.
   */
  @Output()
  executeOutcome: EventEmitter<FormOutcomeEvent> = new EventEmitter<FormOutcomeEvent>();

  @Output()
  cancel: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  executeNoFormOutcome: EventEmitter<void> = new EventEmitter<void>();

  /** Emitted when the form associated with the form task is attached. */
  @Output()
  showAttachForm: EventEmitter<void> = new EventEmitter<void>();

  /** Emitted when an error occurs. */
  @Output()
  error: EventEmitter<any> = new EventEmitter<any>();

  taskDetails: TaskDetailsModel;
  currentLoggedUser: UserRepresentation;
  loading: boolean = false;
  completedTaskMessage: string;

  constructor(
    private taskListService: TaskListService,
    private authService: AuthenticationService,
    private formRenderingService: FormRenderingService,
    private translationService: TranslationService
  ) {
    this.formRenderingService.setComponentTypeResolver('upload', () => AttachFileWidgetComponent, true);
    this.formRenderingService.setComponentTypeResolver('select-folder', () => AttachFolderWidgetComponent, true);
  }

  ngOnInit() {
    this.authService.getBpmLoggedUser().subscribe(user => {
      this.currentLoggedUser = user;
    });
    if (this.taskId) {
        this.loadTask();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const taskId = changes['taskId'];
    if (taskId && taskId.currentValue) {
        this.loadTask();
        return;
    }
  }

  loadTask() {
    this.loading = true;
    this.taskListService.getTaskDetails(this.taskId).subscribe(
        (res: TaskDetailsModel) => {
            this.taskDetails = res;

            if (!this.taskDetails.name) {
                this.taskDetails.name = 'No name';
            }

            const endDate: any = res.endDate;
            this.readOnlyForm = !!(endDate && !isNaN(endDate.getTime()));
            this.loading = false;
        });
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

  hasFormKey(): boolean {
    return (this.taskDetails && (!!this.taskDetails.formKey));
  }

  isProcessTask() {
    return !!this.taskDetails.processDefinitionId;
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
          this.isEmailEqual(this.taskDetails.assignee.email, this.currentLoggedUser.email) :
          this.isExternalIdEqual();
  }

  private isEmailEqual(assigneeMail: string, currentLoggedEmail: string): boolean {
    return assigneeMail.toLocaleLowerCase() === currentLoggedEmail.toLocaleLowerCase();
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
      return this.readOnlyForm || !(this.isAssignedToMe() || this.canInitiatorComplete());
  }

  isSaveButtonVisible(): boolean {
    return this.hasSaveButton() && (!this.canInitiatorComplete() || this.isAssignedToMe());
  }

  onStandaloneTaskComplete() {
    this.taskListService.completeTask(this.taskDetails.id).subscribe(() => this.executeNoFormOutcome.emit());
  }

  onCancelButtonClick() {
    this.cancel.emit();
  }

  canCompleteTask(): boolean {
    return !this.isCompletedTask() && this.isAssignedToMe();
  }

  hasSaveButton(): boolean {
      return this.showFormSaveButton;
  }

  onShowAttachForm() {
    this.showAttachForm.emit();
  }

  getCompletedTaskTranslatedMessage(): Observable<string> {
    return this.translationService.get('ADF_TASK_FORM.COMPLETED_TASK.TITLE', { taskName: this.taskDetails.name });
  }
}
