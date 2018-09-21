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

import { AppsProcessService } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterParamsModel, FilterRepresentationModel } from '../models/filter.model';
import { TaskFilterService } from './../services/task-filter.service';
import { TaskListService } from './../services/tasklist.service';

/**
 * @deprecated: in 2.4.0 'adf-filters' selector was deprecated, use adf-task-filters instead.
 */
@Component({
    selector: 'adf-task-filters, adf-filters',
    templateUrl: './task-filters-cloud.component.html',
    styleUrls: ['task-filters-cloud.component.scss']
})
export class TaskFiltersCloudComponent implements OnInit, OnChanges {

    /** Parameters to use for the task filter. If there is no match then
     * the default filter (the first one the list) is selected.
     */
    @Input()
    filterParam: FilterParamsModel;

    /** Emitted when a filter in the list is clicked. */
    @Output()
    filterClick: EventEmitter<FilterRepresentationModel> = new EventEmitter<FilterRepresentationModel>();

    /** Emitted when the list is loaded. */
    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when an error occurs during loading. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    /** Display filters available to the current user for the application with the specified ID. */
    @Input()
    appId: number;

    /** Display filters available to the current user for the application with the specified name. */
    @Input()
    appName: string;

    /** Toggles display of the filter's icon. */
    @Input()
    hasIcon: boolean;

    filter$: Observable<FilterRepresentationModel>;

    currentFilter: FilterRepresentationModel;

    filters: FilterRepresentationModel [] = [];

    private iconsMDL: IconModel;

    constructor(private taskFilterService: TaskFilterService,
                private taskListService: TaskListService,
                private appsProcessService: AppsProcessService) {
    }

    ngOnInit() {
        this.iconsMDL = new IconModel();
    }

    ngOnChanges(changes: SimpleChanges) {
        const appName = changes['appName'];
        const appId = changes['appId'];
        const filter = changes['filterParam'];
        if (appName && appName.currentValue) {
            this.getFiltersByAppName(appName.currentValue);
        } else if (appId && appId.currentValue !== appId.previousValue) {
            this.getFiltersByAppId(appId.currentValue);
        } else if (filter && filter.currentValue !== filter.previousValue) {
            this.selectFilter(filter.currentValue);
        }
    }

    /**
     * Return the task list filtered by appId or by appName
     * @param appId
     * @param appName
     */
    getFilters(appId?: number, appName?: string) {
        appName ? this.getFiltersByAppName(appName) : this.getFiltersByAppId(appId);
    }

    /**
     * Return the filter list filtered by appId
     * @param appId - optional
     */
    getFiltersByAppId(appId?: number) {
        this.taskFilterService.getTaskListFilters(appId).subscribe(
            (res: FilterRepresentationModel[]) => {
                if (res.length === 0 && this.isFilterListEmpty()) {
                    this.createFiltersByAppId(appId);
                } else {
                    this.resetFilter();
                    this.filters = res;
                    this.selectFilter(this.filterParam);
                    this.success.emit(res);
                }
            },
            (err: any) => {
                this.error.emit(err);
            }
        );
    }

    /**
     * Return the filter list filtered by appName
     * @param appName
     */
    getFiltersByAppName(appName: string) {
        this.appsProcessService.getDeployedApplicationsByName(appName).subscribe(
            application => {
                this.getFiltersByAppId(application.id);
            },
            (err) => {
                this.error.emit(err);
            });
    }

    /**
     * Create default filters by appId
     * @param appId
     */
    createFiltersByAppId(appId?: number) {
        this.taskFilterService.createDefaultFilters(appId).subscribe(
            (resDefault: FilterRepresentationModel[]) => {
                this.resetFilter();
                this.filters = resDefault;
                this.selectFilter(this.filterParam);
                this.success.emit(resDefault);
            },
            (errDefault: any) => {
                this.error.emit(errDefault);
            }
        );
    }

    /**
     * Pass the selected filter as next
     * @param filter
     */
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
     * Select filter with task
     * @param taskId
     */
    public selectFilterWithTask(taskId: string) {
        let filteredFilterList: FilterRepresentationModel[] = [];
        this.taskListService.getFilterForTaskById(taskId, this.filters).subscribe(
            (filter: FilterRepresentationModel) => {
                filteredFilterList.push(filter);
            },
            (err) => {
                this.error.emit(err);
            },
            () => {
                if (filteredFilterList.length > 0) {
                    this.selectFilter(filteredFilterList[0]);
                    this.filterClick.emit(this.currentFilter);
                }
            });
    }

    /**
     * Select as default task filter the first in the list
     * @param filteredFilterList
     */
    public selectDefaultTaskFilter() {
        if (!this.isFilterListEmpty()) {
            this.currentFilter = this.filters[0];
        }
    }

    /**
     * Return the current task
     */
    getCurrentFilter(): FilterRepresentationModel {
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

    /**
     * Return current filter icon
     */
    getFilterIcon(icon): string {
        return this.iconsMDL.mapGlyphiconToMaterialDesignIcons(icon);
    }
}
