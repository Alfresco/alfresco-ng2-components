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

import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { TaskListCloudComponent } from '@alfresco/adf-process-services-cloud';
import { UserPreferencesService } from '@alfresco/adf-core';

@Component({
    selector: 'app-task-list-cloud-demo',
    templateUrl: 'task-list-cloud-demo.component.html',
    styleUrls: ['task-list-cloud-demo.component.scss']
})
export class TaskListCloudDemoComponent implements AfterViewInit {

    constructor(private userPreference: UserPreferencesService) {
    }

    @ViewChild('taskCloud')
    taskCloud: TaskListCloudComponent;

    ngAfterViewInit() {
        /*tslint:disable-next-line*/
        this.taskCloud ? this.taskCloud.reload() : console.log('FAIL');
    }

    onChangePageSize(event) {
        this.userPreference.paginationSize = event.maxItems;
    }

}
