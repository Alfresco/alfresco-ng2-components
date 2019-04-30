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

import { AlfrescoApiService, AppConfigService, LogService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProcessInstanceCloud } from '../models/process-instance-cloud.model';
import { ProcessPayloadCloud } from '../models/process-payload-cloud.model';
import { ProcessDefinitionCloud } from '../models/process-definition-cloud.model';
import { BaseCloudService } from '../../../services/base-cloud.service';

@Injectable({
    providedIn: 'root'
})
export class StartProcessCloudService extends BaseCloudService {

    contextRoot: string;
    contentTypes = ['application/json'];
    accepts = ['application/json'];
    returnType = Object;

    constructor(private alfrescoApiService: AlfrescoApiService,
                private logService: LogService,
                private appConfigService: AppConfigService) {
        super();
        this.contextRoot = this.appConfigService.get('bpmHost', '');
    }

    /**
     * Gets the process definitions associated with an app.
     * @param appName Name of the target app
     * @returns Array of process definitions
     */
    getProcessDefinitions(appName: string): Observable<ProcessDefinitionCloud[]> {

        if (appName || appName === '') {
            const queryUrl = `${this.getBasePath(appName)}/rb/v1/process-definitions`;

            return from(this.alfrescoApiService.getInstance()
                .oauth2Auth.callCustomApi(queryUrl, 'GET',
                    null, null,
                    null, null, null,
                    this.contentTypes, this.accepts,
                    this.returnType, null, null)
            ).pipe(
                map((res: any) => {
                    return res.list.entries.map((processDefs) => new ProcessDefinitionCloud(processDefs.entry));
                }),
                catchError((err) => this.handleProcessError(err))
            );
        } else {
            this.logService.error('AppName is mandatory for querying task');
            return throwError('AppName not configured');
        }
    }

    /**
     * Starts a process based on a process definition, name, form values or variables.
     * @param appName name of the Application
     * @param requestPayload Details of the process (definition key, name, variables, etc)
     * @returns Details of the process instance just started
     */
    startProcess(appName: string, requestPayload: ProcessPayloadCloud): Observable<ProcessInstanceCloud> {

        const queryUrl = `${this.getBasePath(appName)}/rb/v1/process-instances`;

        return from(this.alfrescoApiService.getInstance()
            .oauth2Auth.callCustomApi(queryUrl, 'POST',
                null, null,
                null, null, requestPayload,
                this.contentTypes, this.accepts,
                this.returnType, null, null)
        ).pipe(
            map((processInstance) => new ProcessInstanceCloud(processInstance)),
            catchError((err) => this.handleProcessError(err))
        );
    }

    private handleProcessError(error: any) {
        return throwError(error || 'Server error');
    }
}
