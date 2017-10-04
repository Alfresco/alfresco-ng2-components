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
import {
    AlfrescoApi, ContentApi, FavoritesApi, NodesApi,
    PeopleApi, RenditionsApi, SharedlinksApi, SitesApi
} from 'alfresco-js-api';
import * as alfrescoApi from 'alfresco-js-api';
import { AppConfigService } from './app-config.service';
import { StorageService } from './storage.service';

@Injectable()
export class AlfrescoApiService {

    private alfrescoApi: AlfrescoApi;

    getInstance(): AlfrescoApi {
        return this.alfrescoApi;
    }

    get contentApi(): ContentApi {
        return this.getInstance().content;
    }

    get nodesApi(): NodesApi {
        return this.getInstance().nodes;
    }

    get renditionsApi(): RenditionsApi {
        return this.getInstance().core.renditionsApi;
    }

    get sharedLinksApi(): SharedlinksApi {
        return this.getInstance().core.sharedlinksApi;
    }

    get sitesApi(): SitesApi {
        return this.getInstance().core.sitesApi;
    }

    get favoritesApi(): FavoritesApi {
        return this.getInstance().core.favoritesApi;
    }

    get peopleApi(): PeopleApi {
        return this.getInstance().core.peopleApi;
    }

    get searchApi() {
        return this.getInstance().search.searchApi;
    }

    constructor(private appConfig: AppConfigService,
                private storage: StorageService) {

        this.reset();
    }

    reset() {
        this.alfrescoApi = <AlfrescoApi> new alfrescoApi({
            provider: this.storage.getItem('AUTH_TYPE'),
            ticketEcm: this.storage.getItem('ticket-ECM'),
            ticketBpm: this.storage.getItem('ticket-BPM'),
            hostEcm: this.appConfig.get<string>('ecmHost'),
            hostBpm: this.appConfig.get<string>('bpmHost'),
            contextRoot: 'alfresco',
            disableCsrf: this.storage.getItem('DISABLE_CSRF') === 'true'
        });
    }
}
