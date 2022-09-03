/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { PeopleApi, UserProfileApi, UserRepresentation } from '@alfresco/js-api';
import { HttpHeaders } from '@angular/common/http';
import { from, Observable, Observer, ReplaySubject, throwError } from 'rxjs';
import { AppConfigService, AppConfigValues } from '../app-config/app-config.service';
import { RedirectionModel } from '../models/redirection.model';
import { AlfrescoApiService } from './alfresco-api.service';
import { CookieService } from './cookie.service';
import { LogService } from './log.service';

export abstract class BaseAuthenticationService {
    protected bearerExcludedUrls: readonly string[] = ['resources/', 'assets/', 'auth/realms', 'idp/'];
    protected redirectUrl: RedirectionModel = null;

    onLogin = new ReplaySubject<any>(1);
    onLogout = new ReplaySubject<any>(1);

    _peopleApi: PeopleApi;
    get peopleApi(): PeopleApi {
        this._peopleApi = this._peopleApi ?? new PeopleApi(this.alfrescoApi.getInstance());
        return this._peopleApi;
    }

    _profileApi: UserProfileApi;
    get profileApi(): UserProfileApi {
        this._profileApi = this._profileApi ?? new UserProfileApi(this.alfrescoApi.getInstance());
        return this._profileApi;
    }

    constructor(
        protected alfrescoApi: AlfrescoApiService,
        protected appConfig: AppConfigService,
        protected cookie: CookieService,
        private logService: LogService
    ) {}

    abstract readonly supportCodeFlow: boolean;
    abstract getToken(): string;
    abstract isLoggedIn(): boolean;
    abstract isLoggedInWith(provider: string): boolean;
    abstract isOauth(): boolean;
    abstract isImplicitFlow(): boolean;
    abstract isAuthCodeFlow(): boolean;
    abstract login(username: string, password: string, rememberMe?: boolean): Observable<{ type: string; ticket: any }>;
    abstract ssoImplicitLogin(): void;
    abstract logout(): Observable<any>;
    abstract isEcmLoggedIn(): boolean;
    abstract isBpmLoggedIn(): boolean;
    abstract setRedirect(url: any): void;
    abstract getRedirect(): string;
    abstract isRememberMeSet(): boolean;

    getBearerExcludedUrls(): readonly string[] {
        return this.bearerExcludedUrls;
    }

    /**
     * Adds the auth token to an HTTP header using the 'bearer' scheme.
     *
     * @param headersArg Header that will receive the token
     * @returns The new header with the token added
     */
    addTokenToHeader(headersArg?: HttpHeaders): Observable<HttpHeaders> {
        return new Observable((observer: Observer<any>) => {
            let headers = headersArg;
            if (!headers) {
                headers = new HttpHeaders();
            }
            try {
                const header = this.getAuthHeaders(headers);

                observer.next(header);
                observer.complete();
            } catch (error) {
                observer.error(error);
            }
        });
    }

    private getAuthHeaders(header: HttpHeaders): HttpHeaders {
        const authType = this.appConfig.get<string>(AppConfigValues.AUTHTYPE, 'BASIC');

        switch (authType) {
            case 'OAUTH':
                return this.addBearerToken(header);
            case 'BASIC':
                return this.addBasicAuth(header);
            default:
                return header;
        }
    }

    private addBearerToken(header: HttpHeaders): HttpHeaders {
        const token: string = this.getToken();

        if (!token) {
            return header;
        }

        return header.set('Authorization', 'bearer ' + token);
    }

    private addBasicAuth(header: HttpHeaders): HttpHeaders {
        const ticket: string = this.getTicketEcmBase64();

        if (!ticket) {
            return header;
        }

        return header.set('Authorization', ticket);
    }

    /**
     * Gets the ECM username.
     *
     * @returns The ECM username
     */
    getEcmUsername(): string {
        return this.alfrescoApi.getInstance().getEcmUsername();
    }

    /**
     * Gets the BPM username
     *
     * @returns The BPM username
     */
    getBpmUsername(): string {
        return this.alfrescoApi.getInstance().getBpmUsername();
    }

    isPublicUrl(): boolean {
        return this.alfrescoApi.getInstance().isPublicUrl();
    }

    /**
     * Does the provider support ECM?
     *
     * @returns True if supported, false otherwise
     */
    isECMProvider(): boolean {
        return this.alfrescoApi.getInstance().isEcmConfiguration();
    }

    /**
     * Does the provider support BPM?
     *
     * @returns True if supported, false otherwise
     */
    isBPMProvider(): boolean {
        return this.alfrescoApi.getInstance().isBpmConfiguration();
    }

    /**
     * Does the provider support both ECM and BPM?
     *
     * @returns True if both are supported, false otherwise
     */
    isALLProvider(): boolean {
        return this.alfrescoApi.getInstance().isEcmBpmConfiguration();
    }

    /**
     * Gets the ECM ticket stored in the Storage.
     *
     * @returns The ticket or `null` if none was found
     */
    getTicketEcm(): string | null {
        return this.alfrescoApi.getInstance()?.getTicketEcm();
    }

    /**
     * Gets the BPM ticket stored in the Storage.
     *
     * @returns The ticket or `null` if none was found
     */
    getTicketBpm(): string | null {
        return this.alfrescoApi.getInstance()?.getTicketBpm();
    }

    /**
     * Gets the BPM ticket from the Storage in Base 64 format.
     *
     * @returns The ticket or `null` if none was found
     */
    getTicketEcmBase64(): string | null {
        const ticket = this.alfrescoApi.getInstance()?.getTicketEcm();
        if (ticket) {
            return 'Basic ' + btoa(ticket);
        }
        return null;
    }

    /**
     * Gets information about the user currently logged into APS.
     *
     * @returns User information
     */
    getBpmLoggedUser(): Observable<UserRepresentation> {
        return from(this.profileApi.getProfile());
    }

    /**
     * Prints an error message in the console browser
     *
     * @param error Error message
     * @returns Object representing the error message
     */
    handleError(error: any): Observable<any> {
        this.logService.error('Error when logging in', error);
        return throwError(error || 'Server error');
    }

    /**
     * Does kerberos enabled?
     *
     * @returns True if enabled, false otherwise
     */
    isKerberosEnabled(): boolean {
        return this.appConfig.get<boolean>(AppConfigValues.AUTH_WITH_CREDENTIALS, false);
    }
}
