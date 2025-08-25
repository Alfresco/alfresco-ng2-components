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

import ee from 'event-emitter';
import { AlfrescoApiClient } from '../alfrescoApiClient';
import { AlfrescoApiConfig } from '../alfrescoApiConfig';
import { Authentication } from './authentication';
import { AuthenticationApi } from '../api/auth-rest-api';
import { AlfrescoApi } from '../alfrescoApi';
import { Storage } from '../storage';
import { HttpClient } from '../api-clients/http-client.interface';
import { PathMatcher } from '../utils/path-matcher';

declare const Buffer: any;

declare let window: Window;

interface Userinfo {
    name: string;
    given_name?: string;
    family_name?: string;
    preferred_username?: string;
    email?: string;
    picture?: string;
}

export class Oauth2Auth extends AlfrescoApiClient {
    static readonly DEFAULT_AUTHORIZATION_URL = '/protocol/openid-connect/auth';
    static readonly DEFAULT_TOKEN_URL = '/protocol/openid-connect/token';
    static readonly DEFAULT_USER_INFO_ENDPOINT = '/protocol/openid-connect/userinfo';
    static readonly DEFAULT_LOGOUT_URL = '/protocol/openid-connect/logout';

    private refreshTokenIntervalPolling: any;
    private refreshTokenTimeoutIframe: any;
    private checkAccessToken = true;

    hashFragmentParams: any;
    token: string;
    discovery: {
        loginUrl?: string;
        logoutUrl?: string;
        tokenEndpoint?: string;
        userinfoEndpoint?: string;
    } = {
        loginUrl: undefined,
        logoutUrl: undefined,
        tokenEndpoint: undefined,
        userinfoEndpoint: undefined
    };

    authentications: Authentication = {
        oauth2: { accessToken: '' },
        type: 'oauth2',
        basicAuth: {}
    };

    iFrameHashListener: any;
    pathMatcher = new PathMatcher();

    constructor(config: AlfrescoApiConfig, alfrescoApi: AlfrescoApi, httpClient?: HttpClient) {
        super(undefined, httpClient);
        this.storage = Storage.getInstance();

        this.className = 'Oauth2Auth';

        if (config) {
            this.setConfig(config, alfrescoApi);
        }
    }

    setConfig(config: AlfrescoApiConfig, alfrescoApi: AlfrescoApi) {
        this.config = config;
        this.storage.setDomainPrefix(config.domainPrefix);

        if (this.config.oauth2) {
            if (this.config.oauth2.host === undefined || this.config.oauth2.host === null) {
                throw new Error('Missing the required oauth2 host parameter');
            }

            if (this.config.oauth2.clientId === undefined || this.config.oauth2.clientId === null) {
                throw new Error('Missing the required oauth2 clientId parameter');
            }

            if (this.config.oauth2.scope === undefined || this.config.oauth2.scope === null) {
                throw new Error('Missing the required oauth2 scope parameter');
            }

            if (this.config.oauth2.secret === undefined || this.config.oauth2.secret === null) {
                this.config.oauth2.secret = '';
            }

            if ((this.config.oauth2.redirectUri === undefined || this.config.oauth2.redirectUri === null) && this.config.oauth2.implicitFlow) {
                throw new Error('Missing redirectUri required parameter');
            }

            if (!this.config.oauth2.refreshTokenTimeout) {
                this.config.oauth2.refreshTokenTimeout = 300000;
            }

            if (!this.config.oauth2.redirectSilentIframeUri) {
                let context = '';
                if (typeof window !== 'undefined') {
                    context = window.location.origin;
                }
                this.config.oauth2.redirectSilentIframeUri = context + '/assets/silent-refresh.html';
            }

            this.basePath = this.config.oauth2.host; //Auth Call

            this.host = this.config.oauth2.host;

            this.discoveryUrls();

            if (this.hasContentProvider()) {
                this.exchangeTicketListener(alfrescoApi);
            }

            this.initOauth();
        }
    }

    initOauth() {
        if (!this.config.oauth2.implicitFlow && this.isValidAccessToken()) {
            const accessToken = this.storage.getItem('access_token');
            this.setToken(accessToken, null);
        }

        if (this.config.oauth2.implicitFlow) {
            this.checkFragment('nonce');
        }
    }

