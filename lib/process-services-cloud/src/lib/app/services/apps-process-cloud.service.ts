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
import { Observable, from, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AlfrescoApiService, AppConfigService, LogService } from '@alfresco/adf-core';
import { Oauth2Auth } from '@alfresco/js-api';
import { ApplicationInstanceModel } from '../models/application-instance.model';

@Injectable({ providedIn: 'root' })
export class AppsProcessCloudService {

    deployedApps: ApplicationInstanceModel[];

    constructor(
        private apiService: AlfrescoApiService,
        private logService: LogService,
        private appConfigService: AppConfigService) {
        this.loadApps();
    }

    /**
     * Gets a list of deployed apps for this user by status.
     * @param status Required status value
     * @param role to filter the apps
     * @returns The list of deployed apps
     */
    getDeployedApplicationsByStatus(status: string, role?: string): Observable<ApplicationInstanceModel[]> {
        return this.hasDeployedApps() ? of(this.deployedApps) : this.getApplicationsByStatus(status, role);
    }

    hasDeployedApps(): boolean {
        return this.deployedApps && this.deployedApps.length > 0;
    }

    loadApps() {
        const apps = this.appConfigService.get<any>('alfresco-deployed-apps', []);
        apps.map((app) => {
            app.theme = app.theme ? app.theme : 'theme-1';
            app.icon = app.icon ? app.icon : 'favorite';
        });
        this.deployedApps = apps;
    }

    private getApplicationsByStatus(status: string, role?: string): Observable<ApplicationInstanceModel[]> {
        if (status === '') {
            return of([]);
        }
        const api: Oauth2Auth = this.apiService.getInstance().oauth2Auth;
        const path = this.getApplicationUrl();
        const pathParams = {}, queryParams = { status: status, roles : role, sort: 'name' },
            headerParams = {}, formParams = {}, bodyParam = {},
            contentTypes = ['application/json'], accepts = ['application/json'];

        return from(api.callCustomApi(path, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts))
            .pipe(
                map((applications: any) => {
                    return applications.list.entries.map((application) => {
                        return new ApplicationInstanceModel(application.entry);
                    });
                }),
                catchError((err) => this.handleError(err))
            );
    }

    private getApplicationUrl(): string {
        return `${this.appConfigService.get('bpmHost')}/deployment-service/v1/applications`;
    }

    private handleError(error?: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
