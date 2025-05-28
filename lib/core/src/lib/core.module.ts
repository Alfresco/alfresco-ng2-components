/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { APP_INITIALIZER, NgModule, ModuleWithProviders } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateStore, TranslateService } from '@ngx-translate/core';
import { ABOUT_DIRECTIVES } from './about/about.module';
import { CARD_VIEW_DIRECTIVES } from './card-view/card-view.module';
import { CONTEXT_MENU_DIRECTIVES } from './context-menu/context-menu.module';
import { DATATABLE_DIRECTIVES } from './datatable/datatable.module';
import { INFO_DRAWER_DIRECTIVES } from './info-drawer/info-drawer.module';
import { LANGUAGE_MENU_DIRECTIVES } from './language-menu/language-menu.module';
import { LOGIN_DIRECTIVES } from './login/login.module';
import { PAGINATION_DIRECTIVES } from './pagination/pagination.module';
import { TOOLBAR_DIRECTIVES } from './toolbar/toolbar.module';
import { FormBaseModule } from './form/form-base.module';
import { LAYOUT_DIRECTIVES } from './layout/layout.module';
import { CommentsComponent } from './comments/comments.component';
import { CommentListComponent } from './comments/comment-list/comment-list.component';
import { TEMPLATE_DIRECTIVES } from './templates/template.module';
import { CLIPBOARD_DIRECTIVES } from './clipboard/clipboard.module';
import { NOTIFICATION_HISTORY_DIRECTIVES } from './notifications/notification-history.module';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { CORE_DIRECTIVES } from './directives/directive.module';
import { CORE_PIPES } from './pipes/pipe.module';
import { TranslationService } from './translation/translation.service';
import { TranslateLoaderService } from './translation/translate-loader.service';
import { SEARCH_TEXT_INPUT_DIRECTIVES } from './search-text/search-text-input.module';
import { AdfHttpClient } from '@alfresco/adf-core/api';
import { AuthenticationInterceptor, Authentication } from '@alfresco/adf-core/auth';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationService } from './auth/services/authentication.service';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { loadAppConfig } from './app-config/app-config.loader';
import { AppConfigService } from './app-config/app-config.service';
import { StorageService } from './common/services/storage.service';
import { MomentDateAdapter } from './common/utils/moment-date-adapter';
import { AppConfigPipe, StoragePrefixFactory } from './app-config';
import { IconComponent } from './icon';
import { SortingPickerComponent } from './sorting-picker';
import { DynamicChipListComponent } from './dynamic-chip-list';
import { IdentityUserInfoComponent } from './identity-user-info';
import { UnsavedChangesDialogComponent } from './dialogs';
import { MaterialModule } from './material.module';

@NgModule({
    imports: [
        TranslateModule,
        ...ABOUT_DIRECTIVES,
        ...LAYOUT_DIRECTIVES,
        ...CORE_PIPES,
        IdentityUserInfoComponent,
        ...CORE_DIRECTIVES,
        AppConfigPipe,
        ...PAGINATION_DIRECTIVES,
        ...TOOLBAR_DIRECTIVES,
        ...CONTEXT_MENU_DIRECTIVES,
        ...CARD_VIEW_DIRECTIVES,
        FormBaseModule,
        CommentsComponent,
        CommentListComponent,
        ...CLIPBOARD_DIRECTIVES,
        ...LOGIN_DIRECTIVES,
        ...LANGUAGE_MENU_DIRECTIVES,
        ...INFO_DRAWER_DIRECTIVES,
        ...DATATABLE_DIRECTIVES,
        ...TEMPLATE_DIRECTIVES,
        IconComponent,
        SortingPickerComponent,
        ...NOTIFICATION_HISTORY_DIRECTIVES,
        ...SEARCH_TEXT_INPUT_DIRECTIVES,
        BlankPageComponent,
        UnsavedChangesDialogComponent,
        DynamicChipListComponent,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'CSRF-TOKEN',
            headerName: 'X-CSRF-TOKEN'
        }),
        MaterialModule
    ],
    providers: [...CORE_PIPES],
    exports: [
        ...ABOUT_DIRECTIVES,
        ...LAYOUT_DIRECTIVES,
        ...CORE_PIPES,
        ...CORE_DIRECTIVES,
        ...CLIPBOARD_DIRECTIVES,
        IdentityUserInfoComponent,
        AppConfigPipe,
        ...PAGINATION_DIRECTIVES,
        ...TOOLBAR_DIRECTIVES,
        ...CONTEXT_MENU_DIRECTIVES,
        ...CARD_VIEW_DIRECTIVES,
        FormBaseModule,
        CommentsComponent,
        CommentListComponent,
        ...LOGIN_DIRECTIVES,
        ...LANGUAGE_MENU_DIRECTIVES,
        ...INFO_DRAWER_DIRECTIVES,
        ...DATATABLE_DIRECTIVES,
        TranslateModule,
        ...TEMPLATE_DIRECTIVES,
        SortingPickerComponent,
        IconComponent,
        ...NOTIFICATION_HISTORY_DIRECTIVES,
        ...SEARCH_TEXT_INPUT_DIRECTIVES,
        BlankPageComponent,
        UnsavedChangesDialogComponent,
        DynamicChipListComponent,
        MaterialModule
    ]
})
export class CoreModule {
    static forRoot(): ModuleWithProviders<CoreModule> {
        return {
            ngModule: CoreModule,
            providers: [
                TranslateStore,
                TranslateService,
                { provide: TranslateLoader, useClass: TranslateLoaderService },
                MomentDateAdapter,
                StoragePrefixFactory,
                {
                    provide: APP_INITIALIZER,
                    useFactory: loadAppConfig,
                    deps: [AppConfigService, StorageService, AdfHttpClient, StoragePrefixFactory],
                    multi: true
                },
                { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
                { provide: Authentication, useClass: AuthenticationService },
                {
                    provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
                    useValue: {
                        duration: 10000
                    }
                }
            ]
        };
    }

    /**
     * @deprecated this api is deprecated, import `CoreModule` instead
     * @returns ModuleWithProviders<CoreModule>
     */
    static forChild(): ModuleWithProviders<CoreModule> {
        return {
            ngModule: CoreModule
        };
    }

    constructor(translation: TranslationService) {
        translation.addTranslationFolder('adf-core', 'assets/adf-core');
    }
}
