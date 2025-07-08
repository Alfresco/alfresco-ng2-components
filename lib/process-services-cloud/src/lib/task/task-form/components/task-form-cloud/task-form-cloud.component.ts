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

import { ContentLinkModel, FormModel, FormOutcomeEvent, FormRenderingService } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormCloudComponent } from '../../../../form/components/form-cloud.component';
import { AttachFileCloudWidgetComponent } from '../../../../form/components/widgets/attach-file/attach-file-cloud-widget.component';
import { DateCloudWidgetComponent } from '../../../../form/components/widgets/date/date-cloud.widget';
import { DropdownCloudWidgetComponent } from '../../../../form/components/widgets/dropdown/dropdown-cloud.widget';
import { FormCloudDisplayModeConfiguration } from '../../../../services/form-fields.interfaces';
import { TaskCloudService } from '../../../services/task-cloud.service';
import { TaskDetailsCloudModel } from '../../../models/task-details-cloud.model';
import { CommonModule } from '@angular/common';
import { UserTaskCloudButtonsComponent } from '../user-task-cloud-buttons/user-task-cloud-buttons.component';
import { FormCustomOutcomesComponent } from '../../../../form/components/form-cloud-custom-outcomes.component';

@Component({
    selector: 'adf-cloud-task-form',
    imports: [CommonModule, UserTaskCloudButtonsComponent, FormCustomOutcomesComponent, FormCloudComponent],
    templateUrl: './task-form-cloud.component.html',
    styleUrls: ['./task-form-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskFormCloudComponent {
    /** App id to fetch corresponding form and values. */
    @Input()
    appName: string = '';

    /**Candidates users*/
    @Input()
    candidateUsers: string[] = [];

    /**Candidates groups */
    @Input()
    candidateGroups: string[] = [];

    /** Task id to fetch corresponding form and values. */
    @Input()
    taskId: string;

    /** Toggle rendering of the form title. */
    @Input()
    showTitle: boolean = true;

    /** Toggle rendering of the `Refresh` button. */
    @Input()
    showRefreshButton = false;

    /** Toggle rendering of the `Validation` icon. */
    @Input()
    showValidationIcon = true;

    /** Toggle rendering of the `Cancel` button. */
    @Input()
    showCancelButton = true;

    /** Toggle rendering of the `Complete` button. */
    @Input()
    showCompleteButton = true;

    /** Toggle readonly state of the task. */
    @Input()
    readOnly = false;

    /**
     * The available display configurations for the form
     */
    @Input()
    displayModeConfigurations: FormCloudDisplayModeConfiguration[];

    /** Task details. */
    @Input()
    taskDetails: TaskDetailsCloudModel;

    /** Emitted when the form is saved. */
    @Output()
    formSaved = new EventEmitter<FormModel>();

    /** Emitted when the form is submitted with the `Complete` outcome. */
    @Output()
    formCompleted = new EventEmitter<FormModel>();

    /** Emitted when the task is completed. */
    @Output()
    taskCompleted = new EventEmitter<string>();

    /** Emitted when the task is claimed. */
    @Output()
    taskClaimed = new EventEmitter<string>();

    /** Emitted when the task is unclaimed. */
    @Output()
    taskUnclaimed = new EventEmitter<string>();

    /** Emitted when the cancel button is clicked. */
    @Output()
    cancelClick = new EventEmitter<string>();

    /** Emitted when any error occurs. */
    @Output()
    error = new EventEmitter<any>();

    /** Emitted when form content is clicked. */
    @Output()
    formContentClicked: EventEmitter<ContentLinkModel> = new EventEmitter();

    /**
     * Emitted when any outcome is executed. Default behaviour can be prevented
     * via `event.preventDefault()`.
     */
    @Output()
    executeOutcome = new EventEmitter<FormOutcomeEvent>();

    /** Emitted when a display mode configuration is turned on. */
    @Output()
    displayModeOn = new EventEmitter<FormCloudDisplayModeConfiguration>();

    /** Emitted when a display mode configuration is turned off. */
    @Output()
    displayModeOff = new EventEmitter<FormCloudDisplayModeConfiguration>();

    @ViewChild('adfCloudForm', { static: false })
    adfCloudForm: FormCloudComponent;

    loading: boolean = false;

    constructor(private taskCloudService: TaskCloudService, private formRenderingService: FormRenderingService) {
        this.formRenderingService.setComponentTypeResolver('upload', () => AttachFileCloudWidgetComponent, true);
        this.formRenderingService.setComponentTypeResolver('dropdown', () => DropdownCloudWidgetComponent, true);
        this.formRenderingService.setComponentTypeResolver('date', () => DateCloudWidgetComponent, true);
    }

    hasForm(): boolean {
        return this.taskDetails && !!this.taskDetails.formKey;
    }

    canCompleteTask(): boolean {
        return this.showCompleteButton && !this.readOnly && this.taskCloudService.canCompleteTask(this.taskDetails);
    }

    canClaimTask(): boolean {
        return !this.readOnly && this.taskCloudService.canClaimTask(this.taskDetails) && this.hasCandidateUsersOrGroups();
    }

    canUnclaimTask(): boolean {
        return !this.readOnly && this.taskCloudService.canUnclaimTask(this.taskDetails) && this.hasCandidateUsersOrGroups();
    }

    hasCandidateUsers(): boolean {
        return this.candidateUsers.length !== 0;
    }

    hasCandidateGroups(): boolean {
        return this.candidateGroups.length !== 0;
    }

    hasCandidateUsersOrGroups(): boolean {
        return this.hasCandidateUsers() || this.hasCandidateGroups();
    }

    isReadOnly(): boolean {
        return this.readOnly || !this.taskCloudService.canCompleteTask(this.taskDetails);
    }

    onCompleteTask() {
        this.taskCompleted.emit(this.taskId);
    }

    onClaimTask() {
        this.taskClaimed.emit(this.taskId);
    }

    onUnclaimTask() {
        this.taskUnclaimed.emit(this.taskId);
    }

    onCancelClick() {
        this.cancelClick.emit(this.taskId);
    }

    onFormSaved(form: FormModel) {
        this.formSaved.emit(form);
    }

    onFormCompleted(form: FormModel) {
        this.formCompleted.emit(form);
        this.taskCompleted.emit(this.taskId);
    }

    onError(data: any) {
        this.error.emit(data);
    }

    onFormContentClicked(content: ContentLinkModel) {
        this.formContentClicked.emit(content);
    }

    onFormExecuteOutcome(outcome: FormOutcomeEvent) {
        this.executeOutcome.emit(outcome);
    }

    switchToDisplayMode(newDisplayMode?: string) {
        this.adfCloudForm.switchToDisplayMode(newDisplayMode);
    }

    onDisplayModeOn(displayModeConfiguration: FormCloudDisplayModeConfiguration) {
        this.displayModeOn.emit(displayModeConfiguration);
    }

    onDisplayModeOff(displayModeConfiguration: FormCloudDisplayModeConfiguration) {
        this.displayModeOff.emit(displayModeConfiguration);
    }
}
