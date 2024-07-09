/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const ROUTE_DEFAULT = '/';

@Injectable({
    providedIn: 'root'
})
export class OidcAuthGuard {
    constructor(private auth: AuthService, private _router: Router) {}

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this._isAuthenticated();
    }

    canActivateChild() {
        return this._isAuthenticated();
    }

    private _isAuthenticated() {
        if (this.auth.authenticated) {
            return true;
        }

        return this.auth
            .loginCallback({ customHashFragment: window.location.search })
            .then((route) => this._router.navigateByUrl(route, { replaceUrl: true }))
            .catch(() => this._router.navigateByUrl(ROUTE_DEFAULT, { replaceUrl: true }));
    }
}
