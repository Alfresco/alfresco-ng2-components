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

import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import {
    CardViewDateItemModel,
    CardViewItem,
    CardViewTextItemModel,
    CardViewBaseItemModel,
    TranslationService,
    AppConfigService,
    UpdateNotification,
    CardViewUpdateService,
    StorageService
} from '@alfresco/adf-core';
import { TaskHeaderCloudService } from '../services/task-header-cloud.service';
import { TaskDetailsCloudModel } from '../../start-task/models/task-details-cloud.model';
import { TaskCloudService } from '../services/task-cloud.service';
import { Router } from '@angular/router';

@Component({
    selector: 'adf-cloud-task-header',
    templateUrl: './task-header-cloud.component.html',
    styleUrls: ['./task-header-cloud.component.scss']
})
export class TaskHeaderCloudComponent implements OnInit {

    /** (Required) The name of the application. */
    @Input()
    appName: string;

    /** (Required) The id of the task. */
    @Input()
    taskId: string;

    /** Toggles Read Only Mode. This disables click selection and editing for all cells. */
    @Input()
    readOnly: boolean = false;

    /** Emitted when the task is claimed. */
    @Output()
    claim: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when the task is unclaimed (ie, requeued). */
    @Output()
    unclaim: EventEmitter<any> = new EventEmitter<any>();

    taskDetails: TaskDetailsCloudModel = new TaskDetailsCloudModel();
    properties: CardViewItem[];
    inEdit: boolean = false;
    parentTaskName: string;
    private currentUser: string;

    constructor(
        private taskHeaderCloudService: TaskHeaderCloudService,
        private translationService: TranslationService,
        private appConfig: AppConfigService,
        private cardViewUpdateService: CardViewUpdateService,
        private storage: StorageService,
        private router: Router,
        private taskCloudService: TaskCloudService
    ) { }

    ngOnInit() {
        this.loadCurrentBpmUserId();
        if (this.appName && this.taskId) {
            this.loadTaskDetailsById(this.appName, this.taskId);
        }

        this.cardViewUpdateService.itemUpdated$.subscribe(this.updateTaskDetails.bind(this));
    }

    loadCurrentBpmUserId(): any {
        this.currentUser = this.storage.getItem('USERNAME');
    }

    loadTaskDetailsById(appName: string, taskId: string): any {
        this.taskHeaderCloudService.getTaskById(appName, taskId).subscribe(
            (taskDetails) => {
                this.taskDetails = taskDetails;
                if (this.taskDetails.parentTaskId) {
                    this.loadParentName(this.taskDetails.parentTaskId);
                } else {
                    this.refreshData();
                }
            });
    }

