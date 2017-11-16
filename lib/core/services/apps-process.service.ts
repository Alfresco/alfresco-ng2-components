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
import { AppDefinitionRepresentation } from 'alfresco-js-api';
import { Observable } from 'rxjs/Rx';
import { AlfrescoApiService } from './alfresco-api.service';
import { LogService } from './log.service';

@Injectable()
export class AppsProcessService {

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    getDeployedApplications(): Observable<AppDefinitionRepresentation[]> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.appsApi.getAppDefinitions())
            .map((response: any) => {
                return response.data;
            })
            .catch(err => this.handleError(err));
    }

    getDeployedApplicationsByName(name: string): Observable<AppDefinitionRepresentation> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.appsApi.getAppDefinitions())
            .map((response: any) => {
                return response.data.find(app => app.name === name);
            })
            .catch(err => this.handleError(err));
    }

    getApplicationDetailsById(appId: number): Observable<AppDefinitionRepresentation> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.appsApi.getAppDefinitions())
            .map((response: any) => {
                return response.data.find(app => app.id === appId);
            })
            .catch(err => this.handleError(err));
    }

    private handleError(error: any) {
        this.logService.error(error);
        return Observable.throw(error || 'Server error');
    }

}
