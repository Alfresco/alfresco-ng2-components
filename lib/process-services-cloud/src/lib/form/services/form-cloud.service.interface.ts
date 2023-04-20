/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { UploadApi } from '@alfresco/js-api';
import { FormFieldOption, FormModel, FormValues } from '@alfresco/adf-core';
import { TaskDetailsCloudModel } from '../../task/start-task/models/task-details-cloud.model';
import { TaskVariableCloud } from '../models/task-variable-cloud.model';
import { FormContent } from '../../services/form-fields.interfaces';
import { Observable } from 'rxjs';

export interface FormCloudServiceInterface {

    uploadApi: UploadApi;

    getTaskForm(appName: string, taskId: string, version?: number): Observable<any>;
    saveTaskForm(appName: string, taskId: string, processInstanceId: string, formId: string, values: FormValues): Observable<TaskDetailsCloudModel>;
    createTemporaryRawRelatedContent(file: any, nodeId: string, contentHost: string): Observable<any>;
    completeTaskForm(appName: string, taskId: string, processInstanceId: string, formId: string, formValues: FormValues, outcome: string, version: number): Observable<TaskDetailsCloudModel>;
    getTask(appName: string, taskId: string): Observable<TaskDetailsCloudModel>;
    getTaskVariables(appName: string, taskId: string): Observable<TaskVariableCloud[]>;
    getForm(appName: string, formKey: string, version?: number): Observable<FormContent>;
    parseForm(json: any, data?: TaskVariableCloud[], readOnly?: boolean): FormModel;
    getRestWidgetData(formName: string, widgetId: string, body: Map<string, string>): Observable<FormFieldOption[]>;
}
