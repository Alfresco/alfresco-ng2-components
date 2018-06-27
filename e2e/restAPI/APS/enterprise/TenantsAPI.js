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

var TenantsAPI = function () {
    var requestBase = new RequestEnterpriseBase();
    var uri = url(requestBase.getBaseURL(CONSTANTS.APPLICATION.ADF_APS), '/admin/tenants');

    this.createTenant = function (auth, tenantReqData){
         // console.info('[ REST API ] Create tenant: ' + tenantReqData.name + "uri" + uri);

        var options = {
            url: url(uri),
            json: true,
            body: tenantReqData,
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
                      // console.info("Create tenant response: ", data.toString());
                    });
                })
                .on('error', function (err) {
                    resolve(err);
                });
        });
    };

    this.deleteTenant = function (auth, tenantId){
        // console.info('[ REST API ] Delete tenant:", tenantId);

        var options = {
            url: url(uri, tenantId),
            headers: requestBase.requestHeaders(auth)
        };

        return new Promise(function (resolve, reject) {
            request.del(options)
                .on('response', function (response) {
                    resolve(response);
                    // console.info("Delete tenant response:", response.statusCode, response.statusMessage);
                })
                .on('error', function (err) {
                    reject(err);
                });
        });
    };

    this.getTenants = function (auth){
        // console.info('[ REST API ] Get tenants list");

        let options = {
            url: url(uri),
            headers: requestBase.requestHeaders(auth)
        };

        return new Promise(function (resolve, reject) {
            let responseBody = '';
            request.get(options)
                .on('response', function (response) {
                    response
                        .on('data', function (data) {
                            responseBody += data;
                        }).
                        on('end', function (){
                            console.info("Get tenants response: ", responseBody.toString());
                            resolve({
                                responseBody: responseBody.toString(),
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
};

module.exports = TenantsAPI;
