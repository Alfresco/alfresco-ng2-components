/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable, Inject } from '@angular/core';
import { Observable, of, BehaviorSubject, throwError, Subject } from 'rxjs';
import { TaskFilterCloudModel } from '../models/filter-cloud.model';
import { switchMap, map } from 'rxjs/operators';
import { BaseCloudService } from '../../../services/base-cloud.service';
import { PreferenceCloudServiceInterface } from '../../../services/preference-cloud.interface';
import { TASK_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { TaskCloudNodePaging } from '../../../models/task-cloud.model';
import { NotificationCloudService } from '../../../services/notification-cloud.service';
import { TaskCloudEngineEvent } from '../../../models/engine-event-cloud.model';
import { IdentityUserService } from '../../../people/services/identity-user.service';
import { AdfHttpClient } from '@alfresco/adf-core/api';

const TASK_EVENT_SUBSCRIPTION_QUERY = `
    subscription {
        engineEvents(eventType: [
            TASK_COMPLETED
            TASK_ASSIGNED
            TASK_ACTIVATED
            TASK_SUSPENDED
            TASK_CANCELLED,
            TASK_CREATED
        ]) {
            eventType
            entity
        }
    }
`;

@Injectable({
    providedIn: 'root'
})
export class TaskFilterCloudService extends BaseCloudService {
    private filtersSubject = new BehaviorSubject<TaskFilterCloudModel[]>([]);
    filters$ = this.filtersSubject.asObservable();
    private filterKeyToBeRefreshedSource = new Subject<string>();
    filterKeyToBeRefreshed$ = this.filterKeyToBeRefreshedSource.asObservable();

    constructor(
        private identityUserService: IdentityUserService,
        @Inject(TASK_FILTERS_SERVICE_TOKEN)
        public preferenceService: PreferenceCloudServiceInterface,
        private notificationCloudService: NotificationCloudService,
        adfHttpClient: AdfHttpClient
    ) {
        super(adfHttpClient);
    }

    /**
     * Creates and returns the default task filters for an app.
     *
     * @param appName Name of the target app
     */
    private createDefaultFilters(appName: string): void {
        const key: string = this.prepareKey(appName);
        this.preferenceService
            .getPreferences(appName, key)
            .pipe(
                switchMap((response) => {
                    const preferences = response?.list?.entries || [];
                    if (!this.hasPreferences(preferences) || !this.hasTaskFilters(preferences, key)) {
                        return this.createTaskFilters(appName, key, this.defaultTaskFilters(appName));
                    } else {
                        return of(this.findFiltersByKeyInPreferences(preferences, key));
                    }
                }),
                switchMap((filters) => this.handleCreateFilterBackwardsCompatibility(appName, key, filters))
            )
            .subscribe((filters) => {
                this.addFiltersToStream(filters);
            });
    }

    /**
     * Checks user preference are empty or not
     *
     * @param preferences User preferences of the target app
     * @returns Boolean value if the preferences are not empty
     */
    private hasPreferences(preferences: any): boolean {
        return preferences && preferences.length > 0;
    }

    /**
     * Checks for task filters in given user preferences
     *
     * @param preferences User preferences of the target app
     * @param key Key of the task filters
     * @returns Boolean value if the preference has task filters
     */
    private hasTaskFilters(preferences: any, key: string): boolean {
        const filters = preferences.find((filter: any) => filter.entry.key === key);
        return filters?.entry ? JSON.parse(filters.entry.value).length > 0 : false;
    }

    /**
     * Calls create preference api to create task filters
     *
     * @param appName Name of the target app
     * @param key Key of the task instance filters
     * @param filters Details of new task filter
     * @returns Observable of created task filters
     */
    private createTaskFilters(appName: string, key: string, filters: TaskFilterCloudModel[]): Observable<TaskFilterCloudModel[]> {
        return this.preferenceService.createPreference(appName, key, filters);
    }

    /**
     * Calls get preference api to get task filter by preference key
     *
     * @param appName Name of the target app
     * @param key Key of the task filters
     * @returns Observable of task filters
     */
    private getTaskFiltersByKey(appName: string, key: string): Observable<TaskFilterCloudModel[]> {
        return this.preferenceService.getPreferenceByKey(appName, key);
    }

    /**
     * Gets all task filters for a task app.
     *
     * @param appName Name of the target app
     * @returns Observable of task filter details
     */
    getTaskListFilters(appName?: string): Observable<TaskFilterCloudModel[]> {
        this.createDefaultFilters(appName);
        return this.filters$;
    }

    /**
     * Gets a task filter.
     *
     * @param appName Name of the target app
     * @param id ID of the task
     * @returns Details of the task filter
     */
    getTaskFilterById(appName: string, id: string): Observable<TaskFilterCloudModel> {
        const key: string = this.prepareKey(appName);
        return this.getTaskFiltersByKey(appName, key).pipe(
            switchMap((filters) => {
                if (filters && filters.length === 0) {
                    return this.createTaskFilters(appName, key, this.defaultTaskFilters(appName));
                } else {
                    return of(filters);
                }
            }),
            map((filters) => filters.filter((filter) => filter.id === id)[0])
        );
    }

    /**
     * Adds a new task filter.
     *
     * @param newFilter The new filter to add
     * @returns Observable of task instance filters with newly added filter
     */
    addFilter(newFilter: TaskFilterCloudModel): Observable<TaskFilterCloudModel[]> {
        const key: string = this.prepareKey(newFilter.appName);
        return this.getTaskFiltersByKey(newFilter.appName, key).pipe(
            switchMap((filters) => {
                if (filters?.length === 0) {
                    return this.createTaskFilters(newFilter.appName, key, [newFilter]);
                } else {
                    filters.push(newFilter);
                    return this.preferenceService.updatePreference(newFilter.appName, key, filters);
                }
            }),
            map((filters) => {
                this.addFiltersToStream(filters);
                return filters;
            })
        );
    }

    private addFiltersToStream(filters: TaskFilterCloudModel[]) {
        this.filtersSubject.next(filters);
    }

    /**
     * Updates a task filter.
     *
     * @param updatedFilter The filter to update
     * @returns Observable of task instance filters with updated filter
     */
    updateFilter(updatedFilter: TaskFilterCloudModel): Observable<TaskFilterCloudModel[]> {
        const key: string = this.prepareKey(updatedFilter.appName);
        return this.getTaskFiltersByKey(updatedFilter.appName, key).pipe(
            switchMap((filters) => {
                if (filters?.length === 0) {
                    return this.createTaskFilters(updatedFilter.appName, key, [updatedFilter]);
                } else {
                    const itemIndex = filters.findIndex((filter) => filter.id === updatedFilter.id);
                    filters[itemIndex] = updatedFilter;
                    return this.updateTaskFilters(updatedFilter.appName, key, filters);
                }
            }),
            map((updatedFilters) => {
                this.addFiltersToStream(updatedFilters);
                return updatedFilters;
            })
        );
    }

    /**
     * Deletes a task filter
     *
     * @param deletedFilter The filter to delete
     * @returns Observable of task instance filters without deleted filter
     */
    deleteFilter(deletedFilter: TaskFilterCloudModel): Observable<TaskFilterCloudModel[]> {
        const key = this.prepareKey(deletedFilter.appName);
        return this.getTaskFiltersByKey(deletedFilter.appName, key).pipe(
            switchMap((filters) => {
                if (filters?.length > 0) {
                    filters = filters.filter((filter) => filter.id !== deletedFilter.id);
                    return this.updateTaskFilters(deletedFilter.appName, key, filters);
                }
                return of([]);
            }),
            map((filters) => {
                this.addFiltersToStream(filters);
                return filters;
            })
        );
    }

    /**
     * Checks if given filter is a default filter
     *
     * @param filterName Name of the target task filter
     * @returns Boolean value for whether the filter is a default filter
     */
    isDefaultFilter(filterName: string): boolean {
        const defaultFilters = this.defaultTaskFilters();
        return defaultFilters.findIndex((filter) => filterName === filter.name) !== -1;
    }

    /**
     * Finds a task using an object with optional query properties.
     *
     * @returns Task information
     * @param taskFilter task filter model
     */
    getTaskFilterCounter(taskFilter: TaskFilterCloudModel): Observable<number> {
        if (taskFilter.appName || taskFilter.appName === '') {
            const queryUrl = `${this.getBasePath(taskFilter.appName)}/query/v1/tasks`;
            const queryParams = {
                processInstanceId: taskFilter.processInstanceId,
                processDefinitionId: taskFilter.processDefinitionId,
                processDefinitionName: taskFilter.processDefinitionName,
                assignee: taskFilter.assignee,
                status: taskFilter.status,
                taskName: taskFilter.taskName,
                appName: taskFilter.appName,
                assignmentType: taskFilter.assignmentType,
                owner: taskFilter.owner,
                taskId: taskFilter.taskId,
                parentTaskId: taskFilter.parentTaskId,
                priority: taskFilter.priority,
                lastModifiedFrom: taskFilter.lastModifiedFrom,
                lastModifiedTo: taskFilter.lastModifiedTo,
                standalone: taskFilter.standalone,
                createdDate: taskFilter.createdDate,
                completedDate: taskFilter.completedDate,
                completedBy: taskFilter.completedBy,
                dueDate: taskFilter.dueDate,
                maxItems: 1
            };
            return this.get<TaskCloudNodePaging>(queryUrl, queryParams).pipe(map((tasks) => tasks.list.pagination.totalItems));
        } else {
            return throwError('Appname not configured');
        }
    }

    /**
     * Calls update preference api to update task filter
     *
     * @param appName Name of the target app
     * @param key Key of the task filters
     * @param filters Details of update filter
     * @returns Observable of updated task filters
     */
    private updateTaskFilters(appName: string, key: string, filters: TaskFilterCloudModel[]): Observable<TaskFilterCloudModel[]> {
        return this.preferenceService.updatePreference(appName, key, filters);
    }

    /**
     * Creates a uniq key with appName and username
     *
     * @param appName Name of the target app
     * @returns String of task filters preference key
     */
    private prepareKey(appName: string): string {
        return `task-filters-${appName}-${this.identityUserService.getCurrentUserInfo().username}`;
    }

    /**
     * Finds and returns the task filters from preferences
     *
     * @returns Array of TaskFilterCloudModel
     * @param preferences preferences
     * @param key key
     */
    private findFiltersByKeyInPreferences(preferences: any, key: string): TaskFilterCloudModel[] {
        const result = preferences.find((filter: any) => filter.entry.key === key);
        return result?.entry ? JSON.parse(result.entry.value) : [];
    }

    /**
     * Creates and returns the default filters for a task app.
     *
     * @param appName Name of the target app
     * @returns Array of TaskFilterCloudModel
     */
    private defaultTaskFilters(appName?: string): TaskFilterCloudModel[] {
        return [
            new TaskFilterCloudModel({
                name: 'ADF_CLOUD_TASK_FILTERS.MY_TASKS',
                key: 'my-tasks',
                icon: 'inbox',
                appName,
                status: 'ASSIGNED',
                assignee: this.identityUserService.getCurrentUserInfo().username,
                sort: 'createdDate',
                order: 'DESC',
                showCounter: true
            }),
            new TaskFilterCloudModel({
                name: 'ADF_CLOUD_TASK_FILTERS.QUEUED_TASKS',
                key: 'queued-tasks',
                icon: 'queue',
                appName,
                status: 'CREATED',
                assignee: '',
                sort: 'createdDate',
                order: 'DESC',
                showCounter: true
            }),
            new TaskFilterCloudModel({
                name: 'ADF_CLOUD_TASK_FILTERS.COMPLETED_TASKS',
                key: 'completed-tasks',
                icon: 'done',
                appName,
                status: 'COMPLETED',
                assignee: '',
                sort: 'createdDate',
                order: 'DESC'
            })
        ];
    }

    getTaskNotificationSubscription(appName: string): Observable<TaskCloudEngineEvent[]> {
        return this.notificationCloudService
            .makeGQLQuery(appName, TASK_EVENT_SUBSCRIPTION_QUERY)
            .pipe(map((events: any) => events.data.engineEvents));
    }

    /**
     * Refresh filter key
     *
     * @param filterKey  Key of the filter
     */
    refreshFilter(filterKey: string): void {
        this.filterKeyToBeRefreshedSource.next(filterKey);
    }

    /**
     * This method is run after retrieving the filter array from preferences.
     * It handles the backwards compatibility with the new API by looking for the new properties and their counterparts in each passed filter.
     * If the new property is not found, it is created and assigned the value constructed from the old property.
     * The filters are then updated in the preferences and returned.
     * Old properties are left untouched for purposes like feature toggling.
     *
     * @param appName Name of the target app.
     * @param key Key of the task filters.
     * @param filters Array of task filters to be checked for backward compatibility.
     * @returns Observable of task filters with updated properties.
     */
    private handleCreateFilterBackwardsCompatibility(
        appName: string,
        key: string,
        filters: TaskFilterCloudModel[]
    ): Observable<TaskFilterCloudModel[]> {
        filters.forEach((filter) => {
            if (filter.taskName && !filter.taskNames) {
                filter.taskNames = [filter.taskName];
            }
            if (filter.status && !filter.statuses) {
                filter.statuses = [filter.status];
            }
            if (filter.assignee && !filter.assignees) {
                filter.assignees = [filter.assignee];
            }
            if (filter.processDefinitionName && !filter.processDefinitionNames) {
                filter.processDefinitionNames = [filter.processDefinitionName];
            }
            if (filter.completedBy?.username && !filter.completedByUsers) {
                filter.completedByUsers = [filter.completedBy.username];
            }
            if (filter.priority && !filter.priorities) {
                filter.priorities = [`${filter.priority}`];
            }
        });

        return this.updateTaskFilters(appName, key, filters);
    }
}
