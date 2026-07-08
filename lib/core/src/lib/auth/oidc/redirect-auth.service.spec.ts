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

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
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
import { firstValueFrom, of, Subject, timeout } from 'rxjs';
import { RedirectAuthService } from './redirect-auth.service';
import { AUTH_MODULE_CONFIG } from './auth-config';
import { RetryLoginService } from './retry-login.service';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { ClockSyncResult, TimeSync, TimeSyncService } from '../services/time-sync.service';

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
    const clockOutOfSync: TimeSync = {
        outOfSync: true,
        localDateTimeISO: '2024-10-10T22:00:18.621Z',
        serverDateTimeISO: '2024-10-10T22:10:53.000Z'
    };
    const syncedClockResult: ClockSyncResult = { status: 'synced', appliedOffsetMs: 0, previousOffsetMs: 0, hasSuccessfulSync: true };
    const disabledClockResult: ClockSyncResult = { status: 'disabled', appliedOffsetMs: 0, previousOffsetMs: 0, hasSuccessfulSync: false };

    const setupExpiredTokenAfterTrustedClockSync = (): Error => {
        timeSyncServiceSpy.syncClockOffsetResult.and.returnValue(of(syncedClockResult));
        timeSyncServiceSpy.checkTimeSync.and.returnValue(of(clockOutOfSync));
        timeSyncServiceSpy.getCorrectedNow.and.returnValue(1728597618621);
        oauthServiceSpy.getIdentityClaims.and.returnValue({ exp: 1728597000, iat: 1728596000 });
        oauthServiceSpy.clockSkewInSec = 0;
        (oauthServiceSpy as any).decreaseExpirationBySec = 0;
        oauthServiceSpy.refreshToken.and.rejectWith('refresh failed');

        return new Error(
            `OAuth error occurred due to local machine clock ${clockOutOfSync.localDateTimeISO} being out of sync with server time ${clockOutOfSync.serverDateTimeISO}`
        );
    };

    beforeEach(() => {
        retryLoginServiceSpy = jasmine.createSpyObj('RetryLoginService', ['tryToLoginTimes']);
        timeSyncServiceSpy = jasmine.createSpyObj('TimeSyncService', [
            'checkTimeSync',
            'getCorrectedNow',
            'syncClockOffset',
            'syncClockOffsetResult',
            'startPeriodicSync',
            'stopPeriodicSync'
        ]);
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
        timeSyncServiceSpy.getCorrectedNow.and.callFake(() => Date.now());
        timeSyncServiceSpy.syncClockOffset.and.returnValue(of(void 0));
        timeSyncServiceSpy.syncClockOffsetResult.and.returnValue(of(disabledClockResult));
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

    it('should NOT remove auth items if token becomes valid after clock resync', () => {
        oauthServiceSpy.getAccessToken.and.returnValue('fake-access-token');
        oauthServiceSpy.hasValidAccessToken.and.returnValues(false, true);

        (mockOAuthStorage.removeItem as any).calls.reset();

        oauthEvents$.next(new OAuthSuccessEvent('discovery_document_loaded'));

        expect(timeSyncServiceSpy.syncClockOffset).toHaveBeenCalled();
        expect(mockOAuthStorage.removeItem).not.toHaveBeenCalled();
    });

    it('should call syncClockOffset when the discovery document has loaded', async () => {
        ensureDiscoveryDocumentSpy.and.resolveTo(true);

        await service.init();

        expect(timeSyncServiceSpy.syncClockOffset).toHaveBeenCalledTimes(1);
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

    it('should sync the clock before validating the login callback', async () => {
        const syncClockOffset$ = new Subject<void>();
        ensureDiscoveryDocumentSpy.and.resolveTo(true);
        timeSyncServiceSpy.syncClockOffset.and.returnValue(syncClockOffset$);
        retryLoginServiceSpy.tryToLoginTimes.and.resolveTo(true);

        const loginCallbackPromise = service.loginCallback();
        await Promise.resolve();

        expect(timeSyncServiceSpy.syncClockOffset).toHaveBeenCalledTimes(1);
        expect(retryLoginServiceSpy.tryToLoginTimes).not.toHaveBeenCalled();

        syncClockOffset$.next();
        syncClockOffset$.complete();

        expect(await loginCallbackPromise).toBe('/');
        expect(retryLoginServiceSpy.tryToLoginTimes).toHaveBeenCalledTimes(1);
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

    it('should logout user if an OAuth error still leaves the token expired after clock resync and refresh fails', fakeAsync(() => {
        const syncClockOffset$ = new Subject<ClockSyncResult>();
        const expectedError = setupExpiredTokenAfterTrustedClockSync();

        timeSyncServiceSpy.syncClockOffsetResult.and.returnValue(syncClockOffset$);

        oauthEvents$.next(new OAuthErrorEvent('token_error', { reason: 'error' }, {}));

        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();

        syncClockOffset$.next(syncedClockResult);
        syncClockOffset$.complete();
        tick();

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledOnceWith(expectedError);
    }));

    it('should logout user if an OAuthErroEvent occurs', () => {
        const fakeErrorEvent = new OAuthErrorEvent('discovery_document_load_error', { reason: 'error' }, {});
        const expectedLoggedError = new OAuthErrorEvent('discovery_document_load_error', { reason: 'error' }, {});

        const mockTimeSync = { outOfSync: false } as TimeSync;

        timeSyncServiceSpy.checkTimeSync.and.returnValue(of(mockTimeSync));

        oauthEvents$.next(fakeErrorEvent);

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledOnceWith(expectedLoggedError);
    });

    it('should only process the first logout-causing OAuth error', () => {
        const firstErrorEvent = new OAuthErrorEvent('discovery_document_load_error', { reason: 'first error' }, {});
        const secondErrorEvent = new OAuthErrorEvent('jwks_load_error', { reason: 'second error' }, {});

        oauthEvents$.next(firstErrorEvent);
        oauthEvents$.next(secondErrorEvent);

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledOnceWith(firstErrorEvent);
    });

    it('should wait for clock resync before logging out for an OAuth error when clock recovery does not apply', () => {
        const syncClockOffset$ = new Subject<ClockSyncResult>();
        const fakeErrorEvent = new OAuthErrorEvent('discovery_document_load_error', { reason: 'error' }, {});

        timeSyncServiceSpy.syncClockOffsetResult.and.returnValue(syncClockOffset$);
        timeSyncServiceSpy.checkTimeSync.and.returnValue(of({ outOfSync: false } as TimeSync));

        oauthEvents$.next(fakeErrorEvent);

        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
        expect(oauthLoggerSpy.error).not.toHaveBeenCalled();
        expect(timeSyncServiceSpy.checkTimeSync).not.toHaveBeenCalled();

        syncClockOffset$.next({ status: 'synced', appliedOffsetMs: 0, previousOffsetMs: 0, hasSuccessfulSync: true });
        syncClockOffset$.complete();

        expect(timeSyncServiceSpy.checkTimeSync).toHaveBeenCalledOnceWith(oauthServiceSpy.clockSkewInSec ?? 0);
        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledOnceWith(fakeErrorEvent);
    });

    it('should not logout for an OAuth error when corrected time shows the token is still valid', () => {
        const syncClockOffset$ = new Subject<ClockSyncResult>();
        const fakeErrorEvent = new OAuthErrorEvent('token_error', { reason: 'error' }, {});

        timeSyncServiceSpy.syncClockOffsetResult.and.returnValue(syncClockOffset$);
        timeSyncServiceSpy.checkTimeSync.and.returnValue(
            of({ outOfSync: true, localDateTimeISO: '2024-10-10T22:00:18.621Z', serverDateTimeISO: '2024-10-10T22:10:53.000Z' } as TimeSync)
        );
        timeSyncServiceSpy.getCorrectedNow.and.returnValue(1728597618621);
        oauthServiceSpy.getIdentityClaims.and.returnValue({ exp: 1728598353, iat: 1728597253 });
        oauthServiceSpy.clockSkewInSec = 120;
        (oauthServiceSpy as any).decreaseExpirationBySec = 0;

        oauthEvents$.next(fakeErrorEvent);

        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
        expect(oauthLoggerSpy.error).not.toHaveBeenCalled();
        expect(timeSyncServiceSpy.checkTimeSync).not.toHaveBeenCalled();

        syncClockOffset$.next({ status: 'synced', appliedOffsetMs: 0, previousOffsetMs: 0, hasSuccessfulSync: true });
        syncClockOffset$.complete();

        expect(timeSyncServiceSpy.checkTimeSync).toHaveBeenCalledOnceWith(oauthServiceSpy.clockSkewInSec ?? 0);
        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
        expect(oauthLoggerSpy.error).not.toHaveBeenCalled();
        expect(oauthServiceSpy.refreshToken).not.toHaveBeenCalled();
    });

    it('should ignore stale clock status and use the freshly synced offset before deciding whether to logout', () => {
        const syncClockOffset$ = new Subject<ClockSyncResult>();
        const fakeErrorEvent = new OAuthErrorEvent('token_error', { reason: 'error' }, {});
        let syncCompleted = false;

        timeSyncServiceSpy.syncClockOffsetResult.and.returnValue(syncClockOffset$);
        timeSyncServiceSpy.checkTimeSync.and.callFake(() =>
            of(
                syncCompleted
                    ? ({ outOfSync: true, localDateTimeISO: '2024-10-10T22:00:18.621Z', serverDateTimeISO: '2024-10-10T22:10:53.000Z' } as TimeSync)
                    : ({ outOfSync: false } as TimeSync)
            )
        );
        timeSyncServiceSpy.getCorrectedNow.and.returnValue(1728597618621);
        oauthServiceSpy.getIdentityClaims.and.returnValue({ exp: 1728598353, iat: 1728597253 });
        oauthServiceSpy.clockSkewInSec = 120;
        (oauthServiceSpy as any).decreaseExpirationBySec = 0;

        oauthEvents$.next(fakeErrorEvent);

        expect(timeSyncServiceSpy.checkTimeSync).not.toHaveBeenCalled();
        expect(oauthServiceSpy.getIdentityClaims).not.toHaveBeenCalled();
        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();

        syncCompleted = true;
        syncClockOffset$.next({ status: 'synced', appliedOffsetMs: 0, previousOffsetMs: 0, hasSuccessfulSync: true });
        syncClockOffset$.complete();

        expect(timeSyncServiceSpy.checkTimeSync).toHaveBeenCalledOnceWith(oauthServiceSpy.clockSkewInSec ?? 0);
        expect(oauthServiceSpy.getIdentityClaims).toHaveBeenCalled();
        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
        expect(oauthLoggerSpy.error).not.toHaveBeenCalled();
        expect(oauthServiceSpy.refreshToken).not.toHaveBeenCalled();
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

        timeSyncServiceSpy.getCorrectedNow.and.returnValue(mockDateNowInMilliseconds);
        oauthServiceSpy.getIdentityClaims.and.returnValue({ exp: tokenExpiresAtInSeconds, iat: tokenIssuedAtInSeconds });

        oauthEvents$.next(new OAuthSuccessEvent('discovery_document_loaded'));

        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
        expect(oauthLoggerSpy.error).not.toHaveBeenCalled();
    });

    it('should NOT logout user on the first event where token has expired, to allow a refresh attempt', () => {
        const mockTimeSync: TimeSync = {
            outOfSync: true,
            localDateTimeISO: '2024-10-10T22:00:18.621Z',
            serverDateTimeISO: '2024-10-10T22:10:53.000Z'
        };
        timeSyncServiceSpy.checkTimeSync.and.returnValue(of(mockTimeSync));

        const mockDateNowInMilliseconds = 1728597618621; // GMT: Thursday, October 10, 2024 10:00:18.621 PM

        const tokenExpiresAtInSeconds = 1728598353; // GMT: Thursday, October 10, 2024 10:15:00 PM
        const tokenIssuedAtInSeconds = 1728598253; // GMT: Thursday, October 10, 2024 10:10:53 PM

        oauthServiceSpy.clockSkewInSec = 120;

        timeSyncServiceSpy.getCorrectedNow.and.returnValue(mockDateNowInMilliseconds);
        oauthServiceSpy.getIdentityClaims.and.returnValue({ exp: tokenExpiresAtInSeconds, iat: tokenIssuedAtInSeconds });

        // First event is skipped (retry allowed)
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

        timeSyncServiceSpy.getCorrectedNow.and.returnValue(mockDateNowInMilliseconds);
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

        timeSyncServiceSpy.getCorrectedNow.and.returnValue(mockDateNowInMilliseconds);
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

        timeSyncServiceSpy.getCorrectedNow.and.returnValue(mockDateNowInMilliseconds);
        oauthServiceSpy.getIdentityClaims.and.returnValue({ exp: tokenExpiresAtInSeconds, iat: tokenIssuedAtInSeconds });

        oauthEvents$.next(new OAuthSuccessEvent('discovery_document_loaded'));

        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
        expect(oauthLoggerSpy.error).not.toHaveBeenCalled();
    });

    it('should NOT logout user if the refresh token failed first time', fakeAsync(async () => {
        const expectedFakeErrorEvent = new OAuthErrorEvent('token_refresh_error', { reason: 'error' }, {});

        const firstEventOccurPromise = firstValueFrom(service.firstOauthErrorEventOccur$);
        const secondTokenRefreshErrorEventPromise = firstValueFrom(service.secondTokenRefreshErrorEventOccur$.pipe(timeout(1000)));

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

    it('should NOT logout user on the first token_refresh_error even if clock is out of sync', () => {
        timeSyncServiceSpy.checkTimeSync.and.returnValue(
            of({ outOfSync: true, localDateTimeISO: '2024-10-10T22:00:18.621Z', serverDateTimeISO: '2024-10-10T22:10:53.000Z' } as TimeSync)
        );

        // First occurrence is skipped to allow a retry
        oauthEvents$.next(new OAuthErrorEvent('token_refresh_error', { reason: 'first error' }, {}));

        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
        expect(oauthLoggerSpy.error).not.toHaveBeenCalled();
    });

    it('should wait for clock resync before handling the second token_refresh_error', () => {
        const syncClockOffset$ = new Subject<ClockSyncResult>();

        timeSyncServiceSpy.syncClockOffsetResult.and.returnValue(syncClockOffset$);
        timeSyncServiceSpy.checkTimeSync.and.returnValue(
            of({ outOfSync: true, localDateTimeISO: '2024-10-10T22:00:18.621Z', serverDateTimeISO: '2024-10-10T22:10:53.000Z' } as TimeSync)
        );
        timeSyncServiceSpy.getCorrectedNow.and.returnValue(1728597618621);
        oauthServiceSpy.getIdentityClaims.and.returnValue({ exp: 1728598353, iat: 1728597253 });
        oauthServiceSpy.clockSkewInSec = 120;
        (oauthServiceSpy as any).decreaseExpirationBySec = 0;

        oauthEvents$.next(new OAuthErrorEvent('token_refresh_error', { reason: 'first error' }, {}));
        expect(timeSyncServiceSpy.syncClockOffsetResult).not.toHaveBeenCalled();

        oauthEvents$.next(new OAuthErrorEvent('token_refresh_error', { reason: 'second error' }, {}));

        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
        expect(oauthLoggerSpy.error).not.toHaveBeenCalled();
        expect(timeSyncServiceSpy.checkTimeSync).not.toHaveBeenCalled();

        syncClockOffset$.next({ status: 'synced', appliedOffsetMs: 0, previousOffsetMs: 0, hasSuccessfulSync: true });
        syncClockOffset$.complete();

        expect(timeSyncServiceSpy.checkTimeSync).toHaveBeenCalledOnceWith(oauthServiceSpy.clockSkewInSec ?? 0);
        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
        expect(oauthLoggerSpy.error).not.toHaveBeenCalled();
        expect(oauthServiceSpy.refreshToken).not.toHaveBeenCalled();
    });

    it('should keep old logout behaviour when clock sync fails before any successful sync', () => {
        const errorEvent = new OAuthErrorEvent('token_error', { reason: 'sync unavailable' }, {});
        timeSyncServiceSpy.syncClockOffsetResult.and.returnValue(
            of({ status: 'failed', appliedOffsetMs: 0, previousOffsetMs: 0, hasSuccessfulSync: false })
        );
        timeSyncServiceSpy.checkTimeSync.and.returnValue(
            of({ outOfSync: true, localDateTimeISO: '2024-10-10T22:00:18.621Z', serverDateTimeISO: '2024-10-10T22:10:53.000Z' } as TimeSync)
        );

        oauthEvents$.next(errorEvent);

        expect(timeSyncServiceSpy.checkTimeSync).not.toHaveBeenCalled();
        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledOnceWith(errorEvent);
    });

    it('should use a previous trusted clock offset when a fresh sync fails', () => {
        timeSyncServiceSpy.syncClockOffsetResult.and.returnValue(
            of({ status: 'failed', appliedOffsetMs: 238_000, previousOffsetMs: 238_000, hasSuccessfulSync: true })
        );
        timeSyncServiceSpy.checkTimeSync.and.returnValue(
            of({ outOfSync: true, localDateTimeISO: '2025-01-15T11:56:02.000Z', serverDateTimeISO: '2025-01-15T12:00:00.000Z' } as TimeSync)
        );
        timeSyncServiceSpy.getCorrectedNow.and.returnValue(Date.UTC(2025, 0, 15, 12, 0, 0));
        oauthServiceSpy.getIdentityClaims.and.returnValue({
            iat: Date.UTC(2025, 0, 15, 12, 0, 0) / 1000,
            exp: Date.UTC(2025, 0, 15, 12, 15, 0) / 1000
        });
        oauthServiceSpy.clockSkewInSec = 120;
        (oauthServiceSpy as any).decreaseExpirationBySec = 0;

        oauthEvents$.next(new OAuthErrorEvent('token_error', { reason: 'sync unavailable after prior correction' }, {}));

        expect(timeSyncServiceSpy.checkTimeSync).toHaveBeenCalledOnceWith(oauthServiceSpy.clockSkewInSec ?? 0);
        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();
        expect(oauthLoggerSpy.error).not.toHaveBeenCalled();
        expect(oauthServiceSpy.refreshToken).not.toHaveBeenCalled();
    });

    it('should keep old logout behaviour when clock sync is disabled', () => {
        const errorEvent = new OAuthErrorEvent('token_error', { reason: 'time sync disabled' }, {});
        timeSyncServiceSpy.syncClockOffsetResult.and.returnValue(
            of({ status: 'disabled', appliedOffsetMs: 0, previousOffsetMs: 238_000, hasSuccessfulSync: false })
        );

        oauthEvents$.next(errorEvent);

        expect(timeSyncServiceSpy.checkTimeSync).not.toHaveBeenCalled();
        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledOnceWith(errorEvent);
    });

    it('should logout user if token_refresh_error is emitted a second time because of clock out of sync', fakeAsync(() => {
        const expectedErrorMessage = setupExpiredTokenAfterTrustedClockSync();

        // First occurrence is skipped (retry allowed)
        oauthEvents$.next(new OAuthErrorEvent('token_refresh_error', { reason: 'first error' }, {}));
        expect(oauthServiceSpy.logOut).not.toHaveBeenCalled();

        // Second occurrence triggers the clock-out-of-sync logout
        oauthEvents$.next(new OAuthErrorEvent('token_refresh_error', { reason: 'second error' }, {}));
        tick();

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledWith(expectedErrorMessage);
    }));

    it('should reset token_refresh_error counter when a successful token event occurs', () => {
        timeSyncServiceSpy.checkTimeSync.and.returnValue(of({ outOfSync: false } as TimeSync));

        // First token_refresh_error (skipped by oauthErrorEventOccurDueToClockOutOfSync$)
        oauthEvents$.next(new OAuthErrorEvent('token_refresh_error', { reason: 'first error' }, {}));

        // Successful token event resets the counter
        oauthEvents$.next(new OAuthSuccessEvent('token_received'));

        // Next token_refresh_error should be treated as the first again (skipped)
        // Since secondTokenRefreshErrorEventOccur$ already consumed the first error,
        // verify via the oauthErrorEventOccurDueToClockOutOfSync$ observable directly
        let emitted = false;
        service.oauthErrorEventOccurDueToClockOutOfSync$.subscribe(() => {
            emitted = true;
        });

        // After reset, this is treated as "first" by the clock-out-of-sync stream
        oauthEvents$.next(new OAuthErrorEvent('token_refresh_error', { reason: 'second error after reset' }, {}));
        expect(emitted).toBe(false);
    });

    it('should logout on second consecutive token_refresh_error after counter reset and another error', fakeAsync(() => {
        const expectedErrorMessage = setupExpiredTokenAfterTrustedClockSync();

        let clockOutOfSyncError: Error | null = null;
        service.oauthErrorEventOccurDueToClockOutOfSync$.subscribe((error) => {
            clockOutOfSyncError = error;
        });

        // First token_refresh_error (skipped by clock-out-of-sync stream)
        oauthEvents$.next(new OAuthErrorEvent('token_refresh_error', { reason: 'first error' }, {}));
        tick();
        expect(clockOutOfSyncError).toBeNull();

        // Successful token event resets the counter
        oauthEvents$.next(new OAuthSuccessEvent('token_received'));

        // After reset, first error is skipped again
        oauthEvents$.next(new OAuthErrorEvent('token_refresh_error', { reason: 'error after reset' }, {}));
        tick();
        expect(clockOutOfSyncError).toBeNull();

        // Second consecutive error after reset triggers clock-out-of-sync detection
        oauthEvents$.next(new OAuthErrorEvent('token_refresh_error', { reason: 'second consecutive error' }, {}));
        tick();
        expect(clockOutOfSyncError).toEqual(expectedErrorMessage);
    }));

    it('should logout user if discovery_document_load_error is emitted because of clock out of sync', fakeAsync(() => {
        const expectedErrorMessage = setupExpiredTokenAfterTrustedClockSync();

        oauthEvents$.next(new OAuthErrorEvent('discovery_document_load_error', { reason: 'error' }, {}));
        tick();

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledWith(expectedErrorMessage);
    }));

    it('should logout user if code_error is emitted because of clock out of sync', fakeAsync(() => {
        const expectedErrorMessage = setupExpiredTokenAfterTrustedClockSync();

        oauthEvents$.next(new OAuthErrorEvent('code_error', { reason: 'error' }, {}));
        tick();

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledWith(expectedErrorMessage);
    }));

    it('should logout user if discovery_document_validation_error is emitted because of clock out of sync', fakeAsync(() => {
        const expectedErrorMessage = setupExpiredTokenAfterTrustedClockSync();

        oauthEvents$.next(new OAuthErrorEvent('discovery_document_validation_error', { reason: 'error' }, {}));
        tick();

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledWith(expectedErrorMessage);
    }));

    it('should logout user if jwks_load_error is emitted because of clock out of sync', fakeAsync(() => {
        const expectedErrorMessage = setupExpiredTokenAfterTrustedClockSync();

        oauthEvents$.next(new OAuthErrorEvent('jwks_load_error', { reason: 'error' }, {}));
        tick();

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledWith(expectedErrorMessage);
    }));

    it('should logout user if silent_refresh_error is emitted because of clock out of sync', fakeAsync(() => {
        const expectedErrorMessage = setupExpiredTokenAfterTrustedClockSync();

        oauthEvents$.next(new OAuthErrorEvent('silent_refresh_error', { reason: 'error' }, {}));
        tick();

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledWith(expectedErrorMessage);
    }));

    it('should logout user if user_profile_load_error is emitted because of clock out of sync', fakeAsync(() => {
        const expectedErrorMessage = setupExpiredTokenAfterTrustedClockSync();

        oauthEvents$.next(new OAuthErrorEvent('user_profile_load_error', { reason: 'error' }, {}));
        tick();

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledWith(expectedErrorMessage);
    }));

    it('should logout user if token_error is emitted because of clock out of sync', fakeAsync(() => {
        const expectedErrorMessage = setupExpiredTokenAfterTrustedClockSync();

        oauthEvents$.next(new OAuthErrorEvent('token_error', { reason: 'error' }, {}));
        tick();

        expect(oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(oauthLoggerSpy.error).toHaveBeenCalledWith(expectedErrorMessage);
    }));

    it('should onLogout$ be emitted when logout event occur', () => {
        let expectedLogoutIsEmitted = false;
        service.onLogout$.subscribe(() => (expectedLogoutIsEmitted = true));

        oauthEvents$.next(new OAuthInfoEvent('logout'));

        expect(expectedLogoutIsEmitted).toBeTrue();
    });
});

describe('RedirectAuthService clock-skew environment scenarios', () => {
    const SERVER_NOW = Date.UTC(2025, 0, 15, 12, 0, 0);
    const SERVER_TIME_URL = '/api/server-time';
    const SLOW_CLOCK_CLAIMS = {
        iat: SERVER_NOW / 1000,
        exp: (SERVER_NOW + 15 * 60 * 1000) / 1000
    };
    const FAST_CLOCK_CLAIMS = {
        iat: (SERVER_NOW - 60 * 1000) / 1000,
        exp: (SERVER_NOW + 1000) / 1000
    };

    type ClockDirection = 'behind' | 'ahead';

    interface EnvironmentTestContext {
        service: RedirectAuthService;
        timeSyncService: TimeSyncService;
        httpMock: HttpTestingController;
        oauthEvents$: Subject<OAuthEvent>;
        oauthLoggerSpy: jasmine.SpyObj<OAuthLogger>;
        oauthServiceSpy: jasmine.SpyObj<OAuthService>;
    }

    const getLocalNow = (skewSeconds: number, direction: ClockDirection): number =>
        direction === 'behind' ? SERVER_NOW - skewSeconds * 1000 : SERVER_NOW + skewSeconds * 1000;

    const getClaims = (direction: ClockDirection) => (direction === 'behind' ? SLOW_CLOCK_CLAIMS : FAST_CLOCK_CLAIMS);

    const setupEnvironment = (timeSyncEnabled: boolean, claims: { iat: number; exp: number }): EnvironmentTestContext => {
        if (!jasmine.isSpy(performance.now)) {
            spyOn(performance, 'now').and.returnValue(0);
        }

        const oauthEvents$ = new Subject<OAuthEvent>();
        const oauthStorage: Partial<OAuthStorage> = {
            getItem: jasmine.createSpy('getItem'),
            removeItem: jasmine.createSpy('removeItem'),
            setItem: jasmine.createSpy('setItem')
        };
        const retryLoginServiceSpy = jasmine.createSpyObj('RetryLoginService', ['tryToLoginTimes']);
        const oauthLoggerSpy = jasmine.createSpyObj('OAuthLogger', ['error', 'info', 'warn']);
        const oauthServiceSpy = jasmine.createSpyObj(
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
            { clockSkewInSec: 120, decreaseExpirationBySec: 0, events: oauthEvents$, tokenValidationHandler: {} }
        );
        const authConfigSpy = jasmine.createSpyObj('AuthConfig', ['sessionChecksEnabled']);

        oauthServiceSpy.getIdentityClaims.and.returnValue(claims);

        TestBed.configureTestingModule({
            providers: [
                RedirectAuthService,
                TimeSyncService,
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: OAuthService, useValue: oauthServiceSpy },
                { provide: OAuthLogger, useValue: oauthLoggerSpy },
                { provide: OAuthStorage, useValue: oauthStorage },
                { provide: RetryLoginService, useValue: retryLoginServiceSpy },
                { provide: AUTH_CONFIG, useValue: authConfigSpy },
                { provide: AUTH_MODULE_CONFIG, useValue: {} }
            ]
        });

        spyOn(TestBed.inject(AppConfigService), 'get').and.callFake(<T>(key: string, defaultValue?: T): T => {
            if (key === AppConfigValues.OAUTHCONFIG) {
                return { timeSync: timeSyncEnabled } as T;
            }

            if (key === AppConfigValues.SERVER_TIME_URL) {
                return SERVER_TIME_URL as T;
            }

            return defaultValue as T;
        });

        return {
            service: TestBed.inject(RedirectAuthService),
            timeSyncService: TestBed.inject(TimeSyncService),
            httpMock: TestBed.inject(HttpTestingController),
            oauthEvents$,
            oauthLoggerSpy,
            oauthServiceSpy
        };
    };

    const syncClockWithServerTime = async (context: EnvironmentTestContext): Promise<void> => {
        const syncPromise = firstValueFrom(context.timeSyncService.syncClockOffset());
        const request = context.httpMock.expectOne(SERVER_TIME_URL);

        expect(request.request.method).toBe('GET');
        expect(request.request.responseType).toBe('text');
        request.flush(`${SERVER_NOW}`);

        await syncPromise;
    };

    const tokenExpiryScenarios: { id: string; direction: ClockDirection; skewSeconds: number; oldUiExpiresToken: boolean }[] = [
        { id: 'TC-02', direction: 'behind', skewSeconds: 119, oldUiExpiresToken: false },
        { id: 'TC-04', direction: 'behind', skewSeconds: 121, oldUiExpiresToken: true },
        { id: 'TC-05', direction: 'behind', skewSeconds: 238, oldUiExpiresToken: true },
        { id: 'TC-06', direction: 'ahead', skewSeconds: 119, oldUiExpiresToken: false },
        { id: 'TC-08', direction: 'ahead', skewSeconds: 121, oldUiExpiresToken: true },
        { id: 'TC-09', direction: 'ahead', skewSeconds: 238, oldUiExpiresToken: true }
    ];

    tokenExpiryScenarios.forEach(({ id, direction, skewSeconds }) => {
        it(`should keep the token valid in the new UI for ${id} (${skewSeconds}s ${direction})`, async () => {
            const localNow = getLocalNow(skewSeconds, direction);
            const context = setupEnvironment(true, getClaims(direction));
            spyOn(Date, 'now').and.returnValues(localNow, localNow, localNow);

            await syncClockWithServerTime(context);

            expect(context.service.tokenHasExpired()).toBeFalse();
            expect(context.timeSyncService.clockOffsetMs).toBe(direction === 'behind' ? skewSeconds * 1000 : -skewSeconds * 1000);

            context.httpMock.verify();
        });
    });

    tokenExpiryScenarios.forEach(({ id, direction, skewSeconds, oldUiExpiresToken }) => {
        it(`should show old UI raw-clock token evaluation for ${id} (${skewSeconds}s ${direction})`, () => {
            const localNow = getLocalNow(skewSeconds, direction);
            const context = setupEnvironment(false, getClaims(direction));
            spyOn(Date, 'now').and.returnValue(localNow);

            expect(context.service.tokenHasExpired()).toBe(oldUiExpiresToken);
            context.httpMock.expectNone(() => true);

            context.httpMock.verify();
        });
    });

    it('should prevent the observed slow-clock false logout in the new UI with a real server time sync', () => {
        const context = setupEnvironment(true, SLOW_CLOCK_CLAIMS);
        const localNow = getLocalNow(238, 'behind');
        spyOn(Date, 'now').and.returnValues(localNow, localNow, localNow, localNow);

        context.oauthEvents$.next(new OAuthErrorEvent('token_error', { reason: 'slow VM clock' }, {}));

        expect(context.oauthServiceSpy.logOut).not.toHaveBeenCalled();

        const request = context.httpMock.expectOne(SERVER_TIME_URL);
        expect(request.request.method).toBe('GET');
        expect(request.request.responseType).toBe('text');
        request.flush(`${SERVER_NOW}`);

        expect(context.timeSyncService.clockOffsetMs).toBe(238_000);
        expect(context.oauthServiceSpy.logOut).not.toHaveBeenCalled();
        expect(context.oauthLoggerSpy.error).not.toHaveBeenCalled();
        expect(context.oauthServiceSpy.refreshToken).not.toHaveBeenCalled();

        context.httpMock.verify();
    });

    it('should show the old UI logging out for the same observed slow-clock token error', () => {
        const context = setupEnvironment(false, SLOW_CLOCK_CLAIMS);
        const localNow = getLocalNow(238, 'behind');
        const errorEvent = new OAuthErrorEvent('token_error', { reason: 'slow VM clock' }, {});
        spyOn(Date, 'now').and.returnValue(localNow);

        context.oauthEvents$.next(errorEvent);

        expect(context.oauthServiceSpy.logOut).toHaveBeenCalledTimes(1);
        expect(context.oauthLoggerSpy.error).toHaveBeenCalledOnceWith(errorEvent);
        context.httpMock.expectNone(() => true);

        context.httpMock.verify();
    });
});
