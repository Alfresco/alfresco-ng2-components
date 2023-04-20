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

import { AppConfigService, CardViewDateItemModel, CardViewItem, CardViewBaseItemModel, CardViewTextItemModel, TranslationService } from '@alfresco/adf-core';
import { Component, Input, OnChanges } from '@angular/core';
import { ProcessInstance } from '../models/process-instance.model';

@Component({
    selector: 'adf-process-instance-header',
    templateUrl: './process-instance-header.component.html',
    styleUrls: ['./process-instance-header.component.css']
})
export class ProcessInstanceHeaderComponent implements OnChanges {

    /** (**required**) Full details of the process instance to display information about. */
    @Input()
    processInstance: ProcessInstance;

    properties: CardViewItem [];
    dateFormat: string;
    dateLocale: string;

    constructor(private translationService: TranslationService,
                private appConfig: AppConfigService) {
        this.dateFormat = this.appConfig.get('dateValues.defaultDateFormat');
        this.dateLocale = this.appConfig.get('dateValues.defaultDateLocale');
    }

    ngOnChanges() {
        this.refreshData();
    }

    refreshData(): void {
        if (this.processInstance) {
            const defaultProperties = this.initDefaultProperties();
            const filteredProperties: string[] = this.appConfig.get('adf-process-instance-header.presets.properties');
            this.properties = defaultProperties.filter((cardItem) => this.isValidSelection(filteredProperties, cardItem));
        }
    }

    getProcessStatus(): string {
        if (this.processInstance) {
            return this.isRunning() ? 'Running' : 'Completed';
        }
        return 'Unknown';
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

    private initDefaultProperties(): any[] {
        return [
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
                    format: this.dateFormat,
                    locale: this.dateLocale,
                    key: 'ended',
                    default: this.translationService.instant('ADF_PROCESS_LIST.PROPERTIES.END_DATE_DEFAULT')
                }),
            new CardViewTextItemModel(
                {
                    label: 'ADF_PROCESS_LIST.PROPERTIES.CATEGORY',
                    value: this.processInstance.processDefinitionCategory,
                    key: 'category',
                    default: this.translationService.instant('ADF_PROCESS_LIST.PROPERTIES.CATEGORY_DEFAULT')
                }),
            new CardViewTextItemModel(
                {
                    label: 'ADF_PROCESS_LIST.PROPERTIES.BUSINESS_KEY',
                    value: this.processInstance.businessKey,
                    key: 'businessKey',
                    default: this.translationService.instant('ADF_PROCESS_LIST.PROPERTIES.BUSINESS_KEY_DEFAULT')
                }),
            new CardViewTextItemModel(
                {
                    label: 'ADF_PROCESS_LIST.PROPERTIES.CREATED_BY',
                    value: this.getStartedByFullName(),
                    key: 'createdBy',
                    default: this.translationService.instant('ADF_PROCESS_LIST.PROPERTIES.CREATED_BY_DEFAULT')
                }),
            new CardViewDateItemModel(
                {
                    label: 'ADF_PROCESS_LIST.PROPERTIES.CREATED',
                    value: this.processInstance.started,
                    format: this.dateFormat,
                    locale: this.dateLocale,
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
                default: this.translationService.instant('ADF_PROCESS_LIST.PROPERTIES.DESCRIPTION_DEFAULT')
            })
        ];
    }

    private isValidSelection(filteredProperties: string[], cardItem: CardViewBaseItemModel): boolean {
        return filteredProperties ? filteredProperties.indexOf(cardItem.key) >= 0 : true;
    }
}
