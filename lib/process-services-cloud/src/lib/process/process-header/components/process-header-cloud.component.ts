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

import { Component, Input, OnChanges } from '@angular/core';
import { CardViewItem, CardViewTextItemModel, TranslationService, AppConfigService, CardViewDateItemModel, CardViewBaseItemModel } from '@alfresco/adf-core';
import { ProcessInstanceCloud } from '../../start-process/public-api';
import { ProcessHeaderCloudService } from '../services/process-header-cloud.service';

@Component({
    selector: 'adf-cloud-process-header',
    templateUrl: './process-header-cloud.component.html',
    styleUrls: ['./process-header-cloud.component.scss']
})

export class ProcessHeaderCloudComponent implements OnChanges {

    /** (Required) The name of the application. */
    @Input()
    appName: string;

    /** (Required) The id of the process instance. */
    @Input()
    processInstanceId: string;

    processInstanceDetails: ProcessInstanceCloud = new ProcessInstanceCloud();

    properties: CardViewItem[];

    constructor(
        private processHeaderCloudService: ProcessHeaderCloudService,
        private translationService: TranslationService,
        private appConfig: AppConfigService) {
    }

    ngOnChanges() {
        if (this.appName && this.processInstanceId) {
            this.loadProcessInstanceDetails(this.appName, this.processInstanceId);
        }
    }

    private loadProcessInstanceDetails(appName: string, processInstanceId: string) {
        this.processHeaderCloudService.getProcessInstanceById(appName, processInstanceId).subscribe(
            (processInstanceDetails) => {
                this.processInstanceDetails = processInstanceDetails;
                this.refreshData();
            });
    }

    refreshData() {
        if (this.processInstanceDetails) {
            const defaultProperties = this.initDefaultProperties();
            const filteredProperties: string[] = this.appConfig.get('adf-cloud-process-header.presets.properties');
            this.properties = defaultProperties.filter((cardItem) => this.isValidSelection(filteredProperties, cardItem));
        }
    }

    private initDefaultProperties(): any[] {
        return [
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_PROCESS_HEADER.PROPERTIES.ID',
                    value: this.processInstanceDetails.id,
                    key: 'id'
                }),
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_PROCESS_HEADER.PROPERTIES.NAME',
                    value: this.processInstanceDetails.name,
                    key: 'name'
                }),
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_PROCESS_HEADER.PROPERTIES.DESCRIPTION',
                    value: this.processInstanceDetails.description,
                    key: 'description',
                    default: this.translationService.instant('ADF_CLOUD_PROCESS_HEADER.PROPERTIES.DESCRIPTION_DEFAULT')
                }),
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_PROCESS_HEADER.PROPERTIES.STATUS',
                    value: this.processInstanceDetails.status,
                    key: 'status'
                }),
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_PROCESS_HEADER.PROPERTIES.INITIATOR',
                    value: this.processInstanceDetails.initiator,
                    key: 'initiator'
                }),
            new CardViewDateItemModel(
                {
                    label: 'ADF_CLOUD_PROCESS_HEADER.PROPERTIES.START_DATE',
                    value: this.processInstanceDetails.startDate,
                    format: 'DD-MM-YYYY',
                    key: 'startDate'
                }),
            new CardViewDateItemModel(
                {
                    label: 'ADF_CLOUD_PROCESS_HEADER.PROPERTIES.LAST_MODIFIED',
                    value: this.processInstanceDetails.lastModified,
                    format: 'DD-MM-YYYY',
                    key: 'lastModified'
                }),
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_PROCESS_HEADER.PROPERTIES.PARENT_ID',
                    value: this.processInstanceDetails.parentId,
                    key: 'parentId',
                    default: this.translationService.instant('ADF_CLOUD_PROCESS_HEADER.PROPERTIES.NONE')
                }),
            new CardViewTextItemModel(
                {
                    label: 'ADF_CLOUD_PROCESS_HEADER.PROPERTIES.BUSINESS_KEY',
                    value: this.processInstanceDetails.businessKey,
                    key: 'businessKey',
                    default: this.translationService.instant('ADF_CLOUD_PROCESS_HEADER.PROPERTIES.NONE')
                })
        ];
    }

    private isValidSelection(filteredProperties: string[], cardItem: CardViewBaseItemModel): boolean {
        return filteredProperties ? filteredProperties.indexOf(cardItem.key) >= 0 : true;
    }

}
