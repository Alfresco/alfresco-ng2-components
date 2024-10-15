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

import { Inject, Injectable, inject } from '@angular/core';
import { AuthConfig, AUTH_CONFIG, OAuthErrorEvent, OAuthEvent, OAuthService, OAuthStorage, TokenResponse, LoginOptions, OAuthSuccessEvent, OAuthLogger } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { from, Observable, race, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { AUTH_MODULE_CONFIG, AuthModuleConfig } from './auth-config';
import { RetryLoginService } from './retry-login.service';
import { TimeSyncService } from '../services/time-sync.service';

const isPromise = <T>(value: T | Promise<T>): value is Promise<T> => value && typeof (value as Promise<T>).then === 'function';

@Injectable()
export class RedirectAuthService extends AuthService {

  readonly authModuleConfig: AuthModuleConfig = inject(AUTH_MODULE_CONFIG);
  private readonly _retryLoginService: RetryLoginService = inject(RetryLoginService);
  private readonly _oauthLogger: OAuthLogger = inject(OAuthLogger);
  private readonly _timeSyncService: TimeSyncService = inject(TimeSyncService);

  private _isDiscoveryDocumentLoadedSubject$ = new ReplaySubject<boolean>();
  public isDiscoveryDocumentLoaded$ = this._isDiscoveryDocumentLoadedSubject$.asObservable();

  onLogin: Observable<any>;

  onTokenReceived: Observable<any>;

  private _loadDiscoveryDocumentPromise = Promise.resolve(false);

  /**
   * Observable stream that emits OAuthErrorEvent instances.
   *
   * This observable listens to the events emitted by the OAuth service and filters
   * them to only include instances of OAuthErrorEvent. It then maps these events
   * to the correct type.
   *
   * @type {Observable<OAuthErrorEvent>}
   */
  oauthErrorEvent$: Observable<OAuthErrorEvent> = this.oauthService.events.pipe(
    filter(event => event instanceof OAuthErrorEvent),
    map((event) => event as OAuthErrorEvent)
  );

  /**
   * Observable stream that emits the first OAuth error event that occurs.
   */
  firstOauthErrorEventOccur$: Observable<OAuthErrorEvent> = this.oauthErrorEvent$.pipe(take(1));

  /**
   * Observable that emits an error when the token has expired due to
   * the local machine clock being out of sync with the server time.
   *
   * @observable
   * @type {Observable<Error>}
   */
  tokenHasExpiredDueToClockOutOfSync$: Observable<Error>;

  /**
   * Observable stream that emits either OAuthErrorEvent or Error.
   * This stream combines multiple OAuth error sources into a single observable.
   */
  combinedOAuthErrorsStream$: Observable<OAuthErrorEvent | Error>;

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

  private authConfig!: AuthConfig | Promise<AuthConfig>;

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

  constructor(
    private oauthService: OAuthService,
    private _oauthStorage: OAuthStorage,
    @Inject(AUTH_CONFIG) authConfig: AuthConfig
  ) {
    super();

    this.authConfig = authConfig;

    this.oauthService.clearHashAfterLogin = true;

    this.oauthService.events.pipe(
        filter(() => oauthService.showDebugInformation))
    .subscribe(event => {
        if (event instanceof OAuthErrorEvent) {
            this._oauthLogger.error('OAuthErrorEvent Object:', event);
        } else {
            this._oauthLogger.info('OAuthEvent Object:', event);
        }
    });

    this.authenticated$ = this.oauthService.events.pipe(
      map(() => this.authenticated),
      distinctUntilChanged(),
      shareReplay(1)
    );

    this.tokenHasExpiredDueToClockOutOfSync$ = this.oauthService.events.pipe(
        map(() => !!this.oauthService.getIdentityClaims() && this.tokenHasExpired()),
        filter((hasExpired) => hasExpired),
        switchMap(() => this._timeSyncService.checkTimeSync(this.oauthService.clockSkewInSec)),
        filter((timeSync) => timeSync?.outOfSync),
        map((timeSync) => new Error(`Token has expired due to local machine clock ${timeSync.localDateTimeISO} being out of sync with server time ${timeSync.serverDateTimeISO}`)),
        take(1)
    );

    this.combinedOAuthErrorsStream$ = race([this.firstOauthErrorEventOccur$, this.tokenHasExpiredDueToClockOutOfSync$]);

    this.combinedOAuthErrorsStream$.subscribe({
        next: (res) => {
            this._oauthLogger.error(res);
            this.logout();
        },
        error: () => {}
    });

    this.oauthService.events.pipe(take(1)).subscribe(() => {
        if(this.oauthService.getAccessToken() && !this.oauthService.hasValidAccessToken()) {
            if(this.oauthService.showDebugInformation) {
                this._oauthLogger.warn('Access token not valid. Removing all auth items from storage');
            }
            this.AUTH_STORAGE_ITEMS.map((item: string) => this._oauthStorage.removeItem(item));
        }
    });

    this.onLogin = this.authenticated$.pipe(
        filter((authenticated) => authenticated),
        map(() => undefined)
    );

    this.onTokenReceived = this.oauthService.events.pipe(
        filter((event: OAuthEvent) => event.type === 'token_received'),
        map(() => undefined)
    );

    this.idpUnreachable$ = this.oauthService.events.pipe(
      filter((event): event is OAuthErrorEvent => event.type === 'discovery_document_load_error'),
      map((event) => event.reason as Error)
    );

    }

  init(): Promise<boolean> {
    if (isPromise(this.authConfig)) {
        return this.authConfig.then((config) => this.configureAuth(config));
    }

    return this.configureAuth(this.authConfig);
  }

  logout() {
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
            this.oauthService['storeAccessTokenResponse'](response.access_token, response.refresh_token, response.expires_in, response.scope, props);
            return response;
        })
    );
  }

  async loginCallback(loginOptions?: LoginOptions): Promise<string | undefined> {
      return this.ensureDiscoveryDocument()
          .then(() => this._retryLoginService.tryToLoginTimes({ ...loginOptions, preventClearHashAfterLogin: this.authModuleConfig.preventClearHashAfterLogin }))
          .then(() => this._getRedirectUrl());
  }

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

  private configureAuth(config: AuthConfig): Promise<boolean> {
    this.oauthService.configure(config);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();

    if (config.sessionChecksEnabled) {
      this.oauthService.events.pipe(filter((event) => event.type === 'session_terminated')).subscribe(() => {
        this.oauthService.logOut();
      });
    }

    return this.ensureDiscoveryDocument().then(() => {
      this._isDiscoveryDocumentLoadedSubject$.next(true);
      this.oauthService.setupAutomaticSilentRefresh();
      return void this.allowRefreshTokenAndSilentRefreshOnMultipleTabs();
    }).catch(() => {
       // catch error to prevent the app from crashing when trying to access unprotected routes
    });
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
                return;
            }

            return originalRefreshToken().then((resp) => (lastUpdatedAccessToken = resp.access_token));
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
  tokenHasExpired(){
    const claims = this.oauthService.getIdentityClaims();
    if(!claims){
        this._oauthLogger.warn('No claims found in the token');
        return false;
    }
    const now = Date.now();
    const issuedAtMSec = claims.iat * 1000;
    const expiresAtMSec = claims.exp * 1000;
    const clockSkewInMSec = this.oauthService.clockSkewInSec * 1000;

    this.showTokenExpiredDebugInformations(now, issuedAtMSec, expiresAtMSec, clockSkewInMSec);
    return issuedAtMSec - clockSkewInMSec >= now ||
    expiresAtMSec + clockSkewInMSec - this.oauthService.decreaseExpirationBySec <= now;
  }

  private showTokenExpiredDebugInformations(now: number, issuedAtMSec: number, expiresAtMSec: number, clockSkewInMSec: number) {
    if(this.oauthService.showDebugInformation) {
        this._oauthLogger.warn('now: ', new Date(now));
        this._oauthLogger.warn('issuedAt: ', new Date(issuedAtMSec));
        this._oauthLogger.warn('expiresAt: ', new Date(expiresAtMSec));
        this._oauthLogger.warn('clockSkewInMSec: ', this.oauthService.clockSkewInSec);
        this._oauthLogger.warn('this.oauthService.decreaseExpirationBySec: ', this.oauthService.decreaseExpirationBySec);
        this._oauthLogger.warn('issuedAtMSec - clockSkewInMSec >= now: ', issuedAtMSec - clockSkewInMSec >= now);
        this._oauthLogger.warn('expiresAtMSec + clockSkewInMSec - this.oauthService.decreaseExpirationBySec <= now: ', expiresAtMSec + clockSkewInMSec - this.oauthService.decreaseExpirationBySec <= now);
    }
  }

}
