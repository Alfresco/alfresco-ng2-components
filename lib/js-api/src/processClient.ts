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

import { AlfrescoApiConfig } from './alfrescoApiConfig';
import { AlfrescoApiClient } from './alfrescoApiClient';
import { Authentication } from './authentication/authentication';
import { HttpClient } from './api-clients/http-client.interface';

export class ProcessClient extends AlfrescoApiClient {

    className = 'ProcessClient';

    constructor(config: AlfrescoApiConfig, httpClient?: HttpClient) {
        super(undefined, httpClient);

        this.setConfig(config);
    }

    setConfig(config: AlfrescoApiConfig) {
        this.config = config;

        this.changeHost();
    }

    changeHost() {
        this.host = this.config.hostBpm;
        this.basePath = `${this.config.hostBpm}/${this.config.contextRootBpm}`;
    }

    /**
     * set the authentications
     *
     * @param {Object} authentications
     * */
    setAuthentications(authentications: Authentication) {
        this.authentications = authentications;
    }

}
