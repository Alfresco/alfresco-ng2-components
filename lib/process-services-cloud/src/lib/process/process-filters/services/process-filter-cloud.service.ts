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

    createDefaultFilters(appName: string) {
        const key = this.prepareKey(appName);
        this.preferenceService.getPreferenceByKey(appName, key).pipe(
            switchMap((preferences) => {
                const filters = preferences;
                if (!this.hasPreferences(filters)) {
                    console.log('if empty create default', filters);
                    return this.preferenceService.createPreference(appName, key, JSON.stringify(this.defaultProcessFilters(appName)));
                } else {
                    console.log('if not empty  return same', filters);
                    return of(filters);
                }
            })
        ).subscribe((filters) => {
            this.filters = filters;
            this.addFiltersToStream();
        });
    }

    prepareKey(appName: string): string {
        const user: IdentityUserModel = this.identityUserService.getCurrentUserInfo();
        return `process-filters-${appName}-${user.username}`;
    }

    hasPreferences(preferences: any) {
        return preferences && preferences.length > 0;
    }

    addFilter(filter: ProcessFilterCloudModel) {
        const key = this.prepareKey(filter.appName);
        this.preferenceService.getPreferenceByKey(filter.appName, key).pipe(
            switchMap((preferences) => {
                const filters = preferences;
                if (!this.hasPreferences(filters)) {
                    return this.preferenceService.createPreference(filter.appName, key, JSON.stringify([filter]));
                } else {
                    filters.push(filter);
                    return this.preferenceService.updatePreference(filter.appName, key, JSON.stringify(filters));
                }
            })
        ).subscribe((filters) => {
            this.filters = filters;
            this.addFiltersToStream();
        });
    }

    /**
     * Get process instance filter for given filter id
     * @param appName Name of the target app
     * @param id Id of the target process instance filter
     * @returns Details of process filter
     */
    getProcessFilterById(appName: string, id: string): any {
        const user: IdentityUserModel = this.identityUserService.getCurrentUserInfo();
        const key = `process-filters-${appName}-${user.username}`;
        return this.preferenceService.getPreferenceByKey(appName, key).pipe(
            map((res) => {
                const filtredResult = res.filter((filterTmp: ProcessFilterCloudModel) => {
                    return filterTmp.id === id;
                });
                return filtredResult[0];
            })
        );
    }

    getProcessFilters(appName: string): Observable<any> {
        this.createDefaultFilters(appName);
        return this.filters$;
    }

    updateFilter(filter: ProcessFilterCloudModel) {
        const key = this.prepareKey(filter.appName);
        this.preferenceService.getPreferenceByKey(filter.appName, key).pipe(
            switchMap((preferences) => {
                const filters = preferences;
                if (filters && filters.length === 0) {
                    console.log('update if empty', filters);
                    return this.preferenceService.createPreference(filter.appName, key, JSON.stringify([filter]));
                } else {
                    const itemIndex = filters.findIndex((flt: ProcessFilterCloudModel) => flt.id === filter.id);
                    filters[itemIndex] = filter;
                    console.log('update if not empty', filters);
                    return this.preferenceService.updatePreference(filter.appName, key, JSON.stringify(filters));
                }
            })
        ).subscribe((filter) =>          {
            this.filters = filter;
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
            switchMap((preferences) => {
                let filters = preferences;
                if (filters && filters.length > 0) {
                    filters = filters.filter((item) => item.id !== filter.id);
                    return this.preferenceService.updatePreference(filter.appName, key, JSON.stringify(filters));
                }
            })
        ).subscribe((filters) => {
            this.filters = filters;
            this.addFiltersToStream();
        });
    }

    defaultProcessFilters(appName: string): ProcessFilterCloudModel[] {
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

    private addFiltersToStream() {
        this.filtersSubject.next(this.filters);
    }
}
