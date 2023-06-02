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

import { Injectable } from '@angular/core';
import { AlfrescoApi, AlfrescoApiConfig } from '@alfresco/js-api';
import { AppConfigService, AppConfigValues } from '../app-config/app-config.service';
import { ReplaySubject } from 'rxjs';
import { OauthConfigModel } from '../auth/models/oauth-config.model';
import { StorageService } from '../common/services/storage.service';
import { OpenidConfiguration } from '../auth/interfaces/openid-configuration.interface';

@Injectable({
    providedIn: 'root'
})
export class AlfrescoApiService {

    alfrescoApiInitialized: ReplaySubject<boolean> = new ReplaySubject(1);

    protected alfrescoApi: AlfrescoApi;

    lastConfig: AlfrescoApiConfig;
    currentAppConfig: AlfrescoApiConfig;

    idpConfig: OpenidConfiguration;

    private excludedErrorUrl: string[] = ['api/enterprise/system/properties'];

    getInstance(): AlfrescoApi {
        return this.alfrescoApi;
    }

    constructor(protected appConfig: AppConfigService, protected storageService: StorageService) {}

    async load(config: AlfrescoApiConfig): Promise<void> {
        this.currentAppConfig = config;

        if (config.authType === 'OAUTH') {
                await this.mapAlfrescoApiOpenIdConfig();
        }

        this.initAlfrescoApiWithConfig();
        this.alfrescoApiInitialized.next(true);
    }

    async reset() {
        this.getCurrentAppConfig();
        if (this.currentAppConfig.authType === 'OAUTH') {
            await this.mapAlfrescoApiOpenIdConfig();
        }
        this.initAlfrescoApiWithConfig();
    }

    private getAuthWithFixedOriginLocation(): OauthConfigModel {
        const oauth = this.appConfig.oauth2;

        if (oauth) {
            oauth.redirectUri = window.location.origin + window.location.pathname;
            oauth.redirectUriLogout = window.location.origin + window.location.pathname;
        }
        return oauth;
    }

    private async mapAlfrescoApiOpenIdConfig() {
        this.idpConfig = await this.appConfig.loadWellKnown(this.currentAppConfig.oauth2.host);
        this.currentAppConfig.oauth2.tokenUrl = this.idpConfig.token_endpoint;
        this.currentAppConfig.oauth2.authorizationUrl = this.idpConfig.authorization_endpoint;
        this.currentAppConfig.oauth2.logoutUrl = this.idpConfig.end_session_endpoint;
        this.currentAppConfig.oauth2.userinfoEndpoint = this.idpConfig.userinfo_endpoint;
    }

    private getCurrentAppConfig() {
        const oauth = this.getAuthWithFixedOriginLocation();

        this.currentAppConfig = new AlfrescoApiConfig({
            provider: this.appConfig.get<string>(AppConfigValues.PROVIDERS),
            hostEcm: this.appConfig.get<string>(AppConfigValues.ECMHOST),
            hostBpm: this.appConfig.get<string>(AppConfigValues.BPMHOST),
            authType: this.appConfig.get<string>(AppConfigValues.AUTHTYPE, 'BASIC'),
            contextRootBpm: this.appConfig.get<string>(AppConfigValues.CONTEXTROOTBPM),
            contextRoot: this.appConfig.get<string>(AppConfigValues.CONTEXTROOTECM),
            disableCsrf: this.appConfig.get<boolean>(AppConfigValues.DISABLECSRF),
            withCredentials: this.appConfig.get<boolean>(AppConfigValues.AUTH_WITH_CREDENTIALS, false),
            domainPrefix: this.appConfig.get<string>(AppConfigValues.STORAGE_PREFIX),
            oauth2: oauth
        });
    }

    protected initAlfrescoApi() {
        this.getCurrentAppConfig();
        this.initAlfrescoApiWithConfig();
    }

    private initAlfrescoApiWithConfig() {
        if (this.alfrescoApi && this.isDifferentConfig(this.lastConfig, this.currentAppConfig)) {
            this.alfrescoApi.setConfig(this.currentAppConfig);
        } else {
            this.alfrescoApi = this.createInstance(this.currentAppConfig);
        }
        this.lastConfig = this.currentAppConfig;
    }

    createInstance(config: AlfrescoApiConfig): AlfrescoApi {
        return new AlfrescoApi(config);
    }

    isDifferentConfig(lastConfig: AlfrescoApiConfig, newConfig: AlfrescoApiConfig) {
        return JSON.stringify(lastConfig) !== JSON.stringify(newConfig);
    }

    isExcludedErrorListener(currentFullPath: string): boolean {
        const formattedPath = currentFullPath.replace(this.lastConfig.hostBpm + '/' + this.lastConfig.contextRootBpm, '');
        return this.excludedErrorUrl.includes(formattedPath);
    }
}
