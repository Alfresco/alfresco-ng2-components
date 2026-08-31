/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { combineLatest, defer, EMPTY, Observable, of, Subscription } from 'rxjs';
import { ProcessFilterCloudService } from '../../services/process-filter-cloud.service';
import { ProcessFilterCloudModel } from '../../models/process-filter-cloud.model';
import { AppConfigService, IconModule, TranslationService } from '@alfresco/adf-core';
import { FilterParamsModel } from '../../../../task/task-filters/models/filter-cloud.model';
import { catchError, map } from 'rxjs/operators';
import { ProcessListCloudService } from '../../../process-list/services/process-list-cloud.service';
import { ProcessFilterCloudAdapter } from '../../../process-list/models/process-cloud-query-request.model';
import { FilterCountersCloudService } from '../../../../services/filter-counters-cloud.service';
import { FilterCounterEntityType } from '../../../../models/filter-counters-cloud.model';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
    selector: 'adf-cloud-process-filters',
    imports: [TranslatePipe, IconModule, MatProgressSpinnerModule, MatListModule, AsyncPipe, RouterLink],
    templateUrl: './process-filters-cloud.component.html',
    styleUrls: ['./process-filters-cloud.component.scss']
})
export class ProcessFiltersCloudComponent implements OnInit, OnChanges {
    protected readonly PROCESSES_ROUTE = '/process-list-cloud';
    /** (required) The application name */
    @Input()
    appName: string = '';

    /**
     * (optional) From Activiti 8.7.0 forward, use the 'POST' method to get the process count.
     *
     */
    @Input()
    searchApiMethod: 'GET' | 'POST' = 'GET';

    /**
     * (optional) Resolves the counters of the task and the process filters with a single call to
     * `POST /query/v1/count`. Both filter components have to
     * ask for it, otherwise the counters are resolved one filter at a time.
     */
    @Input()
    useBatchedCounters = false;

    /** (optional) The filter to be selected by default */
    @Input()
    filterParam: FilterParamsModel;

    /** (optional) Toggles showing an icon by the side of each filter */
    @Input()
    showIcons: boolean = false;

    /** Emitted when a filter is being selected based on the filterParam input. */
    @Output()
    filterSelected = new EventEmitter<ProcessFilterCloudModel>();

    /** Emitted when a filter is being clicked from the UI. */
    @Output()
    filterClicked = new EventEmitter<ProcessFilterCloudModel>();

    /** Emitted when filters are loaded successfully */
    @Output()
    success = new EventEmitter<any>();

    /** Emitted when any error occurs while loading the filters */
    @Output()
    error = new EventEmitter<any>();

    /** Emitted when filter is updated. */
    @Output()
    updatedFilter: EventEmitter<string> = new EventEmitter<string>();

    filters$: Observable<ProcessFilterCloudModel[]>;
    currentFilter?: ProcessFilterCloudModel;
    filters: ProcessFilterCloudModel[] = [];
    counters: { [key: string]: number } = {};
    currentFiltersValues: { [key: string]: number } = {};
    updatedFiltersSet = new Set<string>();
    enableNotifications = true;
    notificationDebounceTime = 3000;
    private filtersLoadedFor?: string;
    private countersSubscription?: Subscription;
    private countersFilters$?: Observable<ProcessFilterCloudModel[]>;
    private batchedCounters = true;

    private readonly destroyRef = inject(DestroyRef);
    private readonly processFilterCloudService = inject(ProcessFilterCloudService);
    private readonly translationService = inject(TranslationService);
    private readonly appConfigService = inject(AppConfigService);
    private readonly processListCloudService = inject(ProcessListCloudService);
    private readonly filterCountersCloudService = inject(FilterCountersCloudService);
    private readonly activatedRoute = inject(ActivatedRoute);
    protected readonly currentRouteFilterId = toSignal(this.activatedRoute.queryParamMap.pipe(map((params) => params.get('filterId'))));

    ngOnInit() {
        this.enableNotifications = this.appConfigService.get('notifications', true);
        this.notificationDebounceTime = this.appConfigService.get('notificationDebounceTime', 3000);

        if (!this.filtersLoadedFor) {
            this.getFilters(this.appName);
        }
        this.getFilterKeysAfterExternalRefreshing();
    }

