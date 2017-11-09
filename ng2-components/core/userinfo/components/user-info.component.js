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
var bpm_user_model_1 = require("./../models/bpm-user.model");
var ecm_user_model_1 = require("./../models/ecm-user.model");
var UserInfoComponent = (function () {
    function UserInfoComponent(ecmUserService, bpmUserService, authService) {
        this.ecmUserService = ecmUserService;
        this.bpmUserService = bpmUserService;
        this.authService = authService;
        this.ecmBackgroundImage = require('../assets/images/ecm-background.png');
        this.bpmBackgroundImage = require('../assets/images/bpm-background.png');
        this.menuPositionX = 'after';
        this.menuPositionY = 'below';
        this.showName = true;
        this.namePosition = 'right';
        this.anonymousImageUrl = require('../assets/images/anonymous.gif');
    }
    UserInfoComponent.prototype.ngOnInit = function () {
        this.getUserInfo();
    };
    UserInfoComponent.prototype.getUserInfo = function () {
        this.loadEcmUserInfo();
        this.loadBpmUserInfo();
    };
    UserInfoComponent.prototype.isLoggedIn = function () {
        return this.authService.isLoggedIn();
    };
    UserInfoComponent.prototype.loadEcmUserInfo = function () {
        var _this = this;
        if (this.authService.isEcmLoggedIn()) {
            this.ecmUserService.getCurrentUserInfo()
                .subscribe(function (res) {
                _this.ecmUser = new ecm_user_model_1.EcmUserModel(res);
                _this.getEcmAvatar();
            });
        }
        else {
            this.ecmUser = null;
            this.ecmUserImage = null;
        }
    };
    UserInfoComponent.prototype.loadBpmUserInfo = function () {
        var _this = this;
        if (this.authService.isBpmLoggedIn()) {
            this.bpmUserService.getCurrentUserInfo()
                .subscribe(function (res) {
                _this.bpmUser = new bpm_user_model_1.BpmUserModel(res);
            });
            this.bpmUserImage = this.bpmUserService.getCurrentUserProfileImage();
        }
        else {
            this.bpmUser = null;
            this.bpmUserImage = null;
        }
    };
    UserInfoComponent.prototype.stopClosing = function (event) {
        event.stopPropagation();
    };
    UserInfoComponent.prototype.getEcmAvatar = function () {
        this.ecmUserImage = this.ecmUserService.getUserProfileImage(this.ecmUser.avatarId);
    };
    UserInfoComponent.prototype.showOnRight = function () {
        return this.namePosition === 'right';
    };
    __decorate([
        core_1.Input()
    ], UserInfoComponent.prototype, "ecmBackgroundImage", void 0);
    __decorate([
        core_1.Input()
    ], UserInfoComponent.prototype, "bpmBackgroundImage", void 0);
    __decorate([
        core_1.Input()
    ], UserInfoComponent.prototype, "menuPositionX", void 0);
    __decorate([
        core_1.Input()
    ], UserInfoComponent.prototype, "menuPositionY", void 0);
    __decorate([
        core_1.Input()
    ], UserInfoComponent.prototype, "showName", void 0);
    __decorate([
        core_1.Input()
    ], UserInfoComponent.prototype, "namePosition", void 0);
    UserInfoComponent = __decorate([
        core_1.Component({
            selector: 'adf-userinfo, ng2-alfresco-userinfo',
            styleUrls: ['./user-info.component.scss'],
            templateUrl: './user-info.component.html',
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], UserInfoComponent);
    return UserInfoComponent;
}());
exports.UserInfoComponent = UserInfoComponent;
