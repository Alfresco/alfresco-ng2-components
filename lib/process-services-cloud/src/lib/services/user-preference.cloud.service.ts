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
import { ProcessServicesCloudResponse } from '../models';

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

  getPreferences(appName: string): Observable<ProcessServicesCloudResponse | Error> {
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

  updatePreference(appName: string, key: string, updatedPreference: any): Observable<any> {
    return this.createPreference(appName, key, updatedPreference);
  }

  deletePreference(appName: string, key: string): Observable<any> {
    if (appName || appName === '') {
      const uri = this.buildPreferenceServiceUri(appName) + '/' + `${key}`;
      return from(this.alfrescoApiService.getInstance()
        .oauth2Auth.callCustomApi(uri, 'DELETE',
          null, null, null,
          null, null, null,
          null, null, null)
      );
    } else {
      this.logService.error('Appname and key are mandatory to delete preference');
      return throwError('Appname not configured');
    }
  }

  private buildPreferenceServiceUri(appName: string) {
    this.contextRoot = this.appConfigService.get('bpmHost', '');
    return `${this.getBasePath(appName)}/preference/v1/preferences`;
  }

  private handleProcessError(error: any) {
    return throwError(error || 'Server error');
  }
}
