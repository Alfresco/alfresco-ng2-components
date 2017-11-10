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
import { NgModule } from '@angular/core';

import { AuthenticationService } from './authentication.service';
import { AlfrescoApiService } from './alfresco-api.service';
import { SettingsService } from './settings.service';
import { ContentService } from './content.service';
import { AuthGuard } from './auth-guard.service';
import { AuthGuardEcm } from './auth-guard-ecm.service';
import { AuthGuardBpm } from './auth-guard-bpm.service';
import { AppsProcessService } from './apps-process.service';
import { PageTitleService } from './page-title.service';
import { StorageService } from './storage.service';
import { CookieService } from './cookie.service';
import { RenditionsService } from './renditions.service';
import { NotificationService } from './notification.service';
import { LogService } from './log.service';
import { TranslationService } from './translation.service';
import { TranslateLoaderService } from './translate-loader.service';
import { ThumbnailService } from './thumbnail.service';
import { UploadService } from './upload.service';
import { CardItemTypeService } from './card-item-types.service';
import { CardViewUpdateService } from './card-view-update.service';
import { UserPreferencesService } from './user-preferences.service';
import { HighlightTransformService } from './highlight-transform.service';
import { DeletedNodesApiService } from './deleted-nodes-api.service';
import { FavoritesApiService } from './favorites-api.service';
import { NodesApiService } from './nodes-api.service';
import { PeopleContentService } from './people-content.service';
import { PeopleProcessService } from './people-process.service';
import { SearchApiService } from './search-api.service';
import { SearchService } from './search.service';
import { SharedLinksApiService } from './shared-links-api.service';
import { SitesApiService } from './sites-api.service';
import { DiscoveryApiService } from './discovery-api.service';
import { CommentProcessService } from './comment-process.service';

@NgModule({
    imports: [],
    declarations: [],
    providers: [
        AuthenticationService,
        AlfrescoApiService,
        SettingsService,
        ContentService,
        AuthGuard,
        AuthGuardEcm,
        AuthGuardBpm,
        AppsProcessService,
        PageTitleService,
        StorageService,
        CookieService,
        RenditionsService,
        NotificationService,
        LogService,
        TranslationService,
        TranslateLoaderService,
        ThumbnailService,
        UploadService,
        CardItemTypeService,
        CardViewUpdateService,
        UserPreferencesService,
        HighlightTransformService,
        DeletedNodesApiService,
        FavoritesApiService,
        NodesApiService,
        PeopleContentService,
        PeopleProcessService,
        SearchApiService,
        SearchService,
        SharedLinksApiService,
        SitesApiService,
        DiscoveryApiService,
        CommentProcessService
    ],
    exports: [
    ]
})
export class ServiceModule {
}
