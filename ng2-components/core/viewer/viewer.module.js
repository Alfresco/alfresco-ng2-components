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
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var material_module_1 = require("./material.module");
var imgViewer_component_1 = require("./components/imgViewer.component");
var mediaPlayer_component_1 = require("./components/mediaPlayer.component");
var pdfViewer_component_1 = require("./components/pdfViewer.component");
var txtViewer_component_1 = require("./components/txtViewer.component");
var unknown_format_component_1 = require("./components/unknown-format/unknown-format.component");
var viewer_more_actions_component_1 = require("./components/viewer-more-actions.component");
var viewer_open_with_component_1 = require("./components/viewer-open-with.component");
var viewer_sidebar_component_1 = require("./components/viewer-sidebar.component");
var viewer_toolbar_component_1 = require("./components/viewer-toolbar.component");
var viewer_component_1 = require("./components/viewer.component");
var viewer_extension_directive_1 = require("./directives/viewer-extension.directive");
var rendering_queue_services_1 = require("./services/rendering-queue.services");
function declarations() {
    return [
        viewer_component_1.ViewerComponent,
        imgViewer_component_1.ImgViewerComponent,
        txtViewer_component_1.TxtViewerComponent,
        mediaPlayer_component_1.MediaPlayerComponent,
        pdfViewer_component_1.PdfViewerComponent,
        viewer_extension_directive_1.ViewerExtensionDirective,
        unknown_format_component_1.UnknownFormatComponent,
        viewer_toolbar_component_1.ViewerToolbarComponent,
        viewer_sidebar_component_1.ViewerSidebarComponent,
        viewer_open_with_component_1.ViewerOpenWithComponent,
        viewer_more_actions_component_1.ViewerMoreActionsComponent
    ];
}
exports.declarations = declarations;
var ViewerModule = (function () {
    function ViewerModule() {
    }
    ViewerModule = __decorate([
        core_1.NgModule({
            imports: [
                ng2_alfresco_core_1.CoreModule,
                material_module_1.MaterialModule
            ],
            declarations: [
                viewer_component_1.ViewerComponent,
                imgViewer_component_1.ImgViewerComponent,
                txtViewer_component_1.TxtViewerComponent,
                mediaPlayer_component_1.MediaPlayerComponent,
                pdfViewer_component_1.PdfViewerComponent,
                viewer_extension_directive_1.ViewerExtensionDirective,
                unknown_format_component_1.UnknownFormatComponent,
                viewer_toolbar_component_1.ViewerToolbarComponent,
                viewer_sidebar_component_1.ViewerSidebarComponent,
                viewer_open_with_component_1.ViewerOpenWithComponent,
                viewer_more_actions_component_1.ViewerMoreActionsComponent
            ],
            providers: [
                rendering_queue_services_1.RenderingQueueServices,
                {
                    provide: ng2_alfresco_core_1.TRANSLATION_PROVIDER,
                    multi: true,
                    useValue: {
                        name: 'ng2-alfresco-viewer',
                        source: 'assets/ng2-alfresco-viewer'
                    }
                }
            ],
            exports: [
                viewer_component_1.ViewerComponent,
                imgViewer_component_1.ImgViewerComponent,
                txtViewer_component_1.TxtViewerComponent,
                mediaPlayer_component_1.MediaPlayerComponent,
                pdfViewer_component_1.PdfViewerComponent,
                viewer_extension_directive_1.ViewerExtensionDirective,
                unknown_format_component_1.UnknownFormatComponent,
                viewer_toolbar_component_1.ViewerToolbarComponent,
                viewer_sidebar_component_1.ViewerSidebarComponent,
                viewer_open_with_component_1.ViewerOpenWithComponent,
                viewer_more_actions_component_1.ViewerMoreActionsComponent
            ]
        })
    ], ViewerModule);
    return ViewerModule;
}());
exports.ViewerModule = ViewerModule;
