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

import { inject, Injectable } from '@angular/core';
import { Observable, forkJoin, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserFiltersApi, UserTaskFilterRepresentation } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-content-services';

@Injectable({
    providedIn: 'root'
})
export class TaskFilterService {
    protected apiService = inject(AlfrescoApiService);

    private _userFiltersApi: UserFiltersApi;
    get userFiltersApi(): UserFiltersApi {
        this._userFiltersApi = this._userFiltersApi ?? new UserFiltersApi(this.apiService.getInstance());
        return this._userFiltersApi;
    }

    /**
     * Creates and returns the default filters for a process app.
     *
     * @param appId ID of the target app
     * @returns Array of default filters just created
     */
    public createDefaultFilters(appId: number): Observable<UserTaskFilterRepresentation[]> {
        const myTasksFilter = this.getMyTasksFilterInstance(appId, 0);
        const myTaskObservable = this.addFilter(myTasksFilter);

        const overdueTasksFilter = this.getOverdueTasksFilterInstance(appId, 1);
        const overdueObservable = this.addFilter(overdueTasksFilter);

        const unassignedTasksFilter = this.getUnassignedTasksFilterInstance(appId, 2);
        const unassignedObservable = this.addFilter(unassignedTasksFilter);

        const completedTasksFilter = this.getCompletedTasksFilterInstance(appId, 3);
        const completeObservable = this.addFilter(completedTasksFilter);

        return new Observable((observer) => {
            forkJoin([myTaskObservable, overdueObservable, unassignedObservable, completeObservable]).subscribe((res) => {
                const filters: UserTaskFilterRepresentation[] = [];
                res.forEach((filter) => {
                    if (!this.isFilterAlreadyExisting(filters, filter.name)) {
                        if (filter.name === overdueTasksFilter.name) {
                            filters.push(
                                new UserTaskFilterRepresentation({
                                    ...filter,
                                    filter: overdueTasksFilter.filter,
                                    appId
                                })
                            );
                        } else if (filter.name === myTasksFilter.name) {
                            filters.push(
                                new UserTaskFilterRepresentation({
                                    ...filter,
                                    filter: myTasksFilter.filter,
                                    appId
                                })
                            );
                        } else if (filter.name === unassignedTasksFilter.name) {
                            filters.push(
                                new UserTaskFilterRepresentation({
                                    ...filter,
                                    filter: unassignedTasksFilter.filter,
                                    appId
                                })
                            );
                        } else if (filter.name === completedTasksFilter.name) {
                            filters.push(
                                new UserTaskFilterRepresentation({
                                    ...filter,
                                    filter: completedTasksFilter.filter,
                                    appId
                                })
                            );
                        }
                    }
                });
                observer.next(filters);
                observer.complete();
            });
        });
    }

    /**
     * Gets all task filters for a process app.
     *
     * @param appId Optional ID for a specific app
     * @returns Array of task filter details
     */
    getTaskListFilters(appId?: number): Observable<UserTaskFilterRepresentation[]> {
        return from(this.callApiTaskFilters(appId)).pipe(
            map((response) => {
                const filters: UserTaskFilterRepresentation[] = [];
                response.data.forEach((filter: UserTaskFilterRepresentation) => {
                    if (!this.isFilterAlreadyExisting(filters, filter.name)) {
                        const filterModel = new UserTaskFilterRepresentation(filter);
                        filters.push(filterModel);
                    }
                });
                return filters;
            })
        );
    }

    /**
     * Checks if a filter with the given name already exists in the list of filters.
     *
     * @param filters - An array of objects representing the existing filters.
     * @param filterName - The name of the filter to check for existence.
     * @returns - True if a filter with the specified name already exists, false otherwise.
     */
    isFilterAlreadyExisting(filters: UserTaskFilterRepresentation[], filterName: string): boolean {
        return filters.some((existingFilter) => existingFilter.name === filterName);
    }

