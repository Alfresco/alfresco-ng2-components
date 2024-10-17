/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

const ROUTE_DEFAULT = '/';

export const OidcAuthGuard: CanActivateFn = async (): Promise<boolean> => {
    let onLogoutEmitted = false;

    const authService = inject(AuthService);
    const router = inject(Router);

    authService.onLogout$.subscribe(() => onLogoutEmitted = true);

    try {
        const route = await authService.loginCallback({ customHashFragment: window.location.search });
        return router.navigateByUrl(route, { replaceUrl: true });
    } catch (error) {
        console.log('onLogoutEmitted: ', onLogoutEmitted);
        if (onLogoutEmitted) {
            throw error;
        }
        return router.navigateByUrl(ROUTE_DEFAULT, { replaceUrl: true });
    }
};
