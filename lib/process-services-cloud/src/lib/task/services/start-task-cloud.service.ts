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

import { Injectable } from "@angular/core";
import { BaseCloudService } from "src/lib/services/base-cloud.service";
import { AlfrescoApiService, AppConfigService, LogService } from "@alfresco/adf-core";
import { TaskDetailsCloudModel, StartTaskCloudResponseModel } from "index";
import { Observable, from, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { StartTaskCloudRequestModel } from "../start-task/models/start-task-cloud-request.model";

@Injectable()
export class StartTaskCloudService extends BaseCloudService {

    constructor(
        private apiService: AlfrescoApiService,
        private appConfigService: AppConfigService,
        private logService: LogService
    ) { super(); }

     /**
      * @deprecated in 3.5.0, use TaskCloudService instead.
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
        this.contextRoot = this.appConfigService.get('bpmHost');
        return `${this.getBasePath(appName)}/rb/v1/tasks`;
    }

    private buildRequestBody(taskDetails: any) {
        return new StartTaskCloudRequestModel(taskDetails);
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
