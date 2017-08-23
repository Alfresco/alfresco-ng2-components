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

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { CollapsableModule } from './src/components/collapsable/collapsable.module';
import { ContextMenuModule } from './src/components/context-menu/context-menu.module';
import { PaginationModule } from './src/components/pagination/pagination.module';
import { ToolbarModule } from './src/components/toolbar/toolbar.module';
import { CardViewModule } from './src/components/view/card-view.module';
import { MaterialModule } from './src/material.module';
import { AppConfigModule } from './src/services/app-config.service';

import { CreateFolderDialogComponent } from './src/dialogs/create-folder.dialog';
import { DownloadZipDialogComponent } from './src/dialogs/download-zip.dialog';

import { AlfrescoApiService } from './src/services/alfresco-api.service';
import { AlfrescoContentService } from './src/services/alfresco-content.service';
import { AlfrescoSettingsService } from './src/services/alfresco-settings.service';
import { AppConfigService } from './src/services/app-config.service';
import { InitAppConfigServiceProvider } from './src/services/app-config.service';
import { AuthGuardBpm } from './src/services/auth-guard-bpm.service';
import { AuthGuardEcm } from './src/services/auth-guard-ecm.service';
import { AuthGuard } from './src/services/auth-guard.service';
import { AuthenticationService } from './src/services/authentication.service';
import { ContentService } from './src/services/content.service';
import { CookieService } from './src/services/cookie.service';
import { LogService } from './src/services/log.service';
import { LogServiceMock } from './src/services/log.service';
import { NotificationService } from './src/services/notification.service';
import { RenditionsService } from './src/services/renditions.service';
import { StorageService } from './src/services/storage.service';
import { ThumbnailService } from './src/services/thumbnail.service';
import { AlfrescoTranslateLoader } from './src/services/translate-loader.service';
import { TRANSLATION_PROVIDER, TranslationService } from './src/services/translation.service';
import { UploadService } from './src/services/upload.service';
import { UserPreferencesService } from './src/services/user-preferences.service';

import { HighlightDirective } from './src/directives/highlight.directive';
import { DeletedNodesApiService } from './src/services/deleted-nodes-api.service';
import { DiscoveryApiService } from './src/services/discovery-api.service';
import { FavoritesApiService } from './src/services/favorites-api.service';
import { HighlightTransformService } from './src/services/highlight-transform.service';
import { NodesApiService } from './src/services/nodes-api.service';
import { PeopleApiService } from './src/services/people-api.service';
import { SearchApiService } from './src/services/search-api.service';
import { SearchService } from './src/services/search.service';
import { SharedLinksApiService } from './src/services/shared-links-api.service';
import { SitesApiService } from './src/services/sites-api.service';

export { MomentDateAdapter, MOMENT_DATE_FORMATS } from './src/utils/momentDateAdapter';
import { MomentDateAdapter } from './src/utils/momentDateAdapter';

export { CreateFolderDialogComponent } from './src/dialogs/create-folder.dialog';
export { DownloadZipDialogComponent } from './src/dialogs/download-zip.dialog';

export { ContentService } from './src/services/content.service';
export { StorageService } from './src/services/storage.service';
export { CookieService } from './src/services/cookie.service';
export { AlfrescoApiService } from './src/services/alfresco-api.service';
export { AlfrescoSettingsService } from './src/services/alfresco-settings.service';
export { AlfrescoContentService } from './src/services/alfresco-content.service';
export { RenditionsService } from './src/services/renditions.service';
export { AuthGuard } from './src/services/auth-guard.service';
export { AuthGuardEcm } from './src/services/auth-guard-ecm.service';
export { AuthGuardBpm } from './src/services/auth-guard-bpm.service';
export { NotificationService } from './src/services/notification.service';
export { LogService } from './src/services/log.service';
export { LogServiceMock } from './src/services/log.service';
export { AuthenticationService } from './src/services/authentication.service';
export { TranslationService, TRANSLATION_PROVIDER, TranslationProvider } from './src/services/translation.service';
export { AlfrescoTranslateLoader } from './src/services/translate-loader.service';
export { AppConfigService } from './src/services/app-config.service';
export { InitAppConfigServiceProvider } from './src/services/app-config.service';
export { ThumbnailService } from './src/services/thumbnail.service';
export { UploadService } from './src/services/upload.service';
export { CardViewUpdateService } from './src/services/card-view-update.service';
export { UpdateNotification } from './src/services/card-view-update.service';
export { ClickNotification } from './src/services/card-view-update.service';
export { AppConfigModule } from './src/services/app-config.service';
export { UserPreferencesService } from './src/services/user-preferences.service';
export { HighlightTransformService, HightlightTransformResult } from './src/services/highlight-transform.service';

export { DeletedNodesApiService } from './src/services/deleted-nodes-api.service';
export { FavoritesApiService } from './src/services/favorites-api.service';
export { NodesApiService } from './src/services/nodes-api.service';
export { PeopleApiService } from './src/services/people-api.service';
export { SearchApiService } from './src/services/search-api.service';
export { SharedLinksApiService } from './src/services/shared-links-api.service';
export { SitesApiService } from './src/services/sites-api.service';
export { DiscoveryApiService } from './src/services/discovery-api.service';

