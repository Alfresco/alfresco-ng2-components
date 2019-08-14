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
var overlay_1 = require("@angular/cdk/overlay");
var scrolling_1 = require("@angular/cdk/scrolling");
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var context_menu_service_1 = require("./context-menu.service");
var ContextMenuHolderComponent = /** @class */ (function () {
    function ContextMenuHolderComponent(viewport, overlayContainer, contextMenuService, renderer) {
        this.viewport = viewport;
        this.overlayContainer = overlayContainer;
        this.contextMenuService = contextMenuService;
        this.renderer = renderer;
        this.links = [];
        this.mouseLocation = { left: 0, top: 0 };
        this.menuElement = null;
        this.subscriptions = [];
        this.showIcons = false;
    }
    ContextMenuHolderComponent.prototype.onShowContextMenu = function (event) {
        if (event) {
            event.preventDefault();
        }
    };
    ContextMenuHolderComponent.prototype.onResize = function (event) {
        if (this.mdMenuElement) {
            this.updatePosition();
        }
    };
    ContextMenuHolderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscriptions.push(this.contextMenuService.show.subscribe(function (mouseEvent) { return _this.showMenu(mouseEvent.event, mouseEvent.obj); }), this.menuTrigger.menuOpened.subscribe(function () {
            var container = _this.overlayContainer.getContainerElement();
            if (container) {
                _this.contextMenuListenerFn = _this.renderer.listen(container, 'contextmenu', function (contextmenuEvent) {
                    contextmenuEvent.preventDefault();
                });
            }
            _this.menuElement = _this.getContextMenuElement();
        }), this.menuTrigger.menuClosed.subscribe(function () {
            _this.menuElement = null;
            if (_this.contextMenuListenerFn) {
                _this.contextMenuListenerFn();
            }
        }));
    };
    ContextMenuHolderComponent.prototype.ngOnDestroy = function () {
        if (this.contextMenuListenerFn) {
            this.contextMenuListenerFn();
        }
        this.subscriptions.forEach(function (subscription) { return subscription.unsubscribe(); });
        this.subscriptions = [];
        this.menuElement = null;
    };
    ContextMenuHolderComponent.prototype.onMenuItemClick = function (event, menuItem) {
        if (menuItem && menuItem.model && menuItem.model.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }
        menuItem.subject.next(menuItem);
    };
    ContextMenuHolderComponent.prototype.showMenu = function (mouseEvent, links) {
        this.links = links;
        if (mouseEvent) {
            this.mouseLocation = {
                left: mouseEvent.clientX,
                top: mouseEvent.clientY
            };
        }
        this.menuTrigger.openMenu();
        if (this.mdMenuElement) {
            this.updatePosition();
        }
    };
    Object.defineProperty(ContextMenuHolderComponent.prototype, "mdMenuElement", {
        get: function () {
            return this.menuElement;
        },
        enumerable: true,
        configurable: true
    });
    ContextMenuHolderComponent.prototype.locationCss = function () {
        return {
            left: this.mouseLocation.left + 'px',
            top: this.mouseLocation.top + 'px'
        };
    };
    ContextMenuHolderComponent.prototype.updatePosition = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.mdMenuElement.parentElement) {
                if (_this.mdMenuElement.clientWidth + _this.mouseLocation.left > _this.viewport.getViewportRect().width) {
                    _this.menuTrigger.menu.xPosition = 'before';
                    _this.mdMenuElement.parentElement.style.left = _this.mouseLocation.left - _this.mdMenuElement.clientWidth + 'px';
                }
                else {
                    _this.menuTrigger.menu.xPosition = 'after';
                    _this.mdMenuElement.parentElement.style.left = _this.locationCss().left;
                }
                if (_this.mdMenuElement.clientHeight + _this.mouseLocation.top > _this.viewport.getViewportRect().height) {
                    _this.menuTrigger.menu.yPosition = 'above';
                    _this.mdMenuElement.parentElement.style.top = _this.mouseLocation.top - _this.mdMenuElement.clientHeight + 'px';
                }
                else {
                    _this.menuTrigger.menu.yPosition = 'below';
                    _this.mdMenuElement.parentElement.style.top = _this.locationCss().top;
                }
            }
        }, 0);
    };
    ContextMenuHolderComponent.prototype.getContextMenuElement = function () {
        return this.overlayContainer.getContainerElement().querySelector('.context-menu');
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ContextMenuHolderComponent.prototype, "showIcons", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatMenuTrigger),
        __metadata("design:type", material_1.MatMenuTrigger)
    ], ContextMenuHolderComponent.prototype, "menuTrigger", void 0);
    __decorate([
        core_1.HostListener('contextmenu', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], ContextMenuHolderComponent.prototype, "onShowContextMenu", null);
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ContextMenuHolderComponent.prototype, "onResize", null);
    ContextMenuHolderComponent = __decorate([
        core_1.Component({
            selector: 'adf-context-menu-holder',
            template: "\n        <button mat-button [matMenuTriggerFor]=\"contextMenu\"></button>\n        <mat-menu #contextMenu=\"matMenu\" class=\"context-menu\">\n            <ng-container *ngFor=\"let link of links\">\n                <button *ngIf=\"link.model?.visible\"\n                        [attr.data-automation-id]=\"'context-'+((link.title || link.model?.title) | translate)\"\n                        mat-menu-item\n                        [disabled]=\"link.model?.disabled\"\n                        (click)=\"onMenuItemClick($event, link)\">\n                    <mat-icon *ngIf=\"showIcons && link.model?.icon\">{{ link.model.icon }}</mat-icon>\n                    {{ (link.title || link.model?.title) | translate }}\n                </button>\n            </ng-container>\n        </mat-menu>\n    "
        }),
        __metadata("design:paramtypes", [scrolling_1.ViewportRuler,
            overlay_1.OverlayContainer,
            context_menu_service_1.ContextMenuService,
            core_1.Renderer2])
    ], ContextMenuHolderComponent);
    return ContextMenuHolderComponent;
}());
exports.ContextMenuHolderComponent = ContextMenuHolderComponent;
//# sourceMappingURL=context-menu-holder.component.js.map