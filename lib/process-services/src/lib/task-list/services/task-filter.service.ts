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

import { AlfrescoApiService, LogService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, from, of } from 'rxjs';
import { FilterRepresentationModel } from '../models/filter.model';
import { map, catchError } from 'rxjs/operators';
import { UserFiltersApi } from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class TaskFilterService {

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    private get userFiltersApi(): UserFiltersApi {
        return this.apiService.getInstance().activiti.userFiltersApi;
    }

    /**
     * Creates and returns the default filters for a process app.
     * @param appId ID of the target app
     * @returns Array of default filters just created
     */

    createDefaultFilters(appId: number): Observable<FilterRepresentationModel[]> {
        const involvedTasksFilter = this.getInvolvedTasksFilterInstance(appId, 1);
        const myTasksFilter = this.getMyTasksFilterInstance(appId, 0);
        const queuedTasksFilter = this.getQueuedTasksFilterInstance(appId, 2);
        const completedTasksFilter = this.getCompletedTasksFilterInstance(appId, 3);

        return forkJoin(
            this.addFilter(involvedTasksFilter),
            this.addFilter(myTasksFilter),
            this.addFilter(queuedTasksFilter),
            this.addFilter(completedTasksFilter)
        ).pipe(
            map(entries => {
                const result: FilterRepresentationModel[] = [];

                entries
                    .filter(entry => entry)
                    .forEach((filter) => {
                        if (filter.name === involvedTasksFilter.name) {
                            involvedTasksFilter.id = filter.id;
                            result.push(involvedTasksFilter);
                        } else if (filter.name === myTasksFilter.name) {
                            myTasksFilter.id = filter.id;
                            result.push(myTasksFilter);
                        } else if (filter.name === queuedTasksFilter.name) {
                            queuedTasksFilter.id = filter.id;
                            result.push(queuedTasksFilter);
                        } else if (filter.name === completedTasksFilter.name) {
                            completedTasksFilter.id = filter.id;
                            result.push(completedTasksFilter);
                        }
                    });

                return result;
            }),
            catchError(() => of([]))
        );
    }

    /**
     * Gets all task filters for a process app.
     * @param appId Optional ID for a specific app
     * @returns Array of task filter details
     */
    getTaskListFilters(appId?: number): Observable<FilterRepresentationModel[]> {
        return from(this.callApiTaskFilters(appId))
            .pipe(
                map((response: any) => {
                    const filters: FilterRepresentationModel[] = [];
                    response.data.forEach((filter: FilterRepresentationModel) => {
                        const filterModel = new FilterRepresentationModel(filter);
                        filters.push(filterModel);
                    });
                    return filters;
                }),
                catchError((err) => {
                    this.logService.error(err);
                    return of([]);
                })
            );
    }

    /**
     * Gets a task filter by ID.
     * @param filterId ID of the filter
     * @param appId ID of the app for the filter
     * @returns Details of task filter
     */
    getTaskFilterById(filterId: number, appId?: number): Observable<FilterRepresentationModel | null> {
        return from(this.callApiTaskFilters(appId)).pipe(
            map((response) => response.data.find((filter) => filter.id === filterId)),
            catchError((err) => {
                this.logService.error(err);
                return of(null);
            })
        );
    }

    /**
     * Gets a task filter by name.
     * @param taskName Name of the filter
     * @param appId ID of the app for the filter
     * @returns Details of task filter
     */
    getTaskFilterByName(taskName: string, appId?: number): Observable<FilterRepresentationModel | null> {
        return from(this.callApiTaskFilters(appId)).pipe(
            map((response) => response.data.find((filter) => filter.name === taskName)),
            catchError((err) => {
                this.logService.error(err);
                return of(null);
            })
        );
    }

    /**
     * Adds a new task filter
     * @param filter The new filter to add
     * @returns Details of task filter just added
     */
    addFilter(filter: FilterRepresentationModel): Observable<FilterRepresentationModel | null> {
        return from(this.userFiltersApi.createUserTaskFilter(filter))
            .pipe(
                catchError((err) => {
                    this.logService.error(err);
                    return of(null);
                })
            );
    }

    /**
     * Calls `getUserTaskFilters` from the Alfresco JS API.
     * @param appId ID of the target app
     * @returns List of task filters
     */
    callApiTaskFilters(appId?: number): Promise<any> {
        if (appId) {
            return this.userFiltersApi.getUserTaskFilters({appId: appId});
        } else {
            return this.userFiltersApi.getUserTaskFilters();
        }
    }

    /**
     * Creates and returns a filter for "My Tasks" task instances.
     * @param appId ID of the target app
     * @param index of the filter (optional)
     * @returns The newly created filter
     */
    getMyTasksFilterInstance(appId: number, index?: number): FilterRepresentationModel {
        return new FilterRepresentationModel({
            'name': 'My Tasks',
            'appId': appId,
            'recent': false,
            'icon': 'glyphicon-inbox',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'assignee'},
            index
        });
    }

    /**
     * Creates and returns a filter for "Involved" task instances.
     * @param appId ID of the target app
     * @param index of the filter (optional)
     * @returns The newly created filter
     */
    getInvolvedTasksFilterInstance(appId: number, index?: number): FilterRepresentationModel {
        return new FilterRepresentationModel({
            'name': 'Involved Tasks',
            'appId': appId,
            'recent': false,
            'icon': 'glyphicon-align-left',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'involved'},
            index
        });
    }

    /**
     * Creates and returns a filter for "Queued Tasks" task instances.
     * @param appId ID of the target app
     * @param index of the filter (optional)
     * @returns The newly created filter
     */
    getQueuedTasksFilterInstance(appId: number, index?: number): FilterRepresentationModel {
        return new FilterRepresentationModel({
            'name': 'Queued Tasks',
            'appId': appId,
            'recent': false,
            'icon': 'glyphicon-record',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'candidate'},
            index
        });
    }

    /**
     * Creates and returns a filter for "Completed" task instances.
     * @param appId ID of the target app
     * @param index of the filter (optional)
     * @returns The newly created filter
     */
    getCompletedTasksFilterInstance(appId: number, index?: number): FilterRepresentationModel {
        return new FilterRepresentationModel({
            'name': 'Completed Tasks',
            'appId': appId,
            'recent': true,
            'icon': 'glyphicon-ok-sign',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'completed', 'assignment': 'involved'},
            index
        });
    }
}
