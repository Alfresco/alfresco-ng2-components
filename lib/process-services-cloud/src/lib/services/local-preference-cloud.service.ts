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

import { Injectable } from '@angular/core';
import { PreferenceCloudServiceInterface } from './preference-cloud.interface';
import { StorageService } from '@alfresco/adf-core';
import { Observable, of } from 'rxjs';

@Injectable()
export class LocalPreferenceCloudService implements PreferenceCloudServiceInterface {

  contentTypes = ['application/json'];
  accepts = ['application/json'];

  constructor(
    private storage: StorageService) { }

  getPreferences(appName: string, key?: string): Observable<any> {
      if (key || key === '') {
          return of(this.prepareFilterResponse(key));
      }
  }

  getPreferenceByKey(appName: string, key: string): Observable<any> {
    return of(JSON.parse(this.storage.getItem(key)) || []);
  }

  createPreference(appName: string, key: string, newPreference: any): Observable<any> {
    const storedFilters = JSON.parse(this.storage.getItem(key) || '[]');
    storedFilters.push(...newPreference);
    this.storage.setItem(key, JSON.stringify(storedFilters));
    return of(storedFilters);
  }

  updatePreference(appName: string, key: string, updatedPreference: any): Observable<any> {
    if (key) {
        this.storage.setItem(key, JSON.stringify(updatedPreference));
        return of(updatedPreference);
    }
  }

  deletePreference(key: string, filters: any): Observable<any> {
    if (key) {
        this.storage.setItem(key, JSON.stringify(filters));
        return of(filters);
    }
  }

    prepareFilterResponse(key: string): any {
        return {
            'list': {
                'entries': [
                    {
                        'entry': {
                            'key': key,
                            'value': this.storage.getItem(key) || '[]'
                        }
                    }
                ]
            }
        };
    }
}
