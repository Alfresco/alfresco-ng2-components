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
import { FilterParamsModel, FilterProcessRepresentationModel } from './../models/filter-process.model';
import { ProcessService } from './../services/process.service';

@Component({
    selector: 'adf-process-instance-filters, activiti-process-instance-filters',
    templateUrl: './process-filters.component.html',
    styleUrls: ['process-filters.component.css']
})
export class ProcessFiltersComponent implements OnInit, OnChanges {

    @Input()
    filterParam: FilterParamsModel;

    @Output()
    filterClick: EventEmitter<FilterProcessRepresentationModel> = new EventEmitter<FilterProcessRepresentationModel>();

    @Output()
    onSuccess: EventEmitter<FilterProcessRepresentationModel[]> = new EventEmitter<FilterProcessRepresentationModel[]>();

    @Output()
    onError: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    appId: number;

    @Input()
    appName: string;

    @Input()
    showIcon: boolean = true;

    private filterObserver: Observer<FilterProcessRepresentationModel>;
    filter$: Observable<FilterProcessRepresentationModel>;

    currentFilter: FilterProcessRepresentationModel;

    filters: FilterProcessRepresentationModel [] = [];

    constructor(translate: AlfrescoTranslationService,
                private activiti: ProcessService) {
        this.filter$ = new Observable<FilterProcessRepresentationModel>(observer => this.filterObserver = observer).share();

        if (translate) {
            translate.addTranslationFolder('ng2-activiti-processlist', 'assets/ng2-activiti-processlist');
        }
    }

    ngOnInit() {
        this.filter$.subscribe((filter: FilterProcessRepresentationModel) => {
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
        if (appName && appName.currentValue) {
            this.getFiltersByAppName(appName.currentValue);
            return;
        }
    }

    /**
     * Return the filter list filtered by appId
     * @param appId - optional
     */
    getFiltersByAppId(appId?: string) {
        this.activiti.getProcessFilters(appId).subscribe(
            (res: FilterProcessRepresentationModel[]) => {
                if (res.length === 0 && this.isFilterListEmpty()) {
                    this.activiti.createDefaultFilters(appId).subscribe(
                        (resDefault: FilterProcessRepresentationModel[]) => {
                            this.resetFilter();
                            resDefault.forEach((filter) => {
                                this.filterObserver.next(filter);
                            });

                            this.selectTaskFilter(this.filterParam);
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

                    this.selectTaskFilter(this.filterParam);
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
                this.getFiltersByAppId(application.id.toString());
                this.selectTaskFilter(this.filterParam);
            },
            (err) => {
                this.onError.emit(err);
            });
    }

    /**
     * Pass the selected filter as next
     * @param filter
     */
    public selectFilter(filter: FilterProcessRepresentationModel) {
        this.currentFilter = filter;
        this.filterClick.emit(filter);
    }

    /**
     * Select the first filter of a list if present
     */
    public selectTaskFilter(filterParam: FilterParamsModel) {
        if (filterParam) {
            this.filters.filter((taskFilter: FilterProcessRepresentationModel, index) => {
                if (filterParam.name && filterParam.name.toLowerCase() === taskFilter.name.toLowerCase() ||
                    filterParam.id === taskFilter.id || filterParam.index === index) {
                    this.currentFilter = taskFilter;
                }
            });
        }
        if (this.isCurrentFilterEmpty()) {
            this.selectDefaultTaskFilter();
        }
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
     * @returns {FilterProcessRepresentationModel}
     */
    getCurrentFilter(): FilterProcessRepresentationModel {
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

    private isCurrentFilterEmpty(): boolean {
        return this.currentFilter === undefined || null ? true : false;
    }
}
