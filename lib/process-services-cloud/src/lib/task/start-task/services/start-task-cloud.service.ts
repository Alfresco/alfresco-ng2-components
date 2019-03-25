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

import { Injectable } from '@angular/core';
import {
    AlfrescoApiService,
    AppConfigService,
    LogService
} from '@alfresco/adf-core';
import { from, Observable, throwError } from 'rxjs';
import { StartTaskCloudRequestModel } from '../models/start-task-cloud-request.model';
import { TaskDetailsCloudModel, StartTaskCloudResponseModel } from '../models/task-details-cloud.model';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class StartTaskCloudService {

    constructor(
        private apiService: AlfrescoApiService,
        private appConfigService: AppConfigService,
        private logService: LogService
    ) {}

    /**
     * Creates a new standalone task.
     * @param taskDetails Details of the task to create
     * @returns Details of the newly created task
     */
    createNewTask(taskDetails: TaskDetailsCloudModel): Observable<TaskDetailsCloudModel> {
        const queryUrl = this.buildCreateTaskUrl(taskDetails.appName);
        const bodyParam = JSON.stringify(this.buildRequestBody(taskDetails));
        const pathParams = {}, queryParams = {}, headerParams = {},
            formParams = {},  contentTypes = ['application/json'], accepts = ['application/json'];

        return from(
            this.apiService
                .getInstance()
                .oauth2Auth.callCustomApi(
                    queryUrl, 'POST', pathParams, queryParams,
                    headerParams, formParams, bodyParam,
                    contentTypes, accepts, null, null)
                ).pipe(
                    map((response: StartTaskCloudResponseModel) => {
                        return new TaskDetailsCloudModel(response.entry);
                    }),
                    catchError((err) => this.handleError(err))
            );
    }

    private buildCreateTaskUrl(appName: string): any {
        return `${this.appConfigService.get('bpmHost')}/${appName}-rb/v1/tasks`;
    }

    private buildRequestBody(taskDetails: any) {
        return new StartTaskCloudRequestModel(taskDetails);
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
