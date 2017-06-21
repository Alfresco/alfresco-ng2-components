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

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService, LogService, CardViewModel } from 'ng2-alfresco-core';
import { TaskDetailsModel } from '../models/index';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';

@Component({
    selector: 'activiti-task-header',
    templateUrl: './activiti-task-header.component.html',
    styleUrls: ['./activiti-task-header.component.css']
})
export class ActivitiTaskHeader implements OnChanges {

    @Input()
    formName: string = null;

    @Input()
    taskDetails: TaskDetailsModel;

    @Input()
    propertyNames: string [] = ['status', 'due_date', 'category', 'created_by', 'created', 'id', 'description', 'form_name'];

    @Output()
    claim: EventEmitter<any> = new EventEmitter<any>();

    properties: CardViewModel [];

    constructor(private translateService: AlfrescoTranslationService,
                private activitiTaskService: ActivitiTaskListService,
                private logService: LogService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'assets/ng2-activiti-tasklist');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.refreshData();
    }

    refreshData() {
        if (this.taskDetails) {
            this.propertyNames.forEach( propertyName => {
                let property: CardViewModel = this.createProperty(propertyName);
                if (this.properties) {
                    this.properties.push(property);
                } else {
                    this.properties = [property];
                }
            });
        }
    }

    private createProperty(propertyName: string): CardViewModel {
        let property: CardViewModel;
        if (propertyName === 'status') {
            property = new CardViewModel({label: 'Status:', value: this.getTaskStatus(), key: 'status'});
        } else if (propertyName === 'due_date') {
            property = new CardViewModel({label: 'Due Date:', value: this.taskDetails.dueDate, format: 'MMM DD YYYY', key: 'dueDate', default: 'No date'});
        } else if (propertyName === 'category') {
            property = new CardViewModel({label: 'Category:', value: this.taskDetails.category, key: 'category', default: 'No category'});
        } else if (propertyName === 'created_by') {
            property = new CardViewModel({
                    label: 'Created By:',
                    value: this.taskDetails.getFullName(),
                    key: 'assignee',
                    default: 'No assignee'
                });
        } else if (propertyName === 'created') {
            property = new CardViewModel({label: 'Created:', value: this.taskDetails.created, format: 'MMM DD YYYY', key: 'created'});
        } else if (propertyName === 'id') {
            property = new CardViewModel({label: 'Id:', value: this.taskDetails.id, key: 'id'});
        } else if (propertyName === 'description') {
            property = new CardViewModel({label: 'Description:', value: this.taskDetails.description, key: 'description', default: 'No description'});
        } else if (propertyName === 'form_name') {
            property = new CardViewModel({label: 'Form name:', value: this.formName, key: 'formName', default: 'No form'});
        }
        return property;
    }

    public hasAssignee(): boolean {
        return (this.taskDetails && this.taskDetails.assignee) ? true : false;
    }

    isAssignedToMe(): boolean {
        return this.taskDetails.assignee ? true : false;
    }

    getTaskStatus(): string {
        return this.taskDetails.endDate ? 'Completed' : 'Running';
    }

    claimTask(taskId: string) {
        this.activitiTaskService.claimTask(taskId).subscribe(
            (res: any) => {
                this.logService.info('Task claimed');
                this.claim.emit(taskId);
            });
    }
}
