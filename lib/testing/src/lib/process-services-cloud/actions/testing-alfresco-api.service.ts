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

import { AlfrescoApiCompatibility, AlfrescoApiConfig } from '@alfresco/js-api';
import { AlfrescoApiService, AppConfigValues, AppConfigService } from '@alfresco/adf-core';

export class TestingAlfrescoApiService extends AlfrescoApiService {

    protected alfrescoApi: AlfrescoApiCompatibility;

    config = {
    };

    constructor(public appConfig: AppConfigService) {
        super(null, null);
        let oauth = Object.assign({}, this.appConfig.get<any>(AppConfigValues.OAUTHCONFIG, null));
        this.config = new AlfrescoApiConfig({
            provider: this.appConfig.get<string>(AppConfigValues.PROVIDERS),
            hostEcm: this.appConfig.get<string>(AppConfigValues.ECMHOST),
            hostBpm: this.appConfig.get<string>(AppConfigValues.BPMHOST),
            authType: this.appConfig.get<string>(AppConfigValues.AUTHTYPE, 'BASIC'),
            contextRootBpm: this.appConfig.get<string>(AppConfigValues.CONTEXTROOTBPM),
            contextRoot: this.appConfig.get<string>(AppConfigValues.CONTEXTROOTECM),
            disableCsrf: this.appConfig.get<boolean>(AppConfigValues.DISABLECSRF),
            withCredentials: this.appConfig.get<boolean>(AppConfigValues.AUTH_WITH_CREDENTIALS, false),
            oauth2: oauth
        });
    }

    getInstance(): AlfrescoApiCompatibility {
        if (this.alfrescoApi) {
            this.alfrescoApi.configureJsApi(this.config);
        } else {
            this.alfrescoApi = new AlfrescoApiCompatibility(this.config);
        }
        return this.alfrescoApi;
    }
}
