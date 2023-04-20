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

import { AlfrescoApi, AlfrescoApiConfig } from '@alfresco/js-api';
import { LoggerLike } from '../utils/logger';

export interface ApiServiceConfig {
    appConfig: AlfrescoApiConfig;
    users: {
        [key: string]: {
            username: string;
            password: string;
        };
    };
}
export class ApiService {

    apiService: AlfrescoApi;

    constructor(private config: ApiServiceConfig, private logger: LoggerLike) {
        this.logger.log('Api Service configuration' + JSON.stringify(this.config));
        this.apiService = new AlfrescoApi(this.config.appConfig);
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
        const profile = this.config.users[profileName];
        if (profile) {
            this.logger.log(`try to login with ${profile.username} on HOST: ${this.apiService.config.hostEcm} AUTHTYPE: ${this.apiService.config.authType} PROVIDER: ${this.apiService.config.provider}`);
            try {
                await this.apiService.login(profile.username, profile.password);
                this.logger.log(`Successfuly logged in as ${profile.username}`);
            } catch (error) {
                this.logger.error(`Failed to login with ${profile.username}`, error?.message);
                throw new Error(`Login failed with ${profile.username}`);
            }
        } else {
            throw new Error(`Login profile "${profileName}" not found on "browser.params.testConfig".`);
        }
    }

    /** @deprecated */
    async performBpmOperation(path: string, method: string, queryParams: any, postBody: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const uri = this.config.appConfig.hostBpm + path;
            const pathParams = {};
            const formParams = {};
            const contentTypes = ['application/json'];
            const accepts = ['application/json'];

            const headerParams = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                Authorization: 'bearer ' + this.apiService.oauth2Auth.token
            };

            this.apiService.processClient.callCustomApi(uri, method, pathParams, queryParams, headerParams, formParams, postBody,
                contentTypes, accepts, Object)
                .then((data) => resolve(data))
                .catch((err) => reject(err));
        });
    }

    /** @deprecated */
    async performIdentityOperation(path: string, method: string, queryParams: any, postBody: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const uri = this.config.appConfig.oauth2.host.replace('/realms', '/admin/realms') + path;
            const pathParams = {};
            const formParams = {};
            const contentTypes = ['application/json'];
            const accepts = ['application/json'];

            const headerParams = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                Authorization: 'bearer ' + this.apiService.oauth2Auth.token
            };

            return this.apiService.processClient.callCustomApi(uri, method, pathParams, queryParams, headerParams, formParams, postBody,
                contentTypes, accepts, Object)
                .then((data) => resolve(data))
                .catch((err) => reject(err));
        });
    }

    /** @deprecated */
    async performECMOperation(path: string, method: string, queryParams: any, postBody: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const uri = this.config.appConfig.hostEcm + path;
            const pathParams = {};
            const formParams = {};
            const contentTypes = ['application/json'];
            const accepts = ['application/json'];

            const headerParams = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                Authorization: 'bearer ' + this.apiService.oauth2Auth.token
            };

            this.apiService.contentClient
                .callCustomApi(uri, method, pathParams, queryParams, headerParams, formParams, postBody, contentTypes, accepts, Object)
                .then((data) => resolve(data))
                .catch((err) => reject(err));
        });
    }
}
