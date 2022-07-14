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

import { BaseAuthenticationService } from '@alfresco/adf-core/auth';
import { AlfrescoApiConfig, HttpClient, LegacyTicketApi, PeopleApi, UserProfileApi, UserRepresentation } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import minimatch from 'minimatch';
import { EMPTY, from, Observable, ReplaySubject, throwError } from 'rxjs';
import { AppConfigService, AppConfigValues } from '../app-config/app-config.service';
import { OauthConfigModel } from '../models/oauth-config.model';
import { RedirectionModel } from '../models/redirection.model';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { JwtHelperService } from '../services/jwt-helper.service';
import { LogService } from '../services/log.service';

@Injectable({
    providedIn: 'root'
})
export class OIDCAuthenticationService extends BaseAuthenticationService  {

    onLogin: ReplaySubject<any> = new ReplaySubject<any>(1);
    onLogout: ReplaySubject<any> = new ReplaySubject<any>(1);

    _peopleApi: PeopleApi;
    get peopleApi(): PeopleApi {
        this._peopleApi = this._peopleApi ?? new PeopleApi(this.alfrescoApi.getInstance());
        return this._peopleApi;
    }

    _profileApi: UserProfileApi;
    get profileApi(): UserProfileApi {
        this._profileApi = this._profileApi ?? new UserProfileApi(this.alfrescoApi.getInstance());
        return this._profileApi;
    }

    constructor(
        private alfrescoApi: AlfrescoApiService,
        private appConfig: AppConfigService,
        private authStorage: OAuthStorage,
        private oauthService: OAuthService,
        private logService: LogService
    ) {
        super();
    }
    config: AlfrescoApiConfig;
    contentClient: HttpClient & LegacyTicketApi;
    contentPrivateClient: HttpClient & LegacyTicketApi;
    processClient: HttpClient;
    searchClient: HttpClient;
    discoveryClient: HttpClient;
    gsClient: HttpClient;
    authClient: HttpClient;
    processAuth: HttpClient;

    authName: string = 'OIDC';

    getTicketEcm(): string | null {
        return null;
    }

    getTicketBpm(): string | null {
        return null;
    }

    getTicketEcmBase64(): string | null {
        return null;
    }

    getEcmUsername(): string {
        return 'To Be Implemented';
    }

    getBpmUsername(): string {
        return 'To Be Implemented';
    }

    setRedirect(url?: RedirectionModel) {
        console.log(url);
        // noop
    }

    getRedirect(): string {
        // noop
        return 'noop';
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

    isLoggedInWith(provider?: string): boolean {
        console.log(provider);
        return this.isLoggedIn();
    }

    isKerberosEnabled(): boolean {
        return this.appConfig.get<boolean>(AppConfigValues.AUTH_WITH_CREDENTIALS, false);
    }

    isOauth(): boolean {
        return this.appConfig.get(AppConfigValues.AUTHTYPE) === 'OAUTH';
    }

    isImplicitFlow() {
        const oauth2: OauthConfigModel = Object.assign({}, this.appConfig.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null));
        return !!oauth2?.implicitFlow;
    }

    isAuthCodeFlow() {
        const oauth2: OauthConfigModel = Object.assign({}, this.appConfig.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null));
        return !!oauth2?.codeFlow;
    }

    isPublicUrl(): boolean {
        const oauth2: OauthConfigModel = Object.assign({}, this.appConfig.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null));
        const publicUrls = oauth2.publicUrls || [];

        if (Array.isArray(publicUrls)) {
            return publicUrls.length > 0 &&
                publicUrls.some((urlPattern: string) => minimatch(window.location.href, urlPattern));
        }
        return false;
    }

    isECMProvider(): boolean {
        return this.appConfig.get<string>(AppConfigValues.PROVIDERS).toUpperCase() === 'ECM';
    }
    isBPMProvider(): boolean {
        return this.appConfig.get<string>(AppConfigValues.PROVIDERS).toUpperCase() === 'BPM';
    }

    isALLProvider(): boolean {
        return this.appConfig.get<string>(AppConfigValues.PROVIDERS).toUpperCase() === 'ALL';
    }

    login() {
        return EMPTY;
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

    getBpmLoggedUser(): Observable<UserRepresentation> {
        return from(this.profileApi.getProfile());
    }

    handleError(error: any): Observable<any> {
        this.logService.error('Error when logging in', error);
        return throwError(error || 'Server error');
    }

    getToken(): string {
        return this.authStorage.getItem(JwtHelperService.USER_ACCESS_TOKEN);
    }
}
