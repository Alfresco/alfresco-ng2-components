/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
    AlfrescoApiService,
    AlfrescoApiServiceMock,
    AppConfigService,
    AppConfigServiceMock,
    ContextMenuModule,
    CoreModule,
    LogService,
    StorageService,
    TRANSLATION_PROVIDER,
    UserPreferencesService
} from '@alfresco/adf-core';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        HttpClientModule,
        NoopAnimationsModule,
        CoreModule.forRoot(),
        ContextMenuModule
    ],
    providers: [
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'app',
                source: 'resources'
            }
        },
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        { provide: AppConfigService, useClass: AppConfigServiceMock },
        StorageService,
        LogService,
        UserPreferencesService
    ]
})
export class ProcessServiceCloudTestingModule {}
