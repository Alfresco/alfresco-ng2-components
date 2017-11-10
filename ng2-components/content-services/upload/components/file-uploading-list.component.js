"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var core_2 = require("@adf/core");
var Rx_1 = require("rxjs/Rx");
var FileUploadingListComponent = (function () {
    function FileUploadingListComponent(uploadService, nodesApi, notificationService, translateService) {
        this.uploadService = uploadService;
        this.nodesApi = nodesApi;
        this.notificationService = notificationService;
        this.translateService = translateService;
        this.FileUploadStatus = core_2.FileUploadStatus;
        this.files = [];
    }
    /**
     * Cancel file upload
     *
     * @param {FileModel} file File model to cancel upload for.
     *
     * @memberOf FileUploadingListComponent
     */
    FileUploadingListComponent.prototype.cancelFile = function (file) {
        this.uploadService.cancelUpload(file);
    };
    FileUploadingListComponent.prototype.removeFile = function (file) {
        var _this = this;
        this.deleteNode(file)
            .subscribe(function () {
            if (file.status === core_2.FileUploadStatus.Error) {
                _this.notifyError(file);
            }
            _this.uploadService.cancelUpload(file);
        });
    };
    /**
     * Call the appropriate method for each file, depending on state
     */
    FileUploadingListComponent.prototype.cancelAllFiles = function () {
        var _this = this;
        this.getUploadingFiles()
            .forEach(function (file) { return _this.uploadService.cancelUpload(file); });
        var deletedFiles = this.files
            .filter(function (file) { return file.status === core_2.FileUploadStatus.Complete; })
            .map(function (file) { return _this.deleteNode(file); });
        Rx_1.Observable.forkJoin.apply(Rx_1.Observable, deletedFiles).subscribe(function (files) {
            var errors = files
                .filter(function (file) { return file.status === core_2.FileUploadStatus.Error; });
            if (errors.length) {
                _this.notifyError.apply(_this, errors);
            }
            (_a = _this.uploadService).cancelUpload.apply(_a, files);
            var _a;
        });
    };
    /**
     * Checks if all the files are uploaded
     * @returns {boolean} - false if there is at least one file in Progress | Starting | Pending
     */
    FileUploadingListComponent.prototype.isUploadCompleted = function () {
        return !this.isUploadCancelled() &&
            Boolean(this.files.length) &&
            !this.files
                .some(function (_a) {
                var status = _a.status;
                return status === core_2.FileUploadStatus.Starting ||
                    status === core_2.FileUploadStatus.Progress ||
                    status === core_2.FileUploadStatus.Pending;
            });
    };
    /**
     * Check if all the files are Cancelled | Aborted | Error.
     * @returns {boolean} - false if there is at least one file in uploading states
     */
    FileUploadingListComponent.prototype.isUploadCancelled = function () {
        return !!this.files.length &&
            this.files
                .every(function (_a) {
                var status = _a.status;
                return status === core_2.FileUploadStatus.Aborted ||
                    status === core_2.FileUploadStatus.Cancelled ||
                    status === core_2.FileUploadStatus.Deleted;
            });
    };
    FileUploadingListComponent.prototype.deleteNode = function (file) {
        var id = file.data.entry.id;
        return this.nodesApi
            .deleteNode(id, { permanent: true })
            .map(function () {
            file.status = core_2.FileUploadStatus.Deleted;
            return file;
        })
            .catch(function (error) {
            file.status = core_2.FileUploadStatus.Error;
            return Rx_1.Observable.of(file);
        });
    };
    FileUploadingListComponent.prototype.notifyError = function () {
        var _this = this;
        var files = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            files[_i] = arguments[_i];
        }
        var translateSubscription = null;
        if (files.length === 1) {
            translateSubscription = this.translateService
                .get('FILE_UPLOAD.MESSAGES.REMOVE_FILE_ERROR', { fileName: files[0].name });
        }
        else {
            translateSubscription = this.translateService
                .get('FILE_UPLOAD.MESSAGES.REMOVE_FILES_ERROR', { total: files.length });
        }
        translateSubscription
            .subscribe(function (message) { return _this.notificationService.openSnackMessage(message, 4000); });
    };
    FileUploadingListComponent.prototype.getUploadingFiles = function () {
        return this.files.filter(function (item) {
            if (item.status === core_2.FileUploadStatus.Pending ||
                item.status === core_2.FileUploadStatus.Progress ||
                item.status === core_2.FileUploadStatus.Starting) {
                return item;
            }
        });
    };
    __decorate([
        core_1.ContentChild(core_1.TemplateRef)
    ], FileUploadingListComponent.prototype, "template", void 0);
    __decorate([
        core_1.Input()
    ], FileUploadingListComponent.prototype, "files", void 0);
    FileUploadingListComponent = __decorate([
        core_1.Component({
            selector: 'adf-file-uploading-list',
            templateUrl: './file-uploading-list.component.html',
            styleUrls: ['./file-uploading-list.component.scss']
        })
    ], FileUploadingListComponent);
    return FileUploadingListComponent;
}());
exports.FileUploadingListComponent = FileUploadingListComponent;
