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
var StringUtil = /** @class */ (function () {
    function StringUtil() {
    }
    StringUtil.generatePasswordString = function (length) {
        if (length === void 0) { length = 8; }
        var text = '';
        var possibleUpperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var possibleLowerCase = 'abcdefghijklmnopqrstuvwxyz';
        var lowerCaseLimit = Math.floor(length / 2);
        for (var i = 0; i < lowerCaseLimit; i++) {
            text += possibleLowerCase.charAt(Math.floor(Math.random() * possibleLowerCase.length));
        }
        for (var i = 0; i < length - lowerCaseLimit; i++) {
            text += possibleUpperCase.charAt(Math.floor(Math.random() * possibleUpperCase.length));
        }
        return text;
    };
    /**
     * Generates a random string.
     *
     * @param length If this parameter is not provided the length is set to 8 by default.
     * @method generateRandomString
     */
    StringUtil.generateRandomString = function (length) {
        if (length === void 0) { length = 8; }
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
    /**
     * Generates a random email address following the format: abcdef@activiti.test.com
     *
     * @param domain
     * @param length
     * @method generateRandomEmail
     */
    StringUtil.generateRandomEmail = function (domain, length) {
        if (length === void 0) { length = 5; }
        var email = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
            email += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        email += domain;
        return email.toLowerCase();
    };
    /**
     * Generates a random string - digits only.
     *
     * @param length {int} If this parameter is not provided the length is set to 8 by default.
     * @method generateRandomString
     */
    StringUtil.generateRandomStringDigits = function (length) {
        if (length === void 0) { length = 8; }
        var text = '';
        var possible = '0123456789';
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
    /**
     * Generates a random string - non-latin characters only.
     *
     * @param length {int} If this parameter is not provided the length is set to 3 by default.
     * @method generateRandomString
     */
    StringUtil.generateRandomStringNonLatin = function (length) {
        if (length === void 0) { length = 3; }
        var text = '';
        var possible = '密码你好𠮷';
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
    return StringUtil;
}());
exports.StringUtil = StringUtil;
//# sourceMappingURL=string.util.js.map