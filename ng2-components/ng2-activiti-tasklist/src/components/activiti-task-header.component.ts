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
import { AlfrescoTranslationService, CardViewDateItemModel, CardViewItem, CardViewTextItemModel, LogService } from 'ng2-alfresco-core';
import { TaskDetailsModel } from '../models/index';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';

@Component({
    selector: 'adf-task-header, activiti-task-header',
    templateUrl: './activiti-task-header.component.html',
    styleUrls: ['./activiti-task-header.component.scss']
})
export class ActivitiTaskHeaderComponent implements OnChanges {

    @Input()
    formName: string = null;

    @Input()
    taskDetails: TaskDetailsModel;

    @Output()
    claim: EventEmitter<any> = new EventEmitter<any>();

    properties: CardViewItem [];
    inEdit: boolean = false;

    constructor(private translateService: AlfrescoTranslationService,
                private activitiTaskService: ActivitiTaskListService,
                private logService: LogService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'assets/ng2-activiti-tasklist');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('change van:', changes, this.taskDetails);
        this.refreshData();
    }

    refreshData() {
        if (this.taskDetails) {

            this.properties = [
                new CardViewTextItemModel({ label: 'Assignee', value: this.taskDetails.getFullName(), key: 'assignee', default: 'No assignee' } ),
                new CardViewTextItemModel({ label: 'Status', value: this.getTaskStatus(), key: 'status' }),
                new CardViewDateItemModel({ label: 'Due Date', value: this.taskDetails.dueDate, key: 'dueDate', default: 'No date', editable: true }),
                new CardViewTextItemModel({ label: 'Category', value: this.taskDetails.category, key: 'category', default: 'No category' }),
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

    public hasAssignee(): boolean {
        return (this.taskDetails && this.taskDetails.assignee) ? true : false;
    }

    isAssignedToMe(): boolean {
        return this.taskDetails.assignee ? true : false;
    }

    getTaskStatus(): string {
        return this.isCompleted() ? 'Completed' : 'Running';
    }

    claimTask(taskId: string) {
        this.activitiTaskService.claimTask(taskId).subscribe(
            (res: any) => {
                this.logService.info('Task claimed');
                this.claim.emit(taskId);
            });
    }

    isCompleted() {
        return !!this.taskDetails.endDate;
    }
}
