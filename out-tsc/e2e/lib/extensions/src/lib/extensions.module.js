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
var dynamic_component_1 = require("./components/dynamic-component/dynamic.component");
var dynamic_tab_component_1 = require("./components/dynamic-tab/dynamic-tab.component");
var dynamic_column_component_1 = require("./components/dynamic-column/dynamic-column.component");
var preview_extension_component_1 = require("./components/viewer/preview-extension.component");
var core_1 = require("@angular/core");
var app_extension_service_1 = require("./services/app-extension.service");
var startup_extension_factory_1 = require("./services/startup-extension-factory");
var ExtensionsModule = /** @class */ (function () {
    function ExtensionsModule() {
    }
    ExtensionsModule_1 = ExtensionsModule;
    ExtensionsModule.forRoot = function () {
        return {
            ngModule: ExtensionsModule_1,
            providers: [
                {
                    provide: core_1.APP_INITIALIZER,
                    useFactory: startup_extension_factory_1.setupExtensions,
                    deps: [app_extension_service_1.AppExtensionService],
                    multi: true
                }
            ]
        };
    };
    ExtensionsModule.forChild = function () {
        return {
            ngModule: ExtensionsModule_1
        };
    };
    var ExtensionsModule_1;
    ExtensionsModule = ExtensionsModule_1 = __decorate([
        core_1.NgModule({
            declarations: [
                dynamic_component_1.DynamicExtensionComponent,
                dynamic_tab_component_1.DynamicTabComponent,
                dynamic_column_component_1.DynamicColumnComponent,
                preview_extension_component_1.PreviewExtensionComponent
            ],
            exports: [
                dynamic_component_1.DynamicExtensionComponent,
                dynamic_tab_component_1.DynamicTabComponent,
                dynamic_column_component_1.DynamicColumnComponent,
                preview_extension_component_1.PreviewExtensionComponent
            ]
        })
    ], ExtensionsModule);
    return ExtensionsModule;
}());
exports.ExtensionsModule = ExtensionsModule;
//# sourceMappingURL=extensions.module.js.map