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
import { ProcessInstanceFilterRepresentation } from 'alfresco-js-api';
import { AppsProcessService } from 'ng2-alfresco-core';
import { Observable, Observer } from 'rxjs/Rx';
import { FilterProcessRepresentationModel } from '../models/filter-process.model';
import { ProcessService } from './../services/process.service';

@Component({
    selector: 'adf-process-instance-filters',
    templateUrl: './process-filters.component.html',
    styleUrls: ['process-filters.component.scss']
})
export class ProcessFiltersComponent implements OnInit, OnChanges {

    @Input()
    filterParam: FilterProcessRepresentationModel;

    @Output()
    filterClick: EventEmitter<ProcessInstanceFilterRepresentation> = new EventEmitter<ProcessInstanceFilterRepresentation>();

    @Output()
    success: EventEmitter<ProcessInstanceFilterRepresentation[]> = new EventEmitter<ProcessInstanceFilterRepresentation[]>();

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    appId: number;

    @Input()
    appName: string;

    @Input()
    showIcon: boolean = true;

    private filterObserver: Observer<ProcessInstanceFilterRepresentation>;
    filter$: Observable<ProcessInstanceFilterRepresentation>;

    currentFilter: ProcessInstanceFilterRepresentation;

    filters: ProcessInstanceFilterRepresentation [] = [];

    constructor(private processService: ProcessService, private appsProcessService: AppsProcessService) {
        this.filter$ = new Observable<ProcessInstanceFilterRepresentation>(observer => this.filterObserver = observer).share();
    }

    ngOnInit() {
        this.filter$.subscribe((filter: ProcessInstanceFilterRepresentation) => {
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
    getFiltersByAppId(appId?: number) {
        this.processService.getProcessFilters(appId).subscribe(
            (res: ProcessInstanceFilterRepresentation[]) => {
                if (res.length === 0 && this.isFilterListEmpty()) {
                    this.processService.createDefaultFilters(appId).subscribe(
                        (resDefault: ProcessInstanceFilterRepresentation[]) => {
                            this.resetFilter();
                            resDefault.forEach((filter) => {
                                this.filterObserver.next(filter);
                            });

                            this.selectProcessFilter(this.filterParam);
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

                    this.selectProcessFilter(this.filterParam);
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
                this.selectProcessFilter(this.filterParam);
            },
            (err) => {
                this.error.emit(err);
            });
    }

    /**
     * Pass the selected filter as next
     * @param filter
     */
    public selectFilter(filter: ProcessInstanceFilterRepresentation) {
        this.currentFilter = filter;
        this.filterClick.emit(filter);
    }

    /**
     * Select the first filter of a list if present
     */
    public selectProcessFilter(filterParam: FilterProcessRepresentationModel) {
        if (filterParam) {
            this.filters.filter((processFilter: ProcessInstanceFilterRepresentation, index) => {
                if (filterParam.name && filterParam.name.toLowerCase() === processFilter.name.toLowerCase() || filterParam.index === index) {
                    this.currentFilter = processFilter;
                }
            });
        }
        if (this.isCurrentFilterEmpty()) {
            this.selectDefaultTaskFilter();
        }
    }

    /**
     * Select the Running filter
     */
    public selectRunningFilter() {
        this.selectProcessFilter(this.processService.getRunningFilterInstance(null));
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
     * @returns {ProcessInstanceFilterRepresentation}
     */
    getCurrentFilter(): ProcessInstanceFilterRepresentation {
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
