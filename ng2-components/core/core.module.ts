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

import { ViewerModule } from './viewer';
import { UserInfoModule } from './userinfo';
import { ToolbarModule } from './toolbar';
import { HostSettingsModule } from './settings';
import { PaginationModule } from './pagination';
import { AppConfigModule } from './app-config';
import { LoginModule } from './login';
import { LanguageMenuModule } from './language-menu';
import { InfoDrawerModule } from './info-drawer';
import { DataColumnModule } from './data-column';
import { DataTableModule } from './datatable';
import { ContextMenuModule } from './context-menu';
import { CollapsableModule } from './collapsable';
import { CardViewModule } from './card-view';
import { DialogModule } from './dialogs';

import { DirectiveModule } from './directives';
import { PipeModule } from './pipes';
import { LogService , ServiceModule, TranslateLoaderService } from './services';

export function createTranslateLoader(http: HttpClient, logService: LogService) {
    return new TranslateLoaderService(http, logService);
}

@NgModule({
    imports: [
        ViewerModule,
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
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient, LogService]
            }
        })
    ],
    declarations: [
    ],
    providers: [
        TranslationService,
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: '@adf/core',
                source: 'assets/@adf/core'
            }
        }
    ],
    exports: [
        AppConfigModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        TranslateModule,
        ContextMenuModule,
        CardViewModule,
        CollapsableModule,
        PaginationModule,
        ToolbarModule,
        DialogModule,
        LoginModule,
        UserInfoModule,
        LanguageMenuModule,
        InfoDrawerModule,
        DataColumnModule,
        DataTableModule,
        HostSettingsModule,
        ServiceModule,
        ViewerModule,
        PipeModule,
        DirectiveModule
    ]
})
export class CoreModule {
}
