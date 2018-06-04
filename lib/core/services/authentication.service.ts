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
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AlfrescoApiService } from './alfresco-api.service';
import { CookieService } from './cookie.service';
import { LogService } from './log.service';
import { StorageService } from './storage.service';
import { UserPreferencesService } from './user-preferences.service';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { RedirectionModel } from '../models/redirection.model';

const REMEMBER_ME_COOKIE_KEY = 'ALFRESCO_REMEMBER_ME';
const REMEMBER_ME_UNTIL = 1000 * 60 * 60 * 24 * 30 ;

@Injectable()
export class AuthenticationService {
    private redirect: RedirectionModel = null;

    onLogin: Subject<any> = new Subject<any>();
    onLogout: Subject<any> = new Subject<any>();

    constructor(
        private preferences: UserPreferencesService,
        private alfrescoApi: AlfrescoApiService,
        private storage: StorageService,
        private cookie: CookieService,
        private logService: LogService) {
    }

    /**
     * Checks if the user logged in.
     * @returns True if logged in, false otherwise
     */
    isLoggedIn(): boolean {
        return !!this.alfrescoApi.getInstance().isLoggedIn();
    }

    /**
     * Logs the user in.
     * @param username Username for the login
     * @param password Password for the login
     * @param rememberMe Stores the user's login details if true
     * @returns Object with auth type ("ECM", "BPM" or "ALL") and auth ticket
     */
    login(username: string, password: string, rememberMe: boolean = false): Observable<{ type: string, ticket: any }> {
        this.removeTicket();
        return Observable.fromPromise(this.callApiLogin(username, password))
            .map((response: any) => {
                this.saveRememberMeCookie(rememberMe);
                this.saveTickets();
                this.onLogin.next(response);
                return {
                    type: this.preferences.providers,
                    ticket: response
                };
            })
            .catch(err => this.handleError(err));
    }

    /**
     * Saves the "remember me" cookie as either a long-life cookie or a session cookie.
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
     * @returns True if set, false otherwise
     */
    isRememberMeSet(): boolean {
        return (this.cookie.getItem(REMEMBER_ME_COOKIE_KEY) === null) ? false : true;
    }

    /**
     * Initialize the alfresco Api with user and password end call the login method
     * @param username
     * @param password
     */
    private callApiLogin(username: string, password: string) {
        return this.alfrescoApi.getInstance().login(username, password);
    }

    /**
     * Logs the user out.
     * @returns Response event called when logout is complete
     */
    logout() {
        return Observable.fromPromise(this.callApiLogout())
            .do(response => {
                this.removeTicket();
                this.onLogout.next(response);
                return response;
            })
            .catch(err => this.handleError(err));
    }

    /**
     *
     */
    private callApiLogout(): Promise<any> {
        if (this.alfrescoApi.getInstance()) {
            return this.alfrescoApi.getInstance().logout();
        }
    }

    /**
     * Removes the login ticket from Storage.
     */
    removeTicket(): void {
        this.storage.removeItem('ticket-ECM');
        this.storage.removeItem('ticket-BPM');
        this.alfrescoApi.getInstance().setTicket(undefined, undefined);
    }

    /**
     * Gets the ECM ticket stored in the Storage.
     * @returns The ticket or `null` if none was found
     */
    getTicketEcm(): string | null {
        return this.storage.getItem('ticket-ECM');
    }

    /**
     * Gets the BPM ticket stored in the Storage.
     * @returns The ticket or `null` if none was found
     */
    getTicketBpm(): string | null {
        return this.storage.getItem('ticket-BPM');
    }

    /**
     * Gets the BPM ticket from the Storage in Base 64 format.
     * @returns The ticket or `null` if none was found
     */
    getTicketEcmBase64(): string | null {
        let ticket = this.storage.getItem('ticket-ECM');
        if (ticket) {
            return 'Basic ' + btoa(ticket);
        }
        return null;
    }

    /**
     * Saves the ECM and BPM ticket in the Storage.
     */
    saveTickets(): void {
        this.saveTicketEcm();
        this.saveTicketBpm();
        this.saveTicketAuth();
    }

    /**
     * Saves the ECM ticket in the Storage.
     */
    saveTicketEcm(): void {
        if (this.alfrescoApi.getInstance() && this.alfrescoApi.getInstance().getTicketEcm()) {
            this.storage.setItem('ticket-ECM', this.alfrescoApi.getInstance().getTicketEcm());
        }
    }

    /**
     * Saves the BPM ticket in the Storage.
     */
    saveTicketBpm(): void {
        if (this.alfrescoApi.getInstance() && this.alfrescoApi.getInstance().getTicketBpm()) {
            this.storage.setItem('ticket-BPM', this.alfrescoApi.getInstance().getTicketBpm());
        }
    }

    /**
     * Saves the AUTH ticket in the Storage.
     */
    saveTicketAuth(): void {
        if (this.alfrescoApi.getInstance() && (<any> this.alfrescoApi.getInstance()).getTicketAuth()) {
            this.storage.setItem('ticket-AUTH', (<any> this.alfrescoApi.getInstance()).getTicketAuth());
        }
    }

    /**
     * Checks if the user is logged in on an ECM provider.
     * @returns True if logged in, false otherwise
     */
    isEcmLoggedIn(): boolean {
        if (this.cookie.isEnabled() && !this.isRememberMeSet()) {
            return false;
        }
        return this.alfrescoApi.getInstance().ecmAuth && !!this.alfrescoApi.getInstance().ecmAuth.isLoggedIn();
    }

    /**
     * Checks if the user is logged in on a BPM provider.
     * @returns True if logged in, false otherwise
     */
    isBpmLoggedIn(): boolean {
        if (this.cookie.isEnabled() && !this.isRememberMeSet()) {
            return false;
        }
        return this.alfrescoApi.getInstance().bpmAuth && !!this.alfrescoApi.getInstance().bpmAuth.isLoggedIn();
    }

    /**
     * Gets the ECM username.
     * @returns The ECM username
     */
    getEcmUsername(): string {
        return this.alfrescoApi.getInstance().ecmAuth.username;
    }

    /**
     * Gets the BPM username
     * @returns The BPM username
     */
    getBpmUsername(): string {
        return this.alfrescoApi.getInstance().bpmAuth.username;
    }

    /** Sets the URL to redirect to after login.
     * @param url URL to redirect to
     */
    setRedirect(url: RedirectionModel) {
        this.redirect = url;
    }

    /** Gets the URL to redirect to after login.
     * @param provider Service provider. Can be "ECM", "BPM" or "ALL".
     * @returns The redirect URL
     */
    getRedirect(provider: string): any[] {
        return this.hasValidRedirection(provider) ? this.redirect.navigation : null;
    }

    private hasValidRedirection(provider: string): boolean {
        return this.redirect && (this.redirect.provider === provider || this.hasSelectedProviderAll(provider));
    }

    private hasSelectedProviderAll(provider: string): boolean {
        return this.redirect && (this.redirect.provider === 'ALL' || provider === 'ALL');
    }

    /**
     * Prints an error message in the console browser
     * @param error Error message
     * @returns Object representing the error message
     */
    handleError(error: any): Observable<any> {
        this.logService.error('Error when logging in', error);
        return Observable.throw(error || 'Server error');
    }
}
