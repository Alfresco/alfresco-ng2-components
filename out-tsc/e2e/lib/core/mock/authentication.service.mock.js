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
var rxjs_1 = require("rxjs");
// TODO: should be extending AuthenticationService
var AuthenticationMock /*extends AuthenticationService*/ = /** @class */ (function () {
    function AuthenticationMock() {
        this.redirectUrl = null;
    }
    AuthenticationMock.prototype.setRedirectUrl = function (url) {
        this.redirectUrl = url;
    };
    AuthenticationMock.prototype.getRedirectUrl = function () {
        return this.redirectUrl ? this.redirectUrl.url : null;
    };
    // TODO: real auth service returns Observable<string>
    AuthenticationMock.prototype.login = function (username, password) {
        if (username === 'fake-username' && password === 'fake-password') {
            return rxjs_1.of({ type: 'type', ticket: 'ticket' });
        }
        if (username === 'fake-username-CORS-error' && password === 'fake-password') {
            return rxjs_1.throwError({
                error: {
                    crossDomain: true,
                    message: 'ERROR: the network is offline, Origin is not allowed by Access-Control-Allow-Origin'
                }
            });
        }
        if (username === 'fake-username-CSRF-error' && password === 'fake-password') {
            return rxjs_1.throwError({ message: 'ERROR: Invalid CSRF-token', status: 403 });
        }
        if (username === 'fake-username-ECM-access-error' && password === 'fake-password') {
            return rxjs_1.throwError({ message: 'ERROR: 00170728 Access Denied.  The system is currently in read-only mode', status: 403 });
        }
        return rxjs_1.throwError('Fake server error');
    };
    return AuthenticationMock;
}());
exports.AuthenticationMock = AuthenticationMock;
//# sourceMappingURL=authentication.service.mock.js.map