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

import { inject, Injectable } from '@angular/core';
import { LoginOptions, OAuthErrorEvent, OAuthService } from 'angular-oauth2-oidc';

@Injectable({
    providedIn: 'root'
})
export class RetryLoginService {
    private oauthService = inject(OAuthService);

    /**
     * Attempts to log in a specified number of times if the initial login attempt fails.
     *
     * @param loginOptions - The options to be used for the login attempt.
     * @param maxLoginAttempts - The maximum number of login attempts. Defaults to 3.
     * @returns A promise that resolves to `true` if the login is successful, or rejects with an error if all attempts fail.
     */
    tryToLoginTimes(loginOptions: LoginOptions, maxLoginAttempts = 3): Promise<boolean> {
        let retryCount = 0;
        const maxRetries = maxLoginAttempts - 1;

        const attemptLogin = (): Promise<boolean> =>
            this.oauthService.tryLogin({ ...loginOptions }).catch((error) => {
                if (retryCount < maxRetries) {
                    console.error(
                        `Login attempt ${retryCount + 1} of ${maxLoginAttempts} failed. ${retryCount < maxLoginAttempts - 1 ? 'Retrying...' : ''}`
                    );
                    retryCount++;
                    return attemptLogin();
                } else {
                    const errorMessage = this.getErrorMessage(error, maxLoginAttempts);
                    throw new Error(errorMessage);
                }
            });

        return attemptLogin();
    }

    private getErrorMessage(error: any, maxLoginAttempts: number) {
        const isOAuthErrorEvent = error instanceof OAuthErrorEvent;
        let oAuthErrorMessage: string;
        if (isOAuthErrorEvent) {
            oAuthErrorMessage = (error.reason as any)?.reason || error.type.toString();
        }
        const errorDescription = oAuthErrorMessage || error;
        const errorMessage = `Login failed after ${maxLoginAttempts} attempts. caused by: ${errorDescription}`;
        return errorMessage;
    }
}
