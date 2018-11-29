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
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
    templateUrl: 'tasks-cloud-demo.component.html',
    styleUrls: ['tasks-cloud-demo.component.scss']
})
export class TasksCloudDemoComponent implements OnInit {

    @ViewChild('taskCloud')
    taskCloud: TaskListCloudComponent;

    sortFormControl: FormControl;
    sortDirectionFormControl: FormControl;

    appDefinitionList: Observable<any>;
    applicationName: string = '';
    status: string = '';
    sort: string = '';
    isFilterLoaded = false;
    sortDirection: string = 'ASC';
    filterName: string;
    clickedRow: string = '';
    selectTask: string = '';
    sortArray: TaskListCloudSortingModel [];

    columns = [
        {key: 'id', label: 'ID'},
        {key: 'name', label: 'NAME'},
        {key: 'createdDate', label: 'Created Date'},
        {key: 'priority', label: 'PRIORITY'},
        {key: 'processDefinitionId', label: 'PROCESS DEFINITION ID'}
      ];

    constructor(
        private route: ActivatedRoute,
        private userPreference: UserPreferencesService) {
    }

    ngOnInit() {
        this.isFilterLoaded = false;
        this.route.parent.params.subscribe(params => {
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
                if (params.filterName) {
                    this.status = params.status ? params.status : '';
                    this.sort = params.sort;
                    this.sortDirection = params.order;
                    this.filterName = params.filterName;
                    this.isFilterLoaded = true;
                    this.sortDirectionFormControl.setValue(this.sortDirection);
                    this.sortFormControl.setValue(this.sort);
                }
            });
    }

    onChangePageSize(event) {
        this.userPreference.paginationSize = event.maxItems;
    }

    onRowClick($event) {
        this.clickedRow = $event;
    }
}
