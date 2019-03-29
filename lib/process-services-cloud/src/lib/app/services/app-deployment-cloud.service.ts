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

import { AppConfigService, LogService, AlfrescoApiService } from '@alfresco/adf-core';
import { Observable, of } from 'rxjs';
import { AppsProcessCloudService } from './apps-process-cloud.service';
import { Injectable } from '@angular/core';
import { ApplicationInstanceModel } from '../models/application-instance.model';

@Injectable()
export class ApplicationDeploymentCloudService extends AppsProcessCloudService {

    deployedApps: ApplicationInstanceModel[];

    constructor(apiService: AlfrescoApiService, logService: LogService, private appConfig: AppConfigService) {
        super(apiService, logService, appConfig);

        this.loadApps();
    }

    getDeployedApplicationsByStatus(status: string): Observable<ApplicationInstanceModel[]> {
        return this.hasDeployedApps() ? of(this.deployedApps) : super.getDeployedApplicationsByStatus(status);
    }

    hasDeployedApps(): boolean {
        return this.deployedApps && this.deployedApps.length > 0;
    }

    loadApps() {
        const apps = this.appConfig.get<any>('alfresco-deployed-apps', []);
        apps.map((app) => {
            app.theme = app.theme ? app.theme : 'theme-1';
            app.icon = app.icon ? app.icon : 'favorite';
        });
        this.deployedApps = apps;
    }
}
