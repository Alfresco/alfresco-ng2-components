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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SidebarActionMenuComponent = /** @class */ (function () {
    function SidebarActionMenuComponent() {
        /** Width in pixels for sidebar action menu options. */
        this.width = 272;
    }
    SidebarActionMenuComponent.prototype.isExpanded = function () {
        return this.expanded;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], SidebarActionMenuComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], SidebarActionMenuComponent.prototype, "expanded", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], SidebarActionMenuComponent.prototype, "width", void 0);
    SidebarActionMenuComponent = __decorate([
        core_1.Component({
            selector: 'adf-sidebar-action-menu',
            templateUrl: './sidebar-action-menu.component.html',
            styleUrls: ['./sidebar-action-menu.component.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            encapsulation: core_1.ViewEncapsulation.None,
            host: { 'class': 'adf-sidebar-action-menu' }
        })
    ], SidebarActionMenuComponent);
    return SidebarActionMenuComponent;
}());
exports.SidebarActionMenuComponent = SidebarActionMenuComponent;
/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
var SidebarMenuDirective = /** @class */ (function () {
    function SidebarMenuDirective() {
    }
    SidebarMenuDirective = __decorate([
        core_1.Directive({ selector: '[adf-sidebar-menu-options], [sidebar-menu-options]' })
    ], SidebarMenuDirective);
    return SidebarMenuDirective;
}());
exports.SidebarMenuDirective = SidebarMenuDirective;
var SidebarMenuTitleIconDirective = /** @class */ (function () {
    function SidebarMenuTitleIconDirective() {
    }
    SidebarMenuTitleIconDirective = __decorate([
        core_1.Directive({ selector: '[adf-sidebar-menu-title-icon], [sidebar-menu-title-icon]' })
    ], SidebarMenuTitleIconDirective);
    return SidebarMenuTitleIconDirective;
}());
exports.SidebarMenuTitleIconDirective = SidebarMenuTitleIconDirective;
var SidebarMenuExpandIconDirective = /** @class */ (function () {
    function SidebarMenuExpandIconDirective() {
    }
    SidebarMenuExpandIconDirective = __decorate([
        core_1.Directive({ selector: '[adf-sidebar-menu-expand-icon], [sidebar-menu-expand-icon]' })
    ], SidebarMenuExpandIconDirective);
    return SidebarMenuExpandIconDirective;
}());
exports.SidebarMenuExpandIconDirective = SidebarMenuExpandIconDirective;
//# sourceMappingURL=sidebar-action-menu.component.js.map