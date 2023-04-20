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

import { Component, Input, EventEmitter, Output, OnDestroy, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil, concatMap, catchError, finalize } from 'rxjs/operators';
import { Subject, of, forkJoin } from 'rxjs';
import {
    CardViewDateItemModel,
    CardViewItem,
    CardViewTextItemModel,
    CardViewBaseItemModel,
    CardViewArrayItemModel,
    TranslationService,
    AppConfigService,
    UpdateNotification,
    CardViewUpdateService,
    CardViewDatetimeItemModel,
    CardViewArrayItem,
    CardViewSelectItemModel
} from '@alfresco/adf-core';
import { TaskDetailsCloudModel } from '../../start-task/models/task-details-cloud.model';
import { TaskCloudService } from '../../services/task-cloud.service';

@Component({
    selector: 'adf-cloud-task-header',
    templateUrl: './task-header-cloud.component.html',
    styleUrls: ['./task-header-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskHeaderCloudComponent implements OnInit, OnDestroy, OnChanges {

    /** (Required) The name of the application. */
    @Input()
    appName: string = '';

    /** (Required) The id of the task. */
    @Input()
    taskId: string;

    /** Show/Hide the task title */
    @Input()
    showTitle: boolean = true;

    /** Emitted when the task is claimed. */
    @Output()
    claim: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when the task is unclaimed (ie, requeued). */
    @Output()
    unclaim: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when the given task has errors. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    taskDetails: TaskDetailsCloudModel = {};
    candidateUsers: CardViewArrayItem[] = [];
    candidateGroups: CardViewArrayItem[] = [];
    properties: CardViewItem[];
    inEdit: boolean = false;
    parentTaskName: string;
    dateFormat: string;
    dateLocale: string;
    displayDateClearAction = false;
    isLoading = true;
    processInstanceId: string;

    private onDestroy$ = new Subject<boolean>();

    constructor(
        private taskCloudService: TaskCloudService,
        private translationService: TranslationService,
        private appConfig: AppConfigService,
        private cardViewUpdateService: CardViewUpdateService
    ) {
        this.dateFormat = this.appConfig.get('adf-cloud-task-header.defaultDateFormat');
        this.dateLocale = this.appConfig.get('dateValues.defaultDateLocale');
    }

    ngOnInit() {
        this.taskCloudService.dataChangesDetected$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
            this.loadTaskDetailsById(this.appName, this.taskId);
        });

        this.cardViewUpdateService.itemUpdated$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(this.updateTaskDetails.bind(this)
        );
    }

    ngOnChanges() {
        this.taskDetails = {};
        if ((this.appName || this.appName === '') && this.taskId) {
            this.loadTaskDetailsById(this.appName, this.taskId);
        } else {
            this.error.emit('App Name and Task Id are mandatory');
        }
    }

    loadTaskDetailsById(appName: string, taskId: string) {
        this.isLoading = true;
        this.taskCloudService.getTaskById(appName, taskId).pipe(
            concatMap((task) =>
                forkJoin(
                    of(task),
                    this.taskCloudService.getCandidateUsers(this.appName, this.taskId),
                    this.taskCloudService.getCandidateGroups(this.appName, this.taskId)
                )
            ),
            finalize(() => (this.isLoading = false))
        ).subscribe(([taskDetails, candidateUsers, candidateGroups]) => {
                this.taskDetails = taskDetails;
                this.candidateGroups = candidateGroups.map((user) => ({ icon: 'group', value: user } as CardViewArrayItem));
                this.candidateUsers = candidateUsers.map((group) => ({ icon: 'person', value: group } as CardViewArrayItem));
                this.processInstanceId = taskDetails.processInstanceId;
                if (this.taskDetails.parentTaskId) {
                    this.loadParentName(`${this.taskDetails.parentTaskId}`);
                } else {
                    this.refreshData();
                }
            },
            (err) => {
                this.error.emit(err);
            });
    }

    private initDefaultProperties() {
        return [
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.ASSIGNEE',
                    value: this.taskDetails.assignee,
                    key: 'assignee',
                    clickable: this.isAssigneePropertyClickable(),
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
            new CardViewSelectItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.PRIORITY',
                    value: this.taskDetails.priority.toString(),
                    key: 'priority',
                    editable: true,
                    displayNoneOption: false,
                    options$: of(this.taskCloudService.priorities)
                }
            ),
            new CardViewDatetimeItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.DUE_DATE',
                    value: this.taskDetails.dueDate,
                    key: 'dueDate',
                    default: this.translationService.instant('ADF_CLOUD_TASK_HEADER.PROPERTIES.DUE_DATE_DEFAULT'),
                    editable: true,
                    format: this.dateFormat,
                    locale: this.dateLocale
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
                    key: 'created',
                    format: this.dateFormat,
                    locale: this.dateLocale
                }
            ),
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.PARENT_NAME',
                    value: this.parentTaskName,
                    default: this.translationService.instant('ADF_CLOUD_TASK_HEADER.PROPERTIES.PARENT_NAME_DEFAULT'),
                    key: 'parentName',
                    clickable: true
                }
            ),
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.PARENT_TASK_ID',
                    value: this.taskDetails.parentTaskId,
                    key: 'parentTaskId',
                    clickable: true
                }
            ),
            new CardViewDateItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.END_DATE',
                    value: this.taskDetails.completedDate,
                    key: 'endDate',
                    format: this.dateFormat,
                    locale: this.dateLocale
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
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.PROCESS_INSTANCE_ID',
                    value: this.processInstanceId,
                    default: this.translationService.instant('ADF_CLOUD_TASK_HEADER.PROPERTIES.PROCESS_INSTANCE_ID_DEFAULT'),
                    key: 'processInstanceId',
                    clickable: true
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
            new CardViewArrayItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.CANDIDATE_USERS',
                    value: of(this.candidateUsers),
                    key: 'candidateUsers',
                    icon: 'edit',
                    clickable: false,
                    default: this.translationService.instant('ADF_CLOUD_TASK_HEADER.PROPERTIES.CANDIDATE_USERS_DEFAULT'),
                    noOfItemsToDisplay: 2
                }
            ),
            new CardViewArrayItemModel(
                {
                    label: 'ADF_CLOUD_TASK_HEADER.PROPERTIES.CANDIDATE_GROUPS',
                    value: of(this.candidateGroups),
                    key: 'candidateGroups',
                    icon: 'edit',
                    clickable: false,
                    default: this.translationService.instant('ADF_CLOUD_TASK_HEADER.PROPERTIES.CANDIDATE_GROUPS_DEFAULT'),
                    noOfItemsToDisplay: 2
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
            .pipe(catchError(() => {
                this.cardViewUpdateService.updateElement(updateNotification.target);
                return of(null);
            }))
            .subscribe((taskDetails) => {
                    if (taskDetails) {
                        this.taskDetails = taskDetails;
                    }
                });
    }

    private loadParentName(taskId: string) {
        this.taskCloudService.getTaskById(this.appName, taskId)
            .subscribe(
                (taskDetails) => {
                    this.parentTaskName = taskDetails.name;
                    this.refreshData();
                }
            );
    }

    isCompleted(): boolean {
        return this.taskDetails && this.taskDetails.status === 'COMPLETED';
    }

    hasAssignee(): boolean {
        return !!this.taskDetails.assignee ? true : false;
    }

    isTaskValid(): boolean {
        return (this.appName || this.appName === '') && !!this.taskId;
    }

    isTaskAssigned(): boolean {
        return this.taskDetails.assignee !== undefined;
    }

    isTaskEditable(): boolean {
        return this.taskCloudService.isTaskEditable(this.taskDetails);
    }

    /**
     * as per [ACA-3960] it required an empty array argument for now
     * Empty array will be replaced with candidateGroups in feature
     */
    isAssigneePropertyClickable(): boolean {
        return this.taskCloudService.isAssigneePropertyClickable(this.taskDetails, this.candidateUsers, []);
    }

    private isValidSelection(filteredProperties: string[], cardItem: CardViewBaseItemModel): boolean {
        return filteredProperties ? filteredProperties.indexOf(cardItem.key) >= 0 : true;
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
