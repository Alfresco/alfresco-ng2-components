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

import { AlfrescoApiService, LogService, AppConfigService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProcessInstanceCloud } from '../../start-process/public-api';

@Injectable({
    providedIn: 'root'
})
export class ProcessHeaderCloudService {
    contextRoot: string;
    contentTypes = ['application/json'];
    accepts = ['application/json'];
    returnType = Object;

    constructor(private alfrescoApiService: AlfrescoApiService,
                private appConfigService: AppConfigService,
                private logService: LogService) {
        this.contextRoot = this.appConfigService.get('bpmHost', '');
    }

    /**
     * Gets details of a process instance.
     * @param appName Name of the app
     * @param processInstanceId ID of the process instance whose details you want
     * @returns Process instance details
     */
    getProcessInstanceById(appName: string, processInstanceId: string): Observable<ProcessInstanceCloud> {
        if (appName && processInstanceId) {

            const queryUrl = `${this.contextRoot}/${appName}-query/v1/process-instances/${processInstanceId}`;
            return from(this.alfrescoApiService.getInstance()
                .oauth2Auth.callCustomApi(queryUrl, 'GET',
                    null, null, null,
                    null, null,
                    this.contentTypes, this.accepts,
                    this.returnType, null, null)
            ).pipe(
                map((res: any) => {
                    return new ProcessInstanceCloud(res.entry);
                }),
                catchError((err) => this.handleError(err))
            );
        } else {
            this.logService.error('AppName and ProcessInstanceId are mandatory for querying a task');
            return throwError('AppName/ProcessInstanceId not configured');
        }
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
