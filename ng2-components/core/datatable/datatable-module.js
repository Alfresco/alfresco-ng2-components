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
var router_1 = require("@angular/router");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var material_module_1 = require("../material.module");
var datatable_cell_component_1 = require("./components/datatable/datatable-cell.component");
var datatable_component_1 = require("./components/datatable/datatable.component");
var date_cell_component_1 = require("./components/datatable/date-cell.component");
var empty_list_component_1 = require("./components/datatable/empty-list.component");
var filesize_cell_component_1 = require("./components/datatable/filesize-cell.component");
var location_cell_component_1 = require("./components/datatable/location-cell.component");
var loading_template_directive_1 = require("./directives/loading-template.directive");
var no_content_template_directive_1 = require("./directives/no-content-template.directive");
var no_permission_template_directive_1 = require("./directives/no-permission-template.directive");
var DataTableModule = (function () {
    function DataTableModule() {
    }
    DataTableModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule,
                ng2_alfresco_core_1.CoreModule,
                material_module_1.MaterialModule
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
                no_content_template_directive_1.NoContentTemplateDirective,
                no_permission_template_directive_1.NoPermissionTemplateDirective,
                loading_template_directive_1.LoadingContentTemplateDirective
            ],
            providers: [
                {
                    provide: ng2_alfresco_core_1.TRANSLATION_PROVIDER,
                    multi: true,
                    useValue: {
                        name: 'ng2-alfresco-datatable',
                        source: 'assets/ng2-alfresco-datatable'
                    }
                }
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
                no_content_template_directive_1.NoContentTemplateDirective,
                no_permission_template_directive_1.NoPermissionTemplateDirective,
                loading_template_directive_1.LoadingContentTemplateDirective
            ]
        })
    ], DataTableModule);
    return DataTableModule;
}());
exports.DataTableModule = DataTableModule;
