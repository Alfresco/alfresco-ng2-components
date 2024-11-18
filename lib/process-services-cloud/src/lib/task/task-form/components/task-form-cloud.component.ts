/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    DestroyRef,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { TaskDetailsCloudModel } from '../../start-task/models/task-details-cloud.model';
import { TaskCloudService } from '../../services/task-cloud.service';
import { ContentLinkModel, FORM_FIELD_VALIDATORS, FormFieldValidator, FormModel, FormOutcomeEvent, FormRenderingService } from '@alfresco/adf-core';
import { AttachFileCloudWidgetComponent } from '../../../form/components/widgets/attach-file/attach-file-cloud-widget.component';
import { DropdownCloudWidgetComponent } from '../../../form/components/widgets/dropdown/dropdown-cloud.widget';
import { DateCloudWidgetComponent } from '../../../form/components/widgets/date/date-cloud.widget';
import { FormCloudDisplayModeConfiguration } from '../../../services/form-fields.interfaces';
import { FormCloudComponent } from '../../../form/components/form-cloud.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-cloud-task-form',
    templateUrl: './task-form-cloud.component.html',
    styleUrls: ['./task-form-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskFormCloudComponent implements OnInit, OnChanges {
    /** App id to fetch corresponding form and values. */
    @Input()
    appName: string = '';

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

    /** FormFieldValidator allow to provide additional validators to the form field. */
    @Input()
    fieldValidators: FormFieldValidator[];

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

    /**
     * Emitted when a task is loaded`.
     */
    @Output()
    onTaskLoaded = new EventEmitter<TaskDetailsCloudModel>(); /* eslint-disable-line */

    /** Emitted when a display mode configuration is turned on. */
    @Output()
    displayModeOn = new EventEmitter<FormCloudDisplayModeConfiguration>();

    /** Emitted when a display mode configuration is turned off. */
    @Output()
    displayModeOff = new EventEmitter<FormCloudDisplayModeConfiguration>();

    @ViewChild('adfCloudForm', { static: false })
    adfCloudForm: FormCloudComponent;

    taskDetails: TaskDetailsCloudModel;

    candidateUsers: string[] = [];
    candidateGroups: string[] = [];

    loading: boolean = false;
    private readonly destroyRef = inject(DestroyRef);

    constructor(private taskCloudService: TaskCloudService, private formRenderingService: FormRenderingService) {
        this.formRenderingService.setComponentTypeResolver('upload', () => AttachFileCloudWidgetComponent, true);
        this.formRenderingService.setComponentTypeResolver('dropdown', () => DropdownCloudWidgetComponent, true);
        this.formRenderingService.setComponentTypeResolver('date', () => DateCloudWidgetComponent, true);
    }

    ngOnInit() {
        this.initFieldValidators();

        if (this.appName === '' && this.taskId) {
            this.loadTask();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        const appName = changes['appName'];
        if (appName && appName.currentValue !== appName.previousValue && this.taskId) {
            this.loadTask();
            return;
        }

        const taskId = changes['taskId'];
        if (taskId?.currentValue && this.appName) {
            this.loadTask();
            return;
        }
    }

    private initFieldValidators() {
        this.fieldValidators = this.fieldValidators ? [...FORM_FIELD_VALIDATORS, ...this.fieldValidators] : [...FORM_FIELD_VALIDATORS];
    }

    private loadTask() {
        this.loading = true;
        this.taskCloudService
            .getTaskById(this.appName, this.taskId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((details) => {
                this.taskDetails = details;
                this.loading = false;
                this.onTaskLoaded.emit(this.taskDetails);
            });

        this.taskCloudService.getCandidateUsers(this.appName, this.taskId).subscribe((users) => (this.candidateUsers = users || []));

        this.taskCloudService.getCandidateGroups(this.appName, this.taskId).subscribe((groups) => (this.candidateGroups = groups || []));
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

    hasCandidateUsers(): boolean {
        return this.candidateUsers.length !== 0;
    }

    hasCandidateGroups(): boolean {
        return this.candidateGroups.length !== 0;
    }

    hasCandidateUsersOrGroups(): boolean {
        return this.hasCandidateUsers() || this.hasCandidateGroups();
    }

    canUnclaimTask(): boolean {
        return !this.readOnly && this.taskCloudService.canUnclaimTask(this.taskDetails) && this.hasCandidateUsersOrGroups();
    }

    isReadOnly(): boolean {
        return this.readOnly || !this.taskCloudService.canCompleteTask(this.taskDetails);
    }

    onCompleteTask() {
        this.loadTask();
        this.taskCompleted.emit(this.taskId);
    }

    onClaimTask() {
        this.loadTask();
        this.taskClaimed.emit(this.taskId);
    }

    onUnclaimTask() {
        this.loadTask();
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
