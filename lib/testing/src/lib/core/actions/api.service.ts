/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { AlfrescoApiConfig } from '@alfresco/js-api/src/alfrescoApiConfig';

export class ApiService {

    apiService: AlfrescoApi;

    config: AlfrescoApiConfig;

    constructor(clientId: string, host: string, hostSso: string, provider: string) {
        this.config = {
            provider,
            hostBpm: host,
            hostEcm: host,
            authType: 'OAUTH',
            oauth2: {
                host: hostSso,
                clientId,
                scope: 'openid',
                secret: '',
                implicitFlow: false,
                silentLogin: false,
                redirectUri: '/',
                redirectUriLogout: '/logout'
            }

        };

        this.apiService = new AlfrescoApi(this.config);
    }

    async login(username: string, password: string): Promise<void> {
        await this.apiService.login(username, password);
    }

    async performBpmOperation(path: string, method: string, queryParams: any, postBody: any): Promise<any> {
        const uri = this.config.hostBpm + path;
        const pathParams = {}, formParams = {};
        const contentTypes = ['application/json'];
        const accepts = ['application/json'];

        const headerParams = {
            Authorization: 'bearer ' + this.apiService.oauth2Auth.token
        };

        return this.apiService.processClient.callCustomApi(uri, method, pathParams, queryParams, headerParams, formParams, postBody,
            contentTypes, accepts, Object)
            .catch((error) => {
                throw (error);
            });
    }

    async performIdentityOperation(path: string, method: string, queryParams: any, postBody: any): Promise<any> {
        const uri = this.config.oauth2.host.replace('/realms', '/admin/realms') + path;
        const pathParams = {}, formParams = {};
        const contentTypes = ['application/json'];
        const accepts = ['application/json'];

        const headerParams = {
            Authorization: 'bearer ' + this.apiService.oauth2Auth.token
        };

        return this.apiService.processClient.callCustomApi(uri, method, pathParams, queryParams, headerParams, formParams, postBody,
            contentTypes, accepts, Object)
            .catch((error) => {
                throw (error);
            });
    }

}
