/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import {
    AppConfigService,
    CardViewBaseItemModel,
    CardViewComponent,
    CardViewDateItemModel,
    CardViewItem,
    CardViewTextItemModel,
    TranslationService
} from '@alfresco/adf-core';
import { ProcessInstanceCloud } from '../../start-process/models/process-instance-cloud.model';
import { ProcessCloudService } from '../../services/process-cloud.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';

@Component({
    selector: 'adf-cloud-process-header',
    imports: [CardViewComponent, MatCardModule, NgIf],
    templateUrl: './process-header-cloud.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./process-header-cloud.component.scss'],
    host: { class: 'adf-cloud-process-header' }
})
export class ProcessHeaderCloudComponent implements OnChanges, OnInit {
    /** (Required) The name of the application. */
    @Input({ required: true })
    appName: string = '';

    /** (Required) The id of the process instance. */
    @Input({ required: true })
    processInstanceId: string;

    /** Gets emitted each time a new process instance details are loaded. */
    @Output()
    loaded = new EventEmitter<ProcessInstanceCloud>();

    processInstanceDetails: ProcessInstanceCloud;
    properties: CardViewItem[];
    dateFormat: string;
    dateLocale: string;

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private processCloudService: ProcessCloudService,
        private translationService: TranslationService,
        private appConfig: AppConfigService
    ) {}

    ngOnInit() {
        this.dateFormat = this.appConfig.get('adf-cloud-process-header.defaultDateFormat');
        this.dateLocale = this.appConfig.get('dateValues.defaultDateLocale');

        this.processCloudService.dataChangesDetected
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((processDetails) => this.onLoaded(processDetails));
    }

    ngOnChanges() {
        if ((this.appName || this.appName === '') && this.processInstanceId) {
            this.loadProcessInstanceDetails(this.appName, this.processInstanceId);
        }
    }

    private loadProcessInstanceDetails(appName: string, processInstanceId: string) {
        this.processCloudService.getProcessInstanceById(appName, processInstanceId).subscribe((result) => this.onLoaded(result));
    }

    private onLoaded(processInstanceDetails: ProcessInstanceCloud) {
        this.processInstanceDetails = processInstanceDetails;
        this.refreshData();

        this.loaded.emit(processInstanceDetails);
    }

    /**
     * Refresh the card data
     */
    refreshData() {
        if (this.processInstanceDetails) {
            const defaultProperties = this.initDefaultProperties();
            const filteredProperties = this.appConfig.get<string[]>('adf-cloud-process-header.presets.properties');
            this.properties = defaultProperties.filter((cardItem) => this.isValidSelection(filteredProperties, cardItem));
        }
    }

    private initDefaultProperties(): any[] {
        return [
            new CardViewTextItemModel({
                label: 'ADF_CLOUD_PROCESS_HEADER.PROPERTIES.ID',
                value: this.processInstanceDetails.id,
                key: 'id'
            }),
            new CardViewTextItemModel({
                label: 'ADF_CLOUD_PROCESS_HEADER.PROPERTIES.NAME',
                value: this.processInstanceDetails.name,
                key: 'name',
                default: this.translationService.instant('ADF_CLOUD_PROCESS_HEADER.PROPERTIES.NAME_DEFAULT')
            }),
            new CardViewTextItemModel({
                label: 'ADF_CLOUD_PROCESS_HEADER.PROPERTIES.STATUS',
                value: this.processInstanceDetails.status,
                key: 'status'
            }),
            new CardViewTextItemModel({
                label: 'ADF_CLOUD_PROCESS_HEADER.PROPERTIES.INITIATOR',
                value: this.processInstanceDetails.initiator,
                key: 'initiator'
            }),
            new CardViewDateItemModel({
                label: 'ADF_CLOUD_PROCESS_HEADER.PROPERTIES.START_DATE',
                value: this.processInstanceDetails.startDate,
                key: 'startDate',
                format: this.dateFormat,
                locale: this.dateLocale
            }),
            new CardViewDateItemModel({
                label: 'ADF_CLOUD_PROCESS_HEADER.PROPERTIES.LAST_MODIFIED',
                value: this.processInstanceDetails.lastModified,
                key: 'lastModified',
                format: this.dateFormat,
                locale: this.dateLocale
            }),
            new CardViewTextItemModel({
                label: 'ADF_CLOUD_PROCESS_HEADER.PROPERTIES.PARENT_ID',
                value: this.processInstanceDetails.parentId,
                key: 'parentId',
                default: this.translationService.instant('ADF_CLOUD_PROCESS_HEADER.PROPERTIES.NONE')
            }),
            new CardViewTextItemModel({
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
