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
import { Observable } from 'rxjs/Rx';
import { AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { FormValues } from './../components/widgets/core/index';
import { FormDefinitionModel } from '../models/form-definition.model';
import { EcmModelService } from './ecm-model.service';

@Injectable()
export class FormService {

    static UNKNOWN_ERROR_MESSAGE: string = 'Unknown error';
    static GENERIC_ERROR_MESSAGE: string = 'Server error';

    constructor(private authService: AlfrescoAuthenticationService,
                private ecmModelService: EcmModelService) {
    }

    /**
     * Create a Form with a fields for each metadata properties
     * @returns {Observable<any>}
     */
    public createFormFromNodeType(formName: string): Observable<any> {
        return Observable.create(observer => {
            this.createForm(formName).subscribe(
                form => {
                    this.ecmModelService.searchFormType(formName).subscribe(
                        customType => {
                            let formDefinitionModel = new FormDefinitionModel(form.id, form.name, form.lastUpdatedByFullName, form.lastUpdated, customType.entry.properties);
                            this.addFieldsNodeTypePropertiesToTheForm(form.id, formDefinitionModel).subscribe(formData => {
                                observer.next(formData);
                                observer.complete();
                            }, this.handleError);
                        },
                        this.handleError);
                }, this.handleError);
        });
    }

    /**
     * Create a Form
     * @returns {Observable<any>}
     */
    public createForm(formName: string): Observable<any> {
        let dataModel = {
            name: formName,
            description: '',
            modelType: 2,
            stencilSet: 0
        };

        return Observable.fromPromise(this.authService.getAlfrescoApi().activiti.modelsApi.createModel(dataModel));
    }

    /**
     * Add Fields to A form from a metadata properties
     * @returns {Observable<any>}
     */
    public addFieldsNodeTypePropertiesToTheForm(formId: string, formDefinitionModel: FormDefinitionModel): Observable<any> {
        return this.addFieldsToAForm(formId, formDefinitionModel);
    }

    /**
     * Add Fileds to A form
     * @returns {Observable<any>}
     */
    public addFieldsToAForm(formId: string, formModel: FormDefinitionModel): Observable<any> {
        return Observable.fromPromise(this.authService.getAlfrescoApi().activiti.editorApi.saveForm(formId, formModel));
    }

    /**
     * Search For A Form by name
     * @returns {Observable<any>}
     */
    public searchFrom(name: string): Observable<any> {
        let opts = {
            'modelType': 2
        };

        return Observable.fromPromise(this.authService.getAlfrescoApi().activiti.modelsApi.getModels(opts)).map(function (forms: any) {
            return forms.data.find(formdata => formdata.name === name);
        }).catch(this.handleError);
    }

    /**
     * Get All the forms
     * @returns {Observable<any>}
     */
    public getForms(): Observable<any> {
        let opts = {
            'modelType': 2
        };

        return Observable.fromPromise(this.authService.getAlfrescoApi().activiti.modelsApi.getModels(opts));
    }

    /**
     * Get Process Definition
     * @returns {Observable<any>}
     */
    public getProcessDefinitions(): Observable<any> {
        return Observable.fromPromise(this.authService.getAlfrescoApi().activiti.processApi.getProcessDefinitions({}))
            .map(this.toJsonArray)
            .catch(this.handleError);
    }

    /**
     * Get All the Tasks
     * @param taskId Task Id
     * @returns {Observable<any>}
     */
    public getTasks(): Observable<any> {
        return Observable.fromPromise(this.authService.getAlfrescoApi().activiti.taskApi.listTasks({}))
            .map(this.toJsonArray)
            .catch(this.handleError);
    }

    /**
     * Get Task
     * @param taskId Task Id
     * @returns {Observable<any>}
     */
    public getTask(taskId: string): Observable<any> {
        return Observable.fromPromise(this.authService.getAlfrescoApi().activiti.taskApi.getTask(taskId))
            .map(this.toJson)
            .catch(this.handleError);
    }

    /**
     * Save Task Form
     * @param taskId Task Id
     * @param formValues Form Values
     * @returns {Observable<any>}
     */
    public saveTaskForm(taskId: string, formValues: FormValues): Observable<any> {
        let body = JSON.stringify({values: formValues});

        return Observable.fromPromise(this.authService.getAlfrescoApi().activiti.taskApi.saveTaskForm(taskId, body))
            .catch(this.handleError);
    }

    /**
     * Complete Task Form
     * @param taskId Task Id
     * @param formValues Form Values
     * @param outcome Form Outcome
     * @returns {Observable<any>}
     */
    public completeTaskForm(taskId: string, formValues: FormValues, outcome?: string): Observable<any> {
        let data: any = {values: formValues};
        if (outcome) {
            data.outcome = outcome;
        }
        let body = JSON.stringify(data);

        return Observable.fromPromise(this.authService.getAlfrescoApi().activiti.taskApi.completeTaskForm(taskId, body))
            .catch(this.handleError);
    }

    /**
     * Get Form related to a taskId
     * @param taskId Task Id
     * @returns {Observable<any>}
     */
    public getTaskForm(taskId: string): Observable<any> {
        return Observable.fromPromise(this.authService.getAlfrescoApi().activiti.taskApi.getTaskForm(taskId))
            .map(this.toJson)
            .catch(this.handleError);
    }

    /**
     * Get Form Definition
     * @param formId Form Id
     * @returns {Observable<any>}
     */
    public getFormDefinitionById(formId: string): Observable<any> {
        return Observable.fromPromise(this.authService.getAlfrescoApi().activiti.editorApi.getForm(formId))
            .map(this.toJson)
            .catch(this.handleError);
    }

    /**
     * Returns form definition ID by a given name.
     * @param name
     * @returns {Promise<T>|Promise<ErrorObservable>}
     */
    public getFormDefinitionByName(name: string): Observable<any> {
        let opts = {
            'filter': 'myReusableForms',
            'filterText': name,
            'modelType': 2
        };

        return Observable.fromPromise(this.authService.getAlfrescoApi().activiti.modelsApi.getModels(opts))
            .map(this.getFormId)
            .catch(this.handleError);
    }

    getFormId(res: any) {
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
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
