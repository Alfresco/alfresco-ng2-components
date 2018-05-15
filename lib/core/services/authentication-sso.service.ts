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

@Injectable()
export class AuthenticationSSOService {

    private bearerExcludedUrls: string[];

    constructor(
        private router: Router,
        private tokenService: AuthTokenProcessorService,
        private appConfig: AppConfigService, private oauthService: OAuthService) {
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
                return loggedIn;
            });
    }

    getToken(): string {
        return this.oauthService.getIdToken();
    }

    logOut() {
        this.oauthService.logOut();
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
            const redirectUri = this.appConfig.get('oauth2.redirectUri', '');
            this.router.navigate([redirectUri]);
        } else {
            await this.oauthService.loadDiscoveryDocumentAndLogin();
        }
    }

    async configureWithNewConfigApi() {
        const authConfig: AuthConfig = this.createAuthConfigFromJSON();
        this.oauthService.configure(authConfig);
        this.oauthService.setStorage(localStorage);
        this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    }

    private createAuthConfigFromJSON(): AuthConfig {
        return {
            issuer: this.appConfig.get('oauth2.host'),
            redirectUri: window.location.origin + this.appConfig.get('oauth2.redirectUri', ''),
            requireHttps: this.appConfig.get('oauth2.requireHttps', true),
            silentRefreshRedirectUri: window.location.origin + this.appConfig.get('oauth2.silentRefreshRedirectUri', ''),
            clientId: this.appConfig.get('oauth2.clientId'),
            scope: this.appConfig.get('oauth2.scope'),
            showDebugInformation: this.appConfig.get('oauth2.showDebugInformation', false),
            sessionChecksEnabled: this.appConfig.get('oauth2.sessionChecksEnabled', false)
        };
    }

}