    discoveryUrls() {
        this.discovery.loginUrl = this.config.oauth2.authorizationUrl || this.host + Oauth2Auth.DEFAULT_AUTHORIZATION_URL;
        this.discovery.logoutUrl = this.config.oauth2.logoutUrl || this.host + Oauth2Auth.DEFAULT_LOGOUT_URL;
        this.discovery.tokenEndpoint = this.config.oauth2.tokenUrl || this.host + Oauth2Auth.DEFAULT_TOKEN_URL;
        this.discovery.userinfoEndpoint = this.config.oauth2.userinfoEndpoint || this.host + Oauth2Auth.DEFAULT_USER_INFO_ENDPOINT;
    }

    getProfile(): Promise<Userinfo> {
        const postBody = {};
        const pathParams = {};
        const queryParams = {};

        const headerParams = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        const formParams = {};

        const contentTypes = ['application/x-www-form-urlencoded'];
        const accepts = ['application/json'];

        return this.callCustomApi(
            this.discovery.userinfoEndpoint,
            'GET',
            pathParams,
            queryParams,
            headerParams,
            formParams,
            postBody,
            contentTypes,
            accepts
        );
    }

    hasContentProvider(): boolean {
        return this.config.provider === 'ECM' || this.config.provider === 'ALL';
    }

    checkFragment(nonceKey?: string, externalHash?: any): any {
        // jshint ignore:line
        this.hashFragmentParams = this.getHashFragmentParams(externalHash);

        if (this.hashFragmentParams && this.hashFragmentParams.error === undefined) {
            this.useFragmentTimeLogin(nonceKey);
        } else {
            this.refreshBrowserLogin();
        }
    }

    private refreshBrowserLogin() {
        if (this.config.oauth2.silentLogin && !this.isPublicUrl()) {
            this.implicitLogin();
        }

        if (this.isValidToken() && this.isValidAccessToken()) {
            const accessToken = this.storage.getItem('access_token');
            this.setToken(accessToken, null);
            this.silentRefresh();
        }
    }

    private useFragmentTimeLogin(nonceKey: string) {
        const accessToken = this.hashFragmentParams.access_token;
        const idToken = this.hashFragmentParams.id_token;
        const sessionState = this.hashFragmentParams.session_state;
        const expiresIn = this.hashFragmentParams.expires_in;

        if (!sessionState) {
            throw new Error('session state not present');
        }

        try {
            const jwt = this.processJWTToken(idToken, nonceKey);
            if (jwt) {
                this.storeIdToken(idToken, jwt.payload.exp);
                this.storeAccessToken(accessToken, expiresIn);
                this.authentications.basicAuth.username = jwt.payload.preferred_username;
                this.saveUsername(jwt.payload.preferred_username);
                this.silentRefresh();
                return accessToken;
            }
        } catch (error) {
            throw new Error('Validation JWT error' + error);
        }
    }

    isPublicUrl(): boolean {
        const publicUrls = this.config.oauth2.publicUrls || [];

        if (Array.isArray(publicUrls)) {
            return publicUrls.length > 0 && publicUrls.some((urlPattern: string) => this.pathMatcher.match(window.location.href, urlPattern));
        }
        return false;
    }

    padBase64(base64data: any) {
        while (base64data.length % 4 !== 0) {
            base64data += '=';
        }
        return base64data;
    }

    processJWTToken(jwt: any, nonceKey: string): any {
        if (jwt) {
            const jwtArray = jwt.split('.');
            const headerBase64 = this.padBase64(jwtArray[0]);
            const headerJson = this.b64DecodeUnicode(headerBase64);
            const header = JSON.parse(headerJson);

            const payloadBase64 = this.padBase64(jwtArray[1]);
            const payloadJson = this.b64DecodeUnicode(payloadBase64);
            const payload = JSON.parse(payloadJson);

            const savedNonce = this.storage.getItem(nonceKey);

            if (!payload.sub) {
                throw new Error('Missing sub in JWT');
            }

            if (payload.nonce !== savedNonce) {
                return;
            }

            return {
                idToken: jwt,
                payload,
                header
            };
        }
    }

    b64DecodeUnicode(b64string: string) {
        const base64 = b64string.replace(/-/g, '+').replace(/_/g, '/');
        return decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
    }

    storeIdToken(idToken: string, exp: number) {
        this.storage.setItem('id_token', idToken);
        this.storage.setItem('id_token_expires_at', Number(exp * 1000).toString());
        this.storage.setItem('id_token_stored_at', Date.now().toString());
    }

