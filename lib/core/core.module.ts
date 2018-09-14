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

import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { APP_INITIALIZER, NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { MaterialModule } from './material.module';
import { AboutModule } from './about/about.module';
import { AppConfigModule } from './app-config/app-config.module';
import { CardViewModule } from './card-view/card-view.module';
import { CollapsableModule } from './collapsable/collapsable.module';
import { ContextMenuModule } from './context-menu/context-menu.module';
import { DataColumnModule } from './data-column/data-column.module';
import { DataTableModule } from './datatable/datatable.module';
import { InfoDrawerModule } from './info-drawer/info-drawer.module';
import { LanguageMenuModule } from './language-menu/language-menu.module';
import { LoginModule } from './login/login.module';
import { PaginationModule } from './pagination/pagination.module';
import { HostSettingsModule } from './settings/host-settings.module';
import { ToolbarModule } from './toolbar/toolbar.module';
import { UserInfoModule } from './userinfo/userinfo.module';
import { ViewerModule } from './viewer/viewer.module';
import { FormModule } from './form/form.module';
import { SidenavLayoutModule } from './layout/layout.module';
import { CommentsModule } from './comments/comments.module';
import { ButtonsMenuModule } from './buttons-menu/buttons-menu.module';
import { TemplateModule } from './templates/template.module';

import { DirectiveModule } from './directives/directive.module';
import { PipeModule } from './pipes/pipe.module';

import { AlfrescoApiService } from './services/alfresco-api.service';
import { AppsProcessService } from './services/apps-process.service';
import { AuthGuardBpm } from './services/auth-guard-bpm.service';
import { AuthGuardEcm } from './services/auth-guard-ecm.service';
import { AuthGuard } from './services/auth-guard.service';
import { AuthenticationService } from './services/authentication.service';
import { CardItemTypeService } from './card-view/services/card-item-types.service';
import { CardViewUpdateService } from './card-view/services/card-view-update.service';
import { CommentProcessService } from './services/comment-process.service';
import { CommentContentService } from './services/comment-content.service';
import { ContentService } from './services/content.service';
import { CookieService } from './services/cookie.service';
import { DeletedNodesApiService } from './services/deleted-nodes-api.service';
import { DiscoveryApiService } from './services/discovery-api.service';
import { FavoritesApiService } from './services/favorites-api.service';
import { HighlightTransformService } from './services/highlight-transform.service';
import { LogService } from './services/log.service';
import { NodesApiService } from './services/nodes-api.service';
import { NotificationService } from './services/notification.service';
import { PageTitleService } from './services/page-title.service';
import { PeopleContentService } from './services/people-content.service';
import { PeopleProcessService } from './services/people-process.service';
import { RenditionsService } from './services/renditions.service';
import { SearchService } from './services/search.service';
import { SettingsService } from './services/settings.service';
import { SharedLinksApiService } from './services/shared-links-api.service';
import { SitesService } from './services/sites.service';
import { StorageService } from './services/storage.service';
import { ThumbnailService } from './services/thumbnail.service';
import { TranslateLoaderService } from './services/translate-loader.service';
import { TranslationService } from './services/translation.service';
import { UploadService } from './services/upload.service';
import { UserPreferencesService } from './services/user-preferences.service';
import { SearchConfigurationService } from './services/search-configuration.service';
import { startupServiceFactory } from './services/startup-service-factory';
import { SortingPickerModule } from './sorting-picker/sorting-picker.module';
import { AppConfigService } from './app-config/app-config.service';
import { ContextMenuService } from './context-menu/context-menu.service';
import { ContextMenuOverlayService } from './context-menu/context-menu-overlay.service';
import { ActivitiContentService } from './form/services/activiti-alfresco.service';
import { EcmModelService } from './form/services/ecm-model.service';
import { FormRenderingService } from './form/services/form-rendering.service';
import { FormService } from './form/services/form.service';
import { NodeService } from './form/services/node.service';
import { ProcessContentService } from './form/services/process-content.service';
import { WidgetVisibilityService } from './form/services/widget-visibility.service';
import { EcmUserService } from './userinfo/services/ecm-user.service';
import { BpmUserService } from './userinfo/services/bpm-user.service';
import { ViewUtilService } from './viewer/services/view-util.service';
import { LoginDialogService } from './services/login-dialog.service';
import { ExternalAlfrescoApiService } from './services/external-alfresco-api.service';

export function createTranslateLoader(http: HttpClient, logService: LogService) {
    return new TranslateLoaderService(http, logService);
}

export function providers() {
    return [
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
        SearchService,
        SharedLinksApiService,
        SitesService,
        DiscoveryApiService,
        CommentProcessService,
        CommentContentService,
        SearchConfigurationService,
        DatePipe,
        AppConfigService,
        ContextMenuService,
        ContextMenuOverlayService,
        ActivitiContentService,
        EcmModelService,
        FormRenderingService,
        FormService,
        NodeService,
        ProcessContentService,
        WidgetVisibilityService,
        EcmUserService,
        BpmUserService,
        ViewUtilService,
        LoginDialogService,
        ExternalAlfrescoApiService
    ];
}

@NgModule({
    imports: [
        AboutModule,
        ViewerModule,
        SidenavLayoutModule,
        PipeModule,
        CommonModule,
        DirectiveModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HostSettingsModule,
        UserInfoModule,
        MaterialModule,
        AppConfigModule,
        PaginationModule,
        ToolbarModule,
        ContextMenuModule,
        CardViewModule,
        CollapsableModule,
        FormModule,
        CommentsModule,
        LoginModule,
        LanguageMenuModule,
        InfoDrawerModule,
        DataColumnModule,
        DataTableModule,
        ButtonsMenuModule,
        TemplateModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient, LogService]
            }
        }),
        SortingPickerModule
    ],
    exports: [
        AboutModule,
        ViewerModule,
        SidenavLayoutModule,
        PipeModule,
        CommonModule,
        DirectiveModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HostSettingsModule,
        UserInfoModule,
        MaterialModule,
        AppConfigModule,
        PaginationModule,
        ToolbarModule,
        ContextMenuModule,
        CardViewModule,
        CollapsableModule,
        FormModule,
        CommentsModule,
        LoginModule,
        LanguageMenuModule,
        InfoDrawerModule,
        DataColumnModule,
        DataTableModule,
        TranslateModule,
        ButtonsMenuModule,
        TemplateModule,
        SortingPickerModule
    ]
})
export class CoreModuleLazy {
}

