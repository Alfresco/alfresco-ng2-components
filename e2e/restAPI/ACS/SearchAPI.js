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
var queriesBaseUrl = "search";
var RequestSearchAPI = require('./RequestUtil/RequestSearchAPI');
var url = require('url-join');

/**
 * Search query using API.
 *
 * @param retry {integer}
 * @param requestUserModel {User that makes the request}
 * @param expectedNumber {integer}
 * @param callback
 * @param jsonReq
 * @method search
 */
exports.search = function (retry, requestUserModel, expectedNumber, jsonReq, callback) {
    var uri = url(RequestSearchAPI.getBaseURL(), queriesBaseUrl);

    function run() {
        request.post({url: uri, headers: RequestSearchAPI.requestHeaders(requestUserModel), json: jsonReq}, function (error, httpResponse, body) {
            retry--;
            var totalNumber = body.list.pagination.totalItems;
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

/**
 * Create query to obtain recent content created by a specific user.
 *
 * @param username
 * @method recentFiles
 */
exports.recentFiles = function (username) {
    var jsonReq = {
        query: {
            query: '*',
            language: 'afts'
        },
        filterQueries: [
            { query: `cm:modifier:${username} OR cm:creator:${username}` }
        ]
    };
    return jsonReq;
}




