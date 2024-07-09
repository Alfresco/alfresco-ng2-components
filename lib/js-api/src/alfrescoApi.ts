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

import ee, { EmitterMethod, Emitter } from 'event-emitter';
import { ContentAuth } from './authentication/contentAuth';
import { ProcessAuth } from './authentication/processAuth';
import { Oauth2Auth } from './authentication/oauth2Auth';
import { ContentClient } from './contentClient';
import { ProcessClient } from './processClient';
import { Storage } from './storage';
import { AlfrescoApiConfig } from './alfrescoApiConfig';
import { Authentication } from './authentication/authentication';
import { AlfrescoApiType } from './to-deprecate/alfresco-api-type';
import { HttpClient } from './api-clients/http-client.interface';

export class AlfrescoApi implements Emitter, AlfrescoApiType {
    __type = 'legacy-client';
    storage: Storage;
    config: AlfrescoApiConfig;
    contentClient: ContentClient;
    contentPrivateClient: ContentClient;
    processClient: ProcessClient;
    searchClient: ContentClient;
    discoveryClient: ContentClient;
    gsClient: ContentClient;
    authClient: ContentClient;
    oauth2Auth: Oauth2Auth;
    processAuth: ProcessAuth;
    contentAuth: ContentAuth;

    on: EmitterMethod;
    off: EmitterMethod;
    once: EmitterMethod;

    bufferEvents: string[] = [];

    emit: (type: string, ...args: any[]) => void;

    username: string;

    constructor(config?: AlfrescoApiConfig, public httpClient?: HttpClient) {
        ee(this);

        if (config) {
            this.setConfig(config);
        }
    }

    setConfig(config: AlfrescoApiConfig) {
        if (!config) {
            config = {};
        }

        this.storage = Storage.getInstance();
        this.storage.setDomainPrefix(config.domainPrefix);

        this.initConfig(config);
        this.validateTicket(config);
    }

    private initConfig(config: AlfrescoApiConfig) {
        this.config = new AlfrescoApiConfig(config);

        this.clientsFactory();

        this.errorListeners();
        if (this.config.oauthInit) {
            this.initAuth(config);

            if (this.isLoggedIn()) {
                this.emitBuffer('logged-in');
            }
        }
    }

    private validateTicket(config: AlfrescoApiConfig) {
        if (config.ticketEcm && !this.isOauthConfiguration()) {
            if (!this.contentAuth) {
                this.contentAuth = new ContentAuth(this.config, this, this.httpClient);
            }
            this.contentAuth
                .validateTicket()
                .then((ticket) => {
                    config.ticketEcm = ticket;
                })
                .catch((error) => {
                    if (error.status === 401) {
                        config.ticketEcm = null;
                        this.initConfig(config);
                        this.emitBuffer('ticket_invalidated');
                    }
                });
        }
    }

    private initAuth(config: AlfrescoApiConfig): void {
        if (this.isOauthConfiguration()) {
            if (!this.oauth2Auth) {
                this.oauth2Auth = new Oauth2Auth(this.config, this, this.httpClient);
            } else {
                this.oauth2Auth.setConfig(this.config, this);
            }

            this.oauth2Auth?.on('logged-in', () => {
                this.emitBuffer('logged-in');
            });

            this.setAuthenticationClientECMBPM(this.oauth2Auth.getAuthentication(), this.oauth2Auth.getAuthentication());
        } else {
            if (!this.processAuth) {
                this.processAuth = new ProcessAuth(this.config, this.httpClient);
            } else {
                this.processAuth.setConfig(this.config);
            }

            this.processAuth?.on('logged-in', () => {
                this.emitBuffer('logged-in');
            });

            if (!this.contentAuth) {
                this.contentAuth = new ContentAuth(this.config, this, this.httpClient);
            } else {
                this.contentAuth.setConfig(config);
            }

            this.contentAuth?.on('logged-in', () => {
                this.emitBuffer('logged-in');
            });

            this.setAuthenticationClientECMBPM(this.contentAuth.getAuthentication(), this.processAuth.getAuthentication());
        }
    }

