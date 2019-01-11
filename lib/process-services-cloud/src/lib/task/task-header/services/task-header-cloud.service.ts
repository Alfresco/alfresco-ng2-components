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

import { AlfrescoApiService, LogService, AppConfigService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TaskDetailsCloudModel } from '../../start-task/models/task-details-cloud.model';

@Injectable({
    providedIn: 'root'
})
export class TaskHeaderCloudService {
    contextRoot: string;
    contentTypes = ['application/json'];
    accepts = ['application/json'];
    returnType = Object;

    constructor(private alfrescoApiService: AlfrescoApiService,
                private appConfigService: AppConfigService,
                private logService: LogService) {
        this.contextRoot = this.appConfigService.get('bpmHost', '');
    }

    getTaskById(appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        if (appName && taskId) {

            let queryUrl = `${this.contextRoot}/${appName}-query/v1/tasks/${taskId}`;
            return from(this.alfrescoApiService.getInstance()
                .oauth2Auth.callCustomApi(queryUrl, 'GET',
                    null, null, null,
                    null, null,
                    this.contentTypes, this.accepts,
                    this.returnType, null, null)
            ).pipe(
                map((res: any) => {
                    return new TaskDetailsCloudModel(res.entry);
                }),
                catchError((err) => this.handleError(err))
            );
        } else {
            this.logService.error('AppName and TaskId are mandatory for querying a task');
            return throwError('AppName/TaskId not configured');
        }
    }

    updateTask(appName: string, taskId: string, updatePayload: any): any {
        if (appName && taskId) {

            updatePayload.payloadType = 'UpdateTaskPayload';

            let queryUrl = `${this.contextRoot}/${appName}-rb/v1/tasks/${taskId}`;
            return from(this.alfrescoApiService.getInstance()
                .oauth2Auth.callCustomApi(queryUrl, 'PUT',
                    null, null, null,
                    null, updatePayload,
                    this.contentTypes, this.accepts,
                    this.returnType, null, null)
            ).pipe(
                map((res: any) => {
                    return new TaskDetailsCloudModel(res.entry);
                }),
                catchError((err) => this.handleError(err))
            );
        } else {
            this.logService.error('AppName and TaskId are mandatory for querying a task');
            return throwError('AppName/TaskId not configured');
        }
    }

    claimTask(appName: string, taskId: string, assignee: string): any {
        if (appName && taskId) {

            let queryUrl = `${this.contextRoot}/${appName}-rb/v1/tasks/${taskId}/claim?assignee=${assignee}`;
            return from(this.alfrescoApiService.getInstance()
                .oauth2Auth.callCustomApi(queryUrl, 'POST',
                    null, null, null,
                    null, null,
                    this.contentTypes, this.accepts,
                    this.returnType, null, null)
            ).pipe(
                map((res: any) => {
                    return new TaskDetailsCloudModel(res.entry);
                }),
                catchError((err) => this.handleError(err))
            );
        } else {
            this.logService.error('AppName and TaskId are mandatory for querying a task');
            return throwError('AppName/TaskId not configured');
        }
    }

    unclaimTask(appName: string, taskId: string): any {
        if (appName && taskId) {

            let queryUrl = `${this.contextRoot}/${appName}-rb/v1/tasks/${taskId}/release`;
            return from(this.alfrescoApiService.getInstance()
                .oauth2Auth.callCustomApi(queryUrl, 'POST',
                    null, null, null,
                    null, null,
                    this.contentTypes, this.accepts,
                    this.returnType, null, null)
            ).pipe(
                map((res: any) => {
                    return new TaskDetailsCloudModel(res.entry);
                }),
                catchError((err) => this.handleError(err))
            );
        } else {
            this.logService.error('AppName and TaskId are mandatory for querying a task');
            return throwError('AppName/TaskId not configured');
        }
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }

}
