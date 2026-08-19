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

import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TaskFilterCloudService } from '../../services/task-filter-cloud.service';
import { FilterParamsModel, TaskFilterCloudModel } from '../../models/filter-cloud.model';
import { AppConfigService, IconModule, TranslationService } from '@alfresco/adf-core';
import { catchError, map } from 'rxjs/operators';
import { BaseTaskFiltersCloudComponent } from '../base-task-filters-cloud.component';
import { TaskDetailsCloudModel } from '../../../models/task-details-cloud.model';
import { TaskCloudEngineEvent } from '../../../../models/engine-event-cloud.model';
import { TaskListCloudService } from '../../../task-list/services/task-list-cloud.service';
import { TaskFilterCloudAdapter } from '../../../../models/filter-cloud-model';
import { FilterCountersCloudService } from '../../../../services/filter-counters-cloud.service';
import { FilterCounterEntityType } from '../../../../models/filter-counters-cloud.model';
import { FilterCountersManager, FilterCounterAdapter } from '../../../../services/filter-counters-manager';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'adf-cloud-task-filters',
    imports: [AsyncPipe, MatProgressSpinnerModule, TranslatePipe, MatListModule, RouterLink, IconModule],
    templateUrl: './task-filters-cloud.component.html',
    styleUrls: ['./task-filters-cloud.component.scss']
})
export class TaskFiltersCloudComponent extends BaseTaskFiltersCloudComponent implements OnInit, OnChanges {
    protected readonly TASKS_ROUTE = '/task-list-cloud';

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
    enableNotifications = true;
    notificationDebounceTime = 3000;
    private filtersLoadedFor?: string;
    private countersManager: FilterCountersManager<TaskFilterCloudModel>;

    private readonly taskFilterCloudService = inject(TaskFilterCloudService);
    private readonly taskListCloudService = inject(TaskListCloudService);
    private readonly filterCountersCloudService = inject(FilterCountersCloudService);
    private readonly translationService = inject(TranslationService);
    private readonly appConfigService = inject(AppConfigService);
    private readonly activatedRoute = inject(ActivatedRoute);
    readonly currentRouteFilterId = toSignal(this.activatedRoute.queryParamMap.pipe(map((params) => params.get('filterId'))));

    ngOnInit() {
        this.enableNotifications = this.appConfigService.get('notifications', true);
        this.notificationDebounceTime = this.appConfigService.get('notificationDebounceTime', 3000);

        if (!this.countersManager) {
            this.initCountersManager();
        }

        if (!this.filtersLoadedFor) {
            this.getFilters(this.appName);
        }
        this.initFilterCounterNotifications();
        this.countersManager.subscribeToExternalRefresh(this.taskFilterCloudService.filterKeyToBeRefreshed$);
    }

    private initCountersManager(): void {
        const counterAdapter: FilterCounterAdapter<TaskFilterCloudModel> = {
            getFilterCounter: (filter) =>
                this.searchApiMethod === 'POST'
                    ? this.taskListCloudService.getTaskListCount(new TaskFilterCloudAdapter(filter))
                    : this.taskFilterCloudService.getTaskFilterCounter(filter)
        };

        this.countersManager = new FilterCountersManager(
            FilterCounterEntityType.TASK,
            this.filterCountersCloudService,
            counterAdapter,
            this.destroyRef,
            {
                onFilterUpdated: (filterKey) => {
                    this.updatedFilter.emit(filterKey);
                    this.counters = this.countersManager.counters;
                },
                onCountersUpdated: () => {
                    this.counters = this.countersManager.counters;
                }
            }
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        const appName = changes['appName'];
        const filter = changes['filterParam'];
        if (appName && appName.currentValue !== appName.previousValue) {
            if (!this.countersManager) {
                this.initCountersManager();
            }
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
        this.filtersLoadedFor = appName;
        const filters$ = this.filterCountersCloudService
            .getFilters(appName)
            .pipe(map((filters) => filters[FilterCounterEntityType.TASK] as TaskFilterCloudModel[]));
        this.filters$ = filters$.pipe(catchError(() => of([])));

        filters$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (res) => {
                this.resetFilter();
                this.filters = res || [];
                this.countersManager.initCounters(this.filters);
                this.selectFilterAndEmit(this.filterParam);
                this.countersManager.loadCounters(appName);
                this.success.emit(res);
            },
            error: (err) => {
                this.error.emit(err);
            }
        });
    }

    /**
     * Iterate over filters and update counters
     */
    updateFilterCounters(): void {
        this.countersManager.updateAllCounters();
    }

    /**
     *  Get current value for filter and check if value has changed
     *
     * @param filter filter
     */
    updateFilterCounter(filter: TaskFilterCloudModel): void {
        this.countersManager.updateSingleCounter(filter);
        this.counters = this.countersManager.counters;
    }

    initFilterCounterNotifications() {
        if (!this.appName || !this.enableNotifications) {
            return;
        }

        this.filterCountersCloudService
            .getFilterCountersNotifications(this.appName)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ events }) => {
                events.forEach((taskEvent) => {
                    this.checkFilterCounter(taskEvent.entity);
                });

                this.filterCounterUpdated.emit(events);
            });

        this.countersManager.subscribeToNotifications(this.appName);
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
                this.countersManager.resetFilterUpdate(this.currentFilter.key);
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
            this.countersManager.resetFilterUpdate(filter.key);
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
        if (
            this.countersManager.currentFiltersValues[filterKey] === undefined ||
            this.countersManager.currentFiltersValues[filterKey] !== filterValue
        ) {
            this.updatedFilter.emit(filterKey);
            this.updatedCountersSet.add(filterKey);
        }
    }
}
