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

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TaskListCloudSortingModel, TaskFilterCloudModel, ServiceTaskListCloudComponent } from '@alfresco/adf-process-services-cloud';
import { UserPreferencesService, AppConfigService } from '@alfresco/adf-core';
import { CloudLayoutService } from './services/cloud-layout.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: 'service-task-list-cloud-demo.component.html'
})
export class ServiceTaskListCloudDemoComponent implements OnInit, OnDestroy {

    public static ACTION_SAVE_AS = 'saveAs';
    public static ACTION_DELETE = 'delete';
    static TASK_FILTER_PROPERTY_KEYS = 'adf-edit-service-task-filter';

    @ViewChild('taskCloud')
    taskCloud: ServiceTaskListCloudComponent;

    isFilterLoaded = false;

    selectedRow: any;

    sortArray: TaskListCloudSortingModel[];
    editedFilter: TaskFilterCloudModel;
    taskFilterProperties: any  = { filterProperties: [], sortProperties: [], actions: [] };

    multiselect: boolean;
    selectedRows: string[] = [];
    actionMenu: boolean;
    contextMenu: boolean;
    actions: any[] = [];
    selectedAction: { id: number, name: string, actionType: string};
    selectedContextAction: { id: number, name: string, actionType: string};
    selectionMode: string;

    private onDestroy$ = new Subject<boolean>();

    constructor(
        private cloudLayoutService: CloudLayoutService,
        private userPreference: UserPreferencesService,
        private appConfig: AppConfigService) {

        const properties = this.appConfig.get<Array<any>>(ServiceTaskListCloudDemoComponent.TASK_FILTER_PROPERTY_KEYS);
        if (properties) {
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

    setCurrentSettings(settings) {
        if (settings) {
            this.multiselect = settings.multiselect;
            this.selectionMode = settings.selectionMode;
            this.actionMenu = settings.actionMenu;
            this.contextMenu = settings.contextMenu;
            this.actions = settings.actions;
        }
    }

    onChangePageSize(event) {
        this.userPreference.paginationSize = event.maxItems;
    }

    resetSelectedRows() {
        this.selectedRows = [];
    }

    onFilterChange(filter: any) {
        this.editedFilter = Object.assign({}, filter);
        this.sortArray = [new TaskListCloudSortingModel({ orderBy: this.editedFilter.sort, direction: this.editedFilter.order })];
    }
}
