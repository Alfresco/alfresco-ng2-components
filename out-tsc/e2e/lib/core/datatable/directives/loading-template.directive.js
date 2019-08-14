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
var datatable_component_1 = require("../components/datatable/datatable.component");
/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
var LoadingContentTemplateDirective = /** @class */ (function () {
    function LoadingContentTemplateDirective(dataTable) {
        this.dataTable = dataTable;
    }
    LoadingContentTemplateDirective.prototype.ngAfterContentInit = function () {
        if (this.dataTable) {
            this.dataTable.loadingTemplate = this.template;
        }
    };
    __decorate([
        core_1.ContentChild(core_1.TemplateRef),
        __metadata("design:type", Object)
    ], LoadingContentTemplateDirective.prototype, "template", void 0);
    LoadingContentTemplateDirective = __decorate([
        core_1.Directive({
            selector: 'adf-loading-content-template, loading-content-template'
        }),
        __metadata("design:paramtypes", [datatable_component_1.DataTableComponent])
    ], LoadingContentTemplateDirective);
    return LoadingContentTemplateDirective;
}());
exports.LoadingContentTemplateDirective = LoadingContentTemplateDirective;
//# sourceMappingURL=loading-template.directive.js.map