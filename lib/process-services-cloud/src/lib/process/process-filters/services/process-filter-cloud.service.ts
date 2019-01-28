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

import { StorageService, IdentityUserService, IdentityUserModel } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ProcessFilterCloudModel } from '../models/process-filter-cloud.model';

@Injectable()
export class ProcessFilterCloudService {

    private filtersSubject: BehaviorSubject<ProcessFilterCloudModel[]>;
    filters$: Observable<ProcessFilterCloudModel[]>;

    constructor(
        private storage: StorageService,
        private identityUserService: IdentityUserService) {
        this.filtersSubject = new BehaviorSubject([]);
        this.filters$ = this.filtersSubject.asObservable();
    }

    /**
     * Creates and returns the default filters for a process app.
     * @param appName Name of the target app
     * @returns Observable of default filters just created
     */
    private createDefaultFilters(appName: string) {
        const allProcessesFilter = this.getAllProcessesFilter(appName);
        this.addFilter(allProcessesFilter);
        const runningProcessesFilter = this.getRunningProcessesFilter(appName);
        this.addFilter(runningProcessesFilter);
        const completedProcessesFilter = this.getCompletedProcessesFilter(appName);
        this.addFilter(completedProcessesFilter);
    }

    /**
     * Gets all process instance filters for a process app.
     * @param appName Name of the target app
     * @returns Observable of process filter details
     */
    getProcessFilters(appName: string): Observable<ProcessFilterCloudModel[]> {
        const user: IdentityUserModel = this.identityUserService.getCurrentUserInfo();
        const key = `process-filters-${appName}-${user.username}`;
        const filters = JSON.parse(this.storage.getItem(key) || '[]');

        if (filters.length === 0) {
            this.createDefaultFilters(appName);
        } else {
            this.addFiltersToStream(filters);
        }
        return this.filters$;
    }

    /**
     * Get process instance filter for given filter id
     * @param appName Name of the target app
     * @param id Id of the target process instance filter
     * @returns Details of process filter
     */
    getProcessFilterById(appName: string, id: string): ProcessFilterCloudModel {
        const user: IdentityUserModel = this.identityUserService.getCurrentUserInfo();
        const key = `process-filters-${appName}-${user.username}`;
        let filters = [];
        filters = JSON.parse(this.storage.getItem(key)) || [];
        return filters.filter((filterTmp: ProcessFilterCloudModel) => id === filterTmp.id)[0];
    }

    /**
     * Adds a new process instance filter
     * @param filter The new filter to add
     * @returns Details of process filter just added
     */
    addFilter(filter: ProcessFilterCloudModel) {
        const user: IdentityUserModel = this.identityUserService.getCurrentUserInfo();
        const key = `process-filters-${filter.appName}-${user.username}`;
        const storedFilters = JSON.parse(this.storage.getItem(key) || '[]');

        storedFilters.push(filter);
        this.storage.setItem(key, JSON.stringify(storedFilters));

        this.addFiltersToStream(storedFilters);
    }

    /**
     *  Update process instance filter
     * @param filter The new filter to update
     */
    updateFilter(filter: ProcessFilterCloudModel) {
        const user: IdentityUserModel = this.identityUserService.getCurrentUserInfo();
        const key = `process-filters-${filter.appName}-${user.username}`;
        if (key) {
            let filters = JSON.parse(this.storage.getItem(key) || '[]');
            let itemIndex = filters.findIndex((flt: ProcessFilterCloudModel) => flt.id === filter.id);
            filters[itemIndex] = filter;
            this.storage.setItem(key, JSON.stringify(filters));
            this.addFiltersToStream(filters);
        }
    }

    /**
     *  Delete process instance filter
     * @param filter The new filter to delete
     */
    deleteFilter(filter: ProcessFilterCloudModel) {
        const user: IdentityUserModel = this.identityUserService.getCurrentUserInfo();
        const key = `process-filters-${filter.appName}-${user.username}`;
        if (key) {
            let filters = JSON.parse(this.storage.getItem(key) || '[]');
            filters = filters.filter((item) => item.id !== filter.id);
            this.storage.setItem(key, JSON.stringify(filters));
            if (filters.length === 0) {
                this.createDefaultFilters(filter.appName);
            } else {
                this.addFiltersToStream(filters);
            }
        }
    }

    /**
     * Creates and returns a filter for "All" Process instances.
     * @param appName Name of the target app
     * @returns The newly created filter
     */
    getAllProcessesFilter(appName: string): ProcessFilterCloudModel {
        return new ProcessFilterCloudModel({
            name: 'ADF_CLOUD_PROCESS_FILTERS.ALL_PROCESSES',
            key: 'all-processes',
            icon: 'adjust',
            appName: appName,
            sort: 'startDate',
            state: 'ALL',
            order: 'DESC'
        });
    }

    /**
     * Creates and returns a filter for "Running" Process instances.
     * @param appName Name of the target app
     * @returns The newly created filter
     */
    getRunningProcessesFilter(appName: string): ProcessFilterCloudModel {
        return new ProcessFilterCloudModel({
            name: 'ADF_CLOUD_PROCESS_FILTERS.RUNNING_PROCESSES',
            icon: 'inbox',
            key: 'running-processes',
            appName: appName,
            sort: 'startDate',
            state: 'RUNNING',
            order: 'DESC'
        });
    }

    /**
     * Creates and returns a filter for "Completed" Process instances.
     * @param appName Name of the target app
     * @returns The newly created filter
     */
    getCompletedProcessesFilter(appName: string): ProcessFilterCloudModel {
        return new ProcessFilterCloudModel({
            name: 'ADF_CLOUD_PROCESS_FILTERS.COMPLETED_PROCESSES',
            icon: 'done',
            key: 'completed-processes',
            appName: appName,
            sort: 'startDate',
            state: 'COMPLETED',
            order: 'DESC'
        });
    }

    private addFiltersToStream(filters: ProcessFilterCloudModel []) {
        this.filtersSubject.next(filters);
    }
}
