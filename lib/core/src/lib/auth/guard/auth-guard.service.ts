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

import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { isLoginFragmentPresent, navigate, redirectSSOSuccessURL, redirectToUrl, withCredentials } from './auth-guard-functions';
import { JwtHelperService } from '../services/jwt-helper.service';
import { Observable } from 'rxjs';

const authenticationService = inject(AuthenticationService);

@Injectable({
    providedIn: 'root'
})
class TicketChangeRedirectService {
    ticketChangeBind: any;

    constructor(
        private jwtHelperService: JwtHelperService,
        private router: Router
    ) {
        this.ticketChangeBind = this.ticketChange.bind(this);
        window.addEventListener('storage', this.ticketChangeBind);
    }

    ticketChange(event: StorageEvent) {
        if (event.key.includes('ticket-ECM') && event.newValue !== event.oldValue) {
            this.ticketChangeRedirect(event);
        }

        if (event.key.includes('ticket-BPM') && event.newValue !== event.oldValue) {
            this.ticketChangeRedirect(event);
        }

        if (
            event.key.endsWith(JwtHelperService.USER_ACCESS_TOKEN) &&
            this.jwtHelperService.getValueFromToken(event.newValue, JwtHelperService.USER_PREFERRED_USERNAME) !==
                this.jwtHelperService.getValueFromToken(event.oldValue, JwtHelperService.USER_PREFERRED_USERNAME)
        ) {
            this.ticketChangeRedirect(event);
        }
    }

    private ticketChangeRedirect(event: StorageEvent) {
        if (event.newValue) {
            navigate(this.router.url);
        } else {
            window.location.reload();
        }
    }
}

const checkLogin = async (_: ActivatedRouteSnapshot, redirectUrl: string): Promise<boolean | UrlTree> => {
    if (authenticationService.isLoggedIn() || withCredentials()) {
        return true;
    }
    return redirectToUrl(redirectUrl);
};

export const AuthGuard = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    inject(TicketChangeRedirectService);
    if (authenticationService.isLoggedIn() && authenticationService.isOauth() && isLoginFragmentPresent()) {
        return redirectSSOSuccessURL();
    }
    return checkLogin(route, state.url);
};
