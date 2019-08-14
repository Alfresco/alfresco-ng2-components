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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var animations_1 = require("@angular/animations");
var keycodes_1 = require("@angular/cdk/keycodes");
var a11y_1 = require("@angular/cdk/a11y");
var material_1 = require("@angular/material");
var context_menu_overlay_1 = require("./context-menu-overlay");
var animations_2 = require("./animations");
var context_menu_tokens_1 = require("./context-menu.tokens");
var ContextMenuListComponent = /** @class */ (function () {
    function ContextMenuListComponent(contextMenuOverlayRef, data) {
        this.contextMenuOverlayRef = contextMenuOverlayRef;
        this.data = data;
        this.links = this.data;
    }
    ContextMenuListComponent.prototype.handleKeydownEscape = function (event) {
        if (event) {
            this.contextMenuOverlayRef.close();
        }
    };
    ContextMenuListComponent.prototype.handleKeydownEvent = function (event) {
        if (event) {
            var keyCode = event.keyCode;
            if (keyCode === keycodes_1.UP_ARROW || keyCode === keycodes_1.DOWN_ARROW) {
                this.keyManager.onKeydown(event);
            }
        }
    };
    ContextMenuListComponent.prototype.onMenuItemClick = function (event, menuItem) {
        if (menuItem && menuItem.model && menuItem.model.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }
        menuItem.subject.next(menuItem);
        this.contextMenuOverlayRef.close();
    };
    ContextMenuListComponent.prototype.ngAfterViewInit = function () {
        this.keyManager = new a11y_1.FocusKeyManager(this.items);
        this.keyManager.setFirstItemActive();
    };
    __decorate([
        core_1.ViewChildren(material_1.MatMenuItem),
        __metadata("design:type", core_1.QueryList)
    ], ContextMenuListComponent.prototype, "items", void 0);
    __decorate([
        core_1.HostListener('document:keydown.Escape', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [KeyboardEvent]),
        __metadata("design:returntype", void 0)
    ], ContextMenuListComponent.prototype, "handleKeydownEscape", null);
    __decorate([
        core_1.HostListener('document:keydown', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [KeyboardEvent]),
        __metadata("design:returntype", void 0)
    ], ContextMenuListComponent.prototype, "handleKeydownEvent", null);
    ContextMenuListComponent = __decorate([
        core_1.Component({
            selector: 'adf-context-menu',
            template: "\n        <div mat-menu class=\"mat-menu-panel\" @panelAnimation>\n            <div id=\"adf-context-menu-content\" class=\"mat-menu-content\">\n                <ng-container *ngFor=\"let link of links\">\n                    <button *ngIf=\"link.model?.visible\"\n                            [attr.data-automation-id]=\"'context-'+((link.title || link.model?.title) | translate)\"\n                            mat-menu-item\n                            [disabled]=\"link.model?.disabled\"\n                            (click)=\"onMenuItemClick($event, link)\">\n                        <mat-icon *ngIf=\"link.model?.icon\">{{ link.model.icon }}</mat-icon>\n                        <span>{{ (link.title || link.model?.title) | translate }}</span>\n                    </button>\n                </ng-container>\n            </div>\n        </div>\n    ",
            host: {
                role: 'menu',
                class: 'adf-context-menu'
            },
            encapsulation: core_1.ViewEncapsulation.None,
            animations: [
                animations_1.trigger('panelAnimation', animations_2.contextMenuAnimation)
            ]
        }),
        __param(0, core_1.Inject(context_menu_overlay_1.ContextMenuOverlayRef)),
        __param(1, core_1.Optional()), __param(1, core_1.Inject(context_menu_tokens_1.CONTEXT_MENU_DATA)),
        __metadata("design:paramtypes", [context_menu_overlay_1.ContextMenuOverlayRef, Object])
    ], ContextMenuListComponent);
    return ContextMenuListComponent;
}());
exports.ContextMenuListComponent = ContextMenuListComponent;
//# sourceMappingURL=context-menu-list.component.js.map