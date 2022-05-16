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
import { NgModule } from '@angular/core';
import { ApiClientsService } from '../../api-clients.service';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Api {
        interface ApiRegistry {
            ['Content.versions']: VersionsApi;
            ['Content.audit']: AuditApi;
            ['Content.comments']: CommentsApi;
            ['Content.downloads']: DownloadsApi;
            ['Content.favorites']: FavoritesApi;
            ['Content.groups']: GroupsApi;
            ['Content.nodes']: NodesApi;
            ['Content.people']: PeopleApi;
            ['Content.queries']: QueriesApi;
            ['Content.ratings']: RatingsApi;
            ['Content.renditions']: RenditionsApi;
            ['Content.sites']: SitesApi;
            ['Content.sharedlinks']: SharedlinksApi;
            ['Content.tags']: TagsApi;
            ['Content.trashcan']: TrashcanApi;
        }
    }
}

@NgModule()
export class ContentClientModule {
    constructor(private apiClientsService: ApiClientsService) {
        this.apiClientsService.register('Content.versions', VersionsApi);
        this.apiClientsService.register('Content.audit', AuditApi);
        this.apiClientsService.register('Content.comments', CommentsApi);
        this.apiClientsService.register('Content.downloads', DownloadsApi);
        this.apiClientsService.register('Content.favorites', FavoritesApi);
        this.apiClientsService.register('Content.groups', GroupsApi);
        this.apiClientsService.register('Content.nodes', NodesApi);
        this.apiClientsService.register('Content.people', PeopleApi);
        this.apiClientsService.register('Content.queries', QueriesApi);
        this.apiClientsService.register('Content.ratings', RatingsApi);
        this.apiClientsService.register('Content.renditions', RenditionsApi);
        this.apiClientsService.register('Content.sites', SitesApi);
        this.apiClientsService.register('Content.sharedlinks', SharedlinksApi);
        this.apiClientsService.register('Content.tags', TagsApi);
        this.apiClientsService.register('Content.trashcan', TrashcanApi);
    }
}
