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
var router_1 = require("@angular/router");
var core_2 = require("@ngx-translate/core");
var material_module_1 = require("../material.module");
var context_menu_module_1 = require("../context-menu/context-menu.module");
var pipe_module_1 = require("../pipes/pipe.module");
var directive_module_1 = require("../directives/directive.module");
var datatable_cell_component_1 = require("./components/datatable/datatable-cell.component");
var datatable_component_1 = require("./components/datatable/datatable.component");
var date_cell_component_1 = require("./components/datatable/date-cell.component");
var empty_list_component_1 = require("./components/datatable/empty-list.component");
var filesize_cell_component_1 = require("./components/datatable/filesize-cell.component");
var location_cell_component_1 = require("./components/datatable/location-cell.component");
var loading_template_directive_1 = require("./directives/loading-template.directive");
var no_content_template_directive_1 = require("./directives/no-content-template.directive");
var no_permission_template_directive_1 = require("./directives/no-permission-template.directive");
var custom_empty_content_template_directive_1 = require("./directives/custom-empty-content-template.directive");
var custom_loading_template_directive_1 = require("./directives/custom-loading-template.directive");
var custom_no_permission_template_directive_1 = require("./directives/custom-no-permission-template.directive");
var json_cell_component_1 = require("./components/datatable/json-cell.component");
var clipboard_module_1 = require("../clipboard/clipboard.module");
var drop_zone_directive_1 = require("./components/datatable/drop-zone.directive");
var DataTableModule = /** @class */ (function () {
    function DataTableModule() {
    }
    DataTableModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule,
                material_module_1.MaterialModule,
                common_1.CommonModule,
                core_2.TranslateModule.forChild(),
                context_menu_module_1.ContextMenuModule,
                pipe_module_1.PipeModule,
                directive_module_1.DirectiveModule,
                clipboard_module_1.ClipboardModule
            ],
            declarations: [
                datatable_component_1.DataTableComponent,
                empty_list_component_1.EmptyListComponent,
                empty_list_component_1.EmptyListHeaderDirective,
                empty_list_component_1.EmptyListBodyDirective,
                empty_list_component_1.EmptyListFooterDirective,
                datatable_cell_component_1.DataTableCellComponent,
                date_cell_component_1.DateCellComponent,
                filesize_cell_component_1.FileSizeCellComponent,
                location_cell_component_1.LocationCellComponent,
                json_cell_component_1.JsonCellComponent,
                no_content_template_directive_1.NoContentTemplateDirective,
                no_permission_template_directive_1.NoPermissionTemplateDirective,
                loading_template_directive_1.LoadingContentTemplateDirective,
                custom_empty_content_template_directive_1.CustomEmptyContentTemplateDirective,
                custom_loading_template_directive_1.CustomLoadingContentTemplateDirective,
                custom_no_permission_template_directive_1.CustomNoPermissionTemplateDirective,
                drop_zone_directive_1.DropZoneDirective
            ],
            exports: [
                datatable_component_1.DataTableComponent,
                empty_list_component_1.EmptyListComponent,
                empty_list_component_1.EmptyListHeaderDirective,
                empty_list_component_1.EmptyListBodyDirective,
                empty_list_component_1.EmptyListFooterDirective,
                datatable_cell_component_1.DataTableCellComponent,
                date_cell_component_1.DateCellComponent,
                filesize_cell_component_1.FileSizeCellComponent,
                location_cell_component_1.LocationCellComponent,
                json_cell_component_1.JsonCellComponent,
                no_content_template_directive_1.NoContentTemplateDirective,
                no_permission_template_directive_1.NoPermissionTemplateDirective,
                loading_template_directive_1.LoadingContentTemplateDirective,
                custom_empty_content_template_directive_1.CustomEmptyContentTemplateDirective,
                custom_loading_template_directive_1.CustomLoadingContentTemplateDirective,
                custom_no_permission_template_directive_1.CustomNoPermissionTemplateDirective,
                drop_zone_directive_1.DropZoneDirective
            ]
        })
    ], DataTableModule);
    return DataTableModule;
}());
exports.DataTableModule = DataTableModule;
//# sourceMappingURL=datatable.module.js.map