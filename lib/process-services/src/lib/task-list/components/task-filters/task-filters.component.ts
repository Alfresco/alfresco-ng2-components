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

import { AppsProcessService } from '../../../services/apps-process.service';
import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { TaskFilterService } from '../../services/task-filter.service';
import { TaskListService } from '../../services/tasklist.service';
import { IconModel } from '../../../app-list/icon.model';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserTaskFilterRepresentation } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { IconComponent } from '@alfresco/adf-core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, Observable } from 'rxjs';

@Component({
    selector: 'adf-task-filters',
    standalone: true,
    imports: [CommonModule, TranslateModule, MatButtonModule, IconComponent],
    templateUrl: './task-filters.component.html',
    styleUrls: ['./task-filters.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskFiltersComponent implements OnInit, OnChanges {
    /**
     * Parameters to use for the task filter. If there is no match then
     * the default filter (the first one the list) is selected.
     */
    @Input()
    filterParam: UserTaskFilterRepresentation;

    /** Emitted when a filter is being clicked from the UI. */
    @Output()
    filterClicked = new EventEmitter<UserTaskFilterRepresentation>();

    /** Emitted when a filter is being selected based on the filterParam input. */
    @Output()
    filterSelected = new EventEmitter<UserTaskFilterRepresentation>();

    /** Emitted when the list is loaded. */
    @Output()
    success = new EventEmitter<any>();

    /** Emitted when an error occurs during loading. */
    @Output()
    error = new EventEmitter<any>();

    /** Display filters available to the current user for the application with the specified ID. */
    @Input()
    appId: number;

    /** Display filters available to the current user for the application with the specified name. */
    @Input()
    appName: string;

    /** Toggles display of the filter's icon. */
    @Input()
    showIcon: boolean;

    currentFilter: UserTaskFilterRepresentation;
    filters: UserTaskFilterRepresentation[] = [];

    isTaskRoute: boolean;
    isTaskActive: boolean;

    private iconsMDL: IconModel;

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private taskFilterService: TaskFilterService,
        private taskListService: TaskListService,
        private appsProcessService: AppsProcessService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.iconsMDL = new IconModel();
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationStart),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((navigationStart: NavigationStart) => {
                const activeRoute = navigationStart.url;
                this.isTaskActive = activeRoute.includes('tasks');
            });
        this.activatedRoute.url.subscribe((segments) => {
            const currentRoute = segments.join('/');
            this.isTaskRoute = currentRoute.includes('tasks');
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        const appName = changes['appName'];
        const appId = changes['appId'];
        const filterParam = changes['filterParam'];
        if (appName?.currentValue) {
            this.getFiltersByAppName(appName.currentValue);
        } else if (appId && appId.currentValue !== appId.previousValue) {
            this.getFiltersByAppId(appId.currentValue);
        } else if (filterParam && filterParam.currentValue !== filterParam.previousValue) {
            this.selectFilterAndEmit(filterParam.currentValue);
        }
    }

    isActiveRoute(filterActive: UserTaskFilterRepresentation): boolean {
        return (this.isTaskActive || this.isTaskRoute) && this.currentFilter === filterActive;
    }

    /**
     * Return the filter list filtered by appId
     *
     * @param appId - optional
     */
    getFiltersByAppId(appId?: number) {
        this.taskFilterService.getTaskListFilters(appId).subscribe(
            (res) => {
                if (res.length === 0 && this.isFilterListEmpty()) {
                    this.createFiltersByAppId(appId);
                } else {
                    const migratedFilters = this.migrateObsoleteFilters(res);
                    if (migratedFilters.length > 0) {
                        forkJoin(migratedFilters).subscribe(() => {
                            this.setTaskFilters(res);
                        });
                    } else {
                        this.setTaskFilters(res);
                    }
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
     * @param appName application name
     */
    getFiltersByAppName(appName: string): void {
        this.appsProcessService.getDeployedApplicationsByName(appName).subscribe(
            (application) => {
                this.getFiltersByAppId(application.id);
            },
            (err) => {
                this.error.emit(err);
            }
        );
    }

    /**
     * Create default filters by appId
     *
     * @param appId application id
     */
    private createFiltersByAppId(appId?: number): void {
        this.taskFilterService.createDefaultFilters(appId).subscribe(
            (resDefault) => {
                this.setTaskFilters(resDefault);
            },
            (errDefault: any) => {
                this.error.emit(errDefault);
            }
        );
    }

    /**
     * Pass the selected filter as next
     *
     * @param newFilter new filter model
     */
    public selectFilter(newFilter: UserTaskFilterRepresentation): void {
        if (newFilter) {
            this.currentFilter = this.filters.find(
                (entry, index) =>
                    newFilter.index === index ||
                    newFilter.id === entry.id ||
                    (newFilter.name && newFilter.name.toLocaleLowerCase() === entry.name.toLocaleLowerCase())
            );
        }
    }

    private selectFilterAndEmit(newFilter: UserTaskFilterRepresentation) {
        this.selectFilter(newFilter);
        this.filterSelected.emit(this.currentFilter);
    }

    /**
     * Selects and emits the clicked filter.
     *
     * @param filterParams filter parameters model
     */
    onFilterClick(filterParams: UserTaskFilterRepresentation) {
        this.selectFilter(filterParams);
        this.filterClicked.emit(this.currentFilter);
    }

    /**
     * Select filter with task
     *
     * @param taskId task id
     */
    selectFilterWithTask(taskId: string): void {
        const filteredFilterList: UserTaskFilterRepresentation[] = [];
        this.taskListService.getFilterForTaskById(taskId, this.filters).subscribe(
            (filterModel) => {
                filteredFilterList.push(filterModel);
            },
            (err) => {
                this.error.emit(err);
            },
            () => {
                if (filteredFilterList.length > 0) {
                    this.selectFilter(filteredFilterList[0]);
                    this.filterSelected.emit(this.currentFilter);
                }
            }
        );
    }

    /**
     * Get the current filter
     *
     * @returns filter model
     */
    getCurrentFilter(): UserTaskFilterRepresentation {
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

    /**
     * Get the material icons equivalent of the glyphicon icon
     *
     * @param icon glyphicon name
     * @returns material icons equivalent of the icon
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

    /**
     * Migrate "Involved" and "Queued" filters to "Overdue" and "Unassigned" filters
     *
     * @param filters - list of filters to migrate
     * @returns list of observables for each migrated filter
     */
    private migrateObsoleteFilters(filters: UserTaskFilterRepresentation[]): Observable<UserTaskFilterRepresentation>[] {
        const migratedFilters: Observable<UserTaskFilterRepresentation>[] = [];
        filters.forEach((filterToMigrate) => {
            switch (filterToMigrate.name) {
                case 'Involved Tasks':
                    migratedFilters.push(
                        this.taskFilterService.updateTaskFilter(filterToMigrate.id, this.taskFilterService.getOverdueTasksFilterInstance(this.appId))
                    );
                    break;
                case 'Queued Tasks':
                    migratedFilters.push(
                        this.taskFilterService.updateTaskFilter(
                            filterToMigrate.id,
                            this.taskFilterService.getUnassignedTasksFilterInstance(this.appId)
                        )
                    );
                    break;
                default:
                    break;
            }
        });
        return migratedFilters;
    }

    private setTaskFilters(taskFilters: UserTaskFilterRepresentation[]): void {
        this.resetFilter();
        this.filters = taskFilters;
        this.selectFilter(this.filterParam);
        this.success.emit(taskFilters);
    }
}
