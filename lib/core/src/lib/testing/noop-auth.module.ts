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

import { APP_INITIALIZER, Injectable, NgModule } from '@angular/core';
import { AuthModule, JWT_STORAGE_SERVICE, RedirectAuthService } from '../auth';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppConfigService, StoragePrefixFactory } from '../app-config';
import { AppConfigServiceMock, CookieService, StorageService } from '../common';
import { CookieServiceMock } from '../mock';
import { EMPTY, of } from 'rxjs';
import { loadAppConfig } from '../app-config/app-config.loader';
import { AdfHttpClient } from '@alfresco/adf-core/api';

@Injectable({ providedIn: 'root' })
export class NoopRedirectAuthService extends RedirectAuthService {
    onLogin = EMPTY;
    onTokenReceived = of();

    init(): Promise<boolean> {
        return Promise.resolve(true);
    }
}

@NgModule({
    imports: [AuthModule.forRoot({ useHash: true }), HttpClientTestingModule, RouterTestingModule],
    providers: [
        { provide: AppConfigService, useClass: AppConfigServiceMock },
        { provide: CookieService, useClass: CookieServiceMock },
        { provide: RedirectAuthService, useClass: NoopRedirectAuthService },
        {
            provide: APP_INITIALIZER,
            useFactory: loadAppConfig,
            deps: [AppConfigService, StorageService, AdfHttpClient, StoragePrefixFactory],
            multi: true
        },
        { provide: JWT_STORAGE_SERVICE, useClass: StorageService }
    ]
})
export class NoopAuthModule {}
