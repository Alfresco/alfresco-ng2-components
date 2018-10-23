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
import { FilterRepresentationModel, QueryModel } from '../models/filter-cloud.model';

@Injectable()
export class TaskFilterCloudService {

    constructor(private logService: LogService,
                private storage: StorageService) {
    }

    /**
     * Creates and returns the default filters for a process app.
     * @param appName Name of the target app
     * @returns Observable of default filters just created
     */
    public createDefaultFilters(appName: string): Observable<FilterRepresentationModel[]> {
        let involvedTasksFilter = this.getInvolvedTasksFilterInstance(appName);
        let involvedObservable = this.addFilter(involvedTasksFilter);

        let myTasksFilter = this.getMyTasksFilterInstance(appName);
        let myTaskObservable = this.addFilter(myTasksFilter);

        let queuedTasksFilter = this.getQueuedTasksFilterInstance(appName);
        let queuedObservable = this.addFilter(queuedTasksFilter);

        let completedTasksFilter = this.getCompletedTasksFilterInstance(appName);
        let completeObservable = this.addFilter(completedTasksFilter);

        return new Observable(observer => {
            forkJoin(
                involvedObservable,
                myTaskObservable,
                queuedObservable,
                completeObservable
            ).subscribe(
                (filters) => {
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
     * @param appName Name of the target app
     * @returns Observable of task filter details
     */
    getTaskListFilters(appName?: string): Observable<FilterRepresentationModel[]> {
        let key = 'task-filters-' + appName;
        const filters = JSON.parse(this.storage.getItem(key) || '[]');
        return new Observable(function(observer) {
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
        const key = 'task-filters-' + filter.query.appName || '0';
        let filters = JSON.parse(this.storage.getItem(key) || '[]');

        filters.push(filter);

        this.storage.setItem(key, JSON.stringify(filters));

        return new Observable(function(observer) {
            observer.next(filter);
            observer.complete();
        });
    }

    /**
     * Creates and returns a filter for "Involved" task instances.
     * @param appName Name of the target app
     * @returns The newly created filter
     */
    getInvolvedTasksFilterInstance(appName: string): FilterRepresentationModel {
        return new FilterRepresentationModel({
            name: 'Cancelled Tasks',
            icon: 'view_headline',
            query: new QueryModel(
                {
                    appName: appName,
                    sort: 'id',
                    state: 'CANCELLED',
                    assignment: 'involved',
                    order: 'DESC'
                }
            )
        });
    }

    /**
     * Creates and returns a filter for "My Tasks" task instances.
     * @param appName Name of the target app
     * @returns The newly created filter
     */
    getMyTasksFilterInstance(appName: string): FilterRepresentationModel {
        return new FilterRepresentationModel({
            name: 'My Tasks',
            icon: 'inbox',
            query: new QueryModel(
                {
                    appName: appName,
                    sort: 'id',
                    state: 'CREATED',
                    assignment: 'assignee',
                    order: 'ASC'
                }
            )
        });
    }

    /**
     * Creates and returns a filter for "Queued Tasks" task instances.
     * @param appName Name of the target app
     * @returns The newly created filter
     */
    getQueuedTasksFilterInstance(appName: string): FilterRepresentationModel {
        return new FilterRepresentationModel({
            name: 'Suspended Tasks',
            icon: 'adjust',
            query: new QueryModel(
                {
                    appName: appName,
                    sort: 'createdDate',
                    state: 'SUSPENDED',
                    assignment: 'candidate',
                    order: 'DESC'
                }
            )
        });
    }

    /**
     * Creates and returns a filter for "Completed" task instances.
     * @param appName Name of the target app
     * @returns The newly created filter
     */
    getCompletedTasksFilterInstance(appName: string): FilterRepresentationModel {
        return new FilterRepresentationModel({
            name: 'Completed Tasks',
            icon: 'done',
            query: new QueryModel(
                {
                    appName: appName,
                    sort: 'createdDate',
                    state: 'COMPLETED',
                    assignment: 'involved',
                    order: 'ASC'
                }
            )
        });
    }
}
