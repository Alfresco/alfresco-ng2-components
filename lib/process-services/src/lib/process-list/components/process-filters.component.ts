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

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ProcessInstanceFilterRepresentation, UserProcessInstanceFilterRepresentation } from '@alfresco/js-api';
import { Observable, Subject } from 'rxjs';
import { FilterProcessRepresentationModel } from '../models/filter-process.model';
import { ProcessFilterService } from './../services/process-filter.service';
import { AppsProcessService } from '../../app-list/services/apps-process.service';
import { IconModel } from '../../app-list/icon.model';
import { NavigationStart, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
    selector: 'adf-process-instance-filters',
    templateUrl: './process-filters.component.html',
    styleUrls: ['./process-filters.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProcessFiltersComponent implements OnInit, OnChanges, OnDestroy {

    /** The parameters to filter the task filter. If there is no match then the default one
     * (ie, the first filter in the list) is selected.
     */
    @Input()
    filterParam: FilterProcessRepresentationModel;

    /** Emitted when a filter is being clicked from the UI. */
    @Output()
    filterClicked = new EventEmitter<UserProcessInstanceFilterRepresentation>();

    /** Emitted when the list of filters has been successfully loaded from the server. */
    @Output()
    success = new EventEmitter<ProcessInstanceFilterRepresentation[]>();

    /** Emitted when an error occurs. */
    @Output()
    error = new EventEmitter<any>();

    /** Display filters available to the current user for the application with the specified ID. */
    @Input()
    appId: number;

    /** Display filters available to the current user for the application with the specified name. */
    @Input()
    appName: string;

    /** Toggle to show or hide the filter's icon. */
    @Input()
    showIcon: boolean = true;

    /** Emitted when a filter is being selected based on the filterParam input. */
    @Output()
    filterSelected = new EventEmitter<UserProcessInstanceFilterRepresentation>();

    filter$: Observable<ProcessInstanceFilterRepresentation>;

    currentFilter: ProcessInstanceFilterRepresentation;

    filters: UserProcessInstanceFilterRepresentation [] = [];
    active = false;
    isProcessRoute: boolean;
    isProcessActive: boolean;
    private onDestroy$ = new Subject<boolean>();

    private iconsMDL: IconModel;

    constructor(private processFilterService: ProcessFilterService,
                private appsProcessService: AppsProcessService,
                private router: Router,
                private location: Location) {
    }

    ngOnInit() {
        this.iconsMDL = new IconModel();
        this.router.events
        .pipe(
            filter((event) => event instanceof NavigationStart),
            takeUntil(this.onDestroy$)
        )
        .subscribe((navigationStart: NavigationStart) => {
            const activeRoute = navigationStart.url;
            this.isProcessActive = activeRoute.includes('processes');
        });
        const currentRoute = this.location.path();
        this.isProcessRoute = currentRoute.includes('processes');
    }

    ngOnChanges(changes: SimpleChanges) {
        const appId = changes['appId'];
        const appName = changes['appName'];
        const filterParam = changes['filterParam'];

        if (appId && (appId.currentValue || appId.currentValue === null)) {
            this.getFiltersByAppId(appId.currentValue);
        } else if (appName && appName.currentValue) {
            this.getFiltersByAppName(appName.currentValue);
        } else if (filterParam && filterParam.currentValue !== filterParam.previousValue) {
            this.selectProcessFilter(filterParam.currentValue);
        }
    }

    isActiveRoute(filterActive: ProcessInstanceFilterRepresentation): boolean {
        return (this.isProcessActive || this.isProcessRoute) && this.currentFilter === filterActive;
    }

    /**
     * Return the filter list filtered by appId
     *
     * @param appId - optional
     */
    getFiltersByAppId(appId?: number) {
        this.processFilterService.getProcessFilters(appId).subscribe(
            (res: ProcessInstanceFilterRepresentation[]) => {
                if (res.length === 0 && this.isFilterListEmpty()) {
                    this.processFilterService.createDefaultFilters(appId).subscribe(
                        (resDefault: ProcessInstanceFilterRepresentation[]) => {
                            this.resetFilter();
                            this.filters = resDefault;
                            this.selectProcessFilter(this.filterParam);
                            this.success.emit(resDefault);
                        },
                        (errDefault: any) => {
                            this.error.emit(errDefault);
                        }
                    );
                } else {
                    this.resetFilter();
                    this.filters = res;
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
     *
     * @param appName
     */
    getFiltersByAppName(appName: string) {
        this.appsProcessService.getDeployedApplicationsByName(appName).subscribe(
            (application) => {
                this.getFiltersByAppId(application.id);
                this.selectProcessFilter(this.filterParam);
            },
            (err) => {
                this.error.emit(err);
            });
    }

    /**
     * Pass the selected filter as next
     *
     * @param filterModel
     */
    selectFilter(filterModel: ProcessInstanceFilterRepresentation) {
        this.currentFilter = filterModel;
        this.active = true;
        this.filterClicked.emit(filterModel);
    }

    /**
     * Select the first filter of a list if present
     */
    selectProcessFilter(filterParam: FilterProcessRepresentationModel) {
        if (filterParam) {
            const newFilter = this.filters.find((processFilter, index) =>
                filterParam.index === index ||
                filterParam.id === processFilter.id ||
                (filterParam.name &&
                    (filterParam.name.toLocaleLowerCase() === processFilter.name.toLocaleLowerCase())
                ));
            this.currentFilter = newFilter;

            if (newFilter) {
                this.filterSelected.emit(newFilter);
            }
        }
    }

    /**
     * Select the Running filter
     *
     * @deprecated in 3.9.0, Use the filterParam Input() with a running filter instance instead
     */
    selectRunningFilter() {
        this.selectProcessFilter(this.processFilterService.getRunningFilterInstance(null));
    }

    /**
     * Select as default task filter the first in the list
     */
    selectDefaultTaskFilter() {
        if (!this.isFilterListEmpty()) {
            this.currentFilter = this.filters[0];
            this.filterSelected.emit(this.filters[0]);
        }
    }

    /**
     * Return the current task
     */
    getCurrentFilter(): ProcessInstanceFilterRepresentation {
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
    getFilterIcon(icon: string): string {
        return this.iconsMDL.mapGlyphiconToMaterialDesignIcons(icon);
    }

    /**
     * Reset the filters properties
     */
    private resetFilter() {
        this.filters = [];
        this.currentFilter = undefined;
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
