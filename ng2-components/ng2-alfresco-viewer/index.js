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
var viewer_component_1 = require("./src/componets/viewer.component");
var rendering_queue_services_1 = require("./src/services/rendering-queue.services");
var imgViewer_component_1 = require("./src/componets/imgViewer.component");
var mediaPlayer_component_1 = require("./src/componets/mediaPlayer.component");
var notSupportedFormat_component_1 = require("./src/componets/notSupportedFormat.component");
var pdfViewer_component_1 = require("./src/componets/pdfViewer.component");
__export(require("./src/componets/viewer.component"));
__export(require("./src/services/rendering-queue.services"));
__export(require("./src/componets/imgViewer.component"));
__export(require("./src/componets/mediaPlayer.component"));
__export(require("./src/componets/notSupportedFormat.component"));
__export(require("./src/componets/pdfViewer.component"));
exports.VIEWER_DIRECTIVES = [
    viewer_component_1.ViewerComponent,
    imgViewer_component_1.ImgViewerComponent,
    mediaPlayer_component_1.MediaPlayerComponent,
    notSupportedFormat_component_1.NotSupportedFormat,
    pdfViewer_component_1.PdfViewerComponent
];
exports.VIEWER_PROVIDERS = [
    rendering_queue_services_1.RenderingQueueServices
];
var ViewerModule = ViewerModule_1 = (function () {
    function ViewerModule() {
    }
    ViewerModule.forRoot = function () {
        return {
            ngModule: ViewerModule_1,
            providers: exports.VIEWER_PROVIDERS.slice()
        };
    };
    return ViewerModule;
}());
ViewerModule = ViewerModule_1 = __decorate([
    core_1.NgModule({
        imports: [
            ng2_alfresco_core_1.CoreModule
        ],
        declarations: exports.VIEWER_DIRECTIVES.slice(),
        providers: exports.VIEWER_PROVIDERS.slice(),
        exports: exports.VIEWER_DIRECTIVES.slice()
    }),
    __metadata("design:paramtypes", [])
], ViewerModule);
exports.ViewerModule = ViewerModule;
var ViewerModule_1;
//# sourceMappingURL=index.js.map