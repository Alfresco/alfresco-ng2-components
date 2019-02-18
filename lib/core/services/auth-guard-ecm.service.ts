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
import {
    ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router
} from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { AppConfigService, AppConfigValues } from '../app-config/app-config.service';
import { OauthConfigModel } from '../models/oauth-config.model';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardEcm implements CanActivate {

    constructor(private authService: AuthenticationService,
                private router: Router,
                private appConfigService: AppConfigService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.checkLogin(state.url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    checkLogin(redirectUrl: string): boolean {
        let withCredentialsMode = this.appConfigService.get<boolean>('auth.withCredentials', false);

        if (this.authService.isEcmLoggedIn() || withCredentialsMode) {
            return true;
        }

        if (!this.authService.isOauth() || this.isOAuthWithoutSilentLogin()) {
            this.authService.setRedirect({ provider: 'ECM', url: redirectUrl });
            const pathToLogin = this.getRouteDestinationForLogin();
            this.router.navigate(['/' + pathToLogin]);
        }

        return false;
    }

    isOAuthWithoutSilentLogin() {
        let oauth: OauthConfigModel = this.appConfigService.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null);
        return this.authService.isOauth() && oauth.silentLogin === false;
    }

    private getRouteDestinationForLogin(): string {
        return this.appConfigService &&
        this.appConfigService.get<string>(AppConfigValues.LOGIN_ROUTE) ?
            this.appConfigService.get<string>(AppConfigValues.LOGIN_ROUTE) : 'login';
    }
}
