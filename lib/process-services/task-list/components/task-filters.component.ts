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
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { FilterParamsModel, FilterRepresentationModel } from '../models/filter.model';
import { TaskFilterService } from './../services/task-filter.service';
import { TaskListService } from './../services/tasklist.service';

@Component({
    selector: 'adf-filters, taskListService-filters',
    templateUrl: './task-filters.component.html',
    styleUrls: ['task-filters.component.scss']
})
export class TaskFiltersComponent implements OnInit, OnChanges {

    @Input()
    filterParam: FilterParamsModel;

    @Output()
    filterClick: EventEmitter<FilterRepresentationModel> = new EventEmitter<FilterRepresentationModel>();

    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    appId: number;

    @Input()
    appName: string;

    @Input()
    hasIcon: boolean = true;

    private filterObserver: Observer<FilterRepresentationModel>;
    filter$: Observable<FilterRepresentationModel>;

    currentFilter: FilterRepresentationModel;

    filters: FilterRepresentationModel [] = [];

    constructor(private taskFilterService: TaskFilterService, private taskListService: TaskListService, private appsProcessService: AppsProcessService) {
        this.filter$ = new Observable<FilterRepresentationModel>(observer => this.filterObserver = observer).share();
    }

    ngOnInit() {
        this.filter$.subscribe((filter: FilterRepresentationModel) => {
            this.filters.push(filter);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        let appId = changes['appId'];
        if (appId && (appId.currentValue || appId.currentValue === null)) {
            this.getFiltersByAppId(appId.currentValue);
            return;
        }
        let appName = changes['appName'];
        if (appName && appName !== null && appName.currentValue) {
            this.getFiltersByAppName(appName.currentValue);
            return;
        }

        this.getFiltersByAppId();
    }

    /**
     * Return the task list filtered by appId or by appName
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
     * @param appId - optional
     */
    getFiltersByAppId(appId?: number) {
        this.taskFilterService.getTaskListFilters(appId).subscribe(
            (res: FilterRepresentationModel[]) => {
                if (res.length === 0 && this.isFilterListEmpty()) {
                    this.taskFilterService.createDefaultFilters(appId).subscribe(
                        (resDefault: FilterRepresentationModel[]) => {
                            this.resetFilter();
                            resDefault.forEach((filter) => {
                                this.filterObserver.next(filter);
                            });

                            this.selectTaskFilter(this.filterParam, this.filters);
                            this.success.emit(resDefault);
                        },
                        (errDefault: any) => {
                            this.error.emit(errDefault);
                        }
                    );
                } else {
                    this.resetFilter();
                    res.forEach((filter) => {
                        this.filterObserver.next(filter);
                    });

                    this.selectTaskFilter(this.filterParam, this.filters);
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
                this.selectTaskFilter(this.filterParam, this.filters);
            },
            (err) => {
                this.error.emit(err);
            });
    }

    /**
     * Pass the selected filter as next
     * @param filter
     */
    public selectFilter(filter: FilterRepresentationModel) {
        this.currentFilter = filter;
        this.filterClick.emit(filter);
    }

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
                    this.selectTaskFilter(new FilterParamsModel({name: 'My Tasks'}), filteredFilterList);
                    this.filterClick.emit(this.currentFilter);
                }
            });
    }

    /**
     * Select the first filter of a list if present
     */
    public selectTaskFilter(filterParam: FilterParamsModel, filteredFilterList: FilterRepresentationModel[]) {
        let findTaskFilter;
        if (filterParam) {
            filteredFilterList.filter((taskFilter: FilterRepresentationModel, index) => {
                if (filterParam.name && filterParam.name.toLowerCase() === taskFilter.name.toLowerCase() ||
                    filterParam.id === taskFilter.id.toString()
                    || filterParam.index === index) {
                    findTaskFilter = taskFilter;
                }
            });
        }
        if (findTaskFilter) {
            this.currentFilter = findTaskFilter;
        } else {
             this.selectDefaultTaskFilter(filteredFilterList);
        }
    }

    /**
     * Select as default task filter the first in the list
     */
    public selectDefaultTaskFilter(filteredFilterList: FilterRepresentationModel[]) {
        if (!this.isFilterListEmpty()) {
            this.currentFilter = this.filters[0];
        }
    }

    /**
     * Return the current task
     * @returns {FilterRepresentationModel}
     */
    getCurrentFilter(): FilterRepresentationModel {
        return this.currentFilter;
    }

    /**
     * Check if the filter list is empty
     * @returns {boolean}
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
