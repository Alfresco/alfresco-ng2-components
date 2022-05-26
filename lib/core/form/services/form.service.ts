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

import { ApiClientsService } from '@alfresco/adf-core/api';
import { LogService } from '../../services/log.service';
import { UserProcessModel } from '../../models';
import { Injectable } from '@angular/core';
import { Observable, Subject, from, of, throwError } from 'rxjs';
import { FormDefinitionModel } from '../models/form-definition.model';
import { ContentLinkModel } from './../components/widgets/core/content-link.model';
import { GroupModel } from './../components/widgets/core/group.model';
import { EcmModelService } from './ecm-model.service';
import { map, catchError, switchMap, combineAll, defaultIfEmpty } from 'rxjs/operators';
import {
    CompleteFormRepresentation,
    SaveFormRepresentation
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

    get taskFormsApi() {
        return this.apiClientsService.get('ActivitiClient.task-forms');
    }

    get taskApi() {
        return this.apiClientsService.get('ActivitiClient.tasks');
    }

    get modelsApi() {
        return this.apiClientsService.get('ActivitiClient.models');
    }

    get editorApi() {
        return this.apiClientsService.get('ActivitiClient.form-models');
    }

    get processDefinitionsApi() {
        return this.apiClientsService.get('ActivitiClient.process-definitions');
    }

    get processInstanceVariablesApi() {
        return this.apiClientsService.get('ActivitiClient.process-instance-variables');
    }

    get processInstancesApi() {
        return this.apiClientsService.get('ActivitiClient.process-instances');
    }

    get groupsApi() {
        return this.apiClientsService.get('ActivitiClient.activiti-groups');
    }

    get usersApi() {
        return this.apiClientsService.get('ActivitiClient.users');
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

    constructor(
        private ecmModelService: EcmModelService,
        protected logService: LogService,
        private apiClientsService: ApiClientsService
    ) {}

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
     * Creates a Form with a field for each metadata property.
     *
     * @param formName Name of the new form
     * @returns The new form
     */
    createFormFromANode(formName: string): Observable<any> {
        return new Observable((observer) => {
            this.createForm(formName).subscribe(
                (form) => {
                    this.ecmModelService.searchEcmType(formName, EcmModelService.MODEL_NAME).subscribe(
                        (customType) => {
                            const formDefinitionModel = new FormDefinitionModel(form.id, form.name, form.lastUpdatedByFullName, form.lastUpdated, customType.entry.properties);
                            from(
                                this.editorApi.saveForm(form.id, formDefinitionModel)
                            ).subscribe((formData) => {
                                observer.next(formData);
                                observer.complete();
                            }, (err) => this.handleError(err));
                        },
                        (err) => this.handleError(err));
                },
                (err) => this.handleError(err));
        });
    }

    /**
     * Create a Form.
     *
     * @param formName Name of the new form
     * @returns The new form
     */
    createForm(formName: string): Observable<any> {
        const dataModel = {
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
     *
     * @param formId ID of the form to save
     * @param formModel Model data for the form
     * @returns Data for the saved form
     */
    saveForm(formId: number, formModel: FormDefinitionModel): Observable<any> {
        return from(
            this.editorApi.saveForm(formId, formModel)
        );
    }

    /**
     * Searches for a form by name.
     *
     * @param name The form name to search for
     * @returns Form model(s) matching the search name
     */
    searchFrom(name: string): Observable<any> {
        const opts = {
            modelType: 2
        };

        return from(
            this.modelsApi.getModels(opts)
        )
            .pipe(
                map((forms: any) => forms.data.find((formData) => formData.name === name)),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets all the forms.
     *
     * @returns List of form models
     */
    getForms(): Observable<any> {
        const opts = {
            modelType: 2
        };

        return from(this.modelsApi.getModels(opts))
            .pipe(
                map(this.toJsonArray),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets process definitions.
     *
     * @returns List of process definitions
     */
    getProcessDefinitions(): Observable<any> {
        return from(this.processDefinitionsApi.getProcessDefinitions({}))
            .pipe(
                map(this.toJsonArray),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets instance variables for a process.
     *
     * @param processInstanceId ID of the target process
     * @returns List of instance variable information
     */
    getProcessVariablesById(processInstanceId: string): Observable<any[]> {
        return from(this.processInstanceVariablesApi.getProcessInstanceVariables(processInstanceId))
            .pipe(
                map(this.toJson),
                catchError((err) => this.handleError(err))
            );
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
     * Gets a form definition.
     *
     * @param formId ID of the target form
     * @returns Form definition
     */
    getFormDefinitionById(formId: number): Observable<any> {
        return from(this.editorApi.getForm(formId))
            .pipe(
                map(this.toJson),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets the form definition with a given name.
     *
     * @param name The form name
     * @returns Form definition
     */
    getFormDefinitionByName(name: string): Observable<any> {
        const opts = {
            filter: 'myReusableForms',
            filterText: name,
            modelType: 2
        };

        return from(this.modelsApi.getModels(opts))
            .pipe(
                map(this.getFormId),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets the start form instance for a given process.
     *
     * @param processId Process definition ID
     * @returns Form definition
     */
    getStartFormInstance(processId: string): Observable<any> {
        return from(this.processInstancesApi.getProcessInstanceStartForm(processId))
            .pipe(
                map(this.toJson),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets a process instance.
     *
     * @param processId ID of the process to get
     * @returns Process instance
     */
    getProcessInstance(processId: string): Observable<any> {
        return from(this.processInstancesApi.getProcessInstance(processId))
            .pipe(
                map(this.toJson),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets the start form definition for a given process.
     *
     * @param processId Process definition ID
     * @returns Form definition
     */
    getStartFormDefinition(processId: string): Observable<any> {
        return from(this.processDefinitionsApi.getProcessDefinitionStartForm(processId))
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
     * Returns a URL for the profile picture of a user.
     *
     * @param userId ID of the target user
     * @returns URL string
     */
    getUserProfileImageApi(userId: string): string {
        return this.usersApi.getUserProfilePictureUrl(userId);
    }

    /**
     * Gets a list of workflow users.
     *
     * @param filter Filter to select specific users
     * @param groupId Group ID for the search
     * @returns Array of users
     */
    getWorkflowUsers(filter: string, groupId?: string): Observable<UserProcessModel[]> {
        const option: any = { filter };
        if (groupId) {
            option.groupId = groupId;
        }
        return from(this.usersApi.getUsers(option))
            .pipe(
                switchMap(response => response.data as UserProcessModel[] || []),
                map((user) => {
                    user.userImage = this.getUserProfileImageApi(user.id.toString());
                    return of(user);
                }),
                combineAll(),
                defaultIfEmpty([]),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets a list of groups in a workflow.
     *
     * @param filter Filter to select specific groups
     * @param groupId Group ID for the search
     * @returns Array of groups
     */
    getWorkflowGroups(filter: string, groupId?: string): Observable<GroupModel[]> {
        const option: any = { filter };
        if (groupId) {
            option.groupId = groupId;
        }
        return from(this.groupsApi.getGroups(option))
            .pipe(
                map((response: any) => response.data || []),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets the ID of a form.
     *
     * @param form Object representing a form
     * @returns ID string
     */
    getFormId(form: any): string {
        let result = null;

        if (form && form.data && form.data.length > 0) {
            result = form.data[0].id;
        }

        return result;
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
