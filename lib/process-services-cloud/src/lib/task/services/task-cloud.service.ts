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
import { AlfrescoApiService, LogService, AppConfigService, IdentityUserService } from '@alfresco/adf-core';
import { from, throwError, Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TaskDetailsCloudModel, StartTaskCloudResponseModel } from '../start-task/models/task-details-cloud.model';
import { BaseCloudService } from '../../services/base-cloud.service';
import { StartTaskCloudRequestModel } from '../start-task/models/start-task-cloud-request.model';

@Injectable({
    providedIn: 'root'
})
export class TaskCloudService extends BaseCloudService {

    contentTypes = ['application/json'];
    accepts = ['application/json'];
    returnType = Object;

    private dataChangesDetected = new Subject();
    dataChangesDetected$: Observable<any>;

    constructor(
        private apiService: AlfrescoApiService,
        private appConfigService: AppConfigService,
        private logService: LogService,
        private identityUserService: IdentityUserService
    ) {
        super();
        this.contextRoot = this.appConfigService.get('bpmHost', '');
        this.dataChangesDetected$ = this.dataChangesDetected.asObservable();
    }

    /**
     * Complete a task.
     * @param appName Name of the app
     * @param taskId ID of the task to complete
     * @returns Details of the task that was completed
     */
    completeTask(appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        if (appName && taskId) {
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
        } else {
            this.logService.error('AppName and TaskId are mandatory for complete a task');
            return throwError('AppName/TaskId not configured');
        }
    }

    /**
     * Validate if a task can be completed.
     * @param taskDetails task details object
     * @returns Boolean value if the task can be completed
     */
    canCompleteTask(taskDetails: TaskDetailsCloudModel): boolean {
        return taskDetails && taskDetails.isAssigned() && this.isAssignedToMe(taskDetails.assignee);
    }

    /**
     * Validate if a task is editable.
     * @param taskDetails task details object
     * @returns Boolean value if the task is editable
     */
    isTaskEditable(taskDetails: TaskDetailsCloudModel): boolean {
        return taskDetails && taskDetails.isAssigned() && this.isAssignedToMe(taskDetails.assignee);
    }

    /**
     * Validate if a task can be claimed.
     * @param taskDetails task details object
     * @returns Boolean value if the task can be completed
     */
    canClaimTask(taskDetails: TaskDetailsCloudModel): boolean {
        return taskDetails && taskDetails.canClaimTask();
    }

    /**
     * Validate if a task can be unclaimed.
     * @param taskDetails task details object
     * @returns Boolean value if the task can be completed
     */
    canUnclaimTask(taskDetails: TaskDetailsCloudModel): boolean {
        const currentUser = this.identityUserService.getCurrentUserInfo().username;
        return taskDetails && taskDetails.canUnclaimTask(currentUser);
    }

    /**
     * Claims a task for an assignee.
     * @param appName Name of the app
     * @param taskId ID of the task to claim
     * @param assignee User to assign the task to
     * @returns Details of the claimed task
     */
    claimTask(appName: string, taskId: string, assignee: string): Observable<TaskDetailsCloudModel> {
        if (appName && taskId) {
            const queryUrl = `${this.getBasePath(appName)}/rb/v1/tasks/${taskId}/claim?assignee=${assignee}`;
            return from(this.apiService.getInstance()
                .oauth2Auth.callCustomApi(queryUrl, 'POST',
                    null, null, null,
                    null, null,
                    this.contentTypes, this.accepts,
                    this.returnType, null, null)
            ).pipe(
                map((res: any) => {
                    this.dataChangesDetected.next();
                    return new TaskDetailsCloudModel(res.entry);
                }),
                catchError((err) => this.handleError(err))
            );
        } else {
            this.logService.error('AppName and TaskId are mandatory for querying a task');
            return throwError('AppName/TaskId not configured');
        }
    }

