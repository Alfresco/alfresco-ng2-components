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
var EmptyListComponent = (function () {
    function EmptyListComponent() {
    }
    EmptyListComponent = __decorate([
        core_1.Component({
            selector: 'adf-empty-list',
            styleUrls: ['./empty-list.component.scss'],
            templateUrl: './empty-list.component.html',
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], EmptyListComponent);
    return EmptyListComponent;
}());
exports.EmptyListComponent = EmptyListComponent;
var EmptyListHeaderDirective = (function () {
    function EmptyListHeaderDirective() {
    }
    EmptyListHeaderDirective = __decorate([
        core_1.Directive({ selector: '[adf-empty-list-header]' })
    ], EmptyListHeaderDirective);
    return EmptyListHeaderDirective;
}());
exports.EmptyListHeaderDirective = EmptyListHeaderDirective;
var EmptyListBodyDirective = (function () {
    function EmptyListBodyDirective() {
    }
    EmptyListBodyDirective = __decorate([
        core_1.Directive({ selector: '[adf-empty-list-body]' })
    ], EmptyListBodyDirective);
    return EmptyListBodyDirective;
}());
exports.EmptyListBodyDirective = EmptyListBodyDirective;
var EmptyListFooterDirective = (function () {
    function EmptyListFooterDirective() {
    }
    EmptyListFooterDirective = __decorate([
        core_1.Directive({ selector: '[adf-empty-list-footer]' })
    ], EmptyListFooterDirective);
    return EmptyListFooterDirective;
}());
exports.EmptyListFooterDirective = EmptyListFooterDirective;
