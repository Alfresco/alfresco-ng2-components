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

import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response } from 'angular2/http';
import { AlfrescoSettingsService } from './AlfrescoSettingsService.service';

/**
 * The AlfrescoAuthenticationService provide the login service and store the token in the localStorage
 */
@Injectable()
export class AlfrescoAuthenticationService {

    private _authUrl: string = '/alfresco/api/-default-/public/authentication/versions/1';

    /**
     * Constructor
     * @param http
     */
    constructor(public http: Http, private alfrescoSettingsService: AlfrescoSettingsService) {
    }

    getBaseUrl(): string {
        return this.alfrescoSettingsService.host + this._authUrl;
    }

    /**
     * The method return tru if the user is logged in
     * @returns {boolean}
     */
    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    /**
     * Method to delegate to POST login
     * @param username
     * @param password
     * @returns {Observable<R>|Observable<T>}
     */
    login(username: string, password: string) {
        return this.loginPost(username, password);
    }

    /**
     * The method provide the login with POST Request
     * @param username
     * @param password
     * @returns {Observable<R>|Observable<T>}
     */
    loginPost(username: string, password: string) {
        let credentials = '{ "userId": "' + username + '", "password": "' + password + '" }';

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        return this.http.post(this.getBaseUrl() + '/tickets', credentials, {
                headers: headers
            })
            .map((res: any) => {
                let response = res.json();
                this.saveToken(response.entry.id);
                return this.getToken();
            })
            .catch(this.handleError);
    }

    /**
     * Delete the current login ticket from the server
     *
     * @returns {Observable<R>|Observable<T>}
     */
    loginDelete() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Basic ' + btoa(this.getToken()));

        return this.http.delete(this.getBaseUrl() + '/tickets/-me-', {
                headers: headers
            })
            .map((res: any) => {
                this.removeToken();
                this.saveToken('');
            })
            .catch(this.handleError);
    }

    /**
     * Return the token stored in the localStorage
     * @param token
     */
    public getToken (): string {
        return localStorage.getItem('token');
    }

    /**
     * The method save the toke in the localStorage
     * @param token
     */
    public saveToken(token): void {
        if (token) {
            localStorage.setItem('token', token);
        }
    }

    /**
     * Remove the login token from localStorage
     */
    public removeToken() :void {
        localStorage.removeItem('token');
    }

    /**
     * The method remove the token from the local storage
     * @returns {Observable<T>}
     */
    public logout() {
        return this.loginDelete();
    }

    /**
     * The method write the error in the console browser
     * @param error
     * @returns {ErrorObservable}
     */
    private handleError(error: Response) {
        console.error('Error when logging in', error);
        return Observable.throw(error.json().message || 'Server error');
    }
}
