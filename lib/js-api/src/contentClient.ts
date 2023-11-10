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

import { AlfrescoApiClient } from './alfrescoApiClient';
import { AlfrescoApiConfig } from './alfrescoApiConfig';
import { Authentication } from './authentication/authentication';
import { HttpClient } from './api-clients/http-client.interface';

export class ContentClient extends AlfrescoApiClient {

    className = 'ContentClient';
    servicePath: string;

    constructor(config: AlfrescoApiConfig, servicePath: string, httpClient?: HttpClient) {
        super(undefined, httpClient);

        this.setConfig(config, servicePath);
    }

    setConfig(config: AlfrescoApiConfig, servicePath: string) {
        this.config = config;
        this.servicePath = servicePath;

        this.changeHost();
    }

    changeHost() {
        this.host = this.config.hostEcm;
        this.basePath = `${this.config.hostEcm}/${this.config.contextRoot}${this.servicePath}`;
    }

    /**
     * set the Authentications
     *
     * @param authentications
     * */
    setAuthentications(authentications: Authentication): void {
        this.authentications = authentications;
    }
}
