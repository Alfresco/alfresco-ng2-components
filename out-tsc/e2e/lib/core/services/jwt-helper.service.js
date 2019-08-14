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
var JwtHelperService = /** @class */ (function () {
    function JwtHelperService() {
    }
    JwtHelperService_1 = JwtHelperService;
    /**
     * Decodes a JSON web token into a JS object.
     * @param token Token in encoded form
     * @returns Decoded token data object
     */
    JwtHelperService.prototype.decodeToken = function (token) {
        var parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }
        var decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }
        return JSON.parse(decoded);
    };
    JwtHelperService.prototype.urlBase64Decode = function (token) {
        var output = token.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: {
                break;
            }
            case 2: {
                output += '==';
                break;
            }
            case 3: {
                output += '=';
                break;
            }
            default: {
                throw new Error('Illegal base64url string!');
            }
        }
        return decodeURIComponent(escape(window.atob(output)));
    };
    /**
     * Gets a named value from the user access token.
     * @param key Key name of the field to retrieve
     * @returns Value from the token
     */
    JwtHelperService.prototype.getValueFromLocalAccessToken = function (key) {
        return this.getValueFromToken(this.getAccessToken(), key);
    };
    /**
     * Gets access token
     * @returns access token
     */
    JwtHelperService.prototype.getAccessToken = function () {
        return localStorage.getItem(JwtHelperService_1.USER_ACCESS_TOKEN);
    };
    /**
     * Gets a named value from the user access token.
     * @param key accessToken
     * @param key Key name of the field to retrieve
     * @returns Value from the token
     */
    JwtHelperService.prototype.getValueFromToken = function (accessToken, key) {
        var value;
        if (accessToken) {
            var tokenPayload = this.decodeToken(accessToken);
            value = tokenPayload[key];
        }
        return value;
    };
    var JwtHelperService_1;
    JwtHelperService.USER_NAME = 'name';
    JwtHelperService.FAMILY_NAME = 'family_name';
    JwtHelperService.GIVEN_NAME = 'given_name';
    JwtHelperService.USER_EMAIL = 'email';
    JwtHelperService.USER_ACCESS_TOKEN = 'access_token';
    JwtHelperService.USER_PREFERRED_USERNAME = 'preferred_username';
    JwtHelperService = JwtHelperService_1 = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], JwtHelperService);
    return JwtHelperService;
}());
exports.JwtHelperService = JwtHelperService;
//# sourceMappingURL=jwt-helper.service.js.map