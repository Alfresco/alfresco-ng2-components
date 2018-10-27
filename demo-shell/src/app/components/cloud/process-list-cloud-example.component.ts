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

import { Component, ViewChild } from '@angular/core';
import { UserPreferencesService } from '@alfresco/adf-core';
import { ProcessListCloudComponent } from '@alfresco/adf-process-services-cloud';

@Component({
    selector: 'app-process-list-example',
    templateUrl: './process-list-cloud-example.component.html',
    styleUrls: ['./process-list-cloud-example.component.scss']
})
export class ProcessListCloudExampleComponent {

    @ViewChild('processCloud')
    processCloud: ProcessListCloudComponent;

    currentAppName: string = '';
    status: string = '';
    filterId: string = '';
    sortArray: any = [];
    sortField: string;
    sortDirection: string;

    constructor(private userPreference: UserPreferencesService) {
    }

    onAppClick(appClicked: any) {
        this.currentAppName = appClicked.name;
    }

    onClick() {
        this.currentAppName = '';
    }

    onChangePageSize(event) {
        this.userPreference.paginationSize = event.maxItems;
    }

    onFilterButtonClick($event) {
        let newSortParam: any = {
            orderBy: this.sortField,
            direction: this.sortDirection };
        this.sortArray.push(newSortParam);
        this.processCloud.reload();
    }

    onClearFilters() {
        this.sortArray = [];
        this.processCloud.reload();
    }
}
