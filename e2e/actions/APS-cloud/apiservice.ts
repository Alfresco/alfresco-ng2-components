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
import TestConfig = require('../../test.config');

export class ApiService {

    HOST_SSO = TestConfig.adf.hostSso;
    HOST_BPM = TestConfig.adf.hostBPM;
    HOST_IDENTITY = TestConfig.adf.hostIdentity;

    apiService = new AlfrescoApi({
        provider: 'BPM',
        bpmHost: `${this.HOST_BPM}`,
        identityHost: `${this.HOST_IDENTITY}`,
        authType: 'OAUTH',
        oauth2: {
            host: `${this.HOST_SSO}`,
            authType: '/protocol/openid-connect/token',
            clientId: 'activiti',
            scope: 'openid',
            secret: '',
            implicitFlow: false,
            silentLogin: false,
            redirectUri: '/',
            redirectUriLogout: '/logout'
        }

    });

    async login(username, password) {
        await this.apiService.login(username, password);
    }

    async performBpmOperation(path, method, queryParams, postBody) {
        const uri = this.HOST_BPM + path;
        const pathParams = {}, formParams = {};
        const contentTypes = ['application/json'];
        const accepts = ['application/json'];

        const headerParams = {
            'Authorization': 'bearer ' + this.apiService.oauth2Auth.token
        };

        return this.apiService.processClient.callCustomApi(uri, method, pathParams, queryParams, headerParams, formParams, postBody,
            contentTypes, accepts, Object)
            .catch((error) => {
                throw (error);
            });
    }

    async performIdentityOperation(path, method, queryParams, postBody) {
        const uri = this.HOST_IDENTITY + path;
        const pathParams = {}, formParams = {};
        const contentTypes = ['application/json'];
        const accepts = ['application/json'];

        const headerParams = {
            'Authorization': 'bearer ' + this.apiService.oauth2Auth.token
        };

        return this.apiService.processClient.callCustomApi(uri, method, pathParams, queryParams, headerParams, formParams, postBody,
            contentTypes, accepts, Object)
            .catch((error) => {
                throw (error);
            });
    }

}
