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
var APIUtils = require('../../APIUtil.js');
var apiUtils = new APIUtils();
var RequestEnterpriseBase = require('./RequestEnterpriseBase');
let CONSTANTS = require('../../../util/constants');

var AdminEndpointsAPI = function () {
    var requestBase = new RequestEnterpriseBase();
    var uri = url(requestBase.getBaseURL(CONSTANTS.APPLICATION.ADF_APS), '/admin');
    this.getBasicAuths = function (auth, queryParams) {
        // console.info('[ REST API ] Get basic admin auths for tenantId: ");

        var options = {
            url: url(uri, '/basic-auths', apiUtils.buildQueryParams(queryParams)),
            headers: requestBase.requestHeaders(auth)
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
                    });
                })
                .on('error', function (err) {
                    resolve(err);
                });
        });
    };

    this.createBasicAuth = function (auth, requestBody) {
        // console.info('[ REST API ] Create Basic Authentication: ', requestBody.username, ' ', requestBody.password, ' for tenantId: ', requestBody.tenantId);

        var options = {
            url: url(uri, '/basic-auths'),
            json: true,
            body: requestBody,
            headers: requestBase.requestHeaders(auth)
        };
        return new Promise(function (resolve, reject) {
            request.post(options)
                .on('response', function (response) {
                    response.on('data', function (data) {
                        resolve({
                            responseBody: data.toString(),
                            statusCode: response.statusCode,
                            responseMessage: response.statusMessage
                        });
                        console.info("Create basic authentication response: ", data.toString());
                    });
                })
                .on('error', function (err) {
                    reject(err);
                });
        });
    };

    this.createEndpoint = function (auth, requestBody) {
        // console.info('[ REST API ] Create Tenant Endpoint for tenantId: ', requestBody.tenantId);

        var options = {
            url: url(uri, '/endpoints'),
            json: true,
            body: requestBody,
            headers: requestBase.requestHeaders(auth)
        };
        return new Promise(function (resolve, reject) {
            request.post(options)
                .on('response', function (response) {
                    response.on('data', function (data) {
                        resolve({
                            responseBody: data.toString(),
                            statusCode: response.statusCode,
                            responseMessage: response.statusMessage
                        });
                        console.info("Create tenant enpoint response: ", data.toString());
                    });
                })
                .on('error', function (err) {
                    reject(err);
                });
        });
    };
};

module.exports = new AdminEndpointsAPI();
