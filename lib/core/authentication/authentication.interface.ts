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

import { Observable, ReplaySubject } from 'rxjs';
import { RedirectionModel } from '../models/redirection.model';
import { PeopleApi, UserProfileApi, UserRepresentation } from '@alfresco/js-api';
import { HttpHeaders } from '@angular/common/http';

export interface ADFAuthenticationService {
    onLogin: ReplaySubject<any>;
    onLogout: ReplaySubject<any>;

    peopleApi: PeopleApi;
    profileApi: UserProfileApi;

    isLoggedIn(): boolean;
    isLoggedInWith(provider: string): boolean;
    isKerberosEnabled(): boolean;
    isOauth(): boolean;
    oidcHandlerEnabled(): boolean;
    isImplicitFlow(): boolean;
    isAuthCodeFlow(): boolean;
    isPublicUrl(): boolean;
    isECMProvider(): boolean;
    isBPMProvider(): boolean;
    isALLProvider(): boolean;
    login(username: string, password: string, rememberMe?: boolean): Observable<{ type: string; ticket: any }>;
    ssoImplicitLogin(): void;
    ssoCodeFlowLogin?(): void;
    isRememberMeSet(): boolean;
    logout(): Observable<any>;
    getTicketEcm(): string | null;
    getTicketBpm(): string | null;
    getTicketEcmBase64(): string | null;
    isEcmLoggedIn(): boolean;
    isBpmLoggedIn(): boolean;
    getEcmUsername(): string;
    getBpmUsername(): string;
    setRedirect(url: RedirectionModel): void;
    getRedirect(): string;
    getBpmLoggedUser(): Observable<UserRepresentation>;
    handleError(error: any): Observable<any>;
    getBearerExcludedUrls(): string[];
    getToken(): string;
    addTokenToHeader(headersArg?: HttpHeaders): Observable<HttpHeaders>;
}
