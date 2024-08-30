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
import { CoreModule } from '../core.module';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { AlfrescoApiServiceMock } from '../mock/alfresco-api.service.mock';
import { AppConfigService } from '../app-config/app-config.service';
import { AppConfigServiceMock } from '../common/mock/app-config.service.mock';
import { DatePipe } from '@angular/common';
import { CookieService } from '../common/services/cookie.service';
import { CookieServiceMock } from '../mock/cookie.service.mock';
import { HttpClientModule } from '@angular/common/http';
import { directionalityConfigFactory } from '../common/services/directionality-config-factory';
import { DirectionalityConfigService } from '../common/services/directionality-config.service';
import { AuthModule, RedirectAuthService } from '../auth';
import { EMPTY, of } from 'rxjs';
import { NoopTranslateModule } from './noop-translate.module';

@NgModule({
    imports: [
        AuthModule.forRoot({ useHash: true }),
        NoopAnimationsModule,
        RouterTestingModule,
        HttpClientModule,
        CoreModule.forRoot(),
        NoopTranslateModule
    ],
    providers: [
        DatePipe,
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        { provide: AppConfigService, useClass: AppConfigServiceMock },
        { provide: CookieService, useClass: CookieServiceMock },
        {
            provide: APP_INITIALIZER,
            useFactory: directionalityConfigFactory,
            deps: [DirectionalityConfigService],
            multi: true
        },
        { provide: RedirectAuthService, useValue: { onLogin: EMPTY, init: () => {}, onTokenReceived: of() } }
    ],
    exports: [NoopAnimationsModule, CoreModule, RouterTestingModule]
})
export class CoreTestingModule {}
