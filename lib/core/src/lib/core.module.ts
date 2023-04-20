/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { APP_INITIALIZER, NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader, TranslateStore, TranslateService } from '@ngx-translate/core';

import { MaterialModule } from './material.module';
import { AboutModule } from './about/about.module';
import { AppConfigModule } from './app-config/app-config.module';
import { CardViewModule } from './card-view/card-view.module';
import { ContextMenuModule } from './context-menu/context-menu.module';
import { DataTableModule } from './datatable/datatable.module';
import { InfoDrawerModule } from './info-drawer/info-drawer.module';
import { LanguageMenuModule } from './language-menu/language-menu.module';
import { LoginModule } from './login/login.module';
import { PaginationModule } from './pagination/pagination.module';
import { ToolbarModule } from './toolbar/toolbar.module';
import { ViewerModule } from './viewer/viewer.module';
import { FormBaseModule } from './form/form-base.module';
import { SidenavLayoutModule } from './layout/layout.module';
import { CommentsModule } from './comments/comments.module';
import { CommentListModule } from './comments/comment-list/comment-list.module';
import { ButtonsMenuModule } from './buttons-menu/buttons-menu.module';
import { TemplateModule } from './templates/template.module';
import { ClipboardModule } from './clipboard/clipboard.module';
import { NotificationHistoryModule } from './notifications/notification-history.module';
import { BlankPageModule } from './blank-page/blank-page.module';

import { DirectiveModule } from './directives/directive.module';
import { PipeModule } from './pipes/pipe.module';

import { AlfrescoApiService } from './services/alfresco-api.service';
import { TranslationService } from './translation/translation.service';
import { SortingPickerModule } from './sorting-picker/sorting-picker.module';
import { IconModule } from './icon/icon.module';
import { TranslateLoaderService } from './translation/translate-loader.service';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { directionalityConfigFactory } from './common/services/directionality-config-factory';
import { DirectionalityConfigService } from './common/services/directionality-config.service';
import { SearchTextModule } from './search-text/search-text-input.module';
import { AlfrescoJsClientsModule } from '@alfresco/adf-core/api';
import { AuthenticationInterceptor, Authentication } from '@alfresco/adf-core/auth';
import { LegacyApiClientModule } from './api-factories/legacy-api-client.module';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationService } from './auth/services/authentication.service';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { IdentityUserInfoModule } from './identity-user-info/identity-user-info.module';
import { loadAppConfig } from './app-config/app-config.loader';
import { AppConfigService } from './app-config/app-config.service';
import { StorageService } from './common/services/storage.service';
import { AlfrescoApiLoaderService, createAlfrescoApiInstance } from './api-factories/alfresco-api-v2-loader.service';
import { AlfrescoApiServiceWithAngularBasedHttpClient } from './api-factories/alfresco-api-service-with-angular-based-http-client';

interface Config {
    readonly useAngularBasedHttpClientInAlfrescoJs: boolean;
}

const defaultConfig: Config = { useAngularBasedHttpClientInAlfrescoJs: false };

@NgModule({
    imports: [
        TranslateModule,
        ExtensionsModule,
        AboutModule,
        ViewerModule,
        SidenavLayoutModule,
        PipeModule,
        CommonModule,
        IdentityUserInfoModule,
        DirectiveModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        AppConfigModule,
        PaginationModule,
        ToolbarModule,
        ContextMenuModule,
        CardViewModule,
        FormBaseModule,
        CommentsModule,
        CommentListModule,
        LoginModule,
        LanguageMenuModule,
        InfoDrawerModule,
        DataTableModule,
        ButtonsMenuModule,
        TemplateModule,
        IconModule,
        SortingPickerModule,
        NotificationHistoryModule,
        SearchTextModule,
        BlankPageModule,
        LegacyApiClientModule,
        AlfrescoJsClientsModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'CSRF-TOKEN',
            headerName: 'X-CSRF-TOKEN'
        })
    ],
    exports: [
        AboutModule,
        ViewerModule,
        SidenavLayoutModule,
        PipeModule,
        CommonModule,
        DirectiveModule,
        ClipboardModule,
        FormsModule,
        IdentityUserInfoModule,
        ReactiveFormsModule,
        MaterialModule,
        AppConfigModule,
        PaginationModule,
        ToolbarModule,
        ContextMenuModule,
        CardViewModule,
        FormBaseModule,
        CommentsModule,
        CommentListModule,
        LoginModule,
        LanguageMenuModule,
        InfoDrawerModule,
        DataTableModule,
        TranslateModule,
        ButtonsMenuModule,
        TemplateModule,
        SortingPickerModule,
        IconModule,
        NotificationHistoryModule,
        SearchTextModule,
        BlankPageModule
    ]
})
export class CoreModule {
    static forRoot(config: Config = defaultConfig): ModuleWithProviders<CoreModule> {
        return {
            ngModule: CoreModule,
            providers: [
                TranslateStore,
                TranslateService,
                { provide: TranslateLoader, useClass: TranslateLoaderService },
                {
                    provide: APP_INITIALIZER,
                    useFactory: loadAppConfig,
                    deps: [ AppConfigService, StorageService ], multi: true
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: directionalityConfigFactory,
                    deps: [DirectionalityConfigService],
                    multi: true
                },
                { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
                { provide: Authentication, useClass: AuthenticationService },
                {
                    provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
                    useValue: {
                        duration: 10000
                    }
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: createAlfrescoApiInstance,
                    deps: [ AlfrescoApiLoaderService ],
                    multi: true
                },
                ...(config.useAngularBasedHttpClientInAlfrescoJs
                    ? [{ provide: AlfrescoApiService, useClass: AlfrescoApiServiceWithAngularBasedHttpClient }]
                    : []
                )
            ]
        };
    }

    static forChild(): ModuleWithProviders<CoreModule> {
        return {
            ngModule: CoreModule
        };
    }

    constructor(translation: TranslationService) {
        translation.addTranslationFolder('adf-core', 'assets/adf-core');
    }
}
