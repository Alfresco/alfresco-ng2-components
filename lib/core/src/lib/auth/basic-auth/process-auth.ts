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
import { Authentication } from '../interfaces/authentication.interface';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { StorageService } from '../../common/services/storage.service';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProcessAuth {
    onLogin = new ReplaySubject<any>(1);
    onLogout = new ReplaySubject<any>(1);
    onError = new Subject<any>();

    ticket: string;
    config = {
        ticketBpm: null
    };

    authentications: Authentication = {
        basicAuth: { ticket: '' },
        type: 'activiti'
    };

    get basePath(): string {
        const contextRootBpm = this.appConfigService.get<string>(AppConfigValues.CONTEXTROOTBPM) || 'activiti-app';
        return this.appConfigService.get<string>(AppConfigValues.BPMHOST) + '/' + contextRootBpm;
    }

    constructor(private appConfigService: AppConfigService, private adfHttpClient: AdfHttpClient, private storageService: StorageService) {
        this.appConfigService.onLoad.subscribe(() => {
            this.setConfig();
        });
    }

    private setConfig() {
        this.ticket = undefined;

        this.setTicket(this.storageService.getItem(AppConfigValues.PROCESS_TICKET_STORAGE_LABEL));
    }

    saveUsername(username: string) {
        this.storageService.setItem('APS_USERNAME', username);
    }

    getUsername() {
        return this.storageService.getItem('APS_USERNAME');
    }

    /**
     * login Activiti API
     * @param username Username to login
     * @param password Password to login
     * @returns A promise that returns {new authentication ticket} if resolved and {error} if rejected.
     */
    login(username: string, password: string): Promise<any> {
        this.authentications.basicAuth.username = username;
        this.authentications.basicAuth.password = password;

        const options = {
            headerParams: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache'
            },
            formParams: {
                j_username: this.authentications.basicAuth.username,
                j_password: this.authentications.basicAuth.password,
                _spring_security_remember_me: true,
                submit: 'Login'
            },
            contentType: 'application/x-www-form-urlencoded',
            accept: 'application/json'
        };

        const promise: any = new Promise((resolve, reject) => {
            this.adfHttpClient.post(this.basePath + '/app/authentication', options).then(
                () => {
                    this.saveUsername(username);
                    const ticket = this.basicAuth(this.authentications.basicAuth.username, this.authentications.basicAuth.password);
                    this.setTicket(ticket);
                    this.onLogin.next('success');
                    this.adfHttpClient.emit('success');
                    this.adfHttpClient.emit('logged-in');
                    resolve(ticket);
                },
                (error) => {
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
                }
            );
        });

        return promise;
    }

    /**
     * logout Alfresco API
     * @returns A promise that returns {new authentication ticket} if resolved and {error} if rejected.
     */
    async logout(): Promise<any> {
        this.saveUsername('');
        return new Promise((resolve, reject) => {
            this.adfHttpClient.get(this.basePath + `/app/logout`, {}).then(
                () => {
                    this.invalidateSession();
                    this.onLogout.next('logout');
                    this.adfHttpClient.emit('logout');
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

    basicAuth(username: string, password: string): string {
        const str: any = username + ':' + password;

        let base64;

        if (typeof Buffer === 'function') {
            base64 = Buffer.from(str.toString(), 'binary').toString('base64');
        } else {
            base64 = btoa(str);
        }

        return `Basic ${base64}`;
    }

    /**
     * Set the current Ticket
     * @param ticket a string representing the ticket
     */
    setTicket(ticket: string) {
        if (ticket && ticket !== 'null') {
            this.authentications.basicAuth.ticket = ticket;
            this.authentications.basicAuth.password = null;
            this.config.ticketBpm = ticket;
            this.storageService.setItem(AppConfigValues.PROCESS_TICKET_STORAGE_LABEL, ticket);
            this.ticket = ticket;
        }
    }

    invalidateSession() {
        this.storageService.removeItem(AppConfigValues.PROCESS_TICKET_STORAGE_LABEL);
        this.authentications.basicAuth.ticket = null;
        this.authentications.basicAuth.password = null;
        this.authentications.basicAuth.username = null;
        this.config.ticketBpm = null;
        this.ticket = null;
    }

    /**
     * @returns the current Ticket
     */
    getToken(): string {
        if (!this.ticket) {
            this.onError.next('error');
            return null;
        }

        return this.ticket;
    }

    /**
     * @returns If the client is logged in return true
     */
    isLoggedIn(): boolean {
        return !!this.ticket;
    }
}
