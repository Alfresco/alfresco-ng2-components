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

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { BpmUserService, CardViewDateItemModel, CardViewItem, CardViewMapItemModel, CardViewTextItemModel, LogService } from '@alfresco/core';

import { TaskDetailsModel } from '../models/task-details.model';
import { TaskListService } from './../services/tasklist.service';

@Component({
    selector: 'adf-task-header',
    templateUrl: './task-header.component.html',
    styleUrls: ['./task-header.component.scss']
})
export class TaskHeaderComponent implements OnChanges, OnInit {

    @Input()
    formName: string = null;

    @Input()
    taskDetails: TaskDetailsModel;

    @Output()
    claim: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    unclaim: EventEmitter<any> = new EventEmitter<any>();

    private currentUserId: number;

    properties: CardViewItem [];
    inEdit = false;

    constructor(private activitiTaskService: TaskListService,
                private bpmUserService: BpmUserService,
                private logService: LogService) {
    }

    ngOnInit() {
        this.getCurrentUserId();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.refreshData();
    }

    /**
     * Refresh the card data
     */
    refreshData() {
        if (this.taskDetails) {
            const parentInfoMap = this.getParentInfo();
            this.properties = [
                new CardViewTextItemModel(
                    {
                     label: 'ADF_TASK_LIST.PROPERTIES.ASSIGNEE',
                     value: this.taskDetails.getFullName(),
                     key: 'assignee',
                     default: 'ADF_TASK_LIST.PROPERTIES.ASSIGNEE_DEFAULT',
                     clickable: !this.isCompleted()
                    }
                ),
                new CardViewTextItemModel(
                    {
                        label: 'ADF_TASK_LIST.PROPERTIES.STATUS',
                        value: this.getTaskStatus(),
                        key: 'status'
                    }
                ),
                new CardViewTextItemModel(
                    {
                        label: 'ADF_TASK_LIST.PROPERTIES.PRIORITY',
                        value: this.taskDetails.priority,
                        key: 'priority'
                    }
                ),
                new CardViewDateItemModel(
                    {
                        label: 'ADF_TASK_LIST.PROPERTIES.DUE_DATE',
                        value: this.taskDetails.dueDate,
                        key: 'dueDate',
                        default: 'ADF_TASK_LIST.PROPERTIES.DUE_DATE_DEFAULT',
                        editable: true
                    }
                ),
                new CardViewTextItemModel(
                    {
                        label: 'ADF_TASK_LIST.PROPERTIES.CATEGORY',
                        value: this.taskDetails.category,
                        key: 'category',
                        default: 'ADF_TASK_LIST.PROPERTIES.CATEGORY_DEFAULT'
                    }
                ),
                new CardViewMapItemModel(
                    {
                        label: 'ADF_TASK_LIST.PROPERTIES.PARENT_NAME',
                        value: parentInfoMap, key: 'parentName',
                        default: 'ADF_TASK_LIST.PROPERTIES.PARENT_NAME_DEFAULT',
                        clickable: true
                    }
                ),
                new CardViewTextItemModel(
                    {
                        label: 'ADF_TASK_LIST.PROPERTIES.CREATED_BY',
                        value: this.taskDetails.getFullName(),
                        key: 'created-by'
                    }
                ),
                new CardViewDateItemModel(
                    {
                        label: 'ADF_TASK_LIST.PROPERTIES.CREATED',
                        value: this.taskDetails.created,
                        key: 'created'
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
                        default: 'ADF_TASK_LIST.PROPERTIES.DESCRIPTION_DEFAULT',
                        multiline: true,
                        editable: true
                    }
                ),
                new CardViewTextItemModel(
                    {
                        label: 'ADF_TASK_LIST.PROPERTIES.FORM_NAME',
                        value: this.formName,
                        key: 'formName',
                        default: 'ADF_TASK_LIST.PROPERTIES.FORM_NAME_DEFAULT'
                    }
                )
            ];
        }
    }

    /**
     * Return the bpmUser
     */
    private getCurrentUserId(): void {
        this.bpmUserService.getCurrentUserInfo().subscribe((res) => {
            this.currentUserId = res ? +res.id : null;
        });
    }

    /**
     * Return the process parent information
     */
    getParentInfo() {
        if (this.taskDetails.processInstanceId && this.taskDetails.processDefinitionName) {
            return new Map([[this.taskDetails.processInstanceId, this.taskDetails.processDefinitionName]]);
        }
    }

    /**
     * Does the task have an assignee
     */
    public hasAssignee(): boolean {
        return !!this.taskDetails.assignee ? true : false;
    }

    /**
     * Returns true if the task is assigne to logged in user
     */
    public isAssignedTo(userId): boolean {
        return this.hasAssignee() ? this.taskDetails.assignee.id === userId : false;
    }

    /**
     * Return true if the task assigned
     */
    public isAssignedToCurrentUser(): boolean {
        return this.hasAssignee() && this.isAssignedTo(this.currentUserId);
    }

    /**
     * Return true if the task has involvedGroup
     */
    public hasInvolvedGroup(): boolean {
        return this.taskDetails.involvedGroups.length > 0 ? true : false;
    }

    /**
     * Return true if the task has involvedPeople
     */
    public hasInvolvedPeople(): boolean {
        return this.taskDetails.involvedPeople.length > 0 ? true : false;
    }

    /**
     * Return true if the task claimable
     */
    public isTaskClaimable(): boolean {
        return !this.isCompleted() && (this.hasInvolvedGroup() || this.hasInvolvedPeople()) && !this.hasAssignee() ;
    }

    /**
     * Return true if the task claimed by currentUser
     */
    public isTaskClaimedByCurrentUser(): boolean {
        return !this.isCompleted() && (this.hasInvolvedGroup() || this.hasInvolvedPeople()) && this.isAssignedToCurrentUser();
    }

    /**
     * Returns task's status
     */
    getTaskStatus(): string {
        return (this.taskDetails && this.taskDetails.isCompleted()) ? 'Completed' : 'Running';
    }

    /**
     * Claim task
     *
     * @param taskId
     */
    claimTask(taskId: string) {
        this.activitiTaskService.claimTask(taskId).subscribe(
            (res: any) => {
                this.logService.info('Task claimed');
                this.claim.emit(taskId);
            });
    }

    /**
     * Unclaim task
     *
     * @param taskId
     */
    unclaimTask(taskId: string) {
        this.activitiTaskService.unclaimTask(taskId).subscribe(
            (res: any) => {
                this.logService.info('Task unclaimed');
                this.unclaim.emit(taskId);
            });
    }

    /**
     * Returns true if the task is completed
     */
    isCompleted(): boolean {
        return this.taskDetails && !!this.taskDetails.endDate;
    }
}
