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

import { AlfrescoApiConfig } from '../alfrescoApiConfig';
import { LegacyHttpClient } from '../api-clients/http-client.interface';

export interface LegacyTicketApi {
    getAlfTicket(ticket: string): string;
}

// Extracted from existing AlfrescoApi:
export interface AlfrescoApiType {
    __type: string;
    config: AlfrescoApiConfig;
    contentClient: LegacyHttpClient & LegacyTicketApi;
    contentPrivateClient: LegacyHttpClient & LegacyTicketApi;
    processClient: LegacyHttpClient;
    searchClient: LegacyHttpClient;
    discoveryClient: LegacyHttpClient;
    gsClient: LegacyHttpClient;
    authClient: LegacyHttpClient;
    processAuth: LegacyHttpClient;

    setConfig(config: AlfrescoApiConfig): void;
    changeWithCredentialsConfig(withCredentials: boolean): void;
    changeCsrfConfig(disableCsrf: boolean): void;
    changeEcmHost(hostEcm: string): void;
    changeBpmHost(hostBpm: string): void;
    login(username: string, password: string): Promise<any>;
    isCredentialValid(credential: string): boolean;
    implicitLogin(): Promise<any>;
    loginTicket(ticketEcm: string, ticketBpm: string): Promise<any>;
    logout(): Promise<any>;
    isLoggedIn(): boolean;
    isBpmLoggedIn(): boolean;
    isEcmLoggedIn(): boolean;
    getBpmUsername(): string;
    getEcmUsername(): string;
    refreshToken(): Promise<string>;
    getTicketAuth(): string;
    setTicket(ticketEcm: string, TicketBpm: string): void;
    invalidateSession(): void;
    getTicketBpm(): string;
    getTicketEcm(): string;
    getTicket(): string[];
    isBpmConfiguration(): boolean;
    isEcmConfiguration(): boolean;
    isOauthConfiguration(): boolean;
    isPublicUrl(): boolean;
    isEcmBpmConfiguration(): boolean;
    reply(event: string, callback?: any): void;
}
