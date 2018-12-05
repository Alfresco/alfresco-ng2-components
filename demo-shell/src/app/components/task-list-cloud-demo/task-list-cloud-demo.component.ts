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

import { Component, ViewChild, OnInit } from '@angular/core';
import {
    TaskListCloudComponent,
    TaskFiltersCloudComponent,
    TaskListCloudSortingModel,
    TaskFilterCloudModel,
    EditTaskFilterCloudComponent
} from '@alfresco/adf-process-services-cloud';
import { UserPreferencesService } from '@alfresco/adf-core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-task-list-cloud-demo',
    templateUrl: 'task-list-cloud-demo.component.html',
    styleUrls: ['task-list-cloud-demo.component.scss']
})
export class TaskListCloudDemoComponent implements OnInit {

    @ViewChild('taskCloud')
    taskCloud: TaskListCloudComponent;

    @ViewChild('taskFiltersCloud')
    taskFiltersCloud: TaskFiltersCloudComponent;

    appDefinitionList: Observable<any>;
    applicationName;
    status: string = '';
    showStartTask = false;
    clickedRow: string = '';
    filterTaskParam;
    sortArray: TaskListCloudSortingModel[];
    editedFilter: TaskFilterCloudModel;

    currentFilter: TaskFilterCloudModel;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userPreference: UserPreferencesService
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.applicationName = params.applicationName;
        });

        this.route.queryParams.subscribe( (params) => {
            this.onFilterChange(params);
        });
    }

    onFilterSelected(filter: TaskFilterCloudModel) {
        this.currentFilter = Object.assign({}, filter);
        this.sortArray = [new TaskListCloudSortingModel({ orderBy: this.currentFilter.sort, direction: this.currentFilter.order})];

        this.router.navigate([`/cloud/${this.applicationName}/tasks/`], {
            queryParams: this.currentFilter
        });
    }

    onFilterChange(filter: any) {
        this.editedFilter = Object.assign({}, this.currentFilter, filter);
        this.sortArray = [new TaskListCloudSortingModel({ orderBy: this.editedFilter.sort, direction: this.editedFilter.order})];
    }

    onStartTask() {
        this.showStartTask = true;
    }

    onStartTaskSuccess() {
        this.showStartTask = false;
        this.filterTaskParam = { name: 'My tasks'};
    }

    onCancelStartTask() {
        this.showStartTask = false;
    }

    onChangePageSize(event) {
        this.userPreference.paginationSize = event.maxItems;
    }

    onRowClick($event) {
        this.clickedRow = $event;
    }

    onEditActions(event: any) {
        if (event.actionType === EditTaskFilterCloudComponent.ACTION_SAVE) {
            this.save(event.id);
        } else if (event.actionType === EditTaskFilterCloudComponent.ACTION_SAVE_AS) {
            this.saveAs(event.id);
        } else if (event.actionType === EditTaskFilterCloudComponent.ACTION_DELETE) {
            this.deleteFilter();
        }
    }

    saveAs(filterId) {
        this.taskFiltersCloud.filterParam = <any> {id : filterId};
        this.taskFiltersCloud.getFilters(this.applicationName);
    }

    save(filterId) {
        this.taskFiltersCloud.filterParam = <any> {id : filterId};
        this.taskFiltersCloud.getFilters(this.applicationName);
    }

    deleteFilter() {
        this.taskFiltersCloud.getFilters(this.applicationName);
    }
}
