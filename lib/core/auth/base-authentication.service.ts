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
import { Observable, Observer, ReplaySubject } from 'rxjs';

export abstract class BaseAuthenticationService {
    // TODO: read the idp url from the app config, so we can exclude it, when making requests to the provider;
    protected idpUrls: string[] = ['auth/realms', 'idp/'];
    protected bearerExcludedUrls: string[] = ['resources/', 'assets/'];
    abstract getToken(): string;

    getBearerExcludedUrls(): string[] {
        return this.bearerExcludedUrls;
    }

    getIdpUrls(): string[] {
        return this.idpUrls;
    }

    addTokenToHeader(headersArg?: HttpHeaders): Observable<HttpHeaders> {
        return new Observable((observer: Observer<any>) => {
            let headers = headersArg;
            if (!headers) {
                headers = new HttpHeaders();
            }
            try {
                const token: string = this.getToken();
                headers = headers.set('Authorization', 'Bearer ' + token);
                observer.next(headers);
                observer.complete();
            } catch (error) {
                observer.error(error);
            }
        });
    }

    abstract onLogin: ReplaySubject<any>;
    abstract onLogout: ReplaySubject<any>;

    abstract peopleApi: PeopleApi;
    abstract profileApi: UserProfileApi;

    abstract isLoggedIn(): boolean;
    abstract isLoggedInWith(provider: string): boolean;
    abstract isKerberosEnabled(): boolean;
    abstract isOauth(): boolean;
    abstract isImplicitFlow(): boolean;
    abstract isAuthCodeFlow(): boolean;
    abstract isPublicUrl(): boolean;
    abstract isECMProvider(): boolean;
    abstract isBPMProvider(): boolean;
    abstract isALLProvider(): boolean;
    abstract login(username: string, password: string, rememberMe?: boolean): Observable<{ type: string; ticket: any }>;
    abstract ssoImplicitLogin(): void;
    abstract isRememberMeSet(): boolean;
    abstract logout(): Observable<any>;
    abstract getTicketEcm(): string | null;
    abstract getTicketBpm(): string | null;
    abstract getTicketEcmBase64(): string | null;
    abstract isEcmLoggedIn(): boolean;
    abstract isBpmLoggedIn(): boolean;
    abstract getEcmUsername(): string;
    abstract getBpmUsername(): string;
    abstract setRedirect(url: any): void;
    abstract getRedirect(): string;
    abstract getBpmLoggedUser(): Observable<UserRepresentation>;
    abstract handleError(error: any): Observable<any>;
}
