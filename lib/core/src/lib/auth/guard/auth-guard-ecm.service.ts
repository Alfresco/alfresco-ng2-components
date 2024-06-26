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

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { isLoginFragmentPresent, redirectSSOSuccessURL, redirectToUrl, withCredentials } from './auth-guard-functions';
import { Observable } from 'rxjs';

const authenticationService = inject(AuthenticationService);

const checkLogin = async (_: ActivatedRouteSnapshot, redirectUrl: string): Promise<boolean | UrlTree> => {
    if (authenticationService.isEcmLoggedIn() || withCredentials()) {
        return true;
    }
    return redirectToUrl(redirectUrl);
};

export const AuthGuardEcm = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    if (authenticationService.isLoggedIn() && authenticationService.isOauth() && isLoginFragmentPresent()) {
        return redirectSSOSuccessURL();
    }
    return checkLogin(route, state.url);
};
