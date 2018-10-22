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
import { ClipboardModule } from './clipboard/clipboard.module';

import { DirectiveModule } from './directives/directive.module';
import { PipeModule } from './pipes/pipe.module';

import { AlfrescoApiService } from './services/alfresco-api.service';
import { LogService } from './services/log.service';
import { TranslateLoaderService } from './services/translate-loader.service';
import { TranslationService } from './services/translation.service';
import { startupServiceFactory } from './services/startup-service-factory';
import { SortingPickerModule } from './sorting-picker/sorting-picker.module';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateLoaderService(http);
}

@NgModule({
    imports: [
        AboutModule,
        ViewerModule,
        SidenavLayoutModule,
        PipeModule,
        CommonModule,
        DirectiveModule,
        ClipboardModule,
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
        ClipboardModule,
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
        ClipboardModule,
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
