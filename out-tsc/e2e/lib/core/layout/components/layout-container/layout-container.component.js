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
var material_1 = require("@angular/material");
var animations_1 = require("../../helpers/animations");
var LayoutContainerComponent = /** @class */ (function () {
    function LayoutContainerComponent() {
        this.hideSidenav = false;
        this.expandedSidenav = true;
        /** The side that the drawer is attached to 'start' | 'end' page */
        this.position = 'start';
        /** Layout text orientation 'ltr' | 'rtl' */
        this.direction = 'ltr';
        this.SIDENAV_STATES = { MOBILE: {}, EXPANDED: {}, COMPACT: {} };
        this.CONTENT_STATES = { MOBILE: {}, EXPANDED: {}, COMPACT: {} };
        this.onMediaQueryChange = this.onMediaQueryChange.bind(this);
    }
    LayoutContainerComponent.prototype.ngOnInit = function () {
        this.SIDENAV_STATES.MOBILE = { value: 'expanded', params: { width: this.sidenavMax } };
        this.SIDENAV_STATES.EXPANDED = { value: 'expanded', params: { width: this.sidenavMax } };
        this.SIDENAV_STATES.COMPACT = { value: 'compact', params: { width: this.sidenavMin } };
        this.CONTENT_STATES.MOBILE = { value: 'expanded' };
        this.mediaQueryList.addListener(this.onMediaQueryChange);
        if (this.isMobileScreenSize) {
            this.sidenavAnimationState = this.SIDENAV_STATES.MOBILE;
            this.contentAnimationState = this.CONTENT_STATES.MOBILE;
        }
        else if (this.expandedSidenav) {
            this.sidenavAnimationState = this.SIDENAV_STATES.EXPANDED;
            this.contentAnimationState = this.toggledContentAnimation;
        }
        else {
            this.sidenavAnimationState = this.SIDENAV_STATES.COMPACT;
            this.contentAnimationState = this.toggledContentAnimation;
        }
    };
    LayoutContainerComponent.prototype.ngOnDestroy = function () {
        this.mediaQueryList.removeListener(this.onMediaQueryChange);
    };
    LayoutContainerComponent.prototype.ngOnChanges = function (changes) {
        if (changes && changes.direction) {
            this.contentAnimationState = this.toggledContentAnimation;
        }
    };
    LayoutContainerComponent.prototype.toggleMenu = function () {
        if (this.isMobileScreenSize) {
            this.sidenav.toggle();
        }
        else {
            this.sidenavAnimationState = this.toggledSidenavAnimation;
            this.contentAnimationState = this.toggledContentAnimation;
        }
    };
    Object.defineProperty(LayoutContainerComponent.prototype, "isMobileScreenSize", {
        get: function () {
            return this.mediaQueryList.matches;
        },
        enumerable: true,
        configurable: true
    });
    LayoutContainerComponent.prototype.getContentAnimationState = function () {
        return this.contentAnimationState;
    };
    Object.defineProperty(LayoutContainerComponent.prototype, "toggledSidenavAnimation", {
        get: function () {
            return this.sidenavAnimationState === this.SIDENAV_STATES.EXPANDED
                ? this.SIDENAV_STATES.COMPACT
                : this.SIDENAV_STATES.EXPANDED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutContainerComponent.prototype, "toggledContentAnimation", {
        get: function () {
            if (this.isMobileScreenSize) {
                return this.CONTENT_STATES.MOBILE;
            }
            if (this.sidenavAnimationState === this.SIDENAV_STATES.EXPANDED) {
                if (this.position === 'start' && this.direction === 'ltr') {
                    return { value: 'compact', params: { 'margin-left': this.sidenavMax } };
                }
                if (this.position === 'start' && this.direction === 'rtl') {
                    return { value: 'compact', params: { 'margin-right': this.sidenavMax } };
                }
                if (this.position === 'end' && this.direction === 'ltr') {
                    return { value: 'compact', params: { 'margin-right': this.sidenavMax } };
                }
                if (this.position === 'end' && this.direction === 'rtl') {
                    return { value: 'compact', params: { 'margin-left': this.sidenavMax } };
                }
            }
            else {
                if (this.position === 'start' && this.direction === 'ltr') {
                    return { value: 'expanded', params: { 'margin-left': this.sidenavMin } };
                }
                if (this.position === 'start' && this.direction === 'rtl') {
                    return { value: 'expanded', params: { 'margin-right': this.sidenavMin } };
                }
                if (this.position === 'end' && this.direction === 'ltr') {
                    return { value: 'expanded', params: { 'margin-right': this.sidenavMin } };
                }
                if (this.position === 'end' && this.direction === 'rtl') {
                    return { value: 'expanded', params: { 'margin-left': this.sidenavMin } };
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    LayoutContainerComponent.prototype.onMediaQueryChange = function () {
        this.sidenavAnimationState = this.SIDENAV_STATES.EXPANDED;
        this.contentAnimationState = this.toggledContentAnimation;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], LayoutContainerComponent.prototype, "sidenavMin", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], LayoutContainerComponent.prototype, "sidenavMax", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], LayoutContainerComponent.prototype, "mediaQueryList", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], LayoutContainerComponent.prototype, "hideSidenav", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], LayoutContainerComponent.prototype, "expandedSidenav", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], LayoutContainerComponent.prototype, "position", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], LayoutContainerComponent.prototype, "direction", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSidenav),
        __metadata("design:type", material_1.MatSidenav)
    ], LayoutContainerComponent.prototype, "sidenav", void 0);
    LayoutContainerComponent = __decorate([
        core_1.Component({
            selector: 'adf-layout-container',
            templateUrl: './layout-container.component.html',
            styleUrls: ['./layout-container.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: [animations_1.sidenavAnimation, animations_1.contentAnimation]
        }),
        __metadata("design:paramtypes", [])
    ], LayoutContainerComponent);
    return LayoutContainerComponent;
}());
exports.LayoutContainerComponent = LayoutContainerComponent;
//# sourceMappingURL=layout-container.component.js.map