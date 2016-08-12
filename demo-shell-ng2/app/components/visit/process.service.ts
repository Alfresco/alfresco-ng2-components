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
import { Observable } from 'rxjs/Observable';
import { AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';

import { Process } from './process.data';


@Injectable()
export class ProcessService {

    constructor(private http: Http,
                private authService: AlfrescoAuthenticationService,
                private alfrescoSettingsService: AlfrescoSettingsService) {
    }

    getDeployedApplications(name: string): Observable<Process[]> {
        let url = `${this.alfrescoSettingsService.bpmHost}/activiti-app/api/enterprise/runtime-app-definitions`;
        let options = this.getRequestOptions();
        return this.http
            .get(url, options)
            .map((response: Response) => response.json().data.find(p => p.name === name))
            .do(data => console.log('Application: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }


    getProcessDefinitions(): Observable<Process[]> {
        let url = `${this.alfrescoSettingsService.bpmHost}/activiti-app/api/enterprise/process-definitions`;
        let options = this.getRequestOptions();
        return this.http
            .get(url, options)
            .map((response: Response) => <Process[]> response.json())
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getProcessDefinitionByApplication(application: any): Observable<Process> {
        return this.getProcessDefinitions()
            .map((processes: Process[]) => <Process> processes.data.find(p => p.deploymentId === application.deploymentId));
    }

    getStartFormForProcess(processDefinitionId: string): Observable<any> {
        let url = `${this.alfrescoSettingsService.bpmHost}/activiti-app/api/enterprise/process-definitions/${processDefinitionId}/start-form`;
        let options = this.getRequestOptions();
        return this.http
            .get(url, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    startProcessByID(processDefinitionId: string, processName: string): void {
        let url = `${this.alfrescoSettingsService.bpmHost}/activiti-app/api/enterprise/process-instances`;
        let options = this.getRequestOptions();
        let body = JSON.stringify({processDefinitionId: processDefinitionId, name: processName});
        console.log(body);
        return this.http
            .post(url, body, options)
            .map(this.toJson)
            .catch(this.handleError);
    }

    getTaskIdFromProcessID(processDefinitionId: string, appDefinitionId: string, processInstanceId: string): Observable<any> {
        let url = `${this.alfrescoSettingsService.bpmHost}/activiti-app/api/enterprise/tasks/query`;
        let options = this.getRequestOptions();
        let body = JSON.stringify({
            processDefinitionId: processDefinitionId,
            appDefinitionId: appDefinitionId,
            processInstanceId: processInstanceId
        });
        console.log(body);
        return this.http
            .post(url, body, options)
            .map(this.toJson)
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

    private toJson(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        console.log("ERROR");
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
