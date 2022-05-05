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

import { Injectable } from '@angular/core';
import { Node, AlfrescoApi, AlfrescoApiConfig } from '@alfresco/js-api';
import { AppConfigService, AppConfigValues } from '../app-config/app-config.service';
import { Subject, ReplaySubject } from 'rxjs';
import { OauthConfigModel } from '../models/oauth-config.model';
import { StorageService } from './storage.service';
import { OpenidConfiguration } from '../models/openid-configuration.model';

@Injectable({
    providedIn: 'root'
})
export class AlfrescoApiService {
    /**
     * Publish/subscribe to events related to node updates.
     */
    nodeUpdated = new Subject<Node>();

    alfrescoApiInitialized: ReplaySubject<boolean> = new ReplaySubject(1);

    protected alfrescoApi: AlfrescoApi;

    lastConfig: AlfrescoApiConfig;

    idpConfig: OpenidConfiguration;
    currentAppConfig: AlfrescoApiConfig;

    private excludedErrorUrl: string[] = ['api/enterprise/system/properties'];

    getInstance(): AlfrescoApi {
        return this.alfrescoApi;
    }

    constructor(
        protected appConfig: AppConfigService,
        protected storageService: StorageService) {
    }

    async load() {
        await this.appConfig.load()
        .then( async (config) => {
            await this.appConfig.loadWellKnow(config.oauth2.host)
            .then((configIdp: OpenidConfiguration) => {
                this.idpConfig = configIdp;
                this.storageService.prefix = this.appConfig.get<string>(AppConfigValues.STORAGE_PREFIX, '');
                this.initAlfrescoApi();
                this.alfrescoApiInitialized.next(true);
            }).catch( () => {
                console.error('Something wrong happened when calling the discovery');
            });
        });
    }

    async reset() {
        const oauth = this.getAuthWithFixedOriginLocation();
        await this.appConfig.loadWellKnow(oauth.host)
        .then((configIdp) => {
            this.idpConfig = configIdp;
            this.initAlfrescoApi();
        });
    }

    protected initAlfrescoApi() {
        this.createAlfrescoApiConfigModel();
        this.mapAlfrescoApiOpenIdConfig();
        this.initAlfrescoApiWithLastConfig();
    }

    private mapAlfrescoApiOpenIdConfig() {
        this.currentAppConfig.oauth2.tokenUrl = this.idpConfig.token_endpoint;
        this.currentAppConfig.oauth2.authorizationUrl = this.idpConfig.authorization_endpoint;
        this.currentAppConfig.oauth2.logoutUrl = this.idpConfig.end_session_endpoint;
    }

    private getAuthWithFixedOriginLocation(): OauthConfigModel {
        const oauth: OauthConfigModel = Object.assign({}, this.appConfig.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null));
        if (oauth) {
            oauth.redirectUri = window.location.origin + window.location.pathname;
            oauth.redirectUriLogout = window.location.origin + window.location.pathname;
        }
        return oauth;
    }

    private createAlfrescoApiConfigModel() {
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
            domainPrefix : this.appConfig.get<string>(AppConfigValues.STORAGE_PREFIX),
            oauth2: oauth
        });
    }

    private initAlfrescoApiWithLastConfig() {
        if (this.alfrescoApi && this.isDifferentConfig(this.lastConfig, this.currentAppConfig)) {
            this.lastConfig = this.currentAppConfig;
            this.alfrescoApi.setConfig(this.currentAppConfig);
        } else {
            this.lastConfig = this.currentAppConfig;
            this.alfrescoApi = new AlfrescoApi(this.currentAppConfig);
        }
    }

    isDifferentConfig(lastConfig: AlfrescoApiConfig, newConfig: AlfrescoApiConfig) {
        return JSON.stringify(lastConfig) !== JSON.stringify(newConfig);
    }

    isExcludedErrorListener(currentFullPath: string): boolean {
        const formattedPath = currentFullPath.replace(this.lastConfig.hostBpm + '/' + this.lastConfig.contextRootBpm, '');
        return this.excludedErrorUrl.includes(formattedPath);
    }
}
