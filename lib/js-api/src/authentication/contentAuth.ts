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
import { AuthenticationApi, TicketBody } from '../api/auth-rest-api';
import { AlfrescoApiClient } from '../alfrescoApiClient';
import { AlfrescoApiConfig } from '../alfrescoApiConfig';
import { Authentication } from './authentication';
import { Storage } from '../storage';
import { AlfrescoApiType } from '../to-deprecate/alfresco-api-type';
import { HttpClient } from '../api-clients/http-client.interface';

export class ContentAuth extends AlfrescoApiClient {
    ticketStorageLabel: string;
    ticket: string;

    authApi: AuthenticationApi;

    constructor(config: AlfrescoApiConfig, alfrescoApi: AlfrescoApiType, httpClient?: HttpClient) {
        super(undefined, httpClient);
        this.className = 'ContentAuth';
        this.storage = Storage.getInstance();
        this.storage.setDomainPrefix(config.domainPrefix);

        this.setConfig(config);

        this.authApi = new AuthenticationApi(alfrescoApi);
    }

    setConfig(config: AlfrescoApiConfig) {
        this.config = config;

        this.basePath = this.config.hostEcm + '/' + this.config.contextRoot + '/api/-default-/public/authentication/versions/1'; //Auth Call

        this.ticketStorageLabel = 'ticket-ECM';

        if (this.config.ticketEcm) {
            this.setTicket(config.ticketEcm);
        } else if (this.storage.getItem(this.ticketStorageLabel)) {
            this.setTicket(this.storage.getItem(this.ticketStorageLabel));
        }
    }

    changeHost() {
        this.basePath = this.config.hostEcm + '/' + this.config.contextRoot + '/api/-default-/public/authentication/versions/1'; //Auth Call
        this.ticket = undefined;
    }

    saveUsername(username: string) {
        if (this.storage.supportsStorage()) {
            this.storage.setItem('ACS_USERNAME', username);
        }
    }

    /**
     * login Alfresco API
     * @param  username Username to login
     * @param  password Password to login
     * @returns A promise that returns {new authentication ticket} if resolved and {error} if rejected.
     */
    login(username: string, password: string): Promise<string> {
        this.authentications.basicAuth.username = username;
        this.authentications.basicAuth.password = password;

        const loginRequest = new TicketBody({
            userId: this.authentications.basicAuth.username,
            password: this.authentications.basicAuth.password
        });

        const promise: any = new Promise<string>((resolve, reject) => {
            this.authApi
                .createTicket(loginRequest)
                .then((data) => {
                    this.saveUsername(username);
                    this.setTicket(data.entry.id);
                    promise.emit('success');
                    this.emit('logged-in');
                    resolve(data.entry.id);
                })
                .catch((error) => {
                    this.saveUsername('');
                    if (error.status === 401) {
                        promise.emit('unauthorized');
                    } else if (error.status === 403) {
                        promise.emit('forbidden');
                    } else {
                        promise.emit('error');
                    }
                    reject(error);
                });
        });

        ee(promise); // jshint ignore:line
        return promise;
    }

    /**
     * validate the ticket present in this.config.ticket against the server
     * @returns A promise that returns  if resolved and {error} if rejected.
     */
    validateTicket(): Promise<string> {
        this.setTicket(this.config.ticketEcm);

        const promise: any = new Promise<string>((resolve, reject) => {
            this.authApi.validateTicket().then(
                (data) => {
                    this.setTicket(data.entry.id);
                    promise.emit('success');
                    this.emit('logged-in');
                    resolve(data.entry.id);
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
     * logout Alfresco API
     * @returns A promise that returns { authentication ticket} if resolved and {error} if rejected.
     */
    logout(): Promise<void> {
        this.saveUsername('');
        const promise: any = new Promise<void>((resolve, reject) => {
            this.authApi.deleteTicket().then(
                () => {
                    promise.emit('logout');
                    this.invalidateSession();
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
     * Set the current Ticket
     */
    setTicket(ticket: string) {
        this.authentications.basicAuth.username = 'ROLE_TICKET';
        this.authentications.basicAuth.password = ticket;
        this.config.ticketEcm = ticket;
        this.storage.setItem(this.ticketStorageLabel, ticket);
        this.ticket = ticket;
    }

    /**
     * Get the current Ticket
     * @returns ticket value
     */
    getTicket(): string {
        return this.ticket;
    }

    invalidateSession() {
        this.storage.removeItem(this.ticketStorageLabel);
        this.authentications.basicAuth.username = null;
        this.authentications.basicAuth.password = null;
        this.config.ticketEcm = null;
        this.ticket = null;
    }

    /**
     * If the client is logged in return true
     * @returns `true` if client is logged in, otherwise `false`
     */
    isLoggedIn(): boolean {
        return !!this.ticket;
    }

    /**
     * return the Authentication
     * @returns authentication object
     */
    getAuthentication(): Authentication {
        return this.authentications;
    }
}
