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
var EmptyContentComponent = /** @class */ (function () {
    function EmptyContentComponent() {
        /** Material Icon to use. */
        this.icon = 'cake';
        /** String or Resource Key for the title. */
        this.title = '';
        /** String or Resource Key for the subtitle. */
        this.subtitle = '';
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], EmptyContentComponent.prototype, "icon", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], EmptyContentComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], EmptyContentComponent.prototype, "subtitle", void 0);
    EmptyContentComponent = __decorate([
        core_1.Component({
            selector: 'adf-empty-content',
            templateUrl: './empty-content.component.html',
            styleUrls: ['./empty-content.component.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            encapsulation: core_1.ViewEncapsulation.None,
            host: { class: 'adf-empty-content' }
        })
    ], EmptyContentComponent);
    return EmptyContentComponent;
}());
exports.EmptyContentComponent = EmptyContentComponent;
//# sourceMappingURL=empty-content.component.js.map