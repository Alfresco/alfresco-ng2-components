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
import { OAuthService, OAuthEvent, OAuthStorage, AUTH_CONFIG, TokenResponse, AuthConfig, OAuthLogger } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { RedirectAuthService } from './redirect-auth.service';
import { AUTH_MODULE_CONFIG } from './auth-config';
import { RetryLoginService } from './retry-login.service';

describe('RedirectAuthService', () => {
    let service: RedirectAuthService;
    let ensureDiscoveryDocumentSpy: jasmine.Spy;
    let retryLoginServiceSpy: jasmine.SpyObj<RetryLoginService>;

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
        logOut: () => {},
        hasValidAccessToken: jasmine.createSpy().and.returnValue(true),
        hasValidIdToken: jasmine.createSpy().and.returnValue(true),
        setupAutomaticSilentRefresh: () => {
            mockOauthService.silentRefresh();
            mockOauthService.refreshToken();
        },
        showDebugInformation: false
    };

    beforeEach(() => {
        retryLoginServiceSpy = jasmine.createSpyObj('RetryLoginService', ['tryToLoginTimes']);
        TestBed.configureTestingModule({
            providers: [
                RedirectAuthService,
                { provide: OAuthService, useValue: mockOauthService },
                { provide: OAuthLogger, useValue: {
                    error: () => {}, info: () => {}
                } },
                { provide: OAuthStorage, useValue: mockOAuthStorage },
                { provide: RetryLoginService, useValue: retryLoginServiceSpy },
                { provide: AUTH_CONFIG, useValue: {
                    sessionChecksEnabled: false
                } },
                { provide: AUTH_MODULE_CONFIG, useValue: {} }
            ]
        });

        TestBed.inject(OAuthService);
        service = TestBed.inject(RedirectAuthService);
        ensureDiscoveryDocumentSpy = spyOn(service, 'ensureDiscoveryDocument').and.resolveTo(true);
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

    it('should remove all auth items from the storage if access token is set and is NOT valid', () => {
        mockOauthService.getAccessToken = () => 'access-token';
        mockOauthService.hasValidAccessToken = () => false;
        (mockOauthService.events as Subject<OAuthEvent>).next({ type: 'discovery_document_loaded' } as OAuthEvent);

        expect(mockOAuthStorage.removeItem).toHaveBeenCalledWith('access_token');
        expect(mockOAuthStorage.removeItem).toHaveBeenCalledWith('access_token_stored_at');
        expect(mockOAuthStorage.removeItem).toHaveBeenCalledWith('expires_at');
        expect(mockOAuthStorage.removeItem).toHaveBeenCalledWith('granted_scopes');
        expect(mockOAuthStorage.removeItem).toHaveBeenCalledWith('id_token');
        expect(mockOAuthStorage.removeItem).toHaveBeenCalledWith('id_token_claims_obj');
        expect(mockOAuthStorage.removeItem).toHaveBeenCalledWith('id_token_expires_at');
        expect(mockOAuthStorage.removeItem).toHaveBeenCalledWith('id_token_stored_at');
        expect(mockOAuthStorage.removeItem).toHaveBeenCalledWith('nonce');
        expect(mockOAuthStorage.removeItem).toHaveBeenCalledWith('PKCE_verifier');
        expect(mockOAuthStorage.removeItem).toHaveBeenCalledWith('refresh_token');
        expect(mockOAuthStorage.removeItem).toHaveBeenCalledWith('session_state');
    });

    it('should NOT remove auth items from the storage if access token is valid', () => {
        mockOauthService.getAccessToken = () => 'access-token';
        mockOauthService.hasValidAccessToken = () => true;
        (mockOAuthStorage.removeItem as any).calls.reset();

        (mockOauthService.events as Subject<OAuthEvent>).next({ type: 'discovery_document_loaded' } as OAuthEvent);

        expect(mockOAuthStorage.removeItem).not.toHaveBeenCalled();
    });

    it('should configure OAuthService with given config', async () => {
        const config = { sessionChecksEnabled: false } as AuthConfig;
        const configureSpy = spyOn(mockOauthService as any, 'configure');
        const setupAutomaticSilentRefreshSpy = spyOn(mockOauthService as any, 'setupAutomaticSilentRefresh');
        ensureDiscoveryDocumentSpy.and.resolveTo(true);

        await service.init();

        expect(configureSpy).toHaveBeenCalledWith(config);
        expect(setupAutomaticSilentRefreshSpy).toHaveBeenCalled();
    });

    it('should send isDiscoveryDocumentLoadedSubject$ when ensureDiscoveryDocument is resolved', async () => {
        ensureDiscoveryDocumentSpy.and.resolveTo();

        await service.init();

        const isDiscoveryDocumentLoadedPromise = new Promise<boolean>((resolve) => {
            service.isDiscoveryDocumentLoaded$.subscribe(resolve);
        });

        expect(await isDiscoveryDocumentLoadedPromise).toBeTrue();
    });

    it('should return redirectUrl if login successfully', async () => {
        const logOutSpy = spyOn(mockOauthService as OAuthService, 'logOut');

        const expectedRedirectUrl = '/';
        const loginCallbackResponse = await service.loginCallback();

        expect(loginCallbackResponse).toEqual(expectedRedirectUrl);
        expect(logOutSpy).not.toHaveBeenCalled();

    });

    it('should logout user if login fails', async () => {
        const logOutSpy = spyOn(mockOauthService as OAuthService, 'logOut');

        retryLoginServiceSpy.tryToLoginTimes.and.rejectWith('error');

        await service.loginCallback();

        expect(logOutSpy).toHaveBeenCalledTimes(1);
    });


});
