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

import { LogService, StorageService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { FilterRepresentationModel } from '../models/filter.model';

@Injectable()
export class TaskFilterService {

    constructor(private logService: LogService,
                private storage: StorageService) {
    }

    /**
     * Creates and returns the default filters for a process app.
     * @param appId ID of the target app
     * @returns Array of default filters just created
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
            forkJoin(
                involvedObservable,
                myTaskObservable,
                queuedObservable,
                completeObservable
            ).subscribe(
                (res) => {
                    let filters: FilterRepresentationModel[] = [];
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
        let key = 'task-filters-' + appId;
        const filters = JSON.parse(this.storage.getItem(key) || '[]');
        return Observable.create(function(observer) {
            observer.next(filters);
            observer.complete();
        });
    }

    /**
     * Adds a new task filter
     * @param filter The new filter to add
     * @returns Details of task filter just added
     */
    addFilter(filter: FilterRepresentationModel): Observable<FilterRepresentationModel> {
        const key = 'task-filters-' + filter.appId;
        let filters = JSON.parse(this.storage.getItem(key) || '[]');

        filters.push(filter);

        this.storage.setItem(key, JSON.stringify(filters));

        return Observable.create(function(observer) {
            observer.next(filter);
            observer.complete();
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
            'icon': 'view_headline',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'involved'}
        });
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
            'icon': 'inbox',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'assignee'}
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
            'icon': 'adjust',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'candidate'}
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
            'icon': 'done',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'completed', 'assignment': 'involved'}
        });
    }
}
