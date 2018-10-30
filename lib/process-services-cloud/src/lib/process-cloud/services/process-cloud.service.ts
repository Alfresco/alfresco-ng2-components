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

import { AlfrescoApiService, FormValues, AppConfigService, LogService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProcessDefinitionRepresentationCloud } from '../models/process-definition-cloud.model';
import { ProcessInstanceVariableCloud } from '../models/process-instance-variable-cloud.model';
import { ProcessInstanceCloud } from '../models/process-instance-cloud.model';

@Injectable({
    providedIn: 'root'
})
export class ProcessCloudService {

    constructor(private alfrescoApiService: AlfrescoApiService,
                private appConfigService: AppConfigService,
                private logService: LogService) {
    }

    /**
     * Gets process definitions associated with an app.
     * @param appId ID of a target app
     * @returns Array of process definitions
     */
    getProcessDefinitions(appName?: string): Observable<ProcessDefinitionRepresentationCloud[]> {

        if (appName) {
            let queryUrl = this.buildQueryUrl(appName);

            return from(this.alfrescoApiService.getInstance()
                .oauth2Auth.callCustomApi(queryUrl, 'GET',
                    null, null, null,
                    null, null, null, ['application/json'],
                    ['application/json'], Object, null, null)
            ).pipe(
                map(this.extractData),
                map(processDefs => processDefs.map((pd) => new ProcessDefinitionRepresentationCloud(pd.entry))),
                catchError(err => this.handleProcessError(err))
            );
        } else {
            this.logService.error('AppName is mandatory for querying task');
            return throwError('AppName not configured');
        }
    }

    /**
     * Starts a process based on a process definition, name, form values or variables.
     * @param appName name of the Application
     * @param processDefinitionId Process definition ID
     * @param name Process name
     * @param outcome Process outcome
     * @param startFormValues Values for the start form
     * @param variables Array of process instance variables
     * @returns Details of the process instance just started
     */
    startProcess(appName: string,
                 processDefinitionId: string,
                 name: string,
                 outcome?: string,
                 startFormValues?: FormValues,
                 variables?: ProcessInstanceVariableCloud[]
    ): Observable<ProcessInstanceCloud> {

        let requestPayload: any = {
            processInstanceName: name,
            processDefinitionId: processDefinitionId,
            payloadType: 'StartProcessPayload'
        };
        if (outcome) {
            requestPayload.outcome = outcome;
        }
        if (startFormValues) {
            requestPayload.values = startFormValues;
        }
        if (variables) {
            requestPayload.variables = variables;
        }

        let queryUrl = this.buildStartProcessUrl(appName);

        return from(this.alfrescoApiService.getInstance()
            .oauth2Auth.callCustomApi(
                queryUrl,
                'POST',
                null,
                null,
                null,
                null,
                requestPayload,
                null,
                ['application/json'],
                ['application/json'],
                Object,
                null,
                null)
        ).pipe(
            map((processInstance) => new ProcessInstanceCloud(processInstance)),
            catchError(err => this.handleProcessError(err))
        );
    }

    private buildQueryUrl(appName: string) {
        return `${this.appConfigService.get('bpmHost', '')}/${appName}-rb/v1/process-definitions`;
    }

    private buildStartProcessUrl(appName: string) {
        return `${this.appConfigService.get('bpmHost', '')}/${appName}-rb/v1/process-instances`;
    }

    private extractData(res: any) {
        return res.list.entries || {};
    }

    private handleProcessError(error: any) {
        return throwError(error || 'Server error');
    }
}
