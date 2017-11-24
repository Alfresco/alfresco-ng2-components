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

import { CardViewDateItemModel, CardViewItem, CardViewTextItemModel } from '@alfresco/adf-core';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProcessInstance } from '../models/process-instance.model';

@Component({
    selector: 'adf-process-instance-header',
    templateUrl: './process-instance-header.component.html',
    styleUrls: ['./process-instance-header.component.css']
})
export class ProcessInstanceHeaderComponent implements OnChanges {

    @Input()
    processInstance: ProcessInstance;

    properties: CardViewItem [];

    ngOnChanges(changes: SimpleChanges) {
        this.refreshData();
    }

    refreshData() {
        if (this.processInstance) {
            this.properties = [
                new CardViewTextItemModel(
                    {
                        label: 'ADF_PROCESS_LIST.PROPERTIES.STATUS',
                        value: this.getProcessStatus(),
                        key: 'status'
                    }),
                new CardViewDateItemModel(
                    {
                        label: 'ADF_PROCESS_LIST.PROPERTIES.END_DATE',
                        value: this.processInstance.ended,
                        format: 'MMM DD YYYY',
                        key: 'ended',
                        default: 'ADF_PROCESS_LIST.PROPERTIES.END_DATE_DEFAULT'
                    }),
                new CardViewTextItemModel(
                    {
                        label: 'ADF_PROCESS_LIST.PROPERTIES.CATEGORY',
                        value: this.processInstance.processDefinitionCategory,
                        key: 'category',
                        default: 'ADF_PROCESS_LIST.PROPERTIES.CATEGORY_DEFAULT'
                    }),
                new CardViewTextItemModel(
                    {
                        label: 'ADF_PROCESS_LIST.PROPERTIES.BUSINESS_KEY',
                        value: this.processInstance.businessKey,
                        key: 'businessKey',
                        default: 'ADF_PROCESS_LIST.PROPERTIES.BUSINESS_KEY_DEFAULT'
                    }),
                new CardViewTextItemModel(
                    {
                        label: 'ADF_PROCESS_LIST.PROPERTIES.CREATED_BY',
                        value: this.getStartedByFullName(),
                        key: 'assignee',
                        default: 'ADF_PROCESS_LIST.PROPERTIES.CREATED_BY_DEFAULT'
                    }),
                new CardViewDateItemModel(
                    {
                        label: 'ADF_PROCESS_LIST.PROPERTIES.CREATED',
                        value: this.processInstance.started,
                        format: 'MMM DD YYYY',
                        key: 'created'
                    }),
                new CardViewTextItemModel(
                    {label: 'ADF_PROCESS_LIST.PROPERTIES.ID',
                    value: this.processInstance.id,
                    key: 'id'
                }),
                new CardViewTextItemModel(
                    {label: 'ADF_PROCESS_LIST.PROPERTIES.DESCRIPTION',
                    value: this.processInstance.processDefinitionDescription,
                    key: 'description',
                    default: 'ADF_PROCESS_LIST.PROPERTIES.DESCRIPTION_DEFAULT'
                })
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
