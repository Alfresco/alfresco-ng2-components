/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { LogService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { ProcessInstanceCloud } from '../start-process/models/process-instance-cloud.model';
import { ProcessDefinitionCloud } from '../../models/process-definition-cloud.model';
import { ApplicationVersionModel } from '../../models/application-version.model';
import { processInstancePlaceholdersCloudMock, processInstanceDetailsCloudMock } from './process-instance-details-cloud.mock';
import { fakeProcessDefinitions } from '../start-process/mock/start-process.component.mock';
import { mockAppVersions } from '../process-filters/mock/process-filters-cloud.mock';
import { ProcessCloudInterface } from '../services/process-cloud.interface';

@Injectable({
    providedIn: 'root'
})
export class ProcessCloudServiceMock implements ProcessCloudInterface {

    dataChangesDetected = new Subject<ProcessInstanceCloud>();

    constructor(private logService: LogService) { }

    getProcessInstanceById(appName: string, processInstanceId: string): Observable<ProcessInstanceCloud> {
        if (appName === 'app-placeholders' && processInstanceId) {
            return of(processInstancePlaceholdersCloudMock);
        }

        if (appName && processInstanceId) {
            return of(processInstanceDetailsCloudMock);

        } else {
            this.logService.error('AppName and ProcessInstanceId are mandatory for querying a process');
            return throwError('AppName/ProcessInstanceId not configured');
        }
    }

    getProcessDefinitions(appName: string): Observable<ProcessDefinitionCloud[]> {
        if (appName || appName === '') {
            return of(fakeProcessDefinitions);

        } else {
            this.logService.error('AppName is mandatory for querying task');
            return throwError('AppName not configured');
        }
    }

    getApplicationVersions(appName: string): Observable<ApplicationVersionModel[]> {
        if (appName) {
            return of(mockAppVersions);
        } else {
            this.logService.error('AppName is mandatory for querying the versions of an application');
            return throwError('AppName not configured');
        }
    }

    cancelProcess(appName: string, processInstanceId: string): Observable<ProcessInstanceCloud> {
        if (appName && processInstanceId) {
            return of();
        } else {
            this.logService.error('App name and Process id are mandatory for deleting a process');
            return throwError('App name and process id not configured');
        }
    }
}
