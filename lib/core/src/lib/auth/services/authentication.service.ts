/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { OidcAuthenticationService } from '../oidc/oidc-authentication.service';
import { BasicAlfrescoAuthService } from '../basic-auth/basic-alfresco-auth.service';
import { Observable, Subject, from } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { AuthenticationServiceInterface } from '../interfaces/authentication-service.interface';
import { RedirectAuthService } from '../oidc/redirect-auth.service';
import { EventEmitter } from 'eventemitter3';
type EventEmitterInstance = InstanceType<typeof EventEmitter>;
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService implements AuthenticationServiceInterface {
    onLogin: Subject<any> = new Subject<any>();
    onLogout: Subject<any> = new Subject<any>();
    onTokenReceived: Subject<any> = new Subject<any>();

    constructor(
        private readonly injector: Injector,
        private readonly redirectAuthService: RedirectAuthService
    ) {
        this.redirectAuthService.onLogin.subscribe((value) => this.onLogin.next(value));

        this.redirectAuthService.onTokenReceived.subscribe((value) => this.onTokenReceived.next(value));

        this.basicAlfrescoAuthService.onLogin.subscribe((value) => this.onLogin.next(value));

        if (this.isOauth()) {
            this.oidcAuthenticationService.onLogout.subscribe((value) => this.onLogout.next(value));
        } else {
            this.basicAlfrescoAuthService.onLogout.subscribe((value) => this.onLogout.next(value));
        }
    }

    get on(): EventEmitterInstance['on'] {
        return this.isOauth() ? this.oidcAuthenticationService.on : this.basicAlfrescoAuthService.on;
    }

    get off(): EventEmitterInstance['off'] {
        return this.isOauth() ? this.oidcAuthenticationService.off : this.basicAlfrescoAuthService.off;
    }

    get once(): EventEmitterInstance['once'] {
        return this.isOauth() ? this.oidcAuthenticationService.once : this.basicAlfrescoAuthService.once;
    }

    get emit(): EventEmitterInstance['emit'] {
        return this.isOauth() ? this.oidcAuthenticationService.emit : this.basicAlfrescoAuthService.emit;
    }

    get onError(): Observable<any> {
        return this.isOauth() ? this.oidcAuthenticationService.onError : this.basicAlfrescoAuthService.onError;
    }

    addTokenToHeader(requestUrl: string, headersArg?: HttpHeaders): Observable<HttpHeaders> {
        return this.isOauth()
            ? this.oidcAuthenticationService.addTokenToHeader(requestUrl, headersArg)
            : this.basicAlfrescoAuthService.addTokenToHeader(requestUrl, headersArg);
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

    /**
     * Gets the username of the authenticated user.
     *
     * @returns the username of the authenticated user
     */
    getUsername(): string {
        if (this.isOauth()) {
            return this.oidcAuthenticationService.getUsername();
        } else {
            return this.basicAlfrescoAuthService.getUsername();
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

    isKerberosEnabled(): boolean {
        return !this.isOauth() ? this.basicAlfrescoAuthService.isKerberosEnabled() : false;
    }
}