    private initDefaultProperties() {
        return [
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.ASSIGNEE',
                    value: this.taskDetails.assignee,
                    key: 'assignee',
                    default: this.translationService.instant('ADF_CLOUD_TASK_HEADER.PROPERTIES.ASSIGNEE_DEFAULT'),
                    icon: 'create'
                }
            ),
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.STATUS',
                    value: this.taskDetails.status,
                    key: 'status'
                }
            ),
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.PRIORITY',
                    value: this.taskDetails.priority,
                    key: 'priority',
                    editable: this.isReadOnlyMode()
                }
            ),
            new CardViewDateItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.DUE_DATE',
                    value: this.taskDetails.dueDate,
                    key: 'dueDate',
                    default: this.translationService.instant('ADF_CLOUD_TASK_HEADER.PROPERTIES.DUE_DATE_DEFAULT'),
                    editable: this.isReadOnlyMode()
                }
            ),
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.CATEGORY',
                    value: this.taskDetails.category,
                    key: 'category',
                    default: this.translationService.instant('ADF_CLOUD_TASK_HEADER.PROPERTIES.CATEGORY_DEFAULT')
                }
            ),
            new CardViewDateItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.CREATED',
                    value: this.taskDetails.createdDate,
                    key: 'created'
                }
            ),
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.PARENT_NAME',
                    value: this.parentTaskName,
                    default: this.translationService.instant('ADF_CLOUD_TASK_HEADER.PROPERTIES.PARENT_NAME_DEFAULT'),
                    key: 'parentName'
                }
            ),
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.PARENT_TASK_ID',
                    value: this.taskDetails.parentTaskId,
                    key: 'parentTaskId'
                }
            ),
            new CardViewDateItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.END_DATE',
                    value: '',
                    key: 'endDate'
                }
            ),
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.ID',
                    value: this.taskDetails.id,
                    key: 'id'
                }
            ),
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.DESCRIPTION',
                    value: this.taskDetails.description,
                    key: 'description',
                    default: this.translationService.instant('ADF_CLOUD_TASK_HEADER.PROPERTIES.DESCRIPTION_DEFAULT'),
                    multiline: true,
                    editable: this.isReadOnlyMode()
                }
            )
        ];
    }

    /**
     * Refresh the card data
     */
    refreshData() {
        if (this.taskDetails) {
            const defaultProperties = this.initDefaultProperties();
            const filteredProperties: string[] = this.appConfig.get('adf-cloud-task-header.presets.properties');
            this.properties = defaultProperties.filter((cardItem) => this.isValidSelection(filteredProperties, cardItem));
        }
    }

    /**
     * Save a task detail and update it after a successful response
     *
     * @param updateNotification
     */
    private updateTaskDetails(updateNotification: UpdateNotification) {
        this.taskHeaderCloudService.updateTask(this.appName, this.taskId, updateNotification.changed)
            .subscribe(
                (taskDetails) => {
                    this.taskDetails = taskDetails;
                    this.refreshData();
                }
            );
    }

    private loadParentName(taskId) {
        this.taskHeaderCloudService.getTaskById(this.appName, taskId)
            .subscribe(
                (taskDetails) => {
                    this.parentTaskName = taskDetails.name;
                    this.refreshData();
                }
            );
    }

    isCompleted() {
        return this.taskDetails && this.taskDetails.status && this.taskDetails.status.toLowerCase() === 'completed';
    }

    canCompleteTask() {
        return this.taskCloudService.canCompleteTask(this.taskDetails);
    }

    isTaskClaimable(): boolean {
        return !this.hasAssignee() && this.isCandidateMember();
    }

    hasAssignee(): boolean {
        return !!this.taskDetails.assignee ? true : false;
    }

    isCandidateMember() {
        return this.taskDetails.managerOfCandidateGroup || this.taskDetails.memberOfCandidateGroup || this.taskDetails.memberOfCandidateUsers;
    }

    isTaskClaimedByCandidateMember(): boolean {
        return this.isCandidateMember() && this.isAssignedToCurrentUser() && !this.isCompleted();
    }

    isAssignedToCurrentUser(): boolean {
        return this.hasAssignee() && this.isAssignedTo(this.currentUser);
    }

    isAssignedTo(userName): boolean {
        return this.hasAssignee() ? this.taskDetails.assignee === userName : false;
    }

    isTaskValid() {
        return this.appName && this.taskId;
    }

    isReadOnlyMode() {
        return !this.readOnly;
    }

    claimTask() {
        this.taskHeaderCloudService.claimTask(this.appName, this.taskId, this.currentUser).subscribe(
            (res: any) => {
                this.loadTaskDetailsById(this.appName, this.taskId);
                this.claim.emit(this.taskId);
            });
    }

    unclaimTask() {
        this.taskHeaderCloudService.unclaimTask(this.appName, this.taskId).subscribe(
            () => {
                this.loadTaskDetailsById(this.appName, this.taskId);
                this.unclaim.emit(this.taskId);
            });
    }

    private isValidSelection(filteredProperties: string[], cardItem: CardViewBaseItemModel): boolean {
        return filteredProperties ? filteredProperties.indexOf(cardItem.key) >= 0 : true;
    }

    goBack() {
        this.router.navigate([`/cloud/${this.appName}/`]);
    }
}
