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
System.register(['angular2/core'], function(exports_1, context_1) {
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
    var core_1;
    var FileUploadingListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            FileUploadingListComponent = (function () {
                function FileUploadingListComponent(el) {
                    this.el = el;
                    console.log('filesUploadingList constructor', el);
                    setInterval(function () {
                        console.log('Check for async update from drag directive');
                    }, 1000);
                }
                FileUploadingListComponent.prototype.abort = function (id) {
                    var file = this.filesUploadingList.filter(function (uploadingFileModel) {
                        return uploadingFileModel.id == id;
                    });
                    file[0].setAbort();
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], FileUploadingListComponent.prototype, "filesUploadingList", void 0);
                FileUploadingListComponent = __decorate([
                    core_1.Component({
                        selector: 'alfresco-file-uploading-list',
                        moduleId: __moduleName,
                        templateUrl: './file-uploading-list.component.html',
                        styleUrls: ['./file-uploading-list.component.css']
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], FileUploadingListComponent);
                return FileUploadingListComponent;
            }());
            exports_1("FileUploadingListComponent", FileUploadingListComponent);
        }
    }
});
//# sourceMappingURL=file-uploading-list.component.js.map