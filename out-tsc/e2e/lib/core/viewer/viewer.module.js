"use strict";
/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var core_2 = require("@ngx-translate/core");
var flex_layout_1 = require("@angular/flex-layout");
var forms_1 = require("@angular/forms");
var adf_extensions_1 = require("@alfresco/adf-extensions");
var material_module_1 = require("../material.module");
var toolbar_module_1 = require("../toolbar/toolbar.module");
var pipe_module_1 = require("../pipes/pipe.module");
var imgViewer_component_1 = require("./components/imgViewer.component");
var mediaPlayer_component_1 = require("./components/mediaPlayer.component");
var pdfViewer_component_1 = require("./components/pdfViewer.component");
var pdfViewer_password_dialog_1 = require("./components/pdfViewer-password-dialog");
var pdfViewer_thumb_component_1 = require("./components/pdfViewer-thumb.component");
var pdfViewer_thumbnails_component_1 = require("./components/pdfViewer-thumbnails.component");
var txtViewer_component_1 = require("./components/txtViewer.component");
var unknown_format_component_1 = require("./components/unknown-format/unknown-format.component");
var viewer_more_actions_component_1 = require("./components/viewer-more-actions.component");
var viewer_open_with_component_1 = require("./components/viewer-open-with.component");
var viewer_sidebar_component_1 = require("./components/viewer-sidebar.component");
var viewer_toolbar_component_1 = require("./components/viewer-toolbar.component");
var viewer_component_1 = require("./components/viewer.component");
var viewer_extension_directive_1 = require("./directives/viewer-extension.directive");
var viewer_toolbar_actions_component_1 = require("./components/viewer-toolbar-actions.component");
var directive_module_1 = require("../directives/directive.module");
var ViewerModule = /** @class */ (function () {
    function ViewerModule() {
    }
    ViewerModule = __decorate([
        core_1.NgModule({
            imports: [
                adf_extensions_1.ExtensionsModule,
                common_1.CommonModule,
                material_module_1.MaterialModule,
                core_2.TranslateModule.forChild(),
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                toolbar_module_1.ToolbarModule,
                pipe_module_1.PipeModule,
                flex_layout_1.FlexLayoutModule,
                directive_module_1.DirectiveModule
            ],
            declarations: [
                pdfViewer_password_dialog_1.PdfPasswordDialogComponent,
                viewer_component_1.ViewerComponent,
                imgViewer_component_1.ImgViewerComponent,
                txtViewer_component_1.TxtViewerComponent,
                mediaPlayer_component_1.MediaPlayerComponent,
                pdfViewer_component_1.PdfViewerComponent,
                pdfViewer_thumb_component_1.PdfThumbComponent,
                pdfViewer_thumbnails_component_1.PdfThumbListComponent,
                viewer_extension_directive_1.ViewerExtensionDirective,
                unknown_format_component_1.UnknownFormatComponent,
                viewer_toolbar_component_1.ViewerToolbarComponent,
                viewer_sidebar_component_1.ViewerSidebarComponent,
                viewer_open_with_component_1.ViewerOpenWithComponent,
                viewer_more_actions_component_1.ViewerMoreActionsComponent,
                viewer_toolbar_actions_component_1.ViewerToolbarActionsComponent
            ],
            entryComponents: [
                pdfViewer_password_dialog_1.PdfPasswordDialogComponent
            ],
            exports: [
                viewer_component_1.ViewerComponent,
                imgViewer_component_1.ImgViewerComponent,
                txtViewer_component_1.TxtViewerComponent,
                mediaPlayer_component_1.MediaPlayerComponent,
                pdfViewer_component_1.PdfViewerComponent,
                pdfViewer_password_dialog_1.PdfPasswordDialogComponent,
                pdfViewer_thumb_component_1.PdfThumbComponent,
                pdfViewer_thumbnails_component_1.PdfThumbListComponent,
                viewer_extension_directive_1.ViewerExtensionDirective,
                unknown_format_component_1.UnknownFormatComponent,
                viewer_toolbar_component_1.ViewerToolbarComponent,
                viewer_sidebar_component_1.ViewerSidebarComponent,
                viewer_open_with_component_1.ViewerOpenWithComponent,
                viewer_more_actions_component_1.ViewerMoreActionsComponent,
                viewer_toolbar_actions_component_1.ViewerToolbarActionsComponent
            ]
        })
    ], ViewerModule);
    return ViewerModule;
}());
exports.ViewerModule = ViewerModule;
//# sourceMappingURL=viewer.module.js.map