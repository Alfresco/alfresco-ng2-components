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
System.register(['angular2/core', '../models/file.model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, file_model_1;
    var UploadService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (file_model_1_1) {
                file_model_1 = file_model_1_1;
            }],
        execute: function() {
            UploadService = (function () {
                function UploadService() {
                    this._method = 'POST';
                    this._authTokenPrefix = 'Basic';
                    this._authToken = undefined;
                    this._fieldName = 'file';
                    this._formFields = {};
                    this._queue = [];
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
                UploadService = __decorate([
                    core_1.Injectable(),
                    __metadata('design:paramtypes', [])
                ], UploadService);
                return UploadService;
            }());
            exports_1("UploadService", UploadService);
        }
    }
});
//# sourceMappingURL=upload.service.js.map