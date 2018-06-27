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

var url = require('url-join');
var TestConfig = require('../test.config');
var BasicAuthorization = require('../restAPI/httpRequest/BasicAuthorization');
var Ajv = require('ajv');

var APIUtils = function () {
    /**
     * Return Basic authorization
     *
     * @param user
     * @param password
     * @returns Basic authorization
     */
    this.getAuthorization = function (user, password) {
        return 'Basic ' + Buffer(user + ':' + password).toString('base64');
    };

    /** 
     * Return any application base URL 
     * <protocol>://<hostname>:<port>/<pathname> 
     *
     * @param application - any application declared in config file: main or adf 
     * @param urlComponentsParam - Object with details required to define the baseURL 
     * { 
      *      protocol: "http", 
      *      hostname: "localhost", 
      *      port: "8080" 
      * } 
     * If urlComponents empty {}, the default test configuration values are set 
     */
    this.getBaseURL = function (application, urlComponentsParam) {
        var urlComponents = {};
        urlComponents.protocol = TestConfig[application].protocol;
        urlComponents.hostname = TestConfig[application].host;
        urlComponents.port = TestConfig[application].port;
        urlComponents.path = TestConfig[application].apiContextRoot;
        Object.assign(urlComponents, urlComponentsParam);

        var baseUrl = url(urlComponents.protocol
            + "://" + urlComponents.hostname
            + (urlComponents.port !== "" ? ":" + urlComponents.port : ""),
            urlComponents.path);

        return baseUrl;
    };

    /**
     * Search value in JSON data
     * @param data {String} - JSON object
     * @param key {String} - JSON key - value pair to be matched (e.g id: 1234)
     * @param value {String}
     * @param searchedKey {String} - searchedKey to get value for (e.g appDefId)
     * @param nestedDataValue {String} - nested JSON key
     * @method getValueByKeyValuePair
     */
    this.getValueByKeyValuePair = function (data, key, value, searchedKey, nestedDataValue) {
        var searchedValue;

        if (nestedDataValue !== null) {
            data = data[nestedDataValue];
        }
        for (var i = 0; i < data.length; i++) {
            if (data[i][key] === value) {
                searchedValue = data[i][searchedKey];
                break;
            }
        }
        return searchedValue;
    };


    /**
     * Search value in JSON data
     *
     * @param json_data {String} - JSON object
     * @param key {String} - JSON key - value pair to be matched (e.g id: 1234)
     * @param value {String}
     * @param searchedKey {String} - searchedKey to get value for (e.g appDefId)
     */
    this.retrieveValueByKeyValuePair = function (json_data, key, value, searchedKey) {
        var details = json_data.find(function (item) {
            if (typeof item[key] === 'undefined') {
                return undefined;
            }
            return item[key] === value;
        });
        return (typeof details === 'undefined') ? undefined : details[searchedKey];
    };

    /**
     * Build API query parameters string
     *
     * @param queryParams - query parameters object
     * @returns a string with all parameters appended
     */
    this.buildQueryParams = function (queryParams) {
        var searchParams = Object.keys(queryParams || {})
            .map(function (key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]);
            })
            .join('&');

        return (typeof queryParams === "undefined") ? '' : '?' + searchParams;
    };


};

module.exports = APIUtils;

