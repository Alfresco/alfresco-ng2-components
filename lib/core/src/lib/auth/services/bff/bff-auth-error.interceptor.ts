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

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';
import { BffUrlBuilder } from './bff-url-builder.service';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/* eslint-disable no-console */
export const bffAuthErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const bffUrlBuilder = inject(BffUrlBuilder);
    const document = inject(DOCUMENT);

    return next(req).pipe(
        catchError((err: HttpErrorResponse) => {
            console.log('%c[bffAuthErrorInterceptor] err: ', 'color: red;', err);
            if (err.status === 401 && req.url.includes('/bff/')) {
                const url = bffUrlBuilder.getLoginUrl();
                console.log('%c[bffAuthErrorInterceptor] redirecting to login URL: ', 'color: yellow;', url);
                document.location.href = url;
                return EMPTY;
            }

            return throwError(() => err);
        })
    );
};
