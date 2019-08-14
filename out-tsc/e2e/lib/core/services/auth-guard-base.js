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
Object.defineProperty(exports, "__esModule", { value: true });
var app_config_service_1 = require("../app-config/app-config.service");
var AuthGuardBase = /** @class */ (function () {
    function AuthGuardBase(authenticationService, router, appConfigService) {
        this.authenticationService = authenticationService;
        this.router = router;
        this.appConfigService = appConfigService;
    }
    Object.defineProperty(AuthGuardBase.prototype, "withCredentials", {
        get: function () {
            return this.appConfigService.get('auth.withCredentials', false);
        },
        enumerable: true,
        configurable: true
    });
    AuthGuardBase.prototype.canActivate = function (route, state) {
        return this.checkLogin(route, state.url);
    };
    AuthGuardBase.prototype.canActivateChild = function (route, state) {
        return this.canActivate(route, state);
    };
    AuthGuardBase.prototype.redirectToUrl = function (provider, url) {
        this.authenticationService.setRedirect({ provider: provider, url: url });
        var pathToLogin = this.getLoginRoute();
        var urlToRedirect = "/" + pathToLogin + "?redirectUrl=" + url;
        this.router.navigateByUrl(urlToRedirect);
    };
    AuthGuardBase.prototype.getLoginRoute = function () {
        return (this.appConfigService &&
            this.appConfigService.get(app_config_service_1.AppConfigValues.LOGIN_ROUTE, 'login'));
    };
    AuthGuardBase.prototype.isOAuthWithoutSilentLogin = function () {
        var oauth = this.appConfigService.get(app_config_service_1.AppConfigValues.OAUTHCONFIG, null);
        return (this.authenticationService.isOauth() && oauth.silentLogin === false);
    };
    return AuthGuardBase;
}());
exports.AuthGuardBase = AuthGuardBase;
//# sourceMappingURL=auth-guard-base.js.map