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
var APIUtils = require('../../../restAPI/APIUtil');
let CONSTANTS = require('../../../util/constants.js');

var RequestEnterpriseBase = function () {
    var apiUtils = new APIUtils();

    this.getBaseURL = function (application) {
        return url(apiUtils.getBaseURL(application), "/api/enterprise");
    };

    this.requestHeaders = function (auth, contentType = CONSTANTS.HTTP_CONTENT_TYPE.JSON, acceptType = null) {
        var headers = {'Content-Type': contentType,
        'Accept': acceptType ? acceptType : contentType,
        'Authorization': apiUtils.getAuthorization(auth.user, auth.password)
        };
        return headers;
    };
};

module.exports = RequestEnterpriseBase;
