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

import { Injectable, Inject } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { ServiceTaskFilterCloudModel } from '../models/filter-cloud.model';
import { switchMap, map } from 'rxjs/operators';
import { PreferenceCloudServiceInterface } from '../../../services/preference-cloud.interface';
import { TASK_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { IdentityUserService } from '../../../people/services/identity-user.service';

@Injectable({
    providedIn: 'root'
})
export class ServiceTaskFilterCloudService {
    private filtersSubject: BehaviorSubject<ServiceTaskFilterCloudModel[]>;
    filters$: Observable<ServiceTaskFilterCloudModel[]>;

    constructor(
        private identityUserService: IdentityUserService,
        @Inject(TASK_FILTERS_SERVICE_TOKEN)
        public preferenceService: PreferenceCloudServiceInterface
    ) {
        this.filtersSubject = new BehaviorSubject([]);
        this.filters$ = this.filtersSubject.asObservable();
    }

    /**
     * Creates and returns the default task filters for an app.
     *
     * @param appName Name of the target app
     * @returns Observable of default filters task filters just created or created filters
     */
    private createDefaultFilters(appName: string) {
        const key: string = this.prepareKey(appName);
        this.preferenceService.getPreferences(appName, key).pipe(
            switchMap((response: any) => {
                const preferences = (response && response.list && response.list.entries) ? response.list.entries : [];
                if (!this.hasPreferences(preferences) || !this.hasTaskFilters(preferences, key)) {
                    return this.createTaskFilters(appName, key, this.defaultServiceTaskFilters(appName));
                } else {
                    return of(this.findFiltersByKeyInPreferences(preferences, key));
                }
            })
        ).subscribe((filters) => {
            this.addFiltersToStream(filters);
        });
    }

    /**
     * Checks user preference are empty or not
     *
     * @param preferences User preferences of the target app
     * @returns Boolean value if the preferences are not empty
     */
    private hasPreferences(preferences: any): boolean {
        return preferences && preferences.length > 0;
    }

    /**
     * Checks for task filters in given user preferences
     *
     * @param preferences User preferences of the target app
     * @param key Key of the task filters
     * @param filters Details of create filter
     * @returns Boolean value if the preference has task filters
     */
    private hasTaskFilters(preferences: any, key: string): boolean {
        const filters = preferences.find((filter: any) => filter.entry.key === key);
        return (filters && filters.entry) ? JSON.parse(filters.entry.value).length > 0 : false;
    }

    /**
     * Calls create preference api to create task filters
     *
     * @param appName Name of the target app
     * @param key Key of the task instance filters
     * @param filters Details of new task filter
     * @returns Observable of created task filters
     */
    private createTaskFilters(appName: string, key: string, filters: ServiceTaskFilterCloudModel[]): Observable<ServiceTaskFilterCloudModel[]> {
        return this.preferenceService.createPreference(appName, key, filters);
    }

    /**
     * Calls get preference api to get task filter by preference key
     *
     * @param appName Name of the target app
     * @param key Key of the task filters
     * @returns Observable of task filters
     */
    private getTaskFiltersByKey(appName: string, key: string): Observable<ServiceTaskFilterCloudModel[]> {
        return this.preferenceService.getPreferenceByKey(appName, key);
    }

    /**
     * Gets all task filters for a task app.
     *
     * @param appName Name of the target app
     * @returns Observable of task filter details
     */
    getTaskListFilters(appName?: string): Observable<ServiceTaskFilterCloudModel[]> {
        this.createDefaultFilters(appName);
        return this.filters$;
    }

    /**
     * Gets a task filter.
     *
     * @param appName Name of the target app
     * @param id ID of the task
     * @returns Details of the task filter
     */
    getTaskFilterById(appName: string, id: string): Observable<ServiceTaskFilterCloudModel> {
        const key: string = this.prepareKey(appName);
        return this.getTaskFiltersByKey(appName, key).pipe(
            switchMap((filters: ServiceTaskFilterCloudModel[]) => {
                if (filters && filters.length === 0) {
                    return this.createTaskFilters(appName, key, this.defaultServiceTaskFilters(appName));
                } else {
                    return of(filters);
                }
            }),
            map((filters: any) => filters.filter((filter: ServiceTaskFilterCloudModel) => filter.id === id)[0])
        );
    }

    /**
     * Adds a new task filter.
     *
     * @param filter The new filter to add
     * @returns Observable of task instance filters with newly added filter
     */
    addFilter(newFilter: ServiceTaskFilterCloudModel): Observable<ServiceTaskFilterCloudModel[]> {
        const key: string = this.prepareKey(newFilter.appName);
        return this.getTaskFiltersByKey(newFilter.appName, key).pipe(
            switchMap((filters: ServiceTaskFilterCloudModel[]) => {
                if (filters && filters.length === 0) {
                    return this.createTaskFilters(newFilter.appName, key, [newFilter]);
                } else {
                    filters.push(newFilter);
                    return this.preferenceService.updatePreference(newFilter.appName, key, filters);
                }
            }),
            map((filters: ServiceTaskFilterCloudModel[]) => {
                this.addFiltersToStream(filters);
                return filters;
            })
        );
    }

    private addFiltersToStream(filters: ServiceTaskFilterCloudModel[]) {
        this.filtersSubject.next(filters);
    }

    /**
     * Updates a task filter.
     *
     * @param filter The filter to update
     * @returns Observable of task instance filters with updated filter
     */
    updateFilter(updatedFilter: ServiceTaskFilterCloudModel): Observable<ServiceTaskFilterCloudModel[]> {
        const key: string = this.prepareKey(updatedFilter.appName);
        return this.getTaskFiltersByKey(updatedFilter.appName, key).pipe(
            switchMap((filters: ServiceTaskFilterCloudModel[]) => {
                if (filters && filters.length === 0) {
                    return this.createTaskFilters(updatedFilter.appName, key, [updatedFilter]);
                } else {
                    const itemIndex = filters.findIndex((filter: ServiceTaskFilterCloudModel) => filter.id === updatedFilter.id);
                    filters[itemIndex] = updatedFilter;
                    return this.updateTaskFilters(updatedFilter.appName, key, filters);
                }
            }),
            map((updatedFilters: ServiceTaskFilterCloudModel[]) => {
                this.addFiltersToStream(updatedFilters);
                return updatedFilters;
            })
        );
    }

    /**
     * Deletes a task filter
     *
     * @param filter The filter to delete
     * @returns Observable of task instance filters without deleted filter
     */
    deleteFilter(deletedFilter: ServiceTaskFilterCloudModel): Observable<ServiceTaskFilterCloudModel[]> {
        const key = this.prepareKey(deletedFilter.appName);
        return this.getTaskFiltersByKey(deletedFilter.appName, key).pipe(
            switchMap((filters: ServiceTaskFilterCloudModel[]) => {
                if (filters && filters.length > 0) {
                    filters = filters.filter(filter => filter.id !== deletedFilter.id);
                    return this.updateTaskFilters(deletedFilter.appName, key, filters);
                }
                return of([]);
            }),
            map(filters => {
                this.addFiltersToStream(filters);
                return filters;
            })
        );
    }

    /**
     * Checks if given filter is a default filter
     *
     * @param filterName Name of the target task filter
     * @returns Boolean value for whether the filter is a default filter
     */
    isDefaultFilter(filterName: string): boolean {
        const defaultFilters = this.defaultServiceTaskFilters();
        return defaultFilters.findIndex((filter) => filterName === filter.name) !== -1;
    }

    /**
     * Calls update preference api to update task filter
     *
     * @param appName Name of the target app
     * @param key Key of the task filters
     * @param filters Details of update filter
     * @returns Observable of updated task filters
     */
    private updateTaskFilters(appName: string, key: string, filters: ServiceTaskFilterCloudModel[]): Observable<ServiceTaskFilterCloudModel[]> {
        return this.preferenceService.updatePreference(appName, key, filters);
    }

    /**
     * Creates a uniq key with appName and username
     *
     * @param appName Name of the target app
     * @returns String of task filters preference key
     */
    private prepareKey(appName: string): string {
        return `service-task-filters-${appName}-${this.identityUserService.getCurrentUserInfo().username}`;
    }

    /**
     * Finds and returns the task filters from preferences
     *
     * @param appName Name of the target app
     * @returns Array of TaskFilterCloudModel
     */
    private findFiltersByKeyInPreferences(preferences: any, key: string): ServiceTaskFilterCloudModel[] {
        const result = preferences.find((filter: any) => filter.entry.key === key);
        return result && result.entry ? JSON.parse(result.entry.value) : [];
    }

    /**
     * Creates and returns the default filters for a task app.
     *
     * @param appName Name of the target app
     * @returns Array of TaskFilterCloudModel
     */
    private defaultServiceTaskFilters(appName?: string): ServiceTaskFilterCloudModel[] {
        return [
            {
                id: this.generateRandomId(),
                name: 'ADF_CLOUD_SERVICE_TASK_FILTERS.ALL_SERVICE_TASKS',
                key: 'my-service-tasks',
                icon: 'inbox',
                appName,
                status: '',
                sort: 'startedDate',
                order: 'DESC'
            } as ServiceTaskFilterCloudModel,
            {
                id: this.generateRandomId(),
                name: 'ADF_CLOUD_SERVICE_TASK_FILTERS.COMPLETED_TASKS',
                key: 'completed-tasks',
                icon: 'done',
                appName,
                status: 'COMPLETED',
                sort: 'completedDate',
                order: 'DESC'
            } as ServiceTaskFilterCloudModel,
            {
                id: this.generateRandomId(),
                name: 'ADF_CLOUD_SERVICE_TASK_FILTERS.ERRORED_TASKS',
                key: 'errored-service-tasks',
                icon: 'error',
                appName,
                status: 'ERROR',
                sort: 'startedDate',
                order: 'DESC'
            } as ServiceTaskFilterCloudModel
        ];
    }

    generateRandomId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}
