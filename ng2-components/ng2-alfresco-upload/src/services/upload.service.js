/**
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
System.register(['../models/file.model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var file_model_1;
    var UploadService;
    return {
        setters:[
            function (file_model_1_1) {
                file_model_1 = file_model_1_1;
            }],
        execute: function() {
            /**
             *
             * UploadService keep the queue of the file to upload and uploads them.
             *
             * @returns {UploadService} .
             */
            UploadService = (function () {
                function UploadService(options) {
                    this.options = options;
                    this._method = 'POST';
                    this._authTokenPrefix = 'Basic';
                    this._authToken = undefined;
                    this._fieldName = 'file';
                    this._formFields = {};
                    this._queue = [];
                    console.log('UploadService constructor');
                    this._withCredentials = options.withCredentials != null ? options.withCredentials : this._withCredentials;
                    this._url = options.url != null ? options.url : this._url;
                    this._authTokenPrefix = options.authTokenPrefix != null ? options.authTokenPrefix : this._authTokenPrefix;
                    this._authToken = options.authToken != null ? options.authToken : this._authToken;
                    this._fieldName = options.fieldName != null ? options.fieldName : this._fieldName;
                    this._formFields = options.formFields != null ? options.formFields : this._formFields;
                }
                /**
                 * Add files to the uploading queue to be uploaded.
                 *
                 * @param {File[]} - files to add to the upload queue.
                 *
                 * return {FileModel[]} - return the file added to the queue in this call.
                 */
                UploadService.prototype.addToQueue = function (files) {
                    var latestFilesAdded = [];
                    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                        var file = files_1[_i];
                        if (this._isFile(file)) {
                            var uploadingFileModel = new file_model_1.FileModel(file);
                            latestFilesAdded.push(uploadingFileModel);
                            this._queue.push(uploadingFileModel);
                        }
                    }
                    this._uploadFilesInTheQueue();
                    return latestFilesAdded;
                };
                /**
                 * Pick all the files in the queue that are not been uploaded yet and upload it.
                 */
                UploadService.prototype._uploadFilesInTheQueue = function () {
                    var _this = this;
                    var filesToUpload = this._queue.filter(function (uploadingFileModel) {
                        return !uploadingFileModel.uploading && !uploadingFileModel.done && !uploadingFileModel.abort && !uploadingFileModel.error;
                    });
                    filesToUpload.forEach(function (uploadingFileModel) {
                        uploadingFileModel.setUploading();
                        _this.uploadFile(uploadingFileModel);
                    });
                };
                ;
                /**
                 * The method create a new XMLHttpRequest instance if doesn't exist
                 */
                UploadService.prototype._configureXMLHttpRequest = function (uploadingFileModel) {
                    var _this = this;
                    if (this._xmlHttpRequest == undefined) {
                        this._xmlHttpRequest = new XMLHttpRequest();
                        this._xmlHttpRequest.upload.onprogress = function (e) {
                            if (e.lengthComputable) {
                                var percent = Math.round(e.loaded / e.total * 100);
                                uploadingFileModel.setProgres({
                                    total: e.total,
                                    loaded: e.loaded,
                                    percent: percent
                                });
                            }
                        };
                        this._xmlHttpRequest.upload.onabort = function (e) {
                            uploadingFileModel.setAbort();
                        };
                        this._xmlHttpRequest.upload.onerror = function (e) {
                            uploadingFileModel.setError();
                        };
                        this._xmlHttpRequest.onreadystatechange = function () {
                            if (_this._xmlHttpRequest.readyState === XMLHttpRequest.DONE) {
                                uploadingFileModel.onFinished(_this._xmlHttpRequest.status, _this._xmlHttpRequest.statusText, _this._xmlHttpRequest.response);
                            }
                        };
                    }
                };
                /**
                 * Upload a file, and enrich it with the xhr.
                 *
                 * @param {FileModel} - files to be uploaded.
                 *
                 */
                UploadService.prototype.uploadFile = function (uploadingFileModel) {
                    var _this = this;
                    var form = new FormData();
                    form.append(this._fieldName, uploadingFileModel.file, uploadingFileModel.name);
                    Object.keys(this._formFields).forEach(function (key) {
                        form.append(key, _this._formFields[key]);
                    });
                    this._configureXMLHttpRequest(uploadingFileModel);
                    uploadingFileModel.setXMLHttpRequest(this._xmlHttpRequest);
                    this._xmlHttpRequest.open(this._method, this._url, true);
                    this._xmlHttpRequest.withCredentials = this._withCredentials;
                    if (this._authToken) {
                        this._xmlHttpRequest.setRequestHeader('Authorization', this._authTokenPrefix + " " + this._authToken);
                    }
                    this._xmlHttpRequest.send(form);
                };
                /**
                 * Return all the files in the uploading queue.
                 *
                 * @return {FileModel[]} - files in the upload queue.
                 */
                UploadService.prototype.getQueue = function () {
                    return this._queue;
                };
                /**
                 * Check if an item is a file.
                 *
                 * @return {boolean}
                 */
                UploadService.prototype._isFile = function (file) {
                    return file !== null && (file instanceof Blob || (file.name && file.size));
                };
                /**
                 * Set XMLHttpRequest method
                 * @param xhr
                 */
                UploadService.prototype.setXMLHttpRequest = function (xhr) {
                    this._xmlHttpRequest = xhr;
                };
                return UploadService;
            }());
            exports_1("UploadService", UploadService);
        }
    }
});
//# sourceMappingURL=upload.service.js.map