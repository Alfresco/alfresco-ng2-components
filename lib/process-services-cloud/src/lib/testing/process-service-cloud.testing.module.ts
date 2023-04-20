/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    CoreModule
} from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessServicesCloudModule } from '../process-services-cloud.module';
import { RouterTestingModule } from '@angular/router/testing';

@NgModule({
    imports: [
        HttpClientModule,
        NoopAnimationsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        CoreModule.forRoot(),
        ProcessServicesCloudModule.forRoot()
    ],
    providers: [
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        { provide: AppConfigService, useClass: AppConfigServiceMock },
        { provide: TranslationService, useClass: TranslationMock }
    ],
    exports: [
        NoopAnimationsModule,
        TranslateModule,
        CoreModule,
        ProcessServicesCloudModule
    ]
})
export class ProcessServiceCloudTestingModule {}
