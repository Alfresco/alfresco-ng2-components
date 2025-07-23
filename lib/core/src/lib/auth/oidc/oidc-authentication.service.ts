/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Observable, defer, EMPTY, combineLatest } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { OauthConfigModel } from '../models/oauth-config.model';
import { BaseAuthenticationService } from '../services/base-authentication.service';
import { CookieService } from '../../common/services/cookie.service';
import { JwtHelperService } from '../services/jwt-helper.service';
import { AuthConfigService } from './auth-config.service';
import { AuthService } from './auth.service';
import { Minimatch } from 'minimatch';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class OidcAuthenticationService extends BaseAuthenticationService {
    constructor(
        appConfig: AppConfigService,
        cookie: CookieService,
        private jwtHelperService: JwtHelperService,
        private authStorage: OAuthStorage,
        private oauthService: OAuthService,
        private readonly authConfig: AuthConfigService,
        private readonly auth: AuthService
    ) {
        super(appConfig, cookie);
    }

    /**
     * Observable that determines whether an SSO login should be performed.
     *
     * This observable combines the authentication status and the discovery document load status
     * to decide if an SSO login is necessary. It emits `true` if the user is not authenticated
     * and the discovery document is loaded, otherwise it emits `false`.
     */
    shouldPerformSsoLogin$: Observable<boolean> = combineLatest([this.auth.authenticated$, this.auth.isDiscoveryDocumentLoaded$]).pipe(
        map(([authenticated, isDiscoveryDocumentLoaded]) => !authenticated && isDiscoveryDocumentLoaded)
    );

    /**
     * @deprecated use `isLoggedIn` instead
     * @returns true if the ECM provider is logged in
     */
    isEcmLoggedIn(): boolean {
        if (this.isECMProvider() || this.isALLProvider()) {
            return this.isLoggedIn();
        }
        return false;
    }

    /**
     * @deprecated use `isLoggedIn` instead
     * @returns true if the BPM provider is logged in
     */
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
                    type: this.appConfig.get(AppConfigValues.PROVIDERS) as string,
                    ticket: accessToken
                };
            } catch (err) {
                throw this.handleError(err);
            }
        });
    }

    /**
     * Gets the username of the authenticated user.
     *
     * @returns the logged username
     */
    getUsername() {
        return this.jwtHelperService.getValueFromLocalToken<string>(JwtHelperService.USER_PREFERRED_USERNAME);
    }

    /**
     * @deprecated use `getUsername` instead
     * @returns the logged username
     */
    getEcmUsername(): string {
        return this.getUsername();
    }

    /**
     * @deprecated use `getUsername` instead
     * @returns the logged username
     */
    getBpmUsername(): string {
        return this.getUsername();
    }

    ssoLogin(redirectUrl?: string) {
        this.auth.login(redirectUrl);
    }

    isRememberMeSet(): boolean {
        return true;
    }

    logout() {
        const logoutOptions = this.getLogoutOptions();
        this.oauthService.logOut(logoutOptions);
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
            return (
                oauth2.publicUrls.length > 0 &&
                oauth2.publicUrls.some((urlPattern: string) => {
                    const minimatch = new Minimatch(urlPattern);
                    return minimatch.match(window.location.href);
                })
            );
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

    private getLogoutOptions(): object {
        const oauth2Config = this.appConfig.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null);
        const logoutParamsList = oauth2Config?.logoutParameters || [];

        return logoutParamsList.reduce((options, param) => {
            const value = this.getLogoutParamValue(param);
            if (value !== undefined) {
                options[param] = value;
            }
            return options;
        }, {});
    }

    private getLogoutParamValue(param: string): string | undefined {
        switch (param) {
            case 'client_id':
                return this.oauthService.clientId;
            case 'returnTo':
                return this.oauthService.redirectUri;
            case 'redirect_uri':
                return this.oauthService.redirectUri;
            case 'response_type':
                return 'code';
            default:
                return undefined;
        }
    }
}
