/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { JwtHelperService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { TaskFilterCloudModel } from '../models/filter-cloud.model';
import { UserPreferenceCloudService } from '../../../services/public-api';
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class TaskFilterCloudService {

    private filtersSubject: BehaviorSubject<TaskFilterCloudModel[]>;
    filters$: Observable<TaskFilterCloudModel[]>;

    constructor( private jwtHelperService: JwtHelperService,
                 private preferenceService: UserPreferenceCloudService) {
        this.filtersSubject = new BehaviorSubject([]);
        this.filters$ = this.filtersSubject.asObservable();
    }

    /**
     * Creates and returns the default filters for a process app.
     * @param appName Name of the target app
     * @returns Observable of default filters just created
     */
    private createDefaultFilters(appName: string) {
        this.preferenceService.getPreferences(appName).pipe(
            switchMap((preferencesList) => {
                const key = this.getKey(appName);
                const preferences = preferencesList.list.entries;
                if (preferences && preferences.length > 0) {
                    const preferredFilters = this.findTaskFilterPreference(preferences, key);
                    if (preferredFilters.length > 0) {
                        return of(preferredFilters);
                    } else {
                        return this.defaultTaskFilters(appName, key);
                    }
                } else {
                    return this.defaultTaskFilters(appName, key);
                }
            })
        ).subscribe((filters) => {
            this.addFiltersToStream(filters);
        });
    }

    private findTaskFilterPreference(preferences: any[], key): TaskFilterCloudModel[] {
        const filter = preferences.find((preference) => preference.entry.key === key);
        return filter ? JSON.parse(filter.entry.value) : [];
    }

    private defaultTaskFilters(appName, key) {
        const defaultPreferences: TaskFilterCloudModel[] = [];
        defaultPreferences.push(this.getMyTasksFilterInstance(appName));
        defaultPreferences.push(this.getCompletedTasksFilterInstance(appName));
        return this.preferenceService.createPreference(appName, key, JSON.stringify(defaultPreferences));
    }

    /**
     * Gets all task filters for a process app.
     * @param appName Name of the target app
     * @returns Observable of task filter details
     */
    getTaskListFilters(appName?: string): Observable<TaskFilterCloudModel[]> {
        this.createDefaultFilters(appName);
        return this.filters$;
    }

    /**
     * Gets a task filter.
     * @param appName Name of the target app
     * @param id ID of the task
     * @returns Details of the task filter
     */
    getTaskFilterById(appName: string, id: string): any {
        const key = this.getKey(appName);
        return this.preferenceService.getPreferenceByKey(appName, key).pipe(
            map((res) => {
                const filtredResult = res.filter((filterTmp: TaskFilterCloudModel) => {
                    return filterTmp.id === id;
                });
                return filtredResult[0];
            })
        );
    }

    /**
     * Adds a new task filter.
     * @param filter The new filter to add
     * @returns Details of task filter just added
     */
    addFilter(filter: TaskFilterCloudModel) {
        const key = this.getKey(filter.appName);
        this.preferenceService.getPreferenceByKey(filter.appName, key).pipe(
            switchMap((preferences) => {
                if (preferences && preferences.length > 0) {
                    preferences.push(filter);
                    return this.preferenceService.updatePreference(filter.appName, key, JSON.stringify(preferences));
                } else {
                    return this.preferenceService.createPreference(filter.appName, key, JSON.stringify([filter]));
                }
            })
        ).subscribe((filters) => {
            this.addFiltersToStream(filters);
        });
    }

    private addFiltersToStream(filters: TaskFilterCloudModel[]) {
        this.filtersSubject.next(filters);
    }

    /**
     * Updates a task filter.
     * @param filter The filter to update
     */
    updateFilter(filter: TaskFilterCloudModel) {
        const key = this.getKey(filter.appName);
        this.preferenceService.getPreferenceByKey(filter.appName, key).pipe(
            switchMap((preferences) => {
                if (preferences && preferences.length > 0) {
                    const itemIndex = preferences.findIndex((preferenceFilter) => preferenceFilter.id === filter.id);
                    preferences[itemIndex] = filter;
                    return this.preferenceService.updatePreference(filter.appName, key, JSON.stringify(preferences));
                } else {
                    return this.preferenceService.createPreference(filter.appName, key, JSON.stringify([filter]));
                }
            })
        ).subscribe((filterResult) => {
            this.addFiltersToStream(filterResult);
        });
    }

    /**
     * Deletes a task filter
     * @param filter The filter to delete
     */
    deleteFilter(filter: TaskFilterCloudModel) {
        const key = this.getKey(filter.appName);
        this.preferenceService.getPreferenceByKey(filter.appName, key).pipe(
            switchMap((preferences) => {
                if (preferences && preferences.length > 0) {
                    const filters = preferences.filter((item) => item.id !== filter.id);
                    return this.preferenceService.updatePreference(filter.appName, key, JSON.stringify(filters));
                }
            })
        ).subscribe((filters) => {
            this.addFiltersToStream(filters);
        });
    }

    /**
     * Gets the username field from the access token.
     * @returns Username string
     */
    getUsername(): string {
        return this.jwtHelperService.getValueFromLocalAccessToken<string>(JwtHelperService.USER_PREFERRED_USERNAME);
    }

    /**
     * Generates the key field from the access token.
     * @returns Key string
     */
    getKey(appName): string {
        const userName = this.getUsername();
        return `task-filters-${appName}-${userName}`;
    }

    /**
     * Creates and returns a filter for "My Tasks" task instances.
     * @param appName Name of the target app
     * @returns The newly created filter
     */
    getMyTasksFilterInstance(appName: string): TaskFilterCloudModel {
        const username = this.getUsername();
        return new TaskFilterCloudModel({
            name: 'ADF_CLOUD_TASK_FILTERS.MY_TASKS',
            key: 'my-tasks',
            icon: 'inbox',
            appName: appName,
            status: 'ASSIGNED',
            assignee: username,
            sort: 'createdDate',
            order: 'DESC'
        });
    }

    /**
     * Creates and returns a filter for "Completed" task instances.
     * @param appName Name of the target app
     * @returns The newly created filter
     */
    getCompletedTasksFilterInstance(appName: string): TaskFilterCloudModel {
        return new TaskFilterCloudModel({
            name: 'ADF_CLOUD_TASK_FILTERS.COMPLETED_TASKS',
            key: 'completed-tasks',
            icon: 'done',
            appName: appName,
            status: 'COMPLETED',
            assignee: '',
            sort: 'createdDate',
            order: 'DESC'
        });
    }
}
