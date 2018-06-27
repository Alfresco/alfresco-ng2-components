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
 * Retrieve and manage form models
 */

var request = require('request');
var url = require('url-join');
var RequestEnterpriseBase = require('./RequestEnterpriseBase');
let CONSTANTS = require('../../../util/constants');

var FormModel = function () {
    var requestBase = new RequestEnterpriseBase();
    var editorUri = url(requestBase.getBaseURL(CONSTANTS.APPLICATION.ADF_APS), '/editor/form-models');
    var formsUri = url(requestBase.getBaseURL(CONSTANTS.APPLICATION.ADF_APS), '/forms');
    var responseBody = '';

    this.getFormModels = function (auth) {
        // console.info('[ REST API ] List form models");

        var options = {
            url: editorUri,
            headers: requestBase.requestHeaders(auth)
        };

        return new Promise(function (resolve, reject) {
            request.get(options)
                .on('response', function (response) {
                    response.on('data', function (data) {
                        responseBody += data;
                    }).
                    on('end', function (){
                        console.info("List form models response:", responseBody.toString());
                        resolve({
                            responseBody: responseBody.toString(),
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

    this.getFormModel = function (auth, formModelId) {
        // console.info('[ REST API ] List form model");

        var options = {
            url: url(editorUri, formModelId),
            headers: requestBase.requestHeaders(auth)
        };

        return new Promise(function (resolve, reject) {
            request.get(options)
                .on('response', function (response) {
                    response.on('data', function (data) {
                        responseBody += data;
                    }).
                    on('end', function (){
                        resolve({
                            responseBody: responseBody.toString(),
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

    this.getForm = function (auth, formId) {
        // console.info('[ REST API ] Get form by formId:", formId);

        var options = {
            url: url(formsUri, formId),
            headers: requestBase.requestHeaders(auth)
        };

        return new Promise(function (resolve, reject) {
            request.get(options)
                .on('response', function (response) {
                    response.on('data', function (data) {
                        responseBody += data;
                    }).
                    on('end', function (){
                        resolve({
                            responseBody: responseBody.toString(),
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
};

module.exports = FormModel;
