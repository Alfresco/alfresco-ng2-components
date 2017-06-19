/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { AlfrescoApi } from  'alfresco-js-api';
import * as alfrescoApi from  'alfresco-js-api';
import { AlfrescoSettingsService } from './alfresco-settings.service';
import { AppConfigService } from './app-config.service';
import { StorageService } from './storage.service';

@Injectable()
export class AlfrescoApiService {

    private alfrescoApi: AlfrescoApi;
    private provider: string;
    private disableCsrf: boolean;

    public getInstance(): AlfrescoApi {
        return this.alfrescoApi;
    }

    constructor(private appConfig: AppConfigService,
                private settingsService: AlfrescoSettingsService,
                private storage: StorageService) {

        this.provider = this.settingsService.getProviders();
        this.disableCsrf = false;

        this.init();

        settingsService.csrfSubject.subscribe((disableCsrf) => {
            this.disableCsrf = disableCsrf;
            this.init();
        });

        settingsService.providerSubject.subscribe((provider) => {
            this.provider = provider;
            this.init();
        });
    }

    private init() {
        this.alfrescoApi = <AlfrescoApi>new alfrescoApi({
            provider: this.provider,
            ticketEcm: this.storage.getItem('ticket-ECM'),
            ticketBpm: this.storage.getItem('ticket-BPM'),
            hostEcm: this.appConfig.get<string>('ecmHost'),
            hostBpm: this.appConfig.get<string>('bpmHost'),
            contextRoot: 'alfresco',
            disableCsrf: this.disableCsrf
        });
    }
}
