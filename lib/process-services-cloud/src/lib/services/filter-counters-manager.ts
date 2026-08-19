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

import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FilterCountersCloudService } from './filter-counters-cloud.service';
import { FilterCounterCandidate, FilterCounterEntityType, FilterCounters } from '../models/filter-counters-cloud.model';

export interface FilterCounterAdapter<TFilter> {
    getFilterCounter(filter: TFilter): Observable<number>;
}

export interface FilterCountersManagerCallbacks {
    onCountersUpdated?: () => void;
    onFilterUpdated?: (filterKey: string) => void;
}

/**
 * Manages filter counters for a specific entity type using composition.
 * Handles loading, updating, and notification subscriptions for filter counters.
 */
export class FilterCountersManager<TFilter extends FilterCounterCandidate> {
    counters: { [key: string]: number } = {};
    currentFiltersValues: { [key: string]: number } = {};
    updatedFiltersSet = new Set<string>();

    private filters: TFilter[] = [];

    constructor(
        private readonly entityType: FilterCounterEntityType,
        private readonly filterCountersService: FilterCountersCloudService,
        private readonly counterAdapter: FilterCounterAdapter<TFilter>,
        private readonly destroyRef: DestroyRef,
        private readonly callbacks: FilterCountersManagerCallbacks = {}
    ) {}

    /**
     * Initialize counters for all filters to 0
     *
     * @param filters List of filters to initialize counters for
     */
    initCounters(filters: TFilter[]): void {
        this.filters = filters;
        filters.forEach((filter) => (this.counters[filter.key] = 0));
    }

    /**
     * Load filter counters on initial page load using the batched endpoint
     *
     * @param appName Name of the target app
     */
    loadCounters(appName: string): void {
        this.filterCountersService
            .loadFilterCounters(appName)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((counters) => this.applyBatchedCounters(counters));
    }

    /**
     * Subscribe to real-time counter updates via notifications
     *
     * @param appName Name of the target app
     */
    subscribeToNotifications(appName: string): void {
        if (!appName) {
            return;
        }

        this.filterCountersService
            .getFilterCountersNotifications(appName)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ counters }) => {
                this.applyBatchedCounters(counters);
            });
    }

    /**
     * Apply counters from the batched response, falling back to individual requests
     * for filters not resolved by the batch.
     *
     * @param counters Batched filter counters
     */
    private applyBatchedCounters(counters: FilterCounters): void {
        this.filters.forEach((filter) => {
            if (!filter?.showCounter) {
                return;
            }

            const filterCounter = this.filterCountersService.resolveFilterCounter(counters, this.entityType, filter);
            if (filterCounter === undefined) {
                this.updateSingleCounter(filter);
                return;
            }

            this.setCounter(filter.key, filterCounter);
        });

        this.callbacks.onCountersUpdated?.();
    }

    /**
     * Update counter for a single filter using individual request
     *
     * @param filter Filter to update the counter for
     */
    updateSingleCounter(filter: TFilter): void {
        if (!filter?.showCounter) {
            return;
        }

        this.counterAdapter
            .getFilterCounter(filter)
            .pipe(
                tap((filterCounter) => {
                    this.setCounter(filter.key, filterCounter);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    /**
     * Update counters for all filters
     */
    updateAllCounters(): void {
        this.filters.forEach((filter) => this.updateSingleCounter(filter));
    }

    /**
     * Set counter value and track if it changed
     *
     * @param filterKey Key of the filter to update
     * @param filterValue New counter value for the filter
     */
    private setCounter(filterKey: string, filterValue: number): void {
        if (this.currentFiltersValues[filterKey] === undefined || this.currentFiltersValues[filterKey] !== filterValue) {
            this.currentFiltersValues[filterKey] = filterValue;
            this.updatedFiltersSet.add(filterKey);
            this.callbacks.onFilterUpdated?.(filterKey);
        }

        this.counters = {
            ...this.counters,
            [filterKey]: filterValue
        };
    }

    /**
     * Check if a filter has been updated
     *
     * @param filterKey Key of the filter to check
     * @returns True if the filter has been updated, false otherwise
     */
    isFilterUpdated(filterKey: string): boolean {
        return this.updatedFiltersSet.has(filterKey);
    }

    /**
     * Mark a filter as viewed/not updated
     *
     * @param filterKey Key of the filter to reset
     */
    resetFilterUpdate(filterKey: string): void {
        this.updatedFiltersSet.delete(filterKey);
    }

    /**
     * Subscribe to external refresh events from the filter service
     *
     * @param refreshSignal$ Observable emitting filter keys to refresh
     */
    subscribeToExternalRefresh(refreshSignal$: Observable<string>): void {
        refreshSignal$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((filterKey: string) => {
            this.updatedFiltersSet.delete(filterKey);
        });
    }
}
