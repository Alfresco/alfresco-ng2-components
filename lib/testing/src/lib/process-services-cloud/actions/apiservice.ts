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

import * as AlfrescoApi from 'alfresco-js-api-node';

export class ApiService {

    apiService;

    constructor(config) {
        this.apiService = new AlfrescoApi(config);
    }

    async login(username, password) {
        await this.apiService.login(username, password);
    }

    async performBpmOperation(path, method, queryParams, postBody) {
        const uri = path;
        const pathParams = {}, formParams = {};
        const authNames = [];
        const contentTypes = ['application/json'];
        const accepts = ['application/json'];

        const headerParams = {
            'Authorization': 'bearer ' + this.apiService.oauth2Auth.token
        };

        return this.apiService.bpmClient.callCustomApi(uri, method, pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, {})
            .catch((error) => {
                throw (error);
            });
    }

    async performIdentityOperation(path, method, queryParams, postBody) {
        const uri = path;
        const pathParams = {}, formParams = {};
        const authNames = [];
        const contentTypes = ['application/json'];
        const accepts = ['application/json'];

        const headerParams = {
            'Authorization': 'bearer ' + this.apiService.oauth2Auth.token
        };

        return this.apiService.bpmClient.callCustomApi(uri, method, pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, {})
            .catch((error) => {
                throw (error);
            });
    }

}
