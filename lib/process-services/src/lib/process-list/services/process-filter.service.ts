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

import { AlfrescoApiService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable, from, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ResultListDataRepresentationUserProcessInstanceFilterRepresentation, UserFiltersApi, UserProcessInstanceFilterRepresentation } from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class ProcessFilterService {

    constructor(private alfrescoApiService: AlfrescoApiService) {
    }

    private get userFiltersApi(): UserFiltersApi {
        return this.alfrescoApiService.getInstance().activiti.userFiltersApi;
    }

    /**
     * Gets all filters defined for a Process App.
     * @param appId ID of the target app
     * @returns Array of filter details
     */
    getProcessFilters(appId: number): Observable<UserProcessInstanceFilterRepresentation[]> {
        return from(this.callApiProcessFilters(appId))
            .pipe(
                map((response: any) => {
                    const filters: UserProcessInstanceFilterRepresentation[] = [];
                    response.data.forEach((filter: UserProcessInstanceFilterRepresentation) => {
                        const filterModel = new UserProcessInstanceFilterRepresentation(filter);
                        filters.push(filterModel);
                    });
                    return filters;
                }),
                catchError(() => of([]))
            );
    }

    /**
     * Retrieves the process filter by ID.
     * @param filterId ID of the filter
     * @param appId ID of the target app
     * @returns Details of the filter
     */
    getProcessFilterById(filterId: number, appId?: number): Observable<UserProcessInstanceFilterRepresentation | null> {
        return from(this.callApiProcessFilters(appId))
            .pipe(
                map((response: any) => {
                    return response.data.find((filter) => filter.id === filterId);
                }),
                catchError(() => of(null))
            );
    }

    /**
     * Retrieves the process filter by name.
     * @param filterName Name of the filter
     * @param appId ID of the target app
     * @returns Details of the filter
     */
    getProcessFilterByName(filterName: string, appId?: number): Observable<UserProcessInstanceFilterRepresentation | null> {
        return from(this.callApiProcessFilters(appId))
            .pipe(
                map((response: any) => {
                    return response.data.find((filter) => filter.name === filterName);
                }),
                catchError(() => of(null))
            );
    }

    /**
     * Creates and returns the default filters for an app.
     * @param appId ID of the target app
     * @returns Default filters just created
     */

    createDefaultFilters(appId: number): Observable<UserProcessInstanceFilterRepresentation[]> {
        const runningFilter = this.getRunningFilterInstance(appId, 0);
        const completedFilter = this.getCompletedFilterInstance(appId, 1);
        const allFilter = this.getAllFilterInstance(appId, 2);

        return forkJoin(
            this.addProcessFilter(runningFilter),
            this.addProcessFilter(completedFilter),
            this.addProcessFilter(allFilter)
        )
        .pipe(
            map(entries => {
                const result: UserProcessInstanceFilterRepresentation[] = [];

                entries
                    .filter(entry => entry)
                    .forEach(filter => {
                        if (filter.name === runningFilter.name) {
                            runningFilter.id = filter.id;
                            result.push(runningFilter);
                        } else if (filter.name === completedFilter.name) {
                            completedFilter.id = filter.id;
                            result.push(completedFilter);
                        } else if (filter.name === allFilter.name) {
                            allFilter.id = filter.id;
                            result.push(allFilter);
                        }
                    });

                return result;
            }),
            catchError(() => of([]))
        );
    }

    /**
     * Creates and returns a filter that matches "running" process instances.
     * @param appId ID of the target app
     * @param index of the filter (optional)
     * @returns Filter just created
     */

    getRunningFilterInstance(appId: number, index?: number): UserProcessInstanceFilterRepresentation {
        return new UserProcessInstanceFilterRepresentation({
            'name': 'Running',
            'appId': appId,
            'recent': true,
            'icon': 'glyphicon-random',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' },
            index
        });
    }

    /**
     * Returns a static Completed filter instance.
     * @param appId ID of the target app
     * @param index of the filter (optional)
     * @returns Details of the filter
     */

    private getCompletedFilterInstance(appId: number, index?: number): UserProcessInstanceFilterRepresentation {
        return new UserProcessInstanceFilterRepresentation({
            'name': 'Completed',
            'appId': appId,
            'recent': false,
            'icon': 'glyphicon-ok-sign',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'completed' },
            index
        });
    }

    /**
     * Returns a static All filter instance.
     * @param appId ID of the target app
     * @param index of the filter (optional)
     * @returns Details of the filter
     */

    private getAllFilterInstance(appId: number, index?: number): UserProcessInstanceFilterRepresentation {
        return new UserProcessInstanceFilterRepresentation({
            'name': 'All',
            'appId': appId,
            'recent': true,
            'icon': 'glyphicon-th',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'all' },
            index
        });
    }

    /**
     * Adds a filter.
     * @param filter The filter to add
     * @returns The filter just added
     */
    addProcessFilter(filter: UserProcessInstanceFilterRepresentation): Observable<UserProcessInstanceFilterRepresentation | null> {
        return from(this.userFiltersApi.createUserProcessInstanceFilter(filter))
            .pipe(catchError(() => of(null)));
    }

    /**
     * Calls `getUserProcessInstanceFilters` from the Alfresco JS API.
     * @param appId ID of the target app
     * @returns List of filter details
     */
    callApiProcessFilters(appId?: number): Promise<ResultListDataRepresentationUserProcessInstanceFilterRepresentation> {
        if (appId) {
            return this.userFiltersApi.getUserProcessInstanceFilters({ appId: appId });
        } else {
            return this.userFiltersApi.getUserProcessInstanceFilters();
        }
    }
}
