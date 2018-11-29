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
    TaskFilterCloudRepresentationModel,
    TaskFilterCloudService,
    EditTaskFilterCloudComponent,
    QueryModel
} from '@alfresco/adf-process-services-cloud';
import { UserPreferencesService, TranslationService } from '@alfresco/adf-core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { TaskFilterDialogCloudComponent } from './task-filter-dialog/task-filter-dialog-cloud.component';

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
    editedQuery: QueryModel;

    currentFilter: TaskFilterCloudRepresentationModel;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private translateService: TranslationService,
        private userPreference: UserPreferencesService,
        public dialog: MatDialog,
        private taskFilterCloudService: TaskFilterCloudService
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.applicationName = params.applicationName;
        });

        this.route.queryParams.subscribe( (params) => {
            this.editedQuery = Object.assign({}, new QueryModel(params));
            this.editedQuery.appName = this.applicationName;
        });
    }

    onFilterSelected(filter) {
        const queryParams = this.createQueryParams(filter);
        this.createFilterRepresentationModel(filter);
        this.router.navigate([`/cloud/${this.applicationName}/tasks/`], {
            queryParams: queryParams
        });
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

    onFilterChange(query: any) {
        this.editedQuery = Object.assign({}, query);
        this.sortArray = [new TaskListCloudSortingModel({ orderBy: this.editedQuery.sort, direction: this.editedQuery.order})];
    }

    onSuccess(filter: TaskFilterCloudRepresentationModel) {
        const queryParams = this.createQueryParams(filter);
        this.createFilterRepresentationModel(filter);
        this.router.navigate([`/cloud/${this.applicationName}/tasks/`], {
            queryParams: queryParams
        });
    }

    createFilterRepresentationModel(filter) {
        this.currentFilter = new TaskFilterCloudRepresentationModel(filter);
    }

    createQueryParams(filter) {
        return {
            id: filter.id,
            name: filter.name,
            state: filter.query.state,
            assignment: filter.query.assignment,
            sort: filter.query.sort,
            order: filter.query.order
        };
    }

    onChangePageSize(event) {
        this.userPreference.paginationSize = event.maxItems;
    }

    onRowClick($event) {
        this.clickedRow = $event;
    }

    onEditActions(event: any) {
        if (event.actionType === EditTaskFilterCloudComponent.ACTION_SAVE) {
            this.save(this.editedQuery);
        } else if (event.actionType === EditTaskFilterCloudComponent.ACTION_SAVE_AS) {
            this.saveAs();
        } else if (event.actionType === EditTaskFilterCloudComponent.ACTION_DELETE) {
            this.deleteFilter();
        }
    }
     saveAs() {
        const dialogRef = this.dialog.open(TaskFilterDialogCloudComponent, {
            data: {
                name: this.translateService.instant(this.currentFilter.name)
            },
            height: 'auto',
            minWidth: '30%'
        });
        dialogRef.afterClosed().subscribe( (result) => {
            if (result && result.action === TaskFilterDialogCloudComponent.ACTION_SAVE) {
                const filter = new TaskFilterCloudRepresentationModel(
                    {
                        name: result.name,
                        icon: result.icon,
                        id: Math.random().toString(36).substr(2, 9),
                        key: 'custom-' + result.name,
                        query: this.editedQuery
                    }
                );
                this.taskFilterCloudService.addFilter(filter);
                this.taskFiltersCloud.getFilters(this.applicationName);
            }
        });
    }
     save(newQuery: QueryModel) {
        this.currentFilter.query = newQuery;
        this.taskFilterCloudService.updateFilter(this.currentFilter);
        this.taskFiltersCloud.getFilters(this.applicationName);
    }
     deleteFilter() {
        this.taskFilterCloudService.deleteFilter(this.currentFilter);
        this.taskFiltersCloud.getFilters(this.applicationName);
    }
}
