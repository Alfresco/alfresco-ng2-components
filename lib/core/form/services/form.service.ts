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
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { FormDefinitionModel } from '../models/form-definition.model';
import { ContentLinkModel } from './../components/widgets/core/content-link.model';
import { GroupModel } from './../components/widgets/core/group.model';
import { FormModel, FormOutcomeEvent, FormOutcomeModel, FormValues } from './../components/widgets/core/index';
import {
    FormErrorEvent, FormEvent, FormFieldEvent,
    ValidateDynamicTableRowEvent, ValidateFormEvent, ValidateFormFieldEvent
} from './../events/index';
import { EcmModelService } from './ecm-model.service';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/defaultIfEmpty';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
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
     * Create a Form with a field for each metadata property.
     * @param formName Name of the new form
     * @returns {Observable<any>}
     */
    createFormFromANode(formName: string): Observable<any> {
        return Observable.create(observer => {
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
     * @returns {Observable<any>}
     */
    createForm(formName: string): Observable<any> {
        let dataModel = {
            name: formName,
            description: '',
            modelType: 2,
            stencilSet: 0
        };

        return Observable.fromPromise(
            this.modelsApi.createModel(dataModel)
        );
    }

    /**
     * Saves a form.
     * @param formId ID of the form to save
     * @param formModel Model data for the form
     */
    saveForm(formId: string, formModel: FormDefinitionModel): Observable<any> {
        return Observable.fromPromise(
            this.editorApi.saveForm(formId, formModel)
        );
    }

    /**
     * @deprecated in 1.7.0, use saveForm API instead
     * Add Fields to A form
     * @param formId ID of the form
     * @param formModel Form definition
     * @returns {Observable<any>}
     */
    addFieldsToAForm(formId: string, formModel: FormDefinitionModel): Observable<any> {
        this.logService.log('addFieldsToAForm is deprecated in 1.7.0, use saveForm API instead');
        return Observable.fromPromise(
            this.editorApi.saveForm(formId, formModel)
        );
    }

    /**
     * Search for a form by name.
     * @param name The form name to search for
     * @returns {Observable<any>}
     */
    searchFrom(name: string): Observable<any> {
        let opts = {
            'modelType': 2
        };

        return Observable.fromPromise(
            this.modelsApi.getModels(opts)
        )
            .map(function (forms: any) {
                return forms.data.find(formdata => formdata.name === name);
            })
            .catch(err => this.handleError(err));
    }

    /**
     * Gets all the forms.
     * @returns {Observable<any>}
     */
    getForms(): Observable<any> {
        let opts = {
            'modelType': 2
        };

        return Observable.fromPromise(this.modelsApi.getModels(opts))
            .map(this.toJsonArray)
            .catch(err => this.handleError(err));
    }

    /**
     * Get Process Definitions
     */
    getProcessDefinitions(): Observable<any> {
        return Observable.fromPromise(this.processApi.getProcessDefinitions({}))
            .map(this.toJsonArray)
            .catch(err => this.handleError(err));
    }

    /**
     * Get instance variables for a process.
     * @param processInstanceId ID of the target process
     */
    getProcessVarablesById(processInstanceId: string): Observable<any[]> {
        return Observable.fromPromise(this.processInstanceVariablesApi.getProcessInstanceVariables(processInstanceId))
            .map(this.toJson)
            .catch(err => this.handleError(err));
    }

    /**
     * Gets all the tasks.
     * @returns {Observable<any>}
     */
    getTasks(): Observable<any> {
        return Observable.fromPromise(this.taskApi.listTasks({}))
            .map(this.toJsonArray)
            .catch(err => this.handleError(err));
    }

    /**
     * Gets a task.
     * @param taskId Task Id
     */
    getTask(taskId: string): Observable<any> {
        return Observable.fromPromise(this.taskApi.getTask(taskId))
            .map(this.toJson)
            .catch(err => this.handleError(err));
    }

    /**
     * Save Task Form.
     * @param taskId Task Id
     * @param formValues Form Values
     */
    saveTaskForm(taskId: string, formValues: FormValues): Observable<any> {
        let body = JSON.stringify({values: formValues});

        return Observable.fromPromise(this.taskApi.saveTaskForm(taskId, body))
            .catch(err => this.handleError(err));
    }

    /**
     * Complete Task Form
     * @param taskId Task Id
     * @param formValues Form Values
     * @param outcome Form Outcome
     */
    completeTaskForm(taskId: string, formValues: FormValues, outcome?: string): Observable<any> {
        let data: any = {values: formValues};
        if (outcome) {
            data.outcome = outcome;
        }
        let body = JSON.stringify(data);

        return Observable.fromPromise(this.taskApi.completeTaskForm(taskId, body))
            .catch(err => this.handleError(err));
    }

    /**
     * Get Form related to a taskId
     * @param taskId Task Id
     */
    getTaskForm(taskId: string): Observable<any> {
        return Observable.fromPromise(this.taskApi.getTaskForm(taskId))
            .map(this.toJson)
            .catch(err => this.handleError(err));
    }

    /**
     * Get Form Definition
     * @param formId Form Id
     */
    getFormDefinitionById(formId: string): Observable<any> {
        return Observable.fromPromise(this.editorApi.getForm(formId))
            .map(this.toJson)
            .catch(err => this.handleError(err));
    }

    /**
     * Returns form definition with a given name.
     * @param name The form name
     * @returns {Promise<T>|Promise<ErrorObservable>}
     */
    getFormDefinitionByName(name: string): Observable<any> {
        let opts = {
            'filter': 'myReusableForms',
            'filterText': name,
            'modelType': 2
        };

        return Observable.fromPromise(this.modelsApi.getModels(opts))
            .map(this.getFormId)
            .catch(err => this.handleError(err));
    }

    /**
     * Get start form instance for a given processId
     * @param processId Process definition ID
     */
    getStartFormInstance(processId: string): Observable<any> {
        return Observable.fromPromise(
            this.processApi.getProcessInstanceStartForm(processId))
            .map(this.toJson)
            .catch(err => this.handleError(err));
    }

    /**
     * Gets a process instance.
     * @param processId ID of the process to get
     */
    getProcessIntance(processId: string): Observable<any> {
        return Observable.fromPromise(this.processApi.getProcessInstance(processId))
            .map(this.toJson)
            .catch(err => this.handleError(err));
    }

    /**
     * Get start form definition for a given process
     * @param processId Process definition ID
     */
    getStartFormDefinition(processId: string): Observable<any> {
        return Observable.fromPromise(
            this.processApi.getProcessDefinitionStartForm(processId))
            .map(this.toJson)
            .catch(err => this.handleError(err));
    }

    /**
     * Gets values of fields populated by a REST backend.
     * @param taskId Task identifier
     * @param field Field identifier
     */
    getRestFieldValues(taskId: string, field: string): Observable<any> {
        return Observable.fromPromise(this.taskApi.getRestFieldValues(taskId, field)).catch(err => this.handleError(err));
    }

    /**
     * Gets values of fields populated by a REST backend using a process ID.
     * @param processDefinitionId Process identifier
     * @param field Field identifier
     */
    getRestFieldValuesByProcessId(processDefinitionId: string, field: string): Observable<any> {
        return Observable.fromPromise(this.processApi.getRestFieldValues(processDefinitionId, field)).catch(err => this.handleError(err));
    }

    /**
     * Gets column values of fields populated by a REST backend using a process ID.
     * @param processDefinitionId Process identifier
     * @param field Field identifier
     * @param column Column identifier
     */
    getRestFieldValuesColumnByProcessId(processDefinitionId: string, field: string, column?: string): Observable<any> {
        return Observable.fromPromise(this.processApi.getRestTableFieldValues(processDefinitionId, field, column)).catch(err => this.handleError(err));
    }

    /**
     * Gets column values of fields populated by a REST backend.
     * @param taskId Task identifier
     * @param field Field identifier
     * @param column Column identifier
     */
    getRestFieldValuesColumn(taskId: string, field: string, column?: string): Observable<any> {
        return Observable.fromPromise(this.taskApi.getRestFieldValuesColumn(taskId, field, column)).catch(err => this.handleError(err));
    }

    /**
     * Returns a URL for the profile picture of a user.
     * @param userId ID of the target user
     */
    getUserProfileImageApi(userId: number): string {
        return this.apiService.getInstance().activiti.userApi.getUserProfilePictureUrl(userId);
    }

    /**
     * Gets a list of workflow users.
     * @param filter Filter to select specific users
     * @param groupId Group ID for the search
     */
    getWorkflowUsers(filter: string, groupId?: string): Observable<UserProcessModel[]> {
        let option: any = {filter: filter};
        if (groupId) {
            option.groupId = groupId;
        }
        return Observable.fromPromise(this.usersWorkflowApi.getUsers(option))
            .switchMap((response: any) => <UserProcessModel[]> response.data || [])
            .map((user: any) => {
                user.userImage = this.getUserProfileImageApi(user.id);
                return Observable.of(user);
            })
            .combineAll()
            .defaultIfEmpty([])
            .catch(err => this.handleError(err));
    }

    /**
     * Gets a list of groups in a workflow.
     * @param filter Filter to select specific groups
     * @param groupId Group ID for the search
     */
    getWorkflowGroups(filter: string, groupId?: string): Observable<GroupModel[]> {
        let option: any = {filter: filter};
        if (groupId) {
            option.groupId = groupId;
        }
        return Observable.fromPromise(this.groupsApi.getGroups(option))
            .map((response: any) => <GroupModel[]> response.data || [])
            .catch(err => this.handleError(err));
    }

    /**
     * Gets the ID of a form.
     * @param res Object representing a form
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
     */
    handleError(error: any): Observable<any> {
        let errMsg = FormService.UNKNOWN_ERROR_MESSAGE;
        if (error) {
            errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : FormService.GENERIC_ERROR_MESSAGE;
        }
        this.logService.error(errMsg);
        return Observable.throw(errMsg);
    }
}
