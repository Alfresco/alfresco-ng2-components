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
var layout_1 = require("@angular/cdk/layout");
var user_preferences_service_1 = require("../../../services/user-preferences.service");
var sidenav_layout_content_directive_1 = require("../../directives/sidenav-layout-content.directive");
var sidenav_layout_header_directive_1 = require("../../directives/sidenav-layout-header.directive");
var sidenav_layout_navigation_directive_1 = require("../../directives/sidenav-layout-navigation.directive");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var SidenavLayoutComponent = /** @class */ (function () {
    function SidenavLayoutComponent(mediaMatcher, userPreferencesService) {
        var _this = this;
        this.mediaMatcher = mediaMatcher;
        this.userPreferencesService = userPreferencesService;
        /** The direction of the layout. 'ltr' or 'rtl' */
        this.dir = 'ltr';
        /** The side that the drawer is attached to. Possible values are 'start' and 'end'. */
        this.position = 'start';
        /** Toggles showing/hiding the navigation region. */
        this.hideSidenav = false;
        /** Should the navigation region be expanded initially? */
        this.expandedSidenav = true;
        /** Emitted when the menu toggle and the collapsed/expanded state of the sideNav changes. */
        this.expanded = new core_1.EventEmitter();
        this.templateContext = {
            toggleMenu: function () { },
            isMenuMinimized: function () { return _this.isMenuMinimized; }
        };
        this.onDestroy$ = new rxjs_1.Subject();
        this.onMediaQueryChange = this.onMediaQueryChange.bind(this);
    }
    SidenavLayoutComponent_1 = SidenavLayoutComponent;
    SidenavLayoutComponent.prototype.ngOnInit = function () {
        var _this = this;
        var initialMenuState = !this.expandedSidenav;
        this.menuOpenStateSubject = new rxjs_1.BehaviorSubject(initialMenuState);
        this.menuOpenState$ = this.menuOpenStateSubject.asObservable();
        var stepOver = this.stepOver || SidenavLayoutComponent_1.STEP_OVER;
        this.isMenuMinimized = initialMenuState;
        this.mediaQueryList = this.mediaMatcher.matchMedia("(max-width: " + stepOver + "px)");
        this.mediaQueryList.addListener(this.onMediaQueryChange);
        this.userPreferencesService
            .select('textOrientation')
            .pipe(operators_1.takeUntil(this.onDestroy$))
            .subscribe(function (direction) {
            _this.dir = direction;
        });
    };
    SidenavLayoutComponent.prototype.ngAfterViewInit = function () {
        this.templateContext.toggleMenu = this.toggleMenu.bind(this);
    };
    SidenavLayoutComponent.prototype.ngOnDestroy = function () {
        this.mediaQueryList.removeListener(this.onMediaQueryChange);
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    };
    SidenavLayoutComponent.prototype.toggleMenu = function () {
        if (!this.mediaQueryList.matches) {
            this.isMenuMinimized = !this.isMenuMinimized;
        }
        else {
            this.isMenuMinimized = false;
        }
        this.container.toggleMenu();
        this.expanded.emit(!this.isMenuMinimized);
    };
    Object.defineProperty(SidenavLayoutComponent.prototype, "isMenuMinimized", {
        get: function () {
            return this._isMenuMinimized;
        },
        set: function (menuState) {
            this._isMenuMinimized = menuState;
            this.menuOpenStateSubject.next(!menuState);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SidenavLayoutComponent.prototype, "isHeaderInside", {
        get: function () {
            return this.mediaQueryList.matches;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SidenavLayoutComponent.prototype, "headerTemplate", {
        get: function () {
            return this.headerDirective && this.headerDirective.template || this.emptyTemplate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SidenavLayoutComponent.prototype, "navigationTemplate", {
        get: function () {
            return this.navigationDirective && this.navigationDirective.template || this.emptyTemplate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SidenavLayoutComponent.prototype, "contentTemplate", {
        get: function () {
            return this.contentDirective && this.contentDirective.template || this.emptyTemplate;
        },
        enumerable: true,
        configurable: true
    });
    SidenavLayoutComponent.prototype.onMediaQueryChange = function () {
        this.isMenuMinimized = false;
        this.expanded.emit(!this.isMenuMinimized);
    };
    var SidenavLayoutComponent_1;
    SidenavLayoutComponent.STEP_OVER = 600;
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SidenavLayoutComponent.prototype, "position", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], SidenavLayoutComponent.prototype, "sidenavMin", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], SidenavLayoutComponent.prototype, "sidenavMax", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], SidenavLayoutComponent.prototype, "stepOver", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SidenavLayoutComponent.prototype, "hideSidenav", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SidenavLayoutComponent.prototype, "expandedSidenav", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], SidenavLayoutComponent.prototype, "expanded", void 0);
    __decorate([
        core_1.ContentChild(sidenav_layout_header_directive_1.SidenavLayoutHeaderDirective),
        __metadata("design:type", sidenav_layout_header_directive_1.SidenavLayoutHeaderDirective)
    ], SidenavLayoutComponent.prototype, "headerDirective", void 0);
    __decorate([
        core_1.ContentChild(sidenav_layout_navigation_directive_1.SidenavLayoutNavigationDirective),
        __metadata("design:type", sidenav_layout_navigation_directive_1.SidenavLayoutNavigationDirective)
    ], SidenavLayoutComponent.prototype, "navigationDirective", void 0);
    __decorate([
        core_1.ContentChild(sidenav_layout_content_directive_1.SidenavLayoutContentDirective),
        __metadata("design:type", sidenav_layout_content_directive_1.SidenavLayoutContentDirective)
    ], SidenavLayoutComponent.prototype, "contentDirective", void 0);
    __decorate([
        core_1.ViewChild('container'),
        __metadata("design:type", Object)
    ], SidenavLayoutComponent.prototype, "container", void 0);
    __decorate([
        core_1.ViewChild('emptyTemplate'),
        __metadata("design:type", Object)
    ], SidenavLayoutComponent.prototype, "emptyTemplate", void 0);
    SidenavLayoutComponent = SidenavLayoutComponent_1 = __decorate([
        core_1.Component({
            selector: 'adf-sidenav-layout',
            templateUrl: './sidenav-layout.component.html',
            styleUrls: ['./sidenav-layout.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            host: { class: 'adf-sidenav-layout' }
        }),
        __metadata("design:paramtypes", [layout_1.MediaMatcher, user_preferences_service_1.UserPreferencesService])
    ], SidenavLayoutComponent);
    return SidenavLayoutComponent;
}());
exports.SidenavLayoutComponent = SidenavLayoutComponent;
//# sourceMappingURL=sidenav-layout.component.js.map