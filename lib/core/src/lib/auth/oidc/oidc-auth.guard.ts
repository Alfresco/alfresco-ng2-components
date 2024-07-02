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
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const ROUTE_DEFAULT = '/';

export const OidcAuthGuard = (): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.authenticated) {
        return true;
    }

    return auth
        .loginCallback({ customHashFragment: window.location.search })
        .then((route) => router.navigateByUrl(route, { replaceUrl: true }))
        .catch(() => router.navigateByUrl(ROUTE_DEFAULT, { replaceUrl: true }));
};
