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

import { StorageService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProcessFilterRepresentationModel, ProcessQueryModel } from '../models/process-filter-cloud.model';

@Injectable()
export class ProcessFilterCloudService {

    constructor(private storage: StorageService) {
    }

    /**
     * Creates and returns the default filters for a process app.
     * @param appName Name of the target app
     * @returns Observable of default filters just created
     */
    public createDefaultFilters(appName: string): Observable<ProcessFilterRepresentationModel[]> {
        const allProcessesFilter = this.getAllProcessesFilter(appName);
        this.addFilter(allProcessesFilter);
        const runningProcessesFilter = this.getRunningProcessesFilter(appName);
        this.addFilter(runningProcessesFilter);
        const completedProcessesFilter = this.getCompletedProcessesFilter(appName);
        this.addFilter(completedProcessesFilter);

        return this.getProcessFilters(appName);
    }

    /**
     * Gets all process instance filters for a process app.
     * @param appName Name of the target app
     * @returns Observable of process filter details
     */
    getProcessFilters(appName: string): Observable<ProcessFilterRepresentationModel[]> {
        let key = 'process-filters-' + appName;
        const filters = JSON.parse(this.storage.getItem(key) || '[]');
        return new Observable(function(observer) {
            observer.next(filters);
            observer.complete();
        });
    }

    /**
     * Get process instance filter for given filter id
     * @param appName Name of the target app
     * @param id Id of the target process instance filter
     * @returns Details of process filter
     */
    getProcessFilterById(appName: string, id: string): ProcessFilterRepresentationModel {
        const key = 'process-filters-' + appName;
        let filters = [];
        filters = JSON.parse(this.storage.getItem(key)) || [];
        return filters.filter((filterTmp: ProcessFilterRepresentationModel) => id === filterTmp.id)[0];
    }

    /**
     * Adds a new process instance filter
     * @param filter The new filter to add
     * @returns Details of process filter just added
     */
    addFilter(filter: ProcessFilterRepresentationModel) {
        const key = 'process-filters-' + filter.query.appName;
        const storedFilters = JSON.parse(this.storage.getItem(key) || '[]');

        storedFilters.push(filter);
        this.storage.setItem(key, JSON.stringify(storedFilters));
    }

    /**
     *  Update process instance filter
     * @param filter The new filter to update
     */
    updateFilter(filter: ProcessFilterRepresentationModel) {
        const key = 'process-filters-' + filter.query.appName;
        if (key) {
            let filters = JSON.parse(this.storage.getItem(key) || '[]');
            let itemIndex = filters.findIndex((flt: ProcessFilterRepresentationModel) => flt.id === filter.id);
            filters[itemIndex] = filter;
            this.storage.setItem(key, JSON.stringify(filters));
        }
    }

    /**
     *  Delete process instance filter
     * @param filter The new filter to delete
     */
    deleteFilter(filter: ProcessFilterRepresentationModel) {
        const key = 'process-filters-' + filter.query.appName;
        if (key) {
            let filters = JSON.parse(this.storage.getItem(key) || '[]');
            filters = filters.filter((item) => item.id !== filter.id);
            this.storage.setItem(key, JSON.stringify(filters));
        }
    }

    /**
     * Creates and returns a filter for "All" Process instances.
     * @param appName Name of the target app
     * @returns The newly created filter
     */
    getAllProcessesFilter(appName: string): ProcessFilterRepresentationModel {
        return new ProcessFilterRepresentationModel({
            name: 'ADF_CLOUD_PROCESS_FILTERS.ALL_PROCESSES',
            key: 'all-processes',
            icon: 'adjust',
            query: new ProcessQueryModel(
                {
                    appName: appName,
                    sort: 'startDate',
                    state: '',
                    order: 'DESC'
                }
            )
        });
    }

    /**
     * Creates and returns a filter for "Running" Process instances.
     * @param appName Name of the target app
     * @returns The newly created filter
     */
    getRunningProcessesFilter(appName: string): ProcessFilterRepresentationModel {
        return new ProcessFilterRepresentationModel({
            name: 'ADF_CLOUD_PROCESS_FILTERS.RUNNING_PROCESSES',
            icon: 'inbox',
            key: 'running-processes',
            query: new ProcessQueryModel(
                {
                    appName: appName,
                    sort: 'startDate',
                    state: 'RUNNING',
                    order: 'DESC'
                }
            )
        });
    }

    /**
     * Creates and returns a filter for "Completed" Process instances.
     * @param appName Name of the target app
     * @returns The newly created filter
     */
    getCompletedProcessesFilter(appName: string): ProcessFilterRepresentationModel {
        return new ProcessFilterRepresentationModel({
            name: 'ADF_CLOUD_PROCESS_FILTERS.COMPLETED_PROCESSES',
            icon: 'done',
            key: 'completed-processes',
            query: new ProcessQueryModel(
                {
                    appName: appName,
                    sort: 'startDate',
                    state: 'COMPLETED',
                    order: 'DESC'
                }
            )
        });
    }
}
