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

@Injectable()
export class FormService {

    private basePath: string = 'http://localhost:9999/activiti-app';

    constructor(private http: Http) {
    }

    getTasks(): Observable<any> {
        let url = `${this.basePath}/api/enterprise/tasks/query`;
        let body = JSON.stringify({});
        let options = this.getRequestOptions();

        return this.http
            .post(url, body, options)
            .map(this.toJsonArray)
            .catch(this.handleError);
    }

    getTask(id: string): Observable<any> {
        let url = `${this.basePath}/api/enterprise/tasks/${id}`;
        let options = this.getRequestOptions();

        return this.http
            .get(url, options)
            .map(this.toJson)
            .catch(this.handleError);
    }

    saveTaskForm(id: string, form: { values: { [key: string]: any }}): Observable<Response> {
        let url = `${this.basePath}/api/enterprise/task-forms/${id}/save-form`;
        let body = JSON.stringify(form);
        let options = this.getRequestOptions();

        return this.http
            .post(url, body, options)
            .catch(this.handleError);
    }

    getTaskForm(id: string): Observable<any> {
        let url = `${this.basePath}/api/enterprise/task-forms/${id}`;
        let options = this.getRequestOptions();

        return this.http
            .get(url, options)
            .map(this.toJson)
            .catch(this.handleError);
    }

    private getHeaders(): Headers {
        return new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('admin' + ':' + 'admin')
        });
    }

    private getRequestOptions(): RequestOptions {
        let headers = this.getHeaders();
        return new RequestOptions({ headers: headers });
    }

    private toJson(res: Response) {
        let body = res.json();
        return body || {};
    }

    private toJsonArray(res: Response) {
        let body = res.json();
        return body.data || [];
    }

    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

}
