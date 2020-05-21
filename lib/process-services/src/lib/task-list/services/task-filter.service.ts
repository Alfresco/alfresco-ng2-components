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
import { Observable, forkJoin, from, throwError } from 'rxjs';
import { FilterRepresentationModel } from '../models/filter.model';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TaskFilterService {

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    /**
     * Creates and returns the default filters for a process app.
     * @param appId ID of the target app
     * @returns Array of default filters just created
     */
    public createDefaultFilters(appId: number): Observable<FilterRepresentationModel[]> {
        const myTasksFilter = this.getMyTasksFilterInstance(appId);
        const myTaskObservable = this.addFilter(myTasksFilter);

        const involvedTasksFilter = this.getInvolvedTasksFilterInstance(appId);
        const involvedObservable = this.addFilter(involvedTasksFilter);

        const queuedTasksFilter = this.getQueuedTasksFilterInstance(appId);
        const queuedObservable = this.addFilter(queuedTasksFilter);

        const completedTasksFilter = this.getCompletedTasksFilterInstance(appId);
        const completeObservable = this.addFilter(completedTasksFilter);

        return new Observable((observer) => {
            forkJoin([
                    myTaskObservable,
                    involvedObservable,
                    queuedObservable,
                    completeObservable
                ]
            ).subscribe(
                (res) => {
                    const filters: FilterRepresentationModel[] = [];
                    res.forEach((filter) => {
                        if (filter.name === involvedTasksFilter.name) {
                            involvedTasksFilter.id = filter.id;
                            filters.push(involvedTasksFilter);
                        } else if (filter.name === myTasksFilter.name) {
                            myTasksFilter.id = filter.id;
                            filters.push(myTasksFilter);
                        } else if (filter.name === queuedTasksFilter.name) {
                            queuedTasksFilter.id = filter.id;
                            filters.push(queuedTasksFilter);
                        } else if (filter.name === completedTasksFilter.name) {
                            completedTasksFilter.id = filter.id;
                            filters.push(completedTasksFilter);
                        }
                    });
                    observer.next(filters);
                    observer.complete();
                },
                (err: any) => {
                    this.logService.error(err);
                });
        });
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
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets a task filter by ID.
     * @param filterId ID of the filter
     * @param appId ID of the app for the filter
     * @returns Details of task filter
     */
    getTaskFilterById(filterId: number, appId?: number): Observable<FilterRepresentationModel> {
        return from(this.callApiTaskFilters(appId)).pipe(
            map((response) => response.data.find((filter) => filter.id === filterId)),
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Gets a task filter by name.
     * @param taskName Name of the filter
     * @param appId ID of the app for the filter
     * @returns Details of task filter
     */
    getTaskFilterByName(taskName: string, appId?: number): Observable<FilterRepresentationModel> {
        return from(this.callApiTaskFilters(appId)).pipe(
            map((response) => response.data.find((filter) => filter.name === taskName)),
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Adds a new task filter
     * @param filter The new filter to add
     * @returns Details of task filter just added
     */
    addFilter(filter: FilterRepresentationModel): Observable<FilterRepresentationModel> {
        return from(this.apiService.getInstance().activiti.userFiltersApi.createUserTaskFilter(filter))
            .pipe(
                map((response: FilterRepresentationModel) => {
                    return response;
                }),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Calls `getUserTaskFilters` from the Alfresco JS API.
     * @param appId ID of the target app
     * @returns List of task filters
     */
    callApiTaskFilters(appId?: number): Promise<any> {
        if (appId) {
            return this.apiService.getInstance().activiti.userFiltersApi.getUserTaskFilters({appId: appId});
        } else {
            return this.apiService.getInstance().activiti.userFiltersApi.getUserTaskFilters();
        }
    }

    /**
     * Creates and returns a filter for "My Tasks" task instances.
     * @param appId ID of the target app
     * @returns The newly created filter
     */
    getMyTasksFilterInstance(appId: number): FilterRepresentationModel {
        return new FilterRepresentationModel({
            'name': 'My Tasks',
            'appId': appId,
            'recent': false,
            'icon': 'glyphicon-inbox',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'assignee'},
            'index': 0
        });
    }

    /**
     * Creates and returns a filter for "Involved" task instances.
     * @param appId ID of the target app
     * @returns The newly created filter
     */
    getInvolvedTasksFilterInstance(appId: number): FilterRepresentationModel {
        return new FilterRepresentationModel({
            'name': 'Involved Tasks',
            'appId': appId,
            'recent': false,
            'icon': 'glyphicon-align-left',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'involved'},
            'index': 1
        });
    }

    /**
     * Creates and returns a filter for "Queued Tasks" task instances.
     * @param appId ID of the target app
     * @returns The newly created filter
     */
    getQueuedTasksFilterInstance(appId: number): FilterRepresentationModel {
        return new FilterRepresentationModel({
            'name': 'Queued Tasks',
            'appId': appId,
            'recent': false,
            'icon': 'glyphicon-record',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'candidate'},
            'index': 2
        });
    }

    /**
     * Creates and returns a filter for "Completed" task instances.
     * @param appId ID of the target app
     * @returns The newly created filter
     */
    getCompletedTasksFilterInstance(appId: number): FilterRepresentationModel {
        return new FilterRepresentationModel({
            'name': 'Completed Tasks',
            'appId': appId,
            'recent': true,
            'icon': 'glyphicon-ok-sign',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'completed', 'assignment': 'involved'},
            'index': 3
        });
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }

}
