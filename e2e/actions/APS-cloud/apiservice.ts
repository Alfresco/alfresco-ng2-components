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
import { AlfrescoApiConfig } from '@alfresco/js-api/src/alfrescoApiConfig';

export class ApiService {

    HOST_SSO: string = TestConfig.adf.hostSso;
    HOST_BPM: string = TestConfig.adf.hostBPM;
    HOST_IDENTITY: string = TestConfig.adf.hostIdentity;

    config: AlfrescoApiConfig = {
        provider: 'BPM',
        hostBpm: this.HOST_BPM,
        authType: 'OAUTH',
        oauth2: {
            host: this.HOST_SSO,
            clientId: 'activiti',
            scope: 'openid',
            secret: '',
            implicitFlow: false,
            silentLogin: false,
            redirectUri: '/',
            redirectUriLogout: '/logout'
        }

    };

    apiService: any;

    constructor(clientId: string = 'activiti') {
        this.config.oauth2.clientId = clientId;
        this.apiService = new AlfrescoApi(this.config);

    }

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
