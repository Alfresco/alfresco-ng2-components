/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { FormValues, FormModel, FormFieldOption } from '@alfresco/adf-core';
import { Observable, from, EMPTY } from 'rxjs';
import { expand, map, reduce, switchMap } from 'rxjs/operators';
import { TaskDetailsCloudModel } from '../../task/start-task/models/task-details-cloud.model';
import { CompleteFormRepresentation, UploadApi } from '@alfresco/js-api';
import { TaskVariableCloud } from '../models/task-variable-cloud.model';
import { BaseCloudService } from '../../services/base-cloud.service';
import { FormContent } from '../../services/form-fields.interfaces';
import { FormCloudServiceInterface } from './form-cloud.service.interface';
import { AdfHttpClient } from '@alfresco/adf-core/api';

const mockPoCFormDefinition = {
    tabs: [],
    fields: [
        {
            id: '1b93af77-9837-4d29-a957-866fa76e1f77',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 2,
            fields: {
                1: [
                    {
                        id: 'DisplayText1',
                        name: 'Display text',
                        type: 'readonly-text',
                        readOnly: false,
                        value: 'Display Text 1',
                        colspan: 1,
                        rowspan: 1,
                        visibilityCondition: null,
                        params: { existingColspan: 1, maxColspan: 2 },
                        style: 'my-custom-display-text'
                    }
                ],
                2: [
                    {
                        id: 'DisplayText2',
                        name: 'Display text',
                        type: 'readonly-text',
                        readOnly: false,
                        value: 'Display Text 2',
                        colspan: 1,
                        rowspan: 1,
                        visibilityCondition: null,
                        params: { existingColspan: 1, maxColspan: 2 },
                        style: 'my-custom-display-text2'
                    }
                ]
            }
        },
        {
            id: '11c122aa-620a-46c2-ac15-07567622a747',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 2,
            fields: {
                1: [
                    {
                        id: 'Text0qkxkp',
                        name: 'Text',
                        type: 'text',
                        readOnly: false,
                        required: false,
                        colspan: 1,
                        rowspan: 1,
                        placeholder: null,
                        minLength: 0,
                        maxLength: 0,
                        regexPattern: null,
                        visibilityCondition: null,
                        params: { existingColspan: 1, maxColspan: 2 }
                    }
                ],
                2: [
                    {
                        id: 'Dropdown0vf1tp',
                        name: 'Dropdown',
                        type: 'dropdown',
                        readOnly: false,
                        required: false,
                        colspan: 1,
                        rowspan: 1,
                        optionType: 'manual',
                        options: [],
                        authName: null,
                        restUrl: null,
                        restResponsePath: null,
                        restIdProperty: null,
                        restLabelProperty: null,
                        selectionType: 'single',
                        visibilityCondition: null,
                        params: { existingColspan: 1, maxColspan: 2 },
                        rule: null
                    }
                ]
            }
        },
        {
            id: 'ac31ff57-d5d9-4f27-9562-177203c48802',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 2,
            fields: {
                1: [
                    {
                        id: 'DisplayText3',
                        name: 'Display text',
                        type: 'readonly-text',
                        readOnly: false,
                        value: 'Display text 3',
                        colspan: 1,
                        rowspan: 1,
                        visibilityCondition: null,
                        params: { existingColspan: 1, maxColspan: 2 }
                    },
                    {
                        id: 'Radiobuttons07ivv4',
                        name: 'Radio buttons',
                        type: 'radio-buttons',
                        readOnly: false,
                        required: false,
                        colspan: 1,
                        rowspan: 1,
                        optionType: 'manual',
                        options: [
                            { id: 'Id_1', name: 'Label 1' },
                            { id: 'Id_2', name: 'Label 2' },
                            { id: 'Id_3', name: 'Label 3' },
                            { id: 'Id_4', name: 'Label 4' }
                        ],
                        authName: null,
                        restUrl: null,
                        restResponsePath: null,
                        restIdProperty: null,
                        restLabelProperty: null,
                        alignmentType: 'vertical',
                        visibilityCondition: null,
                        params: { existingColspan: 1, maxColspan: 2 }
                    }
                ],
                2: [
                    {
                        id: 'DisplayText4',
                        name: 'Display text',
                        type: 'readonly-text',
                        readOnly: false,
                        value: 'Display text 4',
                        colspan: 1,
                        rowspan: 1,
                        visibilityCondition: null,
                        params: { existingColspan: 1, maxColspan: 2 }
                    },
                    {
                        id: 'Checkbox0mz7t4',
                        name: 'Checkbox 1',
                        type: 'boolean',
                        readOnly: false,
                        required: true,
                        colspan: 1,
                        rowspan: 1,
                        visibilityCondition: null,
                        params: { existingColspan: 1, maxColspan: 2 },
                        value: true
                    },
                    {
                        id: 'Checkbox0c5piw',
                        name: 'Checkbox 2',
                        type: 'boolean',
                        readOnly: false,
                        required: true,
                        colspan: 1,
                        rowspan: 1,
                        visibilityCondition: null,
                        params: { existingColspan: 1, maxColspan: 2 }
                    }
                ]
            }
        }
    ],
    outcomes: [],
    metadata: {},
    variables: [],
    theme: {
        form: {
            '--adf-form-label-font-size': '10px',
            '--adf-form-label-color': 'blue'
        },
        widgets: {
            'readonly-text': {
                'my-custom-display-text': {
                    '--adf-readonly-text-font-size': '28px',
                    '--adf-readonly-text-font-weight': 'bold'
                },
                'my-custom-display-text2': {
                    '--adf-readonly-text-font-size': '15px',
                    '--adf-readonly-text-color': 'green'
                }
            }
        }
    }
};