    private clientsFactory() {
        if (!this.contentPrivateClient) {
            this.contentPrivateClient = new ContentClient(this.config, `/api/${this.config.tenant}/private/alfresco/versions/1`, this.httpClient);
        } else {
            this.contentPrivateClient.setConfig(this.config, `/api/${this.config.tenant}/private/alfresco/versions/1`);
        }

        if (!this.contentClient) {
            this.contentClient = new ContentClient(this.config, `/api/${this.config.tenant}/public/alfresco/versions/1`, this.httpClient);
        } else {
            this.contentClient.setConfig(this.config, `/api/${this.config.tenant}/public/alfresco/versions/1`);
        }

        if (!this.authClient) {
            this.authClient = new ContentClient(this.config, `/api/${this.config.tenant}/public/authentication/versions/1`, this.httpClient);
        } else {
            this.authClient.setConfig(this.config, `/api/${this.config.tenant}/public/authentication/versions/1`);
        }

        if (!this.searchClient) {
            this.searchClient = new ContentClient(this.config, `/api/${this.config.tenant}/public/search/versions/1`, this.httpClient);
        } else {
            this.searchClient.setConfig(this.config, `/api/${this.config.tenant}/public/search/versions/1`);
        }

        if (!this.discoveryClient) {
            this.discoveryClient = new ContentClient(this.config, `/api`, this.httpClient);
        } else {
            this.discoveryClient.setConfig(this.config, `/api`);
        }

        if (!this.gsClient) {
            this.gsClient = new ContentClient(this.config, `/api/${this.config.tenant}/public/gs/versions/1`, this.httpClient);
        } else {
            this.gsClient.setConfig(this.config, `/api/${this.config.tenant}/public/gs/versions/1`);
        }

        if (!this.processClient) {
            this.processClient = new ProcessClient(this.config, this.httpClient);
        } else {
            this.processClient.setConfig(this.config);
        }
    }

    /**@private? */
    errorListeners() {
        this.contentClient.off('error', () => {});
        this.authClient.off('error', () => {});
        this.contentPrivateClient.off('error', () => {});
        this.processClient.off('error', () => {});
        this.searchClient.off('error', () => {});
        this.discoveryClient.off('error', () => {});
        this.gsClient.off('error', () => {});

        this.contentClient.on('error', (error: any) => {
            this.errorHandler(error);
        });

        this.authClient.on('error', (error: any) => {
            this.errorHandler(error);
        });

        this.contentPrivateClient.on('error', (error: any) => {
            this.errorHandler(error);
        });

        this.processClient.on('error', (error: any) => {
            this.errorHandler(error);
        });

        this.searchClient.on('error', (error: any) => {
            this.errorHandler(error);
        });

        this.discoveryClient.on('error', (error: any) => {
            this.errorHandler(error);
        });

        this.gsClient.on('error', (error: any) => {
            this.errorHandler(error);
        });
    }

    /**@private? */
    errorHandler(error: { status?: number }) {
        if (this.config.oauthInit && error.status === 401) {
            this.invalidateSession();
        }

        this.emitBuffer('error', error);
    }

    changeWithCredentialsConfig(withCredentials: boolean) {
        this.config.withCredentials = withCredentials;
    }

    changeCsrfConfig(disableCsrf: boolean) {
        this.config.disableCsrf = disableCsrf;
        this.processAuth.changeCsrfConfig(disableCsrf);
    }

    changeEcmHost(hostEcm: string) {
        this.config.hostEcm = hostEcm;
        this.contentAuth.changeHost();
        this.contentClient.changeHost();
        this.authClient.changeHost();
    }

    changeBpmHost(hostBpm: string) {
        this.config.hostBpm = hostBpm;
        this.processAuth.changeHost();
        this.processClient.changeHost();
    }