import { DataColumnListComponent } from './src/components/data-column/data-column-list.component';
import { DataColumnComponent } from './src/components/data-column/data-column.component';
import { InfoDrawerButtonsDirective, InfoDrawerComponent, InfoDrawerContentDirective, InfoDrawerTitleDirective } from './src/components/info-drawer/info-drawer.component';
import { NodePermissionDirective } from './src/directives/node-permission.directive';
import { UploadDirective } from './src/directives/upload.directive';

import { FileSizePipe } from './src/pipes/file-size.pipe';
import { HighlightPipe } from './src/pipes/text-highlight.pipe';
import { TimeAgoPipe } from './src/pipes/time-ago.pipe';

import { AlfrescoMdlMenuDirective } from './src/components/material/mdl-menu.directive';
import { AlfrescoMdlTextFieldDirective } from './src/components/material/mdl-textfield.directive';
import { MDLDirective } from './src/components/material/mdl-upgrade-element.directive';

export { ContextMenuModule } from './src/components/context-menu/context-menu.module';
export { CardViewModule } from './src/components/view/card-view.module';
export { CollapsableModule } from './src/components/collapsable/collapsable.module';
export { CardViewItem } from './src/interface/card-view-item.interface';
export { TimeAgoPipe } from './src/pipes/time-ago.pipe';
export { EXTENDIBLE_COMPONENT } from './src/interface/injection.tokens';

export * from './src/components/data-column/data-column.component';
export * from './src/components/data-column/data-column-list.component';
export * from './src/components/info-drawer/info-drawer.component';
export * from './src/directives/upload.directive';
export * from './src/directives/highlight.directive';
export * from './src/directives/node-permission.directive';
export * from './src/utils/index';
export * from './src/events/base.event';
export * from './src/events/base-ui.event';
export * from './src/events/folder-created.event';
export * from './src/events/file.event';

export * from './src/models/card-view-textitem.model';
export * from './src/models/card-view-mapitem.model';
export * from './src/models/card-view-dateitem.model';
export * from './src/models/file.model';
export * from './src/models/permissions.enum';
export * from './src/models/site.model';
export * from './src/models/product-version.model';

// Old deprecated import
import { AuthenticationService as AlfrescoAuthenticationService } from './src/services/authentication.service';
import { TranslationService as AlfrescoTranslationService } from './src/services/translation.service';
export { AuthenticationService as AlfrescoAuthenticationService } from './src/services/authentication.service';
export { TranslationService as AlfrescoTranslationService } from './src/services/translation.service';
export * from './src/services/search.service';

export function providers() {
    return [
        UserPreferencesService,
        NotificationService,
        LogService,
        LogServiceMock,
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
        PeopleApiService,
        SearchApiService,
        SharedLinksApiService,
        SitesApiService,
        DiscoveryApiService,
        HighlightTransformService
    ];
}

export function deprecatedProviders() {
    return [
        AlfrescoTranslationService,
        AlfrescoAuthenticationService
    ];
}

export function obsoleteMdlDirectives() {
    return [
        MDLDirective,
        AlfrescoMdlMenuDirective,
        AlfrescoMdlTextFieldDirective
    ];
}

export function createTranslateLoader(http: Http, logService: LogService) {
    return new AlfrescoTranslateLoader(http, logService);
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http, LogService]
            }
        }),
        MaterialModule,
        AppConfigModule,
        PaginationModule,
        ToolbarModule,
        ContextMenuModule,
        CardViewModule,
        CollapsableModule
    ],
    declarations: [
        ...obsoleteMdlDirectives(),
        UploadDirective,
        NodePermissionDirective,
        HighlightDirective,
        DataColumnComponent,
        DataColumnListComponent,
        InfoDrawerComponent,
        InfoDrawerTitleDirective,
        InfoDrawerButtonsDirective,
        InfoDrawerContentDirective,
        FileSizePipe,
        HighlightPipe,
        TimeAgoPipe,
        CreateFolderDialogComponent,
        DownloadZipDialogComponent
    ],
    providers: [
        ...providers(),
        ...deprecatedProviders(),
        MomentDateAdapter,
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'ng2-alfresco-core',
                source: 'assets/ng2-alfresco-core'
            }
        }
    ],
    exports: [
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        TranslateModule,
        MaterialModule,
        ContextMenuModule,
        CardViewModule,
        CollapsableModule,
        PaginationModule,
        ToolbarModule,
        ...obsoleteMdlDirectives(),
        UploadDirective,
        NodePermissionDirective,
        HighlightDirective,
        DataColumnComponent,
        DataColumnListComponent,
        FileSizePipe,
        HighlightPipe,
        TimeAgoPipe,
        CreateFolderDialogComponent,
        DownloadZipDialogComponent,
        InfoDrawerComponent,
        InfoDrawerTitleDirective,
        InfoDrawerButtonsDirective,
        InfoDrawerContentDirective
    ],
    entryComponents: [
        CreateFolderDialogComponent,
        DownloadZipDialogComponent
    ]
})
export class CoreModule {
    static forRoot(opts: any = {}): ModuleWithProviders {

        const appConfigFile = opts.appConfigFile || 'app.config.json';

        return {
            ngModule: CoreModule,
            providers: [
                ...providers(),
                AppConfigService,
                InitAppConfigServiceProvider(appConfigFile)
            ]
        };
    }
}
