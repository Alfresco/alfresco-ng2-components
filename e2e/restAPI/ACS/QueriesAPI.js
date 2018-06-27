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

var exports = module.exports = {};
var request = require('request');
var queriesBaseUrl = 'queries';
var RequestCoreAPI = require('./RequestUtil/RequestCoreAPI');
var url = require('url-join');

/**
 * Get nodes using API.
 *
 * @param retry {integer}
 * @param requestUserModel {User that makes the request}
 * @param parameters {String}
 * @param expectedNumber {integer}
 * @param callback
 * @method getNodes
 */
exports.getNodes = function (retry, requestUserModel, parameters, expectedNumber, callback) {
    var uri = url(RequestCoreAPI.getBaseURL(), queriesBaseUrl, "/nodes?" + parameters);

    function run() {
        request.get({url: uri, headers: RequestCoreAPI.requestHeaders(requestUserModel)}, function (error, httpResponse, body) {
            retry--;
            var json_data = JSON.parse(body);
            var totalNumber = json_data.list.pagination.totalItems;
            if(totalNumber<expectedNumber && retry>0) {
                run();
            }
            else
            if( typeof callback === 'function'){
                callback.apply(null);
            }
        });
    }
    run();
};