    /**
     * login Alfresco API
     *
     * @param  username Username to login
     * @param  password Password to login
     * @returns A promise that returns {new authentication ticket} if resolved and {error} if rejected.
     */
    login(username: string, password: string): Promise<any> {
        if (!this.isCredentialValid(username) || !this.isCredentialValid(password)) {
            return Promise.reject(new Error('missing username or password'));
        }

        if (username) {
            username = username.trim();
        }

        this.username = username;

        if (this.isOauthConfiguration()) {
            const promise = this.oauth2Auth.login(username, password);
            promise.then((accessToken) => {
                this.config.accessToken = accessToken;
            });
            return promise;
        } else {
            if (this.isBpmConfiguration()) {
                const promise = this.processAuth.login(username, password);
                promise.then((ticketBpm) => {
                    this.config.ticketBpm = ticketBpm;
                });
                return promise;
            } else if (this.isEcmConfiguration()) {
                const promise = this.contentAuth.login(username, password);
                promise.then((ticketEcm) => {
                    this.setAuthenticationClientECMBPM(this.contentAuth.getAuthentication(), null);
                    this.config.ticketEcm = ticketEcm;
                });
                return promise;
            } else if (this.isEcmBpmConfiguration()) {
                const contentProcessPromise = this.loginBPMECM(username, password);

                contentProcessPromise.then((data) => {
                    this.config.ticketEcm = data[0];
                    this.config.ticketBpm = data[1];
                });

                return contentProcessPromise;
            } else {
                return Promise.reject(new Error('Unknown configuration'));
            }
        }
    }

    isCredentialValid(credential: string): boolean {
        return credential !== undefined && credential !== null && credential !== '';
    }

    implicitLogin(): Promise<any> {
        if (!this.isOauthConfiguration()) {
            return Promise.reject(new Error('Missing the required oauth2 configuration'));
        }

        return new Promise(() => {
            this.oauth2Auth.implicitLogin();
        });
    }

    setAuthenticationClientECMBPM(authECM: Authentication, authBPM: Authentication) {
        this.contentClient.setAuthentications(authECM);
        this.authClient.setAuthentications(authECM);
        this.searchClient.setAuthentications(authECM);
        this.contentPrivateClient.setAuthentications(authECM);
        this.processClient.setAuthentications(authBPM);
        this.searchClient.setAuthentications(authECM);
        this.discoveryClient.setAuthentications(authECM);
        this.gsClient.setAuthentications(authECM);
    }

    /**
     * login Tickets
     *
     * @param ticketEcm alfresco ticket
     * @param ticketBpm alfresco ticket
     */
    loginTicket(ticketEcm: string, ticketBpm: string): Promise<string> {
        this.config.ticketEcm = ticketEcm;
        this.config.ticketBpm = ticketBpm;

        return this.contentAuth.validateTicket();
    }

    private loginBPMECM(username: string, password: string): Promise<[string, string]> {
        const contentPromise = this.contentAuth.login(username, password);
        const processPromise = this.processAuth.login(username, password);

        const promise: any = new Promise<[string, string]>((resolve, reject) => {
            Promise.all([contentPromise, processPromise]).then(
                (data) => {
                    promise.emit('success');
                    resolve(data);
                },
                (error) => {
                    this.contentAuth.invalidateSession();
                    this.processAuth.invalidateSession();

                    if (error.status === 401) {
                        promise.emit('unauthorized');
                    }
                    promise.emit('error');
                    reject(error);
                }
            );
        });

        ee(promise); // jshint ignore:line
        return promise;
    }

    /**
     * logout Alfresco API
     */
    logout(): Promise<void> {
        this.username = null;

        if (this.isOauthConfiguration()) {
            return this.oauth2Auth.logOut();
        }

        if (this.isBpmConfiguration()) {
            return this.processAuth.logout();
        }

        if (this.isEcmConfiguration()) {
            const contentPromise = this.contentAuth.logout();
            contentPromise.then(
                () => (this.config.ticket = undefined),
                () => {}
            );
            return contentPromise;
        }

        if (this.isEcmBpmConfiguration()) {
            return this._logoutBPMECM();
        }

        return Promise.resolve();
    }

    private _logoutBPMECM(): Promise<void> {
        const contentPromise = this.contentAuth.logout();
        const processPromise = this.processAuth.logout();

        const promise: any = new Promise<void>((resolve, reject) => {
            Promise.all([contentPromise, processPromise]).then(
                () => {
                    this.config.ticket = undefined;
                    promise.emit('logout');
                    resolve();
                },
                (error) => {
                    if (error.status === 401) {
                        promise.emit('unauthorized');
                    }
                    promise.emit('error');
                    reject(error);
                }
            );
        });

        ee(promise); // jshint ignore:line
        return promise;
    }

