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

};

module.exports = APIUtils;

