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
var clipboard_service_1 = require("./clipboard.service");
var ClipboardDirective = /** @class */ (function () {
    function ClipboardDirective(clipboardService, viewContainerRef, resolver) {
        this.clipboardService = clipboardService;
        this.viewContainerRef = viewContainerRef;
        this.resolver = resolver;
    }
    ClipboardDirective.prototype.handleClickEvent = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.copyToClipboard();
    };
    ClipboardDirective.prototype.showTooltip = function () {
        if (this.placeholder) {
            var componentFactory = this.resolver.resolveComponentFactory(ClipboardComponent);
            var componentRef = this.viewContainerRef.createComponent(componentFactory).instance;
            componentRef.placeholder = this.placeholder;
        }
    };
    ClipboardDirective.prototype.closeTooltip = function () {
        this.viewContainerRef.remove();
    };
    ClipboardDirective.prototype.copyToClipboard = function () {
        var isValidTarget = this.clipboardService.isTargetValid(this.target);
        if (isValidTarget) {
            this.clipboardService.copyToClipboard(this.target, this.message);
        }
        else {
            this.copyContentToClipboard(this.viewContainerRef.element.nativeElement.innerHTML);
        }
    };
    ClipboardDirective.prototype.copyContentToClipboard = function (content) {
        this.clipboardService.copyContentToClipboard(content, this.message);
    };
    __decorate([
        core_1.Input('adf-clipboard'),
        __metadata("design:type", String)
    ], ClipboardDirective.prototype, "placeholder", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ClipboardDirective.prototype, "target", void 0);
    __decorate([
        core_1.Input('clipboard-notification'),
        __metadata("design:type", String)
    ], ClipboardDirective.prototype, "message", void 0);
    __decorate([
        core_1.HostListener('click', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], ClipboardDirective.prototype, "handleClickEvent", null);
    __decorate([
        core_1.HostListener('mouseenter'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ClipboardDirective.prototype, "showTooltip", null);
    __decorate([
        core_1.HostListener('mouseleave'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ClipboardDirective.prototype, "closeTooltip", null);
    ClipboardDirective = __decorate([
        core_1.Directive({
            selector: '[adf-clipboard]',
            exportAs: 'adfClipboard'
        }),
        __metadata("design:paramtypes", [clipboard_service_1.ClipboardService,
            core_1.ViewContainerRef,
            core_1.ComponentFactoryResolver])
    ], ClipboardDirective);
    return ClipboardDirective;
}());
exports.ClipboardDirective = ClipboardDirective;
var ClipboardComponent = /** @class */ (function () {
    function ClipboardComponent() {
    }
    ClipboardComponent.prototype.ngOnInit = function () {
        this.placeholder = this.placeholder || 'CLIPBOARD.CLICK_TO_COPY';
    };
    ClipboardComponent = __decorate([
        core_1.Component({
            selector: 'adf-copy-content-tooltip',
            template: "\n        <span class='adf-copy-tooltip'>{{ placeholder | translate }} </span>\n        ",
            styleUrls: ['./clipboard.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ClipboardComponent);
    return ClipboardComponent;
}());
exports.ClipboardComponent = ClipboardComponent;
//# sourceMappingURL=clipboard.directive.js.map