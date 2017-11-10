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

import { AlfrescoApiService } from './alfresco-api.service';
import { AlfrescoContentService } from './alfresco-content.service';
import { AlfrescoSettingsService } from './alfresco-settings.service';
import { AuthGuardBpm } from './auth-guard-bpm.service';
import { AuthGuardEcm } from './auth-guard-ecm.service';
import { AuthGuard } from './auth-guard.service';
import { AuthenticationService } from './authentication.service';
import { CardItemTypeService } from './card-item-types.service';
import { CommentProcessService } from './comment-process.service';
import { ContentService } from './content.service';
import { CookieService } from './cookie.service';
import { LogService } from './log.service';
import { NotificationService } from './notification.service';
import { PageTitleService } from './page-title.service';
import { RenditionsService } from './renditions.service';
import { StorageService } from './storage.service';
import { ThumbnailService } from './thumbnail.service';
import { AlfrescoTranslateLoader } from './translate-loader.service';
import { TranslationService } from './translation.service';
import { UploadService } from './upload.service';

import { AppConfigService } from './app-config.service';
import { AppsProcessService } from './apps-process.service';
import { DeletedNodesApiService } from './deleted-nodes-api.service';
import { DiscoveryApiService } from './discovery-api.service';
import { FavoritesApiService } from './favorites-api.service';
import { HighlightTransformService } from './highlight-transform.service';
import { NodesApiService } from './nodes-api.service';
import { PeopleContentService } from './people-content.service';
import { PeopleProcessService } from './people-process.service';
import { SearchApiService } from './search-api.service';
import { SearchService } from './search.service';
import { SharedLinksApiService } from './shared-links-api.service';
import { SitesApiService } from './sites-api.service';
import { UserPreferencesService } from './user-preferences.service';

@NgModule({
    providers: [
        PageTitleService,
        UserPreferencesService,
        NotificationService,
        LogService,
        AuthenticationService,
        AlfrescoContentService,
        AlfrescoSettingsService,
        StorageService,
        CookieService,
        AlfrescoApiService,
        AlfrescoTranslateLoader,
        TranslationService,
        RenditionsService,
        ContentService,
        AuthGuard,
        AuthGuardEcm,
        AuthGuardBpm,
        ThumbnailService,
        UploadService,
        SearchService,
        DeletedNodesApiService,
        FavoritesApiService,
        NodesApiService,
        PeopleContentService,
        SearchApiService,
        SharedLinksApiService,
        SitesApiService,
        DiscoveryApiService,
        HighlightTransformService,
        PeopleProcessService,
        AppsProcessService,
        CommentProcessService,
        CardItemTypeService,
        AppConfigService
    ]
})
export class ServicesModule {}
