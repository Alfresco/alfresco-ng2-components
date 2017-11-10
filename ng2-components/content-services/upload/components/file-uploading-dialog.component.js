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
var file_uploading_list_component_1 = require("./file-uploading-list.component");
var FileUploadingDialogComponent = (function () {
    function FileUploadingDialogComponent(uploadService, changeDetecor) {
        this.uploadService = uploadService;
        this.changeDetecor = changeDetecor;
        this.position = 'right';
        this.filesUploadingList = [];
        this.isDialogActive = false;
        this.totalCompleted = 0;
        this.totalErrors = 0;
        this.isDialogMinimized = false;
        this.isConfirmation = false;
    }
    FileUploadingDialogComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.listSubscription = this.uploadService
            .queueChanged.subscribe(function (fileList) {
            _this.filesUploadingList = fileList;
            if (_this.filesUploadingList.length) {
                _this.isDialogActive = true;
            }
        });
        this.counterSubscription = Rx_1.Observable
            .merge(this.uploadService.fileUploadComplete, this.uploadService.fileUploadDeleted)
            .subscribe(function (event) {
            _this.totalCompleted = event.totalComplete;
            _this.changeDetecor.detectChanges();
        });
        this.errorSubscription = this.uploadService.fileUploadError
            .subscribe(function (event) {
            _this.totalErrors = event.totalError;
            _this.changeDetecor.detectChanges();
        });
        this.fileUploadSubscription = this.uploadService
            .fileUpload.subscribe(function () {
            _this.changeDetecor.detectChanges();
        });
        this.uploadService.fileDeleted.subscribe(function (objId) {
            if (_this.filesUploadingList) {
                var file = _this.filesUploadingList.find(function (item) {
                    return item.data.entry.id === objId;
                });
                if (file) {
                    file.status = core_2.FileUploadStatus.Cancelled;
                    _this.changeDetecor.detectChanges();
                }
            }
        });
    };
    /**
     * Toggle confirmation message.
     */
    FileUploadingDialogComponent.prototype.toggleConfirmation = function () {
        this.isConfirmation = !this.isConfirmation;
        if (this.isDialogMinimized) {
            this.isDialogMinimized = false;
        }
    };
    /**
     * Cancel uploads and hide confiramtion
     */
    FileUploadingDialogComponent.prototype.cancelAllUploads = function () {
        this.toggleConfirmation();
        this.uploadList.cancelAllFiles();
    };
    /**
     * Toggle dialog minimized state.
     */
    FileUploadingDialogComponent.prototype.toggleMinimized = function () {
        this.isDialogMinimized = !this.isDialogMinimized;
        this.changeDetecor.detectChanges();
    };
    /**
     * Dismiss dialog
     */
    FileUploadingDialogComponent.prototype.close = function () {
        this.isConfirmation = false;
        this.totalCompleted = 0;
        this.totalErrors = 0;
        this.filesUploadingList = [];
        this.isDialogActive = false;
        this.isDialogMinimized = false;
        this.uploadService.clearQueue();
        this.changeDetecor.detectChanges();
    };
    FileUploadingDialogComponent.prototype.ngOnDestroy = function () {
        this.uploadService.clearQueue();
        this.listSubscription.unsubscribe();
        this.counterSubscription.unsubscribe();
        this.fileUploadSubscription.unsubscribe();
        this.errorSubscription.unsubscribe();
    };
    __decorate([
        core_1.ViewChild(file_uploading_list_component_1.FileUploadingListComponent)
    ], FileUploadingDialogComponent.prototype, "uploadList", void 0);
    __decorate([
        core_1.Input()
    ], FileUploadingDialogComponent.prototype, "position", void 0);
    FileUploadingDialogComponent = __decorate([
        core_1.Component({
            selector: 'adf-file-uploading-dialog, file-uploading-dialog',
            templateUrl: './file-uploading-dialog.component.html',
            styleUrls: ['./file-uploading-dialog.component.scss']
        })
    ], FileUploadingDialogComponent);
    return FileUploadingDialogComponent;
}());
exports.FileUploadingDialogComponent = FileUploadingDialogComponent;
