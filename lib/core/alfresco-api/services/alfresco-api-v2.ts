/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

/*tslint:disable*/ // => because of ADF file naming problems... Try to remove it, if you don't believe me :P
/* eslint-disable */

import { AlfrescoApiConfig } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { JsApiHttpClient } from '../js-api/js-api-http-client';
import { JsApiAngularHttpClient } from './js-api-angular-http-client';
import { HttpClient } from '@angular/common/http';
import { AlfrescoApiType, LegacyTicketApi } from '../js-api/alfresco-api-type';

@Injectable()
export class AlfrescoApiV2 implements AlfrescoApiType {
    public config: AlfrescoApiConfig;
    public contentPrivateClient: JsApiHttpClient & LegacyTicketApi;
    public contentClient: JsApiHttpClient & LegacyTicketApi;
    public authClient: JsApiHttpClient;
    public searchClient: JsApiHttpClient;
    public discoveryClient: JsApiHttpClient;
    public gsClient: JsApiHttpClient;
    public processClient: JsApiHttpClient;

    constructor(
        private httpClient: HttpClient
    ) {}

    init(config: AlfrescoApiConfig) {
        this.config = config;

        this.contentPrivateClient = new JsApiAngularHttpClient(
            config.hostEcm,
            config.contextRoot,
            `/api/${config.tenant}/private/alfresco/versions/1`,
            this.httpClient
        ) as unknown as JsApiHttpClient & LegacyTicketApi;

        this.contentClient = new JsApiAngularHttpClient(
            config.hostEcm,
            config.contextRoot,
            `/api/${config.tenant}/public/alfresco/versions/1`,
            this.httpClient
        ) as unknown as JsApiHttpClient & LegacyTicketApi;

        this.authClient = new JsApiAngularHttpClient(
            config.hostEcm,
            config.contextRoot,
            `/api/${config.tenant}/public/authentication/versions/1`,
            this.httpClient
        );

        this.searchClient = new JsApiAngularHttpClient(
            config.hostEcm,
            config.contextRoot,
            `/api/${config.tenant}/public/search/versions/1`,
            this.httpClient
        );
        this.discoveryClient = new JsApiAngularHttpClient(
            config.hostEcm,
            config.contextRoot,
            `/api`,
            this.httpClient
        );

        this.gsClient = new JsApiAngularHttpClient(
            config.hostEcm,
            config.contextRoot,
            `/api/${config.tenant}/public/gs/versions/1`,
            this.httpClient
        );

        this.processClient = new JsApiAngularHttpClient(
            config.hostBpm,
            config.contextRootBpm,
            '',
            this.httpClient
        );
    }

    setConfig(config: AlfrescoApiConfig) {
        this.config = config;
    }

    changeWithCredentialsConfig(withCredentials: boolean) {
        console.log(withCredentials);
        debugger;
        return false;
    }

    changeCsrfConfig(disableCsrf: boolean) {
        console.log(disableCsrf);
        debugger;
    }

    changeEcmHost(hostEcm: string) {
        console.log(hostEcm);
        debugger;
    }

    changeBpmHost(hostBpm: string) {
        console.log(hostBpm);
        debugger;
    }

    login(username: string, password: string) {
        console.log(username, password);
        debugger;
        return Promise.reject();
    }

    isCredentialValid(credential: string) {
        console.log(credential);
        debugger;
        return false;
    }

    implicitLogin() {
        debugger;
        return Promise.reject();
    }

    loginTicket(ticketEcm: string, ticketBpm: string) {
        console.log(ticketEcm, ticketBpm);
        debugger;
        return Promise.reject();
    }

    logout() {
        debugger;
        return Promise.resolve();
    }

    isLoggedIn() {
        debugger;
        return false;
    }

    isBpmLoggedIn() {
        debugger;
        return false;
    }

    isEcmLoggedIn() {
        debugger;
        return false;
    }

    getBpmUsername() {
        debugger;
        return 'Kakarot';
    }

    getEcmUsername() {
        debugger;
        return 'Vegeta';
    }

    refreshToken() {
        debugger;
        return Promise.reject();
    }

    getTicketAuth() {
        debugger;
        return 'xyz-123';
    }

    setTicket(ticketEcm: string, TicketBpm: string) {
        console.log(ticketEcm, TicketBpm);
        debugger;
    }

    invalidateSession() {
        debugger;
    }

    getTicketBpm() {
        debugger;
        return 'xyz-456';
    }

    getTicketEcm() {
        debugger;
        return 'xyz-789';
    }

    getTicket() {
        debugger;
        return ['xyz-000'];
    }

    isBpmConfiguration() {
        debugger;
        return false;
    }

    isEcmConfiguration() {
        debugger;
        return false;
    }

    isOauthConfiguration() {
        debugger;
        return false;
    }

    isPublicUrl() {
        debugger;
        return false;
    }

    isEcmBpmConfiguration() {
        debugger;
        return false;
    }

    reply(event: string, callback?: any) {
        console.log(event, callback);
        debugger;
    }
}
