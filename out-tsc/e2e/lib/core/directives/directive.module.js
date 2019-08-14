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
var material_module_1 = require("../material.module");
var highlight_directive_1 = require("./highlight.directive");
var logout_directive_1 = require("./logout.directive");
var node_delete_directive_1 = require("./node-delete.directive");
var node_favorite_directive_1 = require("./node-favorite.directive");
var check_allowable_operation_directive_1 = require("./check-allowable-operation.directive");
var node_restore_directive_1 = require("./node-restore.directive");
var upload_directive_1 = require("./upload.directive");
var node_download_directive_1 = require("./node-download.directive");
var DirectiveModule = /** @class */ (function () {
    function DirectiveModule() {
    }
    DirectiveModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                material_module_1.MaterialModule
            ],
            declarations: [
                highlight_directive_1.HighlightDirective,
                logout_directive_1.LogoutDirective,
                node_delete_directive_1.NodeDeleteDirective,
                node_favorite_directive_1.NodeFavoriteDirective,
                check_allowable_operation_directive_1.CheckAllowableOperationDirective,
                node_restore_directive_1.NodeRestoreDirective,
                node_download_directive_1.NodeDownloadDirective,
                upload_directive_1.UploadDirective
            ],
            exports: [
                highlight_directive_1.HighlightDirective,
                logout_directive_1.LogoutDirective,
                node_delete_directive_1.NodeDeleteDirective,
                node_favorite_directive_1.NodeFavoriteDirective,
                check_allowable_operation_directive_1.CheckAllowableOperationDirective,
                node_restore_directive_1.NodeRestoreDirective,
                node_download_directive_1.NodeDownloadDirective,
                upload_directive_1.UploadDirective
            ]
        })
    ], DirectiveModule);
    return DirectiveModule;
}());
exports.DirectiveModule = DirectiveModule;
//# sourceMappingURL=directive.module.js.map