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
import {
    AuthConfig,
    AUTH_CONFIG,
    OAuthErrorEvent,
    OAuthEvent,
    OAuthService,
    OAuthStorage,
    TokenResponse,
    LoginOptions,
    OAuthSuccessEvent
} from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { from, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { AUTH_MODULE_CONFIG, AuthModuleConfig } from './auth-config';

const isPromise = <T>(value: T | Promise<T>): value is Promise<T> => value && typeof (value as Promise<T>).then === 'function';

@Injectable()
export class RedirectAuthService extends AuthService {
    readonly authModuleConfig: AuthModuleConfig = inject(AUTH_MODULE_CONFIG);

    onLogin: Observable<any>;

    onTokenReceived: Observable<any>;

    private _loadDiscoveryDocumentPromise = Promise.resolve(false);

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

    constructor(private oauthService: OAuthService, private _oauthStorage: OAuthStorage, @Inject(AUTH_CONFIG) authConfig: AuthConfig) {
        super();
        this.authConfig = authConfig;

        this.oauthService.clearHashAfterLogin = true;

        this.authenticated$ = this.oauthService.events.pipe(
            map(() => this.authenticated),
            distinctUntilChanged(),
            shareReplay(1)
        );

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
            .then(() => this.oauthService.tryLogin({ ...loginOptions, preventClearHashAfterLogin: this.authModuleConfig.preventClearHashAfterLogin }))
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

        return this.ensureDiscoveryDocument()
            .then(() => {
                this.oauthService.setupAutomaticSilentRefresh();
                return void this.allowRefreshTokenAndSilentRefreshOnMultipleTabs();
            })
            .catch(() => {
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
}
