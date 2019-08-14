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
var HeaderLayoutComponent = /** @class */ (function () {
    function HeaderLayoutComponent() {
        /** The router link for the application logo, when clicked. */
        this.redirectUrl = '/';
        /**
         * Toggles whether the sidenav button will be displayed in the header
         * or not.
         */
        this.showSidenavToggle = true;
        /** Emitted when the sidenav button is clicked. */
        this.clicked = new core_1.EventEmitter();
        /** The side of the page that the drawer is attached to (can be 'start' or 'end') */
        this.position = 'start';
    }
    HeaderLayoutComponent.prototype.toggleMenu = function () {
        this.clicked.emit(true);
    };
    HeaderLayoutComponent.prototype.ngOnInit = function () {
        if (!this.logo) {
            this.logo = './assets/images/logo.png';
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], HeaderLayoutComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], HeaderLayoutComponent.prototype, "logo", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], HeaderLayoutComponent.prototype, "redirectUrl", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], HeaderLayoutComponent.prototype, "tooltip", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], HeaderLayoutComponent.prototype, "color", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], HeaderLayoutComponent.prototype, "showSidenavToggle", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], HeaderLayoutComponent.prototype, "clicked", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], HeaderLayoutComponent.prototype, "position", void 0);
    HeaderLayoutComponent = __decorate([
        core_1.Component({
            selector: 'adf-layout-header',
            templateUrl: './header.component.html',
            encapsulation: core_1.ViewEncapsulation.None,
            host: { class: 'adf-layout-header' }
        })
    ], HeaderLayoutComponent);
    return HeaderLayoutComponent;
}());
exports.HeaderLayoutComponent = HeaderLayoutComponent;
//# sourceMappingURL=header.component.js.map