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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var router_1 = require("@angular/router");
var authentication_service_1 = require("./authentication.service");
var app_config_service_1 = require("../app-config/app-config.service");
var auth_guard_base_1 = require("./auth-guard-base");
var jwt_helper_service_1 = require("./jwt-helper.service");
var AuthGuard = /** @class */ (function (_super) {
    __extends(AuthGuard, _super);
    function AuthGuard(jwtHelperService, authenticationService, router, appConfigService) {
        var _this = _super.call(this, authenticationService, router, appConfigService) || this;
        _this.jwtHelperService = jwtHelperService;
        _this.ticketChangeBind = _this.ticketChange.bind(_this);
        window.addEventListener('storage', _this.ticketChangeBind);
        return _this;
    }
    AuthGuard.prototype.ticketChange = function (event) {
        if (event.key === 'ticket-ECM' && event.newValue !== event.oldValue) {
            this.ticketChangeRedirect(event, 'ECM');
        }
        if (event.key === 'ticket-BPM' && event.newValue !== event.oldValue) {
            this.ticketChangeRedirect(event, 'BPM');
        }
        if (event.key === jwt_helper_service_1.JwtHelperService.USER_ACCESS_TOKEN &&
            this.jwtHelperService.getValueFromToken(event.newValue, jwt_helper_service_1.JwtHelperService.USER_PREFERRED_USERNAME) !==
                this.jwtHelperService.getValueFromToken(event.oldValue, jwt_helper_service_1.JwtHelperService.USER_PREFERRED_USERNAME)) {
            this.ticketChangeRedirect(event, 'ALL');
        }
    };
    AuthGuard.prototype.ticketChangeRedirect = function (event, provider) {
        if (!event.newValue) {
            this.redirectToUrl(provider, this.router.url);
        }
        else {
            window.location.reload();
        }
        window.removeEventListener('storage', this.ticketChangeBind);
    };
    AuthGuard.prototype.checkLogin = function (activeRoute, redirectUrl) {
        if (this.authenticationService.isLoggedIn() || this.withCredentials) {
            return true;
        }
        if (!this.authenticationService.isOauth() || this.isOAuthWithoutSilentLogin()) {
            this.redirectToUrl('ALL', redirectUrl);
        }
        return false;
    };
    AuthGuard = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [jwt_helper_service_1.JwtHelperService,
            authentication_service_1.AuthenticationService,
            router_1.Router,
            app_config_service_1.AppConfigService])
    ], AuthGuard);
    return AuthGuard;
}(auth_guard_base_1.AuthGuardBase));
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth-guard.service.js.map