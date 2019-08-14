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
var material_module_1 = require("../material.module");
var sidenav_layout_content_directive_1 = require("./directives/sidenav-layout-content.directive");
var sidenav_layout_header_directive_1 = require("./directives/sidenav-layout-header.directive");
var sidenav_layout_navigation_directive_1 = require("./directives/sidenav-layout-navigation.directive");
var sidenav_layout_component_1 = require("./components/sidenav-layout/sidenav-layout.component");
var layout_container_component_1 = require("./components/layout-container/layout-container.component");
var sidebar_action_menu_component_1 = require("./components/sidebar-action/sidebar-action-menu.component");
var header_component_1 = require("./components/header/header.component");
var core_2 = require("@ngx-translate/core");
var LayoutModule = /** @class */ (function () {
    function LayoutModule() {
    }
    LayoutModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                material_module_1.MaterialModule,
                router_1.RouterModule,
                core_2.TranslateModule.forChild()
            ],
            exports: [
                sidenav_layout_header_directive_1.SidenavLayoutHeaderDirective,
                sidenav_layout_content_directive_1.SidenavLayoutContentDirective,
                sidenav_layout_navigation_directive_1.SidenavLayoutNavigationDirective,
                sidenav_layout_component_1.SidenavLayoutComponent,
                layout_container_component_1.LayoutContainerComponent,
                sidebar_action_menu_component_1.SidebarActionMenuComponent,
                sidebar_action_menu_component_1.SidebarMenuDirective,
                sidebar_action_menu_component_1.SidebarMenuExpandIconDirective,
                sidebar_action_menu_component_1.SidebarMenuTitleIconDirective,
                header_component_1.HeaderLayoutComponent
            ],
            declarations: [
                sidenav_layout_header_directive_1.SidenavLayoutHeaderDirective,
                sidenav_layout_content_directive_1.SidenavLayoutContentDirective,
                sidenav_layout_navigation_directive_1.SidenavLayoutNavigationDirective,
                sidenav_layout_component_1.SidenavLayoutComponent,
                layout_container_component_1.LayoutContainerComponent,
                sidebar_action_menu_component_1.SidebarActionMenuComponent,
                sidebar_action_menu_component_1.SidebarMenuDirective,
                sidebar_action_menu_component_1.SidebarMenuExpandIconDirective,
                sidebar_action_menu_component_1.SidebarMenuTitleIconDirective,
                header_component_1.HeaderLayoutComponent
            ]
        })
    ], LayoutModule);
    return LayoutModule;
}());
exports.LayoutModule = LayoutModule;
exports.SidenavLayoutModule = LayoutModule;
//# sourceMappingURL=layout.module.js.map