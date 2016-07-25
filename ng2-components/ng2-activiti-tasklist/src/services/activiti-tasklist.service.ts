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
import { FilterModel } from '../models/filter.model';

@Injectable()
export class ActivitiTaskListService {

    constructor(private http: Http) {
    }

    /**
     * Retrive all the Tasks filters
     * @returns {Observable<any>}
     */
    getTaskListFilters(): Observable<any> {
        return Observable.fromPromise(this.callApiTaskFilters())
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    /**
     * Retrive all the tasks created in activiti
     * @returns {any}
     */
    getTasks(filter: FilterModel): Observable<any> {
        let data: any = {};
        data.filterId = filter.id;
        data.filter = filter.filter;
        data = JSON.stringify(data);

        return Observable.fromPromise(this.callApiTasksFiltered(data))
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    private callApiTasksFiltered(data: Object) {
        let url = 'http://localhost:9999/activiti-app/app/rest/filter/tasks';
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        let options = new RequestOptions({headers: headers});

        return this.http
            .post(url, data, options).toPromise();
    }

    private callApiTaskFilters() {
        let url = 'http://localhost:9999/activiti-app/app/rest/filters/tasks';
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        let options = new RequestOptions({headers: headers});

        return this.http
            .get(url, options).toPromise();
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
