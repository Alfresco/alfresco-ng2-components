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
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { Authentication } from '../interfaces/authentication.interface';
import { CookieService } from '../../common/services/cookie.service';
import { ContentAuth } from './content-auth';
import { ProcessAuth } from './process-auth';
import { map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { RedirectionModel } from '../models/redirection.model';
import { BaseAuthenticationService } from '../services/base-authentication.service';
import { LogService } from '../../common';
import { HttpHeaders } from '@angular/common/http';

const REMEMBER_ME_COOKIE_KEY = 'ALFRESCO_REMEMBER_ME';
const REMEMBER_ME_UNTIL = 1000 * 60 * 60 * 24 * 30;

@Injectable({
    providedIn: 'root'
})
export class BasicAlfrescoAuthService extends BaseAuthenticationService {

    protected redirectUrl: RedirectionModel = null;

    authentications: Authentication = {
        basicAuth: {
            ticket: ''
        },
        type: 'basic'
    };

    constructor(
        logService: LogService,
        appConfig: AppConfigService,
        cookie: CookieService,
        private contentAuth: ContentAuth,
        private processAuth: ProcessAuth
    ) {
        super(appConfig, cookie, logService);

        this.contentAuth.onLogout.pipe(map((event) => {
            this.onLogout.next(event);
        }));
        this.contentAuth.onLogin.pipe(map((event) => {
            this.onLogout.next(event);
        }));
        this.contentAuth.onError.pipe(map((event) => {
            this.onLogout.next(event);
        }));
        this.processAuth.onLogout.pipe(map((event) => {
            this.onLogout.next(event);
        }));
        this.processAuth.onLogin.pipe(map((event) => {
            this.onLogin.next(event);
        }));
        this.processAuth.onError.pipe(map((event) => {
            this.onError.next(event);
        }));
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
        return from(this.executeLogin(username, password)).pipe(
            map((response: any) => {
                this.saveRememberMeCookie(rememberMe);
                this.onLogin.next(response);
                return {
                    type: this.appConfig.get(AppConfigValues.PROVIDERS),
                    ticket: response
                };
            })
        );
    }

    /**
     * login Alfresco API
     * @param  username:   // Username to login
     * @param  password:   // Password to login
     *
     * @returns A promise that returns {new authentication ticket} if resolved and {error} if rejected.
     * */
    async executeLogin(username: string, password: string): Promise<any> {
        if (!this.isCredentialValid(username) || !this.isCredentialValid(password)) {
            return Promise.reject('missing username or password');
        }

        if (username) {
            username = username.trim();
        }

        if (this.isBPMProvider()) {
            try {
                return await this.processAuth.login(username, password);
            } catch (e) {
            }

        } else if (this.isECMProvider()) {
            try {
                return await this.contentAuth.login(username, password);
            } catch (e) {
            }

        } else if (this.isALLProvider()) {
            return this.loginBPMECM(username, password);
        } else {
            return Promise.reject('Unknown configuration');
        }

    }

    private loginBPMECM(username: string, password: string): Promise<any> {
        const contentPromise = this.contentAuth.login(username, password);
        const processPromise = this.processAuth.login(username, password);

        return new Promise((resolve, reject) => {
            Promise.all([contentPromise, processPromise]).then(
                (data) => {
                    this.onLogin.next('success');
                    resolve(data);
                },
                (error) => {
                    this.contentAuth.invalidateSession();
                    this.processAuth.invalidateSession();

                    if (error.status === 401) {
                        this.onError.next('unauthorized');
                    }
                    this.onError.next('error');
                    reject(error);
                });
        });
    }

    /**
     * Checks whether the "remember me" cookie was set or not.
     *
     * @returns True if set, false otherwise
     */
    isRememberMeSet(): boolean {
        return this.cookie.getItem(REMEMBER_ME_COOKIE_KEY) !== null;
    }

    /**
     * Saves the "remember me" cookie as either a long-life cookie or a session cookie.
     *
     * @param rememberMe Enables a long-life cookie
     */
    saveRememberMeCookie(rememberMe: boolean): void {
        let expiration = null;

        if (rememberMe) {
            expiration = new Date();
            const time = expiration.getTime();
            const expireTime = time + REMEMBER_ME_UNTIL;
            expiration.setTime(expireTime);
        }
        this.cookie.setItem(REMEMBER_ME_COOKIE_KEY, '1', expiration, null);
    }

    isCredentialValid(credential: string): boolean {
        return credential !== undefined && credential !== null && credential !== '';
    }

    getToken(): string {
        return '';
    }

    isBpmLoggedIn(): boolean {
        return this.processAuth.isLoggedIn();
    }

    isEcmLoggedIn(): boolean {
        return this.contentAuth.isLoggedIn();
    }

    isLoggedIn(): boolean {
        const authWithCredentials = this.isKerberosEnabled();

        if (this.isBPMProvider()) {
            return this.processAuth.isLoggedIn();
        } else if (this.isECMProvider()) {
            return authWithCredentials ? true : this.contentAuth.isLoggedIn();
        } else if (this.isALLProvider()) {
            return authWithCredentials ? true : (this.contentAuth.isLoggedIn() && this.processAuth.isLoggedIn());
        } else {
            return false;
        }
    }

    /**
     * logout Alfresco API
     * */
    logout(): Promise<any> {
        if (this.isBPMProvider()) {
            return this.processAuth.logout();
        } else if (this.isECMProvider()) {
            const contentPromise = this.contentAuth.logout();
            contentPromise.then(
                () => this.contentAuth.ticket = undefined,
                () => {
                }
            );
            return contentPromise;
        } else if (this.isALLProvider()) {
            return this.logoutBPMECM();
        }
        return Promise.resolve();
    }

    private logoutBPMECM(): Promise<any> {
        const contentPromise = this.contentAuth.logout();
        const processPromise = this.processAuth.logout();

        return new Promise((resolve, reject) => {
            Promise.all([contentPromise, processPromise]).then(
                () => {
                    this.contentAuth.ticket = undefined;
                    this.processAuth.ticket = undefined;
                    this.onLogout.next('logout');
                    resolve('logout');
                },
                (error) => {
                    if (error.status === 401) {
                        this.onError.next('unauthorized');
                    }
                    this.onError.next('error');
                    reject(error);
                });
        });

    }

    reset(): void {
    }

    /** Gets the URL to redirect to after login.
     *
     * @returns The redirect URL
     */
    getRedirect(): string {
        const provider = this.appConfig.get<string>(AppConfigValues.PROVIDERS);
        return this.hasValidRedirection(provider) ? this.redirectUrl.url : null;
    }

    setRedirect(url?: RedirectionModel) {
        this.redirectUrl = url;
    }

    private hasValidRedirection(provider: string): boolean {
        return this.redirectUrl && (this.redirectUrl.provider === provider || this.hasSelectedProviderAll(provider));
    }

    private hasSelectedProviderAll(provider: string): boolean {
        return this.redirectUrl && (this.redirectUrl.provider === 'ALL' || provider === 'ALL');
    }

    getBpmUsername(): string {
        return this.contentAuth.authentications.basicAuth.username;
    }

    getEcmUsername(): string {
        return this.processAuth.authentications.basicAuth.username;
    }

    /**
     * Does kerberos enabled?
     *
     * @returns True if enabled, false otherwise
     */
    isKerberosEnabled(): boolean {
        return this.appConfig.get<boolean>(AppConfigValues.AUTH_WITH_CREDENTIALS, false);
    }

    getAuthHeaders(requestUrl: string, header: HttpHeaders): HttpHeaders {
        return this.addBasicAuth(requestUrl, header);
    }

    private addBasicAuth(requestUrl: string, header: HttpHeaders): HttpHeaders {
        const ticket = this.getTicketEcmBase64(requestUrl);

        if (!ticket) {
            return header;
        }

        return header.set('Authorization', ticket);
    }


    /**
     * Gets the BPM ticket from the Storage in Base 64 format.
     *
     * @returns The ticket or `null` if none was found
     */
    private getTicketEcmBase64(requestUrl: string): string | null {
        let ticket = null;

        const contextRootBpm = this.appConfig.get<string>(AppConfigValues.CONTEXTROOTBPM);
        const contextRoot = this.appConfig.get<string>(AppConfigValues.CONTEXTROOTECM);

        if (contextRoot && requestUrl.indexOf(contextRoot) !== -1) {
            ticket = 'Basic ' + btoa(this.contentAuth.getTicket());
        } else if (contextRootBpm && requestUrl.indexOf(contextRootBpm) !== -1) {
            ticket = 'Basic ' + this.processAuth.getTicket();
        }

        return ticket;
    }
}
