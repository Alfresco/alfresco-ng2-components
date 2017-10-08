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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CardViewDateItemModel, CardViewItem, CardViewMapItemModel, CardViewTextItemModel, LogService } from 'ng2-alfresco-core';
import { TaskDetailsModel } from '../models/task-details.model';
import { TaskListService } from './../services/tasklist.service';

@Component({
    selector: 'adf-task-header, activiti-task-header',
    templateUrl: './task-header.component.html',
    styleUrls: ['./task-header.component.scss']
})
export class TaskHeaderComponent implements OnChanges {

    @Input()
    formName: string = null;

    @Input()
    taskDetails: TaskDetailsModel;

    @Output()
    claim: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    unclaim: EventEmitter<any> = new EventEmitter<any>();

    properties: CardViewItem [];
    inEdit: boolean = false;

    constructor(private activitiTaskService: TaskListService,
                private logService: LogService) {
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
                new CardViewTextItemModel({ label: 'Assignee', value: this.taskDetails.getFullName(), key: 'assignee', default: 'No assignee', clickable: !this.isCompleted() } ),
                new CardViewTextItemModel({ label: 'Status', value: this.getTaskStatus(), key: 'status' }),
                new CardViewDateItemModel({ label: 'Due Date', value: this.taskDetails.dueDate, key: 'dueDate', default: 'No date', editable: true }),
                new CardViewTextItemModel({ label: 'Category', value: this.taskDetails.category, key: 'category', default: 'No category' }),
                new CardViewMapItemModel({ label: 'Parent name', value: parentInfoMap, key: 'parentName', default: 'None', clickable: true  }),
                new CardViewTextItemModel({ label: 'Created By', value: this.taskDetails.getFullName(), key: 'created-by', default: 'No assignee' }),
                new CardViewDateItemModel({ label: 'Created', value: this.taskDetails.created, key: 'created' }),
                new CardViewTextItemModel({ label: 'Id', value: this.taskDetails.id, key: 'id' }),
                new CardViewTextItemModel({
                    label: 'Description',
                    value: this.taskDetails.description,
                    key: 'description',
                    default: 'No description',
                    multiline: true,
                    editable: true
                }),
                new CardViewTextItemModel({ label: 'Form name', value: this.formName, key: 'formName', default: 'No form' })
            ];
        }
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
        return (this.taskDetails && this.taskDetails.assignee) ? true : false;
    }

    /**
     * Is the task assigned to the currently loggedin user
     */
    isAssignedToMe(): boolean {
        return this.taskDetails.assignee ? true : false;
    }

    /**
     * Returns task's status
     */
    getTaskStatus(): string {
        return this.taskDetails.isCompleted() ? 'Completed' : 'Running';
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
    isCompleted() {
        return !!this.taskDetails.endDate;
    }
}
