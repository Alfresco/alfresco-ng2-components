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

import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    ProcessFilterCloudModel,
    ProcessFilterCloudService,
    ProcessFiltersCloudComponent,
    ProcessListCloudComponent,
    ProcessListCloudSortingModel
} from '@alfresco/adf-process-services-cloud';

import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService, UserPreferencesService } from '@alfresco/adf-core';
import { CloudLayoutService } from '../services/cloud-layout.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Pagination } from '@alfresco/js-api';

const PROCESS_FILTER_PROPERTY_KEYS = 'adf-edit-process-filter';
const ACTION_SAVE_AS = 'saveAs';

@Component({
    selector: 'app-community-processes-cloud-demo',
    templateUrl: './community-processes-cloud.component.html',
    styleUrls: ['./community-processes-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CommunityProcessesCloudDemoComponent implements OnInit, OnDestroy {
    @ViewChild('processCloud')
    processCloud: ProcessListCloudComponent;

    @ViewChild('processFiltersCloud')
    processFiltersCloud: ProcessFiltersCloudComponent;

    isFilterLoaded: boolean;
    filterId: string = '';
    sortArray: any = [];
    selectedRow: any;
    multiselect: boolean;
    selectionMode: string;
    selectedRows: any[] = [];
    testingMode: boolean;
    processFilterProperties: any  = { filterProperties: [], sortProperties: [], actions: [] };

    editedFilter: ProcessFilterCloudModel;

    private onDestroy$ = new Subject<boolean>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private cloudLayoutService: CloudLayoutService,
        private userPreference: UserPreferencesService,
        private processFilterCloudService: ProcessFilterCloudService,
        private appConfig: AppConfigService) {
        const properties = this.appConfig.get<Array<any>>(
            PROCESS_FILTER_PROPERTY_KEYS
        );

        if (properties) {
            this.processFilterProperties = properties;
        }
    }

    ngOnInit() {
        this.isFilterLoaded = false;

        this.route.queryParams.subscribe((params) => {
            if (Object.keys(params).length > 0) {
                this.isFilterLoaded = true;
                this.onFilterChange(params);
                this.filterId = params.id;
            } else {
                this.loadDefaultFilters();
            }
        });

        this.cloudLayoutService
            .settings$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(settings => this.setCurrentSettings(settings));
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    loadDefaultFilters() {
        this.processFilterCloudService
            .getProcessFilters('community')
            .subscribe((filters: ProcessFilterCloudModel[]) => {
                this.onFilterChange(filters[0]);
            });
    }

    setCurrentSettings(settings) {
        if (settings) {
            this.multiselect = settings.multiselect;
            this.testingMode = settings.testingMode;
            this.selectionMode = settings.selectionMode;
        }
    }

    onChangePageSize(event: Pagination) {
        this.userPreference.paginationSize = event.maxItems;
    }

    resetSelectedRows() {
        this.selectedRows = [];
    }

    onRowClick(processInstanceId: string) {
        this.router.navigate([`/cloud/community/process-details/${processInstanceId}`]);
    }

    onFilterChange(query: any) {
        this.editedFilter = Object.assign({}, query);
        this.sortArray = [
            new ProcessListCloudSortingModel({
                orderBy: this.editedFilter.sort,
                direction: this.editedFilter.order
            })
        ];
    }

    onProcessFilterAction(filterAction: any) {
        this.cloudLayoutService.setCurrentProcessFilterParam({ id: filterAction.filter.id });
        if (filterAction.actionType === ACTION_SAVE_AS) {
            this.router.navigate([`/cloud/community/processes/`], { queryParams: filterAction.filter });
        }
    }

    onRowsSelected(nodes) {
        this.resetSelectedRows();
        this.selectedRows = nodes.map((node) => node.obj);
    }
}
