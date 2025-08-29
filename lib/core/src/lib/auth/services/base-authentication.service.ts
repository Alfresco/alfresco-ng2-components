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

import { HttpHeaders } from '@angular/common/http';
import { RedirectionModel } from '../models/redirection.model';
import { Observable, Observer, ReplaySubject, throwError } from 'rxjs';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { CookieService } from '../../common/services/cookie.service';
import { AuthenticationServiceInterface } from '../interfaces/authentication-service.interface';
import ee from 'event-emitter';

export abstract class BaseAuthenticationService implements AuthenticationServiceInterface, ee.Emitter {
    on: ee.EmitterMethod;
    off: ee.EmitterMethod;
    once: ee.EmitterMethod;
    emit: (type: string, ...args: any[]) => void;

    protected redirectUrl: RedirectionModel = null;

    onError = new ReplaySubject<any>(1);
    onLogin = new ReplaySubject<any>(1);
    onLogout = new ReplaySubject<any>(1);

    protected constructor(
        protected appConfig: AppConfigService,
        protected cookie: CookieService
    ) {
        ee(this);
    }

    abstract getAuthHeaders(requestUrl: string, header: HttpHeaders): HttpHeaders;
    abstract getToken(): string;
    abstract isLoggedIn(): boolean;
    abstract logout(): any;
    abstract reset(): void;
    abstract getUsername(): string;

    /**
     * Adds the auth token to an HTTP header using the 'bearer' scheme.
     *
     * @param requestUrl the request url
     * @param headersArg Header that will receive the token
     * @returns The new header with the token added
     */
    addTokenToHeader(requestUrl: string, headersArg?: HttpHeaders): Observable<HttpHeaders> {
        return new Observable((observer: Observer<any>) => {
            let headers = headersArg;
            if (!headers) {
                headers = new HttpHeaders();
            }
            try {
                const header = this.getAuthHeaders(requestUrl, headers);

                observer.next(header);
                observer.complete();
            } catch (error) {
                observer.error(error);
            }
        });
    }

    isECMProvider(): boolean {
        const provider = this.appConfig.get('providers') as string;
        return provider && provider.toUpperCase() === 'ECM';
    }

    /**
     * Does the provider support BPM?
     *
     * @returns True if supported, false otherwise
     */
    isBPMProvider(): boolean {
        const provider = this.appConfig.get('providers');
        if (provider && (typeof provider === 'string' || provider instanceof String)) {
            return provider.toUpperCase() === 'BPM';
        } else {
            return false;
        }
    }

    /**
     * Does the provider support both ECM and BPM?
     *
     * @returns True if both are supported, false otherwise
     */
    isALLProvider(): boolean {
        const provider = this.appConfig.get('providers') as string;
        return provider && provider.toUpperCase() === 'ALL';
    }

    /**
     * Prints an error message in the console browser
     *
     * @param error Error message
     * @returns Object representing the error message
     */
    handleError(error: any): Observable<any> {
        this.onError.next(error || 'Server error');
        return throwError(() => error || 'Server error');
    }

    isOauth(): boolean {
        return this.appConfig.get(AppConfigValues.AUTHTYPE) === 'OAUTH';
    }
}
