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

import { AlfrescoSettingsService } from 'ng2-alfresco-core';
import { ProcessInstance } from '../models/process-instance';
import { Injectable }     from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ActivitiProcessService {


    constructor(private alfrescoSettingsService: AlfrescoSettingsService, private http: Http) {
    }

    getProcesses(): Observable<ProcessInstance[]> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // headers.append('Authorization', 'Basic ' + btoa('admin@app.activiti.com:admin'));
        return this.http.post(
            this.alfrescoSettingsService.bpmHost + '/activiti-app/api/enterprise/process-instances/query',
            '{"page":0,"sort":"created-desc","state":"all"}',
            new RequestOptions({
                headers: headers
            }))
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body.data || { };
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
