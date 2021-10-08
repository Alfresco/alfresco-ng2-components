<<<<<<< HEAD
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

import { FormModel, FormValues } from '@alfresco/adf-core';
import { UploadApi } from '@alfresco/js-api';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FormContent } from '../../services/form-fields.interfaces';
import { TaskDetailsCloudModel } from '../../task/public-api';
import { taskDetailsContainer } from '../../task/task-header/mocks/task-details-cloud.mock';
import { formCloudDisplayMock } from '../mocks/cloud-form.mock';
import { TaskVariableCloud } from '../models/task-variable-cloud.model';
import { FormCloudInterface } from './form-cloud.interface';

export class FormCloudServiceMock implements FormCloudInterface {

    uploadApi: UploadApi;

=======
import { FormValues } from '@alfresco/adf-core';
import { Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { FormContent } from "../../services/form-fields.interfaces";
import { TaskDetailsCloudModel } from "../../task/public-api";
import { formCloudDisplayMock } from "../mocks/cloud-form.mock";
import { taskWithFormDetails } from '../mocks/task-with-form.mock';
import { TaskVariableCloud } from "../models/task-variable-cloud.model";

export class FormCloudServiceMock {
>>>>>>> 4f6281928 ([AAE-5953] migrated stories and mocks)
    getTaskForm(appName: string, taskId: string, version?: number): Observable<any> {
        return this.getTask(appName, taskId).pipe(
            switchMap((task) => {
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

<<<<<<< HEAD
    getTask(_appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        return of(taskDetailsContainer[taskId]);
=======
    getTask(_appName: string, _taskId: string): Observable<TaskDetailsCloudModel> {
        return of(taskWithFormDetails);
>>>>>>> 4f6281928 ([AAE-5953] migrated stories and mocks)
    }

    getForm(_appName: string, _formKey: string, _version?: number): Observable<FormContent> {
        return of(formCloudDisplayMock);
    }

    getTaskVariables(_appName: string, _taskId: string): Observable<TaskVariableCloud[]> {
        return of([new TaskVariableCloud({ name: 'name1', value: 5, type: 'text', id: '52' })]);
    }

    saveTaskForm(
        _appName: string,
<<<<<<< HEAD
        taskId: string,
=======
        _taskId: string,
>>>>>>> 4f6281928 ([AAE-5953] migrated stories and mocks)
        _processInstanceId: string,
        _formId: string,
        _values: FormValues
    ): Observable<TaskDetailsCloudModel> {
<<<<<<< HEAD
        return of(taskDetailsContainer[taskId]);
=======
        return of(taskWithFormDetails);
>>>>>>> 4f6281928 ([AAE-5953] migrated stories and mocks)
    }

    completeTaskForm(
        _appName: string,
<<<<<<< HEAD
        taskId: string,
=======
        _taskId: string,
>>>>>>> 4f6281928 ([AAE-5953] migrated stories and mocks)
        _processInstanceId: string,
        _formId: string,
        _formValues: FormValues,
        _outcome: string,
        _version: number
    ): Observable<TaskDetailsCloudModel> {
<<<<<<< HEAD
        return of(taskDetailsContainer[taskId]);
    }

    createTemporaryRawRelatedContent(_file: any, _nodeId: string, _contentHost: string): Observable<any> {
        throw new Error('Method not implemented.');
    }

    getDropDownJsonData(_url: string): Observable<any> {
        throw new Error('Method not implemented.');
    }

    parseForm(_json: any, _data?: TaskVariableCloud[], _readOnly: boolean = false): FormModel {
        throw new Error('Method not implemented.');
=======
        return of(taskWithFormDetails);
>>>>>>> 4f6281928 ([AAE-5953] migrated stories and mocks)
    }
}
