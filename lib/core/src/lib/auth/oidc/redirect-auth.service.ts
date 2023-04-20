/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Inject, Injectable } from '@angular/core';
import { AuthConfig, AUTH_CONFIG, OAuthErrorEvent, OAuthService, OAuthStorage, TokenResponse } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { from, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, startWith } from 'rxjs/operators';
import { AuthService } from './auth.service';

const isPromise = <T>(value: T | Promise<T>): value is Promise<T> => value && typeof (value as Promise<T>).then === 'function';

@Injectable()
export class RedirectAuthService extends AuthService {
  private _loadDiscoveryDocumentPromise = Promise.resolve(false);

  /** Subscribe to whether the user has valid Id/Access tokens.  */
  authenticated$!: Observable<boolean>;

  /** Subscribe to errors reaching the IdP. */
  idpUnreachable$!: Observable<Error>;

  /** Get whether the user has valid Id/Access tokens. */
  get authenticated(): boolean {
    return this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken();
  }

  private authConfig!: AuthConfig | Promise<AuthConfig>;

  constructor(
    private oauthService: OAuthService,
    private _oauthStorage: OAuthStorage,
    @Inject(AUTH_CONFIG) authConfig: AuthConfig
  ) {
    super();
    this.authConfig = authConfig;
  }

  init() {
    this.oauthService.clearHashAfterLogin = true;

    this.authenticated$ = this.oauthService.events.pipe(
      startWith(undefined),
      map(() => this.authenticated),
      distinctUntilChanged(),
      shareReplay(1)
    );

    this.idpUnreachable$ = this.oauthService.events.pipe(
      filter((event): event is OAuthErrorEvent => event.type === 'discovery_document_load_error'),
      map((event) => event.reason as Error)
    );

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

  async loginCallback(): Promise<string | undefined> {
    return this.ensureDiscoveryDocument()
      .then(() => this.oauthService.tryLogin({ preventClearHashAfterLogin: false }))
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

  private configureAuth(config: AuthConfig) {
    this.oauthService.configure(config);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();

    if (config.sessionChecksEnabled) {
      this.oauthService.events.pipe(filter((event) => event.type === 'session_terminated')).subscribe(() => {
        this.oauthService.logOut();
      });
    }

    return this.ensureDiscoveryDocument().then(() =>
      void this.oauthService.setupAutomaticSilentRefresh()
    ).catch(() => {
       // catch error to prevent the app from crashing when trying to access unprotected routes
    });
  }

  updateIDPConfiguration(config: AuthConfig) {
    this.oauthService.configure(config);
  }
}
