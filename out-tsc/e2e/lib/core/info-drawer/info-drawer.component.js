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
var InfoDrawerTabComponent = /** @class */ (function () {
    function InfoDrawerTabComponent() {
        /** The title of the tab (string or translation key). */
        this.label = '';
        /** Icon to render for the tab. */
        this.icon = null;
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], InfoDrawerTabComponent.prototype, "label", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], InfoDrawerTabComponent.prototype, "icon", void 0);
    __decorate([
        core_1.ViewChild(core_1.TemplateRef),
        __metadata("design:type", core_1.TemplateRef)
    ], InfoDrawerTabComponent.prototype, "content", void 0);
    InfoDrawerTabComponent = __decorate([
        core_1.Component({
            selector: 'adf-info-drawer-tab',
            template: '<ng-template><ng-content></ng-content></ng-template>'
        })
    ], InfoDrawerTabComponent);
    return InfoDrawerTabComponent;
}());
exports.InfoDrawerTabComponent = InfoDrawerTabComponent;
var InfoDrawerComponent = /** @class */ (function () {
    function InfoDrawerComponent() {
        /** The title of the info drawer (string or translation key). */
        this.title = null;
        /** The selected index tab. */
        this.selectedIndex = 0;
        /** Emitted when the currently active tab changes. */
        this.currentTab = new core_1.EventEmitter();
    }
    InfoDrawerComponent.prototype.showTabLayout = function () {
        return this.contentBlocks.length > 0;
    };
    InfoDrawerComponent.prototype.onTabChange = function (event) {
        this.currentTab.emit(event.index);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], InfoDrawerComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], InfoDrawerComponent.prototype, "selectedIndex", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], InfoDrawerComponent.prototype, "currentTab", void 0);
    __decorate([
        core_1.ContentChildren(InfoDrawerTabComponent),
        __metadata("design:type", core_1.QueryList)
    ], InfoDrawerComponent.prototype, "contentBlocks", void 0);
    InfoDrawerComponent = __decorate([
        core_1.Component({
            selector: 'adf-info-drawer',
            templateUrl: './info-drawer.component.html',
            styleUrls: ['./info-drawer.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            host: { 'class': 'adf-info-drawer' }
        })
    ], InfoDrawerComponent);
    return InfoDrawerComponent;
}());
exports.InfoDrawerComponent = InfoDrawerComponent;
//# sourceMappingURL=info-drawer.component.js.map