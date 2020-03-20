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
    FormValues,
    AppConfigService,
    FormOutcomeModel,
    FormFieldOption,
    FormModel
} from '@alfresco/adf-core';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TaskDetailsCloudModel } from '../../task/start-task/models/task-details-cloud.model';
import { CompleteFormRepresentation } from '@alfresco/js-api';
import { TaskVariableCloud, ProcessStorageCloudModel } from '../models/task-variable-cloud.model';
import { BaseCloudService } from '../../services/base-cloud.service';
import { FormContent } from '../../services/form-fields.interfaces';

@Injectable({
    providedIn: 'root'
})
export class FormCloudService extends BaseCloudService {

    constructor(
        apiService: AlfrescoApiService,
        appConfigService: AppConfigService
    ) {
        super(apiService);
        this.contextRoot = appConfigService.get('bpmHost', '');
    }

    /**
     * Gets the form definition of a task.
     * @param appName Name of the app
     * @param taskId ID of the target task
     * @param version Version of the form
     * @returns Form definition
     */
    getTaskForm(appName: string, taskId: string, version?: number): Observable<any> {
        return this.getTask(appName, taskId).pipe(
            switchMap(task => {
                return this.getForm(appName, task.formKey, version).pipe(
                    map((form: FormContent) => {
                        const flattenForm = {
                            ...form.formRepresentation,
                            ...form.formRepresentation.formDefinition,
                            taskId: task.id,
                            taskName: task.name,
                            processDefinitionId: task.processDefinitionId,
                            processInstanceId: task.processInstanceId
                        };
                        delete flattenForm.formDefinition;
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
     * @param processInstanceId ID of processInstance
     * @param formId ID of the form to save
     * @param values Form values object
     * @returns Updated task details
     */
    saveTaskForm(appName: string, taskId: string, processInstanceId: string, formId: string, values: FormValues): Observable<TaskDetailsCloudModel> {
        const apiUrl = `${this.getBasePath(appName)}/form/v1/forms/${formId}/save`;
        const saveFormRepresentation: any = {
            values,
            taskId,
            processInstanceId
        };

        return this.post(apiUrl, saveFormRepresentation).pipe(
            map((res: any) => res.entry)
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
            { overwrite: true }
        )).pipe(
            map((res: any) => res.entry)
        );
    }

    /**
     * Completes a task form.
     * @param appName Name of the app
     * @param taskId ID of the target task
     * @param processInstanceId ID of processInstance
     * @param formId ID of the form to complete
     * @param formValues Form values object
     * @param outcome Form outcome
     * @param version of the form
     * @returns Updated task details
     */
    completeTaskForm(appName: string, taskId: string, processInstanceId: string, formId: string, formValues: FormValues, outcome: string, version: number): Observable<TaskDetailsCloudModel> {
        const apiUrl = `${this.getBasePath(appName)}/form/v1/forms/${formId}/submit/versions/${version}`;
        const completeFormRepresentation = <CompleteFormRepresentation> {
            values: formValues,
            taskId: taskId,
            processInstanceId: processInstanceId
        };
        if (outcome) {
            completeFormRepresentation.outcome = outcome;
        }

        return this.post(apiUrl, completeFormRepresentation).pipe(
            map((res: any) => res.entry)
        );
    }

    /**
     * Gets details of a task
     * @param appName Name of the app
     * @param taskId ID of the target task
     * @returns Details of the task
     */
    getTask(appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        const apiUrl = `${this.getBasePath(appName)}/query/v1/tasks/${taskId}`;

        return this.get(apiUrl).pipe(
            map((res: any) => res.entry)
        );
    }

    getProcessStorageFolderTask(appName: string, taskId: string, processInstanceId: string): Observable<ProcessStorageCloudModel> {
        const apiUrl = this.buildFolderTask(appName, taskId, processInstanceId);

        return this.get(apiUrl).pipe(
            map((res: any) => {
                return new ProcessStorageCloudModel(res);
            })
        );
    }

    /**
     * Gets the variables of a task.
     * @param appName Name of the app
     * @param taskId ID of the target task
     * @returns Task variables
     */
    getTaskVariables(appName: string, taskId: string): Observable<TaskVariableCloud[]> {
        const apiUrl = `${this.getBasePath(appName)}/query/v1/tasks/${taskId}/variables`;

        return this.get(apiUrl).pipe(
            map((res: any) => {
                return res.list.entries.map((variable) => new TaskVariableCloud(variable.entry));
            })
        );
    }

    /**
     * Gets a form definition.
     * @param appName Name of the app
     * @param formKey key of the target task
     * @param version Version of the form
     * @returns Form definition
     */
    getForm(appName: string, formKey: string, version?: number): Observable<FormContent> {
        let url = `${this.getBasePath(appName)}/form/v1/forms/${formKey}`;

        if (version) {
            url += `/versions/${version}`;
        }

        return this.get(url);
    }

    /**
     * Parses JSON data to create a corresponding form.
     * @param url String data to make the request
     * @returns Array of FormFieldOption object
     */
    getDropDownJsonData(url: string): Observable<FormFieldOption[]> {
        return this.get<FormFieldOption[]>(url);
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
            const flattenForm = {
                ...json.formRepresentation,
                ...json.formRepresentation.formDefinition
            };
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

    private buildFolderTask(appName: string, taskId: string, processInstanceId: string): string {
        return processInstanceId
            ? `${this.getBasePath(appName)}/process-storage/v1/folders/${processInstanceId}/${taskId}`
            : `${this.getBasePath(appName)}/process-storage/v1/folders/${taskId}`;
    }
}
