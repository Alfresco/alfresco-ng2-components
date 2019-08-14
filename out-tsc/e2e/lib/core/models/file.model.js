"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var FileUploadOptions = /** @class */ (function () {
    function FileUploadOptions() {
    }
    return FileUploadOptions;
}());
exports.FileUploadOptions = FileUploadOptions;
var FileUploadStatus;
(function (FileUploadStatus) {
    FileUploadStatus[FileUploadStatus["Pending"] = 0] = "Pending";
    FileUploadStatus[FileUploadStatus["Complete"] = 1] = "Complete";
    FileUploadStatus[FileUploadStatus["Starting"] = 2] = "Starting";
    FileUploadStatus[FileUploadStatus["Progress"] = 3] = "Progress";
    FileUploadStatus[FileUploadStatus["Cancelled"] = 4] = "Cancelled";
    FileUploadStatus[FileUploadStatus["Aborted"] = 5] = "Aborted";
    FileUploadStatus[FileUploadStatus["Error"] = 6] = "Error";
    FileUploadStatus[FileUploadStatus["Deleted"] = 7] = "Deleted";
})(FileUploadStatus = exports.FileUploadStatus || (exports.FileUploadStatus = {}));
var FileModel = /** @class */ (function () {
    function FileModel(file, options, id) {
        this.status = FileUploadStatus.Pending;
        this.file = file;
        this.id = id;
        this.name = file.name;
        this.size = file.size;
        this.data = null;
        this.errorCode = null;
        this.progress = {
            loaded: 0,
            total: 0,
            percent: 0
        };
        this.options = Object.assign({}, {
            newVersion: false
        }, options);
    }
    Object.defineProperty(FileModel.prototype, "extension", {
        get: function () {
            return this.name.slice((Math.max(0, this.name.lastIndexOf('.')) || Infinity) + 1);
        },
        enumerable: true,
        configurable: true
    });
    return FileModel;
}());
exports.FileModel = FileModel;
//# sourceMappingURL=file.model.js.map