/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TaskFilterCloudService } from '../services/task-filter-cloud.service';
import { TaskFilterCloudModel, FilterParamsModel } from '../models/filter-cloud.model';
import { TranslationService } from '@alfresco/adf-core';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adf-cloud-task-filters',
    templateUrl: './task-filters-cloud.component.html',
    styleUrls: ['task-filters-cloud.component.scss']
})
export class TaskFiltersCloudComponent implements OnInit, OnChanges, OnDestroy {
    /** Display filters available to the current user for the application with the specified name. */
    @Input()
    appName: string = '';

    /**
     * Parameters to use for the task filter cloud. If there is no match then the default filter
     * (the first one in the list) is selected.
     */
    @Input()
    filterParam: FilterParamsModel;

    /** Toggles display of the filter's icons. */
    @Input()
    showIcons: boolean = false;

    /** Emitted when a filter in the list is clicked. */
    @Output()
    filterClick: EventEmitter<TaskFilterCloudModel> = new EventEmitter<TaskFilterCloudModel>();

    /** Emitted when the list is loaded. */
    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when an error occurs during loading. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    filters$: Observable<TaskFilterCloudModel[]>;

    currentFilter: TaskFilterCloudModel;

    filters: TaskFilterCloudModel [] = [];

    private onDestroy$ = new Subject<boolean>();

    constructor(private taskFilterCloudService: TaskFilterCloudService, private translationService: TranslationService) {
    }

    ngOnInit() {
        this.getFilters(this.appName);
    }

    ngOnChanges(changes: SimpleChanges) {
        const appName = changes['appName'];
        const filter = changes['filterParam'];
        if (appName && appName.currentValue !== appName.previousValue) {
            this.getFilters(appName.currentValue);
        } else if (filter && filter.currentValue !== filter.previousValue) {
            this.selectFilterAndEmit(filter.currentValue);
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    /**
     * Return the filter list filtered by appName
     */
    getFilters(appName: string) {
        this.filters$ = this.taskFilterCloudService.getTaskListFilters(appName);

        this.filters$.pipe(takeUntil(this.onDestroy$)).subscribe(
            (res: TaskFilterCloudModel[]) => {
                this.resetFilter();
                this.filters = Object.assign([], res);
                this.selectFilterAndEmit(this.filterParam);
                this.success.emit(res);
            },
            (err: any) => {
                this.error.emit(err);
            }
        );
    }

    public selectFilter(paramFilter: FilterParamsModel) {
        if (paramFilter) {
            this.currentFilter = this.filters.find( (filter: TaskFilterCloudModel, index) =>
                paramFilter.index === index ||
                paramFilter.key === filter.key ||
                paramFilter.id === filter.id ||
                (paramFilter.name &&
                    (paramFilter.name.toLocaleLowerCase() === this.translationService.instant(filter.name).toLocaleLowerCase())
                ));
        }
    }

    public selectFilterAndEmit(newParamFilter: FilterParamsModel) {
        this.selectFilter(newParamFilter);
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
    getCurrentFilter(): TaskFilterCloudModel {
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

    isActiveFilter(filter: any): boolean {
        return this.currentFilter.name === filter.name;
    }
}
