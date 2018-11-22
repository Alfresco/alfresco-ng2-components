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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskFilterCloudService } from '../services/task-filter-cloud.service';
import { TaskFilterCloudRepresentationModel, FilterParamsModel } from '../models/filter-cloud.model';
@Component({
    selector: 'adf-cloud-task-filters',
    templateUrl: './task-filters-cloud.component.html',
    styleUrls: ['task-filters-cloud.component.scss']
})
export class TaskFiltersCloudComponent implements OnChanges {

    @Input()
    appName: string;

    @Input()
    filterParam: FilterParamsModel;

    @Input()
    showIcons: boolean = false;

    @Output()
    filterClick: EventEmitter<TaskFilterCloudRepresentationModel> = new EventEmitter<TaskFilterCloudRepresentationModel>();

    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    filters$: Observable<TaskFilterCloudRepresentationModel[]>;

    currentFilter: TaskFilterCloudRepresentationModel;

    filters: TaskFilterCloudRepresentationModel [] = [];

    constructor(private taskFilterCloudService: TaskFilterCloudService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        const appName = changes['appName'];
        const filter = changes['filterParam'];
        if (appName && appName.currentValue) {
            this.getFilters(appName.currentValue);
        } else if (filter && filter.currentValue !== filter.previousValue) {
            this.selectFilter(filter.currentValue);
        }
    }

    /**
     * Return the filter list filtered by appName
     */
    getFilters(appName: string) {
        this.filters$ = this.taskFilterCloudService.getTaskListFilters(appName);

        this.filters$.subscribe(
            (res: TaskFilterCloudRepresentationModel[]) => {
                if (res.length === 0) {
                    this.createFilters(appName);
                } else {
                    this.resetFilter();
                    this.filters = res;
                }
                this.selectFilterAndEmit(this.filterParam);
                this.success.emit(res);
            },
            (err: any) => {
                this.error.emit(err);
            }
        );
    }

    /**
     * Create default filters by appId
     */
    createFilters(appName?: string) {
        this.filters$ =  this.taskFilterCloudService.createDefaultFilters(appName);

        this.filters$.subscribe(
            (resDefault: TaskFilterCloudRepresentationModel[]) => {
                this.resetFilter();
                this.filters = resDefault;
            },
            (errDefault: any) => {
                this.error.emit(errDefault);
            }
        );
    }

    public selectFilter(newFilter: FilterParamsModel) {
        if (newFilter) {
            this.currentFilter = this.filters.find( (filter, index) =>
                newFilter.index === index ||
                newFilter.id === filter.id ||
                (newFilter.name &&
                    (newFilter.name.toLocaleLowerCase() === filter.name.toLocaleLowerCase())
                ));
        }
        if (!this.currentFilter) {
            this.selectDefaultTaskFilter();
        }
    }

    public selectFilterAndEmit(newFilter: FilterParamsModel) {
        this.selectFilter(newFilter);
        this.filterClick.emit(this.currentFilter);
    }

    /**
     * Select as default task filter the first in the list
     */
    public selectDefaultTaskFilter() {
        if (!this.isFilterListEmpty()) {
            this.currentFilter = this.filters[0];
        }
    }

    /**
     * Return the current task
     */
    getCurrentFilter(): TaskFilterCloudRepresentationModel {
        return this.currentFilter;
    }

    /**
     * Check if the filter list is empty
     */
    isFilterListEmpty(): boolean {
        return this.filters === undefined || (this.filters && this.filters.length === 0);
    }

    /**
     * Reset the filters properties
     */
    private resetFilter() {
        this.filters = [];
        this.currentFilter = undefined;
    }
}
