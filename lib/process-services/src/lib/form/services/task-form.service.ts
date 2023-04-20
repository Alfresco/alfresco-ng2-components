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

import { AlfrescoApiService, FormValues, LogService, TaskProcessVariableModel } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { CompleteFormRepresentation, SaveFormRepresentation, TaskFormsApi } from '@alfresco/js-api';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TaskFormService {

    static UNKNOWN_ERROR_MESSAGE: string = 'Unknown error';
    static GENERIC_ERROR_MESSAGE: string = 'Server error';

    private _taskFormsApi: TaskFormsApi;
    get taskFormsApi(): TaskFormsApi {
        this._taskFormsApi = this._taskFormsApi ?? new TaskFormsApi(this.apiService.getInstance());
        return this._taskFormsApi;
    }

    constructor(private apiService: AlfrescoApiService, private logService: LogService) {
    }

    /**
     * Saves a task form.
     *
     * @param taskId Task Id
     * @param formValues Form Values
     * @returns Null response when the operation is complete
     */
    saveTaskForm(taskId: string, formValues: FormValues): Observable<any> {
        const saveFormRepresentation = { values: formValues } as SaveFormRepresentation;

        return from(this.taskFormsApi.saveTaskForm(taskId, saveFormRepresentation))
            .pipe(
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Completes a Task Form.
     *
     * @param taskId Task Id
     * @param formValues Form Values
     * @param outcome Form Outcome
     * @returns Null response when the operation is complete
     */
    completeTaskForm(taskId: string, formValues: FormValues, outcome?: string): Observable<any> {
        const completeFormRepresentation = { values: formValues } as CompleteFormRepresentation;
        if (outcome) {
            completeFormRepresentation.outcome = outcome;
        }

        return from(this.taskFormsApi.completeTaskForm(taskId, completeFormRepresentation))
            .pipe(
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets a form related to a task.
     *
     * @param taskId ID of the target task
     * @returns Form definition
     */
    getTaskForm(taskId: string): Observable<any> {
        return from(this.taskFormsApi.getTaskForm(taskId))
            .pipe(
                map(this.toJson),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets values of fields populated by a REST backend.
     *
     * @param taskId Task identifier
     * @param field Field identifier
     * @returns Field values
     */
    getRestFieldValues(taskId: string, field: string): Observable<any> {
        return from(this.taskFormsApi.getRestFieldValues(taskId, field))
            .pipe(
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets column values of fields populated by a REST backend.
     *
     * @param taskId Task identifier
     * @param field Field identifier
     * @param column Column identifier
     * @returns Field values
     */
    getRestFieldValuesColumn(taskId: string, field: string, column?: string): Observable<any> {
        return from(this.taskFormsApi.getRestFieldColumnValues(taskId, field, column))
            .pipe(
                catchError((err) => this.handleError(err))
            );
    }

    getTaskProcessVariable(taskId: string): Observable<TaskProcessVariableModel[]> {
        return from(this.taskFormsApi.getTaskFormVariables(taskId))
            .pipe(
                map((res) => this.toJson(res)),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Creates a JSON representation of form data.
     *
     * @param res Object representing form data
     * @returns JSON data
     */
    toJson(res: any) {
        if (res) {
            return res || {};
        }
        return {};
    }

    /**
     * Reports an error message.
     *
     * @param error Data object with optional `message` and `status` fields for the error
     * @returns Error message
     */
    private handleError(error: any): Observable<any> {
        let errMsg = TaskFormService.UNKNOWN_ERROR_MESSAGE;
        if (error) {
            errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : TaskFormService.GENERIC_ERROR_MESSAGE;
        }
        this.logService.error(errMsg);
        return throwError(errMsg);
    }

}
