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
import { TaskListCloudComponent, TaskListCloudSortingModel } from '@alfresco/adf-process-services-cloud';
import { UserPreferencesService } from '@alfresco/adf-core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'app-task-list-cloud-demo',
    templateUrl: 'task-list-cloud-demo.component.html',
    styleUrls: ['task-list-cloud-demo.component.scss']
})
export class TaskListCloudDemoComponent implements OnInit {

    @ViewChild('taskCloud')
    taskCloud: TaskListCloudComponent;

    sortFormControl: FormControl;
    sortDirectionFormControl: FormControl;

    appDefinitionList: Observable<any>;
    applicationName;
    status: string = '';
    sort: string = '';
    isFilterLoaded = false;
    showStartTask = false;
    sortDirection: string = 'ASC';
    filterName: string;
    clickedRow: string = '';
    selectTask: string = '';
    filterTaskParam;
    sortArray: TaskListCloudSortingModel [];

    columns = [
        {key: 'id', label: 'ID'},
        {key: 'name', label: 'NAME'},
        {key: 'createdDate', label: 'Created Date'},
        {key: 'priority', label: 'PRIORITY'},
        {key: 'processDefinitionId', label: 'PROCESS DEFINITION ID'}
      ];

    constructor(
        public dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private userPreference: UserPreferencesService) {
    }

    ngOnInit() {
        this.isFilterLoaded = false;
        this.route.params.subscribe(params => {
            this.applicationName = params.applicationName;
        });

        this.sortFormControl = new FormControl('');

        this.sortFormControl.valueChanges.subscribe(
            (sortValue) => {
                this.sort = sortValue;

                this.sortArray = [{
                    orderBy: this.sort,
                    direction: this.sortDirection
                }];
            }
        );
        this.sortDirectionFormControl = new FormControl('');

        this.sortDirectionFormControl.valueChanges.subscribe(
            (sortDirectionValue) => {
                this.sortDirection = sortDirectionValue;

                this.sortArray = [{
                    orderBy: this.sort,
                    direction: this.sortDirection
                }];
            }
        );

        this.route.queryParams
            .subscribe(params => {
                if (params.status) {
                    this.status = params.status;
                    this.sort = params.sort;
                    this.sortDirection = params.order;
                    this.filterName = params.filterName;
                    this.isFilterLoaded = true;
                    this.sortDirectionFormControl.setValue(this.sortDirection);
                    this.sortFormControl.setValue(this.sort);
                }
            });
    }

    onFilterSelected(filter) {
        const queryParams = {
            id: filter.id,
            filterName: filter.name,
            status: filter.query.state,
            assignee: filter.query.assignment,
            sort: filter.query.sort,
            order: filter.query.order
        };
        this.router.navigate([`/cloud/${this.applicationName}/tasks/`], {queryParams: queryParams});
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
}
