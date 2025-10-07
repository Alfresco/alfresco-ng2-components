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

import { Injectable, inject } from '@angular/core';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { ProcessFilterCloudModel } from '../models/process-filter-cloud.model';
import { switchMap, map } from 'rxjs/operators';
import { PROCESS_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { PreferenceCloudServiceInterface } from '../../../services/preference-cloud.interface';
import { IdentityUserService } from '../../../people/services/identity-user.service';
import { NotificationCloudService } from '../../../services/notification-cloud.service';
import { TaskCloudEngineEvent } from '../../../models/engine-event-cloud.model';

const PROCESS_EVENT_SUBSCRIPTION_QUERY = `
    subscription {
        engineEvents(eventType: [
            PROCESS_CANCELLED
            PROCESS_COMPLETED
            PROCESS_CREATED
            PROCESS_RESUMED
            PROCESS_SUSPENDED
            PROCESS_STARTED
        ]) {
            eventType
            entity
        }
    }
`;

@Injectable({
    providedIn: 'root'
})
export class ProcessFilterCloudService {
    private filtersSubject: BehaviorSubject<ProcessFilterCloudModel[]>;
    filters$: Observable<ProcessFilterCloudModel[]>;
    private filterKeyToBeRefreshedSource = new Subject<string>();
    filterKeyToBeRefreshed$: Observable<string> = this.filterKeyToBeRefreshedSource.asObservable();

    private readonly preferenceService = inject<PreferenceCloudServiceInterface>(PROCESS_FILTERS_SERVICE_TOKEN);
    private readonly identityUserService = inject(IdentityUserService);
    private readonly notificationCloudService = inject(NotificationCloudService);

    constructor() {
        this.filtersSubject = new BehaviorSubject([]);
        this.filters$ = this.filtersSubject.asObservable();
    }

    readQueryParams(obj: any): ProcessFilterCloudModel {
        const model = Object.assign({}, obj) as ProcessFilterCloudModel;

        if (Object.prototype.hasOwnProperty.call(obj, 'appVersion') && obj['appVersion']) {
            if (typeof obj['appVersion'] === 'string') {
                model.appVersion = obj['appVersion'].split(',').map((str) => parseInt(str, 10));
            }
        }

        if (Object.prototype.hasOwnProperty.call(obj, 'lastModifiedFrom')) {
            model.lastModifiedFrom = new Date(parseInt(obj['lastModifiedFrom'], 10));
        }

        if (Object.prototype.hasOwnProperty.call(obj, 'lastModifiedTo')) {
            model.lastModifiedTo = new Date(parseInt(obj['lastModifiedTo'], 10));
        }

        return model;
    }

    writeQueryParams(value: any, filterProperties: string[], appName?: string, id?: string): any {
        value = value || {};
        const result = {
            appName: appName || value['appName'],
            id: id || value['id'],
            ...(value['environmentId'] && {
                environmentId: value['environmentId']
            })
        };

        for (const prop of filterProperties) {
            if (prop === 'appVersionMultiple') {
                const versions = value['appVersion'];

                if (Array.isArray(versions) && versions.length > 0) {
                    result['appVersion'] = versions.join(',');
                }
            } else if (prop === 'lastModified') {
                if (value['lastModifiedFrom']) {
                    result['lastModifiedFrom'] = value['lastModifiedFrom'].valueOf();
                }

                if (value['lastModifiedTo']) {
                    result['lastModifiedTo'] = value['lastModifiedTo'].valueOf();
                }
            } else if (Object.prototype.hasOwnProperty.call(value, prop)) {
                result[prop] = value[prop];
            }
        }

        return result;
    }

    /**
     * Creates and returns the default process instance filters for a app.
     *
     * @param appName Name of the target app
     */
    private createDefaultFilters(appName: string): void {
        const key: string = this.prepareKey(appName);
        this.preferenceService
            .getPreferences(appName, key)
            .pipe(
                switchMap((response) => {
                    const preferences = response?.list?.entries ? response.list.entries : [];
                    if (!this.hasPreferences(preferences)) {
                        return this.createProcessFilters(appName, key, this.defaultProcessFilters(appName));
                    } else if (!this.hasProcessFilters(preferences, key)) {
                        return this.createProcessFilters(appName, key, this.defaultProcessFilters(appName));
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
     * Gets all process instance filters for a process app.
     *
     * @param appName Name of the target app
     * @returns Observable of process filters details
     */
    getProcessFilters(appName: string): Observable<ProcessFilterCloudModel[]> {
        this.createDefaultFilters(appName);
        return this.filters$;
    }

    /**
     * Get process instance filter for given filter id
     *
     * @param appName Name of the target app
     * @param id Id of the target process instance filter
     * @returns Observable of process instance filter details
     */
    getFilterById(appName: string, id: string): Observable<ProcessFilterCloudModel> {
        const key: string = this.prepareKey(appName);
        return this.getProcessFiltersByKey(appName, key).pipe(
            switchMap((filters) => {
                if (filters?.length === 0) {
                    return this.createProcessFilters(appName, key, this.defaultProcessFilters(appName));
                } else {
                    return of(filters);
                }
            }),
            map((filters) => filters.filter((filter) => filter.id === id)[0])
        );
    }

    /**
     * Adds a new process instance filter
     *
     * @param newFilter The new filter to add
     * @returns Observable of process instance filters with newly added filter
     */
    addFilter(newFilter: ProcessFilterCloudModel): Observable<ProcessFilterCloudModel[]> {
        const { appName, name } = newFilter;
        const key = this.prepareKey(appName);

        return this.getProcessFiltersByKey(appName, key).pipe(
            switchMap((filters) => {
                if (filters?.length === 0) {
                    return this.createProcessFilters(appName, key, [newFilter]);
                } else {
                    const index = filters.findIndex((filter) => filter.name === name);
                    if (index >= 0) {
                        filters.splice(index, 1);
                    }

                    filters.push(newFilter);
                    return this.preferenceService.updatePreference(appName, key, filters);
                }
            }),
            map((filters) => {
                this.addFiltersToStream(filters);
                return filters;
            })
        );
    }

    /**
     *  Update process instance filter
     *
     * @param updatedFilter The new filter to update
     * @returns Observable of process instance filters with updated filter
     */
    updateFilter(updatedFilter: ProcessFilterCloudModel): Observable<ProcessFilterCloudModel[]> {
        const key = this.prepareKey(updatedFilter.appName);
        return this.getProcessFiltersByKey(updatedFilter.appName, key).pipe(
            switchMap((filters) => {
                if (filters?.length === 0) {
                    return this.createProcessFilters(updatedFilter.appName, key, [updatedFilter]);
                } else {
                    const itemIndex = filters.findIndex((filter) => filter.id === updatedFilter.id);
                    filters[itemIndex] = updatedFilter;
                    return this.updateProcessFilters(updatedFilter.appName, key, filters);
                }
            }),
            map((updatedFilters) => {
                this.addFiltersToStream(updatedFilters);
                return updatedFilters;
            })
        );
    }

    /**
     *  Delete process instance filter
     *
     * @param deletedFilter The new filter to delete
     * @returns Observable of process instance filters without deleted filter
     */
    deleteFilter(deletedFilter: ProcessFilterCloudModel): Observable<ProcessFilterCloudModel[]> {
        const key = this.prepareKey(deletedFilter.appName);

        return this.getProcessFiltersByKey(deletedFilter.appName, key).pipe(
            switchMap((filters) => {
                if (filters && filters.length > 0) {
                    filters = filters.filter((filter) => filter.id !== deletedFilter.id);
                    return this.updateProcessFilters(deletedFilter.appName, key, filters);
                } else {
                    return of([]);
                }
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
     * @param filterName Name of the target process filter
     * @returns Boolean value for whether the filter is a default filter
     */
    isDefaultFilter(filterName: string): boolean {
        const defaultFilters = this.defaultProcessFilters();
        return defaultFilters.findIndex((filter) => filterName === filter.name) !== -1;
    }

    /**
     * Reset the process filters to the default configuration if it exists and stores it.
     * If there is no default configuration for the process cloud filter with the provided filter name,
     * then it changes nothing but stores the current values of the filter
     *
     * @param appName Name of the target app
     * @param filter The process filter to be restored to defaults
     * @returns Observable of process filters details
     */
    resetProcessFilterToDefaults(appName: string, filter: ProcessFilterCloudModel): Observable<ProcessFilterCloudModel[]> {
        const defaultFilter =
            this.defaultProcessFilters(appName).find((defaultFilterDefinition) => defaultFilterDefinition.name === filter.name) || filter;
        defaultFilter.id = filter.id;
        return this.updateFilter(defaultFilter);
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
     * Checks for process instance filters in given user preferences
     *
     * @param preferences User preferences of the target app
     * @param key Key of the process instance filters
     * @returns Boolean value if the preference has process instance filters
     */
    private hasProcessFilters(preferences: any, key: string): boolean {
        const filters = preferences.find((filter: any) => filter.entry.key === key);
        return filters?.entry ? JSON.parse(filters.entry.value).length > 0 : false;
    }

    /**
     * Calls create preference api to create process instance filters
     *
     * @param appName Name of the target app
     * @param key Key of the process instance filters
     * @param filters Details of new process instance filter
     * @returns Observable of created process instance filters
     */
    private createProcessFilters(appName: string, key: string, filters: ProcessFilterCloudModel[]): Observable<ProcessFilterCloudModel[]> {
        return this.preferenceService.createPreference(appName, key, filters);
    }

    /**
     * Calls get preference api to get process instance filter by preference key
     *
     * @param appName Name of the target app
     * @param key Key of the process instance filters
     * @returns Observable of process instance filters
     */
    private getProcessFiltersByKey(appName: string, key: string): Observable<ProcessFilterCloudModel[]> {
        return this.preferenceService.getPreferenceByKey(appName, key);
    }

    /**
     * Calls update preference api to update process instance filter
     *
     * @param appName Name of the target app
     * @param key Key of the process instance filters
     * @param filters Details of update filter
     * @returns Observable of updated process instance filters
     */
    private updateProcessFilters(appName: string, key: string, filters: ProcessFilterCloudModel[]): Observable<ProcessFilterCloudModel[]> {
        return this.preferenceService.updatePreference(appName, key, filters);
    }

    /**
     * Creates a uniq key with appName and username
     *
     * @param appName Name of the target app
     * @returns String of process instance filters preference key
     */
    private prepareKey(appName: string): string {
        const user = this.identityUserService.getCurrentUserInfo();
        return `process-filters-${appName}-${user.username}`;
    }

    /**
     * Finds and returns the process instance filters from preferences
     *
     * @returns Array of ProcessFilterCloudModel
     * @param preferences preferences
     * @param key key
     */
    private findFiltersByKeyInPreferences(preferences: any, key: string): ProcessFilterCloudModel[] {
        const result = preferences.find((filter: any) => filter.entry.key === key);
        return result?.entry ? JSON.parse(result.entry.value) : [];
    }

    private addFiltersToStream(filters: ProcessFilterCloudModel[]) {
        this.filtersSubject.next(filters);
    }

    /**
     * Creates and returns the default filters for a process app.
     *
     * @param appName Name of the target app
     * @returns Array of ProcessFilterCloudModel
     */
    private defaultProcessFilters(appName?: string): ProcessFilterCloudModel[] {
        return [
            new ProcessFilterCloudModel({
                name: 'ADF_CLOUD_PROCESS_FILTERS.RUNNING_PROCESSES',
                icon: 'inbox',
                key: 'running-processes',
                appName,
                sort: 'startDate',
                status: 'RUNNING',
                order: 'DESC',
                showCounter: true
            }),
            new ProcessFilterCloudModel({
                name: 'ADF_CLOUD_PROCESS_FILTERS.COMPLETED_PROCESSES',
                icon: 'done',
                key: 'completed-processes',
                appName,
                sort: 'startDate',
                status: 'COMPLETED',
                order: 'DESC',
                showCounter: false
            }),
            new ProcessFilterCloudModel({
                name: 'ADF_CLOUD_PROCESS_FILTERS.ALL_PROCESSES',
                key: 'all-processes',
                icon: 'adjust',
                appName,
                sort: 'startDate',
                status: '',
                order: 'DESC',
                showCounter: false
            })
        ];
    }

    getProcessNotificationSubscription(appName: string): Observable<TaskCloudEngineEvent[]> {
        return this.notificationCloudService
            .makeGQLQuery(appName, PROCESS_EVENT_SUBSCRIPTION_QUERY)
            .pipe(map((events: any) => events?.data?.engineEvents));
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
     * @param key Key of the process filters.
     * @param filters Array of process filters to be checked for backward compatibility.
     * @returns Observable of process filters with updated properties.
     */
    private handleCreateFilterBackwardsCompatibility(
        appName: string,
        key: string,
        filters: ProcessFilterCloudModel[]
    ): Observable<ProcessFilterCloudModel[]> {
        filters.forEach((filter) => {
            if (filter.processDefinitionName && !filter.processDefinitionNames) {
                filter.processDefinitionNames = [filter.processDefinitionName];
            }
            if (filter.initiator && !filter.initiators) {
                filter.initiators = [filter.initiator];
            }
            if (filter.appVersion && !filter.appVersions) {
                filter.appVersions = [filter.appVersion.toString()];
            }
            if (filter.status && !filter.statuses) {
                filter.statuses = [filter.status];
            }
        });

        return this.updateProcessFilters(appName, key, filters);
    }
}
