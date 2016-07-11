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
    private token: string;

    constructor(private alfrescoSettingsService: AlfrescoSettingsService,
                private http: Http) {
        super(alfrescoSettingsService, http);
    }

    /**
     * Perform a login on behalf of the user and store the ticket returned
     *
     * @param username
     * @param password
     * @returns {Observable<R>|Observable<T>}
     */
    login(username: string, password: string): Observable<any> {
        return Observable.fromPromise(this.getCreateTicketPromise(username, password))
            .map((response: any) => {
                this.token = response.entry.id;
                return this.token;
                // return {name: this.TYPE, token: response.entry.id};
            })
            .catch(this.handleError);
    }

    /**
     * Delete the current login ticket from the server
     *
     * @returns {Observable<R>|Observable<T>}
     */
    logout() {
        return Observable.fromPromise(this.getDeleteTicketPromise())
            .map(res => <any> res)
            .do(response => {
                this.removeToken(this.TYPE);
            })
            .catch(this.handleError);
    }

    /**
     * The method return true if the user is logged in
     * @returns {boolean}
     */
    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    private getAlfrescoClient() {
        return AlfrescoApi.getClientWithTicket(this.getBaseUrl(), this.getToken());
    }

    private getCreateTicketPromise(username: string, password: string) {
        let apiInstance = new AlfrescoApi.Auth.AuthenticationApi(this.getAlfrescoClient());
        let loginRequest = new AlfrescoApi.Auth.LoginRequest();
        loginRequest.userId = username;
        loginRequest.password = password;
        return apiInstance.createTicket(loginRequest);
    }

    private getDeleteTicketPromise() {
        let apiInstance = new AlfrescoApi.Auth.AuthenticationApi(this.getAlfrescoClient());
        return apiInstance.deleteTicket();
    }

    /**
     * The method return the token stored in the localStorage
     * @param token
     */
    public getToken (): string {
        return localStorage.getItem(`token-${this.TYPE}`);
    }

    /**
     * The method save the toke in the localStorage
     * @param token
     */
    public saveToken(): void {
        if (this.token) {
            super.saveToken(this.TYPE, this.token);
        }
    }

}
