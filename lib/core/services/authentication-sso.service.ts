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
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { AppConfigService } from '../app-config/app-config.service';
import { AuthConfig, OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { AuthTokenProcessorService } from './auth-token-processor.service';
import { Router } from '@angular/router';
import { AlfrescoApiService } from './alfresco-api.service';
import { UserPreferencesService } from './user-preferences.service';
import { OauthConfigModel } from '../models/oauth-config.model';

@Injectable()
export class AuthenticationSSOService {

    private bearerExcludedUrls: string[];
    private redirectUri: string;
    constructor(
        private router: Router,
        private alfrescoApi: AlfrescoApiService,
        private tokenService: AuthTokenProcessorService,
        private userPreference: UserPreferencesService,
        private appConfig: AppConfigService, private oauthService: OAuthService) {
        this.oauthService.setStorage(localStorage);
        this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    }

    token: string;

    checkLogin(redirectUrl: string, data: any): Observable<boolean> {
        if (this.bearerExcludedUrls === undefined) {
            this.bearerExcludedUrls = this.appConfig.get('oauth2.bearerExcludedUrls', []);
        }
        return Observable.of(this.oauthService.hasValidAccessToken())
            .map(loggedIn => {
                if (!loggedIn && data && data.role) {
                    loggedIn = this.tokenService.hasRole(data.role);
                }

                if (!loggedIn) {
                    this.logOut();
                }
                const apiInstance = this.alfrescoApi.getInstance();
                if (apiInstance && apiInstance.oauth2Auth) {
                    const authAPI: any = apiInstance.oauth2Auth;
                    authAPI.authentications.basicAuth.accessToken = this.oauthService.getAccessToken();
                }
                return loggedIn;
            });
    }

    getToken(): string {
        return this.oauthService.getIdToken();
    }

    logOut(noRedirectToLogoutUrl?: boolean) {
        const idToken = this.oauthService.getIdToken();
        localStorage.removeItem('session_state');
        this.oauthService.logOut();
        if (!idToken) {
            window.location.reload();
        }
    }

    removeTicket() {
        this.logOut(true);
    }

    getBearerExcludedUrls(): string[] {
        return this.bearerExcludedUrls;
    }

    refreshToken(): Observable<any> {
        return Observable.fromPromise(this.oauthService.refreshToken());
    }

    addTokenToHeader(headersArg?: HttpHeaders): Observable<HttpHeaders> {
        return Observable.create(async (observer: Observer<any>) => {
            let headers = headersArg;
            if (!headers) {
                headers = new HttpHeaders();
            }
            try {
                const token: string = this.getToken();
                headers = headers.set('Authorization', 'bearer ' + token);
                observer.next(headers);
                observer.complete();
            } catch (error) {
                observer.error(error);
            }
        });
    }

    async loadDiscoveryDocumentAndLogin() {
        await this.configureWithNewConfigApi();
        if (this.oauthService.hasValidAccessToken()) {
            this.redirectUri = this.userPreference.oauthConfig.redirectUri;
            this.router.navigate([this.redirectUri]);
        } else {
            await this.oauthService.loadDiscoveryDocumentAndLogin();
        }
    }

    async configureWithNewConfigApi() {
        const authConfig: AuthConfig = this.createAuthConfigFromJSON();
        this.oauthService.configure(authConfig);
    }

    private createAuthConfigFromJSON(): AuthConfig {
        const oauthConfig: OauthConfigModel = this.userPreference.oauthConfig;
        return {
            issuer: oauthConfig.host,
            clientId: oauthConfig.clientId,
            redirectUri: window.location.origin + oauthConfig.redirectUri || '/',
            scope: oauthConfig.scope,
            requireHttps: oauthConfig.requireHttps,
            silentRefreshRedirectUri: window.location.origin + oauthConfig.silentRefreshRedirectUri || '',
            showDebugInformation: oauthConfig.showDebugInformation || false,
            sessionChecksEnabled: oauthConfig.sessionChecksEnabled || false
        };
    }

}
