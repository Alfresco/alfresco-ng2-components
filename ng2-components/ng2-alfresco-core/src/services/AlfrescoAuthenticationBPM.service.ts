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
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AlfrescoAuthenticationBase } from './AlfrescoAuthenticationBase.service';
import { AlfrescoSettingsService } from './AlfrescoSettingsService.service';

export class AlfrescoAuthenticationBPM extends AlfrescoAuthenticationBase implements AbstractAuthentication {

    TYPE: string = 'BPM';

    constructor(private alfrescoSettingsService: AlfrescoSettingsService,
                private http: Http) {
        super(alfrescoSettingsService, http);
    }

    getHost(): string {
        return this.alfrescoSettingsService.bpmHost;
    }

    /**
     * Perform a login on behalf of the user and store the ticket returned
     *
     * @param username
     * @param password
     * @returns {Observable<R>|Observable<T>}
     */
    login(username: string, password: string): Observable<any> {
        return Observable.fromPromise(this.apiActivitiLogin(username, password))
            .map((response: any) => {
                return {
                    type: this.TYPE,
                    ticket: 'Basic ' + btoa(`${username}:${password}`)
                };
            })
            .catch(this.handleError);
    }

    /**
     * Delete the current login ticket from the server
     *
     * @returns {Observable<R>|Observable<T>}
     */
    logout() {
        return Observable.fromPromise(this.apiActivitiLogout())
            .map(res => <any> res)
            .do(response => {
                this.removeTicket(this.TYPE);
            })
            .catch(this.handleError);
    }

    /**
     * The method return true if the user is logged in
     * @returns {boolean}
     */
    isLoggedIn(): boolean {
        return !!this.getTicket();
    }

    private apiActivitiLogin(username: string, password: string) {
        let url = this.alfrescoSettingsService.getBPMApiBaseUrl() + '/app/authentication';
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let options = new RequestOptions({headers: headers});
        let data = 'j_username='
            + encodeURIComponent(username)
            + '&j_password='
            + encodeURIComponent(password)
            + '&_spring_security_remember_me=true&submit=Login';

        return this.http
            .post(url, data, options).toPromise();
    }

    private apiActivitiLogout() {
        let url = this.alfrescoSettingsService.getBPMApiBaseUrl() + '/app/logout';
        return this.http.get(url).toPromise();
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
    public saveTicket(ticket: string): void {
        if (ticket) {
            super.saveTicket(this.TYPE, ticket);
        }
    }

}
