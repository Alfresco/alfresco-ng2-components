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
import { getTestParams } from '../../test.configuration';

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
        const params = getTestParams();

        if (params.testConfig && params.testConfig.appConfig) {
            this.config = {
                ...params.testConfig.appConfig,
                hostEcm: params.testConfig.appConfig.ecmHost,
                hostBpm: params.testConfig.appConfig.bpmHost
            };
        }

        if (clientIdOrAppConfig && typeof clientIdOrAppConfig !== 'string') {
            this.config = {
                ...this.config,
                ...clientIdOrAppConfig,
                hostEcm: clientIdOrAppConfig.hostEcm || this.config.hostEcm,
                hostBpm: clientIdOrAppConfig.hostBpm || this.config.hostBpm
            };
        } else if (clientIdOrAppConfig && typeof clientIdOrAppConfig === 'string') {
            this.config.oauth2.clientId = clientIdOrAppConfig;
        }

        if (hostSso) {
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
        this.apiService = new AlfrescoApi(this.config);
    }

    getInstance(): AlfrescoApi {
        return this.apiService;
    }

    async login(username: string, password: string): Promise<void> {
        return this.apiService.login(username, password);
    }

    /**
     * Login with the existing profile in test configuration (`browser.params.testConfig.[<profile>]`).
     * The profile should contain `email` and `password` properties.
     */
    async loginWithProfile(profileName: string): Promise<void> {
        const { email, password } = browser.params.testConfig[profileName];
        return this.login(email, password);
    }

    async performBpmOperation(path: string, method: string, queryParams: any, postBody: any): Promise<any> {
        const uri = this.config.hostBpm + path;
        const pathParams = {}, formParams = {};
        const contentTypes = ['application/json'];
        const accepts = ['application/json'];

        const headerParams = {
            Authorization: 'bearer ' + this.apiService.oauth2Auth.token
        };

        return this.apiService.processClient.callCustomApi(uri, method, pathParams, queryParams, headerParams, formParams, postBody,
            contentTypes, accepts, Object)
            .catch((error) => {
                throw (error);
            });
    }

    async performIdentityOperation(path: string, method: string, queryParams: any, postBody: any): Promise<any> {
        const uri = this.config.oauth2.host.replace('/realms', '/admin/realms') + path;
        const pathParams = {};
        const formParams = {};
        const contentTypes = ['application/json'];
        const accepts = ['application/json'];

        const headerParams = {
            Authorization: 'bearer ' + this.apiService.oauth2Auth.token
        };

        return this.apiService.processClient.callCustomApi(
            uri,
            method,
            pathParams,
            queryParams,
            headerParams,
            formParams,
            postBody,
            contentTypes,
            accepts,
            Object
        );
    }
}
