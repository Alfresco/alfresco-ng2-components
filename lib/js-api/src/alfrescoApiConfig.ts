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

import { Oauth2Config } from './authentication/oauth2Config';

export class AlfrescoApiConfig {
    ticket?: string;
    hostEcm?: string = 'http://127.0.0.1:8080';
    hostBpm?: string = 'http://127.0.0.1:9999';
    hostOauth2?: string;
    authType?: string = 'BASIC';
    oauth2?: Oauth2Config;
    contextRoot? = 'alfresco';
    tenant?: string = '-default-';
    contextRootBpm?: string = 'activiti-app';
    domainPrefix?: string = '';
    provider?: string = 'ECM';
    ticketEcm?: string;
    ticketBpm?: string;
    accessToken?: string;
    disableCsrf?: boolean = false;
    withCredentials?: boolean = false;
    oauthInit?: boolean = true;

    constructor(input: any = { oauth2: {} }) {
        Object.assign(this, input);

        this.hostEcm = input.hostEcm ? input.hostEcm : 'http://127.0.0.1:8080';
        this.hostBpm = input.hostBpm ? input.hostBpm : 'http://127.0.0.1:9999';
        this.authType = input.authType ? input.authType : 'BASIC';
        this.contextRoot = input.contextRoot ? input.contextRoot : 'alfresco';
        this.contextRootBpm = input.contextRootBpm ? input.contextRootBpm : 'activiti-app';
        this.tenant = input.tenant ? input.tenant : '-default-';
        this.provider = input.provider ? input.provider : 'ECM';
        this.disableCsrf = input.disableCsrf ? input.disableCsrf : false;
        this.domainPrefix = input.domainPrefix ? input.domainPrefix : '';
        this.withCredentials = input.withCredentials ? input.withCredentials : false;
        this.oauth2 = input.oauth2;
    }
}
