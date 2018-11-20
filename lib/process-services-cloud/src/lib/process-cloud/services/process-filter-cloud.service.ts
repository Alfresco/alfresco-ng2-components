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
import { ProcessInstanceFilterRepresentationModel, ProcessInstanceQueryModel } from '../models/process-filter-cloud.model';

@Injectable()
export class ProcessFilterCloudService {

    constructor(private logService: LogService,
                private storage: StorageService) {
    }

    /**
     * Creates and returns the default filters for a process app.
     * @param appName Name of the target app
     * @returns Observable of default filters just created
     */
    public createDefaultFilters(appName: string): Observable<ProcessInstanceFilterRepresentationModel[]> {
        const allProcessesFilter = this.getAllProcessesFilterInstance(appName);
        const allProcessesObservable = this.addFilter(allProcessesFilter);

        const runningProcessesFilter = this.getRunningProcessesFilterInstance(appName);
        const runningProcessesObservable = this.addFilter(runningProcessesFilter);

        const completedProcessesFilter = this.getCompletedProcessesFilterInstance(appName);
        const completedProcessesObservable = this.addFilter(completedProcessesFilter);

        return new Observable(observer => {
            forkJoin(
                allProcessesObservable,
                runningProcessesObservable,
                completedProcessesObservable
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
     * Gets all process instance filters for a process app.
     * @param appName Name of the target app
     * @returns Observable of process filter details
     */
    getProcessInstanceFilters(appName?: string): Observable<ProcessInstanceFilterRepresentationModel[]> {
        let key = 'process-filters-' + appName;
        const filters = JSON.parse(this.storage.getItem(key) || '[]');
        return new Observable(function(observer) {
            observer.next(filters);
            observer.complete();
        });
    }

    /**
     * Adds a new process instance filter
     * @param filter The new filter to add
     * @returns Details of process filter just added
     */
    addFilter(filter: ProcessInstanceFilterRepresentationModel): Observable<ProcessInstanceFilterRepresentationModel> {
        const key = 'process-filters-' + filter.query.appName || '0';
        let filters = JSON.parse(this.storage.getItem(key) || '[]');

        filters.push(filter);

        this.storage.setItem(key, JSON.stringify(filters));

        return new Observable(function(observer) {
            observer.next(filter);
            observer.complete();
        });
    }

    /**
     * Creates and returns a filter for "All" Process instances.
     * @param appName Name of the target app
     * @returns The newly created filter
     */
    getAllProcessesFilterInstance(appName: string): ProcessInstanceFilterRepresentationModel {
        return new ProcessInstanceFilterRepresentationModel({
            name: 'All Processes',
            icon: 'adjust',
            query: new ProcessInstanceQueryModel(
                {
                    appName: appName,
                    sort: 'startDate',
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
    getRunningProcessesFilterInstance(appName: string): ProcessInstanceFilterRepresentationModel {
        return new ProcessInstanceFilterRepresentationModel({
            name: 'Running Processes',
            icon: 'inbox',
            query: new ProcessInstanceQueryModel(
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
    getCompletedProcessesFilterInstance(appName: string): ProcessInstanceFilterRepresentationModel {
        return new ProcessInstanceFilterRepresentationModel({
            name: 'Completed Processes',
            icon: 'done',
            query: new ProcessInstanceQueryModel(
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
