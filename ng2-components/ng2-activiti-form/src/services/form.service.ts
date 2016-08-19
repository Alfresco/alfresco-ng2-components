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
import { Response, Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { FormValues } from './../components/widgets/core/index';
import { AlfrescoSettingsService } from 'ng2-alfresco-core';

@Injectable()
export class FormService {

    static UNKNOWN_ERROR_MESSAGE: string = 'Unknown error';
    static GENERIC_ERROR_MESSAGE: string = 'Server error';

    constructor(private http: Http,
                private authService: AlfrescoAuthenticationService,
                private alfrescoSettingsService: AlfrescoSettingsService) {
    }

    getHostAddress(): string {
        return this.alfrescoSettingsService.bpmHost;
    }

    getProcessDefinitions(): Observable<any> {
        let url = `${this.getHostAddress()}/activiti-app/api/enterprise/process-definitions`;
        let options = this.getRequestOptions();
        return this.http
            .get(url, options)
            .map(this.toJsonArray)
            .catch(this.handleError);
    }

    getTasks(): Observable<any> {
        let url = `${this.getHostAddress()}/activiti-app/api/enterprise/tasks/query`;
        let body = JSON.stringify({});
        let options = this.getRequestOptions();

        return this.http
            .post(url, body, options)
            .map(this.toJsonArray)
            .catch(this.handleError);
    }

    getTask(id: string): Observable<any> {
        let url = `${this.getHostAddress()}/activiti-app/api/enterprise/tasks/${id}`;
        let options = this.getRequestOptions();

        return this.http
            .get(url, options)
            .map(this.toJson)
            .catch(this.handleError);
    }

    saveTaskForm(id: string, formValues: FormValues): Observable<Response> {
        let url = `${this.getHostAddress()}/activiti-app/api/enterprise/task-forms/${id}/save-form`;
        let body = JSON.stringify({ values: formValues });
        let options = this.getRequestOptions();

        return this.http
            .post(url, body, options)
            .catch(this.handleError);
    }

    /**
     * Complete Task Form
     * @param id Task Id
     * @param formValues Form Values
     * @param outcome Form Outcome
     * @returns {any}
     */
    completeTaskForm(id: string, formValues: FormValues, outcome?: string): Observable<Response> {
        let url = `${this.getHostAddress()}/activiti-app/api/enterprise/task-forms/${id}`;
        let data: any = { values: formValues };
        if (outcome) {
            data.outcome = outcome;
        }
        let body = JSON.stringify(data);
        let options = this.getRequestOptions();

        return this.http
            .post(url, body, options)
            .catch(this.handleError);
    }

    getTaskForm(id: string): Observable<any> {
        let url = `${this.getHostAddress()}/activiti-app/api/enterprise/task-forms/${id}`;
        let options = this.getRequestOptions();

        return this.http
            .get(url, options)
            .map(this.toJson)
            .catch(this.handleError);
    }

    getFormDefinitionById(id: string): Observable<any> {
        let url = `${this.getHostAddress()}/activiti-app/app/rest/form-models/${id}`;
        let options = this.getRequestOptions();

        return this.http
            .get(url, options)
            .map(this.toJson)
            .catch(this.handleError);
    }

    /**
     * Returns form definition ID by a given name.
     * @param name
     * @returns {Promise<T>|Promise<ErrorObservable>}
     */
    getFormDefinitionByName(name: string): Observable<any> {
        let url = `${this.getHostAddress()}/activiti-app/app/rest/models?filter=myReusableForms&filterText=${name}&modelType=2`;
        let options = this.getRequestOptions();

        return this.http
            .get(url, options)
            .map(this.getFormId)
            .catch(this.handleError);
    }

    private getHeaders(): Headers {
        return new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': this.authService.getTicket('BPM')
        });
    }

    private getRequestOptions(): RequestOptions {
        let headers = this.getHeaders();
        return new RequestOptions({headers: headers});
    }

    getFormId(res: Response) {
        let result = null;

        if (res) {
            let body = res.json();
            if (body && body.data && body.data.length > 0) {
                result = body.data[0].id;
            }
        }

        return result;
    }

    toJson(res: Response) {
        if (res) {
            let body = res.json();
            return body || {};
        }
        return {};
    }

    toJsonArray(res: Response) {
        if (res) {
            let body = res.json();
            return body.data || [];
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
