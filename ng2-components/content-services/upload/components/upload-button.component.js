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
var permissions_model_1 = require("../../document-list/models/permissions.model");
var UploadButtonComponent = (function () {
    function UploadButtonComponent(uploadService, translateService, logService, notificationService, apiService) {
        this.uploadService = uploadService;
        this.translateService = translateService;
        this.logService = logService;
        this.notificationService = notificationService;
        this.apiService = apiService;
        /** @deprecated Deprecated in 1.6.0, you can use UploadService events and NotificationService api instead. */
        this.showNotificationBar = true;
        /** @deprecated Deprecated in 1.6.0, this property is not used for couple of releases already. */
        this.currentFolderPath = '/';
        /** @deprecated Deprecated in 1.8.0, use the button with combination of adf-node-permission directive */
        this.disableWithNoPermission = false;
        this.disabled = false;
        this.uploadFolders = false;
        this.multipleFiles = false;
        this.versioning = false;
        this.acceptedFilesType = '*';
        this.tooltip = null;
        this.rootFolderId = '-root-';
        this.success = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.createFolder = new core_1.EventEmitter();
        this.permissionEvent = new core_1.EventEmitter();
        this.hasPermission = false;
        this.permissionValue = new Rx_1.Subject();
    }
    UploadButtonComponent_1 = UploadButtonComponent;
    UploadButtonComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.permissionValue.subscribe(function (permission) {
            _this.hasPermission = permission;
        });
    };
    UploadButtonComponent.prototype.ngOnChanges = function (changes) {
        var rootFolderId = changes['rootFolderId'];
        if (rootFolderId && rootFolderId.currentValue) {
            this.checkPermission();
        }
    };
    UploadButtonComponent.prototype.isButtonDisabled = function () {
        return this.isForceDisable() || this.isDisableWithNoPermission();
    };
    UploadButtonComponent.prototype.isForceDisable = function () {
        return this.disabled ? true : undefined;
    };
    /** @deprecated Deprecated in 1.8.0, use the button with combination of adf-node-permission directive */
    UploadButtonComponent.prototype.isDisableWithNoPermission = function () {
        return !this.hasPermission && this.disableWithNoPermission ? true : undefined;
    };
    UploadButtonComponent.prototype.onFilesAdded = function ($event) {
        var files = core_2.FileUtils.toFileArray($event.currentTarget.files);
        if (this.hasPermission) {
            this.uploadFiles(files);
        }
        else {
            this.permissionEvent.emit(new permissions_model_1.PermissionModel({ type: 'content', action: 'upload', permission: 'create' }));
        }
        // reset the value of the input file
        $event.target.value = '';
    };
    UploadButtonComponent.prototype.onDirectoryAdded = function ($event) {
        if (this.hasPermission) {
            var files = core_2.FileUtils.toFileArray($event.currentTarget.files);
            this.uploadFiles(files);
        }
        else {
            this.permissionEvent.emit(new permissions_model_1.PermissionModel({ type: 'content', action: 'upload', permission: 'create' }));
        }
        // reset the value of the input file
        $event.target.value = '';
    };
    /**
     * Upload a list of file in the specified path
     * @param files
     * @param path
     */
    UploadButtonComponent.prototype.uploadFiles = function (files) {
        var latestFilesAdded = files
            .map(this.createFileModel.bind(this))
            .filter(this.isFileAcceptable.bind(this))
            .filter(this.isFileSizeAcceptable.bind(this));
        if (latestFilesAdded.length > 0) {
            (_a = this.uploadService).addToQueue.apply(_a, latestFilesAdded);
            this.uploadService.uploadFilesInTheQueue(this.success);
            if (this.showNotificationBar) {
                this.showUndoNotificationBar(latestFilesAdded);
            }
        }
        var _a;
    };
    /**
     * Creates FileModel from File
     *
     * @param file
     */
    UploadButtonComponent.prototype.createFileModel = function (file) {
        return new core_2.FileModel(file, {
            newVersion: this.versioning,
            parentId: this.rootFolderId,
            path: (file.webkitRelativePath || '').replace(/\/[^\/]*$/, '')
        });
    };
    /**
     * Checks if the given file is allowed by the extension filters
     *
     * @param file FileModel
     */
    UploadButtonComponent.prototype.isFileAcceptable = function (file) {
        if (this.acceptedFilesType === '*') {
            return true;
        }
        var allowedExtensions = this.acceptedFilesType
            .split(',')
            .map(function (ext) { return ext.replace(/^\./, ''); });
        if (allowedExtensions.indexOf(file.extension) !== -1) {
            return true;
        }
        return false;
    };
    /**
     * Checks if the given file is an acceptable size
     *
     * @param file FileModel
     */
    UploadButtonComponent.prototype.isFileSizeAcceptable = function (file) {
        var _this = this;
        var acceptableSize = true;
        if ((this.maxFilesSize !== undefined && this.maxFilesSize !== null) && (this.maxFilesSize <= 0 || file.size > this.maxFilesSize)) {
            acceptableSize = false;
            this.translateService.get('FILE_UPLOAD.MESSAGES.EXCEED_MAX_FILE_SIZE', { fileName: file.name }).subscribe(function (message) {
                _this.error.emit(message);
            });
        }
        return acceptableSize;
    };
    /**
     * Show undo notification bar.
     *
     * @param {FileModel[]} latestFilesAdded - files in the upload queue enriched with status flag and xhr object.
     */
    UploadButtonComponent.prototype.showUndoNotificationBar = function (latestFilesAdded) {
        var _this = this;
        var messageTranslate, actionTranslate;
        messageTranslate = this.translateService.get('FILE_UPLOAD.MESSAGES.PROGRESS');
        actionTranslate = this.translateService.get('FILE_UPLOAD.ACTION.UNDO');
        this.notificationService.openSnackMessageAction(messageTranslate.value, actionTranslate.value, 3000).onAction().subscribe(function () {
            (_a = _this.uploadService).cancelUpload.apply(_a, latestFilesAdded);
            var _a;
        });
    };
    UploadButtonComponent.prototype.checkPermission = function () {
        var _this = this;
        if (this.rootFolderId) {
            this.getFolderNode(this.rootFolderId).subscribe(function (res) { return _this.permissionValue.next(_this.hasCreatePermission(res)); }, function (error) { return _this.error.emit(error); });
        }
    };
    // TODO: move to ContentService
    UploadButtonComponent.prototype.getFolderNode = function (nodeId) {
        var _this = this;
        var opts = {
            includeSource: true,
            include: ['allowableOperations']
        };
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().nodes.getNodeInfo(nodeId, opts))
            .catch(function (err) { return _this.handleError(err); });
    };
    UploadButtonComponent.prototype.handleError = function (error) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        this.logService.error(error);
        return Rx_1.Observable.throw(error || 'Server error');
    };
    UploadButtonComponent.prototype.hasCreatePermission = function (node) {
        if (node && node.allowableOperations) {
            return node.allowableOperations.find(function (permission) { return permission === 'create'; }) ? true : false;
        }
        return false;
    };
    __decorate([
        core_1.Input()
    ], UploadButtonComponent.prototype, "showNotificationBar", void 0);
    __decorate([
        core_1.Input()
    ], UploadButtonComponent.prototype, "currentFolderPath", void 0);
    __decorate([
        core_1.Input()
    ], UploadButtonComponent.prototype, "disableWithNoPermission", void 0);
    __decorate([
        core_1.Input()
    ], UploadButtonComponent.prototype, "disabled", void 0);
    __decorate([
        core_1.Input()
    ], UploadButtonComponent.prototype, "uploadFolders", void 0);
    __decorate([
        core_1.Input()
    ], UploadButtonComponent.prototype, "multipleFiles", void 0);
    __decorate([
        core_1.Input()
    ], UploadButtonComponent.prototype, "versioning", void 0);
    __decorate([
        core_1.Input()
    ], UploadButtonComponent.prototype, "acceptedFilesType", void 0);
    __decorate([
        core_1.Input()
    ], UploadButtonComponent.prototype, "maxFilesSize", void 0);
    __decorate([
        core_1.Input()
    ], UploadButtonComponent.prototype, "staticTitle", void 0);
    __decorate([
        core_1.Input()
    ], UploadButtonComponent.prototype, "tooltip", void 0);
    __decorate([
        core_1.Input()
    ], UploadButtonComponent.prototype, "rootFolderId", void 0);
    __decorate([
        core_1.Output()
    ], UploadButtonComponent.prototype, "success", void 0);
    __decorate([
        core_1.Output()
    ], UploadButtonComponent.prototype, "error", void 0);
    __decorate([
        core_1.Output()
    ], UploadButtonComponent.prototype, "createFolder", void 0);
    __decorate([
        core_1.Output()
    ], UploadButtonComponent.prototype, "permissionEvent", void 0);
    UploadButtonComponent = UploadButtonComponent_1 = __decorate([
        core_1.Component({
            selector: 'adf-upload-button',
            templateUrl: './upload-button.component.html',
            styleUrls: ['./upload-button.component.scss'],
            providers: [
                { provide: core_2.EXTENDIBLE_COMPONENT, useExisting: core_1.forwardRef(function () { return UploadButtonComponent_1; }) }
            ],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], UploadButtonComponent);
    return UploadButtonComponent;
    var UploadButtonComponent_1;
}());
exports.UploadButtonComponent = UploadButtonComponent;
