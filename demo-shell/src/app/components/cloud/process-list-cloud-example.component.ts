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
import { UserPreferencesService } from '@alfresco/adf-core';
import { ProcessListCloudComponent } from '@alfresco/adf-process-services-cloud';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-process-list-example',
    templateUrl: './process-list-cloud-example.component.html',
    styleUrls: ['./process-list-cloud-example.component.scss']
})
export class ProcessListCloudExampleComponent implements OnInit {

    @ViewChild('processCloud')
    processCloud: ProcessListCloudComponent;

    sortFormControl: FormControl;
    sortDirectionFormControl: FormControl;

    currentAppName: string = '';
    filterName: string = '';
    status: string = '';
    filterId: string = '';
    sort: string = '';
    sortArray: any[];
    sortField: string;
    sortDirection: string;

    columns = [
        {key: 'id', label: 'ID'},
        {key: 'name', label: 'NAME'},
        {key: 'status', label: 'STATUS'},
        {key: 'startDate', label: 'START DATE'}
      ];

    constructor(private userPreference: UserPreferencesService) {
    }

    ngOnInit() {
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

    onClearFilters() {
        this.processCloud.reload();
    }

    onFilterSelected(filter) {
        this.status = filter.query.state || '';
        this.sort = filter.query.sort;
        this.sortDirection = filter.query.order;
        this.filterName = filter.name;
        this.sortDirectionFormControl.setValue(this.sortDirection);
        this.sortFormControl.setValue(this.sort);
    }
}
