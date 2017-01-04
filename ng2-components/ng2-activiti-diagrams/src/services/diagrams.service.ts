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
import { AuthService, SettingsService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { Response, Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class DiagramsService {

    constructor(private authService: AuthService,
                private http: Http,
                private settingsService: SettingsService) {
    }

    getProcessDefinitionModel(processDefinitionId: string): Observable<any> {
        let url = `${this.settingsService.getBPMApiBaseUrl()}/app/rest/process-definitions/${processDefinitionId}/model-json`;
        let options = this.getRequestOptions();
        return this.http
            .get(url, options)
            .map((res: any) => {
                let body = res.json();
                return body;
            }).catch(this.handleError);
    }

    public getHeaders(): Headers {
        return new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': this.authService.getTicketBpm()
        });
    }

    public getRequestOptions(param?: any): RequestOptions {
        let headers = this.getHeaders();
        return new RequestOptions({headers: headers, withCredentials: true, search: param});
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
