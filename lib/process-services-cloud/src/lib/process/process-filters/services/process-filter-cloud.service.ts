/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { IdentityUserService, IdentityUserModel } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { ProcessFilterCloudModel } from '../models/process-filter-cloud.model';
import { UserPreferenceCloudService } from '../../../services/public-api';
import { switchMap, map } from 'rxjs/operators';
import { ProcessServicesCloudResponse } from '../../../models';

@Injectable()
export class ProcessFilterCloudService {

    private filtersSubject: BehaviorSubject<ProcessFilterCloudModel[]>;
    filters$: Observable<ProcessFilterCloudModel[]>;
    filters: ProcessFilterCloudModel[] = [];

    constructor(
        private preferenceService: UserPreferenceCloudService,
        private identityUserService: IdentityUserService) {
        this.filtersSubject = new BehaviorSubject([]);
        this.filters$ = this.filtersSubject.asObservable();
    }

    private createDefaultFilters(appName: string) {
        const key: string = this.prepareKey(appName);
        this.preferenceService.getPreferences(appName).pipe(
            switchMap((response: ProcessServicesCloudResponse) => {
                const preferences = (response && response.list && response.list.entries) ? response.list.entries : [];
                if (!this.hasPreferences(preferences)) {
                    return this.createProcessFilters(appName, key, this.defaultProcessFilters(appName));
                } else if (!this.hasProcessFilters(preferences, key)) {
                    return this.createProcessFilters(appName, key, this.defaultProcessFilters(appName));
                } else {
                    return of(this.findFiltersByKeyInPrefrences(preferences, key));
                }
            })
        ).subscribe((filters) => {
            this.filters = filters;
            this.addFiltersToStream();
        });
    }

    getProcessFilters(appName: string): Observable<ProcessFilterCloudModel[]> {
        this.createDefaultFilters(appName);
        return this.filters$;
    }

    /**
     * Get process instance filter for given filter id
     * @param appName Name of the target app
     * @param id Id of the target process instance filter
     * @returns Details of process filter
     */
    getFilterById(appName: string, id: string): Observable<any> {
        const key: string = this.prepareKey(appName);
        return this.preferenceService.getPreferenceByKey(appName, key).pipe(
            switchMap((response: ProcessFilterCloudModel[]) => {
                if (response && response.length === 0) {
                    return this.createProcessFilters(appName, key, this.defaultProcessFilters(appName));
                } else {
                    return of(response);
                }
            }),
            map((filters: ProcessFilterCloudModel[]) => {
                return filters.filter((filter: ProcessFilterCloudModel) => {
                    return filter.id === id;
                })[0];
            }));
    }

    addFilter(filter: ProcessFilterCloudModel) {
        const key: string = this.prepareKey(filter.appName);
        this.preferenceService.getPreferenceByKey(filter.appName, key).pipe(
            switchMap((filters: ProcessFilterCloudModel[]) => {
                if (filters && filters.length === 0) {
                    return this.createProcessFilters(filter.appName, key, [filter]);
                } else {
                    filters.push(filter);
                    return this.preferenceService.updatePreference(filter.appName, key, filters);
                }
            })
        ).subscribe((filters: ProcessFilterCloudModel[]) => {
            this.filters = filters;
            this.addFiltersToStream();
        });
    }

    updateFilter(filter: ProcessFilterCloudModel) {
        const key: string = this.prepareKey(filter.appName);
        this.preferenceService.getPreferenceByKey(filter.appName, key).pipe(
            switchMap((preferences: any) => {
                const filters = preferences;
                if (filters && filters.length === 0) {
                    return this.createProcessFilters(filter.appName, key, [filter]);
                } else {
                    const itemIndex = filters.findIndex((flt: ProcessFilterCloudModel) => flt.id === filter.id);
                    filters[itemIndex] = filter;
                    return this.updateProcessFilters(filter.appName, key, filters);
                }
            })
        ).subscribe((updatedFilters: ProcessFilterCloudModel[]) => {
            this.filters = updatedFilters;
            this.addFiltersToStream();
        });
    }

    /**
     *  Delete process instance filter
     * @param filter The new filter to delete
     */
    deleteFilter(filter: ProcessFilterCloudModel) {
        const key = this.prepareKey(filter.appName);
        this.preferenceService.getPreferenceByKey(filter.appName, key).pipe(
            switchMap((preferences: any) => {
                let filters = preferences;
                if (filters && filters.length > 0) {
                    filters = filters.filter((item) => item.id !== filter.id);
                    return this.preferenceService.updatePreference(filter.appName, key, filters);
                }
            })
        ).subscribe((filters) => {
            this.filters = filters;
            this.addFiltersToStream();
        });
    }

    private hasPreferences(preferences: any): boolean {
        return preferences && preferences.length > 0;
    }

    private hasProcessFilters(preferences: any, key: string): boolean {
        const filters = preferences.find((filter: any) => { return filter.entry.key === key; });
        return (filters && filters.entry) ? JSON.parse(filters.entry.value).length > 0 : false;
    }

    private createProcessFilters(appName: string, key: string, filters: ProcessFilterCloudModel[]): Observable<ProcessFilterCloudModel[]> {
        return this.preferenceService.createPreference(appName, key, filters);
    }

    private updateProcessFilters(appName: string, key: string, filters: ProcessFilterCloudModel[]): Observable<ProcessFilterCloudModel[]> {
        return this.preferenceService.updatePreference(appName, key, filters);
    }

    private prepareKey(appName: string): string {
        const user: IdentityUserModel = this.identityUserService.getCurrentUserInfo();
        return `process-filters-${appName}-${user.username}`;
    }

    private findFiltersByKeyInPrefrences(preferences: any, key: string): ProcessFilterCloudModel[] {
        const result = preferences.find((filter: any) => { return filter.entry.key === key; });
        return result && result.entry ? JSON.parse(result.entry.value) : [];
    }

    private addFiltersToStream() {
        this.filtersSubject.next(this.filters);
    }

    private defaultProcessFilters(appName: string): ProcessFilterCloudModel[] {
        return [
            new ProcessFilterCloudModel({
                name: 'ADF_CLOUD_PROCESS_FILTERS.ALL_PROCESSES',
                key: 'all-processes',
                icon: 'adjust',
                appName: appName,
                sort: 'startDate',
                status: '',
                order: 'DESC'
            }),
            new ProcessFilterCloudModel({
                name: 'ADF_CLOUD_PROCESS_FILTERS.RUNNING_PROCESSES',
                icon: 'inbox',
                key: 'running-processes',
                appName: appName,
                sort: 'startDate',
                status: 'RUNNING',
                order: 'DESC'
            }),
            new ProcessFilterCloudModel({
                name: 'ADF_CLOUD_PROCESS_FILTERS.COMPLETED_PROCESSES',
                icon: 'done',
                key: 'completed-processes',
                appName: appName,
                sort: 'startDate',
                status: 'COMPLETED',
                order: 'DESC'
            })
        ];
    }
}
