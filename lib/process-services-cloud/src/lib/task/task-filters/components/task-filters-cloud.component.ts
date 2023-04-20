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

import { Component, EventEmitter, OnChanges, Output, SimpleChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskFilterCloudService } from '../services/task-filter-cloud.service';
import { TaskFilterCloudModel, FilterParamsModel } from '../models/filter-cloud.model';
import { AppConfigService, TranslationService } from '@alfresco/adf-core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { BaseTaskFiltersCloudComponent } from './base-task-filters-cloud.component';
import { TaskDetailsCloudModel } from '../../start-task/models/task-details-cloud.model';
import { TaskCloudEngineEvent } from '../../../models/engine-event-cloud.model';

@Component({
    selector: 'adf-cloud-task-filters',
    templateUrl: './base-task-filters-cloud.component.html',
    styleUrls: ['./base-task-filters-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskFiltersCloudComponent extends BaseTaskFiltersCloudComponent implements OnInit, OnChanges {

    /** Emitted when a filter is being selected based on the filterParam input. */
    @Output()
    filterSelected = new EventEmitter<TaskFilterCloudModel>();

    /** Emitted when a filter is being clicked from the UI. */
    @Output()
    filterClicked = new EventEmitter<TaskFilterCloudModel>();

    /** Emitted when filter counters are updated. */
    @Output()
    filterCounterUpdated: EventEmitter<TaskCloudEngineEvent[]> = new EventEmitter<TaskCloudEngineEvent[]>();

    filters$: Observable<TaskFilterCloudModel[]>;
    filters: TaskFilterCloudModel[] = [];
    currentFilter: TaskFilterCloudModel;
    enableNotifications: boolean;

    constructor(private taskFilterCloudService: TaskFilterCloudService,
                private translationService: TranslationService,
                private appConfigService: AppConfigService) {
        super();
    }

    ngOnInit() {
        this.enableNotifications = this.appConfigService.get('notifications', true);
        this.getFilters(this.appName);
        this.initFilterCounterNotifications();
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
     * Return the filter list filtered by appName
     */
    getFilters(appName: string) {
        this.filters$ = this.taskFilterCloudService.getTaskListFilters(appName);

        this.filters$.pipe(takeUntil(this.onDestroy$)).subscribe(
            (res: TaskFilterCloudModel[]) => {
                this.resetFilter();
                this.filters = res || [];
                this.selectFilterAndEmit(this.filterParam);
                this.updateFilterCounters();
                this.success.emit(res);
            },
            (err: any) => {
                this.error.emit(err);
            }
        );
    }

    updateFilterCounters() {
        this.filters.forEach((filter: TaskFilterCloudModel) => this.updateFilterCounter(filter));
    }

    updateFilterCounter(filter: TaskFilterCloudModel) {
        if (filter?.showCounter) {
            this.counters$[filter.key] = this.taskFilterCloudService.getTaskFilterCounter(filter);
        }
    }

    initFilterCounterNotifications() {
        if (this.appName && this.enableNotifications) {
            this.taskFilterCloudService.getTaskNotificationSubscription(this.appName)
                .pipe(debounceTime(1000))
                .subscribe((result: TaskCloudEngineEvent[]) => {
                    result.map((taskEvent: TaskCloudEngineEvent) => {
                        this.checkFilterCounter(taskEvent.entity);
                    });

                    this.updateFilterCounters();
                    this.filterCounterUpdated.emit(result);
                });
        }
    }

    checkFilterCounter(filterNotification: TaskDetailsCloudModel) {
        this.filters.map((filter) => {
            if (this.isFilterPresent(filter, filterNotification)) {
                this.addToUpdatedCounters(filter.key);
            }
        });
    }

    isFilterPresent(filter: TaskFilterCloudModel, filterNotification: TaskDetailsCloudModel): boolean {
        return filter.status === filterNotification.status
            && (filter.assignee === filterNotification.assignee || filterNotification.assignee === undefined);
    }

    public selectFilter(paramFilter: FilterParamsModel) {
        if (paramFilter) {
            this.currentFilter = this.filters.find((filter, index) =>
                paramFilter.index === index ||
                paramFilter.key === filter.key ||
                paramFilter.id === filter.id ||
                (paramFilter.name &&
                    (paramFilter.name.toLocaleLowerCase() === this.translationService.instant(filter.name).toLocaleLowerCase())
                ));
        }
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
     */
    public onFilterClick(filter: FilterParamsModel) {
        if (filter) {
            this.selectFilter(filter);
            this.updateFilterCounter(this.currentFilter);
            this.filterClicked.emit(this.currentFilter);
        } else {
            this.currentFilter = undefined;
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
     * Check if the filter list is empty
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
