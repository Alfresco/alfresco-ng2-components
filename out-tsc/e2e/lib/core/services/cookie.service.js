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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CookieService = /** @class */ (function () {
    function CookieService() {
    }
    /**
     * Checks if cookies are enabled.
     * @returns True if enabled, false otherwise
     */
    CookieService.prototype.isEnabled = function () {
        // for certain scenarios Chrome may say 'true' but have cookies still disabled
        if (navigator.cookieEnabled === false) {
            return false;
        }
        document.cookie = 'test-cookie';
        return document.cookie.indexOf('test-cookie') >= 0;
    };
    /**
     * Retrieves a cookie by its key.
     * @param key Key to identify the cookie
     * @returns The cookie data or null if it is not found
     */
    CookieService.prototype.getItem = function (key) {
        var regexp = new RegExp('(?:' + key + '|;\s*' + key + ')=(.*?)(?:;|$)', 'g');
        var result = regexp.exec(document.cookie);
        return (result === null) ? null : result[1];
    };
    /**
     * Sets a cookie.
     * @param key Key to identify the cookie
     * @param data Data value to set for the cookie
     * @param expiration Expiration date of the data
     * @param path "Pathname" to store the cookie
     */
    CookieService.prototype.setItem = function (key, data, expiration, path) {
        document.cookie = key + "=" + data +
            (expiration ? ';expires=' + expiration.toUTCString() : '') +
            (path ? ";path=" + path : ';path=/');
    };
    /** Placeholder for testing purposes - do not use. */
    CookieService.prototype.clear = function () {
        /* placeholder for testing purposes */
    };
    CookieService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CookieService);
    return CookieService;
}());
exports.CookieService = CookieService;
//# sourceMappingURL=cookie.service.js.map