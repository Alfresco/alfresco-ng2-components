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
 * Retrieve and manage user groups
 */

var request = require('request');
var url = require('url-join');
var APIUtils = require('../../APIUtil.js');
var RequestEnterpriseBase = require('./RequestEnterpriseBase');
let CONSTANTS = require('../../../util/constants');

var GroupsAPI = function () {
    var requestBase = new RequestEnterpriseBase();
    var uri = url(requestBase.getBaseURL(CONSTANTS.APPLICATION.ADF_APS), '/admin/groups');
    var apiUtils = new APIUtils();

    this.createGroup = function (auth, groupReqData){
        // console.info('[ REST API ] Create Group: ', groupReqData.name, ' for tenant: ', groupReqData.tenantId);

        var options = {
            url: url(uri),
            json: true,
            body: groupReqData,
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
                        // console.info('[ REST API ] Create Group Response: ', data.toString());
                    });

                })
                .on('error', function (err) {
                    resolve(err);
                });
        });
    };

    this.queryGroups = function (auth, queryParameters){
        // console.info('[ REST API ] Query groups.');

        var options = {
            url: url(uri, apiUtils.buildQueryParams(queryParameters)),
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

    this.deleteUserFromGroup = function (auth, groupId, userId){
        // console.info('[ REST API ] Delete user %s from group %s', userId, groupId);

        var options = {
            url: url(uri, groupId, '/members', userId),
            headers: requestBase.requestHeaders(auth)
        };
        return new Promise(function (resolve, reject) {
            request.del(options)
                .on('response', function (response) {
                    resolve(response);
                    console.info("Delete user from group response:", response.statusCode, response.statusMessage);
                })
                .on('error', function (err) {
                    resolve(err);
                });
        });
    };

    /**
     * Add user to a group - /enterprise/{groupId}/members/{userId}
     *
     * @auth - credentials
     * @groupId - {Number}
     * @userId - {Number}
     */
    this.addUserToGroup = function (auth, userId, groupId){
        // console.info('[ REST API ] Add user', userId ,'to group', groupId);

        var options = {
            url: url(uri, groupId, '/members', userId),
            headers: requestBase.requestHeaders(auth)
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
     * Add capabilities to a group - /enterprise/{groupId}/capabilities
     *
     * @auth - credentials
     * @groupId - {Number}
     * @capabilitiesList - {Array}
     */
    this.addGroupCapabilities = function (auth, groupId, capabilitiesList){
        // console.info('[ REST API ] Add capabilities', capabilitiesList, 'to group', groupId);

        var options = {
            url: url(uri, groupId, '/capabilities'),
            headers: requestBase.requestHeaders(auth),
            json: true,
            body: { "capabilities": capabilitiesList}
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
};

module.exports = GroupsAPI;
