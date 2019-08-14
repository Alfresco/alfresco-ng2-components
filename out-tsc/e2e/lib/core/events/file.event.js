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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var file_model_1 = require("../models/file.model");
var FileUploadEvent = /** @class */ (function () {
    function FileUploadEvent(file, status, error) {
        if (status === void 0) { status = file_model_1.FileUploadStatus.Pending; }
        if (error === void 0) { error = null; }
        this.file = file;
        this.status = status;
        this.error = error;
    }
    return FileUploadEvent;
}());
exports.FileUploadEvent = FileUploadEvent;
var FileUploadCompleteEvent = /** @class */ (function (_super) {
    __extends(FileUploadCompleteEvent, _super);
    function FileUploadCompleteEvent(file, totalComplete, data, totalAborted) {
        if (totalComplete === void 0) { totalComplete = 0; }
        if (totalAborted === void 0) { totalAborted = 0; }
        var _this = _super.call(this, file, file_model_1.FileUploadStatus.Complete) || this;
        _this.totalComplete = totalComplete;
        _this.data = data;
        _this.totalAborted = totalAborted;
        return _this;
    }
    return FileUploadCompleteEvent;
}(FileUploadEvent));
exports.FileUploadCompleteEvent = FileUploadCompleteEvent;
var FileUploadDeleteEvent = /** @class */ (function (_super) {
    __extends(FileUploadDeleteEvent, _super);
    function FileUploadDeleteEvent(file, totalComplete) {
        if (totalComplete === void 0) { totalComplete = 0; }
        var _this = _super.call(this, file, file_model_1.FileUploadStatus.Deleted) || this;
        _this.totalComplete = totalComplete;
        return _this;
    }
    return FileUploadDeleteEvent;
}(FileUploadEvent));
exports.FileUploadDeleteEvent = FileUploadDeleteEvent;
var FileUploadErrorEvent = /** @class */ (function (_super) {
    __extends(FileUploadErrorEvent, _super);
    function FileUploadErrorEvent(file, error, totalError) {
        if (totalError === void 0) { totalError = 0; }
        var _this = _super.call(this, file, file_model_1.FileUploadStatus.Error) || this;
        _this.error = error;
        _this.totalError = totalError;
        return _this;
    }
    return FileUploadErrorEvent;
}(FileUploadEvent));
exports.FileUploadErrorEvent = FileUploadErrorEvent;
//# sourceMappingURL=file.event.js.map