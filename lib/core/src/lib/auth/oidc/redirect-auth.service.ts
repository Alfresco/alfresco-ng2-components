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

import { Injectable, inject } from '@angular/core';
import {
    AuthConfig,
    AUTH_CONFIG,
    OAuthErrorEvent,
    OAuthEvent,
    OAuthService,
    OAuthStorage,
    TokenResponse,
    LoginOptions,
    OAuthSuccessEvent,
    OAuthLogger
} from 'angular-oauth2-oidc';
import { WebCryptoJwksValidationHandler } from './web-crypto-jwks-validation-handler';
import { firstValueFrom, from, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, scan, shareReplay, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { AUTH_MODULE_CONFIG, AuthModuleConfig } from './auth-config';
import { RetryLoginService } from './retry-login.service';
import { ClockSyncResult, TimeSync, TimeSyncService } from '../services/time-sync.service';

const isPromise = <T>(value: T | Promise<T>): value is Promise<T> => value && typeof (value as Promise<T>).then === 'function';

/** Tracks OAuth errors so token refresh errors can keep their existing one-retry behavior. */
interface OAuthErrorProcessingState {
    /** Latest OAuth error event that may need clock-skew handling. */
    event: OAuthErrorEvent | null;

    /** Whether the current event should be evaluated by the clock-skew pipeline. */
    shouldProcess: boolean;

    /** Number of consecutive token refresh errors seen since the last successful token event. */
    tokenRefreshErrorCount: number;
}

@Injectable()
export class RedirectAuthService extends AuthService {
    private readonly oauthService = inject(OAuthService);
    private readonly _oauthStorage = inject(OAuthStorage);

    readonly authModuleConfig: AuthModuleConfig = inject(AUTH_MODULE_CONFIG);
    private readonly _retryLoginService: RetryLoginService = inject(RetryLoginService);
    private readonly _oauthLogger: OAuthLogger = inject(OAuthLogger);
    private readonly _timeSyncService: TimeSyncService = inject(TimeSyncService);

    private readonly _isDiscoveryDocumentLoadedSubject$ = new ReplaySubject<boolean>();
    public isDiscoveryDocumentLoaded$ = this._isDiscoveryDocumentLoadedSubject$.asObservable();

    onLogin!: Observable<any>;

    onTokenReceived!: Observable<any>;

    private _loadDiscoveryDocumentPromise = Promise.resolve(false);

    /**
     * Observable stream that emits when the user logs out.
     *
     * This observable listens to the events emitted by the OAuth service and filters
     * them to only include instances of OAuthSuccessEvent with the type `logout`.
     */
    onLogout$!: Observable<void>;

    /**
     * Observable stream that emits OAuthErrorEvent instances.
     *
     * This observable listens to the events emitted by the OAuth service and filters
     * them to only include instances of OAuthErrorEvent. It then maps these events
     * to the correct type.
     */
    oauthErrorEvent$!: Observable<OAuthErrorEvent>;

    /**
     * Observable stream that emits the first OAuth error event that occurs.
     */
    firstOauthErrorEventOccur$!: Observable<OAuthErrorEvent>;

    /**
     * Observable stream that emits the first OAuth error event that occurs, excluding token refresh errors.
     */
    firstOauthErrorEventExcludingTokenRefreshError$!: Observable<OAuthErrorEvent>;

    /**
     * Observable stream that emits the second OAuth token refresh error event that occurs.
     */
    secondTokenRefreshErrorEventOccur$!: Observable<OAuthErrorEvent>;

    /**
     * Observable that emits an error when the OAuth error event occurs due to
     * the local machine clock being out of sync with the server time.
     * When clock drift is detected, it re-syncs the clock and requests a new token
     * before propagating the error (if the refresh still fails).
     */
    oauthErrorEventOccurDueToClockOutOfSync$!: Observable<Error>;

    /**
     * Observable stream that emits either OAuthErrorEvent or Error.
     * This stream combines multiple OAuth error sources into a single observable.
     */
    combinedOAuthErrorsStream$!: Observable<OAuthErrorEvent | Error>;

    /** Subscribe to whether the user has valid Id/Access tokens.  */
    authenticated$!: Observable<boolean>;

    /** Subscribe to errors reaching the IdP. */
    idpUnreachable$!: Observable<Error>;

    /**
     * Get whether the user has valid Id/Access tokens.
     *
     * @returns `true` if the user is authenticated, otherwise `false`
     */
    get authenticated(): boolean {
        return this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken();
    }

    private readonly authConfig!: AuthConfig | Promise<AuthConfig>;

    private readonly AUTH_STORAGE_ITEMS: string[] = [
        'access_token',
        'access_token_stored_at',
        'expires_at',
        'granted_scopes',
        'id_token',
        'id_token_claims_obj',
        'id_token_expires_at',
        'id_token_stored_at',
        'nonce',
        'PKCE_verifier',
        'refresh_token',
        'session_state'
    ];

    constructor() {
        const authConfig = inject<AuthConfig>(AUTH_CONFIG);

        super();
        const oauthService = this.oauthService;

        this.authConfig = authConfig;

        this.oauthService.clearHashAfterLogin = true;

        this.subscribeToDebugOAuthEvents(oauthService);
        this.initializeOAuthEventStreams();
        this.subscribeToCombinedOAuthErrors();
        this.removeInvalidStoredAccessTokenAfterClockSync();
    }

    /**
     * Logs OAuth events when the underlying OAuth service has debug output enabled.
     * This preserves the library-controlled debug behavior and keeps production logging quiet.
     *
     * @param oauthService OAuth service instance captured before event subscriptions are created
     */
    private subscribeToDebugOAuthEvents(oauthService: OAuthService): void {
        this.oauthService.events.pipe(filter(() => oauthService.showDebugInformation === true)).subscribe((event) => {
            if (event instanceof OAuthErrorEvent) {
                this._oauthLogger.error('OAuthErrorEvent Object:', event);
            } else {
                this._oauthLogger.info('OAuthEvent Object:', event);
            }
        });
    }

    /**
     * Creates all public OAuth event streams exposed by this service.
     * These streams preserve the existing logout/error behavior and isolate the constructor from
     * the mechanics of each observable pipeline.
     */
    private initializeOAuthEventStreams(): void {
        this.oauthErrorEvent$ = this.createOAuthErrorEventStream();
        this.firstOauthErrorEventOccur$ = this.oauthErrorEvent$.pipe(take(1));
        this.firstOauthErrorEventExcludingTokenRefreshError$ = this.createFirstOAuthErrorExcludingTokenRefreshStream();
        this.secondTokenRefreshErrorEventOccur$ = this.createSecondTokenRefreshErrorStream();
        this.oauthErrorEventOccurDueToClockOutOfSync$ = this.createClockOutOfSyncErrorStream();
        this.authenticated$ = this.createAuthenticatedStream();
        this.onLogout$ = this.createLogoutStream();
        this.combinedOAuthErrorsStream$ = this.createCombinedOAuthErrorStream();
        this.onLogin = this.createLoginStream();
        this.onTokenReceived = this.createTokenReceivedStream();
        this.idpUnreachable$ = this.createIdpUnreachableStream();
    }

    /**
     * Emits every OAuth event that represents an OAuth error.
     *
     * @returns OAuth error event stream
     */
    private createOAuthErrorEventStream(): Observable<OAuthErrorEvent> {
        return this.oauthService.events.pipe(
            filter((event) => event instanceof OAuthErrorEvent),
            map((event) => event as OAuthErrorEvent)
        );
    }

    /**
     * Emits the first OAuth error that is not a token refresh error.
     * Token refresh errors have a separate second-failure path so the OAuth library can retry once.
     *
     * @returns first non-token-refresh OAuth error stream
     */
    private createFirstOAuthErrorExcludingTokenRefreshStream(): Observable<OAuthErrorEvent> {
        return this.oauthErrorEvent$.pipe(
            filter((event) => event instanceof OAuthErrorEvent && event.type !== 'token_refresh_error'),
            take(1)
        );
    }

    /**
     * Emits the second token refresh error, preserving the existing retry allowance for the first one.
     *
     * @returns second token refresh error stream
     */
    private createSecondTokenRefreshErrorStream(): Observable<OAuthErrorEvent> {
        return this.oauthErrorEvent$.pipe(
            filter((event) => event.type === 'token_refresh_error'),
            take(2),
            filter((_, index) => index === 1)
        );
    }

    /**
     * Emits a clock-out-of-sync error when OAuth errors occur and the corrected clock still shows
     * the token cannot be trusted after a re-sync attempt.
     *
     * @returns clock-out-of-sync error stream
     */
    private createClockOutOfSyncErrorStream(): Observable<Error> {
        return this.createLogoutCausingOAuthErrorStream().pipe(
            switchMap((event) => this.resolveOAuthErrorAfterClockSync(event)),
            filter((result): result is Error => result instanceof Error),
            take(1)
        );
    }

    /**
     * Emits OAuth errors that would log the user out unless clock recovery suppresses them.
     * Non-refresh errors are handled once; token refresh errors keep the existing one-retry
     * behavior and are handled only on the second consecutive failure.
     *
     * @returns logout-causing OAuth error stream
     */
    private createLogoutCausingOAuthErrorStream(): Observable<OAuthErrorEvent> {
        return this.oauthService.events.pipe(
            scan((state, event) => this.updateOAuthErrorProcessingState(state, event), {
                event: null,
                shouldProcess: false,
                tokenRefreshErrorCount: 0
            } as OAuthErrorProcessingState),
            filter(({ shouldProcess }) => shouldProcess),
            map(({ event }) => event as OAuthErrorEvent)
        );
    }

    /**
     * Updates the token-refresh error counter used by clock-skew detection.
     * The first token refresh error is skipped so the OAuth library retry path can run; successful
     * token events reset the counter so isolated refresh failures do not accumulate.
     *
     * @param state current OAuth error processing state
     * @param event latest OAuth event
     * @returns updated OAuth error processing state
     */
    private updateOAuthErrorProcessingState(state: OAuthErrorProcessingState, event: OAuthEvent): OAuthErrorProcessingState {
        if (event instanceof OAuthErrorEvent) {
            return {
                event,
                shouldProcess: event.type !== 'token_refresh_error' || state.tokenRefreshErrorCount >= 1,
                tokenRefreshErrorCount: event.type === 'token_refresh_error' ? state.tokenRefreshErrorCount + 1 : state.tokenRefreshErrorCount
            };
        }

        return {
            event: null,
            shouldProcess: false,
            tokenRefreshErrorCount: this.isSuccessfulTokenEvent(event) ? 0 : state.tokenRefreshErrorCount
        };
    }

    /**
     * Checks whether an OAuth event represents a successful token update.
     *
     * @param event OAuth event emitted by the OAuth service
     * @returns true when token refresh error counters should be reset
     */
    private isSuccessfulTokenEvent(event: OAuthEvent): boolean {
        return event.type === 'token_received' || event.type === 'token_refreshed';
    }

    /**
     * Re-syncs the clock before deciding whether an OAuth error should still log the user out.
     * Disabled time sync or a failed first sync falls back to the original OAuth error. A fresh
     * sync, or a failed sync with a previous trusted offset, allows corrected-clock recovery.
     *
     * @param event OAuth error currently being handled
     * @returns original OAuth error, clock-out-of-sync error, or null when recovery succeeds
     */
    private resolveOAuthErrorAfterClockSync(event: OAuthErrorEvent): Observable<OAuthErrorEvent | Error | null> {
        return this._timeSyncService.syncClockOffsetResult().pipe(
            switchMap((syncResult) => {
                if (!this.canUseCorrectedClock(syncResult)) {
                    return of(event);
                }

                return this.resolveOAuthErrorWithCorrectedClock(event);
            }),
            catchError(() => of(event))
        );
    }

    /**
     * Whether a sync result gives the service a trusted corrected clock for recovery decisions.
     * A failed sync can still be trusted when a previous successful sync supplied the active offset.
     *
     * @param syncResult result from the latest clock sync attempt
     * @returns true when corrected-clock recovery can be attempted
     */
    private canUseCorrectedClock(syncResult: ClockSyncResult): boolean {
        return syncResult.status === 'synced' || syncResult.hasSuccessfulSync;
    }

    /**
     * Uses the corrected clock to decide whether an OAuth error is recoverable.
     * If the corrected token time is valid, logout is suppressed. If the token is still expired,
     * a refresh is attempted before emitting the clock-out-of-sync error.
     *
     * @param event OAuth error currently being handled
     * @returns original OAuth error, clock-out-of-sync error, or null when recovery succeeds
     */
    private resolveOAuthErrorWithCorrectedClock(event: OAuthErrorEvent): Observable<OAuthErrorEvent | Error | null> {
        return this._timeSyncService.checkTimeSync(this.oauthService.clockSkewInSec ?? 0).pipe(
            switchMap((timeSync) => {
                if (!timeSync?.outOfSync) {
                    return of(event);
                }

                return this.refreshExpiredTokenWhenClockOutOfSync(timeSync);
            }),
            catchError(() => of(event))
        );
    }

    /**
     * Attempts token recovery when the corrected clock shows the local clock is out of sync.
     *
     * @param timeSync corrected clock status
     * @returns null when token validation or refresh succeeds, otherwise a clock-out-of-sync error
     */
    private refreshExpiredTokenWhenClockOutOfSync(timeSync: TimeSync): Observable<Error | null> {
        if (!this.tokenHasExpired()) {
            return of(null);
        }

        return from(this.oauthService.refreshToken()).pipe(
            map(() => null),
            catchError(() => of(this.createClockOutOfSyncError(timeSync)))
        );
    }

    /**
     * Creates the error emitted when OAuth handling determines the local clock is out of sync.
     *
     * @param timeSync clock sync details used in the error message
     * @returns clock-out-of-sync error
     */
    private createClockOutOfSyncError(timeSync: TimeSync): Error {
        return new Error(
            `OAuth error occurred due to local machine clock ${timeSync.localDateTimeISO} being out of sync with server time ${timeSync.serverDateTimeISO}`
        );
    }

    /**
     * Emits authentication state changes derived from OAuth events.
     *
     * @returns authenticated state stream
     */
    private createAuthenticatedStream(): Observable<boolean> {
        return this.oauthService.events.pipe(
            map(() => this.authenticated),
            distinctUntilChanged(),
            shareReplay(1)
        );
    }

    /**
     * Emits when the OAuth service reports logout.
     *
     * @returns logout notification stream
     */
    private createLogoutStream(): Observable<void> {
        return this.oauthService.events.pipe(
            filter((event) => event.type === 'logout'),
            map(() => undefined)
        );
    }

    /**
     * Combines the OAuth error streams that should cause a single logout.
     *
     * @returns first logout-causing OAuth error or clock error
     */
    private createCombinedOAuthErrorStream(): Observable<OAuthErrorEvent | Error> {
        return this.createLogoutCausingOAuthErrorStream().pipe(
            switchMap((event) => this.resolveOAuthErrorAfterClockSync(event)),
            filter((result): result is OAuthErrorEvent | Error => result !== null),
            take(1)
        );
    }

    /**
     * Emits when the user becomes authenticated.
     *
     * @returns login notification stream
     */
    private createLoginStream(): Observable<void> {
        return this.authenticated$.pipe(
            filter((authenticated) => authenticated),
            map(() => undefined)
        );
    }

    /**
     * Emits when OAuth tokens are received.
     *
     * @returns token received notification stream
     */
    private createTokenReceivedStream(): Observable<void> {
        return this.oauthService.events.pipe(
            filter((event: OAuthEvent) => event.type === 'token_received'),
            map(() => undefined)
        );
    }

    /**
     * Emits discovery-document load failures as IdP reachability errors.
     *
     * @returns IdP unreachable error stream
     */
    private createIdpUnreachableStream(): Observable<Error> {
        return this.oauthService.events.pipe(
            filter((event): event is OAuthErrorEvent => event.type === 'discovery_document_load_error'),
            map((event) => event.reason as Error)
        );
    }

    /**
     * Subscribes to the combined OAuth error stream and logs out once an error wins the race.
     */
    private subscribeToCombinedOAuthErrors(): void {
        this.combinedOAuthErrorsStream$.subscribe({
            next: (res) => {
                this._oauthLogger.error(res);
                this.logout();
            },
            error: () => {}
        });
    }

    /**
     * Removes stored auth data when an initially invalid access token remains invalid after clock sync.
     */
    private removeInvalidStoredAccessTokenAfterClockSync(): void {
        this.oauthService.events
            .pipe(
                take(1),
                filter(() => !!this.oauthService.getAccessToken() && !this.oauthService.hasValidAccessToken()),
                switchMap(() => this._timeSyncService.syncClockOffset())
            )
            .subscribe(() => {
                if (!this.oauthService.hasValidAccessToken()) {
                    if (this.oauthService.showDebugInformation) {
                        this._oauthLogger.warn('Access token not valid after clock resync. Removing all auth items from storage');
                    }
                    this.AUTH_STORAGE_ITEMS.forEach((item: string) => this._oauthStorage.removeItem(item));
                }
            });
    }

    init(): Promise<boolean> {
        if (isPromise(this.authConfig)) {
            return this.authConfig.then((config) => this.configureAuth(config));
        }

        return this.configureAuth(this.authConfig);
    }

    logout() {
        this._timeSyncService.stopPeriodicSync();
        this.oauthService.logOut();
    }

    ensureDiscoveryDocument(): Promise<boolean> {
        this._loadDiscoveryDocumentPromise = this._loadDiscoveryDocumentPromise
            .catch(() => false)
            .then((loaded) => {
                if (!loaded) {
                    return this.oauthService.loadDiscoveryDocument().then(() => true);
                }
                return true;
            });
        return this._loadDiscoveryDocumentPromise;
    }

    login(currentUrl?: string): void {
        let stateKey: string | undefined;

        if (currentUrl) {
            const randomValue = window.crypto.getRandomValues(new Uint32Array(1))[0];
            stateKey = `auth_state_${randomValue}${Date.now()}`;
            this._oauthStorage.setItem(stateKey, JSON.stringify(currentUrl || {}));
        }

        // initLoginFlow will initialize the login flow in either code or implicit depending on the configuration
        this.ensureDiscoveryDocument().then(() => void this.oauthService.initLoginFlow(stateKey));
    }

    baseAuthLogin(username: string, password: string): Observable<TokenResponse> {
        this.oauthService.useHttpBasicAuth = true;

        return from(this.oauthService.fetchTokenUsingPasswordFlow(username, password)).pipe(
            map((response) => {
                const props = new Map<string, string>();
                props.set('id_token', response.id_token);
                // for backward compatibility we need to set the response in our storage
                this.oauthService['storeAccessTokenResponse'](
                    response.access_token,
                    response.refresh_token,
                    response.expires_in,
                    response.scope,
                    props
                );
                return response;
            })
        );
    }

    async loginCallback(loginOptions?: LoginOptions): Promise<string | undefined> {
        return this.ensureDiscoveryDocument()
            .then(() => this.syncClockBeforeLoginCallback())
            .then(() => this.tryLoginCallback(loginOptions))
            .then(() => this._getRedirectUrl());
    }

    /**
     * Waits for the optional clock sync attempt before OAuth validates the login callback tokens.
     * When time sync is disabled or cannot sync, `TimeSyncService` completes using the old raw-clock
     * behavior, so this only changes behavior when a trusted server time is available.
     *
     * @returns promise that resolves after the clock sync decision has completed
     */
    private syncClockBeforeLoginCallback(): Promise<void> {
        return firstValueFrom(this._timeSyncService.syncClockOffset());
    }

    /**
     * Runs the existing retry-login flow with the auth-module login callback options applied.
     *
     * @param loginOptions options received by `loginCallback`
     * @returns promise that resolves when OAuth login succeeds
     */
    private tryLoginCallback(loginOptions?: LoginOptions): Promise<boolean> {
        return this._retryLoginService.tryToLoginTimes({
            ...loginOptions,
            preventClearHashAfterLogin: this.authModuleConfig.preventClearHashAfterLogin
        });
    }

    /**
     * Resolves the redirect URL stored before login, then removes the temporary state entry.
     *
     * @returns stored redirect URL, or `/` when no redirect state exists
     */
    private _getRedirectUrl() {
        const DEFAULT_REDIRECT = '/';
        const stateKey = this.oauthService.state;

        if (stateKey) {
            const stateStringified = this._oauthStorage.getItem(stateKey);
            if (stateStringified) {
                // cleanup state from storage
                this._oauthStorage.removeItem(stateKey);
                return JSON.parse(stateStringified);
            }
        }

        return DEFAULT_REDIRECT;
    }

    /**
     * Applies OAuth configuration, loads discovery metadata, and starts auth background helpers.
     * Loading errors are converted to `false` so unprotected routes can still render.
     *
     * @param config OAuth configuration to apply
     * @returns promise resolving to true when configuration completes, otherwise false
     */
    private configureAuth(config: AuthConfig): Promise<boolean> {
        this.oauthService.configure(config);
        this.oauthService.tokenValidationHandler = new WebCryptoJwksValidationHandler();

        this.subscribeToSessionTermination(config);

        return this.ensureDiscoveryDocument()
            .then(() => this.completeAuthConfiguration())
            .catch(() => {
                // catch error to prevent the app from crashing when trying to access unprotected routes
                return false;
            });
    }

    /**
     * Subscribes to session termination logout events only when session checks are enabled.
     *
     * @param config OAuth configuration currently being applied
     */
    private subscribeToSessionTermination(config: AuthConfig): void {
        if (config.sessionChecksEnabled) {
            this.oauthService.events.pipe(filter((event) => event.type === 'session_terminated')).subscribe(() => {
                this.oauthService.logOut();
            });
        }
    }

    /**
     * Finishes auth setup after discovery metadata has loaded.
     * This keeps the existing eager sync/periodic sync behavior and multi-tab refresh patch.
     *
     * @returns true when auth configuration completes
     */
    private completeAuthConfiguration(): boolean {
        this._isDiscoveryDocumentLoadedSubject$.next(true);
        this.oauthService.setupAutomaticSilentRefresh();
        this._timeSyncService.syncClockOffset().subscribe();
        this._timeSyncService.startPeriodicSync();
        this.allowRefreshTokenAndSilentRefreshOnMultipleTabs();
        return true;
    }

    /**
     * Fix a known issue (https://github.com/manfredsteyer/angular-oauth2-oidc/issues/850)
     * where multiple tabs can cause the token refresh and the silent refresh to fail.
     * This patch is based on the solutions provided in the following comments:
     * https://github.com/manfredsteyer/angular-oauth2-oidc/issues/850#issuecomment-889921776 fix silent refresh for the implicit flow
     * https://github.com/manfredsteyer/angular-oauth2-oidc/issues/850#issuecomment-1557286966 fix refresh token for the code flow
     */
    private allowRefreshTokenAndSilentRefreshOnMultipleTabs() {
        let lastUpdatedAccessToken: string | undefined;

        if (this.oauthService.hasValidAccessToken()) {
            lastUpdatedAccessToken = this.oauthService.getAccessToken();
        }

        const originalRefreshToken = this.oauthService.refreshToken.bind(this.oauthService);
        this.oauthService.refreshToken = (): Promise<TokenResponse> =>
            navigator.locks.request(`refresh_tokens_${location.origin}`, () => {
                if (!!lastUpdatedAccessToken && lastUpdatedAccessToken !== this.oauthService.getAccessToken()) {
                    (this.oauthService as any).eventsSubject.next(new OAuthSuccessEvent('token_received'));
                    (this.oauthService as any).eventsSubject.next(new OAuthSuccessEvent('token_refreshed'));
                    lastUpdatedAccessToken = this.oauthService.getAccessToken();
                    return undefined as unknown as TokenResponse;
                }

                return originalRefreshToken().then((resp) => {
                    lastUpdatedAccessToken = resp.access_token;
                    return resp;
                });
            });

        const originalSilentRefresh = this.oauthService.silentRefresh.bind(this.oauthService);
        this.oauthService.silentRefresh = async (params: any = {}, noPrompt = true): Promise<OAuthEvent> =>
            navigator.locks.request(`silent_refresh_${location.origin}`, async (): Promise<OAuthEvent> => {
                if (lastUpdatedAccessToken !== this.oauthService.getAccessToken()) {
                    (this.oauthService as any).eventsSubject.next(new OAuthSuccessEvent('token_received'));
                    (this.oauthService as any).eventsSubject.next(new OAuthSuccessEvent('token_refreshed'));
                    const event = new OAuthSuccessEvent('silently_refreshed');
                    (this.oauthService as any).eventsSubject.next(event);
                    lastUpdatedAccessToken = this.oauthService.getAccessToken();
                    return event;
                } else {
                    return originalSilentRefresh(params, noPrompt);
                }
            });
    }

    updateIDPConfiguration(config: AuthConfig) {
        this.oauthService.configure(config);
    }

    /**
     * Checks if the token has expired.
     *
     * This method retrieves the identity claims from the OAuth service and calculates
     * the token's issued and expiration times. It then compares the current time with
     * these values, considering a clock skew and a configurable expiration decrease.
     *
     * @returns - Returns `true` if the token has expired, otherwise `false`.
     */
    tokenHasExpired() {
        const claims = this.oauthService.getIdentityClaims();
        if (!claims) {
            this._oauthLogger.warn('No claims found in the token');
            return false;
        }
        const now = this._timeSyncService.getCorrectedNow();
        const issuedAtMSec = claims.iat * 1000;
        const expiresAtMSec = claims.exp * 1000;
        const clockSkewInMSec = (this.oauthService.clockSkewInSec ?? 0) * 1000;
        const decreaseExpirationBySec = this.oauthService.decreaseExpirationBySec ?? 0;

        this.showTokenExpiredDebugInformations(now, issuedAtMSec, expiresAtMSec, clockSkewInMSec);
        return issuedAtMSec - clockSkewInMSec >= now || expiresAtMSec + clockSkewInMSec - decreaseExpirationBySec <= now;
    }

    private showTokenExpiredDebugInformations(now: number, issuedAtMSec: number, expiresAtMSec: number, clockSkewInMSec: number) {
        if (this.oauthService.showDebugInformation) {
            this._oauthLogger.warn('now: ', new Date(now));
            this._oauthLogger.warn('issuedAt: ', new Date(issuedAtMSec));
            this._oauthLogger.warn('expiresAt: ', new Date(expiresAtMSec));
            this._oauthLogger.warn('clockSkewInMSec: ', clockSkewInMSec);
            this._oauthLogger.warn('issuedAtMSec - clockSkewInMSec >= now: ', issuedAtMSec - clockSkewInMSec >= now);
            this._oauthLogger.warn(
                'expiresAtMSec + clockSkewInMSec - this.oauthService.decreaseExpirationBySec <= now: ',
                expiresAtMSec + clockSkewInMSec - (this.oauthService.decreaseExpirationBySec ?? 0) <= now
            );
        }
    }
}
