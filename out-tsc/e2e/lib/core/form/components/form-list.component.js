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
var form_service_1 = require("./../services/form.service");
var FormListComponent = /** @class */ (function () {
    function FormListComponent(formService) {
        this.formService = formService;
        /** The array that contains the information to show inside the list. */
        this.forms = [];
    }
    FormListComponent.prototype.ngOnChanges = function (changes) {
        this.getForms();
    };
    FormListComponent.prototype.isEmpty = function () {
        return this.forms && this.forms.length === 0;
    };
    FormListComponent.prototype.getForms = function () {
        var _this = this;
        this.formService.getForms().subscribe(function (forms) {
            var _a;
            (_a = _this.forms).push.apply(_a, forms);
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], FormListComponent.prototype, "forms", void 0);
    FormListComponent = __decorate([
        core_1.Component({
            selector: 'adf-form-list',
            templateUrl: './form-list.component.html',
            styleUrls: ['./form-list.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [form_service_1.FormService])
    ], FormListComponent);
    return FormListComponent;
}());
exports.FormListComponent = FormListComponent;
//# sourceMappingURL=form-list.component.js.map