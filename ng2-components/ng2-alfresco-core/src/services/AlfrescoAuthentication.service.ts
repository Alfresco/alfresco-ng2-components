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
import { Observable } from 'rxjs/Rx';
import { AlfrescoSettingsService } from './AlfrescoSettings.service';
import { AlfrescoApiService } from './AlfrescoApi.service';
import * as alfrescoApi from  'alfresco-js-api';
import { AlfrescoApi } from  'alfresco-js-api';
import { Subject } from 'rxjs/Subject';

/**
 * The AlfrescoAuthenticationService provide the login service and store the ticket in the localStorage
 */
@Injectable()
export class AlfrescoAuthenticationService {

    alfrescoApi: AlfrescoApi;

    public loginSubject: Subject<any> = new Subject<any>();

    public logoutSubject: Subject<any> = new Subject<any>();

    /**
     * Constructor
     * @param settingsService
     * @param apiService
     */
    constructor(private settingsService: AlfrescoSettingsService,
                private apiService: AlfrescoApiService) {
        this.alfrescoApi = <AlfrescoApi>new alfrescoApi({
            provider: this.settingsService.getProviders(),
            ticketEcm: this.getTicketEcm(),
            ticketBpm: this.getTicketBpm(),
            hostEcm: this.settingsService.ecmHost,
            hostBpm: this.settingsService.bpmHost,
            contextRoot: 'alfresco',
            disableCsrf: true
        });

        settingsService.bpmHostSubject.subscribe((bpmHost) => {
            this.alfrescoApi.changeBpmHost(bpmHost);
        });

        settingsService.ecmHostSubject.subscribe((ecmHost) => {
            this.alfrescoApi.changeEcmHost(ecmHost);
        });

        settingsService.csrfSubject.subscribe((csrf) => {
            this.alfrescoApi.changeCsrfConfig(csrf);
        });

        settingsService.providerSubject.subscribe((value) => {
            this.alfrescoApi.config.provider = value;
        });

        this.apiService.setInstance(this.alfrescoApi);
    }

    /**
     * The method return tru if the user is logged in
     * @returns {boolean}
     */
    isLoggedIn(): boolean {
        return !!this.alfrescoApi.isLoggedIn();
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
            .catch(this.handleError);
    }

    /**
     * Initialize the alfresco Api with user and password end call the login method
     * @param username
     * @param password
     * @returns {*|Observable<any>}
     */
    private callApiLogin(username: string, password: string) {
        return this.alfrescoApi.login(username, password);
    }

    /**
     * The method remove the ticket from the local storage
     *
     * @returns {Observable<R>|Observable<T>}
     */
    public logout() {
        this.removeTicket();
        return Observable.fromPromise(this.callApiLogout())
            .map(res => <any> res)
            .do(response => {
                this.logoutSubject.next(response);
                return response;
            })
            .catch(this.handleError);
    }

    /**
     *
     * @returns {*|Observable<string>|Observable<any>|Promise<T>}
     */
    private callApiLogout(): Promise<any> {
        if (this.alfrescoApi) {
            return this.alfrescoApi.logout();
        }
    }

    /**
     * Remove the login ticket from localStorage
     */
    public removeTicket(): void {
        localStorage.removeItem('ticket-ECM');
        localStorage.removeItem('ticket-BPM');
    }

    /**
     * The method return the ECM ticket stored in the localStorage
     * @returns ticket
     */
    public getTicketEcm(): string {
        if (localStorage.getItem('ticket-ECM')) {
            return localStorage.getItem('ticket-ECM');
        } else {
            return null;
        }
    }

    /**
     * The method return the BPM ticket stored in the localStorage
     * @returns ticket
     */
    public getTicketBpm(): string {
        if (localStorage.getItem('ticket-BPM')) {
            return localStorage.getItem('ticket-BPM');
        } else {
            return null;
        }
    }

    public getTicketEcmBase64(): string {
        if (localStorage.getItem('ticket-ECM')) {
            return 'Basic ' + btoa(localStorage.getItem('ticket-ECM'));
        } else {
            return null;
        }
    }

    /**
     * The method save the ECM and BPM ticket in the localStorage
     */
    public saveTickets() {
        this.saveTicketEcm();
        this.saveTicketBpm();
    }

    /**
     * The method save the ECM ticket in the localStorage
     */
    public saveTicketEcm(): void {
        if (this.alfrescoApi && this.alfrescoApi.getTicketEcm()) {
            localStorage.setItem('ticket-ECM', this.alfrescoApi.getTicketEcm());
        }
    }

    /**
     * The method save the BPM ticket in the localStorage
     */
    public saveTicketBpm(): void {
        if (this.alfrescoApi && this.alfrescoApi.getTicketBpm()) {
            localStorage.setItem('ticket-BPM', this.alfrescoApi.getTicketBpm());
        }
    }

    /**
     * The method return true if user is logged in on ecm provider
     */
    public isEcmLoggedIn() {
        return this.alfrescoApi.ecmAuth && !!this.alfrescoApi.ecmAuth.isLoggedIn();
    }

    /**
     * The method return true if user is logged in on bpm provider
     */
    public isBpmLoggedIn() {
        return this.alfrescoApi.bpmAuth && !!this.alfrescoApi.bpmAuth.isLoggedIn();
    }

    /**
     * The method write the error in the console browser
     * @param error
     * @returns {ErrorObservable}
     */
    public handleError(error: any): Observable<any> {
        console.error('Error when logging in', error);
        return Observable.throw(error || 'Server error');
    }
}
