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

import { Injectable } from '@angular/core';
import {
    ContentApi,
    Core,
    Activiti,
    SearchApi,
    Node
} from '@alfresco/js-api';
import { AlfrescoApiCompatibility, AlfrescoApiConfig } from '@alfresco/js-api';
import { AppConfigService, AppConfigValues } from '../app-config/app-config.service';
import { Subject, Observable } from 'rxjs';
import { OauthConfigModel } from '../models/oauth-config.model';
import { StorageService } from './storage.service';

/* tslint:disable:adf-file-name */

@Injectable({
    providedIn: 'root'
})
export class AlfrescoApiService {
    /**
     * Publish/subscribe to events related to node updates.
     */
    nodeUpdated = new Subject<Node>();

    protected alfrescoApiInitializedSubject: Subject<any>;
    alfrescoApiInitialized: Observable<any>;

    protected alfrescoApi: AlfrescoApiCompatibility;

    lastConfig: AlfrescoApiConfig;

    getInstance(): AlfrescoApiCompatibility {
        return this.alfrescoApi;
    }

    get taskApi(): Activiti.TaskApi {
        return this.getInstance().activiti.taskApi;
    }

    get contentApi(): ContentApi {
        return this.getInstance().content;
    }

    get nodesApi(): Core.NodesApi {
        return this.getInstance().nodes;
    }

    get renditionsApi(): Core.RenditionsApi {
        return this.getInstance().core.renditionsApi;
    }

    get sharedLinksApi(): Core.SharedlinksApi {
        return this.getInstance().core.sharedlinksApi;
    }

    get sitesApi(): Core.SitesApi {
        return this.getInstance().core.sitesApi;
    }

    get favoritesApi(): Core.FavoritesApi {
        return this.getInstance().core.favoritesApi;
    }

    get peopleApi(): Core.PeopleApi {
        return this.getInstance().core.peopleApi;
    }

    get searchApi(): SearchApi {
        return this.getInstance().search.searchApi;
    }

    get versionsApi(): Core.VersionsApi {
        return this.getInstance().core.versionsApi;
    }

    get classesApi(): Core.ClassesApi {
        return this.getInstance().core.classesApi;
    }

    get groupsApi(): Core.GroupsApi {
        return this.getInstance().core.groupsApi;
    }

    constructor(
        protected appConfig: AppConfigService,
        protected storageService: StorageService) {
        this.alfrescoApiInitializedSubject = new Subject();
        this.alfrescoApiInitialized = this.alfrescoApiInitializedSubject.asObservable();
    }

    async load() {
        await this.appConfig.load().then(() => {
            this.storageService.prefix = this.appConfig.get<string>(AppConfigValues.STORAGE_PREFIX, '');
            this.initAlfrescoApi();
            this.alfrescoApiInitializedSubject.next();
        });
    }

    async reset() {
        this.initAlfrescoApi();
    }

    protected initAlfrescoApi() {
        const oauth: OauthConfigModel = Object.assign({}, this.appConfig.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null));
        if (oauth) {
            oauth.redirectUri = window.location.origin + (oauth.redirectUri || '/');
            oauth.redirectUriLogout = window.location.origin + (oauth.redirectUriLogout || '/');
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
            oauth2: oauth
        });

        if (this.alfrescoApi && this.isDifferentConfig(this.lastConfig, config)) {
            this.lastConfig = config;
            this.alfrescoApi.configureJsApi(config);
        } else {
            this.lastConfig = config;
            this.alfrescoApi = new AlfrescoApiCompatibility(config);
        }

    }

    isDifferentConfig(lastConfig: AlfrescoApiConfig, newConfig: AlfrescoApiConfig) {
        return JSON.stringify(lastConfig) !== JSON.stringify(newConfig);
    }
}
