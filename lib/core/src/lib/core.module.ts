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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { TranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { ABOUT_DIRECTIVES } from './about/about.module';
import { CARD_VIEW_DIRECTIVES } from './card-view/card-view.module';
import { CONTEXT_MENU_DIRECTIVES } from './context-menu/context-menu.module';
import { DATATABLE_DIRECTIVES } from './datatable/datatable.module';
import { INFO_DRAWER_DIRECTIVES } from './info-drawer/info-drawer.module';
import { LANGUAGE_MENU_DIRECTIVES } from './language-menu/language-menu.module';
import { LOGIN_DIRECTIVES } from './login/login.module';
import { PAGINATION_DIRECTIVES } from './pagination/pagination.module';
import { TOOLBAR_DIRECTIVES } from './toolbar/toolbar.module';
import { VIEWER_DIRECTIVES } from './viewer/viewer.module';
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
import { TranslateLoaderService } from './translation/translate-loader.service';
import { SEARCH_TEXT_INPUT_DIRECTIVES } from './search-text/search-text-input.module';
import { HttpClient } from '@angular/common/http';
import { AppConfigPipe } from './app-config';
import { IconComponent } from './icon';
import { SortingPickerComponent } from './sorting-picker';
import { DynamicChipListComponent } from './dynamic-chip-list';
import { IdentityUserInfoComponent } from './identity-user-info';
import { UnsavedChangesDialogComponent } from './dialogs';
import { MaterialModule } from './material.module';
import { provideAppConfig } from './app-config/provide-app-config';

/**
 * @deprecated this module is deprecated and will be removed
 * Use the following combination instead:
 * ```typescript
 * providers: [
 *  provideI18N(...),
 *  provideAppConfig(),
 *  provideCoreAuth(...)
 * ]
 * ```
 */
@NgModule({
    imports: [
        ...ABOUT_DIRECTIVES,
        ...VIEWER_DIRECTIVES,
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
        MaterialModule
    ],
    providers: [...CORE_PIPES],
    exports: [
        ...ABOUT_DIRECTIVES,
        ...VIEWER_DIRECTIVES,
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
                provideTranslateService({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateLoaderService,
                        deps: [HttpClient]
                    },
                    defaultLanguage: 'en'
                }),
                provideAppConfig()
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
}
