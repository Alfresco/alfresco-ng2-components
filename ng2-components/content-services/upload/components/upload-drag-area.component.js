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
var UploadDragAreaComponent = (function () {
    function UploadDragAreaComponent(uploadService, translateService, notificationService) {
        this.uploadService = uploadService;
        this.translateService = translateService;
        this.notificationService = notificationService;
        /** @deprecated Deprecated in 1.6.0, you can use UploadService events and NotificationService api instead. */
        this.showNotificationBar = true;
        /** @deprecated Deprecated in 1.6.0, this property is not used for couple of releases already. Use rootFolderId instead. */
        this.currentFolderPath = '/';
        /** @deprecated Deprecated in 1.6.2, this property is not used for couple of releases already. Use parentId instead. */
        this.rootFolderId = '-root-';
        this.disabled = false;
        this.versioning = false;
        this.success = new core_1.EventEmitter();
    }
    UploadDragAreaComponent_1 = UploadDragAreaComponent;
    Object.defineProperty(UploadDragAreaComponent.prototype, "enabled", {
        /** @deprecated Deprecated in favor of disabled input property */
        get: function () {
            console.warn('Deprecated: enabled input property should not be used for UploadDragAreaComponent. Please use disabled instead.');
            return !this.disabled;
        },
        /** @deprecated Deprecated in favor of disabled input property */
        set: function (enabled) {
            console.warn('Deprecated: enabled input property should not be used for UploadDragAreaComponent. Please use disabled instead.');
            this.disabled = !enabled;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Method called when files are dropped in the drag area.
     *
     * @param {File[]} files - files dropped in the drag area.
     */
    UploadDragAreaComponent.prototype.onFilesDropped = function (files) {
        var _this = this;
        if (!this.disabled && files.length) {
            var fileModels = files.map(function (file) { return new core_2.FileModel(file, {
                newVersion: _this.versioning,
                path: '/',
                parentId: _this.parentId || _this.rootFolderId
            }); });
            (_a = this.uploadService).addToQueue.apply(_a, fileModels);
            this.uploadService.uploadFilesInTheQueue(this.success);
            var latestFilesAdded = this.uploadService.getQueue();
            if (this.showNotificationBar) {
                this.showUndoNotificationBar(latestFilesAdded);
            }
        }
        var _a;
    };
    /**
     * Called when the file are dropped in the drag area
     *
     * @param item - FileEntity
     */
    UploadDragAreaComponent.prototype.onFilesEntityDropped = function (item) {
        var _this = this;
        if (!this.disabled) {
            item.file(function (file) {
                var fileModel = new core_2.FileModel(file, {
                    newVersion: _this.versioning,
                    parentId: _this.parentId || _this.rootFolderId,
                    path: item.fullPath.replace(item.name, '')
                });
                _this.uploadService.addToQueue(fileModel);
                _this.uploadService.uploadFilesInTheQueue(_this.success);
            });
            if (this.showNotificationBar) {
                this.showUndoNotificationBar(item);
            }
        }
    };
    /**
     * Called when a folder are dropped in the drag area
     *
     * @param folder - name of the dropped folder
     */
    UploadDragAreaComponent.prototype.onFolderEntityDropped = function (folder) {
        var _this = this;
        if (!this.disabled && folder.isDirectory) {
            core_2.FileUtils.flattern(folder).then(function (entries) {
                var files = entries.map(function (entry) {
                    return new core_2.FileModel(entry.file, {
                        newVersion: _this.versioning,
                        parentId: _this.parentId || _this.rootFolderId,
                        path: entry.relativeFolder
                    });
                });
                (_a = _this.uploadService).addToQueue.apply(_a, files);
                /* @deprecated in 1.6.0 */
                if (_this.showNotificationBar) {
                    var latestFilesAdded = _this.uploadService.getQueue();
                    _this.showUndoNotificationBar(latestFilesAdded);
                }
                _this.uploadService.uploadFilesInTheQueue(_this.success);
                var _a;
            });
        }
    };
    /**
     * Show undo notification bar.
     *
     * @param {FileModel[]} latestFilesAdded - files in the upload queue enriched with status flag and xhr object.
     */
    UploadDragAreaComponent.prototype.showUndoNotificationBar = function (latestFilesAdded) {
        var _this = this;
        var messageTranslate, actionTranslate;
        messageTranslate = this.translateService.get('FILE_UPLOAD.MESSAGES.PROGRESS');
        actionTranslate = this.translateService.get('FILE_UPLOAD.ACTION.UNDO');
        this.notificationService.openSnackMessageAction(messageTranslate.value, actionTranslate.value, 3000).onAction().subscribe(function () {
            (_a = _this.uploadService).cancelUpload.apply(_a, latestFilesAdded);
            var _a;
        });
    };
    /**
     * Show the error inside Notification bar
     *
     * @param Error message
     * @private
     */
    UploadDragAreaComponent.prototype.showErrorNotificationBar = function (errorMessage) {
        this.notificationService.openSnackMessage(errorMessage, 3000);
    };
    /** Returns true or false considering the component options and node permissions */
    UploadDragAreaComponent.prototype.isDroppable = function () {
        return !this.disabled;
    };
    /**
     * Handles 'upload-files' events raised by child components.
     *
     * @param event DOM event
     */
    UploadDragAreaComponent.prototype.onUploadFiles = function (event) {
        var _this = this;
        event.stopPropagation();
        event.preventDefault();
        var isAllowed = this.hasCreatePermission(event.detail.data.obj.entry);
        if (isAllowed) {
            var files = event.detail.files;
            if (files && files.length > 0) {
                var parentId_1 = this.parentId || this.rootFolderId;
                if (event.detail.data && event.detail.data.obj.entry.isFolder) {
                    parentId_1 = event.detail.data.obj.entry.id || this.parentId || this.rootFolderId;
                }
                var fileModels = files.map(function (fileInfo) { return new core_2.FileModel(fileInfo.file, {
                    newVersion: _this.versioning,
                    path: fileInfo.relativeFolder,
                    parentId: parentId_1
                }); });
                this.uploadFiles(fileModels);
            }
        }
    };
    /**
     * Does the actual file uploading and show the notification
     *
     * @param files
     */
    UploadDragAreaComponent.prototype.uploadFiles = function (files) {
        if (files.length) {
            (_a = this.uploadService).addToQueue.apply(_a, files);
            this.uploadService.uploadFilesInTheQueue(this.success);
            var latestFilesAdded = this.uploadService.getQueue();
            if (this.showNotificationBar) {
                this.showUndoNotificationBar(latestFilesAdded);
            }
        }
        var _a;
    };
    /**
     * Check if "create" permission is present on the given node
     *
     * @param node
     */
    UploadDragAreaComponent.prototype.hasCreatePermission = function (node) {
        var isPermitted = false;
        if (node && node['allowableOperations']) {
            var permFound = node['allowableOperations'].find(function (element) { return element === 'create'; });
            isPermitted = permFound ? true : false;
        }
        return isPermitted;
    };
    __decorate([
        core_1.Input()
    ], UploadDragAreaComponent.prototype, "enabled", null);
    __decorate([
        core_1.Input()
    ], UploadDragAreaComponent.prototype, "showNotificationBar", void 0);
    __decorate([
        core_1.Input()
    ], UploadDragAreaComponent.prototype, "currentFolderPath", void 0);
    __decorate([
        core_1.Input()
    ], UploadDragAreaComponent.prototype, "rootFolderId", void 0);
    __decorate([
        core_1.Input()
    ], UploadDragAreaComponent.prototype, "disabled", void 0);
    __decorate([
        core_1.Input()
    ], UploadDragAreaComponent.prototype, "versioning", void 0);
    __decorate([
        core_1.Input()
    ], UploadDragAreaComponent.prototype, "parentId", void 0);
    __decorate([
        core_1.Output()
    ], UploadDragAreaComponent.prototype, "success", void 0);
    UploadDragAreaComponent = UploadDragAreaComponent_1 = __decorate([
        core_1.Component({
            selector: 'adf-upload-drag-area',
            templateUrl: './upload-drag-area.component.html',
            styleUrls: ['./upload-drag-area.component.css'],
            providers: [
                { provide: core_2.EXTENDIBLE_COMPONENT, useExisting: core_1.forwardRef(function () { return UploadDragAreaComponent_1; }) }
            ],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], UploadDragAreaComponent);
    return UploadDragAreaComponent;
    var UploadDragAreaComponent_1;
}());
exports.UploadDragAreaComponent = UploadDragAreaComponent;
