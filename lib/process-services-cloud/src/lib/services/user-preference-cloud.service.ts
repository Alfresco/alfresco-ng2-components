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
import { throwError, Observable } from 'rxjs';
import { BaseCloudService } from './base-cloud.service';

@Injectable({ providedIn: 'root' })
export class UserPreferenceCloudService extends BaseCloudService implements PreferenceCloudServiceInterface {
  /**
   * Gets user preferences
   *
   * @param appName Name of the target app
   * @returns List of user preferences
   */
  getPreferences(appName: string): Observable<any> {
    if (appName) {
      const url = `${this.getBasePath(appName)}/preference/v1/preferences`;
      return this.get(url);
    } else {
      this.logService.error('Appname is mandatory for querying preferences');
      return throwError('Appname not configured');
    }
  }

  /**
   * Gets user preference.
   *
   * @param appName Name of the target app
   * @param key Key of the target preference
   * @returns Observable of user preference
   */
  getPreferenceByKey(appName: string, key: string): Observable<any> {
    if (appName) {
      const url = `${this.getBasePath(appName)}/preference/v1/preferences/${key}`;
      return this.get(url);
    } else {
      this.logService.error('Appname and key are mandatory for querying preference');
      return throwError('Appname not configured');
    }
  }

  /**
   * Creates user preference.
   *
   * @param appName Name of the target app
   * @param key Key of the target preference
   * @newPreference Details of new user preference
   * @returns Observable of created user preferences
   */
  createPreference(appName: string, key: string, newPreference: any): Observable<any> {
    if (appName) {
      const url = `${this.getBasePath(appName)}/preference/v1/preferences/${key}`;
      const payload = JSON.stringify(newPreference);

      return this.put(url, payload);
    } else {
      this.logService.error('Appname  and key are  mandatory for creating preference');
      return throwError('Appname not configured');
    }
  }

  /**
   * Updates user preference.
   *
   * @param appName Name of the target app
   * @param key Key of the target preference
   * @param updatedPreference Details of updated preference
   * @returns Observable of updated user preferences
   */
  updatePreference(appName: string, key: string, updatedPreference: any): Observable<any> {
    return this.createPreference(appName, key, updatedPreference);
  }

  /**
   * Deletes user preference by given preference key.
   *
   * @param appName Name of the target app
   * @param key Key of the target preference
   * @returns Observable of delete operation status
   */
  deletePreference(appName: string, key: string): Observable<any> {
    if (appName) {
      const url = `${this.getBasePath(appName)}/preference/v1/preferences/${key}`;
      return this.delete(url);
    } else {
      this.logService.error('Appname and key are mandatory to delete preference');
      return throwError('Appname not configured');
    }
  }
}
