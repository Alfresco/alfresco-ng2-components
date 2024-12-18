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

import { ContentLinkModel, FormFieldValidator, FormModel, FormOutcomeEvent } from '@alfresco/adf-core';
import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormCloudDisplayModeConfiguration } from '../../../../services/form-fields.interfaces';
import { TaskCloudService } from '../../../services/task-cloud.service';
import { TaskDetailsCloudModel } from '../../../start-task/models/task-details-cloud.model';
import { TaskFormCloudComponent } from '../task-form-cloud/task-form-cloud.component';

const TaskTypes = {
    Form: 'form',
    Screen: 'screen',
    None: ''
} as const;

type TaskTypesType = (typeof TaskTypes)[keyof typeof TaskTypes];

@Component({
    selector: 'adf-cloud-user-task',
    templateUrl: './user-task-cloud.component.html',
    styleUrls: ['./user-task-cloud.component.scss']
})
export class UserTaskCloudComponent implements OnInit, OnChanges {
    @ViewChild('adfCloudTaskForm')
    adfCloudTaskForm: TaskFormCloudComponent;

    /** App id to fetch corresponding form and values. */
    @Input()
    appName: string = '';

    /** The available display configurations for the form */
    @Input()
    displayModeConfigurations: FormCloudDisplayModeConfiguration[];

    /** FormFieldValidator allow to provide additional validators to the form field. */
    @Input()
    fieldValidators: FormFieldValidator[];

    /** Toggle readonly state of the task. */
    @Input()
    readOnly = false;

    /** Toggle rendering of the `Cancel` button. */
    @Input()
    showCancelButton = true;

    /** Toggle rendering of the `Complete` button. */
    @Input()
    showCompleteButton = true;

    /** Toggle rendering of the form title. */
    @Input()
    showTitle: boolean = true;

    /** Toggle rendering of the `Validation` icon. */
    @Input()
    showValidationIcon = true;

    /** Task id to fetch corresponding form and values. */
    @Input()
    taskId: string;

    /** Emitted when the cancel button is clicked. */
    @Output()
    cancelClick = new EventEmitter<string>();

    /** Emitted when any error occurs. */
    @Output()
    error = new EventEmitter<any>();

    /**
     * Emitted when any outcome is executed. Default behaviour can be prevented
     * via `event.preventDefault()`.
     */
    @Output()
    executeOutcome = new EventEmitter<FormOutcomeEvent>();

    /** Emitted when form content is clicked. */
    @Output()
    formContentClicked: EventEmitter<ContentLinkModel> = new EventEmitter();

    /** Emitted when the form is saved. */
    @Output()
    formSaved = new EventEmitter<FormModel>();

    /**
     * Emitted when a task is loaded`.
     */
    @Output()
    onTaskLoaded = new EventEmitter<TaskDetailsCloudModel>(); /* eslint-disable-line */

    /** Emitted when the task is claimed. */
    @Output()
    taskClaimed = new EventEmitter<string>();

    /** Emitted when the task is unclaimed. */
    @Output()
    taskUnclaimed = new EventEmitter<string>();

    /** Emitted when the task is completed. */
    @Output()
    taskCompleted = new EventEmitter<string>();

    candidateUsers: string[] = [];
    candidateGroups: string[] = [];
    loading: boolean = false;
    screenId: string;
    taskDetails: TaskDetailsCloudModel;
    taskType: TaskTypesType;
    taskTypeEnum = TaskTypes;

    private taskCloudService: TaskCloudService = inject(TaskCloudService);
    private readonly destroyRef = inject(DestroyRef);

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

    ngOnInit() {
        if (this.appName === '' && this.taskId) {
            this.loadTask();
        }
    }

    canClaimTask(): boolean {
        return !this.readOnly && this.taskCloudService.canClaimTask(this.taskDetails) && this.hasCandidateUsersOrGroups();
    }

    canCompleteTask(): boolean {
        return this.showCompleteButton && !this.readOnly && this.taskCloudService.canCompleteTask(this.taskDetails);
    }

    canUnclaimTask(): boolean {
        return !this.readOnly && this.taskCloudService.canUnclaimTask(this.taskDetails) && this.hasCandidateUsersOrGroups();
    }

    getTaskType(): void {
        if (this.taskDetails && !!this.taskDetails.formKey && this.taskDetails.formKey.includes(this.taskTypeEnum.Form)) {
            this.taskType = this.taskTypeEnum.Form;
        } else if (this.taskDetails && !!this.taskDetails.formKey && this.taskDetails.formKey.includes(this.taskTypeEnum.Screen)) {
            this.taskType = this.taskTypeEnum.Screen;
            const screenId = this.taskDetails.formKey.replace(this.taskTypeEnum.Screen + '-', '');
            this.screenId = screenId;
        } else {
            this.taskType = this.taskTypeEnum.None;
        }
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

    onCancelForm(): void {
        this.cancelClick.emit();
    }

    onCancelClick(): void {
        this.cancelClick.emit(this.taskId);
    }

    onClaimTask(): void {
        this.loadTask();
        this.taskClaimed.emit(this.taskId);
    }

    onCompleteTask(): void {
        this.loadTask();
        this.taskCompleted.emit(this.taskId);
    }

    onCompleteTaskForm(): void {
        this.taskCompleted.emit();
    }

    onError(data: any): void {
        this.error.emit(data);
    }

    onExecuteOutcome(outcome: FormOutcomeEvent): void {
        this.executeOutcome.emit(outcome);
    }
    onFormContentClicked(content: ContentLinkModel): void {
        this.formContentClicked.emit(content);
    }
    onFormSaved(): void {
        this.formSaved.emit();
    }

    onTaskUnclaimed(): void {
        this.taskUnclaimed.emit();
    }

    onUnclaimTask(): void {
        this.loadTask();
        this.taskUnclaimed.emit(this.taskId);
    }

    private loadTask(): void {
        this.loading = true;
        this.taskCloudService
            .getTaskById(this.appName, this.taskId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((details) => {
                this.taskDetails = details;
                this.getTaskType();
                this.loading = false;
                this.onTaskLoaded.emit(this.taskDetails);
            });

        this.taskCloudService.getCandidateUsers(this.appName, this.taskId).subscribe((users) => (this.candidateUsers = users || []));
        this.taskCloudService.getCandidateGroups(this.appName, this.taskId).subscribe((groups) => (this.candidateGroups = groups || []));
    }

    public switchToDisplayMode(newDisplayMode?: string): void {
        if (this.adfCloudTaskForm) {
            this.adfCloudTaskForm.switchToDisplayMode(newDisplayMode);
        }
    }
}
