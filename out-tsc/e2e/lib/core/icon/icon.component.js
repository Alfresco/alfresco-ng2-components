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
var IconComponent = /** @class */ (function () {
    function IconComponent() {
        this._value = '';
        this._isCustom = false;
    }
    Object.defineProperty(IconComponent.prototype, "value", {
        get: function () {
            return this._value;
        },
        /** Icon value, which can be either a ligature name or a custom icon in the format `[namespace]:[name]`. */
        set: function (value) {
            this._value = value || 'settings';
            this._isCustom = this._value.includes(':');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IconComponent.prototype, "isCustom", {
        get: function () {
            return this._isCustom;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], IconComponent.prototype, "color", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], IconComponent.prototype, "value", null);
    IconComponent = __decorate([
        core_1.Component({
            selector: 'adf-icon',
            templateUrl: './icon.component.html',
            styleUrls: ['./icon.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            host: { class: 'adf-icon' }
        })
    ], IconComponent);
    return IconComponent;
}());
exports.IconComponent = IconComponent;
//# sourceMappingURL=icon.component.js.map