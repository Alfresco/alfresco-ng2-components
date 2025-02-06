/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Observable, from } from 'rxjs';
import { AlfrescoApiService } from '@alfresco/adf-content-services';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AppsProcessService {
    private _appsApi: RuntimeAppDefinitionsApi;
    get appsApi(): RuntimeAppDefinitionsApi {
        this._appsApi = this._appsApi ?? new RuntimeAppDefinitionsApi(this.apiService.getInstance());
        return this._appsApi;
    }

    constructor(private apiService: AlfrescoApiService) {}

    /**
     * Gets a list of deployed apps for this user.
     *
     * @returns The list of deployed apps
     */
    getDeployedApplications(): Observable<AppDefinitionRepresentation[]> {
        return from(this.appsApi.getAppDefinitions()).pipe(map((response) => response.data || []));
    }

    /**
     * Gets a list of deployed apps for this user, where the app name is `name`.
     *
     * @param name Name of the app
     * @returns The list of deployed apps
     */
    getDeployedApplicationsByName(name: string): Observable<AppDefinitionRepresentation> {
        return this.getDeployedApplications().pipe(map((response) => response.find((app) => app.name === name)));
    }
}