@Injectable({
    providedIn: 'root'
})
export class FormCloudService extends BaseCloudService implements FormCloudServiceInterface {
    private _uploadApi: UploadApi;
    get uploadApi(): UploadApi {
        this._uploadApi = this._uploadApi ?? new UploadApi(this.apiService.getInstance());
        return this._uploadApi;
    }

    constructor(adfHttpClient: AdfHttpClient) {
        super(adfHttpClient);
    }

    /**
     * Gets the form definition of a task.
     *
     * @param appName Name of the app
     * @param taskId ID of the target task
     * @param version Version of the form
     * @returns Form definition
     */
    getTaskForm(appName: string, taskId: string, version?: number): Observable<any> {
        return this.getTask(appName, taskId).pipe(
            switchMap((task) =>
                this.getForm(appName, task.formKey, version).pipe(
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
                )
            )
        );
    }

    /**
     * Saves a task form.
     *
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

        return this.post(apiUrl, saveFormRepresentation).pipe(map((res: any) => res.entry));
    }

    createTemporaryRawRelatedContent(file: any, nodeId: string, contentHost: string): Observable<any> {
        const changedConfig = this.apiService.lastConfig;
        changedConfig.provider = 'ALL';
        changedConfig.hostEcm = contentHost.replace('/alfresco', '');
        this.apiService.getInstance().setConfig(changedConfig);
        return from(this.uploadApi.uploadFile(file, '', nodeId, null, { overwrite: true })).pipe(map((res: any) => res.entry));
    }

    /**
     * Completes a task form.
     *
     * @param appName Name of the app
     * @param taskId ID of the target task
     * @param processInstanceId ID of processInstance
     * @param formId ID of the form to complete
     * @param formValues Form values object
     * @param outcome Form outcome
     * @param version of the form
     * @returns Updated task details
     */
    completeTaskForm(
        appName: string,
        taskId: string,
        processInstanceId: string,
        formId: string,
        formValues: FormValues,
        outcome: string,
        version: number
    ): Observable<TaskDetailsCloudModel> {
        const apiUrl = `${this.getBasePath(appName)}/form/v1/forms/${formId}/submit/versions/${version}`;
        const completeFormRepresentation = {
            values: formValues,
            taskId,
            processInstanceId
        } as CompleteFormRepresentation;

        if (outcome) {
            completeFormRepresentation.outcome = outcome;
        }

        return this.post(apiUrl, completeFormRepresentation).pipe(map((res: any) => res.entry));
    }

    /**
     * Gets details of a task
     *
     * @param appName Name of the app
     * @param taskId ID of the target task
     * @returns Details of the task
     */
    getTask(appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        const apiUrl = `${this.getBasePath(appName)}/query/v1/tasks/${taskId}`;

        return this.get(apiUrl).pipe(map((res: any) => res.entry));
    }

    /**
     * Gets the variables of a task.
     *
     * @param appName Name of the app
     * @param taskId ID of the target task
     * @returns Task variables
     */
    getTaskVariables(appName: string, taskId: string): Observable<TaskVariableCloud[]> {
        const apiUrl = `${this.getBasePath(appName)}/query/v1/tasks/${taskId}/variables`;
        let skipCount = 0;
        const maxItems = 1000;

        return this.get(apiUrl, { maxItems, skipCount }).pipe(
            expand((res: any) => {
                skipCount += maxItems;
                return res.list.pagination.hasMoreItems
                    ? this.get(apiUrl, {
                          maxItems,
                          skipCount
                      })
                    : EMPTY;
            }),
            map((res: any) => res.list.entries.map((variable) => new TaskVariableCloud(variable.entry))),
            reduce((acc, res) => acc.concat(res), [])
        );
    }

    /**
     * Gets a form definition.
     *
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

        // modified for PoC purpose
        return this.get<any>(url).pipe(
            map((res) => ({
                ...res,
                formRepresentation: {
                    ...res.formRepresentation,
                    formDefinition: mockPoCFormDefinition
                }
            }))
        );
    }

    getRestWidgetData(formName: string, widgetId: string, body: any = {}): Observable<FormFieldOption[]> {
        const appName = this.appConfigService.get('alfresco-deployed-apps')[0]?.name;
        const apiUrl = `${this.getBasePath(appName)}/form/v1/forms/${formName}/values/${widgetId}`;
        return this.post(apiUrl, body);
    }

    /**
     * Parses JSON data to create a corresponding form.
     *
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
            (data || []).forEach((variable) => {
                formValues[variable.name] = variable.value;
            });

            return new FormModel(flattenForm, formValues, readOnly);
        }
        return null;
    }

    getPreviewState(): boolean {
        return false;
    }
}
