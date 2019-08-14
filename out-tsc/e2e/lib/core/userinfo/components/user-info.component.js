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
var authentication_service_1 = require("../../services/authentication.service");
var bpm_user_service_1 = require("./../services/bpm-user.service");
var ecm_user_service_1 = require("./../services/ecm-user.service");
var identity_user_service_1 = require("../services/identity-user.service");
var rxjs_1 = require("rxjs");
var material_1 = require("@angular/material");
var UserInfoComponent = /** @class */ (function () {
    function UserInfoComponent(ecmUserService, bpmUserService, identityUserService, authService) {
        this.ecmUserService = ecmUserService;
        this.bpmUserService = bpmUserService;
        this.identityUserService = identityUserService;
        this.authService = authService;
        /** Custom path for the background banner image for ACS users. */
        this.ecmBackgroundImage = './assets/images/ecm-background.png';
        /** Custom path for the background banner image for APS users. */
        this.bpmBackgroundImage = './assets/images/bpm-background.png';
        /** Custom choice for opening the menu at the bottom. Can be `before` or `after`. */
        this.menuPositionX = 'after';
        /** Custom choice for opening the menu at the bottom. Can be `above` or `below`. */
        this.menuPositionY = 'below';
        /** Shows/hides the username next to the user info button. */
        this.showName = true;
        /** When the username is shown, this defines its position relative to the user info button.
         * Can be `right` or `left`.
         */
        this.namePosition = 'right';
    }
    UserInfoComponent.prototype.ngOnInit = function () {
        this.getUserInfo();
    };
    UserInfoComponent.prototype.getUserInfo = function () {
        if (this.authService.isOauth()) {
            this.loadIdentityUserInfo();
        }
        else if (this.authService.isEcmLoggedIn() && this.authService.isBpmLoggedIn()) {
            this.loadEcmUserInfo();
            this.loadBpmUserInfo();
        }
        else if (this.authService.isEcmLoggedIn()) {
            this.loadEcmUserInfo();
        }
        else if (this.authService.isBpmLoggedIn()) {
            this.loadBpmUserInfo();
        }
    };
    UserInfoComponent.prototype.onKeyPress = function (event) {
        this.closeUserModal(event);
    };
    UserInfoComponent.prototype.closeUserModal = function ($event) {
        if ($event.keyCode === 27) {
            this.trigger.closeMenu();
        }
    };
    UserInfoComponent.prototype.isLoggedIn = function () {
        return this.authService.isLoggedIn();
    };
    UserInfoComponent.prototype.loadEcmUserInfo = function () {
        this.ecmUser$ = this.ecmUserService.getCurrentUserInfo();
    };
    UserInfoComponent.prototype.loadBpmUserInfo = function () {
        this.bpmUser$ = this.bpmUserService.getCurrentUserInfo();
    };
    UserInfoComponent.prototype.loadIdentityUserInfo = function () {
        this.identityUser$ = rxjs_1.of(this.identityUserService.getCurrentUserInfo());
    };
    UserInfoComponent.prototype.stopClosing = function (event) {
        event.stopPropagation();
    };
    UserInfoComponent.prototype.getEcmAvatar = function (avatarId) {
        return this.ecmUserService.getUserProfileImage(avatarId);
    };
    UserInfoComponent.prototype.getBpmUserImage = function () {
        return this.bpmUserService.getCurrentUserProfileImage();
    };
    UserInfoComponent.prototype.showOnRight = function () {
        return this.namePosition === 'right';
    };
    __decorate([
        core_1.ViewChild(material_1.MatMenuTrigger),
        __metadata("design:type", material_1.MatMenuTrigger)
    ], UserInfoComponent.prototype, "trigger", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], UserInfoComponent.prototype, "ecmBackgroundImage", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], UserInfoComponent.prototype, "bpmBackgroundImage", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], UserInfoComponent.prototype, "menuPositionX", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], UserInfoComponent.prototype, "menuPositionY", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], UserInfoComponent.prototype, "showName", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], UserInfoComponent.prototype, "namePosition", void 0);
    UserInfoComponent = __decorate([
        core_1.Component({
            selector: 'adf-userinfo',
            styleUrls: ['./user-info.component.scss'],
            templateUrl: './user-info.component.html',
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [ecm_user_service_1.EcmUserService,
            bpm_user_service_1.BpmUserService,
            identity_user_service_1.IdentityUserService,
            authentication_service_1.AuthenticationService])
    ], UserInfoComponent);
    return UserInfoComponent;
}());
exports.UserInfoComponent = UserInfoComponent;
//# sourceMappingURL=user-info.component.js.map