    /**
     * Un-claims a task.
     * @param appName Name of the app
     * @param taskId ID of the task to unclaim
     * @returns Details of the task that was unclaimed
     */
    unclaimTask(appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        if (appName && taskId) {
            const queryUrl = `${this.getBasePath(appName)}/rb/v1/tasks/${taskId}/release`;
            return from(this.apiService.getInstance()
                .oauth2Auth.callCustomApi(queryUrl, 'POST',
                    null, null, null,
                    null, null,
                    this.contentTypes, this.accepts,
                    this.returnType, null, null)
            ).pipe(
                map((res: any) => {
                    this.dataChangesDetected.next();
                    return new TaskDetailsCloudModel(res.entry);
                }),
                catchError((err) => this.handleError(err))
            );
        } else {
            this.logService.error('AppName and TaskId are mandatory for querying a task');
            return throwError('AppName/TaskId not configured');
        }
    }

    /**
     * Gets details of a task.
     * @param appName Name of the app
     * @param taskId ID of the task whose details you want
     * @returns Task details
     */
    getTaskById(appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        if (appName && taskId) {
            const queryUrl = `${this.getBasePath(appName)}/query/v1/tasks/${taskId}`;
            return from(this.apiService.getInstance()
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

     /**
      * Creates a new standalone task.
      * @param taskDetails Details of the task to create
      * @returns Details of the newly created task
      */
    createNewTask(startTaskRequest: StartTaskCloudRequestModel, appName: string): Observable<TaskDetailsCloudModel> {
        const queryUrl = this.buildCreateTaskUrl(appName);
        const bodyParam = JSON.stringify(this.buildRequestBody(startTaskRequest));
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

    /**
     * Updates the details (name, description, due date) for a task.
     * @param appName Name of the app
     * @param taskId ID of the task to update
     * @param updatePayload Data to update the task
     * @returns Updated task details
     */
    updateTask(appName: string, taskId: string, updatePayload: any): Observable<TaskDetailsCloudModel> {
        if (appName && taskId) {

            updatePayload.payloadType = 'UpdateTaskPayload';
            const queryUrl = `${this.getBasePath(appName)}/rb/v1/tasks/${taskId}`;
            return from(this.apiService.getInstance()
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

    /**
     * Gets candidate users of the task.
     * @param appName Name of the app
     * @param taskId ID of the task
     * @returns Candidate users
     */
    getCandidateUsers(appName: string, taskId: string): Observable<string[]> {
        if (appName && taskId) {
            const queryUrl = `${this.getBasePath(appName)}/query/v1/tasks/${taskId}/candidate-users`;
            return from(this.apiService.getInstance()
                .oauth2Auth.callCustomApi(queryUrl, 'GET',
                    null, null, null,
                    null, null,
                    this.contentTypes, this.accepts,
                    this.returnType, null, null)
            ).pipe(
                map((response: string[]) => {
                    return response;
                }),
                catchError((err) => this.handleError(err))
            );
        } else {
            this.logService.error('AppName and TaskId are mandatory to get candidate user');
            return of([]);
        }
    }

    /**
     * Gets candidate groups of the task.
     * @param appName Name of the app
     * @param taskId ID of the task
     * @returns Candidate groups
     */
    getCandidateGroups(appName: string, taskId: string): Observable<string[]> {
        if (appName && taskId) {
            const queryUrl = `${this.getBasePath(appName)}/query/v1/tasks/${taskId}/candidate-groups`;
            return from(this.apiService.getInstance()
                .oauth2Auth.callCustomApi(queryUrl, 'GET',
                    null, null, null,
                    null, null,
                    this.contentTypes, this.accepts,
                    this.returnType, null, null)
            ).pipe(
                map((response: string[]) => {
                    return response;
                }),
                catchError((err) => this.handleError(err))
            );
        } else {
            this.logService.error('AppName and TaskId are mandatory to get candidate groups');
            return of([]);
        }
    }

    private isAssignedToMe(assignee: string): boolean {
        const currentUser = this.identityUserService.getCurrentUserInfo().username;
        return assignee === currentUser;
    }

    private buildCompleteTaskUrl(appName: string, taskId: string): string {
        return `${this.getBasePath(appName)}/rb/v1/tasks/${taskId}/complete`;
    }

    private buildCreateTaskUrl(appName: string): string {
        this.contextRoot = this.appConfigService.get('bpmHost');
        return `${this.getBasePath(appName)}/rb/v1/tasks`;
    }

    private buildRequestBody(startTaskRequest: StartTaskCloudRequestModel) {
        return new StartTaskCloudRequestModel(startTaskRequest);
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }

}
