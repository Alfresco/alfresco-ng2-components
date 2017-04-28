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
import { Observable, Subject } from 'rxjs/Rx';
import { AlfrescoApiService, LogService } from 'ng2-alfresco-core';
import { FormValues } from './../components/widgets/core/index';
import { FormDefinitionModel } from '../models/form-definition.model';
import { EcmModelService } from './ecm-model.service';
import { GroupModel } from './../components/widgets/core/group.model';
import { GroupUserModel } from './../components/widgets/core/group-user.model';
import { FormEvent, FormErrorEvent, FormFieldEvent } from './../events/index';
import { ContentLinkModel } from './../components/widgets/core/content-link.model';

@Injectable()
export class FormService {

    static UNKNOWN_ERROR_MESSAGE: string = 'Unknown error';
    static GENERIC_ERROR_MESSAGE: string = 'Server error';

    formLoaded: Subject<FormEvent> = new Subject<FormEvent>();
    formFieldValueChanged: Subject<FormFieldEvent> = new Subject<FormFieldEvent>();
    taskCompleted: Subject<FormEvent> = new Subject<FormEvent>();
    taskCompletedError: Subject<FormErrorEvent> = new Subject<FormErrorEvent>();
    taskSaved: Subject<FormEvent> = new Subject<FormEvent>();
    taskSavedError: Subject<FormErrorEvent> = new Subject<FormErrorEvent>();
    formContentClicked: Subject<ContentLinkModel> = new Subject<ContentLinkModel>();

    constructor(private ecmModelService: EcmModelService,
                private apiService: AlfrescoApiService,
                private logService: LogService) {
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

        return Observable.fromPromise(this.apiService.getInstance().activiti.modelsApi.createModel(dataModel));
    }

