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

import { LoginOptions, TokenResponse } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

/**
 * Provide authentication/authorization through OAuth2/OIDC protocol.
 */
export abstract class AuthService {
    abstract onLogin: Observable<any>;

    /**
     * An observable that emits a value when a logout event occurs.
     * Implement this observable to handle any necessary cleanup or state updates
     * when a user logs out of the application.
     */
    abstract onLogout$: Observable<void>;

    abstract onTokenReceived: Observable<any>;

    /**
     * An abstract observable that emits a boolean value indicating whether the discovery document
     * has been successfully loaded.
     */
    abstract isDiscoveryDocumentLoaded$: Observable<boolean>;

    /** Subscribe to whether the user has valid Id/Access tokens.  */
    abstract authenticated$: Observable<boolean>;

    /** Get whether the user has valid Id/Access tokens. */
    abstract authenticated: boolean;

    /** Subscribe to errors reaching the IdP. */
    abstract idpUnreachable$: Observable<Error>;

    /**
     * Initiate the IdP login flow.
     */
    abstract login(currentUrl?: string): Promise<void> | void;

    abstract baseAuthLogin(username: string, password: string): Observable<TokenResponse>;

    /**
     * Disconnect from IdP.
     *
     * @returns Promise may be returned depending on implementation
     */
    abstract logout(): Promise<void> | void;

    /**
     * Complete the login flow.
     *
     * In browsers, checks URL for auth and stored state. Call this once the application returns from IdP.
     *
     * @returns Promise, resolve with stored state, reject if unable to reach IdP
     */
    abstract loginCallback(loginOptions?: LoginOptions): Promise<string | undefined>;
    abstract updateIDPConfiguration(...args: any[]): void;
}
