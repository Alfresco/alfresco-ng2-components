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

var request = require('request');
var url = require('url-join');
var RequestEnterpriseBase = require('./RequestEnterpriseBase');
let CONSTANTS = require('../../../util/constants');

var RuntimeAppDefinitionAPI = function () {
    var requestBase = new RequestEnterpriseBase();
    var uri = url(requestBase.getBaseURL(CONSTANTS.APPLICATION.ADF_APS), '/runtime-app-definitions');

    this.deployApp = function (auth, appDefinition) {
        // console.info('[ REST API ] Deploy app with id:", appDefinition.id);

        var options = {
            url: uri,
            headers: requestBase.requestHeaders(auth),
            json: true,
            body: {
                appDefinitions: [appDefinition]
            }
        };

        return new Promise(function (resolve, reject) {
            request.post(options)
                .on('response', function (response) {
                    resolve(response);
                })
                .on('error', function (err) {
                    resolve(err);
                });
        });
    };

    /**
     * List runtime apps - GET /enterprise/runtime-app-definition
     *
     * @param auth
     * @returns {Promise}
     */
    this.getRunTimeAppDefinitions = function (auth) {
        // console.info('[ REST API ] Get runtime app definitions");

        var options = {
            url: (uri),
            headers: requestBase.requestHeaders(auth),
            json: true
        };
        return new Promise(function (resolve, reject) {
            request.get(options)
                .on('response', function (response) {
                    response.on('data', function (data) {
                        resolve({
                            responseBody: data.toString(),
                            statusCode: response.statusCode,
                            responseMessage: response.statusMessage
                        });
                        // console.info('Get runtime app definitions response:', data.toString());
                    });
                })
                .on('error', function (err) {
                    resolve(err);
                });
        });
    };
};

module.exports = RuntimeAppDefinitionAPI;