    storeAccessToken(accessToken: string, expiresIn: number, refreshToken?: string) {
        this.storage.setItem('access_token', accessToken);

        const expiresInMilliSeconds = expiresIn * 1000;
        const now = new Date();
        const expiresAt = now.getTime() + expiresInMilliSeconds;

        this.storage.setItem('access_token_expires_in', expiresAt);
        this.storage.setItem('access_token_stored_at', Date.now().toString());
        this.setToken(accessToken, refreshToken);
    }

    saveUsername(username: string) {
        if (this.storage.supportsStorage()) {
            this.storage.setItem('USERNAME', username);
        }
    }

    implicitLogin() {
        if (!this.isValidToken() || !this.isValidAccessToken()) {
            this.redirectLogin();
        }
    }

    isValidToken(): boolean {
        let validToken = false;
        if (this.getIdToken()) {
            const expiresAt = this.storage.getItem('id_token_expires_at');
            const now = new Date();
            if (expiresAt && parseInt(expiresAt, 10) >= now.getTime()) {
                validToken = true;
            }
        }

        return validToken;
    }

    isValidAccessToken(): boolean {
        let validAccessToken = false;

        if (this.getAccessToken()) {
            const expiresAt = this.storage.getItem('access_token_expires_in');
            const now = new Date();
            if (expiresAt && parseInt(expiresAt, 10) >= now.getTime()) {
                validAccessToken = true;
            }
        }

        return validAccessToken;
    }

    getIdToken(): string {
        return this.storage.getItem('id_token');
    }

    getAccessToken(): string {
        return this.storage.getItem('access_token');
    }

    redirectLogin(): void {
        if (this.config.oauth2.implicitFlow && typeof window !== 'undefined') {
            const href = this.composeImplicitLoginUrl();
            window.location.href = href;
            this.emit('implicit_redirect', href);
        }
    }

    isRedirectionUrl() {
        return window.location.hash && window.location.hash.split('&')[0].indexOf('session_state') === -1;
    }

