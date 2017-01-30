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
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("@angular/core");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var upload_drag_area_component_1 = require("./src/components/upload-drag-area.component");
var file_draggable_directive_1 = require("./src/directives/file-draggable.directive");
var upload_button_component_1 = require("./src/components/upload-button.component");
var file_uploading_dialog_component_1 = require("./src/components/file-uploading-dialog.component");
var file_uploading_list_component_1 = require("./src/components/file-uploading-list.component");
var upload_service_1 = require("./src/services/upload.service");
__export(require("./src/components/upload-button.component"));
__export(require("./src/components/file-uploading-dialog.component"));
__export(require("./src/components/upload-drag-area.component"));
__export(require("./src/services/upload.service"));
__export(require("./src/directives/file-draggable.directive"));
__export(require("./src/components/file-uploading-list.component"));
exports.UPLOAD_DIRECTIVES = [
    file_draggable_directive_1.FileDraggableDirective,
    upload_drag_area_component_1.UploadDragAreaComponent,
    upload_button_component_1.UploadButtonComponent,
    file_uploading_dialog_component_1.FileUploadingDialogComponent,
    file_uploading_list_component_1.FileUploadingListComponent
];
exports.UPLOAD_PROVIDERS = [
    upload_service_1.UploadService
];
var UploadModule = UploadModule_1 = (function () {
    function UploadModule() {
    }
    UploadModule.forRoot = function () {
        return {
            ngModule: UploadModule_1,
            providers: exports.UPLOAD_PROVIDERS.slice()
        };
    };
    return UploadModule;
}());
UploadModule = UploadModule_1 = __decorate([
    core_1.NgModule({
        imports: [
            ng2_alfresco_core_1.CoreModule
        ],
        declarations: exports.UPLOAD_DIRECTIVES.slice(),
        providers: exports.UPLOAD_PROVIDERS.slice(),
        exports: exports.UPLOAD_DIRECTIVES.slice()
    }),
    __metadata("design:paramtypes", [])
], UploadModule);
exports.UploadModule = UploadModule;
var UploadModule_1;
//# sourceMappingURL=index.js.map