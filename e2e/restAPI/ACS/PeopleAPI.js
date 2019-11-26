/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
const request = require('request');
const RequestCoreAPI = require('./RequestUtil/RequestCoreAPI');
const path = require('path');
const fs = require('fs');

function read(initialFile) {
    return new Promise(function (resolve, reject) {
        fs.readFile(initialFile, function (err, file) {
            if (err) {
                //console.log('read error', err);
                reject(err);
            }

            // console.log('read success', file);
            resolve(file);
        })
    })
}

function write(file, uri, header) {
    return new Promise(function (resolve, reject) {
        request.put({url: uri, headers: header, body: file}, function (err, httpResponse, body) {
            if (err) {
                console.error('updated failed:', err);
                reject(err);
            }
            var json_data = JSON.parse(body);

            // console.log('write success', json_data);
            resolve(body);
        });
    });
}

/**
 * Update avatar using API
 *
 * @param requestUserModel {User that makes the request}
 * @param fileModel
 * @param personId
 * @method updateAvatarViaAPI
 */
exports.updateAvatarViaAPI = function (requestUserModel, fileModel, personId) {
    const absolutePath = path.resolve(path.join(browser.params.testConfig.main.rootPath, fileModel.getLocation()));
    const uri = `${RequestCoreAPI.getBaseURL()}/people/${personId}/avatar`;

    // console.debug("Update avatar via API: fileName=" + fileModel.getName() + " uri=" + uri + " auth=" + requestUserModel.id + " password: " + requestUserModel.password);

    var allHeaders = RequestCoreAPI.requestHeaders(requestUserModel);
    allHeaders['Content-Type'] = 'application/octet-stream';

    return read(absolutePath)
        .then(function (file) {
            return write(file, uri, allHeaders);
        });
};

/**
 * Get avatar using API
 *
 * @param requestUserModel {User that makes the request}
 * @param personId
 * @method getAvatarViaAPIWithRetry
 */
exports.getAvatarViaAPI = function (retry, requestUserModel, personId, callback) {
    const uri = `${RequestCoreAPI.getBaseURL()}/people/${personId}/avatar`;

    // console.debug("Get avatar via API: uri= " + uri + " auth=" + requestUserModel.id + " password: " + requestUserModel.password);

    function run() {
        request.get({
            url: uri,
            headers: RequestCoreAPI.requestHeaders(requestUserModel)
        }, function (error, httpResponse, body) {
            retry--;
            var statusCode = httpResponse.statusCode;
            // console.log("status code: " + statusCode);
            if (statusCode != "200" && retry > 0) {
                run();
            }
            else if (typeof callback === 'function') {
                callback.apply(null);
            }
        });
    }

    run();
};

/**
 * Delete avatar using API
 *
 * @param requestUserModel {User that makes the request}
 * @param personId
 * @param callback
 */
exports.deleteAvatarViaAPI = function (requestUserModel, personId, callback) {
    const uri = `${RequestCoreAPI.getBaseURL()}/people/${personId}/avatar`;

    request.del({url: uri, headers: RequestCoreAPI.requestHeaders(requestUserModel)}, function (error, response, body) {
        if (error) {
            return console.error('delete failed:', error);
        }
        // console.debug("Avatar deleted via API: " + " uri=" + uri + " auth=" + requestUserModel.id + " password: " + requestUserModel.password);

        if (typeof callback === 'function') {
            callback.apply(null);
        }
    });
};
