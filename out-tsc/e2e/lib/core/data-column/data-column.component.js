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
/* tslint:disable:component-selector no-input-rename  */
var core_1 = require("@angular/core");
var DataColumnComponent = /** @class */ (function () {
    function DataColumnComponent() {
        /** Value type for the column. Possible settings are 'text', 'image',
         * 'date', 'fileSize', 'location', and 'json'.
         */
        this.type = 'text';
        /** Toggles ability to sort by this column, for example by clicking the column header. */
        this.sortable = true;
        /** Display title of the column, typically used for column headers. You can use the
         * i18n resource key to get it translated automatically.
         */
        this.title = '';
    }
    DataColumnComponent.prototype.ngOnInit = function () {
        if (!this.srTitle && this.key === '$thumbnail') {
            this.srTitle = 'Thumbnail';
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataColumnComponent.prototype, "key", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataColumnComponent.prototype, "type", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataColumnComponent.prototype, "format", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], DataColumnComponent.prototype, "sortable", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataColumnComponent.prototype, "title", void 0);
    __decorate([
        core_1.ContentChild(core_1.TemplateRef),
        __metadata("design:type", Object)
    ], DataColumnComponent.prototype, "template", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Function)
    ], DataColumnComponent.prototype, "formatTooltip", void 0);
    __decorate([
        core_1.Input('sr-title'),
        __metadata("design:type", String)
    ], DataColumnComponent.prototype, "srTitle", void 0);
    __decorate([
        core_1.Input('class'),
        __metadata("design:type", String)
    ], DataColumnComponent.prototype, "cssClass", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], DataColumnComponent.prototype, "copyContent", void 0);
    DataColumnComponent = __decorate([
        core_1.Component({
            selector: 'data-column',
            template: ''
        })
    ], DataColumnComponent);
    return DataColumnComponent;
}());
exports.DataColumnComponent = DataColumnComponent;
//# sourceMappingURL=data-column.component.js.map