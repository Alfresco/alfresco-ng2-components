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

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {AlfrescoSettingsService} from './AlfrescoSettings.service';

declare let AlfrescoApi: any;

/**
 * The AlfrescoAuthenticationService provide the login service and store the ticket in the localStorage
 */
@Injectable()
export class AlfrescoAuthenticationService {

    alfrescoApi: any;

    /**A
     * Constructor
     * @param alfrescoSetting
     */
    constructor(public alfrescoSetting: AlfrescoSettingsService) {
        this.alfrescoApi = new AlfrescoApi({
            provider: this.alfrescoSetting.getProviders(),
            ticket: this.isLoggedIn() ? this.getTicket().split(',')[0] : null,
            hostEcm: this.alfrescoSetting.ecmHost,
            hostBpm: this.alfrescoSetting.bpmHost
        });

        alfrescoSetting.bpmHostSubject.subscribe((bpmHost) => {
            this.alfrescoApi.changeBpmHost(bpmHost);
        });

        alfrescoSetting.ecmHostSubject.subscribe((ecmHost ) => {
            this.alfrescoApi.changeEcmHost(ecmHost);
        });

        alfrescoSetting.providerSubject.subscribe((value) => {
            this.alfrescoApi.config.provider = value;
        });
    }

    /**
     * The method return tru if the user is logged in
     * @returns {boolean}
     */
    isLoggedIn(): boolean {
        return !!this.getTicket();
    }

    /**
     * Method to delegate to POST login
     * @param username
     * @param password
     * @returns {Observable<R>|Observable<T>}
     */
    login(username: string, password: string) {
        return Observable.fromPromise(this.callApiLogin(username, password))
            .map((response: any) => {
                this.saveTicket(response);
                return {type: this.alfrescoSetting.getProviders(), ticket: response};
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
        localStorage.removeItem('ticket');
    }

    /**
     * The method return the ticket stored in the localStorage
     * @returns ticket
     */
    public getTicket(): string {
        return localStorage.getItem('ticket');
    }

    /**
     * The method save the ticket in the localStorage
     * @param ticket
     */
    public saveTicket(ticket): void {
        if (ticket) {
            localStorage.setItem('ticket', ticket);
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

    getAlfrescoApi(): any {
        return this.alfrescoApi;
    }
}
