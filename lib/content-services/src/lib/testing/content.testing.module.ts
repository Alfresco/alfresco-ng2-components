/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NgModule, APP_INITIALIZER } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
    CoreModule,
    AppConfigService,
    CookieService,
    AppConfigServiceMock,
    CookieServiceMock,
    AuthModule,
    NoopTranslateModule
} from '@alfresco/adf-core';
import { ContentModule } from '../content.module';
import { versionCompatibilityFactory } from '../version-compatibility/version-compatibility-factory';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { VersionCompatibilityService } from '../version-compatibility/version-compatibility.service';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { AlfrescoApiServiceMock } from '../mock';

@NgModule({
    imports: [
        AuthModule.forRoot({ useHash: true }),
        NoopAnimationsModule,
        RouterTestingModule,
        CoreModule,
        NoopTranslateModule,
        ContentModule,
        MatIconTestingModule
    ],
    providers: [
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        { provide: AppConfigService, useClass: AppConfigServiceMock },
        { provide: CookieService, useClass: CookieServiceMock },
        {
            provide: APP_INITIALIZER,
            useFactory: versionCompatibilityFactory,
            deps: [VersionCompatibilityService],
            multi: true
        }
    ],
    exports: [NoopAnimationsModule, CoreModule, ContentModule]
})
export class ContentTestingModule {}
