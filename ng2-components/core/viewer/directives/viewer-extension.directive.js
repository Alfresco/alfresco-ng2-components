"use strict";
/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
var core_1 = require("@angular/core");
var ViewerExtensionDirective = (function () {
    function ViewerExtensionDirective(viewerComponent) {
        this.viewerComponent = viewerComponent;
    }
    ViewerExtensionDirective.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.templateModel = { template: this.template, isVisible: false };
        this.viewerComponent.extensionTemplates.push(this.templateModel);
        this.viewerComponent.extensionChange.subscribe(function (fileExtension) {
            _this.templateModel.isVisible = _this.isVisible(fileExtension);
        });
        if (this.supportedExtensions instanceof Array) {
            this.supportedExtensions.forEach(function (extension) {
                _this.viewerComponent.externalExtensions.push(extension);
            });
        }
    };
    /**
     * check if the current extension in the viewer is compatible with this extension checking against supportedExtensions
     *
     * @returns {boolean}
     */
    ViewerExtensionDirective.prototype.isVisible = function (fileExtension) {
        var supportedExtension;
        if (this.supportedExtensions && (this.supportedExtensions instanceof Array)) {
            supportedExtension = this.supportedExtensions.find(function (extension) {
                return extension.toLowerCase() === fileExtension;
            });
        }
        return !!supportedExtension;
    };
    __decorate([
        core_1.ContentChild(core_1.TemplateRef)
    ], ViewerExtensionDirective.prototype, "template", void 0);
    __decorate([
        core_1.Input()
    ], ViewerExtensionDirective.prototype, "urlFileContent", void 0);
    __decorate([
        core_1.Input()
    ], ViewerExtensionDirective.prototype, "extension", void 0);
    __decorate([
        core_1.Input()
    ], ViewerExtensionDirective.prototype, "supportedExtensions", void 0);
    ViewerExtensionDirective = __decorate([
        core_1.Directive({
            selector: 'adf-viewer-extension'
        })
    ], ViewerExtensionDirective);
    return ViewerExtensionDirective;
}());
exports.ViewerExtensionDirective = ViewerExtensionDirective;
