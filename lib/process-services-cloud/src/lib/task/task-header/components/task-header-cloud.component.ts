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

import { Component, Input, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import {
    CardViewDateItemModel,
    CardViewItem,
    CardViewTextItemModel,
    CardViewBaseItemModel,
    TranslationService,
    AppConfigService,
    UpdateNotification,
    CardViewUpdateService
} from '@alfresco/adf-core';
import { TaskDetailsCloudModel, TaskStatusEnum } from '../../start-task/models/task-details-cloud.model';
import { Router } from '@angular/router';
import { TaskCloudService } from '../../services/task-cloud.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'adf-cloud-task-header',
    templateUrl: './task-header-cloud.component.html',
    styleUrls: ['./task-header-cloud.component.scss']
})
export class TaskHeaderCloudComponent implements OnInit, OnDestroy {

    /** (Required) The name of the application. */
    @Input()
    appName: string;

    /** (Required) The id of the task. */
    @Input()
    taskId: string;

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

    private subscriptions: Subscription[] = [];

    constructor(
        private taskCloudService: TaskCloudService,
        private translationService: TranslationService,
        private appConfig: AppConfigService,
        private router: Router,
        private cardViewUpdateService: CardViewUpdateService
    ) { }

    ngOnInit() {
        if ((this.appName || this.appName === '') && this.taskId) {
            this.loadTaskDetailsById(this.appName, this.taskId);
        }

        this.subscriptions.push(this.cardViewUpdateService.itemUpdated$.subscribe(this.updateTaskDetails.bind(this)));
    }

    loadTaskDetailsById(appName: string, taskId: string): any {
        this.subscriptions.push(this.taskCloudService.getTaskById(appName, taskId).subscribe(
            (taskDetails) => {
                this.taskDetails = taskDetails;
                if (this.taskDetails.parentTaskId) {
                    this.loadParentName(this.taskDetails.parentTaskId);
                } else {
                    this.refreshData();
                }
            }));
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
                    editable: true
                }
            ),
            new CardViewDateItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.DUE_DATE',
                    value: this.taskDetails.dueDate,
                    key: 'dueDate',
                    format: 'DD-MM-YYYY',
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
                    format: 'DD-MM-YYYY',
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
                    value: this.taskDetails.completedDate,
                    format: 'DD-MM-YYYY',
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
        this.taskCloudService.updateTask(this.appName, this.taskId, updateNotification.changed)
            .subscribe(
                (taskDetails) => {
                    this.taskDetails = taskDetails;
                    this.refreshData();
                }
            );
    }

    private loadParentName(taskId) {
        this.taskCloudService.getTaskById(this.appName, taskId)
            .subscribe(
                (taskDetails) => {
                    this.parentTaskName = taskDetails.name;
                    this.refreshData();
                }
            );
    }

    isCompleted() {
        return this.taskDetails && this.taskDetails.status && this.taskDetails.status.toUpperCase() === TaskStatusEnum.COMPLETED;
    }

    hasAssignee(): boolean {
        return !!this.taskDetails.assignee ? true : false;
    }

    isTaskValid() {
        return (this.appName || this.appName === '') && this.taskId;
    }

    isTaskAssigned() {
        return this.taskDetails.assignee !== undefined;
    }

    private isValidSelection(filteredProperties: string[], cardItem: CardViewBaseItemModel): boolean {
        return filteredProperties ? filteredProperties.indexOf(cardItem.key) >= 0 : true;
    }

    goBack() {
        this.router.navigate([`/cloud/${this.appName}/`]);
    }

    onCompletedTask(event: any) {
        this.goBack();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
