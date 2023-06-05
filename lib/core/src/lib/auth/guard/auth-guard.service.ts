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
import { ActivatedRouteSnapshot,  UrlTree } from '@angular/router';
import { AuthGuardBase } from './auth-guard-base';
import { JwtHelperService } from '../services/jwt-helper.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard extends AuthGuardBase {

    ticketChangeBind: any;

    constructor(private jwtHelperService: JwtHelperService) {
        super();
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

        if (event.key.endsWith(JwtHelperService.USER_ACCESS_TOKEN) &&
            this.jwtHelperService.getValueFromToken(event.newValue, JwtHelperService.USER_PREFERRED_USERNAME) !==
            this.jwtHelperService.getValueFromToken(event.oldValue, JwtHelperService.USER_PREFERRED_USERNAME)) {
            this.ticketChangeRedirect(event);
        }
    }

    private ticketChangeRedirect(event: StorageEvent) {
        if (event.newValue) {
            this.navigate(this.router.url);
        } else {
            window.location.reload();
        }
    }

    async checkLogin(_: ActivatedRouteSnapshot, redirectUrl: string): Promise<boolean | UrlTree> {
        if (this.authenticationService.isLoggedIn() || this.withCredentials) {
            return true;
        }
        return this.redirectToUrl(redirectUrl);
    }
}
