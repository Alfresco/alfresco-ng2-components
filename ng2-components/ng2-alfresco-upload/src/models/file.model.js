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
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var FileModel;
    return {
        setters:[],
        execute: function() {
            /**
             *
             * This object represent the status of an uploading file.
             *
             *
             * @returns {FileModel} .
             */
            FileModel = (function () {
                function FileModel(file) {
                    this.done = false;
                    this.error = false;
                    this.abort = false;
                    this.uploading = false;
                    this.file = file;
                    this.id = this._generateId();
                    this.name = file.name;
                    this.size = this._getFileSize(file.size);
                    this.progress = {
                        loaded: 0,
                        total: 0,
                        percent: 0
                    };
                }
                FileModel.prototype.setProgres = function (progress) {
                    this.progress = progress;
                };
                FileModel.prototype.setError = function () {
                    this.error = true;
                };
                FileModel.prototype.setUploading = function () {
                    this.uploading = true;
                };
                FileModel.prototype.setXMLHttpRequest = function (xmlHttpRequest) {
                    this._xmlHttpRequest = xmlHttpRequest;
                };
                /**
                 * Stop the uploading of the file.
                 */
                FileModel.prototype.setAbort = function () {
                    if (!this.done && !this.error) {
                        this.abort = true;
                        this.uploading = false;
                        this._xmlHttpRequest.abort();
                    }
                };
                /**
                 * Update status of the file when upload finish or is ended.
                 */
                FileModel.prototype.onFinished = function (status, statusText, response) {
                    this.status = status;
                    this.statusText = statusText;
                    this.response = response;
                    this.done = true;
                    this.uploading = false;
                };
                /**
                 * Calculate the size of the file in kb,mb and gb.
                 *
                 * @param {number} sizeinbytes - size in bytes of the file.
                 */
                FileModel.prototype._getFileSize = function (sizeinbytes) {
                    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
                    var size = sizeinbytes;
                    var i = 0;
                    while (size > 900) {
                        size /= 1000;
                        i++;
                    }
                    return Math.round((Math.round(size * 100) / 100)) + ' ' + fSExt[i];
                };
                /**
                 * Calculate the size of the file in kb,mb and gb.
                 *
                 * @return {string} - return a unique file uploading id.
                 */
                FileModel.prototype._generateId = function () {
                    return 'uploading-file-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                };
                return FileModel;
            }());
            exports_1("FileModel", FileModel);
        }
    }
});
//# sourceMappingURL=file.model.js.map