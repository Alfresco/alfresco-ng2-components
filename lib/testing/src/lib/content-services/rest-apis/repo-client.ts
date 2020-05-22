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
import { PeopleApi } from './people/people-api';
import { NodesApi } from './nodes/nodes-api';
import { CommentsApi } from './comments/comments-api';
import { SitesApi } from './sites/sites-api';
import { FavoritesApi } from './favorites/favorites-api';
import { QueriesApi } from './queries/queries-api';
import { SharedLinksApi } from './shared-links/shared-links-api';
import { TrashcanApi } from './trashcan/trashcan-api';
import { SearchApi } from './search/search-api';
// import { UploadApi } from './rest-apis/upload/upload-api';
import { AuthenticationApi } from './authentication/authentication-api';

export class RepoClient {
    constructor(
        private username: string = browser.params.ADMIN_USERNAME,
        private password: string = browser.params.ADMIN_PASSWORD
    ) {}

    private get auth() {
        const { username, password } = this;
        return { username, password };
    }

    get people() {
        return new PeopleApi(this.auth.username, this.auth.password);
    }

    get nodes() {
        return new NodesApi(this.auth.username, this.auth.password);
    }

    get comments() {
        return new CommentsApi(this.auth.username, this.auth.password);
    }

    get sites() {
        return new SitesApi(this.auth.username, this.auth.password);
    }

    get favorites() {
        return new FavoritesApi(this.auth.username, this.auth.password);
    }

    get shared() {
        return new SharedLinksApi(this.auth.username, this.auth.password);
    }

    get trashcan() {
        return new TrashcanApi(this.auth.username, this.auth.password);
    }

    get search() {
        return new SearchApi(this.auth.username, this.auth.password);
    }

    get queries() {
        return new QueriesApi(this.auth.username, this.auth.password);
    }

    // get upload() {
    //     return new UploadApi(this.auth.username, this.auth.password);
    // }

    get authentication() {
        return new AuthenticationApi(this.auth.username, this.auth.password);
    }
}