    /**
     * If the client is logged in return true
     */
    isLoggedIn(): boolean {
        if (this.isOauthConfiguration()) {
            return this.oauth2Auth.isLoggedIn();
        }

        if (this.isBpmConfiguration()) {
            return this.processAuth.isLoggedIn();
        }

        if (this.isEcmConfiguration()) {
            return this.config.withCredentials ? true : this.contentAuth.isLoggedIn();
        }

        if (this.isEcmBpmConfiguration()) {
            return this.config.withCredentials ? true : this.contentAuth.isLoggedIn() && this.processAuth.isLoggedIn();
        }

        return false;
    }

    isBpmLoggedIn(): boolean {
        if (this.isBpmConfiguration() || this.isEcmBpmConfiguration()) {
            if (this.isOauthConfiguration()) {
                return this.oauth2Auth.isLoggedIn();
            } else {
                return this.processAuth.isLoggedIn();
            }
        }
        return false;
    }

    isEcmLoggedIn(): boolean {
        if (this.isEcmConfiguration() || this.isEcmBpmConfiguration()) {
            if (this.isOauthConfiguration()) {
                return this.oauth2Auth.isLoggedIn();
            } else {
                return this.config.withCredentials ? true : this.contentAuth.isLoggedIn();
            }
        }
        return false;
    }

    getBpmUsername(): string {
        if (this.isOauthConfiguration()) {
            return this.username || this.oauth2Auth.storage.getItem('USERNAME');
        } else {
            return this.username || this.processAuth.storage.getItem('APS_USERNAME');
        }
    }

    getEcmUsername(): string {
        if (this.isOauthConfiguration()) {
            return this.username || this.oauth2Auth.storage.getItem('USERNAME');
        } else {
            return this.username || this.contentAuth.storage.getItem('ACS_USERNAME');
        }
    }

    /**
     * refresh token
     */
    refreshToken(): Promise<any> {
        if (!this.isOauthConfiguration()) {
            return Promise.reject(new Error('Missing the required oauth2 configuration'));
        }

        if (this.config.oauth2.implicitFlow) {
            return Promise.reject(new Error('Manual refresh token not possible in implicit flow'));
        }

        return this.oauth2Auth.refreshToken();
    }

    getTicketAuth(): string {
        return this.oauth2Auth?.getToken();
    }

    /**
     * Set the current Ticket
     *
     * @param ticketEcm ecm ticket
     * @param ticketBpm bpm ticket
     */
    setTicket(ticketEcm: string, ticketBpm: string) {
        if (this.contentAuth) {
            this.contentAuth.setTicket(ticketEcm);
        }
        if (this.processAuth) {
            this.processAuth.setTicket(ticketBpm);
        }
    }

    /**
     * invalidate the current session
     */
    invalidateSession() {
        if (this.oauth2Auth) {
            this.oauth2Auth.invalidateSession();
        } else {
            this.contentAuth.invalidateSession();
            this.processAuth.invalidateSession();
        }
    }

    /**
     * Get the current Ticket for the Bpm
     */
    getTicketBpm(): string {
        return this.processAuth?.getTicket();
    }

    /**
     * Get the current Ticket for the Ecm
     */
    getTicketEcm(): string {
        return this.contentAuth?.getTicket();
    }

    /**
     * Get the current Ticket for the Ecm and BPM
     */
    getTicket(): [string, string] {
        return [this.contentAuth.getTicket(), this.processAuth.getTicket()];
    }

    isBpmConfiguration(): boolean {
        return this.config.provider && this.config.provider.toUpperCase() === 'BPM';
    }

    isEcmConfiguration(): boolean {
        return this.config.provider && this.config.provider.toUpperCase() === 'ECM';
    }

    isOauthConfiguration(): boolean {
        return this.config.authType === 'OAUTH';
    }

    isPublicUrl(): boolean {
        if (this.isOauthConfiguration()) {
            return this.oauth2Auth.isPublicUrl();
        }
        return false;
    }

    isEcmBpmConfiguration(): boolean {
        return this.config.provider && this.config.provider.toUpperCase() === 'ALL';
    }

    private emitBuffer(event: string, callback?: any): void {
        this.emit(event, callback);
        this.bufferEvents.push(event);
    }

    reply(event: string, callback?: any): void {
        if (this.bufferEvents.indexOf(event) >= 0) {
            // eslint-disable-next-line prefer-rest-params
            Function.prototype.apply.call(callback, this, arguments);
        } else {
            this.on(event, callback);
        }
    }
}
