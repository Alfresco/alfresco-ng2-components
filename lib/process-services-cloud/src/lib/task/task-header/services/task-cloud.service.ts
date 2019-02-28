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
import { AlfrescoApiService, LogService, AppConfigService, StorageService } from '@alfresco/adf-core';
import { from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaskDetailsCloudModel } from '../../start-task/models/task-details-cloud.model';

@Injectable({
    providedIn: 'root'
})
export class TaskCloudService {

    constructor(
        private apiService: AlfrescoApiService,
        private appConfigService: AppConfigService,
        private logService: LogService,
        private storage: StorageService
    ) { }

    /**
     * Complete a task.
     * @param appName Name of the app
     * @param taskId ID of the task to complete
     * @returns Details of the task that was completed
     */
    completeTask(appName: string, taskId: string) {
        const queryUrl = this.buildCompleteTaskUrl(appName, taskId);
        const bodyParam = { 'payloadType': 'CompleteTaskPayload' };
        const pathParams = {}, queryParams = {}, headerParams = {},
            formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];

        return from(
            this.apiService
                .getInstance()
                .oauth2Auth.callCustomApi(
                    queryUrl, 'POST', pathParams, queryParams,
                    headerParams, formParams, bodyParam,
                    contentTypes, accepts, null, null)
        ).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Validate if a task can be completed.
     * @param taskDetails task details object
     * @returns Boolean value if the task can be completed
     */
    canCompleteTask(taskDetails: TaskDetailsCloudModel): boolean {
        const currentUser = this.storage.getItem('USERNAME');
        return taskDetails.owner === currentUser && !this.isCompleted(taskDetails);
    }

    private isCompleted(taskDetails: TaskDetailsCloudModel) {
        return taskDetails && taskDetails.status && taskDetails.status.toLowerCase() === 'completed';
    }

    private buildCompleteTaskUrl(appName: string, taskId: string): any {
        return `${this.appConfigService.get('bpmHost')}/${appName}-rb/v1/tasks/${taskId}/complete`;
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }

}
