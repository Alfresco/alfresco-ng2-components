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
import { Observable, Subject } from 'rxjs/Rx';
import { AlfrescoSettingsService } from './alfresco-settings.service';
import { StorageService } from './storage.service';
import { CookieService } from './cookie.service';
import { LogService } from './log.service';
import { AlfrescoApiService } from './alfresco-api.service';

const REMEMBER_ME_COOKIE_KEY = 'ALFRESCO_REMEMBER_ME';
const REMEMBER_ME_UNTIL = 1000 * 60 * 60 * 24 * 30 ;

@Injectable()
export class AlfrescoAuthenticationService {

    onLogin: Subject<any> = new Subject<any>();
    onLogout: Subject<any> = new Subject<any>();

    constructor(
        private settingsService: AlfrescoSettingsService,
        public alfrescoApi: AlfrescoApiService,
        private storage: StorageService,
        private cookie: CookieService,
        private logService: LogService) {
    }

    /**
     * The method return true if the user is logged in
     * @returns {boolean}
     */
    isLoggedIn(): boolean {
        return !!this.alfrescoApi.getInstance().isLoggedIn();
    }

    /**
     * Method to delegate to POST login
     * @param username
     * @param password
     * @returns {Observable<R>|Observable<T>}
     */
    login(username: string, password: string, rememberMe: boolean = false): Observable<{ type: string, ticket: any }> {
        this.removeTicket();
        return Observable.fromPromise(this.callApiLogin(username, password))
            .map((response: any) => {
                this.saveRememberMeCookie(rememberMe);
                this.saveTickets();
                this.onLogin.next(response);
                return { type: this.settingsService.getProviders(), ticket: response };
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
     * @returns {boolean}
     */
    private isRememberMeSet(): boolean {
        return (this.cookie.getItem(REMEMBER_ME_COOKIE_KEY) === null) ? false : true;
    }

    /**
     * Initialize the alfresco Api with user and password end call the login method
     * @param username
     * @param password
     * @returns {*|Observable<any>}
     */
    private callApiLogin(username: string, password: string) {
        return this.alfrescoApi.getInstance().login(username, password);
    }

    /**
     * The method remove the ticket from the Storage
     *
     * @returns {Observable<R>|Observable<T>}
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
     * @returns {*|Observable<string>|Observable<any>|Promise<T>}
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
     * @returns ticket
     */
    getTicketEcm(): string | null {
        return this.storage.getItem('ticket-ECM');
    }

    /**
     * The method return the BPM ticket stored in the Storage
     * @returns ticket
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
     * The method return true if user is logged in on ecm provider
     *
     * @returns {boolean}
     */
    isEcmLoggedIn(): boolean {
        return this.isRememberMeSet() && this.alfrescoApi.getInstance().ecmAuth && !!this.alfrescoApi.getInstance().ecmAuth.isLoggedIn();
    }

    /**
     * The method return true if user is logged in on bpm provider
     *
     * @returns {boolean}
     */
    isBpmLoggedIn(): boolean {
        return this.isRememberMeSet() && this.alfrescoApi.getInstance().bpmAuth && !!this.alfrescoApi.getInstance().bpmAuth.isLoggedIn();
    }

    /**
     * Get the ECM username
     *
     * @returns {string} The username value
     *
     * @memberof AlfrescoAuthenticationService
     */
    getEcmUsername(): string {
        return this.alfrescoApi.getInstance().ecmAuth.username;
    }

    /**
     * Get the BPM username
     *
     * @returns {string} The username value
     *
     * @memberof AlfrescoAuthenticationService
     */
    getBpmUsername(): string {
        return this.alfrescoApi.getInstance().bpmAuth.username;
    }

    /**
     * The method write the error in the console browser
     * @param error
     * @returns {ErrorObservable}
     */
    handleError(error: any): Observable<any> {
        this.logService.error('Error when logging in', error);
        return Observable.throw(error || 'Server error');
    }
}