    genNonce(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 40; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    composeImplicitLoginUrl(): string {
        const nonce = this.genNonce();

        this.storage.setItem('nonce', nonce);

        const afterLoginUriSegment = this.isRedirectionUrl() ? window.location.hash : '';
        if (afterLoginUriSegment && afterLoginUriSegment !== '/') {
            this.storage.setItem('loginFragment', afterLoginUriSegment.replace('#', '').trim());
        }

        const separation = this.discovery.loginUrl.indexOf('?') > -1 ? '&' : '?';

        return (
            this.discovery.loginUrl +
            separation +
            'client_id=' +
            encodeURIComponent(this.config.oauth2.clientId) +
            '&redirect_uri=' +
            encodeURIComponent(this.config.oauth2.redirectUri) +
            '&scope=' +
            encodeURIComponent(this.config.oauth2.scope) +
            '&response_type=' +
            encodeURIComponent('id_token token') +
            '&nonce=' +
            encodeURIComponent(nonce)
        );
    }

    composeIframeLoginUrl(): string {
        const nonce = this.genNonce();

        this.storage.setItem('refresh_nonce', nonce);

        const separation = this.discovery.loginUrl.indexOf('?') > -1 ? '&' : '?';

        return (
            this.discovery.loginUrl +
            separation +
            'client_id=' +
            encodeURIComponent(this.config.oauth2.clientId) +
            '&redirect_uri=' +
            encodeURIComponent(this.config.oauth2.redirectSilentIframeUri) +
            '&scope=' +
            encodeURIComponent(this.config.oauth2.scope) +
            '&response_type=' +
            encodeURIComponent('id_token token') +
            '&nonce=' +
            encodeURIComponent(nonce) +
            '&prompt=none'
        );
    }

    hasHashCharacter(hash: string): boolean {
        return hash.indexOf('#') === 0;
    }

    startWithHashRoute(hash: string) {
        return hash.startsWith('#/');
    }

    getHashFragmentParams(externalHash: string): string {
        let hashFragmentParams = null;

        if (typeof window !== 'undefined') {
            let hash: string;

            if (!externalHash) {
                hash = decodeURIComponent(window.location.hash);
                if (!this.startWithHashRoute(hash)) {
                    window.location.hash = '';
                }
            } else {
                hash = decodeURIComponent(externalHash);
                this.removeHashFromSilentIframe();
                this.destroyIframe();
            }

            if (this.hasHashCharacter(hash) && !this.startWithHashRoute(hash)) {
                const questionMarkPosition = hash.indexOf('?');

                if (questionMarkPosition > -1) {
                    hash = hash.substring(questionMarkPosition + 1);
                } else {
                    hash = hash.substring(1);
                }
                hashFragmentParams = this.parseQueryString(hash);
            }
        }
        return hashFragmentParams;
    }

    parseQueryString(queryString: string): any {
        const data: { [key: string]: any } = {};
        let pairs: string[];
        let pair: string;
        let separatorIndex: number;
        let escapedKey: string;
        let escapedValue: string;
        let key: string;
        let value: string;

        if (queryString !== null) {
            pairs = queryString.split('&');

            for (const item of pairs) {
                pair = item;
                separatorIndex = pair.indexOf('=');

                if (separatorIndex === -1) {
                    escapedKey = pair;
                    escapedValue = null;
                } else {
                    escapedKey = pair.substring(0, separatorIndex);
                    escapedValue = pair.substring(separatorIndex + 1);
                }

                key = decodeURIComponent(escapedKey);
                value = decodeURIComponent(escapedValue);

                if (key.startsWith('/')) {
                    key = key.substring(1);
                }

                data[key] = value;
            }
        }

        return data;
    }

    silentRefresh(): void {
        if (typeof document === 'undefined') {
            this.pollingRefreshToken();
            return;
        }

        if (this.checkAccessToken) {
            this.destroyIframe();
            this.createIframe();
            this.checkAccessToken = false;
            return;
        }

        this.refreshTokenTimeoutIframe = setTimeout(() => {
            this.destroyIframe();
            this.createIframe();
        }, this.config.oauth2.refreshTokenTimeout);
    }

    removeHashFromSilentIframe() {
        const iframe = document.getElementById('silent_refresh_token_iframe') as HTMLIFrameElement;
        if (iframe?.contentWindow.location.hash) {
            iframe.contentWindow.location.hash = '';
        }
    }

    createIframe() {
        const iframe = document.createElement('iframe');
        iframe.id = 'silent_refresh_token_iframe';
        const loginUrl = this.composeIframeLoginUrl();
        iframe.setAttribute('src', loginUrl);
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        this.iFrameHashListener = () => {
            const silentRefreshTokenIframe: any = document.getElementById('silent_refresh_token_iframe');
            const hash = silentRefreshTokenIframe.contentWindow.location.hash;
            try {
                this.checkFragment('refresh_nonce', hash);
            } catch {
                this.logOut();
            }
        };

        iframe.addEventListener('load', this.iFrameHashListener);
    }

    destroyIframe() {
        const iframe = document.getElementById('silent_refresh_token_iframe');

        if (iframe) {
            iframe.removeEventListener('load', this.iFrameHashListener);
            document.body.removeChild(iframe);
        }
    }

    /**
     * login Alfresco API
     * @returns A promise that returns {new authentication token} if resolved and {error} if rejected.
     */
    login(username: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.grantPasswordLogin(username, password, resolve, reject);
        });
    }

    grantPasswordLogin(username: string, password: string, resolve: any, reject: any) {
        this.invalidateSession();

        const headerParams = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        const formParams = {
            username,
            password,
            grant_type: 'password',
            client_id: this.config.oauth2.clientId,
            client_secret: this.config.oauth2.secret
        };

        const contentTypes = ['application/x-www-form-urlencoded'];
        const accepts = ['application/json'];

        const promise = this.callCustomApi(this.discovery.tokenEndpoint, 'POST', {}, {}, headerParams, formParams, {}, contentTypes, accepts).then(
            (data: any) => {
                this.saveUsername(username);
                this.silentRefresh();
                this.storeAccessToken(data.access_token, data.expires_in, data.refresh_token);

                resolve(data);
            },
            (error) => {
                if ((error.error && error.error.status === 401) || error.status === 401) {
                    this.emit('unauthorized');
                }
                this.emit('error');
                reject(error.error);
            }
        );

        ee(promise); // jshint ignore:line
    }

    pollingRefreshToken() {
        this.refreshTokenIntervalPolling = setInterval(async () => {
            try {
                await this.refreshToken();
            } catch {
                /* continue regardless of error */
            }
        }, this.config.oauth2.refreshTokenTimeout);

        this.refreshTokenIntervalPolling.unref();
    }

    /**
     * Refresh the Token
     * @returns promise of void
     */
    refreshToken(): Promise<any> {
        const auth = 'Basic ' + this.universalBtoa(this.config.oauth2.clientId + ':' + this.config.oauth2.secret);
        const headerParams = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
            Authorization: auth
        };
        const formParams = {
            grant_type: 'refresh_token',
            refresh_token: this.authentications.oauth2.refreshToken
        };

        const contentTypes = ['application/x-www-form-urlencoded'];
        const accepts = ['application/json'];

        const promise = new Promise((resolve, reject) => {
            this.callCustomApi(this.discovery.tokenEndpoint, 'POST', {}, {}, headerParams, formParams, {}, contentTypes, accepts).then(
                (data: any) => {
                    this.setToken(data.access_token, data.refresh_token);
                    resolve(data);
                },
                (error) => {
                    if (error.error && error.error.status === 401) {
                        this.emit('unauthorized');
                    }
                    this.emit('error');
                    reject(error.error);
                }
            );
        });

        ee(promise); // jshint ignore:line

        return promise;
    }

    universalBtoa(stringToConvert: string) {
        try {
            return btoa(stringToConvert);
        } catch {
            return Buffer.from(stringToConvert).toString('base64');
        }
    }

    /**
     * Set the current Token
     */
    setToken(token: string, refreshToken: string) {
        this.authentications.oauth2.accessToken = token;
        this.authentications.oauth2.refreshToken = refreshToken;
        this.authentications.basicAuth.password = null;
        this.token = token;

        if (token) {
            this.emit('token_issued');
            this.emit('logged-in');
        }
    }

    /**
     * Get the current Token
     * @returns token value
     */
    getToken(): string {
        return this.token;
    }

    /**
     * return the Authentication
     * @returns authentications
     */
    getAuthentication(): Authentication {
        return this.authentications;
    }

    /**
     * Change the Host
     */
    changeHost(host: string) {
        this.config.hostOauth2 = host;
    }

    /**
     * If the client is logged in return true
     * @returns is logged in
     */
    isLoggedIn(): boolean {
        return !!this.authentications.oauth2.accessToken;
    }

    /**
     * Logout
     */
    async logOut() {
        this.checkAccessToken = true;

        const id_token = this.getIdToken();

        this.invalidateSession();
        this.setToken(null, null);

        const separation = this.discovery.logoutUrl.indexOf('?') > -1 ? '&' : '?';
        const redirectLogout = this.config.oauth2.redirectUriLogout || this.config.oauth2.redirectUri;
        const logoutUrl =
            this.discovery.logoutUrl +
            separation +
            'post_logout_redirect_uri=' +
            encodeURIComponent(redirectLogout) +
            '&id_token_hint=' +
            encodeURIComponent(id_token);

        if (id_token != null && this.config.oauth2.implicitFlow && typeof window !== 'undefined') {
            window.location.href = logoutUrl;
        }
    }

    invalidateSession() {
        clearTimeout(this.refreshTokenTimeoutIframe);
        clearInterval(this.refreshTokenIntervalPolling);

        this.storage.removeItem('access_token');
        this.storage.removeItem('access_token_expires_in');
        this.storage.removeItem('access_token_stored_at');

        this.storage.removeItem('id_token');
        this.storage.removeItem('id_token');
        this.storage.removeItem('id_token_claims_obj');
        this.storage.removeItem('id_token_expires_at');
        this.storage.removeItem('id_token_stored_at');

        this.storage.removeItem('nonce');
    }

    exchangeTicketListener(alfrescoApi: AlfrescoApi) {
        this.on('token_issued', async () => {
            const authContentApi: AuthenticationApi = new AuthenticationApi(alfrescoApi);
            // Legacy stuff, needs deprecation, can not be more specific here because of circular dependency
            (authContentApi.apiClient as unknown as any).authentications = this.authentications;
            try {
                const ticketEntry = await authContentApi.getTicket();
                this.config.ticketEcm = ticketEntry.entry.id;
                this.emit('ticket_exchanged');
            } catch {
                // continue regardless of error
            }
        });
    }
}
