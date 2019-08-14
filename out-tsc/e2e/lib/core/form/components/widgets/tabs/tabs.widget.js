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
/* tslint:disable:component-selector  */
var core_1 = require("@angular/core");
var TabsWidgetComponent = /** @class */ (function () {
    function TabsWidgetComponent() {
        this.tabs = [];
        this.formTabChanged = new core_1.EventEmitter();
        this.visibleTabs = [];
    }
    TabsWidgetComponent.prototype.hasTabs = function () {
        return this.tabs && this.tabs.length > 0;
    };
    TabsWidgetComponent.prototype.ngAfterContentChecked = function () {
        this.filterVisibleTabs();
    };
    TabsWidgetComponent.prototype.filterVisibleTabs = function () {
        this.visibleTabs = this.tabs.filter(function (tab) {
            return tab.isVisible;
        });
    };
    TabsWidgetComponent.prototype.tabChanged = function (field) {
        this.formTabChanged.emit(field);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], TabsWidgetComponent.prototype, "tabs", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], TabsWidgetComponent.prototype, "formTabChanged", void 0);
    TabsWidgetComponent = __decorate([
        core_1.Component({
            selector: 'tabs-widget',
            templateUrl: './tabs.widget.html',
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TabsWidgetComponent);
    return TabsWidgetComponent;
}());
exports.TabsWidgetComponent = TabsWidgetComponent;
//# sourceMappingURL=tabs.widget.js.map