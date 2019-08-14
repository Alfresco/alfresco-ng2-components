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
var extension_service_1 = require("../../services/extension.service");
// cSpell:words lifecycle
var DynamicExtensionComponent = /** @class */ (function () {
    function DynamicExtensionComponent(extensions, componentFactoryResolver) {
        this.extensions = extensions;
        this.componentFactoryResolver = componentFactoryResolver;
        this.loaded = false;
    }
    DynamicExtensionComponent.prototype.ngOnChanges = function (changes) {
        if (!this.loaded) {
            this.loadComponent();
            this.loaded = true;
        }
        if (changes.data) {
            this.data = changes.data.currentValue;
        }
        this.updateInstance();
        this.proxy('ngOnChanges', changes);
    };
    DynamicExtensionComponent.prototype.loadComponent = function () {
        var componentType = this.extensions.getComponentById(this.id);
        if (componentType) {
            var factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
            if (factory) {
                this.content.clear();
                this.componentRef = this.content.createComponent(factory, 0);
            }
        }
    };
    DynamicExtensionComponent.prototype.ngOnDestroy = function () {
        if (this.componentCreated()) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    };
    DynamicExtensionComponent.prototype.updateInstance = function () {
        if (this.componentCreated()) {
            this.componentRef.instance.data = this.data;
        }
    };
    DynamicExtensionComponent.prototype.proxy = function (lifecycleMethod) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.componentCreated() && this.lifecycleHookIsImplemented(lifecycleMethod)) {
            this.componentRef.instance[lifecycleMethod].apply(this.componentRef.instance, args);
        }
    };
    DynamicExtensionComponent.prototype.componentCreated = function () {
        return !!this.componentRef && !!this.componentRef.instance;
    };
    DynamicExtensionComponent.prototype.lifecycleHookIsImplemented = function (lifecycleMethod) {
        return !!this.componentRef.instance[lifecycleMethod];
    };
    __decorate([
        core_1.ViewChild('content', { read: core_1.ViewContainerRef }),
        __metadata("design:type", core_1.ViewContainerRef)
    ], DynamicExtensionComponent.prototype, "content", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DynamicExtensionComponent.prototype, "id", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], DynamicExtensionComponent.prototype, "data", void 0);
    DynamicExtensionComponent = __decorate([
        core_1.Component({
            selector: 'adf-dynamic-component',
            template: "<div #content></div>"
        }),
        __metadata("design:paramtypes", [extension_service_1.ExtensionService, core_1.ComponentFactoryResolver])
    ], DynamicExtensionComponent);
    return DynamicExtensionComponent;
}());
exports.DynamicExtensionComponent = DynamicExtensionComponent;
//# sourceMappingURL=dynamic.component.js.map