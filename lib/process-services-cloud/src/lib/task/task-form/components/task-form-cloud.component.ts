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
    Component, EventEmitter, Input, OnChanges,
    Output, SimpleChanges
} from '@angular/core';
import { TaskDetailsCloudModel } from '../../start-task/models/task-details-cloud.model';
import { TaskCloudService } from '../../services/task-cloud.service';
import { FormRenderingService, FormModel, ContentLinkModel } from '@alfresco/adf-core';
import { AttachFileCloudWidgetComponent } from '../../../form/components/attach-file-cloud-widget/attach-file-cloud-widget.component';
import { DropdownCloudWidgetComponent } from '../../../form/components/dropdown-cloud/dropdown-cloud.widget';
import { DateCloudWidgetComponent } from '../../../form/components/date-cloud/date-cloud.widget';

@Component({
    selector: 'adf-cloud-task-form',
    templateUrl: './task-form-cloud.component.html',
    styleUrls: ['./task-form-cloud.component.scss']
})
export class TaskFormCloudComponent implements OnChanges {

    /** App id to fetch corresponding form and values. */
    @Input()
    appName: string;

    /** Task id to fetch corresponding form and values. */
    @Input()
    taskId: string;

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

    taskDetails: TaskDetailsCloudModel;

    candidateUsers: Array<string>;
    candidateGroups: Array<string>;

    loading: boolean = false;

    constructor(
        private taskCloudService: TaskCloudService,
        private formRenderingService: FormRenderingService) {
        this.formRenderingService.setComponentTypeResolver('upload', () => AttachFileCloudWidgetComponent, true);
        this.formRenderingService.setComponentTypeResolver('dropdown', () => DropdownCloudWidgetComponent, true);
        this.formRenderingService.setComponentTypeResolver('date', () => DateCloudWidgetComponent, true);
    }

    ngOnChanges(changes: SimpleChanges) {
        const appName = changes['appName'];
        if (appName && (appName.currentValue || appName.currentValue === '') && this.taskId) {
            this.loadTask();
            return;
        }

        const taskId = changes['taskId'];
        if (taskId && taskId.currentValue && this.appName) {
            this.loadTask();
            return;
        }

    }

    loadTask() {
        this.loading = true;
        this.taskCloudService.getTaskById(this.appName, this.taskId).subscribe((details: TaskDetailsCloudModel) => {
            this.taskDetails = details;
            this.loading = false;
        });

        this.taskCloudService.getCandidateUsers(this.appName, this.taskId).subscribe((users: Array<string>) => {
            this.candidateUsers = users;
        });

        this.taskCloudService.getCandidateGroups(this.appName, this.taskId).subscribe((groups: Array<string>) => {
            this.candidateGroups = groups;
        });

    }

    private reloadTask() {
        this.loadTask();
    }

    hasForm(): boolean {
        return this.taskDetails && !!this.taskDetails.formKey;
    }

    canCompleteTask(): boolean {
        return this.showCompleteButton && !this.readOnly && this.taskCloudService.canCompleteTask(this.taskDetails);
    }

    canClaimTask(): boolean {
        return !this.readOnly && this.taskCloudService.canClaimTask(this.taskDetails);
    }

    hasCandidateUsers(): boolean {
        return this.candidateUsers.length !== 0;
    }

    hasCandidateGroups(): boolean {
        return this.candidateGroups.length !== 0;
    }

    hasCandidateUsersOrGroups(): boolean {
        let hasCandidateUsersOrGroups = false;

        if (this.taskDetails.status === 'ASSIGNED') {
            hasCandidateUsersOrGroups = this.hasCandidateUsers() || this.hasCandidateGroups();
        }
        return hasCandidateUsersOrGroups;
    }

    canUnclaimTask(): boolean {
        return !this.readOnly && this.taskCloudService.canUnclaimTask(this.taskDetails);
    }

    isReadOnly(): boolean {
        return this.readOnly || !this.taskCloudService.canCompleteTask(this.taskDetails);
    }

    onCompleteTask() {
        this.reloadTask();
        this.taskCompleted.emit(this.taskId);
    }

    onClaimTask() {
        this.reloadTask();
        this.taskClaimed.emit(this.taskId);
    }

    onUnclaimTask() {
        this.reloadTask();
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
}
