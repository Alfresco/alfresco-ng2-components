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

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
    OAuthService,
    OAuthEvent,
    OAuthStorage,
    AUTH_CONFIG,
    TokenResponse,
    AuthConfig,
    OAuthLogger,
    OAuthErrorEvent,
    OAuthSuccessEvent,
    OAuthInfoEvent
} from 'angular-oauth2-oidc';
import { of, Subject, timeout } from 'rxjs';
import { RedirectAuthService } from './redirect-auth.service';
import { AUTH_MODULE_CONFIG } from './auth-config';
import { RetryLoginService } from './retry-login.service';
import { TimeSync, TimeSyncService } from '../services/time-sync.service';

describe('RedirectAuthService', () => {
    let service: RedirectAuthService;
    let ensureDiscoveryDocumentSpy: jasmine.Spy;
    let retryLoginServiceSpy: jasmine.SpyObj<RetryLoginService>;
    let timeSyncServiceSpy: jasmine.SpyObj<TimeSyncService>;
    let oauthLoggerSpy: jasmine.SpyObj<OAuthLogger>;
    let oauthServiceSpy: jasmine.SpyObj<OAuthService>;
    let authConfigSpy: jasmine.SpyObj<AuthConfig>;

    const mockOAuthStorage: Partial<OAuthStorage> = {
        getItem: jasmine.createSpy('getItem'),
        removeItem: jasmine.createSpy('removeItem'),
        setItem: jasmine.createSpy('setItem')
    };
    const oauthEvents$ = new Subject<OAuthEvent>();

    beforeEach(() => {
        retryLoginServiceSpy = jasmine.createSpyObj('RetryLoginService', ['tryToLoginTimes']);
        timeSyncServiceSpy = jasmine.createSpyObj('TimeSyncService', ['checkTimeSync']);
        oauthLoggerSpy = jasmine.createSpyObj('OAuthLogger', ['error', 'info', 'warn']);
        oauthServiceSpy = jasmine.createSpyObj(
            'OAuthService',
            [
                'clearHashAfterLogin',
                'configure',
                'logOut',
                'hasValidAccessToken',
                'hasValidIdToken',
                'setupAutomaticSilentRefresh',
                'silentRefresh',
                'refreshToken',
                'getIdentityClaims',
                'getAccessToken'
            ],
            { clockSkewInSec: 120, events: oauthEvents$, tokenValidationHandler: {} }
        );
        authConfigSpy = jasmine.createSpyObj('AuthConfig', ['sessionChecksEnabled']);

        TestBed.configureTestingModule({
            providers: [
                RedirectAuthService,
                { provide: OAuthService, useValue: oauthServiceSpy },
                { provide: TimeSyncService, useValue: timeSyncServiceSpy },
                { provide: OAuthLogger, useValue: oauthLoggerSpy },
                { provide: OAuthStorage, useValue: mockOAuthStorage },
                { provide: RetryLoginService, useValue: retryLoginServiceSpy },
                { provide: AUTH_CONFIG, useValue: authConfigSpy },
                { provide: AUTH_MODULE_CONFIG, useValue: {} }
            ]
        });

        service = TestBed.inject(RedirectAuthService);
        timeSyncServiceSpy.checkTimeSync.and.returnValue(of({ outOfSync: false } as TimeSync));
        ensureDiscoveryDocumentSpy = spyOn(service, 'ensureDiscoveryDocument');
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
        ensureDiscoveryDocumentSpy.and.resolveTo(true);
        oauthServiceSpy.setupAutomaticSilentRefresh.and.callFake(() => {
            oauthServiceSpy.silentRefresh();
            oauthServiceSpy.refreshToken();
        });

        let refreshTokenCalled = false;
        let silentRefreshCalled = false;

        oauthServiceSpy.refreshToken.and.callFake(async () => {
            refreshTokenCalled = true;
            return Promise.resolve({} as TokenResponse);
        });
        oauthServiceSpy.silentRefresh.and.callFake(async () => {
            silentRefreshCalled = true;
            return Promise.resolve({} as OAuthEvent);
        });

        await service.init();

        expect(refreshTokenCalled).toBe(true);
        expect(silentRefreshCalled).toBe(true);
    });

    it('should remove all auth items from the storage if access token is set and is NOT valid', () => {
        oauthServiceSpy.getAccessToken.and.returnValue('fake-access-token');
        oauthServiceSpy.hasValidAccessToken.and.returnValue(false);

        oauthEvents$.next({ type: 'discovery_document_loaded' } as OAuthEvent);

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
        oauthServiceSpy.getAccessToken.and.returnValue('fake-access-token');
        oauthServiceSpy.hasValidAccessToken.and.returnValue(true);

        (mockOAuthStorage.removeItem as any).calls.reset();

        oauthEvents$.next(new OAuthSuccessEvent('discovery_document_loaded'));

        expect(mockOAuthStorage.removeItem).not.toHaveBeenCalled();
    });

    it('should configure OAuthService with given config', async () => {
        const config = { sessionChecksEnabled: false } as AuthConfig;
        ensureDiscoveryDocumentSpy.and.resolveTo(true);

        authConfigSpy.sessionChecksEnabled = false;

        await service.init();

        expect(oauthServiceSpy.configure).toHaveBeenCalledOnceWith(config);
        expect(oauthServiceSpy.setupAutomaticSilentRefresh).toHaveBeenCalledTimes(1);
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
        ensureDiscoveryDocumentSpy.and.resolveTo(true);

        const expectedRedirectUrl = '/';
        const loginCallbackResponse = await service.loginCallback();

        expect(loginCallbackResponse).toEqual(expectedRedirectUrl);
        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
    });

    it('should logout user if login fails', async () => {
        ensureDiscoveryDocumentSpy.and.resolveTo(true);

        const fakeErrorEvent = new OAuthErrorEvent('discovery_document_load_error', { reason: 'error' }, {});

        retryLoginServiceSpy.tryToLoginTimes.and.callFake(() => {
            oauthEvents$.next(fakeErrorEvent);
            throw new Error('Login failed');
        });

        try {
            await service.loginCallback();
            fail('Expected to throw an error');
        } catch {
            expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        }
    });

    it('should logout user if token has expired due to local machine clock being out of sync', () => {
        const mockTimeSync: TimeSync = {
            outOfSync: true,
            localDateTimeISO: '2024-10-10T22:00:18.621Z',
            serverDateTimeISO: '2024-10-10T22:10:53.000Z'
        };
        const expectedError = new Error(
            `Token has expired due to local machine clock ${mockTimeSync.localDateTimeISO} being out of sync with server time ${mockTimeSync.serverDateTimeISO}`
        );

        timeSyncServiceSpy.checkTimeSync.and.returnValue(of(mockTimeSync));

        const mockDateNowInMilliseconds = 1728597618621; // GMT: Thursday, October 10, 2024 10:00:18.621 PM

        const tokenExpiresAtInSeconds = 1728598353; // GMT: Thursday, October 10, 2024 10:15:00 PM
        const tokenIssuedAtInSeconds = 1728598253; // GMT: Thursday, October 10, 2024 10:10:53 PM

        oauthServiceSpy.clockSkewInSec = 120;

        spyOn(Date, 'now').and.returnValue(mockDateNowInMilliseconds);
        oauthServiceSpy.getIdentityClaims.and.returnValue({ exp: tokenExpiresAtInSeconds, iat: tokenIssuedAtInSeconds });

        oauthEvents$.next({ type: 'discovery_document_loaded' } as OAuthEvent);

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledOnceWith(expectedError);
    });

    it('should logout user if an OAuthErroEvent occurs', () => {
        const fakeErrorEvent = new OAuthErrorEvent('discovery_document_load_error', { reason: 'error' }, {});
        const expectedLoggedError = new OAuthErrorEvent('discovery_document_load_error', { reason: 'error' }, {});

        const mockTimeSync = { outOfSync: false } as TimeSync;

        timeSyncServiceSpy.checkTimeSync.and.returnValue(of(mockTimeSync));

        oauthEvents$.next(fakeErrorEvent);

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledOnceWith(expectedLoggedError);
    });

    it('should logout user if sessionChecksEnabled is true and event type session_terminated is emitted', async () => {
        const mockTimeSync = { outOfSync: false } as TimeSync;
        timeSyncServiceSpy.checkTimeSync.and.returnValue(of(mockTimeSync));

        ensureDiscoveryDocumentSpy.and.resolveTo(true);

        authConfigSpy.sessionChecksEnabled = true;

        await service.init();

        oauthEvents$.next({ type: 'session_terminated' } as OAuthEvent);

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
    });

    it('should NOT logout user if login success', async () => {
        ensureDiscoveryDocumentSpy.and.resolveTo(true);

        retryLoginServiceSpy.tryToLoginTimes.and.resolveTo(true);

        try {
            await service.loginCallback();
            expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
        } catch {
            fail('Expected not to throw an error');
        }
    });

    it('should NOT logout user if sessionChecksEnabled is true and event type session_terminated is NOT emitted', async () => {
        const mockTimeSync = { outOfSync: false } as TimeSync;
        timeSyncServiceSpy.checkTimeSync.and.returnValue(of(mockTimeSync));

        ensureDiscoveryDocumentSpy.and.resolveTo(true);

        authConfigSpy.sessionChecksEnabled = true;

        await service.init();

        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
    });

    it('should NOT logout user if sessionChecksEnabled is false and event type session_terminated is emitted', async () => {
        const mockTimeSync = { outOfSync: false } as TimeSync;
        timeSyncServiceSpy.checkTimeSync.and.returnValue(of(mockTimeSync));

        ensureDiscoveryDocumentSpy.and.resolveTo(true);

        authConfigSpy.sessionChecksEnabled = false;

        await service.init();

        oauthEvents$.next({ type: 'session_terminated' } as OAuthEvent);

        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
    });

    it('should NOT logout user if token has expired but local machine clock is in sync with the server time', () => {
        timeSyncServiceSpy.checkTimeSync.and.returnValue(of({ outOfSync: false } as TimeSync));

        const mockDateNowInMilliseconds = 1728597618621; // GMT: Thursday, October 10, 2024 10:00:18.621 PM

        const tokenExpiresAtInSeconds = 1728598353; // GMT: Thursday, October 10, 2024 10:15:00 PM
        const tokenIssuedAtInSeconds = 1728598253; // GMT: Thursday, October 10, 2024 10:10:53 PM

        oauthServiceSpy.clockSkewInSec = 120;

        spyOn(Date, 'now').and.returnValue(mockDateNowInMilliseconds);
        oauthServiceSpy.getIdentityClaims.and.returnValue({ exp: tokenExpiresAtInSeconds, iat: tokenIssuedAtInSeconds });

        oauthEvents$.next(new OAuthSuccessEvent('discovery_document_loaded'));

        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
        expect(oauthLoggerSpy.error).not.toHaveBeenCalled();
    });

    it('should NOT logout user if token has expired but local clock sync status cannot be determined', () => {
        timeSyncServiceSpy.checkTimeSync.and.throwError('Error');

        const mockDateNowInMilliseconds = 1728597618621; // GMT: Thursday, October 10, 2024 10:00:18.621 PM

        const tokenExpiresAtInSeconds = 1728598353; // GMT: Thursday, October 10, 2024 10:15:00 PM
        const tokenIssuedAtInSeconds = 1728598253; // GMT: Thursday, October 10, 2024 10:10:53 PM

        oauthServiceSpy.clockSkewInSec = 120;

        spyOn(Date, 'now').and.returnValue(mockDateNowInMilliseconds);
        oauthServiceSpy.getIdentityClaims.and.returnValue({ exp: tokenExpiresAtInSeconds, iat: tokenIssuedAtInSeconds });

        oauthEvents$.next(new OAuthSuccessEvent('discovery_document_loaded'));

        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
        expect(oauthLoggerSpy.error).not.toHaveBeenCalled();
    });

    it('should NOT logout user if current Date is behind the issued date within the allowed clock skew', () => {
        const mockDateNowInMilliseconds = 1728598139000; // GMT: Thursday, October 10, 2024 10:08:59 PM

        const tokenExpiresAtInSeconds = 1728598353; // GMT: Thursday, October 10, 2024 10:15:00 PM
        const tokenIssuedAtInSeconds = 1728598253; // GMT: Thursday, October 10, 2024 10:10:53 PM

        oauthServiceSpy.clockSkewInSec = 120;

        spyOn(Date, 'now').and.returnValue(mockDateNowInMilliseconds);
        oauthServiceSpy.getIdentityClaims.and.returnValue({ exp: tokenExpiresAtInSeconds, iat: tokenIssuedAtInSeconds });

        oauthEvents$.next(new OAuthSuccessEvent('discovery_document_loaded'));

        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
        expect(oauthLoggerSpy.error).not.toHaveBeenCalled();
    });

    it('should NOT logout user if current Date is ahead the issued date within the allowed clock skew', () => {
        const mockDateNowInMilliseconds = 1728598620000; // GMT: Thursday, October 10, 2024 10:17:00 PM

        const tokenExpiresAtInSeconds = 1728598353; // GMT: Thursday, October 10, 2024 10:15:00 PM
        const tokenIssuedAtInSeconds = 1728598253; // GMT: Thursday, October 10, 2024 10:10:53 PM

        oauthServiceSpy.clockSkewInSec = 120;

        spyOn(Date, 'now').and.returnValue(mockDateNowInMilliseconds);
        oauthServiceSpy.getIdentityClaims.and.returnValue({ exp: tokenExpiresAtInSeconds, iat: tokenIssuedAtInSeconds });

        oauthEvents$.next(new OAuthSuccessEvent('discovery_document_loaded'));

        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
        expect(oauthLoggerSpy.error).not.toHaveBeenCalled();
    });

    it('should NOT logout user if the refresh token failed first time', fakeAsync(async () => {
        const expectedFakeErrorEvent = new OAuthErrorEvent('token_refresh_error', { reason: 'error' }, {});

        const firstEventOccurPromise = service.firstOauthErrorEventOccur$.toPromise();
        const secondTokenRefreshErrorEventPromise = service.secondTokenRefreshErrorEventOccur$.pipe(timeout(1000)).toPromise();

        oauthEvents$.next(new OAuthErrorEvent('token_refresh_error', { reason: 'error' }, {}));

        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
        expect(oauthLoggerSpy.error).not.toHaveBeenCalled();
        expect(await firstEventOccurPromise).toEqual(expectedFakeErrorEvent);

        try {
            tick(1000);
            await secondTokenRefreshErrorEventPromise;
            fail('Expected secondTokenRefreshErrorEventOccur$ not to be emitted');
        } catch (error) {
            expect(error).toEqual(jasmine.any(Error));
        }
    }));

    it('should logout user if the second time the refresh token failed', fakeAsync(async () => {
        const expectedErrorCausedBySecondTokenRefreshError = new OAuthErrorEvent('token_refresh_error', { reason: 'second token refresh error' }, {});

        oauthEvents$.next(new OAuthErrorEvent('token_refresh_error', { reason: 'error' }, {}));
        oauthEvents$.next(new OAuthErrorEvent('token_refresh_error', { reason: 'second token refresh error' }, {}));

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledWith(expectedErrorCausedBySecondTokenRefreshError);
    }));

    it('should logout user if token_refresh_error is emitted because of clock out of sync', () => {
        const expectedErrorMessage = new Error(
            'OAuth error occurred due to local machine clock 2024-10-10T22:00:18.621Z being out of sync with server time 2024-10-10T22:10:53.000Z'
        );
        timeSyncServiceSpy.checkTimeSync.and.returnValue(
            of({ outOfSync: true, localDateTimeISO: '2024-10-10T22:00:18.621Z', serverDateTimeISO: '2024-10-10T22:10:53.000Z' } as TimeSync)
        );

        oauthEvents$.next(new OAuthErrorEvent('token_refresh_error', { reason: 'error' }, {}));

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledWith(expectedErrorMessage);
    });

    it('should logout user if discovery_document_load_error is emitted because of clock out of sync', () => {
        const expectedErrorMessage = new Error(
            'OAuth error occurred due to local machine clock 2024-10-10T22:00:18.621Z being out of sync with server time 2024-10-10T22:10:53.000Z'
        );
        timeSyncServiceSpy.checkTimeSync.and.returnValue(
            of({ outOfSync: true, localDateTimeISO: '2024-10-10T22:00:18.621Z', serverDateTimeISO: '2024-10-10T22:10:53.000Z' } as TimeSync)
        );

        oauthEvents$.next(new OAuthErrorEvent('discovery_document_load_error', { reason: 'error' }, {}));

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledWith(expectedErrorMessage);
    });

    it('should logout user if code_error is emitted because of clock out of sync', () => {
        const expectedErrorMessage = new Error(
            'OAuth error occurred due to local machine clock 2024-10-10T22:00:18.621Z being out of sync with server time 2024-10-10T22:10:53.000Z'
        );
        timeSyncServiceSpy.checkTimeSync.and.returnValue(
            of({ outOfSync: true, localDateTimeISO: '2024-10-10T22:00:18.621Z', serverDateTimeISO: '2024-10-10T22:10:53.000Z' } as TimeSync)
        );

        oauthEvents$.next(new OAuthErrorEvent('code_error', { reason: 'error' }, {}));

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledWith(expectedErrorMessage);
    });

    it('should logout user if discovery_document_validation_error is emitted because of clock out of sync', () => {
        const expectedErrorMessage = new Error(
            'OAuth error occurred due to local machine clock 2024-10-10T22:00:18.621Z being out of sync with server time 2024-10-10T22:10:53.000Z'
        );
        timeSyncServiceSpy.checkTimeSync.and.returnValue(
            of({ outOfSync: true, localDateTimeISO: '2024-10-10T22:00:18.621Z', serverDateTimeISO: '2024-10-10T22:10:53.000Z' } as TimeSync)
        );

        oauthEvents$.next(new OAuthErrorEvent('discovery_document_validation_error', { reason: 'error' }, {}));

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledWith(expectedErrorMessage);
    });

    it('should logout user if jwks_load_error is emitted because of clock out of sync', () => {
        const expectedErrorMessage = new Error(
            'OAuth error occurred due to local machine clock 2024-10-10T22:00:18.621Z being out of sync with server time 2024-10-10T22:10:53.000Z'
        );
        timeSyncServiceSpy.checkTimeSync.and.returnValue(
            of({ outOfSync: true, localDateTimeISO: '2024-10-10T22:00:18.621Z', serverDateTimeISO: '2024-10-10T22:10:53.000Z' } as TimeSync)
        );

        oauthEvents$.next(new OAuthErrorEvent('jwks_load_error', { reason: 'error' }, {}));

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledWith(expectedErrorMessage);
    });

    it('should logout user if silent_refresh_error is emitted because of clock out of sync', () => {
        const expectedErrorMessage = new Error(
            'OAuth error occurred due to local machine clock 2024-10-10T22:00:18.621Z being out of sync with server time 2024-10-10T22:10:53.000Z'
        );
        timeSyncServiceSpy.checkTimeSync.and.returnValue(
            of({ outOfSync: true, localDateTimeISO: '2024-10-10T22:00:18.621Z', serverDateTimeISO: '2024-10-10T22:10:53.000Z' } as TimeSync)
        );

        oauthEvents$.next(new OAuthErrorEvent('silent_refresh_error', { reason: 'error' }, {}));

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledWith(expectedErrorMessage);
    });

    it('should logout user if user_profile_load_error is emitted because of clock out of sync', () => {
        const expectedErrorMessage = new Error(
            'OAuth error occurred due to local machine clock 2024-10-10T22:00:18.621Z being out of sync with server time 2024-10-10T22:10:53.000Z'
        );
        timeSyncServiceSpy.checkTimeSync.and.returnValue(
            of({ outOfSync: true, localDateTimeISO: '2024-10-10T22:00:18.621Z', serverDateTimeISO: '2024-10-10T22:10:53.000Z' } as TimeSync)
        );

        oauthEvents$.next(new OAuthErrorEvent('user_profile_load_error', { reason: 'error' }, {}));

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledWith(expectedErrorMessage);
    });

    it('should logout user if token_error is emitted because of clock out of sync', () => {
        const expectedErrorMessage = new Error(
            'OAuth error occurred due to local machine clock 2024-10-10T22:00:18.621Z being out of sync with server time 2024-10-10T22:10:53.000Z'
        );
        timeSyncServiceSpy.checkTimeSync.and.returnValue(
            of({ outOfSync: true, localDateTimeISO: '2024-10-10T22:00:18.621Z', serverDateTimeISO: '2024-10-10T22:10:53.000Z' } as TimeSync)
        );

        oauthEvents$.next(new OAuthErrorEvent('token_error', { reason: 'error' }, {}));

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledWith(expectedErrorMessage);
    });

    it('should onLogout$ be emitted when logout event occur', () => {
        let expectedLogoutIsEmitted = false;
        service.onLogout$.subscribe(() => (expectedLogoutIsEmitted = true));

        oauthEvents$.next(new OAuthInfoEvent('logout'));

        expect(expectedLogoutIsEmitted).toBeTrue();
    });
});
