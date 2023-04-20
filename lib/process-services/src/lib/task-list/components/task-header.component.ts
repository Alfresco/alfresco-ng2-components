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

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import {
    CardViewDateItemModel,
    CardViewMapItemModel,
    CardViewTextItemModel,
    CardViewBaseItemModel,
    TranslationService,
    AppConfigService,
    CardViewIntItemModel,
    CardViewItemLengthValidator
} from '@alfresco/adf-core';
import { TaskDetailsModel } from '../models/task-details.model';
import { PeopleProcessService } from '../../common/services/people-process.service';
import { TaskDescriptionValidator } from '../validators/task-description.validator';

@Component({
    selector: 'adf-task-header',
    templateUrl: './task-header.component.html',
    styleUrls: ['./task-header.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskHeaderComponent implements OnChanges, OnInit {

    /** The name of the form. */
    @Input()
    formName: string = null;

    /** (required) Details related to the task. */
    @Input()
    taskDetails: TaskDetailsModel;

    /** Toggles display of the claim/release button. */
    @Input()
    showClaimRelease = true;

    /** Emitted when the task is claimed. */
    @Output()
    claim: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when the task is unclaimed (ie, requeue). */
    @Output()
    unclaim: EventEmitter<any> = new EventEmitter<any>();

    properties: any [] = [];
    inEdit: boolean = false;
    displayDateClearAction = false;
    dateFormat: string;
    dateLocale: string;

    private currentUserId: number;

    constructor(private peopleProcessService: PeopleProcessService,
                private translationService: TranslationService,
                private appConfig: AppConfigService) {
        this.dateFormat = this.appConfig.get('dateValues.defaultDateFormat');
        this.dateLocale = this.appConfig.get('dateValues.defaultDateLocale');
    }

    ngOnInit() {
        this.loadCurrentBpmUserId();
        this.initData();
    }

    ngOnChanges(changes: SimpleChanges) {
        const taskDetailsChange = changes['taskDetails'];
        if (taskDetailsChange?.currentValue?.id !== taskDetailsChange?.previousValue?.id) {
            this.initData();
        } else {
            this.refreshData();
        }
    }

    /**
     * Refresh the card data
     */
    initData() {
        if (this.taskDetails) {
            const parentInfoMap = this.getParentInfo();
            const defaultProperties = this.initDefaultProperties(parentInfoMap);
            const filteredProperties: string[] = this.appConfig.get('adf-task-header.presets.properties');
            this.properties = defaultProperties.filter((cardItem) => this.isValidSelection(filteredProperties, cardItem));
        }
    }

    /**
     * Refresh the card data
     */
    refreshData() {
        this.properties = this.properties.map((cardItem) => {
            if (cardItem.key === 'formName' && cardItem.value !== this.formName) {
                return new CardViewTextItemModel({
                    label: 'ADF_TASK_LIST.PROPERTIES.FORM_NAME',
                    value: this.formName,
                    key: 'formName',
                    default: this.translationService.instant('ADF_TASK_LIST.PROPERTIES.FORM_NAME_DEFAULT'),
                    clickable: this.isFormClickable(),
                    icon: 'create'
                });
            } else {
                return cardItem;
            }
        });
    }

    /**
     * Return the process parent information
     */
    getParentInfo(): Map<string, string> {
        if (this.taskDetails.processInstanceId && this.taskDetails.processDefinitionName) {
            return new Map([[this.taskDetails.processInstanceId, this.taskDetails.processDefinitionName]]);
        }
        return new Map();
    }

    /**
     * Does the task have an assignee
     */
    hasAssignee(): boolean {
        return !!this.taskDetails.assignee;
    }

    /**
     * Returns true if the task is assigned to logged in user
     */
    isAssignedTo(userId: number): boolean {
        return this.hasAssignee() ? this.taskDetails.assignee.id === userId : false;
    }

    /**
     * Return true if the task assigned
     */
    isAssignedToCurrentUser(): boolean {
        return this.hasAssignee() && this.isAssignedTo(this.currentUserId);
    }

    /**
     * Return true if the user is a candidate member
     */
    isCandidateMember(): boolean {
        return this.taskDetails.managerOfCandidateGroup || this.taskDetails.memberOfCandidateGroup || this.taskDetails.memberOfCandidateUsers;
    }

    /**
     * Return true if the task claimable
     */
    isTaskClaimable(): boolean {
        return !this.hasAssignee() && this.isCandidateMember();
    }

    /**
     * Return true if the task claimed by candidate member.
     */
    isTaskClaimedByCandidateMember(): boolean {
        return this.isCandidateMember() && this.isAssignedToCurrentUser() && !this.isCompleted();
    }

    /**
     * Returns task's status
     */
    getTaskStatus(): string {
        return (this.taskDetails && this.taskDetails.isCompleted()) ? 'Completed' : 'Running';
    }

    onClaimTask(taskId: string) {
        this.claim.emit(taskId);
    }

    onUnclaimTask(taskId: string) {
        this.unclaim.emit(taskId);
    }

    /**
     * Returns true if the task is completed
     */
    isCompleted(): boolean {
        return this.taskDetails && !!this.taskDetails.endDate;
    }

    isFormClickable(): boolean {
        return !!this.formName && !this.isCompleted();
    }

    getTaskDuration(): string {
        return this.taskDetails.duration ? `${this.taskDetails.duration} ms` : '';
    }

    private initDefaultProperties(parentInfoMap): any[] {
        return [
            new CardViewTextItemModel(
                {
                    label: 'ADF_TASK_LIST.PROPERTIES.ASSIGNEE',
                    value: this.taskDetails.getFullName(),
                    key: 'assignee',
                    default: this.translationService.instant('ADF_TASK_LIST.PROPERTIES.ASSIGNEE_DEFAULT'),
                    clickable: !this.isCompleted(),
                    icon: 'create'
                }
            ),
            new CardViewTextItemModel(
                {
                    label: 'ADF_TASK_LIST.PROPERTIES.STATUS',
                    value: this.getTaskStatus(),
                    key: 'status'
                }
            ),
            new CardViewIntItemModel(
                {
                    label: 'ADF_TASK_LIST.PROPERTIES.PRIORITY',
                    value: this.taskDetails.priority,
                    key: 'priority',
                    editable: true,
                    validators: [new CardViewItemLengthValidator(1, 10)]
                }
            ),
            new CardViewDateItemModel(
                {
                    label: 'ADF_TASK_LIST.PROPERTIES.DUE_DATE',
                    value: this.taskDetails.dueDate,
                    key: 'dueDate',
                    default: this.translationService.instant('ADF_TASK_LIST.PROPERTIES.DUE_DATE_DEFAULT'),
                    editable: true,
                    format: this.dateFormat,
                    locale: this.dateLocale
                }
            ),
            new CardViewTextItemModel(
                {
                    label: 'ADF_TASK_LIST.PROPERTIES.CATEGORY',
                    value: this.taskDetails.category,
                    key: 'category',
                    default: this.translationService.instant('ADF_TASK_LIST.PROPERTIES.CATEGORY_DEFAULT')
                }
            ),
            new CardViewMapItemModel(
                {
                    label: 'ADF_TASK_LIST.PROPERTIES.PARENT_NAME',
                    value: parentInfoMap,
                    key: 'parentName',
                    default: this.translationService.instant('ADF_TASK_LIST.PROPERTIES.PARENT_NAME_DEFAULT'),
                    clickable: true
                }
            ),
            new CardViewDateItemModel(
                {
                    label: 'ADF_TASK_LIST.PROPERTIES.CREATED',
                    value: this.taskDetails.created,
                    key: 'created',
                    format: this.dateFormat,
                    locale: this.dateLocale
                }
            ),
            new CardViewTextItemModel(
                {
                    label: 'ADF_TASK_LIST.PROPERTIES.DURATION',
                    value: this.getTaskDuration(),
                    key: 'duration'
                }
            ),
            new CardViewTextItemModel(
                {
                    label: 'ADF_TASK_LIST.PROPERTIES.PARENT_TASK_ID',
                    value: this.taskDetails.parentTaskId,
                    key: 'parentTaskId'
                }
            ),
            new CardViewDateItemModel(
                {
                    label: 'ADF_TASK_LIST.PROPERTIES.END_DATE',
                    value: this.taskDetails.endDate,
                    key: 'endDate',
                    format: this.dateFormat,
                    locale: this.dateLocale
                }
            ),
            new CardViewTextItemModel(
                {
                    label: 'ADF_TASK_LIST.PROPERTIES.ID',
                    value: this.taskDetails.id,
                    key: 'id'
                }
            ),
            new CardViewTextItemModel(
                {
                    label: 'ADF_TASK_LIST.PROPERTIES.DESCRIPTION',
                    value: this.taskDetails.description,
                    key: 'description',
                    default: this.translationService.instant('ADF_TASK_LIST.PROPERTIES.DESCRIPTION_DEFAULT'),
                    multiline: true,
                    editable: true,
                    validators: [new TaskDescriptionValidator()]
                }
            ),
            new CardViewTextItemModel(
                {
                    label: 'ADF_TASK_LIST.PROPERTIES.FORM_NAME',
                    value: this.formName,
                    key: 'formName',
                    default: this.translationService.instant('ADF_TASK_LIST.PROPERTIES.FORM_NAME_DEFAULT'),
                    clickable: this.isFormClickable(),
                    icon: 'create'
                }
            )
        ];
    }

    private isValidSelection(filteredProperties: string[], cardItem: CardViewBaseItemModel): boolean {
        return filteredProperties ? filteredProperties.indexOf(cardItem.key) >= 0 : true;
    }

    /**
     * Loads current bpm userId
     */
    private loadCurrentBpmUserId(): void {
        this.peopleProcessService.getCurrentUserInfo().subscribe((res) => {
            this.currentUserId = res ? +res.id : null;
        });
    }
}
