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
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var core_2 = require("@ngx-translate/core");
var material_module_1 = require("../material.module");
var about_component_1 = require("./about.component");
var datatable_module_1 = require("../datatable/datatable.module");
var data_column_module_1 = require("../data-column/data-column.module");
var AboutModule = /** @class */ (function () {
    function AboutModule() {
    }
    AboutModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                material_module_1.MaterialModule,
                core_2.TranslateModule.forChild(),
                datatable_module_1.DataTableModule,
                data_column_module_1.DataColumnModule
            ],
            declarations: [
                about_component_1.AboutComponent
            ],
            exports: [
                about_component_1.AboutComponent
            ]
        })
    ], AboutModule);
    return AboutModule;
}());
exports.AboutModule = AboutModule;
//# sourceMappingURL=about.module.js.map