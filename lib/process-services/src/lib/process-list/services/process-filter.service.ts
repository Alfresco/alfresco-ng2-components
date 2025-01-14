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

import { AlfrescoApiService } from '@alfresco/adf-content-services';
import { Injectable } from '@angular/core';
import { Observable, from, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    ResultListDataRepresentationUserProcessInstanceFilterRepresentation,
    UserFiltersApi,
    UserProcessInstanceFilterRepresentation
} from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class ProcessFilterService {
    private _userFiltersApi: UserFiltersApi;
    get userFiltersApi(): UserFiltersApi {
        this._userFiltersApi = this._userFiltersApi ?? new UserFiltersApi(this.alfrescoApiService.getInstance());
        return this._userFiltersApi;
    }

    constructor(private alfrescoApiService: AlfrescoApiService) {}

    /**
     * Gets all filters defined for a Process App.
     *
     * @param appId ID of the target app
     * @returns Array of filter details
     */
    getProcessFilters(appId: number): Observable<UserProcessInstanceFilterRepresentation[]> {
        return from(this.callApiProcessFilters(appId)).pipe(
            map((response) => {
                const filters = [];
                response.data.forEach((filter) => {
                    if (!this.isFilterAlreadyExisting(filters, filter.name)) {
                        filters.push(filter);
                    }
                });
                return filters;
            })
        );
    }

    /**
     * Retrieves the process filter by ID.
     *
     * @param filterId ID of the filter
     * @param appId ID of the target app
     * @returns Details of the filter
     */
    getProcessFilterById(filterId: number, appId?: number): Observable<UserProcessInstanceFilterRepresentation> {
        return from(this.callApiProcessFilters(appId)).pipe(map((response) => response.data.find((filter) => filter.id === filterId)));
    }

    /**
     * Retrieves the process filter by name.
     *
     * @param filterName Name of the filter
     * @param appId ID of the target app
     * @returns Details of the filter
     */
    getProcessFilterByName(filterName: string, appId?: number): Observable<UserProcessInstanceFilterRepresentation> {
        return from(this.callApiProcessFilters(appId)).pipe(map((response) => response.data.find((filter) => filter.name === filterName)));
    }

    /**
     * Creates and returns the default filters for an app.
     *
     * @param appId ID of the target app
     * @returns Default filters just created
     */
    createDefaultFilters(appId: number): Observable<UserProcessInstanceFilterRepresentation[]> {
        const runningFilter = this.getRunningFilterInstance(appId, 0);
        const runningObservable = this.addProcessFilter(runningFilter);

        const completedFilter = this.getCompletedFilterInstance(appId, 1);
        const completedObservable = this.addProcessFilter(completedFilter);

        const allFilter = this.getAllFilterInstance(appId, 2);
        const allObservable = this.addProcessFilter(allFilter);

        return new Observable((observer) => {
            forkJoin([runningObservable, completedObservable, allObservable]).subscribe((res) => {
                const filters: UserProcessInstanceFilterRepresentation[] = [];
                res.forEach((filter) => {
                    if (!this.isFilterAlreadyExisting(filters, filter.name)) {
                        if (filter.name === runningFilter.name) {
                            filters.push({ ...filter, filter: runningFilter.filter, appId });
                        } else if (filter.name === completedFilter.name) {
                            filters.push({ ...filter, filter: completedFilter.filter, appId });
                        } else if (filter.name === allFilter.name) {
                            filters.push({ ...filter, filter: allFilter.filter, appId });
                        }
                    }
                });
                observer.next(filters);
                observer.complete();
            });
        });
    }

    /**
     * Checks if a filter with the given name already exists in the list of filters.
     *
     * @param filters - An array of objects representing the existing filters.
     * @param filterName - The name of the filter to check for existence.
     * @returns - True if a filter with the specified name already exists, false otherwise.
     */
    isFilterAlreadyExisting(filters: Partial<{ name: string }>[], filterName: string): boolean {
        return filters.some((existingFilter) => existingFilter.name === filterName);
    }

    /**
     * Creates and returns a filter that matches "running" process instances.
     *
     * @param appId ID of the target app
     * @param index of the filter (optional)
     * @returns Filter just created
     */
    getRunningFilterInstance(appId: number, index?: number): UserProcessInstanceFilterRepresentation {
        return {
            name: 'Running',
            appId,
            recent: true,
            icon: 'glyphicon-random',
            filter: { sort: 'created-desc', name: '', state: 'running' },
            index
        };
    }

    /**
     * Adds a filter.
     *
     * @param filter The filter to add
     * @returns The filter just added
     */
    addProcessFilter(filter: UserProcessInstanceFilterRepresentation): Observable<UserProcessInstanceFilterRepresentation> {
        return from(this.userFiltersApi.createUserProcessInstanceFilter(filter));
    }

    /**
     * Calls `getUserProcessInstanceFilters` from the Alfresco JS API.
     *
     * @param appId ID of the target app
     * @returns List of filter details
     */
    callApiProcessFilters(appId?: number): Promise<ResultListDataRepresentationUserProcessInstanceFilterRepresentation> {
        if (appId) {
            return this.userFiltersApi.getUserProcessInstanceFilters({ appId });
        } else {
            return this.userFiltersApi.getUserProcessInstanceFilters();
        }
    }

    getCompletedFilterInstance(appId: number, index?: number): UserProcessInstanceFilterRepresentation {
        return {
            name: 'Completed',
            appId,
            recent: false,
            icon: 'glyphicon-ok-sign',
            filter: { sort: 'created-desc', name: '', state: 'completed' },
            index
        };
    }

    getAllFilterInstance(appId: number, index?: number): UserProcessInstanceFilterRepresentation {
        return {
            name: 'All',
            appId,
            recent: true,
            icon: 'glyphicon-th',
            filter: { sort: 'created-desc', name: '', state: 'all' },
            index
        };
    }
}
