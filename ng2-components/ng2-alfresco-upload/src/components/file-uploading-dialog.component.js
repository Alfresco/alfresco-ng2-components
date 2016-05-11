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
System.register(['angular2/core', './file-uploading-list.component', 'ng2-translate/ng2-translate'], function(exports_1, context_1) {
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
    var core_1, file_uploading_list_component_1, ng2_translate_1;
    var FileUploadingDialogComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (file_uploading_list_component_1_1) {
                file_uploading_list_component_1 = file_uploading_list_component_1_1;
            },
            function (ng2_translate_1_1) {
                ng2_translate_1 = ng2_translate_1_1;
            }],
        execute: function() {
            /**
             * <file-uploading-dialog [filesUploadingList]="FileModel[]" ></file-uploading-dialog>
             *
             * This component is a hideable and minimizable wich contains the list of the uploading
             * files contained in the filesUploadingList.
             *
             * @InputParam {FileModel[]} filesUploadingList - list of the uploading files .
             *
             *
             * @returns {FileUploadingDialogComponent} .
             */
            FileUploadingDialogComponent = (function () {
                function FileUploadingDialogComponent(el) {
                    this.el = el;
                    this._isDialogActive = false;
                    this._isDialogMinimized = false;
                    console.log('FileUploadingDialogComponent constructor', el);
                }
                /**
                 * Display and hide the dialog component.
                 */
                FileUploadingDialogComponent.prototype.toggleShowDialog = function ($event) {
                    this._isDialogActive = !this._isDialogActive;
                };
                /**
                 * Display the dialog if hidden.
                 */
                FileUploadingDialogComponent.prototype.showDialog = function () {
                    this._isDialogActive = true;
                };
                /**
                 * Minimize and expand the dialog component.
                 */
                FileUploadingDialogComponent.prototype.toggleDialogMinimize = function ($event) {
                    this._isDialogMinimized = !this._isDialogMinimized;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], FileUploadingDialogComponent.prototype, "filesUploadingList", void 0);
                FileUploadingDialogComponent = __decorate([
                    core_1.Component({
                        selector: 'file-uploading-dialog',
                        moduleId: __moduleName,
                        directives: [file_uploading_list_component_1.FileUploadingListComponent],
                        templateUrl: './file-uploading-dialog.component.html',
                        styleUrls: ['./file-uploading-dialog.component.css'],
                        host: { '[class.dialog-show]': 'toggleShowDialog' },
                        pipes: [ng2_translate_1.TranslatePipe]
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], FileUploadingDialogComponent);
                return FileUploadingDialogComponent;
            }());
            exports_1("FileUploadingDialogComponent", FileUploadingDialogComponent);
        }
    }
});
//# sourceMappingURL=file-uploading-dialog.component.js.map