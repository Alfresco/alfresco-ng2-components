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
import { HttpClientModule } from '@angular/common/http';
import {
    AlfrescoApiService,
    AlfrescoApiServiceMock,
    AppConfigService,
    AppConfigServiceMock,
    TranslationService,
    TranslationMock,
    ContextMenuModule,
    CoreModule
} from '@alfresco/adf-core';

@NgModule({
    imports: [
        HttpClientModule,
        NoopAnimationsModule,
        CoreModule.forRoot(),
        ContextMenuModule
    ],
    providers: [
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        { provide: AppConfigService, useClass: AppConfigServiceMock },
        { provide: TranslationService, useClass: TranslationMock }
    ]
})
export class ProcessServiceCloudTestingModule {}
