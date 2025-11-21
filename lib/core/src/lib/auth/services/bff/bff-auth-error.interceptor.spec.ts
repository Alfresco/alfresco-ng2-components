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

import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EMPTY, throwError, firstValueFrom } from 'rxjs';
import { bffAuthErrorInterceptor } from './bff-auth-error.interceptor';

describe('bffAuthErrorInterceptor', () => {
    it('should return EMPTY when 401 error occurs on /bff/ URL', async () => {
        const req = new HttpRequest('GET', '/bff/resource');
        const httpError = new HttpErrorResponse({ status: 401, url: '/bff/resource' });
        const next = () => throwError(() => httpError);

        const result$ = TestBed.runInInjectionContext(() => bffAuthErrorInterceptor(req, next));

        const result = await firstValueFrom(result$, { defaultValue: null });
        expect(result).toBeNull();
    });

    it('should rethrow error when 401 on non-/bff/ URL', async () => {
        const req = new HttpRequest('GET', '/api/resource');
        const httpError = new HttpErrorResponse({ status: 401, url: '/api/resource' });
        const next = () => throwError(() => httpError);

        const result$ = TestBed.runInInjectionContext(() => bffAuthErrorInterceptor(req, next));

        await expectAsync(firstValueFrom(result$)).toBeRejectedWith(httpError);
    });

    it('should rethrow error when status is not 401 even on /bff/ URL', async () => {
        const req = new HttpRequest('GET', '/bff/resource');
        const httpError = new HttpErrorResponse({ status: 500, url: '/bff/resource' });
        const next = () => throwError(() => httpError);

        const result$ = TestBed.runInInjectionContext(() => bffAuthErrorInterceptor(req, next));

        await expectAsync(firstValueFrom(result$)).toBeRejectedWith(httpError);
    });

    it('should pass through successful response without intercepting', async () => {
        const req = new HttpRequest('GET', '/bff/resource');
        const next = () => EMPTY;

        const result$ = TestBed.runInInjectionContext(() => bffAuthErrorInterceptor(req, next));

        const result = await firstValueFrom(result$, { defaultValue: null });
        expect(result).toBeNull();
    });
});
