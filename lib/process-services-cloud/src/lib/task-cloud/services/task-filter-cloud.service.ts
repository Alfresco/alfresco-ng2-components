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

import { StorageService, JwtHelperService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskFilterCloudRepresentationModel, QueryModel } from '../models/filter-cloud.model';

@Injectable()
export class TaskFilterCloudService {

    constructor(private storage: StorageService, private jwtService: JwtHelperService) {
    }

    /**
     * Creates and returns the default filters for a process app.
     * @param appName Name of the target app
     * @returns Observable of default filters just created
     */
    public createDefaultFilters(appName: string): Observable<TaskFilterCloudRepresentationModel[]> {
        let myTasksFilter = this.getMyTasksFilterInstance(appName);
        this.addFilter(myTasksFilter);

        let completedTasksFilter = this.getCompletedTasksFilterInstance(appName);
        this.addFilter(completedTasksFilter);

        return this.getTaskListFilters(appName);
    }

    /**
     * Gets all task filters for a process app.
     * @param appName Name of the target app
     * @returns Observable of task filter details
     */
    getTaskListFilters(appName?: string): Observable<TaskFilterCloudRepresentationModel[]> {
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
    addFilter(filter: TaskFilterCloudRepresentationModel): Observable<TaskFilterCloudRepresentationModel> {
        const key = 'task-filters-' + filter.query.appName || '0';
        let filters = JSON.parse(this.storage.getItem(key) || '[]');

        filters.push(filter);

        this.storage.setItem(key, JSON.stringify(filters));

        return new Observable(function(observer) {
            observer.next(filter);
            observer.complete();
        });
    }

    getUsername(): string {
        return this.getValueFromToken<string>('preferred_username');
    }

    getValueFromToken<T>(key: string): T {
        let value;
        const token = localStorage.getItem('access_token');
        if (token) {
            const tokenPayload = this.jwtService.decodeToken(token);
            value = tokenPayload[key];
        }
        return <T> value;
    }

    /**
     * Creates and returns a filter for "My Tasks" task instances.
     * @param appName Name of the target app
     * @returns The newly created filter
     */
    getMyTasksFilterInstance(appName: string): TaskFilterCloudRepresentationModel {
        const username = this.getUsername();
        return new TaskFilterCloudRepresentationModel({
            id: Math.random().toString(36).substr(2, 9),
            name: 'My Tasks',
            icon: 'inbox',
            query: new QueryModel(
                {
                    appName: appName,
                    state: 'ASSIGNED',
                    assignment: username,
                    sort: 'id',
                    order: 'ASC'
                }
            )
        });
    }

    /**
     * Creates and returns a filter for "Completed" task instances.
     * @param appName Name of the target app
     * @returns The newly created filter
     */
    getCompletedTasksFilterInstance(appName: string): TaskFilterCloudRepresentationModel {
        return new TaskFilterCloudRepresentationModel({
            id: Math.random().toString(36).substr(2, 9),
            name: 'Completed Tasks',
            icon: 'done',
            query: new QueryModel(
                {
                    appName: appName,
                    state: 'COMPLETED',
                    assignment: '',
                    sort: 'id',
                    order: 'ASC'
                }
            )
        });
    }
}
