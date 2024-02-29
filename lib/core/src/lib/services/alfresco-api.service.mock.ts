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

import { Inject, Injectable, Optional } from '@angular/core';
import { AppConfigService, AppConfigValues } from '../app-config/app-config.service';
import { StorageService } from '../common/services/storage.service';
import { AlfrescoApi, AlfrescoApiConfig } from '@alfresco/js-api';
import { ALFRESCO_API_FACTORY } from './alfresco-api.service';
import { AlfrescoApiFactory } from './alfresco-api.interface';
import { OauthConfigModel, OpenidConfiguration } from '../auth';
import { ReplaySubject } from 'rxjs';

/** @deprecated please use AlfrescoApiServiceMock from \@alfresco/adf-content-services */
@Injectable()
export class AlfrescoApiServiceMock {
    alfrescoApiInitialized: ReplaySubject<boolean> = new ReplaySubject(1);

    protected alfrescoApi: AlfrescoApi;

    lastConfig: AlfrescoApiConfig;
    currentAppConfig: AlfrescoApiConfig;

    idpConfig: OpenidConfiguration;

    private excludedErrorUrl: string[] = ['api/enterprise/system/properties'];

    getInstance(): AlfrescoApi {
        return this.alfrescoApi;
    }

    constructor(
        protected appConfig: AppConfigService,
        protected storageService: StorageService,
        @Optional()
        @Inject(ALFRESCO_API_FACTORY) private alfrescoApiFactory?: AlfrescoApiFactory
    ) {
        if (!this.alfrescoApi) {
            this.initAlfrescoApi();
        }
    }

    async load(config: AlfrescoApiConfig): Promise<void> {
        this.currentAppConfig = config;
        this.initAlfrescoApiWithConfig();
        this.alfrescoApiInitialized.next(true);
    }

    async reset() {
        this.setCurrentAppConfig();
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

    private setCurrentAppConfig() {
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
        this.setCurrentAppConfig();
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
        if (this.alfrescoApiFactory) {
            return this.alfrescoApiFactory.createAlfrescoApi(config);
        }
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
