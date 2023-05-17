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
    ServiceTaskFilterCloudModel,
    ServiceTaskListCloudComponent,
    TaskListCloudSortingModel
} from '@alfresco/adf-process-services-cloud';
import { AppConfigService, PaginationModel, UserPreferencesService } from '@alfresco/adf-core';
import { CloudLayoutService, CloudServiceSettings } from './services/cloud-layout.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const TASK_FILTER_PROPERTY_KEYS = 'adf-edit-service-task-filter';

@Component({
    selector: 'app-service-task-list-cloud-demo',
    templateUrl: './service-task-list-cloud-demo.component.html',
    styleUrls: ['./service-task-list-cloud-demo.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ServiceTaskListCloudDemoComponent implements OnInit, OnDestroy {
    @ViewChild('taskCloud')
    taskCloud: ServiceTaskListCloudComponent;

    appName = 'simpleapp';

    isFilterLoaded = false;

    selectedRow: any;

    sortArray: TaskListCloudSortingModel[];
    editedFilter: ServiceTaskFilterCloudModel;
    taskFilterProperties: any  = { filterProperties: [], sortProperties: [], actions: [] };

    multiselect: boolean;
    selectedRows: string[] = [];
    actionMenu: boolean;
    contextMenu: boolean;
    actions: any[] = [];
    selectedAction: { id: number; name: string; actionType: string};
    selectedContextAction: { id: number; name: string; actionType: string};
    selectionMode: string;
    filterId: string;

    private onDestroy$ = new Subject<boolean>();

    constructor(
        private cloudLayoutService: CloudLayoutService,
        private userPreference: UserPreferencesService,
        private appConfig: AppConfigService) {

        const properties = this.appConfig.get<Array<any>>(TASK_FILTER_PROPERTY_KEYS);
        if (properties === this.taskFilterProperties) {
            this.taskFilterProperties = properties;
        }
    }

    ngOnInit() {
        this.isFilterLoaded = false;
        this.cloudLayoutService.settings$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(settings => this.setCurrentSettings(settings));
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    setCurrentSettings(settings: CloudServiceSettings) {
        if (settings) {
            this.multiselect = settings.multiselect;
            this.selectionMode = settings.selectionMode;
            this.actionMenu = settings.actionMenu;
            this.contextMenu = settings.contextMenu;
            this.actions = settings.actions;
        }
    }

    onTaskFilterSelected(filter: ServiceTaskFilterCloudModel) {
        this.filterId = filter.id;
        this.editedFilter = filter;
    }

    onChangePageSize(event: PaginationModel) {
        this.userPreference.paginationSize = event.maxItems;
    }

    resetSelectedRows() {
        this.selectedRows = [];
    }

    onFilterChange(filter: ServiceTaskFilterCloudModel) {
        this.appName = filter.appName;
        this.editedFilter = Object.assign({}, filter);
        this.sortArray = [new TaskListCloudSortingModel({ orderBy: this.editedFilter.sort, direction: this.editedFilter.order })];
    }
}
