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

import { browser } from 'protractor';
import { AlfrescoApi } from '@alfresco/js-api';
import { PeopleApi } from './apis/people-api';
import { NodesApi } from './apis/nodes-api';
import { CommentsApi } from './apis/comments-api';
import { SitesApi } from './apis/sites-api';
import { FavoritesApi } from './apis/favorites-api';
import { QueriesApi } from './apis/queries-api';
import { SharedLinksApi } from './apis/shared-links-api';
import { TrashcanApi } from './apis/trashcan-api';
import { SearchApi } from './apis/search-api';
import { UploadApi } from './apis/upload-api';
import { Logger } from '../../core/utils/logger';

export class ContentApi {
    alfrescoJsApi = new AlfrescoApi();

    comments: CommentsApi;
    favorites: FavoritesApi;
    nodes: NodesApi;
    people: PeopleApi;
    queries: QueriesApi;
    search: SearchApi;
    sharedLinks: SharedLinksApi;
    sites: SitesApi;
    trashcan: TrashcanApi;
    upload: UploadApi;

    constructor(
        private username: string,
        private password: string
    ) {
        this.alfrescoJsApi.setConfig({
            provider: 'ECM',
            hostEcm: browser.params.API_CONTENT_HOST
        });
    }

    async setup() {
        await this.login();

        this.comments = new CommentsApi(this.username, this.password, this.alfrescoJsApi);
        this.favorites = new FavoritesApi(this.username, this.password, this.alfrescoJsApi);
        this.nodes = new NodesApi(this.username, this.password, this.alfrescoJsApi);
        this.people = new PeopleApi(this.username, this.password, this.alfrescoJsApi);
        this.queries = new QueriesApi(this.username, this.password, this.alfrescoJsApi);
        this.search = new SearchApi(this.username, this.password, this.alfrescoJsApi);
        this.sharedLinks = new SharedLinksApi(this.username, this.password, this.alfrescoJsApi);
        this.sites = new SitesApi(this.username, this.password, this.alfrescoJsApi);
        this.trashcan = new TrashcanApi(this.username, this.password, this.alfrescoJsApi);
        this.upload = new UploadApi(this.username, this.password, this.alfrescoJsApi);

        return this;
    }

    async login() {
        try {
            await this.alfrescoJsApi.login(this.username, this.password);
        } catch (error) {
            Logger.error('>>>> api login error : ', error);
            throw error;
        }
    }

    async logout() {
        try {
            return this.alfrescoJsApi.logout();
        } catch (error) {
            Logger.error('>>>> api logout error : ', error);
        }
    }
}
