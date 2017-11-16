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

import { AlfrescoApiService, LogService } from '@alfresco/core';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { FilterRepresentationModel } from '../models/filter.model';
import { TaskListModel } from '../models/task-list.model';

@Injectable()
export class TaskFilterService {
    private tasksListSubject = new Subject<TaskListModel>();

    public tasksList$: Observable<TaskListModel>;

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
        this.tasksList$ = this.tasksListSubject.asObservable();
    }

    /**
     * Create and return the default filters
     * @param appId
     * @returns {FilterRepresentationModel[]}
     */
    public createDefaultFilters(appId: number): Observable<FilterRepresentationModel[]> {
        let involvedTasksFilter = this.getInvolvedTasksFilterInstance(appId);
        let involvedObservable = this.addFilter(involvedTasksFilter);

        let myTasksFilter = this.getMyTasksFilterInstance(appId);
        let myTaskObservable = this.addFilter(myTasksFilter);

        let queuedTasksFilter = this.getQueuedTasksFilterInstance(appId);
        let queuedObservable = this.addFilter(queuedTasksFilter);

        let completedTasksFilter = this.getCompletedTasksFilterInstance(appId);
        let completeObservable = this.addFilter(completedTasksFilter);

        return Observable.create(observer => {
            Observable.forkJoin(
                involvedObservable,
                myTaskObservable,
                queuedObservable,
                completeObservable
            ).subscribe(
                (res) => {
                    let filters: FilterRepresentationModel[] = [];
                    res.forEach((filter) => {
                        if (filter.name === involvedTasksFilter.name) {
                            filters.push(involvedTasksFilter);
                        } else if (filter.name === myTasksFilter.name) {
                            filters.push(myTasksFilter);
                        } else if (filter.name === queuedTasksFilter.name) {
                            filters.push(queuedTasksFilter);
                        } else if (filter.name === completedTasksFilter.name) {
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
     * Retrieve all the Tasks filters
     * @returns {Observable<any>}
     */
    getTaskListFilters(appId?: number): Observable<any> {
        return Observable.fromPromise(this.callApiTaskFilters(appId))
            .map((response: any) => {
                let filters: FilterRepresentationModel[] = [];
                response.data.forEach((filter: FilterRepresentationModel) => {
                    let filterModel = new FilterRepresentationModel(filter);
                    filters.push(filterModel);
                });
                return filters;
            }).catch(err => this.handleError(err));
    }

    /**
     * Retrieve the Tasks filter by id
     * @param filterId - number - The id of the filter
     * @param appId - string - optional - The id of app
     * @returns {Observable<FilterRepresentationModel>}
     */
    getTaskFilterById(filterId: number, appId?: number): Observable<FilterRepresentationModel> {
        return Observable.fromPromise(this.callApiTaskFilters(appId))
            .map((response: any) => {
                return response.data.find(filter => filter.id === filterId);
            }).catch(err => this.handleError(err));
    }

    /**
     * Retrieve the Tasks filter by name
     * @param taskName - string - The name of the filter
     * @returns {Observable<FilterRepresentationModel>}
     */
    getTaskFilterByName(taskName: string, appId?: number): Observable<FilterRepresentationModel> {
        return Observable.fromPromise(this.callApiTaskFilters(appId))
            .map((response: any) => {
                return response.data.find(filter => filter.name === taskName);
            }).catch(err => this.handleError(err));
    }

    /**
     * Add a filter
     * @param filter - FilterRepresentationModel
     * @returns {FilterRepresentationModel}
     */
    addFilter(filter: FilterRepresentationModel): Observable<FilterRepresentationModel> {
        return Observable.fromPromise(this.callApiAddFilter(filter))
            .map(res => res)
            .map((response: FilterRepresentationModel) => {
                return response;
            }).catch(err => this.handleError(err));
    }

    private callApiAddFilter(filter: FilterRepresentationModel) {
        return this.apiService.getInstance().activiti.userFiltersApi.createUserTaskFilter(filter).catch(err => this.handleError(err));
    }

    callApiTaskFilters(appId?: number) {
        if (appId) {
            return this.apiService.getInstance().activiti.userFiltersApi.getUserTaskFilters({appId: appId}).catch(err => this.handleError(err));
        } else {
            return this.apiService.getInstance().activiti.userFiltersApi.getUserTaskFilters().catch(err => this.handleError(err));
        }
    }

    /**
     * Return a static Involved filter instance
     * @param appId
     * @returns {FilterRepresentationModel}
     */
    getInvolvedTasksFilterInstance(appId: number): FilterRepresentationModel {
        return new FilterRepresentationModel({
            'name': 'Involved Tasks',
            'appId': appId,
            'recent': false,
            'icon': 'glyphicon-align-left',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'involved'}
        });
    }

    /**
     * Return a static My task filter instance
     * @param appId
     * @returns {FilterRepresentationModel}
     */
    getMyTasksFilterInstance(appId: number): FilterRepresentationModel {
        return new FilterRepresentationModel({
            'name': 'My Tasks',
            'appId': appId,
            'recent': false,
            'icon': 'glyphicon-inbox',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'assignee'}
        });
    }

    /**
     * Return a static Queued filter instance
     * @param appId
     * @returns {FilterRepresentationModel}
     */
    getQueuedTasksFilterInstance(appId: number): FilterRepresentationModel {
        return new FilterRepresentationModel({
            'name': 'Queued Tasks',
            'appId': appId,
            'recent': false,
            'icon': 'glyphicon-record',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'candidate'}
        });
    }

    /**
     * Return a static Completed filter instance
     * @param appId
     * @returns {FilterRepresentationModel}
     */
    getCompletedTasksFilterInstance(appId: number): FilterRepresentationModel {
        return new FilterRepresentationModel({
            'name': 'Completed Tasks',
            'appId': appId,
            'recent': true,
            'icon': 'glyphicon-ok-sign',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'completed', 'assignment': 'involved'}
        });
    }

    private handleError(error: any) {
        this.logService.error(error);
        this.tasksListSubject.error(error);
        return Observable.throw(error || 'Server error');
    }

}
