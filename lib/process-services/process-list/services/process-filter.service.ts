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
import { Observable } from 'rxjs/Observable';
import { FilterProcessRepresentationModel } from '../models/filter-process.model';
import 'rxjs/add/observable/throw';

@Injectable()
export class ProcessFilterService {

    constructor(private alfrescoApiService: AlfrescoApiService) {
    }

    getProcessFilters(appId: number): Observable<FilterProcessRepresentationModel[]> {
        return Observable.fromPromise(this.callApiProcessFilters(appId))
            .map((response: any) => {
                let filters: FilterProcessRepresentationModel[] = [];
                response.data.forEach((filter: FilterProcessRepresentationModel) => {
                    let filterModel = new FilterProcessRepresentationModel(filter);
                    filters.push(filterModel);
                });
                return filters;
            })
            .catch(err => this.handleProcessError(err));
    }

    /**
     * Retrieve the process filter by id
     * @param filterId - number - The id of the filter
     * @param appId - string - optional - The id of app
     * @returns {Observable<FilterProcessRepresentationModel>}
     */
    getProcessFilterById(filterId: number, appId?: number): Observable<FilterProcessRepresentationModel> {
        return Observable.fromPromise(this.callApiProcessFilters(appId))
            .map((response: any) => {
                return response.data.find(filter => filter.id === filterId);
            }).catch(err => this.handleProcessError(err));
    }

    /**
     * Retrieve the process filter by name
     * @param filterName - string - The name of the filter
     * @param appId - string - optional - The id of app
     * @returns {Observable<FilterProcessRepresentationModel>}
     */
    getProcessFilterByName(filterName: string, appId?: number): Observable<FilterProcessRepresentationModel> {
        return Observable.fromPromise(this.callApiProcessFilters(appId))
            .map((response: any) => {
                return response.data.find(filter => filter.name === filterName);
            }).catch(err => this.handleProcessError(err));
    }

    /**
     * Create and return the default filters
     * @param appId
     * @returns {FilterProcessRepresentationModel[]}
     */
    public createDefaultFilters(appId: number): Observable<FilterProcessRepresentationModel[]> {
        let runningFilter = this.getRunningFilterInstance(appId);
        let runningObservable = this.addProcessFilter(runningFilter);

        let completedFilter = this.getCompletedFilterInstance(appId);
        let completedObservable = this.addProcessFilter(completedFilter);

        let allFilter = this.getAllFilterInstance(appId);
        let allObservable = this.addProcessFilter(allFilter);

        return Observable.create(observer => {
            Observable.forkJoin(
                runningObservable,
                completedObservable,
                allObservable
            ).subscribe(
                (res) => {
                    let filters: FilterProcessRepresentationModel[] = [];
                    res.forEach((filter) => {
                        if (filter.name === runningFilter.name) {
                            filters.push(runningFilter);
                        } else if (filter.name === completedFilter.name) {
                            filters.push(completedFilter);
                        } else if (filter.name === allFilter.name) {
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
     * Return a static Completed filter instance
     * @param appId
     * @returns {FilterProcessRepresentationModel}
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
     * Return a static All filter instance
     * @param appId
     * @returns {FilterProcessRepresentationModel}
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
     * Add a filter
     * @param filter - FilterProcessRepresentationModel
     * @returns {FilterProcessRepresentationModel}
     */
    addProcessFilter(filter: FilterProcessRepresentationModel): Observable<FilterProcessRepresentationModel> {
        return Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.userFiltersApi.createUserProcessInstanceFilter(filter))
            .map(res => res)
            .map((response: FilterProcessRepresentationModel) => {
                return response;
            }).catch(err => this.handleProcessError(err));
    }

    callApiProcessFilters(appId?: number) {
        if (appId) {
            return this.alfrescoApiService.getInstance().activiti.userFiltersApi.getUserProcessInstanceFilters({ appId: appId });
        } else {
            return this.alfrescoApiService.getInstance().activiti.userFiltersApi.getUserProcessInstanceFilters();
        }
    }

    private handleProcessError(error: any) {
        return Observable.throw(error || 'Server error');
    }
}
