/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationSSOService } from './authentication-sso.service';
import { AuthTokenProcessorService } from './auth-token-processor.service';

@Injectable()
export class AuthGuardSSO implements CanActivate {
    constructor(
        private authService: AuthenticationSSOService,
        private tokenService: AuthTokenProcessorService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        return this.checkLogin(state.url, route.data);
    }

    checkLogin(redirectUrl: string, data: any): Observable<boolean> {
        return Observable.of(this.authService.isLoggedIn()).
            switchMap((result: boolean) => {
                if (!result && this.authService.getRefreshToken()) {
                    return this.authService.refreshToken()
                        .map((token) => {
                            return !!token;
                        });
                }
                return Observable.of(result);
            }).map(loggedIn => {
                if (!loggedIn && data) {
                    loggedIn = this.tokenService.hasRole(data.role);
                }

                if (!loggedIn) {
                    this.logout();
                }
                return loggedIn;
            });
    }

    private logout(): void {
        this.authService.logout();
    }
}
