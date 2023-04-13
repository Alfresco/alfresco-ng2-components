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

import { AlfrescoApiService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable, from, forkJoin, throwError } from 'rxjs';
import { FilterProcessRepresentationModel } from '../models/filter-process.model';
import { map, catchError } from 'rxjs/operators';
import {
    ResultListDataRepresentationUserProcessInstanceFilterRepresentation,
    UserFiltersApi
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

    constructor(private alfrescoApiService: AlfrescoApiService) {
    }

    /**
     * Gets all filters defined for a Process App.
     *
     * @param appId ID of the target app
     * @returns Array of filter details
     */
    getProcessFilters(appId: number): Observable<FilterProcessRepresentationModel[]> {
        return from(this.callApiProcessFilters(appId))
            .pipe(
                map((response) => {
                    const filters: FilterProcessRepresentationModel[] = [];
                    response.data.forEach((filter) => {
                        const filterModel = new FilterProcessRepresentationModel(filter);
                        filters.push(filterModel);
                    });
                    return filters;
                }),
                catchError((err) => this.handleProcessError(err))
            );
    }

    /**
     * Retrieves the process filter by ID.
     *
     * @param filterId ID of the filter
     * @param appId ID of the target app
     * @returns Details of the filter
     */
    getProcessFilterById(filterId: number, appId?: number): Observable<FilterProcessRepresentationModel> {
        return from(this.callApiProcessFilters(appId))
            .pipe(
                map((response: any) => response.data.find((filter) => filter.id === filterId)),
                catchError((err) => this.handleProcessError(err))
            );
    }

    /**
     * Retrieves the process filter by name.
     *
     * @param filterName Name of the filter
     * @param appId ID of the target app
     * @returns Details of the filter
     */
    getProcessFilterByName(filterName: string, appId?: number): Observable<FilterProcessRepresentationModel> {
        return from(this.callApiProcessFilters(appId))
            .pipe(
                map((response: any) => response.data.find((filter) => filter.name === filterName)),
                catchError((err) => this.handleProcessError(err))
            );
    }

    /**
     * Creates and returns the default filters for an app.
     *
     * @param appId ID of the target app
     * @returns Default filters just created
     */
    createDefaultFilters(appId: number): Observable<FilterProcessRepresentationModel[]> {
        const runningFilter = this.getRunningFilterInstance(appId, 0);
        const runningObservable = this.addProcessFilter(runningFilter);

        const completedFilter = this.getCompletedFilterInstance(appId, 1);
        const completedObservable = this.addProcessFilter(completedFilter);

        const allFilter = this.getAllFilterInstance(appId, 2);
        const allObservable = this.addProcessFilter(allFilter);

        return new Observable((observer) => {
            forkJoin([
                    runningObservable,
                    completedObservable,
                    allObservable
                ]
            ).subscribe(
                (res) => {
                    const filters: FilterProcessRepresentationModel[] = [];
                    res.forEach((filter) => {
                        if (filter.name === runningFilter.name) {
                            filters.push(new FilterProcessRepresentationModel({ ...filter, filter: runningFilter.filter, appId }));
                        } else if (filter.name === completedFilter.name) {
                            filters.push(new FilterProcessRepresentationModel({ ...filter, filter: completedFilter.filter, appId }));
                        } else if (filter.name === allFilter.name) {
                            filters.push(new FilterProcessRepresentationModel({ ...filter, filter: allFilter.filter, appId }));
                        }
                    });
                    observer.next(filters);
                    observer.complete();
                },
                (err: any) => {
                    this.handleProcessError(err);
                });
        });
    }

    /**
     * Creates and returns a filter that matches "running" process instances.
     *
     * @param appId ID of the target app
     * @param index of the filter (optional)
     * @returns Filter just created
     */
    getRunningFilterInstance(appId: number, index?: number): FilterProcessRepresentationModel {
        return new FilterProcessRepresentationModel({
            name: 'Running',
            appId,
            recent: true,
            icon: 'glyphicon-random',
            filter: { sort: 'created-desc', name: '', state: 'running' },
            index
        });
    }

    /**
     * Adds a filter.
     *
     * @param filter The filter to add
     * @returns The filter just added
     */
    addProcessFilter(filter: FilterProcessRepresentationModel): Observable<FilterProcessRepresentationModel> {
        return from(this.userFiltersApi.createUserProcessInstanceFilter(filter))
            .pipe(
                map((response: FilterProcessRepresentationModel) => response),
                catchError((err) => this.handleProcessError(err))
            );
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

    private getCompletedFilterInstance(appId: number, index?: number): FilterProcessRepresentationModel {
        return new FilterProcessRepresentationModel({
            name: 'Completed',
            appId,
            recent: false,
            icon: 'glyphicon-ok-sign',
            filter: { sort: 'created-desc', name: '', state: 'completed' },
            index
        });
    }

    private getAllFilterInstance(appId: number, index?: number): FilterProcessRepresentationModel {
        return new FilterProcessRepresentationModel({
            name: 'All',
            appId,
            recent: true,
            icon: 'glyphicon-th',
            filter: { sort: 'created-desc', name: '', state: 'all' },
            index
        });
    }

    private handleProcessError(error: any) {
        return throwError(error || 'Server error');
    }
}
