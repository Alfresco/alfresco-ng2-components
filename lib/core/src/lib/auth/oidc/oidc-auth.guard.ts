/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class OidcAuthGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._isAuthenticated(state);
  }

  canActivateChild(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._isAuthenticated(state);
  }

  private _isAuthenticated(state: RouterStateSnapshot) {
    if (this.auth.authenticated) {
      return true;
    }

    const loginResult = this.auth.login(state.url);

    if (loginResult instanceof Promise) {
      return loginResult.then(() => true).catch(() => false);
    }

    return false;
  }

}
