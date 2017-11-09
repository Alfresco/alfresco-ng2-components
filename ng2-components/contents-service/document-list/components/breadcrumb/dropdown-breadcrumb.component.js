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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var breadcrumb_component_1 = require("./breadcrumb.component");
var DropdownBreadcrumbComponent = (function (_super) {
    __extends(DropdownBreadcrumbComponent, _super);
    function DropdownBreadcrumbComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DropdownBreadcrumbComponent.prototype.ngOnChanges = function (changes) {
        _super.prototype.ngOnChanges.call(this, changes);
        this.recalculateNodes();
    };
    /**
     * Calculate the current and previous nodes from the route array
     */
    DropdownBreadcrumbComponent.prototype.recalculateNodes = function () {
        this.currentNode = this.route[this.route.length - 1];
        this.previousNodes = this.route.slice(0, this.route.length - 1).reverse();
    };
    /**
     * Opens the selectbox overlay
     */
    DropdownBreadcrumbComponent.prototype.open = function () {
        if (this.selectbox) {
            this.selectbox.open();
        }
    };
    /**
     * Return if route has more than one element (means: we are not in the root directory)
     */
    DropdownBreadcrumbComponent.prototype.hasPreviousNodes = function () {
        return this.previousNodes.length > 0;
    };
    __decorate([
        core_1.ViewChild(material_1.MatSelect)
    ], DropdownBreadcrumbComponent.prototype, "selectbox", void 0);
    DropdownBreadcrumbComponent = __decorate([
        core_1.Component({
            selector: 'adf-dropdown-breadcrumb',
            templateUrl: './dropdown-breadcrumb.component.html',
            styleUrls: ['./dropdown-breadcrumb.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            host: {
                'class': 'adf-dropdown-breadcrumb'
            }
        })
    ], DropdownBreadcrumbComponent);
    return DropdownBreadcrumbComponent;
}(breadcrumb_component_1.BreadcrumbComponent));
exports.DropdownBreadcrumbComponent = DropdownBreadcrumbComponent;
