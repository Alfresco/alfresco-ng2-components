/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable, Injector } from '@angular/core';
import { OidcAuthenticationService } from './oidc-authentication.service';
import { BasicAlfrescoAuthService } from '../basic-auth/basic-alfresco-auth.service';
import { Observable, from, merge } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { AuthenticationServiceInterface } from '../interfaces/authentication-service.interface';
import ee from 'event-emitter';
import { RedirectAuthService } from '../oidc/redirect-auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService implements AuthenticationServiceInterface, ee.Emitter {

    onLogin: Observable<any>;

    constructor(
        private injector: Injector,
        private redirectAuthService: RedirectAuthService
    ) {
        this.onLogin = merge(this.redirectAuthService.onLogin, this.basicAlfrescoAuthService.onLogin);
    }

    get on(): ee.EmitterMethod {
        return this.isOauth() ? this.oidcAuthenticationService.on : this.basicAlfrescoAuthService.on;
    }

    get off(): ee.EmitterMethod {
        return this.isOauth() ? this.oidcAuthenticationService.off : this.basicAlfrescoAuthService.off;
    }

    get once(): ee.EmitterMethod {
        return this.isOauth() ? this.oidcAuthenticationService.once : this.basicAlfrescoAuthService.once;
    }

    get emit(): (type: string, ...args: any[]) => void {
        return this.isOauth() ? this.oidcAuthenticationService.emit : this.basicAlfrescoAuthService.emit;
    }

    get onLogout(): Observable<any> {
        return this.isOauth() ? this.oidcAuthenticationService.onLogout : this.basicAlfrescoAuthService.onLogout;
    }

    get onError(): Observable<any> {
        return this.isOauth() ? this.oidcAuthenticationService.onError : this.basicAlfrescoAuthService.onError;
    }

    addTokenToHeader(requestUrl: string, headersArg?: HttpHeaders): Observable<HttpHeaders> {
        return this.isOauth() ? this.oidcAuthenticationService.addTokenToHeader(requestUrl, headersArg) : this.basicAlfrescoAuthService.addTokenToHeader(requestUrl, headersArg);
    }

    isECMProvider(): boolean {
        return this.isOauth() ? this.oidcAuthenticationService.isECMProvider() : this.basicAlfrescoAuthService.isECMProvider();
    }

    isBPMProvider(): boolean {
        return this.isOauth() ? this.oidcAuthenticationService.isBPMProvider() : this.basicAlfrescoAuthService.isBPMProvider();
    }

    isALLProvider(): boolean {
        return this.isOauth() ? this.oidcAuthenticationService.isALLProvider() : this.basicAlfrescoAuthService.isALLProvider();
    }

    private get oidcAuthenticationService(): OidcAuthenticationService {
        return this.injector.get(OidcAuthenticationService);
    }

    private get basicAlfrescoAuthService(): BasicAlfrescoAuthService {
        return this.injector.get(BasicAlfrescoAuthService);
    }

    getToken(): string {
        if (this.isOauth()) {
            return this.oidcAuthenticationService.getToken();
        } else {
            return this.basicAlfrescoAuthService.getToken();
        }
    }

    isLoggedIn(): boolean {
        if (this.isOauth()) {
            return this.oidcAuthenticationService.isLoggedIn();
        } else {
            return this.basicAlfrescoAuthService.isLoggedIn();
        }
    }

    logout(): Observable<any> {
        if (this.isOauth()) {
            return this.oidcAuthenticationService.logout();
        } else {
            return from(this.basicAlfrescoAuthService.logout());
        }
    }

    isEcmLoggedIn(): boolean {
        if (this.isOauth()) {
            return this.oidcAuthenticationService.isEcmLoggedIn();
        } else {
            return this.basicAlfrescoAuthService.isEcmLoggedIn();
        }
    }

    isBpmLoggedIn(): boolean {
        if (this.isOauth()) {
            return this.oidcAuthenticationService.isBpmLoggedIn();
        } else {
            return this.basicAlfrescoAuthService.isBpmLoggedIn();
        }
    }

    reset(): void {
        if (this.isOauth()) {
            return this.oidcAuthenticationService.reset();
        } else {
            return this.basicAlfrescoAuthService.reset();
        }
    }

    login(username: string, password: string, rememberMe?: boolean): Observable<{ type: string; ticket: any }> {
        if (this.isOauth()) {
            return this.oidcAuthenticationService.loginWithPassword(username, password);
        } else {
            return this.basicAlfrescoAuthService.login(username, password, rememberMe);
        }
    }

    getEcmUsername(): string {
        if (this.isOauth()) {
            return this.oidcAuthenticationService.getEcmUsername();
        } else {
            return this.basicAlfrescoAuthService.getEcmUsername();
        }
    }

    getBpmUsername(): string {
        if (this.isOauth()) {
            return this.oidcAuthenticationService.getBpmUsername();
        } else {
            return this.basicAlfrescoAuthService.getBpmUsername();
        }
    }

    getAuthHeaders(requestUrl: string, headers: HttpHeaders): HttpHeaders {
        if (this.isOauth()) {
            return this.oidcAuthenticationService.getAuthHeaders(requestUrl, headers);
        } else {
            return this.basicAlfrescoAuthService.getAuthHeaders(requestUrl, headers);
        }
    }

    isOauth(): boolean {
        return this.basicAlfrescoAuthService.isOauth();
    }
}
