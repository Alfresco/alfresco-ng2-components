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
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProcessInstanceCloud } from '../models/process-instance-cloud.model';
import { ProcessPayloadCloud } from '../models/process-payload-cloud.model';
import { ProcessDefinitionCloud } from '../../../models/process-definition-cloud.model';
import { BaseCloudService } from '../../../services/base-cloud.service';
import { TaskVariableCloud } from '../../../form/models/task-variable-cloud.model';

export interface QueryParams {
    include: 'variables';
}

@Injectable({
    providedIn: 'root'
})
export class StartProcessCloudService extends BaseCloudService {
    /**
     * Gets the process definitions associated with an app.
     *
     * @param appName Name of the target app
     * @param queryParams optional query parameters
     * @returns Array of process definitions
     */
    getProcessDefinitions(appName: string, queryParams?: QueryParams): Observable<ProcessDefinitionCloud[]> {
        if (appName || appName === '') {
            const url = `${this.getBasePath(appName)}/rb/v1/process-definitions`;

            return this.get(url, queryParams).pipe(
                map((res: any) => res.list.entries.map((processDefs) => new ProcessDefinitionCloud(processDefs.entry)))
            );
        } else {
            return throwError('AppName not configured');
        }
    }

    /**
     * Starts a process based on a process definition, name, form values or variables.
     *
     * @param appName name of the Application
     * @param payload Details of the process (definition key, name, variables, etc)
     * @returns Details of the process instance just started
     */
    startProcess(appName: string, payload: ProcessPayloadCloud): Observable<ProcessInstanceCloud> {
        const url = `${this.getBasePath(appName)}/rb/v1/process-instances`;
        payload.payloadType = 'StartProcessPayload';

        return this.post(url, payload).pipe(map((result: any) => result.entry));
    }

    startProcessWithForm(appName: string, formId: string, version: number, payload: any): Observable<ProcessInstanceCloud> {
        const url = `${this.getBasePath(appName)}/form/v1/forms/${formId}/submit/versions/${version}`;
        payload.payloadType = 'StartProcessPayload';

        return this.post(url, payload);
    }

    /**
     * Update an existing process instance
     *
     * @param appName name of the Application
     * @param processInstanceId process instance to update
     * @param payload Details of the process (definition key, name, variables, etc)
     * @returns Details of the process instance just started
     */
    updateProcess(appName: string, processInstanceId: string, payload: ProcessPayloadCloud): Observable<ProcessInstanceCloud> {
        const url = `${this.getBasePath(appName)}/rb/v1/process-instances/${processInstanceId}`;
        payload.payloadType = 'UpdateProcessPayload';

        return this.put(url, payload).pipe(map((processInstance: any) => processInstance.entry));
    }

    /**
     * Delete an existing process instance
     *
     * @param appName Application name
     * @param processInstanceId the identifier of the process instance to update
     * @returns Observable<void>
     */
    deleteProcess(appName: string, processInstanceId: string): Observable<void> {
        const url = `${this.getBasePath(appName)}/rb/v1/process-instances/${processInstanceId}`;

        return this.delete(url);
    }

    /**
     * Gets the static values mapped to the start form of a process definition.
     *
     * @param appName Name of the app
     * @param processDefinitionId ID of the target process definition
     * @returns Static mappings for the start event
     */
    getStartEventFormStaticValuesMapping(appName: string, processDefinitionId: string): Observable<TaskVariableCloud[]> {
        const apiUrl = `${this.getBasePath(appName)}/rb/v1/process-definitions/${processDefinitionId}/static-values`;
        return this.get(apiUrl).pipe(
            map((res: { [key: string]: any }) => {
                const result = [];
                if (res) {
                    Object.keys(res).forEach((mapping) => result.push(new TaskVariableCloud({ name: mapping, value: res[mapping] })));
                }
                return result;
            })
        );
    }

    /**
     * Gets the constants mapped to the start form of a process definition.
     *
     * @param appName Name of the app
     * @param processDefinitionId ID of the target process definition
     * @returns Constants values for the start event
     */
    getStartEventConstants(appName: string, processDefinitionId: string): Observable<TaskVariableCloud[]> {
        const apiUrl = `${this.getBasePath(appName)}/rb/v1/process-definitions/${processDefinitionId}/constant-values`;
        return this.get(apiUrl).pipe(
            map((res: { [key: string]: any }) => {
                const result = [];
                if (res) {
                    Object.keys(res).forEach((constant) =>
                        result.push(new TaskVariableCloud({ name: constant, value: res[constant], type: 'string' }))
                    );
                }
                return result;
            })
        );
    }
}
