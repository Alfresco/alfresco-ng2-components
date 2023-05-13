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

import { Injectable, inject } from '@angular/core';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppConfigValues } from '../../app-config/app-config.service';
import { BaseAuthenticationService } from '../../services/base-authentication.service';
import { JwtHelperService } from '../services/jwt-helper.service';
import { AuthConfigService } from '../oidc/auth-config.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class OIDCAuthenticationService extends BaseAuthenticationService {
    private authStorage = inject(OAuthStorage);
    private oauthService = inject(OAuthService);
    private readonly authConfig = inject(AuthConfigService);
    private readonly auth = inject(AuthService);

    readonly supportCodeFlow = true;

    constructor() {
        super();
        this.alfrescoApi.alfrescoApiInitialized.subscribe(() => {
            this.alfrescoApi.getInstance().reply('logged-in', () => {
                this.onLogin.next();
            });
        });
    }

    isEcmLoggedIn(): boolean {
        return this.isLoggedIn();
    }

    isBpmLoggedIn(): boolean {
        return this.isLoggedIn();
    }

    isLoggedIn(): boolean {
        return this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken();
    }

    isLoggedInWith(_provider?: string): boolean {
        return this.isLoggedIn();
    }

    isOauth(): boolean {
        return this.appConfig.get(AppConfigValues.AUTHTYPE) === 'OAUTH';
    }

    isImplicitFlow(): boolean {
        return !!this.appConfig.oauth2?.implicitFlow;
    }

    isAuthCodeFlow(): boolean {
        return !!this.appConfig.oauth2?.codeFlow;
    }

    login(username: string, password: string, rememberMe: boolean = false): Observable<{ type: string; ticket: any }> {
        return this.auth.baseAuthLogin(username, password).pipe(
            map((response) => {
                this.saveRememberMeCookie(rememberMe);
                this.onLogin.next(response);
                return {
                    type: this.appConfig.get(AppConfigValues.PROVIDERS),
                    ticket: response
                };
            }),
            catchError((err) => this.handleError(err))
        );
    }

    ssoImplicitLogin() {
        this.oauthService.initLoginFlow();
    }

    ssoCodeFlowLogin() {
        this.oauthService.initCodeFlow();
    }

    isRememberMeSet(): boolean {
        return true;
    }

    logout() {
        this.oauthService.logOut();
        return EMPTY;
    }

    getToken(): string {
        return this.authStorage.getItem(JwtHelperService.USER_ACCESS_TOKEN);
    }

    reset(): void {
        const config = this.authConfig.loadAppConfig();
        this.auth.updateIDPConfiguration(config);
        const oauth2 = this.appConfig.oauth2;

        if (config.oidc && oauth2.silentLogin) {
            this.auth.login();
        }
    }
}
