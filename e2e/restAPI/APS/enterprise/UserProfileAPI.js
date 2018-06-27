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
var path = require('path');
var fs = require('fs');
var TestConfig = require('../../../test.config');
let CONSTANTS = require('../../../util/constants');

var UserProfileAPI = function () {
    var requestBase = new RequestEnterpriseBase();
    var uri = url(requestBase.getBaseURL(CONSTANTS.APPLICATION.ADF_APS), '/profile-picture');

    this.changeProfilePicture = function (auth, filePath) {
        // // console.info('[ REST API ] Change profile picture", filePath, 'for user', auth.user, auth.password);
        var absoluteFilePath = path.join(TestConfig.main.rootPath + filePath);

        var options = {
            url: url(uri),
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
                        // console.info("Change profile picture response:", data.toString());
                    });
                })
                .on('error', function (err) {
                    // console.info("Change profile picture Error:", err);
                    reject(err);
                });
        });
    };
};

module.exports = UserProfileAPI;
