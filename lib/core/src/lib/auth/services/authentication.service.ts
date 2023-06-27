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

import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { AppConfigValues } from '../../app-config/app-config.service';
import { map, catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from './jwt-helper.service';
import { StorageService } from '../../common/services/storage.service';
import { BaseAuthenticationService } from './base-authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService extends BaseAuthenticationService {
    private storageService = inject(StorageService);
    readonly supportCodeFlow = false;

    constructor() {
        super();
        this.alfrescoApi.alfrescoApiInitialized.subscribe(() => {
            this.alfrescoApi.getInstance().reply('logged-in', () => {
                this.onLogin.next();
            });
        });
    }

    /**
     * Checks if the user logged in.
     *
     * @returns True if logged in, false otherwise
     */
    isLoggedIn(): boolean {
        if (!this.isOauth() && this.cookie.isEnabled() && !this.isRememberMeSet()) {
            return false;
        }
        return this.alfrescoApi.getInstance().isLoggedIn();
    }

    isLoggedInWith(provider: string): boolean {
        if (provider === 'BPM') {
            return this.isBpmLoggedIn();
        } else if (provider === 'ECM') {
            return this.isEcmLoggedIn();
        } else {
            return this.isLoggedIn();
        }
    }

    /**
     * Does the provider support OAuth?
     *
     * @returns True if supported, false otherwise
     */
    isOauth(): boolean {
        return this.alfrescoApi.getInstance().isOauthConfiguration();
    }

    /**
     * Logs the user in.
     *
     * @param username Username for the login
     * @param password Password for the login
     * @param rememberMe Stores the user's login details if true
     * @returns Object with auth type ("ECM", "BPM" or "ALL") and auth ticket
     */
    login(username: string, password: string, rememberMe: boolean = false): Observable<{ type: string; ticket: any }> {
        return from(this.alfrescoApi.getInstance().login(username, password)).pipe(
            map((response: any) => {
                this.saveRememberMeCookie(rememberMe);
                this.onLogin.next(response);
                return {
                    type: this.appConfig.get(AppConfigValues.PROVIDERS),
                    ticket: response
                };
            }),
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Logs the user in with SSO
     */
    ssoImplicitLogin() {
        this.alfrescoApi.getInstance().implicitLogin();
    }


    /**
     * Logs the user out.
     *
     * @returns Response event called when logout is complete
     */
    logout() {
        return from(this.callApiLogout()).pipe(
            tap((response) => {
                this.onLogout.next(response);
                return response;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    private callApiLogout(): Promise<any> {
        if (this.alfrescoApi.getInstance()) {
            return this.alfrescoApi.getInstance().logout();
        }
        return Promise.resolve();
    }

    /**
     * Checks if the user is logged in on an ECM provider.
     *
     * @returns True if logged in, false otherwise
     */
    isEcmLoggedIn(): boolean {
        if (this.isECMProvider() || this.isALLProvider()) {
            if (!this.isOauth() && this.cookie.isEnabled() && !this.isRememberMeSet()) {
                return false;
            }
            return this.alfrescoApi.getInstance().isEcmLoggedIn();
        }
        return false;
    }

    /**
     * Checks if the user is logged in on a BPM provider.
     *
     * @returns True if logged in, false otherwise
     */
    isBpmLoggedIn(): boolean {
        if (this.isBPMProvider() || this.isALLProvider()) {
            if (!this.isOauth() && this.cookie.isEnabled() && !this.isRememberMeSet()) {
                return false;
            }
            return this.alfrescoApi.getInstance().isBpmLoggedIn();
        }
        return false;
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

    isImplicitFlow(): boolean {
        return !!this.appConfig.oauth2?.implicitFlow;
    }

    isAuthCodeFlow(): boolean {
        return false;
    }

    /**
     * Gets the auth token.
     *
     * @returns Auth token string
     */
    getToken(): string {
        return this.storageService.getItem(JwtHelperService.USER_ACCESS_TOKEN);
    }

    reset() { }

    once(event: string): Observable<any> {
        const alfrescoApiEvent = event === 'token_received' ? 'token_issued' : event;
        return new Observable((subscriber) => {
            this.alfrescoApi.getInstance().oauth2Auth.once(alfrescoApiEvent, () => subscriber.next());
        });
    }
}
