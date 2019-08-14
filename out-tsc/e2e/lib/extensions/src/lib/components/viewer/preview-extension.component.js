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
var js_api_1 = require("@alfresco/js-api");
var PreviewExtensionComponent = /** @class */ (function () {
    function PreviewExtensionComponent(extensionService, componentFactoryResolver) {
        this.extensionService = extensionService;
        this.componentFactoryResolver = componentFactoryResolver;
    }
    PreviewExtensionComponent.prototype.ngOnInit = function () {
        if (!this.id) {
            return;
        }
        var componentType = this.extensionService.getComponentById(this.id);
        if (componentType) {
            var factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
            if (factory) {
                this.content.clear();
                this.componentRef = this.content.createComponent(factory, 0);
                this.updateInstance();
            }
        }
    };
    PreviewExtensionComponent.prototype.ngOnChanges = function () {
        this.updateInstance();
    };
    PreviewExtensionComponent.prototype.ngOnDestroy = function () {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    };
    PreviewExtensionComponent.prototype.updateInstance = function () {
        if (this.componentRef && this.componentRef.instance) {
            var instance = this.componentRef.instance;
            instance.node = this.node;
            instance.url = this.url;
            instance.extension = this.extension;
        }
    };
    __decorate([
        core_1.ViewChild('content', { read: core_1.ViewContainerRef }),
        __metadata("design:type", core_1.ViewContainerRef)
    ], PreviewExtensionComponent.prototype, "content", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], PreviewExtensionComponent.prototype, "id", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], PreviewExtensionComponent.prototype, "url", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], PreviewExtensionComponent.prototype, "extension", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", js_api_1.Node)
    ], PreviewExtensionComponent.prototype, "node", void 0);
    PreviewExtensionComponent = __decorate([
        core_1.Component({
            selector: 'adf-preview-extension',
            template: "\n    <div #content></div>\n  "
        }),
        __metadata("design:paramtypes", [extension_service_1.ExtensionService,
            core_1.ComponentFactoryResolver])
    ], PreviewExtensionComponent);
    return PreviewExtensionComponent;
}());
exports.PreviewExtensionComponent = PreviewExtensionComponent;
//# sourceMappingURL=preview-extension.component.js.map