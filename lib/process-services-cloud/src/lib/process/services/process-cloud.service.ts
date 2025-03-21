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
import { Observable, Subject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProcessInstanceCloud } from '../start-process/models/process-instance-cloud.model';
import { BaseCloudService } from '../../services/base-cloud.service';
import { ProcessDefinitionCloud } from '../../models/process-definition-cloud.model';
import { ApplicationVersionModel, ApplicationVersionResponseModel } from '../../models/application-version.model';

@Injectable({
    providedIn: 'root'
})
export class ProcessCloudService extends BaseCloudService {
    dataChangesDetected = new Subject<ProcessInstanceCloud>();

    /**
     * Gets details of a process instance.
     *
     * @param appName Name of the app
     * @param processInstanceId ID of the process instance whose details you want
     * @returns Process instance details
     */
    getProcessInstanceById(appName: string, processInstanceId: string): Observable<ProcessInstanceCloud> {
        if (appName && processInstanceId) {
            const url = `${this.getBasePath(appName)}/query/v1/process-instances/${processInstanceId}`;

            return this.get<{ entry: ProcessInstanceCloud }>(url).pipe(
                map((res) => {
                    this.dataChangesDetected.next(res.entry);
                    return res.entry;
                })
            );
        } else {
            return throwError('AppName/ProcessInstanceId not configured');
        }
    }

    /**
     * Gets the process definitions associated with an app.
     *
     * @param appName Name of the target app
     * @returns Array of process definitions
     */
    getProcessDefinitions(appName: string): Observable<ProcessDefinitionCloud[]> {
        if (appName || appName === '') {
            const url = `${this.getBasePath(appName)}/rb/v1/process-definitions`;

            return this.get(url).pipe(map((res: any) => res.list.entries.map((processDefs) => new ProcessDefinitionCloud(processDefs.entry))));
        } else {
            return throwError('AppName not configured');
        }
    }

    /**
     * Gets the application versions associated with an app.
     *
     * @param appName Name of the target app
     * @returns Array of Application Version Models
     */
    getApplicationVersions(appName: string): Observable<ApplicationVersionModel[]> {
        if (appName) {
            const url = `${this.getBasePath(appName)}/query/v1/applications`;

            return this.get(url).pipe(map((appEntities: ApplicationVersionResponseModel) => appEntities.list.entries));
        } else {
            return throwError('AppName not configured');
        }
    }

    /**
     * Cancels a process.
     *
     * @param appName Name of the app
     * @param processInstanceId Id of the process to cancel
     * @returns Operation Information
     */
    cancelProcess(appName: string, processInstanceId: string): Observable<ProcessInstanceCloud> {
        if (appName && processInstanceId) {
            const queryUrl = `${this.getBasePath(appName)}/rb/v1/process-instances/${processInstanceId}`;
            return this.delete(queryUrl).pipe(
                map((res: any) => {
                    this.dataChangesDetected.next(res.entry);
                    return res.entry;
                })
            );
        } else {
            return throwError('App name and process id not configured');
        }
    }
}
