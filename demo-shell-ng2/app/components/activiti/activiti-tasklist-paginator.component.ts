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

// tslint:disable-next-line:adf-file-name
import { Component, OnInit } from '@angular/core';
import { Pagination } from 'alfresco-js-api';
import { TaskListService } from 'ng2-activiti-tasklist';

@Component({
    selector: 'activiti-tasklist-paginator',
    templateUrl: './activiti-tasklist-paginator.component.html'
})
export class ActivitiTasklistPaginatorComponent implements OnInit {

    pagination: Pagination = {
        skipCount: 0,
        maxItems: 5,
        totalItems: 0
    };

    page: number = 0;

    constructor(private taskListService: TaskListService) {
    }

    ngOnInit() {
        this.taskListService.tasksList$.subscribe(
            (tasks) => {
                this.pagination = {count: tasks.data.length, maxItems: this.pagination.maxItems, skipCount: this.pagination.skipCount, totalItems: tasks.total};
            }, (err) => {
            console.log('err');
        });

    }

    onPrevPage(pagination: Pagination): void {
        this.pagination.skipCount = pagination.skipCount;
        this.page--;
    }

    onNextPage(pagination: Pagination): void {
        this.pagination.skipCount = pagination.skipCount;
        this.page++;
    }

    onChangePageSize(pagination: Pagination): void {
        const { maxItems, skipCount } = pagination;
        this.page = (skipCount && maxItems) ? Math.floor(skipCount / maxItems) : 0;
        this.pagination.maxItems = maxItems;
        this.pagination.skipCount = skipCount;
    }

    onChangePageNumber(pagination: Pagination): void {
        this.pagination.skipCount = pagination.skipCount;
        this.page = Math.floor(pagination.skipCount / pagination.maxItems);
    }

}
