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
System.register(['angular2/core', '../services/upload.service', './file-uploading-dialog.component', '../directives/file-select.directive'], function(exports_1, context_1) {
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
    var core_1, upload_service_1, file_uploading_dialog_component_1, file_select_directive_1;
    var UploadButtonComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (upload_service_1_1) {
                upload_service_1 = upload_service_1_1;
            },
            function (file_uploading_dialog_component_1_1) {
                file_uploading_dialog_component_1 = file_uploading_dialog_component_1_1;
            },
            function (file_select_directive_1_1) {
                file_select_directive_1 = file_select_directive_1_1;
            }],
        execute: function() {
            UploadButtonComponent = (function () {
                function UploadButtonComponent(el) {
                    this.el = el;
                    this.filesUploadingList = [];
                    console.log('UploadComponent constructor', el);
                    this._uploaderService = new upload_service_1.UploadService({
                        url: 'http://192.168.99.100:8080/alfresco/service/api/upload',
                        withCredentials: true,
                        authToken: btoa('admin:admin'),
                        authTokenPrefix: 'Basic',
                        fieldName: 'filedata',
                        formFields: {
                            siteid: 'swsdp',
                            containerid: 'documentLibrary'
                        }
                    });
                }
                UploadButtonComponent.prototype.onFilesAdded = function (files) {
                    if (files.length) {
                        var latestFilesAdded = this._uploaderService.addToQueue(files);
                        this.filesUploadingList = this._uploaderService.getQueue();
                        this.showDialog();
                        this.showUndoNotificationBar(latestFilesAdded);
                    }
                };
                UploadButtonComponent.prototype.showUndoNotificationBar = function (latestFilesAdded) {
                    if (componentHandler) {
                        componentHandler.upgradeAllRegistered();
                    }
                    this.undoNotificationBar.nativeElement.MaterialSnackbar.showSnackbar({
                        message: 'Upload in progress...',
                        timeout: 5000,
                        actionHandler: function () {
                            latestFilesAdded.forEach(function (uploadingFileModel) {
                                uploadingFileModel.setAbort();
                            });
                        },
                        actionText: 'Undo'
                    });
                };
                UploadButtonComponent.prototype.showDialog = function () {
                    this.fileUploadingDialogComponent.showDialog();
                };
                __decorate([
                    core_1.ViewChild('undoNotificationBar'),
                    __metadata('design:type', Object)
                ], UploadButtonComponent.prototype, "undoNotificationBar", void 0);
                __decorate([
                    core_1.ViewChild('fileUploadingDialog'),
                    __metadata('design:type', file_uploading_dialog_component_1.FileUploadingDialogComponent)
                ], UploadButtonComponent.prototype, "fileUploadingDialogComponent", void 0);
                UploadButtonComponent = __decorate([
                    core_1.Component({
                        selector: 'alfresco-upload-button',
                        moduleId: __moduleName,
                        directives: [file_select_directive_1.FileSelectDirective, file_uploading_dialog_component_1.FileUploadingDialogComponent],
                        templateUrl: './upload-button.component.html',
                        styleUrls: ['./upload-button.component.css']
                    }),
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], UploadButtonComponent);
                return UploadButtonComponent;
            }());
            exports_1("UploadButtonComponent", UploadButtonComponent);
        }
    }
});
//# sourceMappingURL=upload-button.component.js.map