    ngOnChanges(changes: SimpleChanges) {
        const appName = changes['appName'];
        const filter = changes['filterParam'];
        if (appName?.currentValue) {
            this.getFilters(appName.currentValue);
        } else if (filter && filter.currentValue !== filter.previousValue) {
            this.selectFilterAndEmit(filter.currentValue);
        } else if (changes['useBatchedCounters'] && !changes['useBatchedCounters'].firstChange && this.filtersLoadedFor) {
            this.loadFilterCounters(this.filtersLoadedFor);
        }
    }

    /**
     * Fetch the filter list based on appName
     *
     * @param appName application name
     */
    getFilters(appName: string): void {
        this.filtersLoadedFor = appName;
        const filters$ = this.filterCountersCloudService.getProcessFilters(appName);
        this.filters$ = filters$.pipe(catchError(() => of([])));

        filters$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (res) => {
                this.resetFilter();
                this.filters = res || [];
                this.initFilterCounters();
                this.selectFilterAndEmit(this.filterParam);
                this.success.emit(res);
            },
            error: (err: unknown) => {
                this.error.emit(err);
            }
        });

        this.countersFilters$ = filters$;
        this.loadFilterCounters(appName);
    }

    /**
     * Initialize counter collection for filters
     */
    initFilterCounters(): void {
        this.filters.forEach((filter) => {
            if (filter.key) {
                this.counters[filter.key] = 0;
            }
        });
    }

    /**
     * Pass the selected filter as next
     *
     * @param paramFilter filter model
     */
    selectFilter(paramFilter: FilterParamsModel) {
        if (!paramFilter) {
            return;
        }

        const preferredFilter = this.filters.find((filter) => paramFilter.id === filter.id);
        this.currentFilter =
            preferredFilter ??
            this.filters.find(
                (filter, index) =>
                    paramFilter.id === filter.id ||
                    (paramFilter.name && this.checkFilterNamesEquality(paramFilter.name, filter.name)) ||
                    (paramFilter.key && paramFilter.key === filter.key) ||
                    paramFilter.index === index
            ); // fallback to preserve the previous behavior
    }

    /**
     * Selects and emits the given filter
     *
     * @param newParamFilter new parameter filter
     */
    selectFilterAndEmit(newParamFilter: FilterParamsModel) {
        if (newParamFilter) {
            this.selectFilter(newParamFilter);
            this.filterSelected.emit(this.currentFilter);
        } else {
            this.currentFilter = undefined;
        }
    }

    /**
     * Select filter with the id
     *
     * @param id filter id
     */
    selectFilterById(id: string) {
        this.selectFilterAndEmit({ id });
    }

    /**
     * Selects and emits the clicked filter
     *
     * @param filter filter model
     */
    onFilterClick(filter: ProcessFilterCloudModel) {
        if (filter) {
            this.selectFilter(filter);
            this.filterClicked.emit(this.currentFilter);
            this.refreshFilterCounter(this.currentFilter);
            this.updatedFiltersSet.delete(filter.key);
        } else {
            this.currentFilter = undefined;
        }
    }

    /**
     * Select as default process filter the first in the list
     */
    selectDefaultProcessFilter() {
        if (!this.isFilterListEmpty()) {
            this.currentFilter = this.filters[0];
        }
    }

    /**
     * Get current filter
     *
     * @returns filter model
     */
    getCurrentFilter(): ProcessFilterCloudModel {
        return this.currentFilter;
    }

    /**
     * Check if the filter list is empty
     *
     * @returns `true` if filter list is empty, otherwise `false`
     */
    isFilterListEmpty(): boolean {
        return this.filters === undefined || (this.filters && this.filters.length === 0);
    }

    isActiveFilter(filter: ProcessFilterCloudModel): boolean {
        return this.currentFilter.name === filter.name;
    }

    /**
     * @deprecated does nothing: the counters keep themselves in sync. Removed in ADF 10.0.0.
     */
    initProcessNotification(): void {}

    /**
     * Iterate over filters and update counters
     *
     * @deprecated counts one filter at a time. Removed in ADF 10.0.0.
     */
    updateFilterCounters(): void {
        this.filters.forEach((filter) => this.updateFilterCounter(filter));
    }

    /**
     *  Get current value for filter and check if value has changed
     *
     * @param filter filter
     * @deprecated counts one filter at a time. Removed in ADF 10.0.0.
     */
    updateFilterCounter(filter: ProcessFilterCloudModel): void {
        const filterKey = filter?.showCounter ? filter.key : undefined;
        if (!filterKey) {
            return;
        }

        defer(() => this.fetchProcessFilterCounter(filter))
            .pipe(
                catchError(() => EMPTY),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((counter) => {
                this.checkIfFilterValuesHasBeenUpdated(filterKey, counter);
                this.counters = { ...this.counters, [filterKey]: counter };
            });
    }

    checkIfFilterValuesHasBeenUpdated(filterKey: string, filterValue: number): void {
        if (this.currentFiltersValues[filterKey] === undefined || this.currentFiltersValues[filterKey] !== filterValue) {
            this.currentFiltersValues = { ...this.currentFiltersValues, [filterKey]: filterValue };
            this.updatedFilter.emit(filterKey);
            this.updatedFiltersSet.add(filterKey);
        }
    }

    /**
     * Get filer key when filter was refreshed by external action
     *
     */
    getFilterKeysAfterExternalRefreshing(): void {
        this.processFilterCloudService.filterKeyToBeRefreshed$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((filterKey: string) => this.updatedFiltersSet.delete(filterKey));
    }

    isFilterUpdated(filterName: string): boolean {
        return this.updatedFiltersSet.has(filterName);
    }

    /**
     * Check equality of the filter names by translating the given name strings
     *
     * @param name1 source name
     * @param name2 target name
     * @returns `true` if filter names are equal, otherwise `false`
     */
    private checkFilterNamesEquality(name1: string, name2: string): boolean {
        const translatedName1 = this.translationService.instant(name1);
        const translatedName2 = this.translationService.instant(name2);

        return translatedName1.toLocaleLowerCase() === translatedName2.toLocaleLowerCase();
    }

    /**
     * Reset the filters
     */
    private resetFilter() {
        this.filters = [];
        this.currentFilter = undefined;
    }

    private loadFilterCounters(appName: string): void {
        if (!this.countersFilters$) {
            return;
        }

        this.countersSubscription?.unsubscribe();
        this.countersSubscription = combineLatest([
            this.countersFilters$.pipe(catchError(() => of([]))),
            this.filterCountersCloudService.getFilterCounters(appName, FilterCounterEntityType.PROCESS_INSTANCE, this.useBatchedCounters)
        ])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(([, { counters, batched }]) => {
                this.batchedCounters = batched;
                if (batched) {
                    this.applyFilterCounters(counters);
                } else {
                    this.updateFilterCounters();
                }
            });
    }

    private applyFilterCounters(counters: { [filterKey: string]: number }): void {
        this.filters.forEach((filter) => {
            const filterKey = filter?.showCounter ? filter.key : undefined;
            if (!filterKey) {
                return;
            }

            const counter = counters[filterKey];
            if (counter === undefined) {
                this.updateFilterCounter(filter);
                return;
            }

            this.checkIfFilterValuesHasBeenUpdated(filterKey, counter);
            this.counters = { ...this.counters, [filterKey]: counter };
        });
    }

    private refreshFilterCounter(filter?: ProcessFilterCloudModel): void {
        if (this.batchedCounters) {
            this.filterCountersCloudService.refreshFilterCounters(this.appName);
        } else if (filter) {
            this.updateFilterCounter(filter);
        }
    }

    private fetchProcessFilterCounter(filter: ProcessFilterCloudModel): Observable<number> {
        return this.searchApiMethod === 'POST'
            ? this.processListCloudService.getProcessListCount(new ProcessFilterCloudAdapter(filter))
            : this.processListCloudService.getProcessCounter(filter.appName, filter.status);
    }
}
