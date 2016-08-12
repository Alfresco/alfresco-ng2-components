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

import { AbstractAuthentication } from '../interface/authentication.interface';
import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { AlfrescoAuthenticationBase } from './AlfrescoAuthenticationBase.service';
import { AlfrescoSettingsService } from './AlfrescoSettingsService.service';

declare let AlfrescoApi: any;

export class AlfrescoAuthenticationECM extends AlfrescoAuthenticationBase implements AbstractAuthentication {

    TYPE: string = 'ECM';

    alfrescoApi: any;

    /**
     * Constructor
     * @param alfrescoSettingsService
     * @param http
     */
    constructor(private alfrescoSettingsService: AlfrescoSettingsService,
                private http: Http) {
        super(alfrescoSettingsService, http);

        if (!this.isLoggedIn()) {
            this.alfrescoApi = new AlfrescoApi({
                host: this.getHost()
            });
        } else {
            this.alfrescoApi = new AlfrescoApi({
                ticket: this.getTicket(),
                host: this.getHost()
            });
        }
    }

    getHost(): string {
        return this.alfrescoSettingsService.ecmHost;
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
                return {type: this.TYPE, ticket: response};
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
        this.alfrescoApi = new AlfrescoApi({
            username: username,
            password: password,
            host: this.getHost()
        });
        return this.alfrescoApi.login();
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
                this.removeTicket(this.TYPE);
                return response;
            })
            .catch(this.handleError);
    }

    /**
     *
     * @returns {*|Observable<string>|Observable<any>|Promise<T>}
     */
    private callApiLogout(): Promise<any> {
        return this.alfrescoApi.logout();
    }


    /**
     * The method return the ticket stored in the localStorage
     * @returns ticket
     */
    public getTicket(): string {
        return localStorage.getItem(`ticket-${this.TYPE}`);
    }

    /**
     * The method save the ticket in the localStorage
     * @param ticket
     */
    public saveTicket(ticket): void {
        if (ticket) {
            super.saveTicket(this.TYPE, ticket);
        }
    }

}
