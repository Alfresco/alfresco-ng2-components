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
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AuthGuardBaseService } from './auth-guard-base';
import { JwtHelperService } from '../services/jwt-helper.service';

const ticketChangeRedirect = (event: StorageEvent, authGuardBaseService: AuthGuardBaseService, url: string): void => {
    if (event.newValue) {
        authGuardBaseService.navigate(url);
    } else {
        window.location.reload();
    }
};

const ticketChangeHandler = (
    event: StorageEvent,
    authGuardBaseService: AuthGuardBaseService,
    jwtHelperService: JwtHelperService,
    url: string
): void => {
    if (event.newValue !== event.oldValue) {
        if (event.key.includes('ticket-ECM') || event.key.includes('ticket-BPM')) {
            ticketChangeRedirect(event, authGuardBaseService, url);
        }
    }

    if (
        event.key.endsWith(JwtHelperService.USER_ACCESS_TOKEN) &&
        jwtHelperService.getValueFromToken(event.newValue, JwtHelperService.USER_PREFERRED_USERNAME) !==
            jwtHelperService.getValueFromToken(event.oldValue, JwtHelperService.USER_PREFERRED_USERNAME)
    ) {
        ticketChangeRedirect(event, authGuardBaseService, url);
    }
};

export const AuthGuard: CanActivateFn = async (_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
    const router = inject(Router);
    const jwtHelperService = inject(JwtHelperService);
    const authGuardBaseService = inject(AuthGuardBaseService);
    const authenticationService = inject(AuthenticationService);

    window.addEventListener('storage', (event: StorageEvent) => ticketChangeHandler(event, authGuardBaseService, jwtHelperService, router.url));

    if (authenticationService.isLoggedIn() || authGuardBaseService.withCredentials) {
        return true;
    }

    return authGuardBaseService.redirectToUrl(state.url);
};
