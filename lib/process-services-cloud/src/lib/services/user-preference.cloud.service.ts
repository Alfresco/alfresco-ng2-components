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
import { BaseCloudService } from './base-cloud.service';
import { AlfrescoApiService, AppConfigService, LogService } from '@alfresco/adf-core';
import { from, throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UserPreferenceCloudService extends BaseCloudService {

  contentTypes = ['application/json'];
  accepts = ['application/json'];

  constructor(
    private alfrescoApiService: AlfrescoApiService,
    private appConfigService: AppConfigService,
    private logService: LogService) {
    super();
  }

  /**
   * Gets user preferences
   * @param appName Name of the target app
   * @returns List of user preferences
   */
  getPreferences(appName: string): Observable<any> {
    if (appName || appName === '') {
      const uri = this.buildPreferenceServiceUri(appName);
      return from(this.alfrescoApiService.getInstance()
        .oauth2Auth.callCustomApi(uri, 'GET',
          null, null, null,
          null, null, this.contentTypes,
          this.accepts, null, null)
      );
    } else {
      this.logService.error('Appname is mandatory for querying preferences');
      return throwError('Appname not configured');
    }
  }

  /**
   * Gets user preference.
   * @param appName Name of the target app
   * @param key Key of the target preference
   * @returns Observable of user preferences
   */
  getPreferenceByKey(appName: string, key: string): Observable<any> {
    if (appName || appName === '') {
      const uri = this.buildPreferenceServiceUri(appName) + '/' + `${key}`;
      return from(
        this.alfrescoApiService.getInstance()
          .oauth2Auth.callCustomApi(uri, 'GET',
            null, null, null,
            null, null, this.contentTypes,
            this.accepts, null, null)
      ).pipe(catchError((error) => throwError(error)));
    } else {
      this.logService.error('Appname and key are mandatory for querying preference');
      return throwError('Appname not configured');
    }
  }

  /**
   * Creates user preference.
   * @param appName Name of the target app
   * @param key Key of the target preference
   * @newPreference Details of new user preference
   * @returns Observable of created user preferences
   */
  createPreference(appName: string, key: string, newPreference: any): Observable<any> {
    if (appName || appName === '') {
      const uri = this.buildPreferenceServiceUri(appName) + '/' + `${key}`;
      const requestPayload = JSON.stringify(newPreference);
      return from(this.alfrescoApiService.getInstance()
        .oauth2Auth.callCustomApi(uri, 'PUT',
          null, null,
          null, null, requestPayload,
          this.contentTypes, this.accepts,
          Object, null, null)
      ).pipe(
        catchError((err) => this.handleProcessError(err))
      );
    } else {
      this.logService.error('Appname  and key are  mandatory for creating preference');
      return throwError('Appname not configured');
    }
  }

  /**
   * Updates user preference.
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
   * @param appName Name of the target app
   * @param key Key of the target preference
   * @returns Observable of delete operation status
   */
  deletePreference(appName: string, key: string): Observable<any> {
    if (appName || appName === '') {
      const uri = this.buildPreferenceServiceUri(appName) + '/' + `${key}`;
      return from(this.alfrescoApiService.getInstance()
        .oauth2Auth.callCustomApi(uri, 'DELETE',
          null, null, null,
          null, null, this.contentTypes,
          this.accepts, null, null, null)
      );
    } else {
      this.logService.error('Appname and key are mandatory to delete preference');
      return throwError('Appname not configured');
    }
  }

  /**
   * Creates preference uri
   * @param appName Name of the target app
   * @returns String of preference service uri
   */
  private buildPreferenceServiceUri(appName: string): string {
    this.contextRoot = this.appConfigService.get('bpmHost', '');
    return `${this.getBasePath(appName)}/preference/v1/preferences`;
  }

  private handleProcessError(error: any) {
    return throwError(error || 'Server error');
  }
}
