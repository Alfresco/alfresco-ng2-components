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
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfigService } from '@alfresco/adf-core';
import { ApplicationInstanceModel } from '../models/application-instance.model';
import { Environment } from '../../common/interface/environment.interface';
import { AdfHttpClient } from '@alfresco/adf-core/api';
import { RequestOptions } from '@alfresco/js-api';

@Injectable({ providedIn: 'root' })
export class AppsProcessCloudService {
    deployedApps: ApplicationInstanceModel[];

    constructor(
        private readonly adfHttpClient: AdfHttpClient,
        private readonly appConfigService: AppConfigService
    ) {
        this.loadApps();
    }

    /**
     * Gets a list of deployed apps for this user by status.
     *
     * @param status Required status value
     * @param roles to filter the apps
     * @returns The list of deployed apps
     */
    getDeployedApplicationsByStatus(status: string, roles?: string | string[]): Observable<ApplicationInstanceModel[]> {
        return this.hasDeployedApps() ? of(this.deployedApps) : this.getApplicationsByStatus(status, roles);
    }

    hasDeployedApps(): boolean {
        return this.deployedApps && this.deployedApps.length > 0;
    }

    loadApps() {
        const apps = this.appConfigService.get<{ theme: string; icon: string }[]>('alfresco-deployed-apps', []);
        for (const app of apps) {
            app.theme = app.theme ?? 'theme-1';
            app.icon = app.icon ?? 'favorite';
        }

        this.deployedApps = apps;
    }

    getApplicationLabel(application: ApplicationInstanceModel, environmentList?: Environment[]): string {
        const envName = environmentList?.find((env: Environment) => env.id === application.environmentId)?.name;

        if (application.environmentId && environmentList && envName) {
            return `${application.displayName} (${envName})`;
        } else {
            return application.displayName;
        }
    }

    private getApplicationsByStatus(status: string, roles?: string | string[]): Observable<ApplicationInstanceModel[]> {
        if (status === '') {
            return of([]);
        }
        const path = this.getApplicationUrl();
        const pathParams = {};
        const queryParams = { status, roles, sort: 'name' };
        const httpMethod = 'GET';
        const headerParams = {};
        const formParams = {};
        const bodyParam = {};
        const contentTypes = ['application/json'];
        const accepts = ['application/json'];
        const requestOptions: RequestOptions = {
            path,
            pathParams,
            queryParams,
            headerParams,
            formParams,
            bodyParam,
            contentTypes,
            accepts,
            httpMethod
        };

        return from(this.adfHttpClient.request(path, requestOptions)).pipe(
            map((applications) => applications.list.entries.map((application) => application.entry))
        );
    }

    private getApplicationUrl(): string {
        return `${this.appConfigService.get('bpmHost')}/deployment-service/v1/applications`;
    }
}
