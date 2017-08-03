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

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { Observable, Observer } from 'rxjs/Rx';
import { FilterParamsModel, FilterRepresentationModel } from '../models/filter.model';
import { TaskListService } from './../services/tasklist.service';

@Component({
    selector: 'adf-filters, activiti-filters',
    templateUrl: './task-filters.component.html',
    styleUrls: ['task-filters.component.css'],
    providers: [TaskListService]
})
export class TaskFiltersComponent implements OnInit, OnChanges {

    @Input()
    filterParam: FilterParamsModel;

    @Output()
    filterClick: EventEmitter<FilterRepresentationModel> = new EventEmitter<FilterRepresentationModel>();

    @Output()
    onSuccess: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onError: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    appId: string;

    @Input()
    appName: string;

    @Input()
    hasIcon: boolean = true;

    private filterObserver: Observer<FilterRepresentationModel>;
    filter$: Observable<FilterRepresentationModel>;

    currentFilter: FilterRepresentationModel;

    filters: FilterRepresentationModel [] = [];

    constructor(translateService: AlfrescoTranslationService,
                private activiti: TaskListService) {
        this.filter$ = new Observable<FilterRepresentationModel>(observer => this.filterObserver = observer).share();

        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'assets/ng2-activiti-tasklist');
        }
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
    getFilters(appId?: string, appName?: string) {
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
    getFiltersByAppId(appId?: string) {
        this.activiti.getTaskListFilters(appId).subscribe(
            (res: FilterRepresentationModel[]) => {
                if (res.length === 0 && this.isFilterListEmpty()) {
                    this.activiti.createDefaultFilters(appId).subscribe(
                        (resDefault: FilterRepresentationModel[]) => {
                            this.resetFilter();
                            resDefault.forEach((filter) => {
                                this.filterObserver.next(filter);
                            });

                            this.selectTaskFilter(this.filterParam, this.filters);
                            this.onSuccess.emit(resDefault);
                        },
                        (errDefault: any) => {
                            this.onError.emit(errDefault);
                        }
                    );
                } else {
                    this.resetFilter();
                    res.forEach((filter) => {
                        this.filterObserver.next(filter);
                    });

                    this.selectTaskFilter(this.filterParam, this.filters);
                    this.onSuccess.emit(res);
                }
            },
            (err: any) => {
                this.onError.emit(err);
            }
        );
    }

    /**
     * Return the filter list filtered by appName
     * @param appName
     */
    getFiltersByAppName(appName: string) {
        this.activiti.getDeployedApplications(appName).subscribe(
            application => {
                this.getFiltersByAppId(application.id);
                this.selectTaskFilter(this.filterParam, this.filters);
            },
            (err) => {
                this.onError.emit(err);
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
        this.activiti.getFilterForTaskById(taskId, this.filters).subscribe(
            (filter: FilterRepresentationModel) => {
                filteredFilterList.push(filter);
            },
            (err) => {
                this.onError.emit(err);
            },
            () => {
                if (filteredFilterList.length > 0) {
                    this.selectTaskFilter(new FilterParamsModel({name: 'My Tasks'}), filteredFilterList);
                    this.currentFilter.landingTaskId = taskId;
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
                    filterParam.id === taskFilter.id || filterParam.index === index) {
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
