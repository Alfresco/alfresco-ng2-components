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
System.register(['angular2/core', '../services/upload.service', './file-uploading-dialog.component', '../directives/file-draggable.directive'], function(exports_1, context_1) {
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
    var core_1, upload_service_1, file_uploading_dialog_component_1, file_draggable_directive_1;
    var UploadDragAreaComponent;
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
            function (file_draggable_directive_1_1) {
                file_draggable_directive_1 = file_draggable_directive_1_1;
            }],
        execute: function() {
            /**
             * <alfresco-upload-drag-area [showDialogUpload]="boolean" ></alfresco-upload-drag-area>
             *
             * This component, provide a drag and drop are to upload files to alfresco.
             *
             * @InputParam {boolean} [true] showDialogUpload - hide/show upload dialog .
             *
             *
             * @returns {UploadDragAreaComponent} .
             */
            UploadDragAreaComponent = (function () {
                function UploadDragAreaComponent(el) {
                    this.el = el;
                    this.showUploadDialog = true;
                    this.filesUploadingList = [];
                    this.uploaddirectory = '';
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
                /**
                 * Method called when files are dropped in the drag area.
                 *
                 * @param {File[]} files - files dropped in the drag area.
                 */
                UploadDragAreaComponent.prototype.onFilesDropped = function (files) {
                    if (files.length) {
                        this._uploaderService.addToQueue(files);
                        this._uploaderService.uploadFilesInTheQueue(this.uploaddirectory);
                        this.filesUploadingList = this._uploaderService.getQueue();
                        if (this.showUploadDialog) {
                            this._showDialog();
                        }
                    }
                };
                /**
                 * Show the upload dialog.
                 */
                UploadDragAreaComponent.prototype._showDialog = function () {
                    this.fileUploadingDialogComponent.showDialog();
                };
                __decorate([
                    core_1.ViewChild('fileUploadingDialog'), 
                    __metadata('design:type', file_uploading_dialog_component_1.FileUploadingDialogComponent)
                ], UploadDragAreaComponent.prototype, "fileUploadingDialogComponent", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], UploadDragAreaComponent.prototype, "showUploadDialog", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], UploadDragAreaComponent.prototype, "uploaddirectory", void 0);
                UploadDragAreaComponent = __decorate([
                    core_1.Component({
                        selector: 'alfresco-upload-drag-area',
                        moduleId: __moduleName,
                        directives: [file_draggable_directive_1.FileDraggableDirective, file_uploading_dialog_component_1.FileUploadingDialogComponent],
                        templateUrl: './upload-drag-area.component.html',
                        styleUrls: ['./upload-drag-area.component.css']
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], UploadDragAreaComponent);
                return UploadDragAreaComponent;
            }());
            exports_1("UploadDragAreaComponent", UploadDragAreaComponent);
        }
    }
});
//# sourceMappingURL=upload-drag-area.component.js.map