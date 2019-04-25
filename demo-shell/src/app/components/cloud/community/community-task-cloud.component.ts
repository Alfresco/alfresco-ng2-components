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
import { TaskListCloudComponent, TaskListCloudSortingModel, TaskFilterCloudModel, TaskFilterCloudService } from '@alfresco/adf-process-services-cloud';
import { UserPreferencesService, AppConfigService } from '@alfresco/adf-core';
import { ActivatedRoute, Router } from '@angular/router';
import { CloudLayoutService } from '../services/cloud-layout.service';

@Component({
    templateUrl: './community-task-cloud.component.html',
    styles: [`.adf-cloud-layout-tab-body .mat-tab-body-wrapper {
        height: 100%;
      }
      `]
})
export class CommunityTasksCloudDemoComponent implements OnInit {

    public static ACTION_SAVE_AS = 'saveAs';
    static TASK_FILTER_PROPERTY_KEYS = 'adf-edit-task-filter';

    @ViewChild('taskCloud')
    taskCloud: TaskListCloudComponent;

    isFilterLoaded = false;

    selectedRow: any;

    sortArray: TaskListCloudSortingModel[];
    editedFilter: TaskFilterCloudModel;
    taskFilterProperties: any  = { filterProperties: [], sortProperties: [], actions: [] };

    filterId;
    multiselect: boolean;
    selectedRows: string[] = [];
    testingMode: boolean;
    selectionMode: string;
    taskDetailsRedirection: boolean;

    constructor(
        private cloudLayoutService: CloudLayoutService,
        private route: ActivatedRoute,
        private router: Router,
        private taskFilterCloudService: TaskFilterCloudService,
        private userPreference: UserPreferencesService,
        private appConfig: AppConfigService) {

        const properties = this.appConfig.get<Array<any>>(CommunityTasksCloudDemoComponent.TASK_FILTER_PROPERTY_KEYS);
        if (properties) {
            this.taskFilterProperties = properties;
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
                setTimeout( () => {
                    this.loadDefaultFilters();
                });
            }
        });

        this.cloudLayoutService.getCurrentSettings()
            .subscribe((settings) => this.setCurrentSettings(settings));
    }

    loadDefaultFilters() {
        this.taskFilterCloudService.getTaskListFilters('community').subscribe( (filters: TaskFilterCloudModel[]) => {
            this.onFilterChange(filters[0]);
        });
    }

    setCurrentSettings(settings) {
        if (settings) {
            this.multiselect = settings.multiselect;
            this.testingMode = settings.testingMode;
            this.selectionMode = settings.selectionMode;
            this.taskDetailsRedirection = settings.taskDetailsRedirection;
        }
    }

    onChangePageSize(event) {
        this.userPreference.paginationSize = event.maxItems;
    }

    resetSelectedRows() {
        this.selectedRows = [];
    }

    onRowClick(taskId) {
        if (!this.multiselect && this.selectionMode !== 'multiple' && this.taskDetailsRedirection) {
            this.router.navigate([`/cloud/community/task-details/${taskId}`]);
        }
    }

    onRowsSelected(nodes) {
        this.resetSelectedRows();
        this.selectedRows = nodes.map((node) => node.obj.entry);
    }

    onFilterChange(filter: any) {
        this.editedFilter = Object.assign({}, filter);
        this.sortArray = [new TaskListCloudSortingModel({ orderBy: this.editedFilter.sort, direction: this.editedFilter.order })];
    }

    onTaskFilterAction(filterAction: any) {
        this.cloudLayoutService.setCurrentTaskFilterParam({ id: filterAction.filter.id });
        if (filterAction.actionType === CommunityTasksCloudDemoComponent.ACTION_SAVE_AS) {
            this.router.navigate([`/cloud/community/tasks/`], { queryParams: filterAction.filter });
        }
    }
}
