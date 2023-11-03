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
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { EMPTY, Observable, defer } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { OauthConfigModel } from '../models/oauth-config.model';
import { BaseAuthenticationService } from './base-authentication.service';
import { CookieService } from '../../common/services/cookie.service';
import { JwtHelperService } from './jwt-helper.service';
import { LogService } from '../../common/services/log.service';
import { AuthConfigService } from '../oidc/auth-config.service';
import { AuthService } from '../oidc/auth.service';
import { Minimatch } from 'minimatch';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class OidcAuthenticationService extends BaseAuthenticationService {

    constructor(
        appConfig: AppConfigService,
        cookie: CookieService,
        logService: LogService,
        private jwtHelperService: JwtHelperService,
        private authStorage: OAuthStorage,
        private oauthService: OAuthService,
        private readonly authConfig: AuthConfigService,
        private readonly auth: AuthService
    ) {
        super(appConfig, cookie, logService);
    }

    isEcmLoggedIn(): boolean {
        if (this.isECMProvider() || this.isALLProvider()) {
            return this.isLoggedIn();
        }
        return false;

    }

    isBpmLoggedIn(): boolean {
        if (this.isBPMProvider() || this.isALLProvider()) {
            return this.isLoggedIn();
        }
        return false;
    }

    isLoggedIn(): boolean {
        return this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken();
    }

    hasValidAccessToken(): boolean {
        return this.oauthService.hasValidAccessToken();
    }

    hasValidIdToken(): boolean {
        return this.oauthService.hasValidIdToken();
    }

    isImplicitFlow() {
        const oauth2: OauthConfigModel = Object.assign({}, this.appConfig.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null));
        return !!oauth2?.implicitFlow;
    }

    isAuthCodeFlow() {
        const oauth2: OauthConfigModel = Object.assign({}, this.appConfig.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null));
        return !!oauth2?.codeFlow;
    }

    login(username: string, password: string): Observable<{ type: string; ticket: any }> {
        return this.auth.baseAuthLogin(username, password).pipe(
            map((response) => {
                this.onLogin.next(response);
                return {
                    type: this.appConfig.get(AppConfigValues.PROVIDERS),
                    ticket: response
                };
            }),
            catchError((err) => this.handleError(err))
        );
    }

    loginWithPassword(username: string, password: string): Observable<{ type: string; ticket: any }> {
        return defer(async () => {
            try {
                await this.authConfig.loadConfig();
                await this.oauthService.loadDiscoveryDocument();
                await this.oauthService.fetchTokenUsingPasswordFlowAndLoadUserProfile(username, password);
                await this.oauthService.refreshToken();
                const accessToken = this.oauthService.getAccessToken();
                this.onLogin.next(accessToken);

                return {
                    type: <string>this.appConfig.get(AppConfigValues.PROVIDERS),
                    ticket: accessToken
                };
            } catch (err) {
                throw this.handleError(err);
            }
        });
    }

    getEcmUsername(): string {
        return this.jwtHelperService.getValueFromLocalToken<string>(JwtHelperService.USER_PREFERRED_USERNAME);
    }

    getBpmUsername(): string {
        return this.jwtHelperService.getValueFromLocalToken<string>(JwtHelperService.USER_PREFERRED_USERNAME);
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
    }

    isPublicUrl(): boolean {
        const oauth2 = this.appConfig.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null);

        if (Array.isArray(oauth2.publicUrls)) {
            return oauth2.publicUrls.length > 0 &&
                oauth2.publicUrls.some((urlPattern: string) => {
                    const minimatch = new Minimatch(urlPattern);
                    return minimatch.match(window.location.href);
                });
        }
        return false;
    }

    getAuthHeaders(_requestUrl: string, header: HttpHeaders): HttpHeaders {
        return this.addBearerToken(header);
    }

    private addBearerToken(header: HttpHeaders): HttpHeaders {
        const token: string = this.getToken();

        if (!token) {
            return header;
        }

        return header.set('Authorization', 'bearer ' + token);
    }

}
