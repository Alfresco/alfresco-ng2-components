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
import { throwError } from 'rxjs';
import { BaseCloudService } from '../../services/base-cloud.service';

@Injectable({
    providedIn: 'root'
})
export class ProcessCloudService extends BaseCloudService {

    constructor(apiService: AlfrescoApiService,
                appConfigService: AppConfigService,
                private logService: LogService) {
        super(apiService);
        this.contextRoot = appConfigService.get('bpmHost', '');
    }

    /**
     * Deletes a process.
     * @param appName Name of the app
     * @param processId Id of the process to delete
     * @returns Operation Information
     */
    deleteProcess(appName: string, processId: string) {
        if (appName && processId) {
            const queryUrl = `${this.getBasePath(appName)}/rb/v1/process-instances/${processId}`;
            return this.delete(queryUrl);
        } else {
            this.logService.error('App name and Process id are mandatory for deleting a process');
            return throwError('App name and process id not configured');
        }
    }
}
