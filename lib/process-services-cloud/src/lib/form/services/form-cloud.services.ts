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
import { AlfrescoApiService, LogService, FormValues, AppConfigService } from '@alfresco/adf-core';
import { of, throwError, Observable, from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TaskDetailsCloudModel } from '../../task/public-api';

@Injectable({
    providedIn: 'root'
})
export class FormCloudService {

    contentTypes = ['application/json']; accepts = ['application/json']; returnType = Object;
    constructor(
        private apiService: AlfrescoApiService,
        private appConfigService: AppConfigService,
        private logService: LogService
    ) {}

    getTaskForm(appName: string, taskId: string) {
        return this.getTask(appName, taskId).pipe(
            switchMap((task: TaskDetailsCloudModel) => {
                return this.getForm(appName, task.formKey);
            })
        );
    }

    saveTaskForm(appName: string, taskId: string, values: FormValues) {
        return of({});
    }

    getTask(appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        if (appName && taskId) {

            let queryUrl = this.buildTaskUrl(appName, taskId);
            return from(this.apiService
                .getInstance()
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

    completeTaskForm(appName: string, taskId: string, values: FormValues, outcome: string) {
        return of({});
    }

    getForm(appName: string, formId: string): Observable<any> {
        let queryUrl = this.buildFormUrl(appName, formId);
        const bodyParam = {}, pathParams = {}, queryParams = {}, headerParams = {},
            formParams = {};

        return from(
            this.apiService
                .getInstance()
                .oauth2Auth.callCustomApi(
                    queryUrl, 'GET', pathParams, queryParams,
                    headerParams, formParams, bodyParam,
                    this.contentTypes, this.accepts, this.returnType, null, null)
                ).pipe(
                    catchError((err) => this.handleError(err))
            );
    }

    private buildTaskUrl(appName: string, taskId: string): any {
        return `${this.appConfigService.get('bpmHost')}/${appName}-rb/v1/tasks/${taskId}`;
    }

    private buildFormUrl(appName: string, formId: string): any {
        return `${this.appConfigService.get('bpmHost')}/${appName}-form/v1/forms/${formId}`;
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }

}
