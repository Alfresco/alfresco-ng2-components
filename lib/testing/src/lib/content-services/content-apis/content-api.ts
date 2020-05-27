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
import { AuthenticationApi } from './apis/authentication-api';

export class ContentApi {
    alfrescoJsApi = new AlfrescoApi();

    constructor(
        private username: string,
        private password: string
    ) {
        this.alfrescoJsApi.setConfig({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });
    }

    get people() {
        return new PeopleApi(this.username, this.password, this.alfrescoJsApi);
    }

    get nodes() {
        return new NodesApi(this.username, this.password, this.alfrescoJsApi);
    }

    get comments() {
        return new CommentsApi(this.username, this.password, this.alfrescoJsApi);
    }

    get sites() {
        return new SitesApi(this.username, this.password, this.alfrescoJsApi);
    }

    get favorites() {
        return new FavoritesApi(this.username, this.password, this.alfrescoJsApi);
    }

    get shared() {
        return new SharedLinksApi(this.username, this.password, this.alfrescoJsApi);
    }

    get trashcan() {
        return new TrashcanApi(this.username, this.password, this.alfrescoJsApi);
    }

    get search() {
        return new SearchApi(this.username, this.password, this.alfrescoJsApi);
    }

    get queries() {
        return new QueriesApi(this.username, this.password, this.alfrescoJsApi);
    }

    get upload() {
        return new UploadApi(this.username, this.password, this.alfrescoJsApi);
    }

    get authentication() {
        return new AuthenticationApi(this.username, this.password, this.alfrescoJsApi);
    }
}
