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
import { throwError, Observable, from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TaskDetailsCloudModel } from '../../task/public-api';
import { SaveFormRepresentation, CompleteFormRepresentation } from '@alfresco/js-api';

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
                return this.getForm(appName, task.formKey).pipe(
                    map((form: any) => {
                        form.formRepresentation.taskId = task.id;
                        form.formRepresentation.taskName = task.name;
                        form.formRepresentation.processDefinitionId = task.processDefinitionId;
                        form.formRepresentation.processInstanceId = task.processInstanceId;
                        return form;
                    })
                );
            })
        );
    }

    saveTaskForm(appName: string, taskId: string, formId: string, formValues: FormValues) {
        const apiUrl = this.buildSaveFormUrl(appName, formId);
        const saveFormRepresentation = <SaveFormRepresentation> { values: formValues, taskId: taskId };
        return from(this.apiService
            .getInstance()
            .oauth2Auth.callCustomApi(apiUrl, 'POST',
                null, null, null,
                null, saveFormRepresentation,
                this.contentTypes, this.accepts,
                this.returnType, null, null)
        ).pipe(
            map((res: any) => {
                return new TaskDetailsCloudModel(res.entry);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    completeTaskForm(appName: string, taskId: string, formId: string, formValues: FormValues, outcome: string) {
        const apiUrl = this.buildSubmitFormUrl(appName, formId);
        let completeFormRepresentation: any = <CompleteFormRepresentation> { values: formValues, taskId: taskId };
        if (outcome) {
            completeFormRepresentation.outcome = outcome;
        }

        return from(this.apiService
            .getInstance()
            .oauth2Auth.callCustomApi(apiUrl, 'POST',
                null, null, null,
                null, completeFormRepresentation,
                this.contentTypes, this.accepts,
                this.returnType, null, null)
        ).pipe(
            map((res: any) => {
                return new TaskDetailsCloudModel(res.entry);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getTask(appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        const apiUrl = this.buildGetTaskUrl(appName, taskId);
        return from(this.apiService
            .getInstance()
            .oauth2Auth.callCustomApi(apiUrl, 'GET',
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
    }

    getTaskVariables(appName: string, taskId: string): Observable<any[]> {
        const apiUrl = this.buildGetTaskVariablesUrl(appName, taskId);
        return from(this.apiService
            .getInstance()
            .oauth2Auth.callCustomApi(apiUrl, 'GET',
                null, null, null,
                null, null,
                this.contentTypes, this.accepts,
                this.returnType, null, null)
        ).pipe(
            map((res: any) => {
                return res.content;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getProcessInstanceVariables(appName: string, processInstanceId: string): Observable<any[]> {
        const apiUrl = this.buildGetProcessInstanceVariablesUrl(appName, processInstanceId);
        const bodyParam = {}, pathParams = {}, queryParams = {}, headerParams = {},
            formParams = {};

        return from(
            this.apiService
                .getInstance()
                .oauth2Auth.callCustomApi(
                    apiUrl, 'GET', pathParams, queryParams,
                    headerParams, formParams, bodyParam,
                    this.contentTypes, this.accepts, this.returnType, null, null)
                ).pipe(
                    map((res: any) => {
                        return res.content;
                    }),
                    catchError((err) => this.handleError(err))
            );
    }

    getForm(appName: string, taskId: string): Observable<any> {
        const apiUrl = this.buildGetFormUrl(appName, taskId);
        const bodyParam = {}, pathParams = {}, queryParams = {}, headerParams = {},
            formParams = {};

        return from(
            this.apiService
                .getInstance()
                .oauth2Auth.callCustomApi(
                    apiUrl, 'GET', pathParams, queryParams,
                    headerParams, formParams, bodyParam,
                    this.contentTypes, this.accepts, this.returnType, null, null)
                ).pipe(
                    catchError((err) => this.handleError(err))
            );
    }

    private buildGetTaskUrl(appName: string, taskId: string): string {
        return `${this.appConfigService.get('bpmHost')}/${appName}-rb/v1/tasks/${taskId}`;
    }

    private buildGetFormUrl(appName: string, formId: string): string {
        return `${this.appConfigService.get('bpmHost')}/${appName}-form/v1/forms/${formId}`;
    }

    private buildSaveFormUrl(appName: string, formId: string): string {
        return `${this.appConfigService.get('bpmHost')}/${appName}-form/v1/forms/${formId}/save`;
    }

    private buildSubmitFormUrl(appName: string, formId: string): string {
        return `${this.appConfigService.get('bpmHost')}/${appName}-form/v1/forms/${formId}/submit`;
    }

    private buildGetTaskVariablesUrl(appName: string, taskId: string): string {
        return `${this.appConfigService.get('bpmHost')}/${appName}-rb/v1/tasks/${taskId}/variables`;
    }

    private buildGetProcessInstanceVariablesUrl(appName: string, processInstanceId: string): string {
        return `${this.appConfigService.get('bpmHost')}/${appName}-rb/v1/process-instances/${processInstanceId}/variables`;
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }

}
