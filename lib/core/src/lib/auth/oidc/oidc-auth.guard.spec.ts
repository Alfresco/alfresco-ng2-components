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

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, UrlTree } from '@angular/router';
import { OidcAuthGuard } from './oidc-auth.guard';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

describe('OidcAuthGuard', () => {
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(() => {
        const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);
        const authSpy = jasmine.createSpyObj('AuthService', ['loginCallback']);

        TestBed.configureTestingModule({
            providers: [OidcAuthGuard, { provide: AuthService, useValue: authSpy }, { provide: Router, useValue: routerSpyObj }],
            imports: [RouterTestingModule]
        });

        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    });

    const runOidcGuardWithContext = async (): Promise<boolean | UrlTree> => {
        const result = TestBed.runInInjectionContext(OidcAuthGuard);
        if (result instanceof Observable) {
            return handleObservableResult(result);
        } else {
            return result;
        }
    };

    const handleObservableResult = (result: Observable<boolean | UrlTree>): Promise<boolean | UrlTree> =>
        new Promise<boolean | UrlTree>((resolve) => {
            result.subscribe((value) => {
                resolve(value);
            });
        });

    describe('canActivate', () => {
        it('should return true if is authenticated', async () => {
            authServiceSpy.authenticated = true;
            expect(await runOidcGuardWithContext()).toBe(true);
        });
    });

    describe('isAuthenticated', () => {
        it('should call loginCallback and navigateByUrl if not authenticated', async () => {
            authServiceSpy.authenticated = false;
            authServiceSpy.loginCallback.and.returnValue(Promise.resolve('/fake-route'));

            await runOidcGuardWithContext();

            expect(authServiceSpy.loginCallback).toHaveBeenCalled();
            expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/fake-route', { replaceUrl: true });
        });

        it('should navigate to default route if loginCallback fails', async () => {
            authServiceSpy.authenticated = false;
            authServiceSpy.loginCallback.and.returnValue(Promise.reject(new Error()));

            await runOidcGuardWithContext();

            expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/', { replaceUrl: true });
        });
    });
});
