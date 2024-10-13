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

import { Injectable } from '@angular/core';
import { AdfHttpClient } from '@alfresco/adf-core/api';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { StorageService } from '../../common/services/storage.service';
import { ReplaySubject, Subject } from 'rxjs';
import { Authentication } from '../interfaces/authentication.interface';

export interface TicketBody {
    userId?: string;
    password?: string;
}

export interface TicketEntry {
    entry: {
        id?: string;
        userId?: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class ContentAuth {
    onLogin = new ReplaySubject<any>(1);
    onLogout = new ReplaySubject<any>(1);
    onError = new Subject<any>();

    ticket: string;
    config = {
        ticketEcm: null
    };

    authentications: Authentication = {
        basicAuth: {
            ticket: ''
        },
        type: 'basic'
    };

    get basePath(): string {
        const contextRootEcm = this.appConfigService.get<string>(AppConfigValues.CONTEXTROOTECM) || 'alfresco';
        return this.appConfigService.get<string>(AppConfigValues.ECMHOST) + '/' + contextRootEcm + '/api/-default-/public/authentication/versions/1';
    }

    constructor(private appConfigService: AppConfigService, private adfHttpClient: AdfHttpClient, private storageService: StorageService) {
        this.appConfigService.onLoad.subscribe(() => {
            this.setConfig();
        });
    }

    private setConfig() {
        if (this.storageService.getItem(AppConfigValues.CONTENT_TICKET_STORAGE_LABEL)) {
            this.setTicket(this.storageService.getItem(AppConfigValues.CONTENT_TICKET_STORAGE_LABEL));
        }
    }

    saveUsername(username: string) {
        this.storageService.setItem('ACS_USERNAME', username);
    }

    getUsername() {
        return this.storageService.getItem('ACS_USERNAME');
    }

    /**
     * login Alfresco API
     * @param username username to login
     * @param password password to login
     * @returns A promise that returns {new authentication ticket} if resolved and {error} if rejected.
     */
    login(username: string, password: string): Promise<any> {
        this.authentications.basicAuth.username = username;
        this.authentications.basicAuth.password = password;

        const loginRequest: any = {};

        loginRequest.userId = this.authentications.basicAuth.username;
        loginRequest.password = this.authentications.basicAuth.password;

        return new Promise((resolve, reject) => {
            this.createTicket(loginRequest)
                .then((data: any) => {
                    this.saveUsername(username);
                    this.setTicket(data.entry.id);
                    this.adfHttpClient.emit('success');
                    this.onLogin.next('success');
                    resolve(data.entry.id);
                })
                .catch((error) => {
                    this.saveUsername('');
                    if (error.status === 401) {
                        this.adfHttpClient.emit('unauthorized', error);
                        this.onError.next('unauthorized');
                    } else if (error.status === 403) {
                        this.adfHttpClient.emit('forbidden', error);
                        this.onError.next('forbidden');
                    } else {
                        this.adfHttpClient.emit('error', error);
                        this.onError.next('error');
                    }
                    reject(error);
                });
        });
    }

    /**
     * logout Alfresco API
     * @returns A promise that returns { authentication ticket} if resolved and {error} if rejected.
     */
    logout(): Promise<any> {
        this.saveUsername('');
        return new Promise((resolve, reject) => {
            this.deleteTicket().then(
                () => {
                    this.invalidateSession();
                    this.adfHttpClient.emit('logout');
                    this.onLogout.next('logout');
                    resolve('logout');
                },
                (error) => {
                    if (error.status === 401) {
                        this.adfHttpClient.emit('unauthorized');
                        this.onError.next('unauthorized');
                    }
                    this.adfHttpClient.emit('error');
                    this.onError.next('error');
                    reject(error);
                }
            );
        });
    }

    /**
     * Set the current Ticket
     * @param ticket a string representing the ticket
     */
    setTicket(ticket: string) {
        this.authentications.basicAuth.username = 'ROLE_TICKET';
        this.authentications.basicAuth.password = ticket;
        this.config.ticketEcm = ticket;
        this.storageService.setItem(AppConfigValues.CONTENT_TICKET_STORAGE_LABEL, ticket);
        this.ticket = ticket;
    }

    /**
     * @returns the current Ticket
     */
    getToken(): string {
        if (!this.ticket) {
            this.onError.next('error');
        }

        return this.ticket;
    }

    invalidateSession() {
        this.storageService.removeItem(AppConfigValues.CONTENT_TICKET_STORAGE_LABEL);
        this.authentications.basicAuth.username = null;
        this.authentications.basicAuth.password = null;
        this.config.ticketEcm = null;
        this.ticket = null;
    }

    /**
     * @returns If the client is logged in return true
     */
    isLoggedIn(): boolean {
        return !!this.ticket;
    }

    /**
     * @returns return the Authentication
     */
    getAuthentication() {
        return this.authentications;
    }

    createTicket(ticketBodyCreate: TicketBody): Promise<TicketEntry> {
        if (ticketBodyCreate === null || ticketBodyCreate === undefined) {
            this.onError.next(`Missing param ticketBodyCreate`);

            throw new Error(`Missing param ticketBodyCreate`);
        }

        return this.adfHttpClient.post(this.basePath + '/tickets', { bodyParam: ticketBodyCreate });
    }

    async requireAlfTicket(): Promise<void> {
        const ticket = await this.adfHttpClient.get(this.basePath + '/tickets/-me-');
        this.setTicket(ticket.entry.id);
    }

    deleteTicket(): Promise<any> {
        return this.adfHttpClient.delete(this.basePath + '/tickets/-me-');
    }
}
