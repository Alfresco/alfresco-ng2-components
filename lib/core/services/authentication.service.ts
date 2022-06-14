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
import { Observable, from, throwError, ReplaySubject, forkJoin } from 'rxjs';
import { AlfrescoApiService } from './alfresco-api.service';
import { CookieService } from './cookie.service';
import { LogService } from './log.service';
import { RedirectionModel } from '../models/redirection.model';
import { AppConfigService, AppConfigValues } from '../app-config/app-config.service';
import { UserRepresentation } from '@alfresco/js-api';
import { map, catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from './jwt-helper.service';
import { StorageService } from './storage.service';
import { ApiClientsService } from '@alfresco/adf-core/api';
import { BaseAuthenticationService } from '../authentication/base-authentication.service';
import { ADFAuthenticationService } from '../authentication/authentication.interface';
import { OauthConfigModel } from '../models/oauth-config.model';

const REMEMBER_ME_COOKIE_KEY = 'ALFRESCO_REMEMBER_ME';
const REMEMBER_ME_UNTIL = 1000 * 60 * 60 * 24 * 30;

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService extends BaseAuthenticationService implements ADFAuthenticationService {
    private redirectUrl: RedirectionModel = null;

    /**
     * Emits login event
     */
    onLogin: ReplaySubject<any> = new ReplaySubject<any>(1);

    /**
     * Emits logout event
     */
    onLogout: ReplaySubject<any> = new ReplaySubject<any>(1);

    get peopleApi() {
        return this.apiClientsService.get('ContentClient.people');
    }

    get profileApi() {
        return this.apiClientsService.get('ActivitiClient.user-profile');
    }

    constructor(
        private appConfig: AppConfigService,
        private storageService: StorageService,
        private alfrescoApi: AlfrescoApiService,
        private cookie: CookieService,
        private logService: LogService,
        private apiClientsService: ApiClientsService
    ) {
        super();
        this.alfrescoApi.alfrescoApiInitialized.subscribe(() => {
            this.alfrescoApi.getInstance().reply('logged-in', () => {
                this.onLogin.next();
            });

            if (this.isKerberosEnabled()) {
                this.loadUserDetails();
            }
        });
    }

    oidcHandlerEnabled(): boolean {
        return false;
    }

    isImplicitFlow(): boolean {
        const oauth2: OauthConfigModel = Object.assign({}, this.appConfig.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null));
        return !!oauth2?.implicitFlow;
    }

    isAuthCodeFlow(): boolean {
        return false;
    }

    private loadUserDetails() {
        const ecmUser$ = from(this.peopleApi.getPerson('-me-'));
        const bpmUser$ = this.getBpmLoggedUser();

        if (this.isALLProvider()) {
            forkJoin([ecmUser$, bpmUser$]).subscribe(() => this.onLogin.next());
        } else if (this.isECMProvider()) {
            ecmUser$.subscribe(() => this.onLogin.next());
        } else {
            bpmUser$.subscribe(() => this.onLogin.next());
        }
    }

    /**
     * Checks if the user logged in.
     *
     * @returns True if logged in, false otherwise
     */
    isLoggedIn(): boolean {
        if (!this.isOauth() && this.cookie.isEnabled() && !this.isRememberMeSet()) {
            return false;
        }
        return this.alfrescoApi.getInstance().isLoggedIn();
    }

    isLoggedInWith(provider: string): boolean {
        if (provider === 'BPM') {
            return this.isBpmLoggedIn();
        } else if (provider === 'ECM') {
            return this.isEcmLoggedIn();
        } else {
            return this.isLoggedIn();
        }
    }

    /**
     * Does kerberos enabled?
     *
     * @returns True if enabled, false otherwise
     */
    isKerberosEnabled(): boolean {
        return this.appConfig.get<boolean>(AppConfigValues.AUTH_WITH_CREDENTIALS, false);
    }

    /**
     * Does the provider support OAuth?
     *
     * @returns True if supported, false otherwise
     */
    isOauth(): boolean {
        return this?.alfrescoApi?.getInstance()?.isOauthConfiguration() || this.appConfig.get(AppConfigValues.AUTHTYPE) === 'OAUTH';
    }

    isPublicUrl(): boolean {
        return this.alfrescoApi.getInstance().isPublicUrl();
    }

    /**
     * Does the provider support ECM?
     *
     * @returns True if supported, false otherwise
     */
     isECMProvider(): boolean {
        return this?.alfrescoApi?.getInstance()?.isEcmConfiguration() || this.appConfig.get<string>(AppConfigValues.PROVIDERS).toUpperCase() === 'ECM';
    }

    /**
     * Does the provider support BPM?
     *
     * @returns True if supported, false otherwise
     */
    isBPMProvider(): boolean {
        return this?.alfrescoApi?.getInstance()?.isBpmConfiguration() || this.appConfig.get<string>(AppConfigValues.PROVIDERS).toUpperCase() === 'BPM';
    }

    /**
     * Does the provider support both ECM and BPM?
     *
     * @returns True if both are supported, false otherwise
     */
    isALLProvider(): boolean {
        return this?.alfrescoApi?.getInstance()?.isEcmBpmConfiguration() || this.appConfig.get<string>(AppConfigValues.PROVIDERS).toUpperCase() === 'ALL';
    }

    /**
     * Logs the user in.
     *
     * @param username Username for the login
     * @param password Password for the login
     * @param rememberMe Stores the user's login details if true
     * @returns Object with auth type ("ECM", "BPM" or "ALL") and auth ticket
     */
    login(username: string, password: string, rememberMe: boolean = false): Observable<{ type: string; ticket: any }> {
        return from(this.alfrescoApi.getInstance().login(username, password))
            .pipe(
                map((response: any) => {
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

    /**
     * Logs the user in with SSO
     */
    ssoImplicitLogin() {
        this.alfrescoApi.getInstance().implicitLogin();
    }

    /**
     * Saves the "remember me" cookie as either a long-life cookie or a session cookie.
     *
     * @param rememberMe Enables a long-life cookie
     */
    private saveRememberMeCookie(rememberMe: boolean): void {
        let expiration = null;

        if (rememberMe) {
            expiration = new Date();
            const time = expiration.getTime();
            const expireTime = time + REMEMBER_ME_UNTIL;
            expiration.setTime(expireTime);
        }
        this.cookie.setItem(REMEMBER_ME_COOKIE_KEY, '1', expiration, null);
    }

    /**
     * Checks whether the "remember me" cookie was set or not.
     *
     * @returns True if set, false otherwise
     */
    isRememberMeSet(): boolean {
        return (this.cookie.getItem(REMEMBER_ME_COOKIE_KEY) !== null);
    }

    /**
     * Logs the user out.
     *
     * @returns Response event called when logout is complete
     */
    logout() {
        return from(this.callApiLogout())
            .pipe(
                tap((response) => {
                    this.onLogout.next(response);
                    return response;
                }),
                catchError((err) => this.handleError(err))
            );
    }

    private callApiLogout(): Promise<any> {
        if (this.alfrescoApi.getInstance()) {
            return this.alfrescoApi.getInstance().logout();
        }
        return Promise.resolve();
    }

    /**
     * Gets the ECM ticket stored in the Storage.
     *
     * @returns The ticket or `null` if none was found
     */
    getTicketEcm(): string | null {
        return this.alfrescoApi.getInstance().getTicketEcm();
    }

    /**
     * Gets the BPM ticket stored in the Storage.
     *
     * @returns The ticket or `null` if none was found
     */
    getTicketBpm(): string | null {
        return this.alfrescoApi.getInstance().getTicketBpm();
    }

    /**
     * Gets the BPM ticket from the Storage in Base 64 format.
     *
     * @returns The ticket or `null` if none was found
     */
    getTicketEcmBase64(): string | null {
        const ticket = this.alfrescoApi.getInstance().getTicketEcm();
        if (ticket) {
            return 'Basic ' + btoa(ticket);
        }
        return null;
    }

    /**
     * Checks if the user is logged in on an ECM provider.
     *
     * @returns True if logged in, false otherwise
     */
    isEcmLoggedIn(): boolean {
        if (this.isECMProvider() || this.isALLProvider()) {
            if (!this.isOauth() && this.cookie.isEnabled() && !this.isRememberMeSet()) {
                return false;
            }
            return this.alfrescoApi.getInstance().isEcmLoggedIn();
        }
        return false;
    }

    /**
     * Checks if the user is logged in on a BPM provider.
     *
     * @returns True if logged in, false otherwise
     */
    isBpmLoggedIn(): boolean {
        if (this.isBPMProvider() || this.isALLProvider()) {
            if (!this.isOauth() && this.cookie.isEnabled() && !this.isRememberMeSet()) {
                return false;
            }
            return this.alfrescoApi.getInstance().isBpmLoggedIn();
        }
        return false;
    }

    /**
     * Gets the ECM username.
     *
     * @returns The ECM username
     */
    getEcmUsername(): string {
        return this.alfrescoApi.getInstance().getEcmUsername();
    }

    /**
     * Gets the BPM username
     *
     * @returns The BPM username
     */
    getBpmUsername(): string {
        return this.alfrescoApi.getInstance().getBpmUsername();
    }

    /** Sets the URL to redirect to after login.
     *
     * @param url URL to redirect to
     */
    setRedirect(url: RedirectionModel) {
        this.redirectUrl = url;
    }

    /** Gets the URL to redirect to after login.
     *
     * @returns The redirect URL
     */
    getRedirect(): string {
        const provider = this.appConfig.get<string>(AppConfigValues.PROVIDERS);
        return this.hasValidRedirection(provider) ? this.redirectUrl.url : null;
    }

    /**
     * Gets information about the user currently logged into APS.
     *
     * @returns User information
     */
    getBpmLoggedUser(): Observable<UserRepresentation> {
        return from(this.profileApi.getProfile());
    }

    private hasValidRedirection(provider: string): boolean {
        return this.redirectUrl && (this.redirectUrl.provider === provider || this.hasSelectedProviderAll(provider));
    }

    private hasSelectedProviderAll(provider: string): boolean {
        return this.redirectUrl && (this.redirectUrl.provider === 'ALL' || provider === 'ALL');
    }

    /**
     * Prints an error message in the console browser
     *
     * @param error Error message
     * @returns Object representing the error message
     */
    handleError(error: any): Observable<any> {
        this.logService.error('Error when logging in', error);
        return throwError(error || 'Server error');
    }

    /**
     * Gets the auth token.
     *
     * @returns Auth token string
     */
    getToken(): string {
        return this.storageService.getItem(JwtHelperService.USER_ACCESS_TOKEN);
    }
}
