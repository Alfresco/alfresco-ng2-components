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

import { FormValues } from '@alfresco/adf-core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FormContent } from '../../services/form-fields.interfaces';
import { TaskDetailsCloudModel } from '../../task/public-api';
import { formCloudDisplayMock } from '../mocks/cloud-form.mock';
import { taskWithFormDetails } from '../mocks/task-with-form.mock';
import { TaskVariableCloud } from '../models/task-variable-cloud.model';

export class FormCloudServiceMock {
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

    getTask(_appName: string, _taskId: string): Observable<TaskDetailsCloudModel> {
        return of(taskWithFormDetails);
    }

    getForm(_appName: string, _formKey: string, _version?: number): Observable<FormContent> {
        return of(formCloudDisplayMock);
    }

    getTaskVariables(_appName: string, _taskId: string): Observable<TaskVariableCloud[]> {
        return of([new TaskVariableCloud({ name: 'name1', value: 5, type: 'text', id: '52' })]);
    }

    saveTaskForm(
        _appName: string,
        _taskId: string,
        _processInstanceId: string,
        _formId: string,
        _values: FormValues
    ): Observable<TaskDetailsCloudModel> {
        return of(taskWithFormDetails);
    }

    completeTaskForm(
        _appName: string,
        _taskId: string,
        _processInstanceId: string,
        _formId: string,
        _formValues: FormValues,
        _outcome: string,
        _version: number
    ): Observable<TaskDetailsCloudModel> {
        return of(taskWithFormDetails);
    }
}
