/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
    CardViewMapItemModel,
    UpdateNotification,
    CardViewUpdateService,
    StorageService
} from '@alfresco/adf-core';
import { TaskDetailsCloudModel } from '../../start-task-cloud/models/task-details-cloud.model';
import { TaskHeaderCloudService } from '../services/task-header-cloud.service';

@Component({
    selector: 'adf-cloud-task-header',
    templateUrl: './task-header-cloud.component.html',
    styleUrls: ['./task-header-cloud.component.scss']
})
export class TaskHeaderCloudComponent implements OnInit {

    /** (Required) The appName */
    @Input()
    appName: string;

    /** (Required) The id of the task. */
    @Input()
    taskId: string;

    /** The name of the form. */
    @Input()
    formName: string = null;

    /** Emitted when the task is claimed. */
    @Output()
    claim: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when the task is unclaimed (ie, requeued). */
    @Output()
    unclaim: EventEmitter<any> = new EventEmitter<any>();

    taskDetails: TaskDetailsCloudModel = new TaskDetailsCloudModel();
    properties: CardViewItem [];
    inEdit: boolean = false;
    private currentUser: string;

    constructor(private taskHeaderCloudService: TaskHeaderCloudService,
                private translationService: TranslationService,
                private appConfig: AppConfigService,
                private cardViewUpdateService: CardViewUpdateService,
                private storage: StorageService) {
    }

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
                this.refreshData();
            });
    }

    private initDefaultProperties(parentInfoMap) {
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
                    editable: true
                }
            ),
            new CardViewDateItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.DUE_DATE',
                    value: this.taskDetails.dueDate,
                    key: 'dueDate',
                    default: this.translationService.instant('ADF_CLOUD_TASK_HEADER.PROPERTIES.DUE_DATE_DEFAULT'),
                    editable: true
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
            new CardViewMapItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.PARENT_NAME',
                    value: parentInfoMap,
                    key: 'parentName',
                    default: this.translationService.instant('ADF_CLOUD_TASK_HEADER.PROPERTIES.PARENT_NAME_DEFAULT'),
                    clickable: true
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
                    value: this.taskDetails.claimedDate,
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
                    editable: true
                }
            ),
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.FORM_NAME',
                    value: this.formName,
                    key: 'formName',
                    default: this.translationService.instant('ADF_CLOUD_TASK_HEADER.PROPERTIES.FORM_NAME_DEFAULT'),
                    clickable: !!this.formName,
                    icon: 'create'
                }
            )
        ];
    }

    /**
     * Refresh the card data
     */
    refreshData() {
        if (this.taskDetails) {
            const parentInfo = this.getParentInfo();
            const defaultProperties = this.initDefaultProperties(parentInfo);
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

    getParentInfo() {
        if (this.taskDetails.processInstanceId && this.taskDetails.processDefinitionId) {
            return new Map([[this.taskDetails.processInstanceId, this.taskDetails.processDefinitionId]]);
        }
    }

    isCompleted() {
        return  this.taskDetails && this.taskDetails.status === 'completed';
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

    isAssignedTo(userId): boolean {
        return this.hasAssignee() ? this.taskDetails.assignee === userId : false;
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
}
