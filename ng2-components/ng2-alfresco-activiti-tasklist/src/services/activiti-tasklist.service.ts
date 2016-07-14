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
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ActivitiTaskListService {

    constructor(private http: Http) {}

    getTaskListFilters() {
        let url = 'http://localhost:9999/activiti-app/app/rest/filters/tasks';
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        let options = new RequestOptions({ headers: headers });

        return this.http
            .get(url, options)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    createMyTaskFilter() {
        let data = JSON.stringify({
            'name': 'My Tasks',
            'index': 1,
            'icon': 'glyphicon-inbox',
            'filter': {
                'name': '',
                'sort': 'created-desc',
                'state': 'open',
                'assignment': 'assignee'
            },
            'appId': null
        });
        return this.callApiCreateFilter(data);
    }

    /**
     * Retrive all the tasks created in activiti
     * @returns {any}
     */
    getTasks(assignment: string = 'assignee'): Observable<any> {
        let data = JSON.stringify({
            'page': 0,
            'filterId': 1,
            'filter': {
                'name': '',
                'sort': 'created-desc',
                'state': 'open',
                'assignment': assignment
            },
            'appDefinitionId': null
        });
        return this.callApiFilterTasks(data);
    }

    getInvolvedTasks(): Observable<any> {
        let data = JSON.stringify({
            'page': 0,
            'filterId': 3,
            'filter': {
                'name': '',
                'sort': 'created-desc',
                'state': 'open',
                'assignment': 'involved'
            },
            'appDefinitionId': null
        });
        return this.callApiFilterTasks(data);
    }

    private callApiCreateFilter(data: Object): Observable<any> {

        let url = 'http://localhost:9999/activiti-app/app/rest/filters/tasks';
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        let options = new RequestOptions({ headers: headers });

        return this.http
            .post(url, data, options)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    private callApiFilterTasks(data: Object): Observable<any> {

        let url = 'http://localhost:9999/activiti-app/app/rest/filter/tasks';
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        let options = new RequestOptions({ headers: headers });

        return this.http
            .post(url, data, options)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    /**
     * The method write the error in the console browser
     * @param error
     * @returns {ErrorObservable}
     */
    public handleError(error: Response): Observable<any> {
        console.error('Error when logging in', error);
        return Observable.throw(error || 'Server error');
    }

}
