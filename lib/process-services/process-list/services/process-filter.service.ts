/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

@Injectable({
    providedIn: 'root'
})
export class ProcessFilterService {

    constructor(private alfrescoApiService: AlfrescoApiService) {
    }

    /**
     * Gets all filters defined for a Process App.
     * @param appId ID of the target app
     * @returns Array of filter details
     */
    getProcessFilters(appId: number): Observable<FilterProcessRepresentationModel[]> {
        return from(this.callApiProcessFilters(appId))
            .pipe(
                map((response: any) => {
                    let filters: FilterProcessRepresentationModel[] = [];
                    response.data.forEach((filter: FilterProcessRepresentationModel) => {
                        let filterModel = new FilterProcessRepresentationModel(filter);
                        filters.push(filterModel);
                    });
                    return filters;
                }),
                catchError(err => this.handleProcessError(err))
            );
    }

    /**
     * Retrieves the process filter by ID.
     * @param filterId ID of the filter
     * @param appId ID of the target app
     * @returns Details of the filter
     */
    getProcessFilterById(filterId: number, appId?: number): Observable<FilterProcessRepresentationModel> {
        return from(this.callApiProcessFilters(appId))
            .pipe(
                map((response: any) => {
                    return response.data.find(filter => filter.id === filterId);
                }),
                catchError(err => this.handleProcessError(err))
            );
    }

    /**
     * Retrieves the process filter by name.
     * @param filterName Name of the filter
     * @param appId ID of the target app
     * @returns Details of the filter
     */
    getProcessFilterByName(filterName: string, appId?: number): Observable<FilterProcessRepresentationModel> {
        return from(this.callApiProcessFilters(appId))
            .pipe(
                map((response: any) => {
                    return response.data.find(filter => filter.name === filterName);
                }),
                catchError(err => this.handleProcessError(err))
            );
    }

    /**
     * Creates and returns the default filters for an app.
     * @param appId ID of the target app
     * @returns Default filters just created
     */
    public createDefaultFilters(appId: number): Observable<FilterProcessRepresentationModel[]> {
        let runningFilter = this.getRunningFilterInstance(appId);
        let runningObservable = this.addProcessFilter(runningFilter);

        let completedFilter = this.getCompletedFilterInstance(appId);
        let completedObservable = this.addProcessFilter(completedFilter);

        let allFilter = this.getAllFilterInstance(appId);
        let allObservable = this.addProcessFilter(allFilter);

        return new Observable(observer => {
            forkJoin(
                runningObservable,
                completedObservable,
                allObservable
            ).subscribe(
                (res) => {
                    let filters: FilterProcessRepresentationModel[] = [];
                    res.forEach((filter) => {
                        if (filter.name === runningFilter.name) {
                            runningFilter.id = filter.id;
                            filters.push(runningFilter);
                        } else if (filter.name === completedFilter.name) {
                            completedFilter.id = filter.id;
                            filters.push(completedFilter);
                        } else if (filter.name === allFilter.name) {
                            allFilter.id = filter.id;
                            filters.push(allFilter);
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
     * @param appId ID of the target app
     * @returns Filter just created
     */
    public getRunningFilterInstance(appId: number): FilterProcessRepresentationModel {
        return new FilterProcessRepresentationModel({
            'name': 'Running',
            'appId': appId,
            'recent': true,
            'icon': 'glyphicon-random',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
        });
    }

    /**
     * Returns a static Completed filter instance.
     * @param appId ID of the target app
     * @returns Details of the filter
     */
    private getCompletedFilterInstance(appId: number): FilterProcessRepresentationModel {
        return new FilterProcessRepresentationModel({
            'name': 'Completed',
            'appId': appId,
            'recent': false,
            'icon': 'glyphicon-ok-sign',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'completed' }
        });
    }

    /**
     * Returns a static All filter instance.
     * @param appId ID of the target app
     * @returns Details of the filter
     */
    private getAllFilterInstance(appId: number): FilterProcessRepresentationModel {
        return new FilterProcessRepresentationModel({
            'name': 'All',
            'appId': appId,
            'recent': true,
            'icon': 'glyphicon-th',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'all' }
        });
    }

    /**
     * Adds a filter.
     * @param filter The filter to add
     * @returns The filter just added
     */
    addProcessFilter(filter: FilterProcessRepresentationModel): Observable<FilterProcessRepresentationModel> {
        return from(this.alfrescoApiService.getInstance().activiti.userFiltersApi.createUserProcessInstanceFilter(filter))
            .pipe(
                map((response: FilterProcessRepresentationModel) => {
                    return response;
                }),
                catchError(err => this.handleProcessError(err))
            );
    }

    /**
     * Calls `getUserProcessInstanceFilters` from the Alfresco JS API.
     * @param appId ID of the target app
     * @returns List of filter details
     */
    callApiProcessFilters(appId?: number) {
        if (appId) {
            return this.alfrescoApiService.getInstance().activiti.userFiltersApi.getUserProcessInstanceFilters({ appId: appId });
        } else {
            return this.alfrescoApiService.getInstance().activiti.userFiltersApi.getUserProcessInstanceFilters();
        }
    }

    private handleProcessError(error: any) {
        return throwError(error || 'Server error');
    }
}
