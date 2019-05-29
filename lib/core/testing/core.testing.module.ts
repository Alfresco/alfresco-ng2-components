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
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '../core.module';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { AlfrescoApiServiceMock } from '../mock/alfresco-api.service.mock';
import { AppConfigService } from '../app-config/app-config.service';
import { AppConfigServiceMock } from '../mock/app-config.service.mock';
import { TranslationService } from '../services/translation.service';
import { TranslationMock } from '../mock/translation.service.mock';
import { DatePipe } from '@angular/common';
import { CookieService } from '../services/cookie.service';
import { CookieServiceMock } from '../mock/cookie.service.mock';

@NgModule({
    imports: [NoopAnimationsModule, RouterTestingModule, CoreModule.forRoot()],
    providers: [
        DatePipe,
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        { provide: AppConfigService, useClass: AppConfigServiceMock },
        { provide: TranslationService, useClass: TranslationMock },
        { provide: CookieService, useClass: CookieServiceMock }

    ],
    exports: [
        NoopAnimationsModule
    ]
})
export class CoreTestingModule {}
