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
import { AlfrescoJsApi } from 'alfresco-js-api';

declare var AlfrescoApi: AlfrescoJsApi;

/**
 * The AlfrescoAuthenticationService provide the login service and store the ticket in the localStorage
 */
@Injectable()
export class AlfrescoAuthenticationService {

    alfrescoApi: AlfrescoJsApi;

    /**
     * Constructor
     * @param settingsService
     * @param apiService
     */
    constructor(private settingsService: AlfrescoSettingsService,
                private apiService: AlfrescoApiService) {
        this.alfrescoApi = new AlfrescoApi({
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
        return Observable.fromPromise(this.callApiLogin(username, password))
            .map((response: any) => {
                this.saveTickets();
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
        return Observable.fromPromise(this.callApiLogout())
            .map(res => <any> res)
            .do(response => {
                this.removeTicket();
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
        if (this.alfrescoApi) {
            localStorage.setItem('ticket-ECM', this.alfrescoApi.getTicketEcm());
        }
    }

    /**
     * The method save the BPM ticket in the localStorage
     */
    public saveTicketBpm(): void {
        if (this.alfrescoApi) {
            localStorage.setItem('ticket-BPM', this.alfrescoApi.getTicketBpm());
        }
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

    getAlfrescoApi(): AlfrescoJsApi {
        return this.alfrescoApi;
    }
}
