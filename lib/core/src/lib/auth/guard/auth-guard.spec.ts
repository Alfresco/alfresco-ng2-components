/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { AuthenticationService } from '../services/authentication.service';
import { JwtHelperService } from '../services/jwt-helper.service';
import { AuthGuard } from './auth-guard';
import { AuthGuardService } from './auth-guard.service';

const ACCESS_TOKEN_KEY = 'access_token';
const PREFIXED_ACCESS_TOKEN_KEY = 'SOME_APP_access_token';
const CURRENT_ROUTE = '/current-route';

const buildToken = (payload: object): string => `header.${btoa(JSON.stringify(payload))}.signature`;

const tokenFor = (preferredUsername: string): string => buildToken({ preferred_username: preferredUsername });

const tokenWithoutUsername = buildToken({ sub: 'user-12345', aud: 'test' });

describe('AuthGuard cross-tab storage handling', () => {
    let authGuardService: jasmine.SpyObj<AuthGuardService>;
    let location: jasmine.SpyObj<Location>;
    let windowRef: { location: jasmine.SpyObj<Location>; addEventListener: jasmine.Spy; removeEventListener: jasmine.Spy };

    const route = new ActivatedRouteSnapshot();
    const state = { url: CURRENT_ROUTE } as RouterStateSnapshot;

    /** Replays a storage event through every listener the guard registered on the stubbed window. */
    const emitStorageEvent = (key: string | null, oldValue: string | null, newValue: string | null): void => {
        const event = { key, oldValue, newValue } as StorageEvent;
        windowRef.addEventListener.calls
            .allArgs()
            .filter(([type]) => type === 'storage')
            .forEach(([, listener]) => listener(event));
    };

    beforeEach(async () => {
        authGuardService = jasmine.createSpyObj<AuthGuardService>('AuthGuardService', ['navigate', 'redirectToUrl'], { withCredentials: false });
        location = jasmine.createSpyObj<Location>('Location', ['assign', 'reload']);
        windowRef = {
            location,
            addEventListener: jasmine.createSpy('addEventListener'),
            removeEventListener: jasmine.createSpy('removeEventListener')
        };

        TestBed.configureTestingModule({
            providers: [
                JwtHelperService,
                { provide: DOCUMENT, useValue: { defaultView: windowRef } },
                { provide: Router, useValue: { url: CURRENT_ROUTE } },
                { provide: AuthGuardService, useValue: authGuardService },
                { provide: AuthenticationService, useValue: { isLoggedIn: () => true } },
                { provide: OAuthStorage, useValue: { getItem: () => null, setItem: () => {}, removeItem: () => {} } }
            ]
        });

        await TestBed.runInInjectionContext(() => AuthGuard(route, state));
    });

    describe('when another tab signs out (AAE-55444)', () => {
        it('should reload when a prefixed access token is removed and it carries no preferred_username', () => {
            emitStorageEvent(PREFIXED_ACCESS_TOKEN_KEY, tokenWithoutUsername, null);

            expect(location.reload).toHaveBeenCalledTimes(1);
        });

        it('should reload when an unprefixed access token is removed and it carries no preferred_username', () => {
            emitStorageEvent(ACCESS_TOKEN_KEY, tokenWithoutUsername, null);

            expect(location.reload).toHaveBeenCalledTimes(1);
        });

        it('should reload when the removed access token carries a preferred_username', () => {
            emitStorageEvent(ACCESS_TOKEN_KEY, tokenFor('jane.doe'), null);

            expect(location.reload).toHaveBeenCalledTimes(1);
        });

        it('should reload rather than throw when the removed access token cannot be decoded', () => {
            expect(() => emitStorageEvent(ACCESS_TOKEN_KEY, 'not-a-jwt', null)).not.toThrow();

            expect(location.reload).toHaveBeenCalledTimes(1);
        });
    });

    describe('when the access token is replaced', () => {
        it('should redirect to the current route when another user signs in', () => {
            emitStorageEvent(ACCESS_TOKEN_KEY, tokenFor('jane.doe'), tokenFor('john.doe'));

            expect(authGuardService.navigate).toHaveBeenCalledWith(CURRENT_ROUTE);
            expect(location.reload).not.toHaveBeenCalled();
        });

        it('should ignore a silent refresh that keeps the same user', () => {
            emitStorageEvent(ACCESS_TOKEN_KEY, tokenFor('jane.doe'), tokenFor('jane.doe'));

            expect(authGuardService.navigate).not.toHaveBeenCalled();
            expect(location.reload).not.toHaveBeenCalled();
        });
    });

    describe('events the guard must ignore', () => {
        it('should not throw when the whole storage area is cleared and the key is null', () => {
            expect(() => emitStorageEvent(null, null, null)).not.toThrow();

            expect(location.reload).not.toHaveBeenCalled();
        });

        it('should ignore an event whose value did not change', () => {
            const token = tokenFor('jane.doe');

            emitStorageEvent(ACCESS_TOKEN_KEY, token, token);

            expect(authGuardService.navigate).not.toHaveBeenCalled();
            expect(location.reload).not.toHaveBeenCalled();
        });

        ['expires_at', 'refresh_token', 'access_token_stored_at', 'id_token'].forEach((key) => {
            it(`should ignore the unrelated "${key}" key`, () => {
                emitStorageEvent(key, 'something', null);

                expect(authGuardService.navigate).not.toHaveBeenCalled();
                expect(location.reload).not.toHaveBeenCalled();
            });
        });
    });

    describe('legacy basic auth tickets', () => {
        ['ticket-ECM', 'ticket-BPM'].forEach((key) => {
            it(`should redirect to the current route when "${key}" is set`, () => {
                emitStorageEvent(key, null, 'a-new-ticket');

                expect(authGuardService.navigate).toHaveBeenCalledWith(CURRENT_ROUTE);
                expect(location.reload).not.toHaveBeenCalled();
            });

            it(`should reload the tab when "${key}" is removed`, () => {
                emitStorageEvent(key, 'a-ticket', null);

                expect(location.reload).toHaveBeenCalledTimes(1);
            });
        });
    });
});
