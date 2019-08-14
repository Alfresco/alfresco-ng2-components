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
var rxjs_1 = require("rxjs");
var alfresco_api_service_1 = require("./alfresco-api.service");
var cookie_service_1 = require("./cookie.service");
var log_service_1 = require("./log.service");
var app_config_service_1 = require("../app-config/app-config.service");
var operators_1 = require("rxjs/operators");
var http_1 = require("@angular/common/http");
var jwt_helper_service_1 = require("./jwt-helper.service");
var REMEMBER_ME_COOKIE_KEY = 'ALFRESCO_REMEMBER_ME';
var REMEMBER_ME_UNTIL = 1000 * 60 * 60 * 24 * 30;
var AuthenticationService = /** @class */ (function () {
    function AuthenticationService(appConfig, alfrescoApi, cookie, logService) {
        this.appConfig = appConfig;
        this.alfrescoApi = alfrescoApi;
        this.cookie = cookie;
        this.logService = logService;
        this.redirectUrl = null;
        this.bearerExcludedUrls = ['auth/realms', 'resources/', 'assets/'];
        this.onLogin = new rxjs_1.Subject();
        this.onLogout = new rxjs_1.Subject();
    }
    /**
     * Checks if the user logged in.
     * @returns True if logged in, false otherwise
     */
    AuthenticationService.prototype.isLoggedIn = function () {
        if (!this.isOauth() && this.cookie.isEnabled() && !this.isRememberMeSet()) {
            return false;
        }
        return this.alfrescoApi.getInstance().isLoggedIn();
    };
    /**
     * Does the provider support OAuth?
     * @returns True if supported, false otherwise
     */
    AuthenticationService.prototype.isOauth = function () {
        return this.alfrescoApi.getInstance().isOauthConfiguration();
    };
    /**
     * Does the provider support ECM?
     * @returns True if supported, false otherwise
     */
    AuthenticationService.prototype.isECMProvider = function () {
        return this.alfrescoApi.getInstance().isEcmConfiguration();
    };
    /**
     * Does the provider support BPM?
     * @returns True if supported, false otherwise
     */
    AuthenticationService.prototype.isBPMProvider = function () {
        return this.alfrescoApi.getInstance().isBpmConfiguration();
    };
    /**
     * Does the provider support both ECM and BPM?
     * @returns True if both are supported, false otherwise
     */
    AuthenticationService.prototype.isALLProvider = function () {
        return this.alfrescoApi.getInstance().isEcmBpmConfiguration();
    };
    /**
     * Logs the user in.
     * @param username Username for the login
     * @param password Password for the login
     * @param rememberMe Stores the user's login details if true
     * @returns Object with auth type ("ECM", "BPM" or "ALL") and auth ticket
     */
    AuthenticationService.prototype.login = function (username, password, rememberMe) {
        var _this = this;
        if (rememberMe === void 0) { rememberMe = false; }
        return rxjs_1.from(this.alfrescoApi.getInstance().login(username, password))
            .pipe(operators_1.map(function (response) {
            _this.saveRememberMeCookie(rememberMe);
            _this.onLogin.next(response);
            return {
                type: _this.appConfig.get(app_config_service_1.AppConfigValues.PROVIDERS),
                ticket: response
            };
        }), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Logs the user in with SSO
     */
    AuthenticationService.prototype.ssoImplicitLogin = function () {
        this.alfrescoApi.getInstance().implicitLogin();
    };
    /**
     * Saves the "remember me" cookie as either a long-life cookie or a session cookie.
     * @param rememberMe Enables a long-life cookie
     */
    AuthenticationService.prototype.saveRememberMeCookie = function (rememberMe) {
        var expiration = null;
        if (rememberMe) {
            expiration = new Date();
            var time = expiration.getTime();
            var expireTime = time + REMEMBER_ME_UNTIL;
            expiration.setTime(expireTime);
        }
        this.cookie.setItem(REMEMBER_ME_COOKIE_KEY, '1', expiration, null);
    };
    /**
     * Checks whether the "remember me" cookie was set or not.
     * @returns True if set, false otherwise
     */
    AuthenticationService.prototype.isRememberMeSet = function () {
        return (this.cookie.getItem(REMEMBER_ME_COOKIE_KEY) === null) ? false : true;
    };
    /**
     * Logs the user out.
     * @returns Response event called when logout is complete
     */
    AuthenticationService.prototype.logout = function () {
        var _this = this;
        return rxjs_1.from(this.callApiLogout())
            .pipe(operators_1.tap(function (response) {
            _this.onLogout.next(response);
            return response;
        }), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    AuthenticationService.prototype.callApiLogout = function () {
        if (this.alfrescoApi.getInstance()) {
            return this.alfrescoApi.getInstance().logout();
        }
    };
    /**
     * Gets the ECM ticket stored in the Storage.
     * @returns The ticket or `null` if none was found
     */
    AuthenticationService.prototype.getTicketEcm = function () {
        return this.alfrescoApi.getInstance().getTicketEcm();
    };
    /**
     * Gets the BPM ticket stored in the Storage.
     * @returns The ticket or `null` if none was found
     */
    AuthenticationService.prototype.getTicketBpm = function () {
        return this.alfrescoApi.getInstance().getTicketBpm();
    };
    /**
     * Gets the BPM ticket from the Storage in Base 64 format.
     * @returns The ticket or `null` if none was found
     */
    AuthenticationService.prototype.getTicketEcmBase64 = function () {
        var ticket = this.alfrescoApi.getInstance().getTicketEcm();
        if (ticket) {
            return 'Basic ' + btoa(ticket);
        }
        return null;
    };
    /**
     * Checks if the user is logged in on an ECM provider.
     * @returns True if logged in, false otherwise
     */
    AuthenticationService.prototype.isEcmLoggedIn = function () {
        if (this.isECMProvider() || this.isALLProvider()) {
            if (!this.isOauth() && this.cookie.isEnabled() && !this.isRememberMeSet()) {
                return false;
            }
            return this.alfrescoApi.getInstance().isEcmLoggedIn();
        }
        return false;
    };
    /**
     * Checks if the user is logged in on a BPM provider.
     * @returns True if logged in, false otherwise
     */
    AuthenticationService.prototype.isBpmLoggedIn = function () {
        if (this.isBPMProvider() || this.isALLProvider()) {
            if (!this.isOauth() && this.cookie.isEnabled() && !this.isRememberMeSet()) {
                return false;
            }
            return this.alfrescoApi.getInstance().isBpmLoggedIn();
        }
        return false;
    };
    /**
     * Gets the ECM username.
     * @returns The ECM username
     */
    AuthenticationService.prototype.getEcmUsername = function () {
        return this.alfrescoApi.getInstance().getEcmUsername();
    };
    /**
     * Gets the BPM username
     * @returns The BPM username
     */
    AuthenticationService.prototype.getBpmUsername = function () {
        return this.alfrescoApi.getInstance().getBpmUsername();
    };
    /** Sets the URL to redirect to after login.
     * @param url URL to redirect to
     */
    AuthenticationService.prototype.setRedirect = function (url) {
        this.redirectUrl = url;
    };
    /** Gets the URL to redirect to after login.
     * @returns The redirect URL
     */
    AuthenticationService.prototype.getRedirect = function () {
        var provider = this.appConfig.get(app_config_service_1.AppConfigValues.PROVIDERS);
        return this.hasValidRedirection(provider) ? this.redirectUrl.url : null;
    };
    /**
     * Gets information about the user currently logged into APS.
     * @returns User information
     */
    AuthenticationService.prototype.getBpmLoggedUser = function () {
        return rxjs_1.from(this.alfrescoApi.getInstance().activiti.profileApi.getProfile());
    };
    AuthenticationService.prototype.hasValidRedirection = function (provider) {
        return this.redirectUrl && (this.redirectUrl.provider === provider || this.hasSelectedProviderAll(provider));
    };
    AuthenticationService.prototype.hasSelectedProviderAll = function (provider) {
        return this.redirectUrl && (this.redirectUrl.provider === 'ALL' || provider === 'ALL');
    };
    /**
     * Prints an error message in the console browser
     * @param error Error message
     * @returns Object representing the error message
     */
    AuthenticationService.prototype.handleError = function (error) {
        this.logService.error('Error when logging in', error);
        return rxjs_1.throwError(error || 'Server error');
    };
    /**
     * Gets the set of URLs that the token bearer is excluded from.
     * @returns Array of URL strings
     */
    AuthenticationService.prototype.getBearerExcludedUrls = function () {
        return this.bearerExcludedUrls;
    };
    /**
     * Gets the auth token.
     * @returns Auth token string
     */
    AuthenticationService.prototype.getToken = function () {
        return localStorage.getItem(jwt_helper_service_1.JwtHelperService.USER_ACCESS_TOKEN);
    };
    /**
     * Adds the auth token to an HTTP header using the 'bearer' scheme.
     * @param headersArg Header that will receive the token
     * @returns The new header with the token added
     */
    AuthenticationService.prototype.addTokenToHeader = function (headersArg) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            var headers = headersArg;
            if (!headers) {
                headers = new http_1.HttpHeaders();
            }
            try {
                var token = _this.getToken();
                headers = headers.set('Authorization', 'bearer ' + token);
                observer.next(headers);
                observer.complete();
            }
            catch (error) {
                observer.error(error);
            }
        });
    };
    /**
     * Checks if SSO is configured correctly.
     * @returns True if configured correctly, false otherwise
     */
    AuthenticationService.prototype.isSSODiscoveryConfigured = function () {
        return this.alfrescoApi.getInstance().storage.getItem('discovery') ? true : false;
    };
    AuthenticationService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [app_config_service_1.AppConfigService,
            alfresco_api_service_1.AlfrescoApiService,
            cookie_service_1.CookieService,
            log_service_1.LogService])
    ], AuthenticationService);
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map