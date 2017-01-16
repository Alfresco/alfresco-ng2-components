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
import { HttpModule, Http } from '@angular/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from 'ng2-translate/ng2-translate';

import {
    AlfrescoAuthenticationService,
    AlfrescoContentService,
    AlfrescoSettingsService,
    StorageService,
    AlfrescoApiService,
    AlfrescoTranslateLoader,
    AlfrescoTranslationService,
    RenditionsService,
    AuthGuard,
    AuthGuardEcm,
    AuthGuardBpm,
    LogService, LogServiceMock
} from './src/services/index';

import { MATERIAL_DESIGN_DIRECTIVES } from './src/components/material/index';
import { CONTEXT_MENU_PROVIDERS, CONTEXT_MENU_DIRECTIVES } from './src/components/context-menu/index';

export * from './src/services/index';
export * from './src/components/index';
export * from './src/utils/index';

export const ALFRESCO_CORE_PROVIDERS: any[] = [
    LogService, LogServiceMock,
    AlfrescoAuthenticationService,
    AlfrescoContentService,
    AlfrescoSettingsService,
    StorageService,
    AlfrescoApiService,
    AlfrescoTranslateLoader,
    AlfrescoTranslationService,
    RenditionsService,
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
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http, LogService]
        })
    ],
    declarations: [
        ...MATERIAL_DESIGN_DIRECTIVES,
        ...CONTEXT_MENU_DIRECTIVES
    ],
    providers: [
        ...ALFRESCO_CORE_PROVIDERS
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        TranslateModule,
        ...MATERIAL_DESIGN_DIRECTIVES,
        ...CONTEXT_MENU_DIRECTIVES
    ]
})
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                ...ALFRESCO_CORE_PROVIDERS
            ]
        };
    }
}
