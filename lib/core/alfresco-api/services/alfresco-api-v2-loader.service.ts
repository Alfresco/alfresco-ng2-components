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

/*tslint:disable*/ // => because of ADF file naming problems... Try to remove it, if you don't believe me :P

import { Injectable } from '@angular/core';
import { AlfrescoApi, AlfrescoApiConfig } from '@alfresco/js-api';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { OauthConfigModel } from '../../models/oauth-config.model';
import { AlfrescoApiV2 } from './alfresco-api-v2';
import { LegacyAlfrescoApiServiceFacade } from './legacy-alfresco-api-service.facade';
import { take } from 'rxjs/operators';

export function createAlfrescoApiV2Service(angularAlfrescoApiService: AlfrescoApiV2LoaderService) {
    return () => angularAlfrescoApiService.load();
}

@Injectable()
export class AlfrescoApiV2LoaderService {

    protected alfrescoApi: AlfrescoApi;

    constructor(
        protected appConfig: AppConfigService,
        private legacyAlfrescoApiServiceFacade: LegacyAlfrescoApiServiceFacade,
        private alfrescoApiV2Service?: AlfrescoApiV2) {
    }

    load(): Promise<any> {
        return this.appConfig.onLoad.pipe(take(1)).toPromise().then(() => {
            this.initAngularAlfrescoApi();
        });
    }

    protected initAngularAlfrescoApi() {
        const oauth: OauthConfigModel = Object.assign({}, this.appConfig.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null));
        if (oauth) {
            oauth.redirectUri = window.location.origin + window.location.pathname;
            oauth.redirectUriLogout = window.location.origin + window.location.pathname;
        }

        const config = new AlfrescoApiConfig({
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

        this.alfrescoApiV2Service.init(config);
        this.legacyAlfrescoApiServiceFacade.init();
    }
}
