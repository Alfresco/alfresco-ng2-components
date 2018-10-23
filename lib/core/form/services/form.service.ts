/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { UserProcessModel } from '../../models';
import { Injectable } from '@angular/core';
import { Observable, Subject, from, of, throwError } from 'rxjs';
import { FormDefinitionModel } from '../models/form-definition.model';
import { ContentLinkModel } from './../components/widgets/core/content-link.model';
import { GroupModel } from './../components/widgets/core/group.model';
import { FormModel, FormOutcomeEvent, FormOutcomeModel, FormValues } from './../components/widgets/core/index';
import {
    FormErrorEvent, FormEvent, FormFieldEvent,
    ValidateDynamicTableRowEvent, ValidateFormEvent, ValidateFormFieldEvent
} from './../events/index';
import { EcmModelService } from './ecm-model.service';
import { map, catchError, switchMap, combineAll, defaultIfEmpty } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FormService {

    static UNKNOWN_ERROR_MESSAGE: string = 'Unknown error';
    static GENERIC_ERROR_MESSAGE: string = 'Server error';

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

    constructor(private ecmModelService: EcmModelService,
                private apiService: AlfrescoApiService,
                protected logService: LogService) {
    }

    private get taskApi(): any {
        return this.apiService.getInstance().activiti.taskApi;
    }

    private get modelsApi(): any {
        return this.apiService.getInstance().activiti.modelsApi;
    }

    private get editorApi(): any {
        return this.apiService.getInstance().activiti.editorApi;
    }

    private get processApi(): any {
        return this.apiService.getInstance().activiti.processApi;
    }

    private get processInstanceVariablesApi(): any {
        return this.apiService.getInstance().activiti.processInstanceVariablesApi;
    }

    private get usersWorkflowApi(): any {
        return this.apiService.getInstance().activiti.usersWorkflowApi;
    }

    private get groupsApi(): any {
        return this.apiService.getInstance().activiti.groupsApi;
    }

    /**
     * Parses JSON data to create a corresponding Form model.
     * @param json JSON to create the form
     * @param data Values for the form fields
     * @param readOnly Should the form fields be read-only?
     * @returns Form model created from input data
     */
    parseForm(json: any, data?: FormValues, readOnly: boolean = false): FormModel {
        if (json) {
            let form = new FormModel(json, data, readOnly, this);
            if (!json.fields) {
                form.outcomes = [
                    new FormOutcomeModel(form, {
                        id: '$custom',
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
     * Creates a Form with a field for each metadata property.
     * @param formName Name of the new form
     * @returns The new form
     */
    createFormFromANode(formName: string): Observable<any> {
        return new Observable(observer => {
            this.createForm(formName).subscribe(
                form => {
                    this.ecmModelService.searchEcmType(formName, EcmModelService.MODEL_NAME).subscribe(
                        customType => {
                            let formDefinitionModel = new FormDefinitionModel(form.id, form.name, form.lastUpdatedByFullName, form.lastUpdated, customType.entry.properties);
                            this.addFieldsToAForm(form.id, formDefinitionModel).subscribe(formData => {
                                observer.next(formData);
                                observer.complete();
                            }, err => this.handleError(err));
                        },
                        err => this.handleError(err));
                },
                err => this.handleError(err));
        });
    }

    /**
     * Create a Form.
     * @param formName Name of the new form
     * @returns The new form
     */
    createForm(formName: string): Observable<any> {
        let dataModel = {
            name: formName,
            description: '',
            modelType: 2,
            stencilSet: 0
        };

        return from(
            this.modelsApi.createModel(dataModel)
        );
    }

    /**
     * Saves a form.
     * @param formId ID of the form to save
     * @param formModel Model data for the form
     * @returns Data for the saved form
     */
    saveForm(formId: string, formModel: FormDefinitionModel): Observable<any> {
        return from(
            this.editorApi.saveForm(formId, formModel)
        );
    }

    /**
     * Add Fields to a form
     * @deprecated in 1.7.0, use saveForm API instead
     * @param formId ID of the form
     * @param formModel Form definition
     */
    addFieldsToAForm(formId: string, formModel: FormDefinitionModel): Observable<any> {
        this.logService.log('addFieldsToAForm is deprecated in 1.7.0, use saveForm API instead');
        return from(
            this.editorApi.saveForm(formId, formModel)
        );
    }

    /**
     * Searches for a form by name.
     * @param name The form name to search for
     * @returns Form model(s) matching the search name
     */
    searchFrom(name: string): Observable<any> {
        let opts = {
            'modelType': 2
        };

        return from(
            this.modelsApi.getModels(opts)
        )
        .pipe(
            map(function (forms: any) {
                return forms.data.find(formData => formData.name === name);
            }),
            catchError(err => this.handleError(err))
        );
    }

    /**
     * Gets all the forms.
     * @returns List of form models
     */
    getForms(): Observable<any> {
        let opts = {
            'modelType': 2
        };

        return from(this.modelsApi.getModels(opts))
            .pipe(
                map(this.toJsonArray),
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets process definitions.
     * @returns List of process definitions
     */
    getProcessDefinitions(): Observable<any> {
        return from(this.processApi.getProcessDefinitions({}))
            .pipe(
                map(this.toJsonArray),
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets instance variables for a process.
     * @param processInstanceId ID of the target process
     * @returns List of instance variable information
     */
    getProcessVariablesById(processInstanceId: string): Observable<any[]> {
        return from(this.processInstanceVariablesApi.getProcessInstanceVariables(processInstanceId))
            .pipe(
                map(this.toJson),
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets all the tasks.
     * @returns List of tasks
     */
    getTasks(): Observable<any> {
        return from(this.taskApi.listTasks({}))
            .pipe(
                map(this.toJsonArray),
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets a task.
     * @param taskId Task Id
     * @returns Task info
     */
    getTask(taskId: string): Observable<any> {
        return from(this.taskApi.getTask(taskId))
            .pipe(
                map(this.toJson),
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Saves a task form.
     * @param taskId Task Id
     * @param formValues Form Values
     * @returns Null response when the operation is complete
     */
    saveTaskForm(taskId: string, formValues: FormValues): Observable<any> {
        let body = JSON.stringify({values: formValues});

        return from(this.taskApi.saveTaskForm(taskId, body))
            .pipe(
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Completes a Task Form.
     * @param taskId Task Id
     * @param formValues Form Values
     * @param outcome Form Outcome
     * @returns Null response when the operation is complete
     */
    completeTaskForm(taskId: string, formValues: FormValues, outcome?: string): Observable<any> {
        let data: any = {values: formValues};
        if (outcome) {
            data.outcome = outcome;
        }
        let body = JSON.stringify(data);

        return from(this.taskApi.completeTaskForm(taskId, body))
            .pipe(
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets a form related to a task.
     * @param taskId ID of the target task
     * @returns Form definition
     */
    getTaskForm(taskId: string): Observable<any> {
        return from(this.taskApi.getTaskForm(taskId))
            .pipe(
                map(this.toJson),
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets a form definition.
     * @param formId ID of the target form
     * @returns Form definition
     */
    getFormDefinitionById(formId: string): Observable<any> {
        return from(this.editorApi.getForm(formId))
            .pipe(
                map(this.toJson),
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets the form definition with a given name.
     * @param name The form name
     * @returns Form definition
     */
    getFormDefinitionByName(name: string): Observable<any> {
        let opts = {
            'filter': 'myReusableForms',
            'filterText': name,
            'modelType': 2
        };

        return from(this.modelsApi.getModels(opts))
            .pipe(
                map(this.getFormId),
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets the start form instance for a given process.
     * @param processId Process definition ID
     * @returns Form definition
     */
    getStartFormInstance(processId: string): Observable<any> {
        return from(this.processApi.getProcessInstanceStartForm(processId))
            .pipe(
                map(this.toJson),
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets a process instance.
     * @param processId ID of the process to get
     * @returns Process instance
     */
    getProcessInstance(processId: string): Observable<any> {
        return from(this.processApi.getProcessInstance(processId))
            .pipe(
                map(this.toJson),
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets the start form definition for a given process.
     * @param processId Process definition ID
     * @returns Form definition
     */
    getStartFormDefinition(processId: string): Observable<any> {
        return from(this.processApi.getProcessDefinitionStartForm(processId))
            .pipe(
                map(this.toJson),
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets values of fields populated by a REST backend.
     * @param taskId Task identifier
     * @param field Field identifier
     * @returns Field values
     */
    getRestFieldValues(taskId: string, field: string): Observable<any> {
        return from(this.taskApi.getRestFieldValues(taskId, field))
            .pipe(
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets values of fields populated by a REST backend using a process ID.
     * @param processDefinitionId Process identifier
     * @param field Field identifier
     * @returns Field values
     */
    getRestFieldValuesByProcessId(processDefinitionId: string, field: string): Observable<any> {
        return from(this.processApi.getRestFieldValues(processDefinitionId, field))
            .pipe(
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets column values of fields populated by a REST backend using a process ID.
     * @param processDefinitionId Process identifier
     * @param field Field identifier
     * @param column Column identifier
     * @returns Field values
     */
    getRestFieldValuesColumnByProcessId(processDefinitionId: string, field: string, column?: string): Observable<any> {
        return from(this.processApi.getRestTableFieldValues(processDefinitionId, field, column))
            .pipe(
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets column values of fields populated by a REST backend.
     * @param taskId Task identifier
     * @param field Field identifier
     * @param column Column identifier
     * @returns Field values
     */
    getRestFieldValuesColumn(taskId: string, field: string, column?: string): Observable<any> {
        return from(this.taskApi.getRestFieldValuesColumn(taskId, field, column))
            .pipe(
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Returns a URL for the profile picture of a user.
     * @param userId ID of the target user
     * @returns URL string
     */
    getUserProfileImageApi(userId: number): string {
        return this.apiService.getInstance().activiti.userApi.getUserProfilePictureUrl(userId);
    }

    /**
     * Gets a list of workflow users.
     * @param filter Filter to select specific users
     * @param groupId Group ID for the search
     * @returns Array of users
     */
    getWorkflowUsers(filter: string, groupId?: string): Observable<UserProcessModel[]> {
        let option: any = {filter: filter};
        if (groupId) {
            option.groupId = groupId;
        }
        return from(this.usersWorkflowApi.getUsers(option))
            .pipe(
                switchMap((response: any) => <UserProcessModel[]> response.data || []),
                map((user: any) => {
                    user.userImage = this.getUserProfileImageApi(user.id);
                    return of(user);
                }),
                combineAll(),
                defaultIfEmpty([]),
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets a list of groups in a workflow.
     * @param filter Filter to select specific groups
     * @param groupId Group ID for the search
     * @returns Array of groups
     */
    getWorkflowGroups(filter: string, groupId?: string): Observable<GroupModel[]> {
        let option: any = {filter: filter};
        if (groupId) {
            option.groupId = groupId;
        }
        return from(this.groupsApi.getGroups(option))
            .pipe(
                map((response: any) => <GroupModel[]> response.data || []),
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Gets the ID of a form.
     * @param res Object representing a form
     * @returns ID string
     */
    getFormId(res: any): string {
        let result = null;

        if (res && res.data && res.data.length > 0) {
            result = res.data[0].id;
        }

        return result;
    }

    /**
     * Creates a JSON representation of form data.
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
