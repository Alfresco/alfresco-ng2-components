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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var overlay_1 = require("@angular/cdk/overlay");
var portal_1 = require("@angular/cdk/portal");
var context_menu_overlay_1 = require("./context-menu-overlay");
var context_menu_tokens_1 = require("./context-menu.tokens");
var context_menu_list_component_1 = require("./context-menu-list.component");
var DEFAULT_CONFIG = {
    panelClass: 'cdk-overlay-pane',
    backdropClass: 'cdk-overlay-transparent-backdrop',
    hasBackdrop: true
};
var ContextMenuOverlayService = /** @class */ (function () {
    function ContextMenuOverlayService(injector, overlay) {
        this.injector = injector;
        this.overlay = overlay;
    }
    ContextMenuOverlayService.prototype.open = function (config) {
        var overlayConfig = __assign({}, DEFAULT_CONFIG, config);
        var overlay = this.createOverlay(overlayConfig);
        var overlayRef = new context_menu_overlay_1.ContextMenuOverlayRef(overlay);
        this.attachDialogContainer(overlay, config, overlayRef);
        overlay.backdropClick().subscribe(function () { return overlayRef.close(); });
        // prevent native contextmenu on overlay element if config.hasBackdrop is true
        if (overlayConfig.hasBackdrop) {
            overlay._backdropElement
                .addEventListener('contextmenu', function (event) {
                event.preventDefault();
                overlay._backdropClick.next(null);
            }, true);
        }
        return overlayRef;
    };
    ContextMenuOverlayService.prototype.createOverlay = function (config) {
        var overlayConfig = this.getOverlayConfig(config);
        return this.overlay.create(overlayConfig);
    };
    ContextMenuOverlayService.prototype.attachDialogContainer = function (overlay, config, contextMenuOverlayRef) {
        var injector = this.createInjector(config, contextMenuOverlayRef);
        var containerPortal = new portal_1.ComponentPortal(context_menu_list_component_1.ContextMenuListComponent, null, injector);
        var containerRef = overlay.attach(containerPortal);
        return containerRef.instance;
    };
    ContextMenuOverlayService.prototype.createInjector = function (config, contextMenuOverlayRef) {
        var injectionTokens = new WeakMap();
        injectionTokens.set(context_menu_overlay_1.ContextMenuOverlayRef, contextMenuOverlayRef);
        injectionTokens.set(context_menu_tokens_1.CONTEXT_MENU_DATA, config.data);
        return new portal_1.PortalInjector(this.injector, injectionTokens);
    };
    ContextMenuOverlayService.prototype.getOverlayConfig = function (config) {
        var _a = config.source, clientY = _a.clientY, clientX = _a.clientX;
        var fakeElement = {
            getBoundingClientRect: function () { return ({
                bottom: clientY,
                height: 0,
                left: clientX,
                right: clientX,
                top: clientY,
                width: 0
            }); }
        };
        var positionStrategy = this.overlay.position()
            .connectedTo(new core_1.ElementRef(fakeElement), { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' })
            .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' })
            .withFallbackPosition({ originX: 'end', originY: 'top' }, { overlayX: 'start', overlayY: 'top' })
            .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'end', overlayY: 'top' })
            .withFallbackPosition({ originX: 'end', originY: 'center' }, { overlayX: 'start', overlayY: 'center' })
            .withFallbackPosition({ originX: 'start', originY: 'center' }, { overlayX: 'end', overlayY: 'center' });
        var overlayConfig = new overlay_1.OverlayConfig({
            hasBackdrop: config.hasBackdrop,
            backdropClass: config.backdropClass,
            panelClass: config.panelClass,
            scrollStrategy: this.overlay.scrollStrategies.close(),
            positionStrategy: positionStrategy
        });
        return overlayConfig;
    };
    ContextMenuOverlayService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [core_1.Injector,
            overlay_1.Overlay])
    ], ContextMenuOverlayService);
    return ContextMenuOverlayService;
}());
exports.ContextMenuOverlayService = ContextMenuOverlayService;
//# sourceMappingURL=context-menu-overlay.service.js.map