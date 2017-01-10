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
import { SettingsService } from './settings.service';
import { StorageService } from './storage.service';
import { LogService } from './log.service';
import { AlfrescoApiService } from './alfresco-api.service';

@Injectable()
export class AuthService {
    loginSubject: Subject<any> = new Subject<any>();
    logoutSubject: Subject<any> = new Subject<any>();

    constructor(private settingsService: SettingsService,
                public alfrescoApi: AlfrescoApiService,
                private storage: StorageService,
                private logService: LogService) {
    }

    /**
     * The method return tru if the user is logged in
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
    login(username: string, password: string): Observable<{ type: string, ticket: any }> {
        this.removeTicket();
        return Observable.fromPromise(this.callApiLogin(username, password))
            .map((response: any) => {
                this.saveTickets();
                this.loginSubject.next(response);
                return {type: this.settingsService.getProviders(), ticket: response};
            })
            .catch(err => this.handleError(err));
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
            .map(res => <any> res)
            .do(response => {
                this.removeTicket();
                this.logoutSubject.next(response);
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
    saveTickets() {
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
     */
    isEcmLoggedIn() {
        return this.alfrescoApi.getInstance().ecmAuth && !!this.alfrescoApi.getInstance().ecmAuth.isLoggedIn();
    }

    /**
     * The method return true if user is logged in on bpm provider
     */
    isBpmLoggedIn() {
        return this.alfrescoApi.getInstance().bpmAuth && !!this.alfrescoApi.getInstance().bpmAuth.isLoggedIn();
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
