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

import { StorageService } from '@alfresco/adf-core/storage';
import { Injectable } from '@angular/core';
import { Node, AlfrescoApi, AlfrescoApiConfig } from '@alfresco/js-api';
import { AppConfigService } from '../app-config/app-config.service';
import { Subject, ReplaySubject } from 'rxjs';
import { OpenidConfiguration } from './openid-configuration.interface';


@Injectable({
    providedIn: 'root'
})
export class AlfrescoApiService {
    nodeUpdated = new Subject<Node>();
    alfrescoApiInitialized: ReplaySubject<boolean> = new ReplaySubject(1);
    lastConfig: AlfrescoApiConfig;
    currentAppConfig: AlfrescoApiConfig;
    idpConfig: OpenidConfiguration;

    protected alfrescoApi: AlfrescoApi;
    private excludedErrorUrl: string[] = ['api/enterprise/system/properties'];

    getInstance(): AlfrescoApi {
        return this.alfrescoApi;
    }

    constructor(
        protected appConfig: AppConfigService,
        protected storageService: StorageService
    ) {}

    async init(config: AlfrescoApiConfig): Promise<void> {
        this.currentAppConfig = config;

        if (config.authType === 'OAUTH') {
            this.updateOauth2Config();
        }

        this.initAlfrescoApiWithConfig(config);
        this.alfrescoApiInitialized.next(true);
    }

    async reset() {
        if (this.currentAppConfig.authType === 'OAUTH') {
            this.updateOauth2Config();
        }
        this.initAlfrescoApiWithConfig(this.currentAppConfig);
    }

    private async updateOauth2Config() {
        this.idpConfig = await this.appConfig.loadWellKnown(this.currentAppConfig.oauth2.host);
        this.currentAppConfig.oauth2.tokenUrl = this.idpConfig.token_endpoint;
        this.currentAppConfig.oauth2.authorizationUrl = this.idpConfig.authorization_endpoint;
        this.currentAppConfig.oauth2.logoutUrl = this.idpConfig.end_session_endpoint;
        this.currentAppConfig.oauth2.userinfoEndpoint = this.idpConfig.userinfo_endpoint;
    }

    private initAlfrescoApiWithConfig(config: AlfrescoApiConfig) {
        if (this.alfrescoApi && this.isDifferentConfig(this.lastConfig, config)) {
            this.alfrescoApi.setConfig(config);
        } else {
            this.alfrescoApi = this.createInstance(config);
        }
        this.lastConfig = config;
    }

    createInstance(config: AlfrescoApiConfig): AlfrescoApi {
        return this.alfrescoApi = new AlfrescoApi(config);
    }

    isDifferentConfig(lastConfig: AlfrescoApiConfig, newConfig: AlfrescoApiConfig) {
        return JSON.stringify(lastConfig) !== JSON.stringify(newConfig);
    }

    isExcludedErrorListener(currentFullPath: string): boolean {
        const formattedPath = currentFullPath.replace(this.lastConfig.hostBpm + '/' + this.lastConfig.contextRootBpm, '');
        return this.excludedErrorUrl.includes(formattedPath);
    }
}
