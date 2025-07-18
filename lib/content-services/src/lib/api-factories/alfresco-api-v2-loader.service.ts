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

import { AlfrescoApiConfig } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { AppConfigService, AppConfigValues, StorageService } from '@alfresco/adf-core';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { SecurityOptionsLoaderService } from '../security-options-loader/security-options-loader.service';

/**
 * Create a factory to resolve an api service instance
 *
 * @param angularAlfrescoApiService loader service
 * @returns factory function
 */
export function createAlfrescoApiInstance(angularAlfrescoApiService: AlfrescoApiLoaderService) {
    return () => angularAlfrescoApiService.init();
}

@Injectable({
    providedIn: 'root'
})
export class AlfrescoApiLoaderService {
    constructor(
        private readonly appConfig: AppConfigService,
        private readonly apiService: AlfrescoApiService,
        private readonly securityOptionsLoaderService: SecurityOptionsLoaderService,
        private storageService: StorageService
    ) {}

    async init(): Promise<any> {
        await this.appConfig.load(this.securityOptionsLoaderService.load);
        return this.initAngularAlfrescoApi();
    }

    private async initAngularAlfrescoApi() {
        const oauth = this.appConfig.oauth2;

        if (oauth) {
            oauth.redirectUri = window.location.origin + window.location.pathname;
            oauth.redirectUriLogout = window.location.origin + window.location.pathname;
        }

        const config = new AlfrescoApiConfig({
            provider: this.appConfig.get<string>(AppConfigValues.PROVIDERS),
            hostEcm: this.appConfig.get<string>(AppConfigValues.ECMHOST),
            hostBpm: this.appConfig.get<string>(AppConfigValues.BPMHOST),
            authType: this.appConfig.get<string>(AppConfigValues.AUTHTYPE, 'BASIC'),
            contextRootBpm: this.appConfig.get<string>(AppConfigValues.CONTEXTROOTBPM),
            contextRoot: this.appConfig.get<string>(AppConfigValues.CONTEXTROOTECM),
            disableCsrf: this.appConfig.get<boolean>(AppConfigValues.DISABLECSRF),
            withCredentials: this.appConfig.get<boolean>(AppConfigValues.AUTH_WITH_CREDENTIALS, false),
            domainPrefix: this.appConfig.get<string>(AppConfigValues.STORAGE_PREFIX),
            ticketEcm: this.storageService.getItem(AppConfigValues.CONTENT_TICKET_STORAGE_LABEL),
            ticketBpm: this.storageService.getItem(AppConfigValues.PROCESS_TICKET_STORAGE_LABEL),
            oauth2: oauth
        });

        await this.apiService.load(config);
    }
}