    /**
     * Add Fileds to A form
     * @returns {Observable<any>}
     */
    addFieldsToAForm(formId: string, formModel: FormDefinitionModel): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.editorApi.saveForm(formId, formModel));
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
            this.apiService.getInstance().activiti.modelsApi.getModels(opts))
            .map(function (forms: any) {
                return forms.data.find(formdata => formdata.name === name);
            })
            .catch(err => this.handleError(err)
            );
    }

    /**
     * Get All the forms
     * @returns {Observable<any>}
     */
    getForms(): Observable<any> {
        let opts = {
            'modelType': 2
        };

        return Observable.fromPromise(this.apiService.getInstance().activiti.modelsApi.getModels(opts));
    }

    /**
     * Get Process Definitions
     * @returns {Observable<any>}
     */
    getProcessDefinitions(): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.processApi.getProcessDefinitions({}))
            .map(this.toJsonArray)
            .catch(err => this.handleError(err));
    }

    /**
     * Get All the Tasks
     * @returns {Observable<any>}
     */
    getTasks(): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.taskApi.listTasks({}))
            .map(this.toJsonArray)
            .catch(err => this.handleError(err));
    }

    /**
     * Get Task
     * @param taskId Task Id
     * @returns {Observable<any>}
     */
    getTask(taskId: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.taskApi.getTask(taskId))
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

        return Observable.fromPromise(this.apiService.getInstance().activiti.taskApi.saveTaskForm(taskId, body))
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

        return Observable.fromPromise(this.apiService.getInstance().activiti.taskApi.completeTaskForm(taskId, body))
            .catch(err => this.handleError(err));
    }

    /**
     * Get Form related to a taskId
     * @param taskId Task Id
     * @returns {Observable<any>}
     */
    getTaskForm(taskId: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.taskApi.getTaskForm(taskId))
            .map(this.toJson)
            .catch(err => this.handleError(err));
    }

    /**
     * Get Form Definition
     * @param formId Form Id
     * @returns {Observable<any>}
     */
    getFormDefinitionById(formId: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.editorApi.getForm(formId))
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

        return Observable.fromPromise(this.apiService.getInstance().activiti.modelsApi.getModels(opts))
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
            this.apiService.getInstance().activiti.processApi.getProcessInstanceStartForm(processId))
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
            this.apiService.getInstance().activiti.processApi.getProcessDefinitionStartForm(processId))
            .map(this.toJson)
            .catch(err => this.handleError(err));
    }

    /**
     * Save File
     * @param file file
     * @returns {Observable<any>}
     */
    createTemporaryRawRelatedContent(file: any): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.contentApi.createTemporaryRawRelatedContent(file)).catch(err => this.handleError(err));
    }

    getFileContent(contentId: number): Observable<any> {
        let alfrescoApi = this.apiService.getInstance();
        return Observable.fromPromise(alfrescoApi.activiti.contentApi.getContent(contentId)).catch(err => this.handleError(err));
    }

    getFileRawContent(contentId: number): Observable<any> {
        let alfrescoApi = this.apiService.getInstance();
        return Observable.fromPromise(alfrescoApi.activiti.contentApi.getRawContent(contentId)).catch(err => this.handleError(err));
    }

    getFileRawContentUrl(contentId: number): string {
        let alfrescoApi = this.apiService.getInstance();
        return alfrescoApi.activiti.contentApi.getRawContentUrl(contentId);
    }

    getContentThumbnailUrl(contentId: number): Observable<any> {
        let alfrescoApi = this.apiService.getInstance();
        return Observable.fromPromise(alfrescoApi.activiti.contentApi.getContentThumbnailUrl(contentId)).catch(err => this.handleError(err));
    }

    getRestFieldValues(taskId: string, field: string): Observable<any> {
        let alfrescoApi = this.apiService.getInstance();
        return Observable.fromPromise(alfrescoApi.activiti.taskApi.getRestFieldValues(taskId, field)).catch(err => this.handleError(err));
    }

    getRestFieldValuesByProcessId(processDefinitionId: string, field: string): Observable<any> {
        let alfrescoApi = this.apiService.getInstance();
        return Observable.fromPromise(alfrescoApi.activiti.processApi.getRestFieldValues(processDefinitionId, field)).catch(err => this.handleError(err));
    }

    getRestFieldValuesColumnByProcessId(processDefinitionId: string, field: string, column?: string): Observable<any> {
        let alfrescoApi = this.apiService.getInstance();
        return Observable.fromPromise(alfrescoApi.activiti.processApi.getRestTableFieldValues(processDefinitionId, field, column)).catch(err => this.handleError(err));
    }

    getRestFieldValuesColumn(taskId: string, field: string, column?: string): Observable<any> {
        let alfrescoApi = this.apiService.getInstance();
        return Observable.fromPromise(alfrescoApi.activiti.taskApi.getRestFieldValuesColumn(taskId, field, column)).catch(err => this.handleError(err));
    }

    getWorkflowUsers(filter: string, groupId?: string): Observable<GroupUserModel[]> {
        let option: any = {filter: filter};
        if (groupId) {
            option.groupId = groupId;
        }
        return Observable.fromPromise(this.getWorkflowUserApi(option))
            .map((response: any) => <GroupUserModel[]> response.data || [])
            .catch(err => this.handleError(err));
    }

    private getWorkflowUserApi(options: any) {
        let alfrescoApi = this.apiService.getInstance();
        return alfrescoApi.activiti.usersWorkflowApi.getUsers(options);
    }

    getWorkflowGroups(filter: string, groupId?: string): Observable<GroupModel[]> {
        let option: any = {filter: filter};
        if (groupId) {
            option.groupId = groupId;
        }
        return Observable.fromPromise(this.getWorkflowGroupsApi(option))
            .map((response: any) => <GroupModel[]> response.data || [])
            .catch(err => this.handleError(err));
    }

    private getWorkflowGroupsApi(options: any) {
        let alfrescoApi = this.apiService.getInstance();
        return alfrescoApi.activiti.groupsApi.getGroups(options);
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
