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

import { AlfrescoApiConfig, AlfrescoApiType, HttpClient as JsApiHttpClient, LegacyAlfrescoApi, LegacyTicketApi } from "@alfresco/js-api";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseJsApiAngularHttpClient } from "./js-api-angular-http-client";
import { JsApiAngularHttpClientLegacyTicketApi } from "./js-api-angular-http-client-with-ticket";

@Injectable()
export class AlfrescoApiV2 extends LegacyAlfrescoApi implements AlfrescoApiType {
    public config: AlfrescoApiConfig;
    public contentPrivateClient: JsApiHttpClient & LegacyTicketApi;
    public contentClient: JsApiHttpClient & LegacyTicketApi;
    public authClient: JsApiHttpClient;
    public searchClient: JsApiHttpClient;
    public discoveryClient: JsApiHttpClient;
    public gsClient: JsApiHttpClient;
    public processClient: JsApiHttpClient;
    public processAuth: JsApiHttpClient;

    constructor(private httpClient: HttpClient) {
        super();
    }

    init(config: AlfrescoApiConfig) {
        this.config = config;

        this.contentPrivateClient = new JsApiAngularHttpClientLegacyTicketApi(
            {
                contextRoot: config.contextRoot,
                host: config.hostEcm,
                servicePath: `/api/${config.tenant}/private/alfresco/versions/1`,

            },
            this.httpClient
        );

        this.contentClient = new JsApiAngularHttpClientLegacyTicketApi(
            {
                contextRoot: config.contextRoot,
                host: config.hostEcm,
                servicePath: `/api/${config.tenant}/public/alfresco/versions/1`,

            },
            this.httpClient
        );

        this.authClient = new BaseJsApiAngularHttpClient(
            {
                contextRoot: config.contextRoot,
                host: config.hostEcm,
                servicePath: `/api/${config.tenant}/public/authentication/versions/1`,

            },
            this.httpClient
        );

        this.searchClient = new BaseJsApiAngularHttpClient(
            {
                contextRoot: config.contextRoot,
                host: config.hostEcm,
                servicePath: `/api/${config.tenant}/public/search/versions/1`,

            },
            this.httpClient
        );
        this.discoveryClient = new BaseJsApiAngularHttpClient(
            {
                contextRoot: config.contextRoot,
                host: config.hostEcm,
                servicePath: `/api`,

            },
            this.httpClient
        );

        this.gsClient = new BaseJsApiAngularHttpClient(
            {
                contextRoot: config.contextRoot,
                host: config.hostEcm,
                servicePath: `/api/${config.tenant}/public/gs/versions/1`,

            },
            this.httpClient
        );

        this.processClient = new BaseJsApiAngularHttpClient(
            {
                contextRoot: config.contextRootBpm,
                host: config.hostBpm,
                servicePath: ``,
            },
            this.httpClient
        );
    }

    setConfig(config: AlfrescoApiConfig) {
        this.config = config;
    }

    changeWithCredentialsConfig(withCredentials: boolean) {
        console.log(withCredentials);
        return false;
    }

    changeCsrfConfig(disableCsrf: boolean) {
        console.log(disableCsrf);
    }

    changeEcmHost(hostEcm: string) {
        console.log(hostEcm);
    }

    changeBpmHost(hostBpm: string) {
        console.log(hostBpm);
    }

    login(username: string, password: string) {
        console.log(username, password);
        return Promise.reject();
    }

    isCredentialValid(credential: string) {
        console.log(credential);
        return false;
    }

    implicitLogin() {
        return Promise.reject();
    }

    loginTicket(ticketEcm: string, ticketBpm: string) {
        console.log(ticketEcm, ticketBpm);
        return Promise.reject();
    }

    logout() {
        return Promise.resolve();
    }

    isLoggedIn() {
        return false;
    }

    isBpmLoggedIn() {
        return false;
    }

    isEcmLoggedIn() {
        return false;
    }

    getBpmUsername() {
        return "Kakarot";
    }

    getEcmUsername() {
        return "Vegeta";
    }

    refreshToken() {
        return Promise.reject();
    }

    getTicketAuth() {
        return "xyz-123";
    }

    setTicket(ticketEcm: string, TicketBpm: string) {
        console.log(ticketEcm, TicketBpm);
    }

    invalidateSession() { }

    getTicketBpm() {
        return "xyz-456";
    }

    getTicketEcm() {
        return "xyz-789";
    }

    getTicket() {
        return ["xyz-000"];
    }

    isBpmConfiguration() {
        return false;
    }

    isEcmConfiguration() {
        return false;
    }

    isOauthConfiguration() {
        return false;
    }

    isPublicUrl() {
        return false;
    }

    isEcmBpmConfiguration() {
        return false;
    }

    reply(event: string, callback?: any) {
        console.log(event, callback);
    }
}
