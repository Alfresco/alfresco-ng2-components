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
                UploadService.prototype.uploadFile = function (uploadingFileModel) {
                    var _this = this;
                    var form = new FormData();
                    form.append(this._fieldName, uploadingFileModel.file, uploadingFileModel.name);
                    Object.keys(this._formFields).forEach(function (key) {
                        form.append(key, _this._formFields[key]);
                    });
                    var xmlHttpRequest = new XMLHttpRequest();
                    uploadingFileModel.setXMLHttpRequest(xmlHttpRequest);
                    xmlHttpRequest.upload.onprogress = function (e) {
                        if (e.lengthComputable) {
                            var percent = Math.round(e.loaded / e.total * 100);
                            uploadingFileModel.setProgres({
                                total: e.total,
                                loaded: e.loaded,
                                percent: percent
                            });
                        }
                    };
                    xmlHttpRequest.upload.onabort = function (e) {
                        uploadingFileModel.setAbort();
                    };
                    xmlHttpRequest.upload.onerror = function (e) {
                        uploadingFileModel.setError();
                    };
                    xmlHttpRequest.onreadystatechange = function () {
                        if (xmlHttpRequest.readyState === XMLHttpRequest.DONE) {
                            uploadingFileModel.onFinished(xmlHttpRequest.status, xmlHttpRequest.statusText, xmlHttpRequest.response);
                        }
                    };
                    xmlHttpRequest.open(this._method, this._url, true);
                    xmlHttpRequest.withCredentials = this._withCredentials;
                    if (this._authToken) {
                        xmlHttpRequest.setRequestHeader('Authorization', this._authTokenPrefix + " " + this._authToken);
                    }
                    xmlHttpRequest.send(form);
                };
                UploadService.prototype.getQueue = function () {
                    return this._queue;
                };
                UploadService.prototype._isFile = function (file) {
                    return file !== null && (file instanceof Blob || (file.name && file.size));
                };
                return UploadService;
            }());
            exports_1("UploadService", UploadService);
        }
    }
});
//# sourceMappingURL=upload.service.js.map