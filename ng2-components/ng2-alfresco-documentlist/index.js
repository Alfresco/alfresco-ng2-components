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
var ng2_alfresco_datatable_1 = require("ng2-alfresco-datatable");
var document_list_1 = require("./src/components/document-list");
var document_menu_action_1 = require("./src/components/document-menu-action");
var content_column_1 = require("./src/components/content-column");
var content_column_list_1 = require("./src/components/content-column-list");
var content_action_1 = require("./src/components/content-action");
var content_action_list_1 = require("./src/components/content-action-list");
var empty_folder_content_1 = require("./src/components/empty-folder-content");
var breadcrumb_component_1 = require("./src/components/breadcrumb/breadcrumb.component");
var folder_actions_service_1 = require("./src/services/folder-actions.service");
var document_actions_service_1 = require("./src/services/document-actions.service");
var document_list_service_1 = require("./src/services/document-list.service");
__export(require("./src/components/document-list"));
__export(require("./src/components/content-column"));
__export(require("./src/components/content-column-list"));
__export(require("./src/components/content-action"));
__export(require("./src/components/content-action-list"));
__export(require("./src/components/empty-folder-content"));
__export(require("./src/components/breadcrumb/breadcrumb.component"));
__export(require("./src/data/share-datatable-adapter"));
__export(require("./src/services/folder-actions.service"));
__export(require("./src/services/document-actions.service"));
__export(require("./src/services/document-list.service"));
__export(require("./src/models/content-action.model"));
__export(require("./src/models/document-library.model"));
exports.DOCUMENT_LIST_DIRECTIVES = [
    document_list_1.DocumentList,
    document_menu_action_1.DocumentMenuAction,
    content_column_1.ContentColumn,
    content_column_list_1.ContentColumnList,
    content_action_1.ContentAction,
    content_action_list_1.ContentActionList,
    empty_folder_content_1.EmptyFolderContent,
    breadcrumb_component_1.DocumentListBreadcrumb
];
exports.DOCUMENT_LIST_PROVIDERS = [
    document_list_service_1.DocumentListService,
    folder_actions_service_1.FolderActionsService,
    document_actions_service_1.DocumentActionsService
];
var DocumentListModule = DocumentListModule_1 = (function () {
    function DocumentListModule() {
    }
    DocumentListModule.forRoot = function () {
        return {
            ngModule: DocumentListModule_1,
            providers: exports.DOCUMENT_LIST_PROVIDERS.slice()
        };
    };
    return DocumentListModule;
}());
DocumentListModule = DocumentListModule_1 = __decorate([
    core_1.NgModule({
        imports: [
            ng2_alfresco_core_1.CoreModule,
            ng2_alfresco_datatable_1.DataTableModule
        ],
        declarations: exports.DOCUMENT_LIST_DIRECTIVES.slice(),
        providers: exports.DOCUMENT_LIST_PROVIDERS.slice(),
        exports: [
            ng2_alfresco_datatable_1.DataTableModule
        ].concat(exports.DOCUMENT_LIST_DIRECTIVES)
    }),
    __metadata("design:paramtypes", [])
], DocumentListModule);
exports.DocumentListModule = DocumentListModule;
var DocumentListModule_1;
//# sourceMappingURL=index.js.map