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
import { ProcessFilterCloudService } from '../services/process-filter-cloud.service';
import { ProcessFilterRepresentationModel, ProcessFilterParamModel } from '../models/process-filter-cloud.model';
@Component({
    selector: 'adf-cloud-process-filters',
    templateUrl: './process-filters-cloud.component.html',
    styleUrls: ['process-filters-cloud.component.scss']
})
export class ProcessFiltersCloudComponent implements OnChanges {

    /** (required) The application name */
    @Input()
    appName: string;

    /** (optional) The filter to be selected by default */
    @Input()
    filterParam: ProcessFilterParamModel;

    /** (optional) The flag hides/shows icon against each filter */
    @Input()
    showIcons: boolean = false;

    /** Emitted when a filter is selected/clicked */
    @Output()
    filterClick: EventEmitter<ProcessFilterRepresentationModel> = new EventEmitter<ProcessFilterRepresentationModel>();

    /** Emitted when filters are loaded successfully */
    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when any error occurs while loading the filters */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    filters$: Observable<ProcessFilterRepresentationModel[]>;

    currentFilter: ProcessFilterRepresentationModel;

    filters: ProcessFilterRepresentationModel [] = [];

    constructor(private processFilterCloudService: ProcessFilterCloudService) {
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
        this.filters$ = this.processFilterCloudService.getProcessFilters(appName);

        this.filters$.subscribe(
            (res: ProcessFilterRepresentationModel[]) => {
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
     * Create default filters by appName
     */
    createFilters(appName?: string) {
        this.filters$ = this.processFilterCloudService.createDefaultFilters(appName);

        this.filters$.subscribe(
            (resDefault: ProcessFilterRepresentationModel[]) => {
                this.resetFilter();
                this.filters = resDefault;
            },
            (errDefault: any) => {
                this.error.emit(errDefault);
            }
        );
    }

    /**
     * Pass the selected filter as next
     */
    public selectFilter(newFilter: ProcessFilterParamModel) {
        if (newFilter) {
            this.currentFilter = this.filters.find((filter, index) =>
                newFilter.id === filter.id ||
                (newFilter.name &&
                    (newFilter.name.toLocaleLowerCase() === filter.name.toLocaleLowerCase())
                ) ||
                newFilter.index === index
            );
        }
        if (!this.currentFilter) {
            this.selectDefaultProcessFilter();
        }
    }

    public selectFilterAndEmit(newFilter: ProcessFilterParamModel) {
        this.selectFilter(newFilter);
        this.filterClick.emit(this.currentFilter);
    }

    /**
     * Select as default process filter the first in the list
     */
    public selectDefaultProcessFilter() {
        if (!this.isFilterListEmpty()) {
            this.currentFilter = this.filters[0];
        }
    }

    /**
     * Return the current process
     */
    getCurrentFilter(): ProcessFilterRepresentationModel {
        return this.currentFilter;
    }

    /**
     * Check if the filter list is empty
     */
    isFilterListEmpty(): boolean {
        return this.filters === undefined || (this.filters && this.filters.length === 0);
    }

    /**
     * Reset the filters
     */
    private resetFilter() {
        this.filters = [];
        this.currentFilter = undefined;
    }
}
