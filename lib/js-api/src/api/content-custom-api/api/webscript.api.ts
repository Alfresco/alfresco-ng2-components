/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { BaseApi } from './base.api';

/**
 * Tags service.
 * @module api/WebscriptApi
 * @version 0.1.0
 */

/**
 * Constructs a new WebscriptApi.
 * @alias module:api/WebscriptApi
 * @class
 * @param {module:ApiClient} apiClient Optional API client implementation to use, default to {@link module:ApiClient#instance}
 * if unspecified.
 */
export class WebscriptApi extends BaseApi {

    allowedMethod: string[] = ['GET', 'POST', 'PUT', 'DELETE'];

    /**
     * Call a get on a  Web Scripts see https://wiki.alfresco.com/wiki/Web_Scripts for more details about Web Scripts
     * Url syntax definition : http[s]://<host>:<port>/[<contextPath>/]/<servicePath>[/<scriptPath>][?<scriptArgs>]
     * example: http://localhost:8081/share/service/mytasks?priority=1
     *
     * @param {String} httpMethod  GET, POST, PUT and DELETE
     * @param {String} scriptPath
     * @param {Object} scriptArgs
     * @param {String} contextRoot default value alfresco
     * @param {String} servicePath default value service
     * @param {String} postBody
     *
     * @returns {Promise} A promise that is resolved return the webScript data and {error} if rejected.
     */
    executeWebScript(httpMethod: string, scriptPath: string, scriptArgs?: any, contextRoot?: string, servicePath?: string, postBody?: any): Promise<any> {
        contextRoot = contextRoot || 'alfresco';
        servicePath = servicePath || 'service';
        postBody = postBody || null;

        if (!httpMethod || this.allowedMethod.indexOf(httpMethod) === -1) {
            throw 'method allowed value  GET, POST, PUT and DELETE';
        }

        if (!scriptPath) {
            throw 'Missing param scriptPath in executeWebScript';
        }

        const contentTypes = ['application/json'];
        const accepts = ['application/json', 'text/html'];

        return this.apiClient.callApi(
            '/' + servicePath + '/' + scriptPath, httpMethod,
            {}, scriptArgs, {}, {}, postBody,
            contentTypes, accepts, null, contextRoot
        );
    }
}
