
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
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProcessInstanceCloud } from '../../start-process/models/process-instance-cloud.model';
import { BaseCloudService } from '../../../services/base-cloud.service';

@Injectable({
    providedIn: 'root'
})
export class ProcessHeaderCloudService extends BaseCloudService {

    constructor(apiService: AlfrescoApiService,
                appConfigService: AppConfigService,
                private logService: LogService) {
        super(apiService);
        this.contextRoot = appConfigService.get('bpmHost', '');
    }

    /**
     * Gets details of a process instance.
     * @param appName Name of the app
     * @param processInstanceId ID of the process instance whose details you want
     * @returns Process instance details
     */
    getProcessInstanceById(appName: string, processInstanceId: string): Observable<ProcessInstanceCloud> {
        if ((appName || appName === '') && processInstanceId) {
            const url = `${this.getBasePath(appName)}/query/v1/process-instances/${processInstanceId}`;

            return this.get(url).pipe(
                map((res: any) => {
                    return new ProcessInstanceCloud(res.entry);
                })
            );
        } else {
            this.logService.error('AppName and ProcessInstanceId are mandatory for querying a task');
            return throwError('AppName/ProcessInstanceId not configured');
        }
    }
}
