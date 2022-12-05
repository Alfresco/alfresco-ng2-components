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

import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { LogService } from '../../services/log.service';
import { Injectable } from '@angular/core';
import { Observable, Subject, from, throwError } from 'rxjs';
import { ContentLinkModel } from '../components/widgets/core/content-link.model';
import { map, catchError } from 'rxjs/operators';
import {
    CompleteFormRepresentation,
    SaveFormRepresentation,
    TasksApi,
    TaskFormsApi,
    ProcessDefinitionsApi
} from '@alfresco/js-api';
import { FormOutcomeEvent } from '../components/widgets/core/form-outcome-event.model';
import { FormValues } from '../components/widgets/core/form-values';
import { FormModel } from '../components/widgets/core/form.model';
import { FormOutcomeModel } from '../components/widgets/core/form-outcome.model';
import { FormEvent } from '../events/form.event';
import { FormFieldEvent } from '../events/form-field.event';
import { FormErrorEvent } from '../events/form-error.event';
import { ValidateFormEvent } from '../events/validate-form.event';
import { ValidateFormFieldEvent } from '../events/validate-form-field.event';
import { ValidateDynamicTableRowEvent } from '../events/validate-dynamic-table-row.event';
import { FormValidationService } from './form-validation-service.interface';
import { FormRulesEvent } from '../events/form-rules.event';

@Injectable({
    providedIn: 'root'
})
export class FormService implements FormValidationService {

    static UNKNOWN_ERROR_MESSAGE: string = 'Unknown error';
    static GENERIC_ERROR_MESSAGE: string = 'Server error';

    _taskFormsApi: TaskFormsApi;
    get taskFormsApi(): TaskFormsApi {
        this._taskFormsApi = this._taskFormsApi ?? new TaskFormsApi(this.apiService.getInstance());
        return this._taskFormsApi;
    }

    _taskApi: TasksApi;
    get taskApi(): TasksApi {
        this._taskApi = this._taskApi ?? new TasksApi(this.apiService.getInstance());
        return this._taskApi;
    }

    _processDefinitionsApi: ProcessDefinitionsApi;
    get processDefinitionsApi(): ProcessDefinitionsApi {
        this._processDefinitionsApi = this._processDefinitionsApi ?? new ProcessDefinitionsApi(this.apiService.getInstance());
        return this._processDefinitionsApi;
    }

    formLoaded = new Subject<FormEvent>();
    formDataRefreshed = new Subject<FormEvent>();
    formFieldValueChanged = new Subject<FormFieldEvent>();
    formEvents = new Subject<Event>();
    taskCompleted = new Subject<FormEvent>();
    taskCompletedError = new Subject<FormErrorEvent>();
    taskSaved = new Subject<FormEvent>();
    taskSavedError = new Subject<FormErrorEvent>();
    formContentClicked = new Subject<ContentLinkModel>();

    validateForm = new Subject<ValidateFormEvent>();
    validateFormField = new Subject<ValidateFormFieldEvent>();
    validateDynamicTableRow = new Subject<ValidateDynamicTableRowEvent>();

    executeOutcome = new Subject<FormOutcomeEvent>();

    updateFormValuesRequested = new Subject<FormValues>();

    formRulesEvent = new Subject<FormRulesEvent>();

    constructor(private apiService: AlfrescoApiService,
                protected logService: LogService) {
    }

    /**
     * Parses JSON data to create a corresponding Form model.
     *
     * @param json JSON to create the form
     * @param data Values for the form fields
     * @param readOnly Should the form fields be read-only?
     * @param fixedSpace
     * @returns Form model created from input data
     */
    parseForm(json: any, data?: FormValues, readOnly: boolean = false, fixedSpace?: boolean): FormModel {
        if (json) {
            const form = new FormModel(json, data, readOnly, this, fixedSpace);
            if (!json.fields) {
                form.outcomes = [
                    new FormOutcomeModel(form, {
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



    /**
     * Gets all the tasks.
     *
     * @returns List of tasks
     */
    getTasks(): Observable<any> {
        return from(this.taskApi.listTasks({}))
            .pipe(
                map(this.toJsonArray),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets a task.
     *
     * @param taskId Task Id
     * @returns Task info
     */
    getTask(taskId: string): Observable<any> {
        return from(this.taskApi.getTask(taskId))
            .pipe(
                map(this.toJson),
                catchError((err) => this.handleError(err))
            );
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
     * Gets values of fields populated by a REST backend using a process ID.
     *
     * @param processDefinitionId Process identifier
     * @param field Field identifier
     * @returns Field values
     */
    getRestFieldValuesByProcessId(processDefinitionId: string, field: string): Observable<any> {
        return from(this.processDefinitionsApi.getRestFieldValues(processDefinitionId, field))
            .pipe(
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets column values of fields populated by a REST backend using a process ID.
     *
     * @param processDefinitionId Process identifier
     * @param field Field identifier
     * @param column Column identifier
     * @returns Field values
     */
    getRestFieldValuesColumnByProcessId(processDefinitionId: string, field: string, column?: string): Observable<any> {
        return from(this.processDefinitionsApi.getRestTableFieldValues(processDefinitionId, field, column))
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
     * Creates a JSON array representation of form data.
     *
     * @param res Object representing form data
     * @returns JSON data
     */
    toJsonArray(res: any) {
        if (res) {
            return res.data || [];
        }
        return [];
    }

    /**
     * Reports an error message.
     *
     * @param error Data object with optional `message` and `status` fields for the error
     * @returns Error message
     */
    handleError(error: any): Observable<any> {
        let errMsg = FormService.UNKNOWN_ERROR_MESSAGE;
        if (error) {
            errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : FormService.GENERIC_ERROR_MESSAGE;
        }
        this.logService.error(errMsg);
        return throwError(errMsg);
    }
}
