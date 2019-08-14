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
var material_1 = require("@angular/material");
var ButtonsMenuComponent = /** @class */ (function () {
    function ButtonsMenuComponent() {
    }
    ButtonsMenuComponent.prototype.ngAfterContentInit = function () {
        if (this.buttons.length > 0) {
            this.isMenuEmpty = false;
        }
        else {
            this.isMenuEmpty = true;
        }
    };
    ButtonsMenuComponent.prototype.isMobile = function () {
        return !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    __decorate([
        core_1.ContentChildren(material_1.MatMenuItem),
        __metadata("design:type", core_1.QueryList)
    ], ButtonsMenuComponent.prototype, "buttons", void 0);
    ButtonsMenuComponent = __decorate([
        core_1.Component({
            selector: 'adf-buttons-action-menu',
            templateUrl: './buttons-menu.component.html',
            styleUrls: ['./buttons-menu.component.scss']
        })
    ], ButtonsMenuComponent);
    return ButtonsMenuComponent;
}());
exports.ButtonsMenuComponent = ButtonsMenuComponent;
//# sourceMappingURL=buttons-menu.component.js.map