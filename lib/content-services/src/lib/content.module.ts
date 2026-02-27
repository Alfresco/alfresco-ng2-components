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

import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { provideTranslations } from '@alfresco/adf-core';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { DOCUMENT_LIST_DIRECTIVES } from './document-list/document-list.module';
import { CONTENT_SEARCH_DIRECTIVES } from './search/search.module';
import { CONTENT_NODE_SHARE_DIRECTIVES } from './content-node-share/content-node-share.module';
import { CONTENT_DIRECTIVES } from './directives/content-directive.module';
import { CONTENT_PERMISSION_MANAGER_DIRECTIVES } from './permission-manager/permission-manager.module';
import { versionCompatibilityFactory } from './version-compatibility/version-compatibility-factory';
import { VersionCompatibilityService } from './version-compatibility/version-compatibility.service';
import { contentAuthLoaderFactory } from './auth-loader/content-auth-loader-factory';
import { ContentAuthLoaderService } from './auth-loader/content-auth-loader.service';
import { MaterialModule } from './material.module';
import { AlfrescoApiService } from './services/alfresco-api.service';
import { AlfrescoApiNoAuthService } from './api-factories/alfresco-api-no-auth.service';
import { AlfrescoApiLoaderService, createAlfrescoApiInstance } from './api-factories/alfresco-api-v2-loader.service';

@NgModule({
    imports: [
        MaterialModule,
        MatDatetimepickerModule,
        MatNativeDatetimeModule,
        ...CONTENT_SEARCH_DIRECTIVES,
        ...DOCUMENT_LIST_DIRECTIVES,
        ...CONTENT_NODE_SHARE_DIRECTIVES,
        ...CONTENT_DIRECTIVES,
        ...CONTENT_PERMISSION_MANAGER_DIRECTIVES
    ],
    providers: [provideTranslations('adf-content-services', 'assets/adf-content-services')],
    exports: [
        MaterialModule,
        ...DOCUMENT_LIST_DIRECTIVES,
        ...CONTENT_SEARCH_DIRECTIVES,
        ...CONTENT_NODE_SHARE_DIRECTIVES,
        ...CONTENT_DIRECTIVES,
        ...CONTENT_PERMISSION_MANAGER_DIRECTIVES
    ]
})
export class ContentModule {
    static forRoot(): ModuleWithProviders<ContentModule> {
        return {
            ngModule: ContentModule,
            providers: [
                provideTranslations('adf-content-services', 'assets/adf-content-services'),
                ContentAuthLoaderService,
                { provide: AlfrescoApiService, useClass: AlfrescoApiNoAuthService },
                {
                    provide: APP_INITIALIZER,
                    useFactory: versionCompatibilityFactory,
                    deps: [VersionCompatibilityService],
                    multi: true
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: contentAuthLoaderFactory,
                    deps: [ContentAuthLoaderService],
                    multi: true
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: createAlfrescoApiInstance,
                    deps: [AlfrescoApiLoaderService],
                    multi: true
                }
            ]
        };
    }

    /**
     * @deprecated use `ContentModule` instead
     * @returns ModuleWithProviders<ContentModule>
     */
    static forChild(): ModuleWithProviders<ContentModule> {
        return {
            ngModule: ContentModule
        };
    }
}
