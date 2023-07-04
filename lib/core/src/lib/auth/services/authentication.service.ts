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
import { Observable, of } from 'rxjs';
import { BaseAuthenticationService } from './base-authentication.service';
import { AppConfigService } from '../../app-config';
import { CookieService, LogService } from '../../common';
import { HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService extends BaseAuthenticationService {

    constructor(appConfig: AppConfigService,
                cookie: CookieService,
                logService: LogService,
                private injector: Injector) {
        super(appConfig, cookie, logService);

        (this.isOauth() ? this.oidcAuthenticationService.onLogin : this.basicAlfrescoAuthService.onLogin)
            .pipe(
                tap(() => this.onLogin.next())
            ).subscribe();
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
            return of(this.basicAlfrescoAuthService.logout());
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
}
