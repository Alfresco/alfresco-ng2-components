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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule, Http } from '@angular/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from 'ng2-translate/ng2-translate';
import { MaterialModule } from './src/material.module';
import { AppConfigModule } from './src/services/app-config.service';
import { AdfToolbarComponent } from './src/components/toolbar/toolbar.component';

import {
    AlfrescoAuthenticationService,
    AlfrescoContentService,
    AlfrescoSettingsService,
    StorageService,
    CookieService,
    AlfrescoApiService,
    AlfrescoTranslateLoader,
    AlfrescoTranslationService,
    RenditionsService,
    AuthGuard,
    AuthGuardEcm,
    AuthGuardBpm,
    LogService,
    LogServiceMock,
    NotificationService,
    ContentService,
    AppConfigService, InitAppConfigServiceProvider
} from './src/services/index';

import { FileSizePipe } from './src/pipes/file-size.pipe';
import { UploadDirective } from './src/directives/upload.directive';
import { DataColumnComponent } from './src/components/data-column/data-column.component';
import { DataColumnListComponent } from './src/components/data-column/data-column-list.component';
import { MATERIAL_DESIGN_DIRECTIVES } from './src/components/material/index';
import { CONTEXT_MENU_PROVIDERS, CONTEXT_MENU_DIRECTIVES } from './src/components/context-menu/index';
import { COLLAPSABLE_DIRECTIVES } from './src/components/collapsable/index';

export * from './src/services/index';
export * from './src/components/index';
export * from './src/components/data-column/data-column.component';
export * from './src/components/data-column/data-column-list.component';
export * from './src/components/collapsable/index';
export * from './src/directives/upload.directive';
export * from './src/utils/index';
export * from './src/events/base.event';
export * from './src/events/base-ui.event';
export * from './src/events/folder-created.event';

export const ALFRESCO_CORE_PROVIDERS: any[] = [
    NotificationService,
    LogService,
    LogServiceMock,
    AlfrescoAuthenticationService,
    AlfrescoContentService,
    AlfrescoSettingsService,
    StorageService,
    CookieService,
    AlfrescoApiService,
    AlfrescoTranslateLoader,
    AlfrescoTranslationService,
    RenditionsService,
    ContentService,
    AuthGuard,
    AuthGuardEcm,
    AuthGuardBpm,
    ...CONTEXT_MENU_PROVIDERS
];

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
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http, LogService]
        }),
        MaterialModule,
        AppConfigModule
    ],
    declarations: [
        ...MATERIAL_DESIGN_DIRECTIVES,
        ...CONTEXT_MENU_DIRECTIVES,
        ...COLLAPSABLE_DIRECTIVES,
        UploadDirective,
        DataColumnComponent,
        DataColumnListComponent,
        FileSizePipe,
        AdfToolbarComponent
    ],
    providers: [
        ...ALFRESCO_CORE_PROVIDERS
    ],
    exports: [
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        TranslateModule,
        MaterialModule,
        ...MATERIAL_DESIGN_DIRECTIVES,
        ...CONTEXT_MENU_DIRECTIVES,
        ...COLLAPSABLE_DIRECTIVES,
        UploadDirective,
        DataColumnComponent,
        DataColumnListComponent,
        FileSizePipe,
        AdfToolbarComponent
    ]
})
export class CoreModule {
    static forRoot(opts: any = {}): ModuleWithProviders {

        const appConfigFile = opts.appConfigFile || 'app.config.json';

        return {
            ngModule: CoreModule,
            providers: [
                ...ALFRESCO_CORE_PROVIDERS,
                AppConfigService,
                InitAppConfigServiceProvider(appConfigFile)
            ]
        };
    }
}
