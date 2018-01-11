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
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { TRANSLATION_PROVIDER, TranslationService } from './services/translation.service';

import { MaterialModule } from './material.module';

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
import { SideBarActionModule } from './sidebar/sidebar-action.module';

import { DirectiveModule } from './directives/directive.module';
import { PipeModule } from './pipes/pipe.module';
import { ServiceModule } from './services/service.module';
import { LogService } from './services/log.service';
import { TranslateLoaderService } from './services/translate-loader.service';

export function createTranslateLoader(http: HttpClient, logService: LogService) {
    return new TranslateLoaderService(http, logService);
}

@NgModule({
    imports: [
        ViewerModule,
        SideBarActionModule,
        PipeModule,
        CommonModule,
        DirectiveModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        HostSettingsModule,
        UserInfoModule,
        MaterialModule,
        AppConfigModule,
        PaginationModule,
        ToolbarModule,
        ContextMenuModule,
        CardViewModule,
        CollapsableModule,
        ServiceModule,
        FormModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient, LogService]
            }
        })
    ],
    providers: [
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'adf-core',
                source: 'assets/adf-core'
            }
        },
        TranslationService
    ],
    exports: [
        AppConfigModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        ContextMenuModule,
        CardViewModule,
        CollapsableModule,
        PaginationModule,
        ToolbarModule,
        LoginModule,
        UserInfoModule,
        LanguageMenuModule,
        InfoDrawerModule,
        DataColumnModule,
        DataTableModule,
        HostSettingsModule,
        ServiceModule,
        ViewerModule,
        SideBarActionModule,
        PipeModule,
        DirectiveModule,
        FormModule,
        MaterialModule
    ]
})
export class CoreModule {
}
