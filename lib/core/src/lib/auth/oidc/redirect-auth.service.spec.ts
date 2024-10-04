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
import { OAuthService, OAuthEvent, OAuthStorage, AUTH_CONFIG, TokenResponse } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { RedirectAuthService } from './redirect-auth.service';
import { AUTH_MODULE_CONFIG } from './auth-config';

describe('RedirectAuthService', () => {
    let service: RedirectAuthService;
    const mockOAuthStorage: Partial<OAuthStorage> = {
        getItem: jasmine.createSpy('getItem'),
        removeItem: jasmine.createSpy('removeItem'),
        setItem: jasmine.createSpy('setItem')
    };
    const oauthEvents$ = new Subject<OAuthEvent>();
    const mockOauthService: Partial<OAuthService> = {
        clearHashAfterLogin: false,
        events: oauthEvents$,
        configure: () => {},
        hasValidAccessToken: jasmine.createSpy().and.returnValue(true),
        hasValidIdToken: jasmine.createSpy().and.returnValue(true),
        setupAutomaticSilentRefresh: () => {
            mockOauthService.silentRefresh();
            mockOauthService.refreshToken();
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RedirectAuthService,
                { provide: OAuthService, useValue: mockOauthService },
                { provide: OAuthStorage, useValue: mockOAuthStorage },
                { provide: AUTH_CONFIG, useValue: {} },
                { provide: AUTH_MODULE_CONFIG, useValue: {} }
            ]
        });

        TestBed.inject(OAuthService);
        service = TestBed.inject(RedirectAuthService);
        spyOn(service, 'ensureDiscoveryDocument').and.resolveTo(true);
        mockOauthService.getAccessToken = () => 'access-token';
    });

    it('should emit event when token_received event is received', () => {
        const onTokenReceivedSpy = jasmine.createSpy();
        service.onTokenReceived.subscribe(onTokenReceivedSpy);

        oauthEvents$.next({ type: 'token_received' } as OAuthEvent);

        expect(onTokenReceivedSpy).toHaveBeenCalled();
    });

    it('should not emit event when a different event is received', () => {
        const onTokenReceivedSpy = jasmine.createSpy();
        service.onTokenReceived.subscribe(onTokenReceivedSpy);

        oauthEvents$.next({ type: 'user_profile_loaded' } as OAuthEvent);

        expect(onTokenReceivedSpy).not.toHaveBeenCalled();
    });

    it('should call refresh token and silent refresh when automatic silent refresh is setup', async () => {
        let refreshTokenCalled = false;
        let silentRefreshCalled = false;

        mockOauthService.refreshToken = async () => {
            refreshTokenCalled = true;
            return Promise.resolve({} as TokenResponse);
        };
        mockOauthService.silentRefresh = async () => {
            silentRefreshCalled = true;
            return Promise.resolve({} as OAuthEvent);
        };

        await service.init();

        expect(refreshTokenCalled).toBe(true);
        expect(silentRefreshCalled).toBe(true);
    });

});
