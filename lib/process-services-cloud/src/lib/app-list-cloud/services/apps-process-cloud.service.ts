/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { AppConfigService, LogService } from '@alfresco/adf-core';
import { ApplicationInstanceModel } from '../models/application-instance.model';

@Injectable()
export class AppsProcessCloudService {

    contextRoot = '';

    constructor(
        private apiService: AlfrescoApiService,
        private logService: LogService,
        private appConfig: AppConfigService) {
        this.contextRoot = this.appConfig.get('bpmHost', '');
    }

    /**
     * Gets a list of deployed apps for this user by status.
     * @returns The list of deployed apps
     */
    getDeployedApplicationsByStatus(status: string): Observable<ApplicationInstanceModel[]> {
        const api: any = this.apiService.getInstance().oauth2Auth;
        api.basePath = this.contextRoot;
        const path = 'alfresco-deployment-service/v1/applications';
        const httpMethod = 'GET', pathParams = {}, queryParams = {},
            headerParams = {}, formParams = {}, bodyParam = {}, authNames = [],
            contentTypes = ['application/json'], accepts = ['application/json'];
        return from(api.callApi(
            path, httpMethod,
            pathParams, queryParams, headerParams, formParams, bodyParam,
            authNames, contentTypes, accepts, [], ''
        ))
            .pipe(
                map((apps: Array<{}>) => {
                    return apps.filter((app: ApplicationInstanceModel) => app.status === status)
                        .map((app) => {
                            return new ApplicationInstanceModel(app);
                        });
                }
                ),
                catchError(err => this.handleError(err))
            );
    }

    private handleError(error?: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
