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
var flex_layout_1 = require("@angular/flex-layout");
var material_module_1 = require("../material.module");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var ng2_alfresco_datatable_1 = require("ng2-alfresco-datatable");
var ng2_alfresco_upload_1 = require("ng2-alfresco-upload");
var breadcrumb_component_1 = require("./components/breadcrumb/breadcrumb.component");
var dropdown_breadcrumb_component_1 = require("./components/breadcrumb/dropdown-breadcrumb.component");
var content_action_list_component_1 = require("./components/content-action/content-action-list.component");
var content_action_component_1 = require("./components/content-action/content-action.component");
var content_column_list_component_1 = require("./components/content-column/content-column-list.component");
var content_column_component_1 = require("./components/content-column/content-column.component");
var content_node_selector_component_1 = require("./components/content-node-selector/content-node-selector.component");
var document_list_component_1 = require("./components/document-list.component");
var empty_folder_content_directive_1 = require("./components/empty-folder/empty-folder-content.directive");
var no_permission_content_directive_1 = require("./components/no-permission/no-permission-content.directive");
var sites_dropdown_component_1 = require("./components/site-dropdown/sites-dropdown.component");
var version_list_component_1 = require("./components/version-manager/version-list.component");
var version_manager_component_1 = require("./components/version-manager/version-manager.component");
var version_upload_component_1 = require("./components/version-manager/version-upload.component");
var content_node_selector_service_1 = require("./components/content-node-selector/content-node-selector.service");
var document_actions_service_1 = require("./services/document-actions.service");
var document_list_service_1 = require("./services/document-list.service");
var folder_actions_service_1 = require("./services/folder-actions.service");
var node_actions_service_1 = require("./services/node-actions.service");
var DocumentListModule = (function () {
    function DocumentListModule() {
    }
    DocumentListModule = __decorate([
        core_1.NgModule({
            imports: [
                ng2_alfresco_core_1.CoreModule,
                ng2_alfresco_upload_1.UploadModule,
                ng2_alfresco_datatable_1.DataTableModule,
                flex_layout_1.FlexLayoutModule,
                material_module_1.MaterialModule
            ],
            declarations: [
                document_list_component_1.DocumentListComponent,
                content_column_component_1.ContentColumnComponent,
                content_column_list_component_1.ContentColumnListComponent,
                content_action_component_1.ContentActionComponent,
                content_action_list_component_1.ContentActionListComponent,
                empty_folder_content_directive_1.EmptyFolderContentDirective,
                no_permission_content_directive_1.NoPermissionContentDirective,
                breadcrumb_component_1.BreadcrumbComponent,
                sites_dropdown_component_1.DropdownSitesComponent,
                dropdown_breadcrumb_component_1.DropdownBreadcrumbComponent,
                content_node_selector_component_1.ContentNodeSelectorComponent,
                version_list_component_1.VersionListComponent,
                version_upload_component_1.VersionUploadComponent,
                version_manager_component_1.VersionManagerComponent
            ],
            providers: [
                document_list_service_1.DocumentListService,
                folder_actions_service_1.FolderActionsService,
                document_actions_service_1.DocumentActionsService,
                node_actions_service_1.NodeActionsService,
                content_node_selector_service_1.ContentNodeSelectorService,
                {
                    provide: ng2_alfresco_core_1.TRANSLATION_PROVIDER,
                    multi: true,
                    useValue: {
                        name: 'ng2-alfresco-documentlist',
                        source: 'assets/ng2-alfresco-documentlist'
                    }
                }
            ],
            entryComponents: [
                content_node_selector_component_1.ContentNodeSelectorComponent
            ],
            exports: [
                document_list_component_1.DocumentListComponent,
                content_column_component_1.ContentColumnComponent,
                content_column_list_component_1.ContentColumnListComponent,
                content_action_component_1.ContentActionComponent,
                content_action_list_component_1.ContentActionListComponent,
                empty_folder_content_directive_1.EmptyFolderContentDirective,
                no_permission_content_directive_1.NoPermissionContentDirective,
                breadcrumb_component_1.BreadcrumbComponent,
                sites_dropdown_component_1.DropdownSitesComponent,
                dropdown_breadcrumb_component_1.DropdownBreadcrumbComponent,
                content_node_selector_component_1.ContentNodeSelectorComponent,
                version_list_component_1.VersionListComponent,
                version_upload_component_1.VersionUploadComponent,
                version_manager_component_1.VersionManagerComponent
            ]
        })
    ], DocumentListModule);
    return DocumentListModule;
}());
exports.DocumentListModule = DocumentListModule;
