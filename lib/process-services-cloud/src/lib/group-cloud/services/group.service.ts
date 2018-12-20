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
import { from, of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AlfrescoApiService, AppConfigService } from '@alfresco/adf-core';

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    constructor(
        private apiService: AlfrescoApiService,
        private appConfigService: AppConfigService
    ) {}

    findGroupsByName(search: string): Observable<any> {
        if (search === '') {
            return of([]);
        }
        const url = this.getGroupUrl();
        const httpMethod = 'GET', pathParams = {}, queryParams = {search: search}, bodyParam = {}, headerParams = {},
            formParams = {}, authNames = [], contentTypes = ['application/json'], accepts = ['application/json'];

        return (from(this.apiService.getInstance().oauth2Auth.callCustomApi(
                    url, httpMethod, pathParams, queryParams,
                    headerParams, formParams, bodyParam, authNames,
                    contentTypes, accepts, Object, null, null)
                ));
    }

    getClientIdByApplicationName(applicationName: string): Observable<string> {
        const url = this.getClientUrl();
        const httpMethod = 'GET', pathParams = {}, queryParams = {clientId: applicationName}, bodyParam = {}, headerParams = {}, formParams = {}, authNames = [],
              contentTypes = ['application/json'], accepts = ['application/json'];
        return from(this.apiService.getInstance()
                        .oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams,
                                              formParams, bodyParam, authNames, contentTypes,
                                              accepts, Object, null, null)
            ).pipe(
                map((response: any[]) => {
                    const clientId = response && response.length > 0 ? response[0].id : '';
                    return clientId;
                })
            );
    }

    checkGroupHasClientRoleMapping(userId: string, clientId: string): Observable<any> {
        const url = this.buildGroupClientRoleMapping(userId, clientId);
        const httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {},
            formParams = {}, authNames = [], contentTypes = ['application/json'], accepts = ['application/json'];

        return from(this.apiService.getInstance().oauth2Auth.callCustomApi(
                    url, httpMethod, pathParams, queryParams,
                    headerParams, formParams, bodyParam, authNames,
                    contentTypes, accepts, [], null, null)
                ).pipe(
                    map((response: any[]) => {
                        if (response && response.length > 0) {
                            return (true);
                        }
                        return (false);
                    })
            );
    }

    private buildGroupClientRoleMapping(groupId: string, clientId: string): any {
        return `${this.appConfigService.get('bpmHost')}/auth/admin/realms/springboot/groups/${groupId}/role-mappings/clients/${clientId}`;
    }

    private getClientUrl() {
        return `${this.appConfigService.get('bpmHost')}/auth/admin/realms/springboot/clients`;
    }

    private getGroupUrl() {
        return `${this.appConfigService.get('bpmHost')}/auth/admin/realms/springboot/groups`;
    }
}
