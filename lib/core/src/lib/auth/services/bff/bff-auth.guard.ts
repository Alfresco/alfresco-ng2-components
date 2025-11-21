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

import { CanActivateFn } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { BffAuthService, BffUserResponse } from './bff-auth.service';
import { inject } from '@angular/core';
/* eslint-disable no-console */
/**
 * Guard function for route activation that checks user authentication via BffAuthService.
 * If the user is unauthenticated, it handles redirection and triggers login.
 *
 * @param _route - The activated route snapshot (unused).
 * @param state - The router state snapshot containing the target URL.
 * @returns An Observable emitting `true` if the user is authenticated, or `false` otherwise.
 */
export const BffAuthGuard: CanActivateFn = (_route, state) => {
    const auth = inject(BffAuthService);

    return auth.getUser().pipe(
        map((userResponse) => handleAuthRedirectIfUnauthenticated(userResponse, state.url, auth)),
        catchError((error) => {
            console.error('[BffAuthGuard] error: ', error);
            console.error('[BffAuthGuard] state.url: ', state.url);
            auth.login(state.url);
            return of(false);
        })
    );
};

/**
 * Handles authentication redirect if the user is unauthenticated.
 *
 * @param userResponse The response object containing authentication status.
 * @param url The URL to redirect to after authentication.
 * @param auth The BffAuthService instance used for authentication actions.
 * @returns True if the user is authenticated, otherwise false.
 */
function handleAuthRedirectIfUnauthenticated(userResponse: BffUserResponse, url: string, auth: BffAuthService): boolean {
    console.log('%c[BffAuthGuard] userResponse.isAuthenticated: ', 'color: orange;', userResponse.isAuthenticated);
    if (userResponse.isAuthenticated) {
        return true;
    }
    console.log('%c[BffAuthGuard] not authenticated, redirect to bff/login, state.url: ', 'color: orange;', url);
    auth.login(url);
    return false;
}
