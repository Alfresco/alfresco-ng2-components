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

import {
    AuditApi,
    CommentsApi,
    DownloadsApi,
    FavoritesApi,
    GroupsApi,
    NodesApi,
    PeopleApi,
    QueriesApi,
    RatingsApi,
    RenditionsApi,
    SharedlinksApi,
    SitesApi,
    TagsApi,
    TrashcanApi,
    VersionsApi
} from '@alfresco/js-api';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace AlfrescoCore {
        interface ApiRegistry {
            ['ContentClient.versions']: VersionsApi;
            ['ContentClient.audit']: AuditApi;
            ['ContentClient.comments']: CommentsApi;
            ['ContentClient.downloads']: DownloadsApi;
            ['ContentClient.favorites']: FavoritesApi;
            ['ContentClient.groups']: GroupsApi;
            ['ContentClient.nodes']: NodesApi;
            ['ContentClient.people']: PeopleApi;
            ['ContentClient.queries']: QueriesApi;
            ['ContentClient.ratings']: RatingsApi;
            ['ContentClient.renditions']: RenditionsApi;
            ['ContentClient.sites']: SitesApi;
            ['ContentClient.sharedlinks']: SharedlinksApi;
            ['ContentClient.tags']: TagsApi;
            ['ContentClient.trashcan']: TrashcanApi;
        }
    }
}
