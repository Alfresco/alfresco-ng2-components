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
import { throwError as observableThrowError, Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppConfigService, LogService, AlfrescoApiService } from '@alfresco/adf-core';

@Injectable()
export class IdentityUserService {

  constructor(
    private apiService: AlfrescoApiService,
    private appConfigService: AppConfigService,
    private logService: LogService
  ) { }

  /**
   * Finds groups filtered by username.
   * @param username Object containing the name filter string
   * @returns List of users information
   */
  findUsersByUsername(username: string): Observable<any> {
    const url = this.getUserApi();
    const httpMethod = 'GET', pathParams = {}, queryParams = { search: username }, bodyParam = {}, headerParams = {},
      formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

    return (from(this.apiService.getInstance().oauth2Auth.callCustomApi(
      url, httpMethod, pathParams, queryParams,
      headerParams, formParams, bodyParam,
      contentTypes, accepts, Object, null, null)
    )).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  private getUserApi() {
    return `${this.appConfigService.get('identityHost')}/users`;
 }

  private handleError(error: any) {
    this.logService.error(error);
    return observableThrowError(error || 'Server error');
  }
}
