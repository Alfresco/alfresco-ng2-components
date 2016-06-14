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
// import { Observable } from 'rxjs/Rx';

@Injectable()
export class ActivitiService {

    constructor(private http: Http) {}

    login(username: string, password: string) {
        let url = 'http://localhost:9999/activiti-app/app/authentication';
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache'
        });
        let options = new RequestOptions({ headers: headers });
        let data = 'j_username='
            + encodeURIComponent(username)
            + '&j_password='
            + encodeURIComponent(password)
            + '&_spring_security_remember_me=true&submit=Login';

        return this.http
            .post(url, data, options)
            .toPromise()
            // .then(res => console.log(res))
            .catch(this.handleError);
    }

    getTasks() {
        // emulate filter value
        let data = JSON.stringify({
            'page': 0,
            'filterId': 3,
            'filter': {
                'sort': 'created-desc',
                'name': '',
                'state': 'open',
                'assignment': 'involved'
            },
            'appDefinitionId': null
        });

        let url = 'http://localhost:9999/activiti-app/app/rest/filter/tasks';
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        let options = new RequestOptions({ headers: headers });

        return this.http
            .post(url, data, options)
            .toPromise()
            .then(this.parseJSON)
            .catch(this.handleError);
    }

    private parseJSON(res: Response) {
        let body = res.json();
        return body.data || { };
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}
