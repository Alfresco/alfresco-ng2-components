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

import { Injectable } from '@angular/core';
import { AlfrescoApiService, LogService } from 'ng2-alfresco-core';
import { Observable, Subject } from 'rxjs/Rx';
import { FormDefinitionModel } from '../models/form-definition.model';
import { ContentLinkModel } from './../components/widgets/core/content-link.model';
import { GroupUserModel } from './../components/widgets/core/group-user.model';
import { GroupModel } from './../components/widgets/core/group.model';
import { FormModel, FormOutcomeEvent, FormOutcomeModel, FormValues } from './../components/widgets/core/index';
import { FormErrorEvent, FormEvent, FormFieldEvent, ValidateFormEvent, ValidateFormFieldEvent } from './../events/index';
import { EcmModelService } from './ecm-model.service';

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

    executeOutcome = new Subject<FormOutcomeEvent>();

    constructor(private ecmModelService: EcmModelService,
                private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    private get contentApi(): any {
        return this.apiService.getInstance().activiti.contentApi;
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

    private get usersWorkflowApi(): any {
        return this.apiService.getInstance().activiti.usersWorkflowApi;
    }

    private get groupsApi(): any {
        return this.apiService.getInstance().activiti.groupsApi;
    }

    parseForm(json: any, data?: FormValues, readOnly: boolean = false): FormModel {
        if (json) {
            let form = new FormModel(json.formDefinition, data, readOnly, this);
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
     * Create a Form with a fields for each metadata properties
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
     * Create a Form
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

    saveForm(formId: string, formModel: FormDefinitionModel): Observable<any> {
        return Observable.fromPromise(
            this.editorApi.saveForm(formId, formModel)
        );
    }

    /**
     * @deprecated in 1.7.0, use saveForm API instead
     * Add Fileds to A form
     * @returns {Observable<any>}
     */
    addFieldsToAForm(formId: string, formModel: FormDefinitionModel): Observable<any> {
        console.log('addFieldsToAForm is deprecated in 1.7.0, use saveForm API instead');
        return Observable.fromPromise(
            this.editorApi.saveForm(formId, formModel)
        );
    }

    /**
     * Search For A Form by name
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
     * Get All the forms
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
     * @returns {Observable<any>}
     */
    getProcessDefinitions(): Observable<any> {
        return Observable.fromPromise(this.processApi.getProcessDefinitions({}))
            .map(this.toJsonArray)
            .catch(err => this.handleError(err));
    }

    /**
     * Get All the Tasks
     * @returns {Observable<any>}
     */
    getTasks(): Observable<any> {
        return Observable.fromPromise(this.taskApi.listTasks({}))
            .map(this.toJsonArray)
            .catch(err => this.handleError(err));
    }

    /**
     * Get Task
     * @param taskId Task Id
     * @returns {Observable<any>}
     */
    getTask(taskId: string): Observable<any> {
        return Observable.fromPromise(this.taskApi.getTask(taskId))
            .map(this.toJson)
            .catch(err => this.handleError(err));
    }

    /**
     * Save Task Form
     * @param taskId Task Id
     * @param formValues Form Values
     * @returns {Observable<any>}
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
     * @returns {Observable<any>}
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
     * @returns {Observable<any>}
     */
    getTaskForm(taskId: string): Observable<any> {
        return Observable.fromPromise(this.taskApi.getTaskForm(taskId))
            .map(this.toJson)
            .catch(err => this.handleError(err));
    }

    /**
     * Get Form Definition
     * @param formId Form Id
     * @returns {Observable<any>}
     */
    getFormDefinitionById(formId: string): Observable<any> {
        return Observable.fromPromise(this.editorApi.getForm(formId))
            .map(this.toJson)
            .catch(err => this.handleError(err));
    }

    /**
     * Returns form definition by a given name.
     * @param name
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
     * @returns {Observable<any>}
     */
    getStartFormInstance(processId: string): Observable<any> {
        return Observable.fromPromise(
            this.processApi.getProcessInstanceStartForm(processId))
            .map(this.toJson)
            .catch(err => this.handleError(err));
    }

    /**
     * Get start form definition for a given process
     * @param processId Process definition ID
     * @returns {Observable<any>}
     */
    getStartFormDefinition(processId: string): Observable<any> {
        return Observable.fromPromise(
            this.processApi.getProcessDefinitionStartForm(processId))
            .map(this.toJson)
            .catch(err => this.handleError(err));
    }

    /**
     * Save File
     * @param file file
     * @returns {Observable<any>}
     */
    createTemporaryRawRelatedContent(file: any): Observable<any> {
        return Observable.fromPromise(this.contentApi.createTemporaryRawRelatedContent(file)).catch(err => this.handleError(err));
    }

    getFileContent(contentId: number): Observable<any> {
        return Observable.fromPromise(this.contentApi.getContent(contentId)).catch(err => this.handleError(err));
    }

    getFileRawContent(contentId: number): Observable<any> {
        return Observable.fromPromise(this.contentApi.getRawContent(contentId)).catch(err => this.handleError(err));
    }

    getFileRawContentUrl(contentId: number): string {
        return this.contentApi.getRawContentUrl(contentId);
    }

    getContentThumbnailUrl(contentId: number): Observable<any> {
        return Observable.fromPromise(this.contentApi.getContentThumbnailUrl(contentId)).catch(err => this.handleError(err));
    }

    getRestFieldValues(taskId: string, field: string): Observable<any> {
        return Observable.fromPromise(this.taskApi.getRestFieldValues(taskId, field)).catch(err => this.handleError(err));
    }

    getRestFieldValuesByProcessId(processDefinitionId: string, field: string): Observable<any> {
        return Observable.fromPromise(this.processApi.getRestFieldValues(processDefinitionId, field)).catch(err => this.handleError(err));
    }

    getRestFieldValuesColumnByProcessId(processDefinitionId: string, field: string, column?: string): Observable<any> {
        return Observable.fromPromise(this.processApi.getRestTableFieldValues(processDefinitionId, field, column)).catch(err => this.handleError(err));
    }

    getRestFieldValuesColumn(taskId: string, field: string, column?: string): Observable<any> {
        return Observable.fromPromise(this.taskApi.getRestFieldValuesColumn(taskId, field, column)).catch(err => this.handleError(err));
    }

    private getUserProfileImageApi(userId: string): string {
        return this.apiService.getInstance().activiti.userApi.getUserProfilePictureUrl(userId);
    }

    getWorkflowUsers(filter: string, groupId?: string): Observable<GroupUserModel[]> {
        let option: any = {filter: filter};
        if (groupId) {
            option.groupId = groupId;
        }
        return Observable.fromPromise(this.usersWorkflowApi.getUsers(option))
            .switchMap((response: any) => <GroupUserModel[]> response.data || [])
            .map((user: any) => {
                    user.userImage = this.getUserProfileImageApi(user.id);
                    return Observable.of(user);
                })
            .combineAll()
            .catch(err => this.handleError(err));
    }

    getWorkflowGroups(filter: string, groupId?: string): Observable<GroupModel[]> {
        let option: any = {filter: filter};
        if (groupId) {
            option.groupId = groupId;
        }
        return Observable.fromPromise(this.groupsApi.getGroups(option))
            .map((response: any) => <GroupModel[]> response.data || [])
            .catch(err => this.handleError(err));
    }

    getFormId(res: any): string {
        let result = null;

        if (res && res.data && res.data.length > 0) {
            result = res.data[0].id;
        }

        return result;
    }

    toJson(res: any) {
        if (res) {
            return res || {};
        }
        return {};
    }

    toJsonArray(res: any) {
        if (res) {
            return res.data || [];
        }
        return [];
    }

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
