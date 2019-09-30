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
import { AlfrescoApiService, LogService, FormValues, AppConfigService, FormOutcomeModel, FormFieldOption, FormModel } from '@alfresco/adf-core';
import { throwError, Observable, from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TaskDetailsCloudModel } from '../../task/start-task/models/task-details-cloud.model';
import { SaveFormRepresentation, CompleteFormRepresentation } from '@alfresco/js-api';
import { TaskVariableCloud, ProcessStorageCloudModel } from '../models/task-variable-cloud.model';
import { BaseCloudService } from '../../services/base-cloud.service';

@Injectable({
    providedIn: 'root'
})
export class FormCloudService extends BaseCloudService {

    contentTypes = ['application/json'];
    accepts = ['application/json'];
    returnType = Object;

    constructor(
        private apiService: AlfrescoApiService,
        private appConfigService: AppConfigService,
        private logService: LogService
    ) {
        super();

        this.contextRoot = this.appConfigService.get('bpmHost', '');
    }

    /**
     * Gets the form definition of a task.
     * @param appName Name of the app
     * @param taskId ID of the target task
     * @returns Form definition
     */
    getTaskForm(appName: string, taskId: string): Observable<any> {
        return this.getTask(appName, taskId).pipe(
            switchMap((task: TaskDetailsCloudModel) => {
                return this.getForm(appName, task.formKey).pipe(
                    map((form: any) => {
                        const flattenForm = {...form.formRepresentation, ...form.formRepresentation.formDefinition};
                        delete flattenForm.formDefinition;
                        flattenForm.taskId = task.id;
                        flattenForm.taskName = task.name;
                        flattenForm.processDefinitionId = task.processDefinitionId;
                        flattenForm.processInstanceId = task.processInstanceId;
                        return flattenForm;
                    })
                );
            })
        );
    }

    /**
     * Saves a task form.
     * @param appName Name of the app
     * @param taskId ID of the target task
     * @param formId ID of the form to save
     * @param formValues Form values object
     * @returns Updated task details
     */
    saveTaskForm(appName: string, taskId: string, processInstanceId: string, formId: string, formValues: FormValues): Observable<TaskDetailsCloudModel> {
        const apiUrl = this.buildSaveFormUrl(appName, formId);
        const saveFormRepresentation = <SaveFormRepresentation> {values: formValues, taskId: taskId, processInstanceId: processInstanceId};
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

    createTemporaryRawRelatedContent(file: any, nodeId: string, contentHost: string): Observable<any> {

        const changedConfig = this.apiService.lastConfig;
        changedConfig.provider = 'ALL';
        changedConfig.hostEcm = contentHost.replace('/alfresco', '');
        this.apiService.getInstance().setConfig(changedConfig);
        return from(this.apiService.getInstance().upload.uploadFile(
            file,
            '',
            nodeId,
            '',
            {overwrite: true}
        )).pipe(
            map((res: any) => {
                return (res.entry);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Completes a task form.
     * @param appName Name of the app
     * @param taskId ID of the target task
     * @param formId ID of the form to complete
     * @param formValues Form values object
     * @param outcome Form outcome
     * @returns Updated task details
     */
    completeTaskForm(appName: string, taskId: string, processInstanceId: string, formId: string, formValues: FormValues, outcome: string): Observable<TaskDetailsCloudModel> {
        const apiUrl = this.buildSubmitFormUrl(appName, formId);
        const completeFormRepresentation: any = <CompleteFormRepresentation> {values: formValues, taskId: taskId, processInstanceId: processInstanceId};
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

    /**
     * Gets details of a task
     * @param appName Name of the app
     * @param taskId ID of the target task
     * @returns Details of the task
     */
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

    getProcessStorageFolderTask(appName: string, taskId: string, processInstanceId: string): Observable<ProcessStorageCloudModel> {
        const apiUrl = this.buildFolderTask(appName, taskId, processInstanceId);
        return from(this.apiService
            .getInstance()
            .oauth2Auth.callCustomApi(apiUrl, 'GET',
                null, null, null,
                null, null,
                this.contentTypes, this.accepts,
                this.returnType, null, null)
        ).pipe(
            map((res: any) => {
                return new ProcessStorageCloudModel(res);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Gets the variables of a task.
     * @param appName Name of the app
     * @param taskId ID of the target task
     * @returns Task variables
     */
    getTaskVariables(appName: string, taskId: string): Observable<TaskVariableCloud[]> {
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
                return res.list.entries.map((variable) => new TaskVariableCloud(variable.entry));
            }),
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Gets a form definition.
     * @param appName Name of the app
     * @param formKey key of the target task
     * @returns Form definition
     */
    getForm(appName: string, formKey: string): Observable<any> {
        const apiUrl = this.buildGetFormUrl(appName, formKey);
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

    /**
     * Parses JSON data to create a corresponding form.
     * @param url String data to make the request
     * @returns Array of FormFieldOption object
     */
    getDropDownJsonData(url: string): Observable<FormFieldOption[]> {
        return from(this.apiService.getInstance()
            .oauth2Auth.callCustomApi(url, 'GET',
                null, null, null,
                null, null,
                this.contentTypes, this.accepts,
                this.returnType, null, null)
        ).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Parses JSON data to create a corresponding form.
     * @param json JSON data to create the form
     * @param data Values for the form's fields
     * @param readOnly Toggles whether or not the form should be read-only
     * @returns Form created from the JSON specification
     */
    parseForm(json: any, data?: TaskVariableCloud[], readOnly: boolean = false): FormModel {
        if (json) {
            const flattenForm = {...json.formRepresentation, ...json.formRepresentation.formDefinition};
            delete flattenForm.formDefinition;

            const formValues: FormValues = {};
            (data || []).forEach(variable => {
                formValues[variable.name] = variable.value;
            });

            const form = new FormModel(flattenForm, formValues, readOnly);
            if (!json.fields) {
                form.outcomes = [
                    new FormOutcomeModel(<any> form, {
                        id: '$save',
                        name: FormOutcomeModel.SAVE_ACTION,
                        isSystem: true
                    })
                ];
            }
            return form;
        }
        return null;
    }

    private buildGetTaskUrl(appName: string, taskId: string): string {
        return `${this.getBasePath(appName)}/query/v1/tasks/${taskId}`;
    }

    private buildGetFormUrl(appName: string, formKey: string): string {
        return `${this.getBasePath(appName)}/form/v1/forms/${formKey}`;
    }

    private buildSaveFormUrl(appName: string, formId: string): string {
        return `${this.getBasePath(appName)}/form/v1/forms/${formId}/save`;
    }

    private buildSubmitFormUrl(appName: string, formId: string): string {
        return `${this.getBasePath(appName)}/form/v1/forms/${formId}/submit`;
    }

    private buildGetTaskVariablesUrl(appName: string, taskId: string): string {
        return `${this.getBasePath(appName)}/query/v1/tasks/${taskId}/variables`;
    }

    private buildFolderTask(appName: string, taskId: string, processInstanceId: string): string {
        return processInstanceId
            ? `${this.getBasePath(appName)}/process-storage/v1/folders/${processInstanceId}/${taskId}`
            : `${this.getBasePath(appName)}/process-storage/v1/folders/${taskId}`;
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }

}
