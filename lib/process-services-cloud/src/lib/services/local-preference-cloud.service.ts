/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable } from '@angular/core';
import { PreferenceCloudServiceInterface } from './preference-cloud.interface';
import { StorageService } from '@alfresco/adf-core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocalPreferenceCloudService implements PreferenceCloudServiceInterface {

  constructor(private storage: StorageService) { }

    /**
     * Gets local preferences
     *
     * @param _ Name of the target app
     * @param key Key of the target preference
     * @returns List of local preferences
     */
    getPreferences(_: string, key: string): Observable<any> {
        if (key || key === '') {
            return of(this.prepareLocalPreferenceResponse(key));
        }
        return of(
            {
                list: {
                    entries: []
                }
            }
        );
    }

    /**
     * Gets local preference.
     *
     * @param _ Name of the target app
     * @param key Key of the target preference
     * @returns Observable of local preference
     */
    getPreferenceByKey(_: string, key: string): Observable<any> {
        return of(JSON.parse(this.storage.getItem(key)) || []);
    }

    /**
     * Creates local preference.
     *
     * @param _ Name of the target app
     * @param key Key of the target preference
     * @param newPreference Details of new local preference
     * @returns Observable of created local preferences
     */
    createPreference(_: string, key: string, newPreference: any): Observable<any> {
        const storedFilters = JSON.parse(this.storage.getItem(key) || '[]');
        storedFilters.push(...newPreference);
        this.storage.setItem(key, JSON.stringify(storedFilters));
        return of(storedFilters);
    }

    /**
     * Updates local preference.
     *
     * @param _ Name of the target app
     * @param key Key of the target preference
     * @param updatedPreference Details of updated preference
     * @returns Observable of updated local preferences
     */
    updatePreference(_: string, key: string, updatedPreference: any): Observable<any> {
        if (key) {
            this.storage.setItem(key, JSON.stringify(updatedPreference));
        }
        return of(updatedPreference);
    }

    /**
     * Deletes local preference by given preference key.
     *
     * @param key Key of the target preference
     * @param preferences Details of updated preferences
     * @returns Observable of preferences without deleted preference
     */
    deletePreference(key: string, preferences: any): Observable<any> {
        if (key) {
            this.storage.setItem(key, JSON.stringify(preferences));
        }
        return of(preferences);
    }

    prepareLocalPreferenceResponse(key: string): any {
        return {
            list: {
                entries: [
                    {
                        entry: {
                            key,
                            value: this.storage.getItem(key) || '[]'
                        }
                    }
                ]
            }
        };
    }
}
