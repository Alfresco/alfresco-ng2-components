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
    private redirectUrl: RedirectionModel = null;

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
     * The method return true if the user is logged in
     */
    isLoggedIn(): boolean {
        return !!this.alfrescoApi.getInstance().isLoggedIn();
    }

    /**
     * Method to delegate to POST login
     * @param username
     * @param password
     */
    login(username: string, password: string, rememberMe: boolean = false): Observable<{ type: string, ticket: any }> {
        this.removeTicket();
        return Observable.fromPromise(this.callApiLogin(username, password))
            .map((response: any) => {
                this.saveRememberMeCookie(rememberMe);
                this.saveTickets();
                this.onLogin.next(response);
                return {
                    type: this.preferences.authType,
                    ticket: response
                };
            })
            .catch(err => this.handleError(err));
    }

    /**
     * The method save the "remember me" cookie as a long life cookie or a session cookie
     * depending on the given paramter
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
     * The method retrieve whether the "remember me" cookie was set or not
     *
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
     * The method remove the ticket from the Storage
     *
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
     * Remove the login ticket from Storage
     */
    removeTicket(): void {
        this.storage.removeItem('ticket-ECM');
        this.storage.removeItem('ticket-BPM');
        this.alfrescoApi.getInstance().setTicket(undefined, undefined);
    }

    /**
     * The method return the ECM ticket stored in the Storage
     */
    getTicketEcm(): string | null {
        return this.storage.getItem('ticket-ECM');
    }

    /**
     * The method return the BPM ticket stored in the Storage
     */
    getTicketBpm(): string | null {
        return this.storage.getItem('ticket-BPM');
    }

    getTicketEcmBase64(): string | null {
        let ticket = this.storage.getItem('ticket-ECM');
        if (ticket) {
            return 'Basic ' + btoa(ticket);
        }
        return null;
    }

    /**
     * The method save the ECM and BPM ticket in the Storage
     */
    saveTickets(): void {
        this.saveTicketEcm();
        this.saveTicketBpm();
        this.saveTicketAuth();
    }

    /**
     * The method save the ECM ticket in the Storage
     */
    saveTicketEcm(): void {
        if (this.alfrescoApi.getInstance() && this.alfrescoApi.getInstance().getTicketEcm()) {
            this.storage.setItem('ticket-ECM', this.alfrescoApi.getInstance().getTicketEcm());
        }
    }

    /**
     * The method save the BPM ticket in the Storage
     */
    saveTicketBpm(): void {
        if (this.alfrescoApi.getInstance() && this.alfrescoApi.getInstance().getTicketBpm()) {
            this.storage.setItem('ticket-BPM', this.alfrescoApi.getInstance().getTicketBpm());
        }
    }

    /**
     * The method save the AUTH ticket in the Storage
     */
    saveTicketAuth(): void {
        if (this.alfrescoApi.getInstance() && (<any>this.alfrescoApi.getInstance()).getTicketAuth()) {
            this.storage.setItem('ticket-AUTH', (<any>this.alfrescoApi.getInstance()).getTicketAuth());
        }
    }

    /**
     * The method return true if user is logged in on ecm provider
     *
     */
    isEcmLoggedIn(): boolean {
        if (this.cookie.isEnabled() && !this.isRememberMeSet()) {
            return false;
        }
        return this.alfrescoApi.getInstance().ecmAuth && !!this.alfrescoApi.getInstance().ecmAuth.isLoggedIn();
    }

    /**
     * The method return true if user is logged in on bpm provider
     *
     */
    isBpmLoggedIn(): boolean {
        if (this.cookie.isEnabled() && !this.isRememberMeSet()) {
            return false;
        }
        return this.alfrescoApi.getInstance().bpmAuth && !!this.alfrescoApi.getInstance().bpmAuth.isLoggedIn();
    }

    /**
     * Get the ECM username
     *
     *
     * @memberof AuthenticationService
     */
    getEcmUsername(): string {
        return this.alfrescoApi.getInstance().ecmAuth.username;
    }

    /**
     * Get the BPM username
     *
     *
     * @memberof AuthenticationService
     */
    getBpmUsername(): string {
        return this.alfrescoApi.getInstance().bpmAuth.username;
    }

    setRedirectUrl(url: RedirectionModel) {
        this.redirectUrl = url;
    }

    getRedirectUrl(provider: string): string {
        return this.hasValidRedirection(provider) ? this.redirectUrl.url : null;
    }

    private hasValidRedirection(provider: string): boolean {
        return this.redirectUrl && (this.redirectUrl.provider === provider || this.hasSelectedProviderAll(provider));
    }

    private hasSelectedProviderAll(provider: string): boolean {
        return this.redirectUrl && (this.redirectUrl.provider === 'ALL' || provider === 'ALL');
    }

    /**
     * The method write the error in the console browser
     * @param error
     */
    handleError(error: any): Observable<any> {
        this.logService.error('Error when logging in', error);
        return Observable.throw(error || 'Server error');
    }
}
