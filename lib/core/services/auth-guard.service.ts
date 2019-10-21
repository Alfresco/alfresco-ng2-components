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

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { AppConfigService } from '../app-config/app-config.service';
import { AuthGuardBase } from './auth-guard-base';
import { JwtHelperService } from './jwt-helper.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard extends AuthGuardBase {

    ticketChangeBind: any;

    constructor(private jwtHelperService: JwtHelperService,
                authenticationService: AuthenticationService,
                router: Router,
                appConfigService: AppConfigService) {
        super(authenticationService, router, appConfigService);
        this.ticketChangeBind = this.ticketChange.bind(this);

        window.addEventListener('storage', this.ticketChangeBind);
    }

    ticketChange(event: StorageEvent) {
        if (event.key === 'ticket-ECM' && event.newValue !== event.oldValue) {
            this.ticketChangeRedirect(event, 'ECM');
        }

        if (event.key === 'ticket-BPM' && event.newValue !== event.oldValue) {
            this.ticketChangeRedirect(event, 'BPM');
        }

        if (event.key === JwtHelperService.USER_ACCESS_TOKEN &&
            this.jwtHelperService.getValueFromToken(event.newValue, JwtHelperService.USER_PREFERRED_USERNAME) !==
            this.jwtHelperService.getValueFromToken(event.oldValue, JwtHelperService.USER_PREFERRED_USERNAME)) {
            this.ticketChangeRedirect(event, 'ALL');
        }
    }

    private ticketChangeRedirect(event: StorageEvent, provider: string) {
        if (!event.newValue) {
            this.redirectToUrl(provider, this.router.url);
        } else {
            window.location.reload();
        }

        window.removeEventListener('storage', this.ticketChangeBind);
    }

    checkLogin(_: ActivatedRouteSnapshot, redirectUrl: string): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authenticationService.isLoggedIn() || this.withCredentials) {
            return true;
        }
        this.redirectToUrl('ALL', redirectUrl);
        return false;
    }
}