@NgModule({
    imports: [
        AboutModule,
        ViewerModule,
        SidenavLayoutModule,
        PipeModule,
        CommonModule,
        DirectiveModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HostSettingsModule,
        UserInfoModule,
        MaterialModule,
        AppConfigModule,
        PaginationModule,
        ToolbarModule,
        ContextMenuModule,
        CardViewModule,
        CollapsableModule,
        FormModule,
        CommentsModule,
        LoginModule,
        LanguageMenuModule,
        InfoDrawerModule,
        DataColumnModule,
        DataTableModule,
        ButtonsMenuModule,
        TemplateModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient, LogService]
            }
        }),
        SortingPickerModule
    ],
    exports: [
        AboutModule,
        ViewerModule,
        SidenavLayoutModule,
        PipeModule,
        CommonModule,
        DirectiveModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HostSettingsModule,
        UserInfoModule,
        MaterialModule,
        AppConfigModule,
        PaginationModule,
        ToolbarModule,
        ContextMenuModule,
        CardViewModule,
        CollapsableModule,
        FormModule,
        CommentsModule,
        LoginModule,
        LanguageMenuModule,
        InfoDrawerModule,
        DataColumnModule,
        DataTableModule,
        TranslateModule,
        ButtonsMenuModule,
        TemplateModule,
        SortingPickerModule
    ],
    providers: [
        ...providers(),
        {
            provide: APP_INITIALIZER,
            useFactory: startupServiceFactory,
            deps: [
                AlfrescoApiService
            ],
            multi: true
        }
    ]
})
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                ...providers(),
                {
                    provide: APP_INITIALIZER,
                    useFactory: startupServiceFactory,
                    deps: [
                        AlfrescoApiService
                    ],
                    multi: true
                }
            ]
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: CoreModuleLazy
        };
    }

    constructor(translation: TranslationService) {
        translation.addTranslationFolder('adf-core', 'assets/adf-core');
    }
}
