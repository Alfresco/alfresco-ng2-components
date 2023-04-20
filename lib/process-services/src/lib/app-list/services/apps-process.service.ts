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
import { RuntimeAppDefinitionsApi, AppDefinitionRepresentation } from '@alfresco/js-api';
import { Observable, from, throwError } from 'rxjs';
import { AlfrescoApiService, LogService } from '@alfresco/adf-core';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AppsProcessService {

    private _appsApi: RuntimeAppDefinitionsApi;
    get appsApi(): RuntimeAppDefinitionsApi {
        this._appsApi = this._appsApi ?? new RuntimeAppDefinitionsApi(this.apiService.getInstance());
        return this._appsApi;
    }

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    /**
     * Gets a list of deployed apps for this user.
     *
     * @returns The list of deployed apps
     */
    getDeployedApplications(): Observable<AppDefinitionRepresentation[]> {
        return from(this.appsApi.getAppDefinitions())
            .pipe(
                map((response: any) => response.data),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets a list of deployed apps for this user, where the app name is `name`.
     *
     * @param name Name of the app
     * @returns The list of deployed apps
     */
    getDeployedApplicationsByName(name: string): Observable<AppDefinitionRepresentation> {
        return from(this.appsApi.getAppDefinitions())
            .pipe(
                map((response: any) => response.data.find((app) => app.name === name)),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets the details for a specific app ID number.
     *
     * @param appId ID of the target app
     * @returns Details of the app
     */
    getApplicationDetailsById(appId: number): Observable<AppDefinitionRepresentation> {
        return from(this.appsApi.getAppDefinitions())
            .pipe(
                map((response: any) => response.data.find((app) => app.id === appId)),
                catchError((err) => this.handleError(err))
            );
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }

}
