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

import { AlfrescoApiCompatibility as AlfrescoApi, AlfrescoApiConfig } from '@alfresco/js-api';
import { browser } from 'protractor';
import { Logger } from '../utils/logger';

export class ApiService {

    apiService: AlfrescoApi;

    config: AlfrescoApiConfig = new AlfrescoApiConfig({
        authType: 'OAUTH',
        oauth2: {
            scope: 'openid',
            secret: '',
            implicitFlow: false,
            silentLogin: false,
            redirectUri: '/',
            redirectUriLogout: '/logout'
        }

    });

    constructor(clientIdOrAppConfig?: AlfrescoApiConfig | string, host?: string, hostSso?: string, provider?: string) {

        if (browser.params.testConfig && browser.params.testConfig.appConfig) {
            Logger.log('Get Config ApiService from browser params');

            this.config = { ...browser.params.testConfig.appConfig };
            this.config.hostEcm = browser.params.testConfig.appConfig.ecmHost;
            this.config.hostBpm = browser.params.testConfig.appConfig.bpmHost;
        }

        if (clientIdOrAppConfig && typeof clientIdOrAppConfig !== 'string') {
            Logger.log('overwrite ApiService config param');

            this.config = { ...this.config, ...clientIdOrAppConfig };

            this.config.hostEcm = clientIdOrAppConfig.hostEcm ? clientIdOrAppConfig.hostEcm : this.config.hostEcm;
            this.config.hostBpm = clientIdOrAppConfig.hostBpm ? clientIdOrAppConfig.hostBpm : this.config.hostBpm;
        } else if (clientIdOrAppConfig && typeof clientIdOrAppConfig === 'string') {
            this.config.oauth2.clientId = clientIdOrAppConfig;
        }

        if (hostSso) {
            Logger.log('overwrite ApiService hostSso param');

            this.config.oauth2.host = hostSso;
        }

        if (host) {
            this.config.hostBpm = host;
            this.config.hostEcm = host;
        }

        if (provider) {
            this.config.provider = provider;
        }

        this.config.oauth2.implicitFlow = false;

        Logger.log('Api Service configuration' + JSON.stringify(this.config));
        this.apiService = new AlfrescoApi(this.config);
    }

    getInstance(): AlfrescoApi {
        return this.apiService;
    }

    async login(username: string, password: string): Promise<void> {
        await this.apiService.login(username, password);
    }

    /**
     * Login using one of the account profiles from the `browser.params.testConfig`.
     * Example: loginWithProfile('admin')
     */
    async loginWithProfile(profileName: string): Promise<void> {
        const profile = browser.params.testConfig[profileName];
        if (profile) {
            await this.apiService.login(profile.email, profile.password);
        } else {
            throw new Error(`Login profile "${profileName}" not found on "browser.params.testConfig".`);
        }
    }

    async performBpmOperation(path: string, method: string, queryParams: any, postBody: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const uri = this.config.hostBpm + path;
            const pathParams = {}, formParams = {};
            const contentTypes = ['application/json'];
            const accepts = ['application/json'];

            const headerParams = {
                Authorization: 'bearer ' + this.apiService.oauth2Auth.token
            };

            this.apiService.processClient.callCustomApi(uri, method, pathParams, queryParams, headerParams, formParams, postBody,
                contentTypes, accepts, Object)
                .then((data) => resolve(data))
                .catch((err) => reject(err));
        });
    }

    async performIdentityOperation(path: string, method: string, queryParams: any, postBody: any): Promise<any> {
        return new Promise((resolve, reject) => {

            const uri = this.config.oauth2.host.replace('/realms', '/admin/realms') + path;
            const pathParams = {}, formParams = {};
            const contentTypes = ['application/json'];
            const accepts = ['application/json'];

            const headerParams = {
                Authorization: 'bearer ' + this.apiService.oauth2Auth.token
            };

            return this.apiService.processClient.callCustomApi(uri, method, pathParams, queryParams, headerParams, formParams, postBody,
                contentTypes, accepts, Object)
                .then((data) => resolve(data))
                .catch((err) => reject(err));
        });
    }

    async performECMOperation(path: string, method: string, queryParams: any, postBody: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const uri = this.config.hostEcm + path;
            const pathParams = {}, formParams = {};
            const contentTypes = ['application/json'];
            const accepts = ['application/json'];

            const headerParams = {
                Authorization: 'bearer ' + this.apiService.oauth2Auth.token
            };

            this.apiService.contentClient
                .callCustomApi(uri, method, pathParams, queryParams, headerParams, formParams, postBody, contentTypes, accepts, Object)
                .then((data) => resolve(data))
                .catch((err) => reject(err));
        });
    }
}