    /**
     * Gets a task filter by ID.
     *
     * @param filterId ID of the filter
     * @param appId ID of the app for the filter
     * @returns Details of task filter
     */
    getTaskFilterById(filterId: number, appId?: number): Observable<UserTaskFilterRepresentation> {
        return from(this.callApiTaskFilters(appId)).pipe(map((response) => response.data.find((filter) => filter.id === filterId)));
    }

    /**
     * Gets a task filter by name.
     *
     * @param taskName Name of the filter
     * @param appId ID of the app for the filter
     * @returns Details of task filter
     */
    getTaskFilterByName(taskName: string, appId?: number): Observable<UserTaskFilterRepresentation> {
        return from(this.callApiTaskFilters(appId)).pipe(map((response) => response.data.find((filter) => filter.name === taskName)));
    }

    /**
     * Adds a new task filter
     *
     * @param filter The new filter to add
     * @returns Details of task filter just added
     */
    addFilter(filter: UserTaskFilterRepresentation): Observable<UserTaskFilterRepresentation> {
        return from(this.userFiltersApi.createUserTaskFilter(filter));
    }

    /**
     * Update a task filter
     *
     * @param filterId existing filter id
     * @param updatedFilter updated filter body
     * @returns Observable<UserTaskFilterRepresentation>
     */
    updateTaskFilter(filterId: number, updatedFilter: UserTaskFilterRepresentation): Observable<UserTaskFilterRepresentation> {
        return from(this.userFiltersApi.updateUserTaskFilter(filterId, updatedFilter));
    }

    /**
     * Calls `getUserTaskFilters` from the Alfresco JS API.
     *
     * @param appId ID of the target app
     * @returns List of task filters
     */
    callApiTaskFilters(appId?: number): Promise<any> {
        if (appId) {
            return this.userFiltersApi.getUserTaskFilters({ appId });
        } else {
            return this.userFiltersApi.getUserTaskFilters();
        }
    }

    /**
     * Creates and returns a filter for "My Tasks" task instances.
     *
     * @param appId ID of the target app
     * @param index of the filter (optional)
     * @returns The newly created filter
     */
    getMyTasksFilterInstance(appId: number, index?: number): UserTaskFilterRepresentation {
        return new UserTaskFilterRepresentation({
            name: 'My Tasks',
            appId,
            recent: false,
            icon: 'glyphicon-inbox',
            filter: {
                sort: 'created-desc',
                name: '',
                state: 'open',
                assignment: 'assignee'
            },
            index
        });
    }

    /**
     * Creates and returns a filter for "Overdue" task instances.
     *
     * @param appId ID of the target app
     * @param index of the filter (optional)
     * @returns The newly created filter
     */
    getOverdueTasksFilterInstance(appId: number, index?: number): UserTaskFilterRepresentation {
        return new UserTaskFilterRepresentation({
            name: 'Overdue Tasks',
            appId,
            recent: false,
            icon: 'glyphicon-align-left',
            filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'assignee' },
            index
        });
    }

    /**
     * Creates and returns a filter for "Unassigned Tasks" task instances.
     *
     * @param appId ID of the target app
     * @param index of the filter (optional)
     * @returns The newly created filter
     */
    getUnassignedTasksFilterInstance(appId: number, index?: number): UserTaskFilterRepresentation {
        return new UserTaskFilterRepresentation({
            name: 'Unassigned Tasks',
            appId,
            recent: false,
            icon: 'glyphicon-record',
            filter: { sort: 'created-desc', name: '', state: 'open', assignment: 'candidate' },
            index
        });
    }

    /**
     * Creates and returns a filter for "Completed" task instances.
     *
     * @param appId ID of the target app
     * @param index of the filter (optional)
     * @returns The newly created filter
     */
    getCompletedTasksFilterInstance(appId: number, index?: number): UserTaskFilterRepresentation {
        return new UserTaskFilterRepresentation({
            name: 'Completed Tasks',
            appId,
            recent: true,
            icon: 'glyphicon-ok-sign',
            filter: { sort: 'created-desc', name: '', state: 'completed', assignment: 'involved' },
            index
        });
    }
}
