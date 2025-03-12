/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskFilterCloudService } from '../../services/task-filter-cloud.service';
import { FilterParamsModel, TaskFilterCloudModel } from '../../models/filter-cloud.model';
import { AppConfigService, IconComponent, TranslationService } from '@alfresco/adf-core';
import { debounceTime, tap } from 'rxjs/operators';
import { BaseTaskFiltersCloudComponent } from '../base-task-filters-cloud.component';
import { TaskDetailsCloudModel } from '../../../models/task-details-cloud.model';
import { TaskCloudEngineEvent } from '../../../../models/engine-event-cloud.model';
import { TaskListCloudService } from '../../../task-list/services/task-list-cloud.service';
import { TaskFilterCloudAdapter } from '../../../../models/filter-cloud-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'adf-cloud-task-filters',
    standalone: true,
    imports: [CommonModule, MatProgressSpinnerModule, TranslateModule, IconComponent, MatListModule],
    templateUrl: './task-filters-cloud.component.html',
    styleUrls: ['./task-filters-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskFiltersCloudComponent extends BaseTaskFiltersCloudComponent implements OnInit, OnChanges {
    /** (optional) From Activiti 8.7.0 forward, use the 'POST' method to get the task count. */
    @Input()
    searchApiMethod: 'GET' | 'POST' = 'GET';

    /** Emitted when a filter is being selected based on the filterParam input. */
    @Output()
    filterSelected = new EventEmitter<TaskFilterCloudModel>();

    /** Emitted when a filter is being clicked from the UI. */
    @Output()
    filterClicked = new EventEmitter<TaskFilterCloudModel>();

    /** Emitted when filter counters are updated. */
    @Output()
    filterCounterUpdated: EventEmitter<TaskCloudEngineEvent[]> = new EventEmitter<TaskCloudEngineEvent[]>();

    /** Emitted when filter is updated. */
    @Output()
    updatedFilter: EventEmitter<string> = new EventEmitter<string>();

    filters$: Observable<TaskFilterCloudModel[]>;
    filters: TaskFilterCloudModel[] = [];
    currentFilter: TaskFilterCloudModel;
    enableNotifications: boolean;
    currentFiltersValues: { [key: string]: number } = {};

    private readonly taskFilterCloudService = inject(TaskFilterCloudService);
    private readonly taskListCloudService = inject(TaskListCloudService);
    private readonly translationService = inject(TranslationService);
    private readonly appConfigService = inject(AppConfigService);

    ngOnInit() {
        this.enableNotifications = this.appConfigService.get('notifications', true);
        this.getFilters(this.appName);
        this.initFilterCounterNotifications();
        this.getFilterKeysAfterExternalRefreshing();
    }

    ngOnChanges(changes: SimpleChanges) {
        const appName = changes['appName'];
        const filter = changes['filterParam'];
        if (appName && appName.currentValue !== appName.previousValue) {
            this.getFilters(appName.currentValue);
        } else if (filter && filter.currentValue !== filter.previousValue) {
            this.selectFilterAndEmit(filter.currentValue);
        }
    }

    /**
     * Loads the filter list filtered by appName
     *
     * @param appName application name
     */
    getFilters(appName: string): void {
        this.filters$ = this.taskFilterCloudService.getTaskListFilters(appName);

        this.filters$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (res) => {
                this.resetFilter();
                this.filters = res || [];
                this.initFilterCounters();
                this.selectFilterAndEmit(this.filterParam);
                this.updateFilterCounters();
                this.success.emit(res);
            },
            error: (err) => {
                this.error.emit(err);
            }
        });
    }

    /**
     * Initialize counter collection for filters
     */
    initFilterCounters(): void {
        this.filters.forEach((filter) => (this.counters[filter.key] = 0));
    }

    /**
     * Iterate over filters and update counters
     */
    updateFilterCounters(): void {
        this.filters.forEach((filter: TaskFilterCloudModel) => this.updateFilterCounter(filter));
    }

    /**
     *  Get current value for filter and check if value has changed
     *
     * @param filter filter
     */
    updateFilterCounter(filter: TaskFilterCloudModel): void {
        if (!filter?.showCounter) {
            return;
        }
        this.fetchTaskFilterCounter(filter)
            .pipe(
                tap((filterCounter) => {
                    this.checkIfFilterValuesHasBeenUpdated(filter.key, filterCounter);
                })
            )
            .subscribe((data) => {
                this.counters = {
                    ...this.counters,
                    [filter.key]: data
                };
            });
    }

    private fetchTaskFilterCounter(filter: TaskFilterCloudModel): Observable<number> {
        return this.searchApiMethod === 'POST'
            ? this.taskListCloudService.getTaskListCounter(new TaskFilterCloudAdapter(filter))
            : this.taskFilterCloudService.getTaskFilterCounter(filter);
    }

    initFilterCounterNotifications() {
        if (!this.appName) {
            return;
        }
        if (this.enableNotifications) {
            this.taskFilterCloudService
                .getTaskNotificationSubscription(this.appName)
                .pipe(debounceTime(1000))
                .subscribe((result) => {
                    result.forEach((taskEvent) => {
                        this.checkFilterCounter(taskEvent.entity);
                    });

                    this.updateFilterCounters();
                    this.filterCounterUpdated.emit(result);
                });
        } else {
            this.counters = {};
        }
    }

    checkFilterCounter(filterNotification: TaskDetailsCloudModel) {
        this.filters.forEach((filter) => {
            if (this.isFilterPresent(filter, filterNotification)) {
                this.addToUpdatedCounters(filter.key);
            }
        });
    }

    isFilterPresent(filter: TaskFilterCloudModel, filterNotification: TaskDetailsCloudModel): boolean {
        return (
            filter.status === filterNotification.status &&
            (filter.assignee === filterNotification.assignee || filterNotification.assignee === undefined)
        );
    }

    public selectFilter(paramFilter: FilterParamsModel) {
        if (!paramFilter) {
            return;
        }

        const preferredFilter = this.filters.find((filter) => filter.id === paramFilter.id);

        this.currentFilter =
            preferredFilter ??
            this.filters.find(
                (filter, index) =>
                    paramFilter.index === index ||
                    paramFilter.key === filter.key ||
                    paramFilter.id === filter.id ||
                    (paramFilter.name && paramFilter.name.toLocaleLowerCase() === this.translationService.instant(filter.name).toLocaleLowerCase())
            ); // fallback to preserve the previous behavior
    }

    public selectFilterAndEmit(newParamFilter: FilterParamsModel) {
        if (newParamFilter) {
            this.selectFilter(newParamFilter);

            if (this.currentFilter) {
                this.resetFilterCounter(this.currentFilter.key);
                this.filterSelected.emit(this.currentFilter);
            }
        } else {
            this.currentFilter = undefined;
        }
    }

    /**
     * Selects and emits the clicked filter.
     *
     * @param filter filter model
     */
    onFilterClick(filter: FilterParamsModel) {
        if (filter) {
            this.selectFilter(filter);
            this.updateFilterCounter(this.currentFilter);
            this.filterClicked.emit(this.currentFilter);
            this.updatedCountersSet.delete(filter.key);
        } else {
            this.currentFilter = undefined;
        }
    }

    /**
     * @deprecated unused method
     * Select as default task filter the first in the list
     */
    public selectDefaultTaskFilter() {
        if (!this.isFilterListEmpty()) {
            this.currentFilter = this.filters[0];
        }
    }

    /**
     * Check if the filter list is empty
     *
     * @returns `true` if filter list is empty, otherwise `false`
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

    checkIfFilterValuesHasBeenUpdated(filterKey: string, filterValue: number) {
        if (this.currentFiltersValues[filterKey] === undefined || this.currentFiltersValues[filterKey] !== filterValue) {
            this.currentFiltersValues[filterKey] = filterValue;
            this.updatedFilter.emit(filterKey);
            this.updatedCountersSet.add(filterKey);
        }
    }

    /**
     * Get filer key when filter was refreshed by external action
     *
     */
    getFilterKeysAfterExternalRefreshing(): void {
        this.taskFilterCloudService.filterKeyToBeRefreshed$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((filterKey: string) => {
            this.updatedCountersSet.delete(filterKey);
        });
    }
}
