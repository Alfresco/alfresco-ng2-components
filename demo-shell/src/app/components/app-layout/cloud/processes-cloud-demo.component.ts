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

import { Component, ViewChild, OnInit } from '@angular/core';
import {
    ProcessListCloudComponent,
    ProcessFilterCloudModel,
    ProcessListCloudSortingModel,
    ProcessFiltersCloudComponent
} from '@alfresco/adf-process-services-cloud';

import { ActivatedRoute, Router } from '@angular/router';
import { UserPreferencesService, AppConfigService } from '@alfresco/adf-core';
import { CloudLayoutService } from './services/cloud-layout.service';

@Component({
    templateUrl: './processes-cloud-demo.component.html',
    styleUrls: ['./processes-cloud-demo.component.scss']
})
export class ProcessesCloudDemoComponent implements OnInit {

    public static ACTION_SAVE_AS = 'SAVE_AS';
    static PROCESS_FILTER_PROPERTY_KEYS = 'adf-edit-process-filter.properties';

    @ViewChild('processCloud')
    processCloud: ProcessListCloudComponent;

    @ViewChild('processFiltersCloud')
    processFiltersCloud: ProcessFiltersCloudComponent;

    appName: string = '';
    isFilterLoaded: boolean;

    filterId: string = '';
    sortArray: any = [];
    selectedRow: any;
    multiselect: boolean;
    selectionMode: string;
    selectedRows: string[] = [];
    testingMode: boolean;
    processFilterProperties: any[] = [];

    editedFilter: ProcessFilterCloudModel;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private cloudLayoutService: CloudLayoutService,
        private userPreference: UserPreferencesService,
        private appConfig: AppConfigService) {
        const properties = this.appConfig.get<Array<any>>(ProcessesCloudDemoComponent.PROCESS_FILTER_PROPERTY_KEYS);
        if (properties) {
            this.processFilterProperties = properties;
        }
    }

    ngOnInit() {
        this.isFilterLoaded = false;
        this.route.parent.params.subscribe((params) => {
            this.appName = params.appName;
        });

        this.route.queryParams.subscribe((params) => {
            this.isFilterLoaded = true;
            this.onFilterChange(params);
            this.filterId = params.id;
        });

        this.cloudLayoutService.getCurrentSettings()
            .subscribe((settings) => this.setCurrentSettings(settings));
    }

    setCurrentSettings(settings) {
        if (settings.multiselect !== undefined) {
            this.multiselect = settings.multiselect;
        }
        if (settings.testingMode !== undefined) {
            this.testingMode = settings.testingMode;
        }
        if (settings.selectionMode !== undefined) {
            this.selectionMode = settings.selectionMode;
        }
    }

    onChangePageSize(event) {
        this.userPreference.paginationSize = event.maxItems;
    }

    resetSelectedRows() {
        this.selectedRows = [];
    }

    onRowClick($event) {
        this.selectedRow = $event;
    }

    onFilterChange(query: any) {
        this.editedFilter = Object.assign({}, query);
        this.sortArray = [new ProcessListCloudSortingModel({ orderBy: this.editedFilter.sort, direction: this.editedFilter.order })];
    }

    onProcessFilterAction(filterAction: any) {
        this.cloudLayoutService.setCurrentProcessFilterParam({ id: filterAction.filter.id });
        if (filterAction.actionType === ProcessesCloudDemoComponent.ACTION_SAVE_AS) {
            this.router.navigate([`/cloud/${this.appName}/processes/`], { queryParams: filterAction.filter });
        }
    }

    onRowsSelected(nodes) {
        this.resetSelectedRows();
        this.selectedRows = nodes.map((node) => node.obj.entry);
    }
}
