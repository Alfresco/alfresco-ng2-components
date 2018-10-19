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

import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { TaskListCloudComponent, TaskListCloudSortingModel } from '@alfresco/adf-process-services-cloud';
import { UserPreferencesService } from '@alfresco/adf-core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-task-list-cloud-demo',
    templateUrl: 'task-list-cloud-demo.component.html',
    styleUrls: ['task-list-cloud-demo.component.scss']
})
export class TaskListCloudDemoComponent implements OnInit, AfterViewInit {

    @ViewChild('taskCloud')
    taskCloud: TaskListCloudComponent;

    appDefinitionList: Observable<any>;
    applicationName: string = '';
    status: string = '';
    clickedRow: string = '';
    selectTask: string = '';
    sortField: string = '';
    sortDirection: string = 'ASC';
    sortArray: TaskListCloudSortingModel[] = [];

    constructor(private route: ActivatedRoute,
                private userPreference: UserPreferencesService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.applicationName = params.applicationName;
        });
    }

    ngAfterViewInit() {
        /*tslint:disable-next-line*/
        this.taskCloud && this.applicationName ? this.taskCloud.reload() : console.log('FAIL');
    }

    onChangePageSize(event) {
        this.userPreference.paginationSize = event.maxItems;
    }

    onRowClick($event) {
        this.clickedRow = $event;
    }

    onFilterButtonClick($event) {
        let newSortParam: TaskListCloudSortingModel = {
            orderBy: this.sortField,
            direction: this.sortDirection };
        this.sortArray.push(newSortParam);
        this.taskCloud.reload();
    }

}
