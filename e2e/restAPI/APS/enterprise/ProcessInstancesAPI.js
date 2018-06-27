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
 * Retrieve and manage process instances
 */

var request = require('request');
var url = require('url-join');
var path = require('path');
var fs = require('fs');
var TestConfig = require('../../../test.config');
var RequestEnterpriseBase = require('./RequestEnterpriseBase');
let CONSTANTS = require('../../../util/constants');

var ProcessInstancesAPI = function () {
    var requestBase = new RequestEnterpriseBase();
    var uri = url(requestBase.getBaseURL(CONSTANTS.APPLICATION.ADF_APS), '/process-instances');

    this.startProcessInstance = function (auth, processInstanceData) {
        // // console.info('[ REST API ] Start process instance", processInstanceData);
        var options = {
            url: url(uri),
            json: true,
            body: processInstanceData,
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
                    });
                })
                .on('error', function (err) {
                    reject(err);
                });
        });
    };

    this.getProcessInstance = function (auth, processInstanceId) {
        // // console.info('[ REST API ] Get processInstance info for the given processInstanceId: " + processInstanceId);

        var options = {
            url: url(uri, processInstanceId),
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
                    reject(err);
                });
        });
    };

    this.getProcessComments = function (auth, processInstanceId) {
        // // console.info('[ REST API ] Get processInstance comments for the given processInstanceId:" + processInstanceId);

        var options = {
            url: url(uri, processInstanceId, '/comments'),
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
                        // console.info('Get process instance id:', processInstanceId, 'comments response:', data.toString());
                    });
                })
                .on('error', function (err) {
                    reject(err);
                });
        });
    };

    this.addProcessComment = function (auth, processInstanceId, commentRequestData) {
        // // console.info('[ REST API ] Add comment to the processInstanceId:" + processInstanceId);

        var options = {
            url: url(uri, processInstanceId, '/comments'),
            json: true,
            body: commentRequestData,
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
                        // console.info('Add comment to process instance id:', processInstanceId, ', response:', data.toString());
                    });
                })
                .on('error', function (err) {
                    reject(err);
                });
        });
    };

    this.attachContent = function (auth, processInstanceId, relatedContentData) {
        // // console.info('[ REST API ] Attach existing content to ProcessInstance Id: ", processInstanceId);

        var options = {
            url: url(uri, processInstanceId, '/content'),
            headers: requestBase.requestHeaders(auth),
            body: relatedContentData,
            json: true
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
                        // console.info('Attach existing content to process instance id: ', processInstanceId, ' response: ', data.toString());
                    });
                })
                .on('error', function (err) {
                    reject(err);
                });
        });
    };

    this.uploadContent = function (auth, processInstanceId, filePath, isRelatedContent) {
        // // console.info('[ REST API ] Upload Document to ProcessInstance Id: ", processInstanceId, " Document filePath: ", filePath);
        var absoluteFilePath = path.join(TestConfig.main.rootPath + filePath);

        var options = {
            url: url(uri, processInstanceId, '/raw-content', (typeof isRelatedContent === "undefined")? '' : '?isRelatedContent=' + isRelatedContent),
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
                        // console.info('Upload Document to process instance id: ', processInstanceId, ' response: ', data.toString());
                    });
                })
                .on('error', function (err) {
                    reject(err);
                });
        });
    };

    this.getContentListForProcessInstance = function (auth, processInstanceId, isRelatedContent) {
        // // console.info('[ REST API ] Get attached content list for processInstanceId : ", processInstanceId);

        var options = {
            url: url(uri, processInstanceId, '/content', (typeof isRelatedContent === "undefined")? '' : '?isRelatedContent=' + isRelatedContent),
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
                        // console.info('Get attached content list for process instance id: ', processInstanceId, ' response: ', data.toString());
                    });
                })
                .on('error', function (err) {
                    reject(err);
                });
        });
    };

    /**
     * @getInvolvedIdentitybyType - /enterprise/process-instances/{processInstanceId}/identitylinks/{family}/{identityId}/{type}
     * @auth - credentials
     * @processInstanceId - {number}
     * @family - user or group
     * @identityId - userId
     * @type - customType or candidate
     */
    this.getInvolvedIdentitybyType = function (auth, processInstanceId, family, identityId, type) {
        // // console.info('[ REST API ] Get involved user from ProcessInstance:', processInstanceId, 'by family, identityId and type');

        var options = {
            url: url(uri, processInstanceId, '/identitylinks', family, identityId, type),
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
                    // console.info('Get involved user from ProcessInstance:', processInstanceId, 'by family, identityId and type response:', data.toString());
                })
                .on('error', function (err) {
                    // console.info('Get involved user from ProcessInstance:', processInstanceId, 'by family, identityId and type error:', err);
                    reject(err);
                });
        });
    };

    /**
     * @getVariableByName - /enterprise/process-instances/{processInstanceId}/variables/{variableName}
     * @auth - credentials
     * @processInstanceId - {number}
     * @variableName - {String}
     */
    this.getVariableByName = function (auth, processInstanceId, variableName) {
        // // console.info('[ REST API ] Get ProcessInstance Variables for processInstanceId:', processInstanceId,' by variable name:', variableName);

        var options = {
            url: url(uri, processInstanceId, '/variables', variableName),
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
                    // console.info('Get ProcessInstance Variables for processInstanceId:', processInstanceId, 'by variable name:', variableName,'response:', data.toString());
                })
                .on('error', function (err) {
                    // console.info('Get ProcessInstance Variables for processInstanceId:', processInstanceId, 'by variable name:', variableName,'error:', err);
                    reject(err);
                });
        });
    };

    /**
     * @deleteVariableByName - /enterprise/process-instances/{processInstanceId}/variables/{variableName}
     * @auth - credentials
     * @processInstanceId - {number}
     * @variableName - {String}
     */
    this.deleteVariableByName = function (auth, processInstanceId, variableName) {
        // // console.info('[ REST API ] Delete ProcessInstance Variables for processInstanceId: ', processInstanceId, 'by variable name:', variableName);

        var options = {
            url: url(uri, processInstanceId, 'variables', variableName),
            headers: requestBase.requestHeaders(auth)
        };

        return new Promise(function (resolve, reject) {
            request.del(options)
                .on('response', function (response) {
                    resolve(response);
                    // console.info('Delete ProcessInstance Variables for processInstanceId:', processInstanceId, 'by variable name:', variableName,'successfully');
                })
                .on('error', function (err) {
                    // console.info('Delete ProcessInstance Variables for processInstanceId:', processInstanceId, 'by variable name:', variableName,'error: ', err);
                    reject(err);
                });
        });
    };

    /**
     * Create a new process instance variable  - POST /enterprise/process-instances/{processInstanceId}/variable
     *
     * @param auth
     * @param processInstanceId
     * @param requestBody - variable details json
     * @returns {Promise}
     */
    this.addProcessInstanceVariable = function (auth, processInstanceId, requestBody) {
        // // console.info('[ REST API ] Add variable for process instanceId: " , processInstanceId);
        var options = {
            url: url(uri, processInstanceId, '/variables'),
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
                        // console.info('Add variable for process instanceId:', processInstanceId, 'response:', data.toString());
                    });
                })
                .on('error', function (err) {
                    resolve(err);
                });
        });
    };

    /**
     * List process instance variables - GET /enterprise/process-instances/{processInstanceId}/variables
     * @param auth
     * @param processInstanceId
     * @returns {Promise}
     */
    this.getListOfProcessInstanceVariables = function (auth, processInstanceId) {
        // // console.info('[ REST API ] Get list of variables for processInstanceId: ",processInstanceId);
        var options = {
            url: url(uri, processInstanceId, '/variables'),
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
                        // console.info('Get list of variables for processInstanceId:', processInstanceId, 'response:', data.toString());
                    });
                })
                .on('error', function (err) {
                    resolve(err);
                });
        });
    };
};

module.exports = ProcessInstancesAPI;
