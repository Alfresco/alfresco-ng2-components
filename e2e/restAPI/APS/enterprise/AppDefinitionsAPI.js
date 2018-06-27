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

/**
 * Retrieve and manage app definition
 */

var request = require('request');
var path = require('path');
var url = require('url-join');
var fs = require('fs');
var RequestEnterpriseBase = require('./RequestEnterpriseBase');
var TestConfig = require('../../../test.config');
let CONSTANTS = require('../../../util/constants');

var AppDefinitionAPI = function () {
    var requestBase = new RequestEnterpriseBase();
    var uri = url(requestBase.getBaseURL(CONSTANTS.APPLICATION.ADF_APS), '/app-definitions');

    this.importApp = function (auth, filePath) {
        // console.info('[ REST API ] Import app from:", filePath, auth.user, '/', auth.password);
        var absoluteFilePath = path.join(TestConfig.main.rootPath + filePath);

        var options = {
            url: url(uri, '/import'),
            headers: requestBase.requestHeaders(auth),
            formData: {
                 file: fs.createReadStream(absoluteFilePath)
            }
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
                      //  console.info("Import app response:", data.toString());
                    });
                })
                .on('error', function (err) {
                    reject(err);
                });
        });
    };

    this.getAppDefinition = function (auth, appId) {
        // console.info('[ REST API ] Get an app definition by app definition id:", appId);

        var options = {
            url: url(uri, appId),
            headers: requestBase.requestHeaders(auth)
        };

        return new Promise(function (resolve, reject) {
            request.get(options)
                .on('response', function (response) {
                    response.on('data', function (data) {
                        // console.info('Get a app definition response:', data.toString());
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

    this.publishApp = function (auth, appId, appPublishModel) {
        // console.info('[ REST API ] Publish app id:", appId);
        uri = url(uri, appId);

        var options = {
            url: url(uri, '/publish'),
            headers: requestBase.requestHeaders(auth),
            json: true,
            body: appPublishModel
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
                       // console.info("Publish app response:", data.toString());
                    });
                })
                .on('error', function (err) {
                    resolve(err);
                });
        });
    };

    this.deleteApp = function (auth, appId) {
        // console.info('[ REST API ] Delete app id:", appId);

        var options = {
            url: url(uri, appId),
            headers: requestBase.requestHeaders(auth)
        };

        return new Promise(function (resolve, reject) {
            request.del(options)
                .on('response', function (response) {
                    resolve(response);
                })
                .on('error', function (err) {
                    resolve(err);
                });
        });
    };
};

module.exports = AppDefinitionAPI;
