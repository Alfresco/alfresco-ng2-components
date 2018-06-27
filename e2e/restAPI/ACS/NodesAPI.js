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
var fs = require('fs');
var path = require('path');
var url = require('url-join');
var TestConfig = require('../../test.config.js');

var nodesBaseUrl = 'nodes/';
var RequestCoreAPI = require('./RequestUtil/RequestCoreAPI');

/**
 * Get the node using API.
 *
 * @param requestUserModel {User that makes the request}
 * @param nodeId {String}
 * @param callback
 * @method getNode
 */
exports.getNode = function (retry, requestUserModel, nodeId, callback) {
    var uri = url(RequestCoreAPI.getBaseURL(), nodesBaseUrl, nodeId);

    function run() {
        request.get({url: uri, headers: RequestCoreAPI.requestHeaders(requestUserModel)}, function (error, httpResponse, body) {
            retry--;
            if(httpResponse.statusCode != '200' && retry>0) {
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
 * Upload folder using API
 *
 * @param requestUserModel {User that makes the request}
 * @param folderName
 * @param nodeId {The nodeId of the folder where the new folder will be created}
 * @method uploadFolderViaAPI
 */
exports.uploadFolderViaAPI = function (requestUserModel, folderModel, nodeId) {

    var jsonReq = {"name":folderModel.getName(), "nodeType":"cm:folder"};
    var uri = url(RequestCoreAPI.getBaseURL(), nodesBaseUrl, nodeId, "children");

    return new Promise (
        function (resolve, reject) {
            request.post({url: uri, headers: RequestCoreAPI.requestHeaders(requestUserModel), json: jsonReq}, function (err, httpResponse, body) {
                if (err) {
                    console.error('upload failed:', err);
                    reject(err);
                }
                // console.log('Upload successful!  Server responded with:', body);
                Object.assign(folderModel, body.entry);
                resolve(body);
            });
        });
};

/**
 * Upload file using API
 *
 * @param requestUserModel {User that makes the request}
 * @param filePath
 * @param appUrl
 * @param callback
 * @method uploadFileViaAPI
 */
exports.uploadFileViaAPI = function (requestUserModel, fileModel, nodeId) {

    var absolutePath = path.resolve(path.join(TestConfig.main.rootPath, fileModel.getLocation()));
    var uri = url(RequestCoreAPI.getBaseURL(), nodesBaseUrl, nodeId, "children");

    var form = {
        filedata: fs.createReadStream(absolutePath)
    };

    return new Promise (
        function (resolve, reject) {
            request.post({url: uri, headers: RequestCoreAPI.requestHeaders(requestUserModel), formData: form}, function (err, httpResponse, body) {
                // console.log('Upload successful!  Server responded with:', body);
                if (err) {
                    console.error('upload failed:', err);
                    reject(err);
                }

                var json_data = JSON.parse(body);
                Object.assign(fileModel, json_data.entry);
                fileModel.update(json_data.entry);
                resolve(body);
            });
        });
};

/**
 * Upload empty files using API
 *
 * @param requestUserModel {User that makes the request}
 * @param fileNames
 * @param nodeId
 * @method createEmptyFilesViaAPI
 */
exports.createEmptyFilesViaAPI = function (requestUserModel, fileNames, nodeId) {

    var jsonReq = [];
    for(var i =0; i< fileNames.length; i++) {
        var jsonItem = {};
        jsonItem["name"] = fileNames[i];
        jsonItem["nodeType"] = "cm:content";
        jsonReq.push(jsonItem);
    }

    var uri = url(RequestCoreAPI.getBaseURL(), nodesBaseUrl, nodeId, "children");

    return new Promise (
        function (resolve, reject) {
            request.post({url: uri, headers: RequestCoreAPI.requestHeaders(requestUserModel), json: jsonReq}, function (err, httpResponse, body) {
                // console.log('Upload successful!  Server responded with:', body);
                if (err) {
                    console.error('upload failed:', err);
                    reject(err);
                }

                resolve(body);
            });
        });
};

/**
 * Delete content using API
 *
 * @param requestUserModel {User that makes the request}
 * @param nodeId
 * @param callback
 */
exports.deleteContent = function (requestUserModel, nodeId, callback) {

    var uri = url(RequestCoreAPI.getBaseURL(), nodesBaseUrl, nodeId);

    request.del({ url: uri, headers: RequestCoreAPI.requestHeaders(requestUserModel) }, function(error, response, body) {
        if (error) {
            return console.error('delete failed:', error);
        }

        if (typeof callback === 'function') {
            callback.apply(null);
        }
    });
};

exports.unlockContent = function (requestUserModel, nodeId, callback) {

    var uri = url(RequestCoreAPI.getBaseURL(), nodesBaseUrl, nodeId, "/unlock");

    request.post({ url: uri, headers: RequestCoreAPI.requestHeaders(requestUserModel) }, function(error, response, body) {
        if (error) {
            return console.error('Unlock failed:', error);
        }

        if (typeof callback === 'function') {
            callback.apply(null);
        }
    });
};
