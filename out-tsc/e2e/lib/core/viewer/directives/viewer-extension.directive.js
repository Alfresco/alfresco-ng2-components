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
var viewer_component_1 = require("../components/viewer.component");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var ViewerExtensionDirective = /** @class */ (function () {
    function ViewerExtensionDirective(viewerComponent) {
        this.viewerComponent = viewerComponent;
        this.onDestroy$ = new rxjs_1.Subject();
    }
    ViewerExtensionDirective.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.templateModel = { template: this.template, isVisible: false };
        this.viewerComponent.extensionTemplates.push(this.templateModel);
        this.viewerComponent.extensionChange
            .pipe(operators_1.takeUntil(this.onDestroy$))
            .subscribe(function (fileExtension) {
            _this.templateModel.isVisible = _this.isVisible(fileExtension);
        });
        if (this.supportedExtensions instanceof Array) {
            this.supportedExtensions.forEach(function (extension) {
                _this.viewerComponent.externalExtensions.push(extension);
            });
        }
    };
    ViewerExtensionDirective.prototype.ngOnDestroy = function () {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    };
    /**
     * check if the current extension in the viewer is compatible with this extension checking against supportedExtensions
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
        core_1.ContentChild(core_1.TemplateRef),
        __metadata("design:type", Object)
    ], ViewerExtensionDirective.prototype, "template", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ViewerExtensionDirective.prototype, "urlFileContent", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ViewerExtensionDirective.prototype, "extension", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], ViewerExtensionDirective.prototype, "supportedExtensions", void 0);
    ViewerExtensionDirective = __decorate([
        core_1.Directive({
            selector: 'adf-viewer-extension'
        }),
        __metadata("design:paramtypes", [viewer_component_1.ViewerComponent])
    ], ViewerExtensionDirective);
    return ViewerExtensionDirective;
}());
exports.ViewerExtensionDirective = ViewerExtensionDirective;
//# sourceMappingURL=viewer-extension.directive.js.map