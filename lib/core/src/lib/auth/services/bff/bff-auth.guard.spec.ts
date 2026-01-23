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

import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { BffAuthGuard } from './bff-auth.guard';
import { BffAuthService, BffUserResponse } from './bff-auth.service';

describe('BffAuthGuard', () => {
    let bffAuthService: jasmine.SpyObj<BffAuthService>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    const mockAuthenticatedUser: BffUserResponse = {
        isAuthenticated: true,
        user: {
            sub: 'user123',
            email: 'user@example.com',
            hxp_account: 'account123',
            name: 'Test User',
            email_verified: true,
            preferred_username: 'testuser',
            given_name: 'Test',
            family_name: 'User',
            roles: ['ROLE_USER'],
            appKey: 'app123'
        }
    };

    const mockUnauthenticatedUser: BffUserResponse = {
        isAuthenticated: false,
        user: {
            sub: '',
            email: '',
            hxp_account: '',
            name: '',
            email_verified: false,
            preferred_username: '',
            given_name: '',
            family_name: '',
            roles: [],
            appKey: ''
        }
    };

    beforeEach(() => {
        bffAuthService = jasmine.createSpyObj('BffAuthService', ['getUser', 'login']);

        TestBed.configureTestingModule({
            providers: [{ provide: BffAuthService, useValue: bffAuthService }]
        });

        mockRoute = {} as ActivatedRouteSnapshot;
        mockState = { url: '/protected-route' } as RouterStateSnapshot;
    });

    it('should allow navigation when user is authenticated', async () => {
        bffAuthService.getUser.and.returnValue(of(mockAuthenticatedUser));

        const result$ = TestBed.runInInjectionContext(() => BffAuthGuard(mockRoute, mockState)) as Observable<boolean>;
        const result = await firstValueFrom(result$);

        expect(result).toBe(true);
        expect(bffAuthService.getUser).toHaveBeenCalled();
        expect(bffAuthService.login).not.toHaveBeenCalled();
    });

    it('should deny navigation and call login when user is not authenticated', async () => {
        bffAuthService.getUser.and.returnValue(of(mockUnauthenticatedUser));

        const result$ = TestBed.runInInjectionContext(() => BffAuthGuard(mockRoute, mockState)) as Observable<boolean>;
        const result = await firstValueFrom(result$);

        expect(result).toBe(false);
        expect(bffAuthService.getUser).toHaveBeenCalled();
        expect(bffAuthService.login).toHaveBeenCalledWith('/protected-route');
    });

    it('should deny navigation and call login when getUser throws an error', async () => {
        const error = new Error('Network error');
        bffAuthService.getUser.and.returnValue(throwError(() => error));

        const result$ = TestBed.runInInjectionContext(() => BffAuthGuard(mockRoute, mockState)) as Observable<boolean>;
        const result = await firstValueFrom(result$);

        expect(result).toBe(false);
        expect(bffAuthService.getUser).toHaveBeenCalled();
        expect(bffAuthService.login).toHaveBeenCalledWith('/protected-route');
    });

    it('should pass correct state URL to login method', async () => {
        const customState = { url: '/custom/path?query=123' } as RouterStateSnapshot;
        bffAuthService.getUser.and.returnValue(of(mockUnauthenticatedUser));

        const result$ = TestBed.runInInjectionContext(() => BffAuthGuard(mockRoute, customState)) as Observable<boolean>;
        await firstValueFrom(result$);

        expect(bffAuthService.login).toHaveBeenCalledWith('/custom/path?query=123');
    });

    it('should handle empty state URL', async () => {
        const emptyState = { url: '' } as RouterStateSnapshot;
        bffAuthService.getUser.and.returnValue(of(mockUnauthenticatedUser));

        const result$ = TestBed.runInInjectionContext(() => BffAuthGuard(mockRoute, emptyState)) as Observable<boolean>;
        await firstValueFrom(result$);

        expect(bffAuthService.login).toHaveBeenCalledWith('');
    });
});
