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

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService, CardViewDateItemModel, CardViewItem, CardViewTextItemModel } from 'ng2-alfresco-core';
import { ProcessInstance } from '../models/process-instance.model';

@Component({
    selector: 'adf-process-instance-header, activiti-process-instance-header',
    templateUrl: './process-instance-header.component.html',
    styleUrls: ['./process-instance-header.component.css']
})
export class ProcessInstanceHeaderComponent implements OnChanges {

    @Input()
    processInstance: ProcessInstance;

    properties: CardViewItem [];

    constructor(translate: AlfrescoTranslationService) {

        if (translate) {
            translate.addTranslationFolder('ng2-activiti-processlist', 'assets/ng2-activiti-processlist');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.refreshData();
    }

    refreshData() {
        if (this.processInstance) {
            this.properties = [
                new CardViewTextItemModel({label: 'Status:', value: this.getProcessStatus(), key: 'status'}),
                new CardViewDateItemModel({label: 'Due Date:', value: this.processInstance.ended, format: 'MMM DD YYYY', key: 'dueDate', default: 'No date'}),
                new CardViewTextItemModel({label: 'Category:', value: this.processInstance.processDefinitionCategory, key: 'category', default: 'No category'}),
                new CardViewTextItemModel(
                    {
                        label: 'Created By:',
                        value: this.getStartedByFullName(),
                        key: 'assignee',
                        default: 'No assignee'
                    }),
                new CardViewDateItemModel({label: 'Created:', value: this.processInstance.started, format: 'MMM DD YYYY', key: 'created'}),
                new CardViewTextItemModel({label: 'Id:', value: this.processInstance.id, key: 'id'}),
                new CardViewTextItemModel({label: 'Description:', value: this.processInstance.processDefinitionDescription, key: 'description', default: 'No description'})
            ];
        }
    }

    getProcessStatus(): string {
        if (this.processInstance) {
            return this.isRunning() ? 'Running' : 'Completed';
        }
    }

    getStartedByFullName(): string {
        let fullName = '';
        if (this.processInstance && this.processInstance.startedBy) {
            fullName += this.processInstance.startedBy.firstName || '';
            fullName += fullName ? ' ' : '';
            fullName += this.processInstance.startedBy.lastName || '';
        }
        return fullName;
    }

    isRunning(): boolean {
        return this.processInstance && !this.processInstance.ended;
    }
}
