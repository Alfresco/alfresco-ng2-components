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
    ActivatedRouteSnapshot, CanActivate, Router
} from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { AppConfigService, AppConfigValues } from '../app-config/app-config.service';
import { OauthConfigModel } from '../models/oauth-config.model';
import { AuthGuardBase } from './auth-guard-base';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardEcm extends AuthGuardBase implements CanActivate {

    constructor(authenticationService: AuthenticationService,
                router: Router,
                appConfigService: AppConfigService) {
        super(authenticationService, router, appConfigService);
    }

    checkLogin(activeRoute: ActivatedRouteSnapshot, redirectUrl: string): Observable<boolean> | Promise<boolean> | boolean {
        let withCredentialsMode = this.appConfigService.get<boolean>('auth.withCredentials', false);

        if (this.authenticationService.isEcmLoggedIn() || withCredentialsMode) {
            return true;
        }

        if (!this.authenticationService.isOauth() || this.isOAuthWithoutSilentLogin()) {
            this.redirectToUrl('ECM', redirectUrl);
        }

        return false;
    }

    isOAuthWithoutSilentLogin() {
        let oauth: OauthConfigModel = this.appConfigService.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null);
        return this.authenticationService.isOauth() && oauth.silentLogin === false;
    }
}
