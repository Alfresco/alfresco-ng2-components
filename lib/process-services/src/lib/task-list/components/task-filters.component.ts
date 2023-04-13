/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { AppsProcessService } from '../../app-list/services/apps-process.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterParamsModel, FilterRepresentationModel } from '../models/filter.model';
import { TaskFilterService } from './../services/task-filter.service';
import { TaskListService } from './../services/tasklist.service';
import { IconModel } from '../../app-list/icon.model';

@Component({
    selector: 'adf-task-filters',
    templateUrl: './task-filters.component.html',
    styleUrls: ['./task-filters.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskFiltersComponent implements OnInit, OnChanges {

    /** Parameters to use for the task filter. If there is no match then
     * the default filter (the first one the list) is selected.
     */
    @Input()
    filterParam: FilterParamsModel;

    /** Emitted when a filter is being clicked from the UI. */
    @Output()
    filterClicked = new EventEmitter<FilterRepresentationModel>();

    /** Emitted when a filter is being selected based on the filterParam input. */
    @Output()
    filterSelected = new EventEmitter<FilterRepresentationModel>();

    /** Emitted when the list is loaded. */
    @Output()
    success = new EventEmitter<any>();

    /** Emitted when an error occurs during loading. */
    @Output()
    error = new EventEmitter<any>();

    /** Display filters available to the current user for the application with the specified ID. */
    @Input()
    appId: number;

    /** Display filters available to the current user for the application with the specified name. */
    @Input()
    appName: string;

    /** Toggles display of the filter's icon. */
    @Input()
    showIcon: boolean;

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
            this.selectFilterAndEmit(filter.currentValue);
        }
    }

    /**
     * Return the task list filtered by appId or by appName
     *
     * @param appId
     * @param appName
     */
    getFilters(appId?: number, appName?: string) {
        if (appName) {
            this.getFiltersByAppName(appName);
        } else {
            this.getFiltersByAppId(appId);
        }
    }

    /**
     * Return the filter list filtered by appId
     *
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
     *
     * @param appName
     */
    getFiltersByAppName(appName: string) {
        this.appsProcessService.getDeployedApplicationsByName(appName).subscribe(
            (application) => {
                this.getFiltersByAppId(application.id);
            },
            (err) => {
                this.error.emit(err);
            });
    }

    /**
     * Create default filters by appId
     *
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
     *
     * @param newFilter
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
    }

    public selectFilterAndEmit(newFilter: FilterParamsModel) {
        this.selectFilter(newFilter);
        this.filterSelected.emit(this.currentFilter);
    }

    /**
     * Selects and emits the clicked filter.
     */
    onFilterClick(filter: FilterParamsModel) {
        this.selectFilter(filter);
        this.filterClicked.emit(this.currentFilter);
    }

    /**
     * Select filter with task
     *
     * @param taskId
     */
    public selectFilterWithTask(taskId: string) {
        const filteredFilterList: FilterRepresentationModel[] = [];
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
                    this.filterSelected.emit(this.currentFilter);
                }
            });
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
     * Return current filter icon
     */
    getFilterIcon(icon): string {
        return this.iconsMDL.mapGlyphiconToMaterialDesignIcons(icon);
    }

    /**
     * Reset the filters properties
     */
    private resetFilter() {
        this.filters = [];
        this.currentFilter = undefined;
    }
}
