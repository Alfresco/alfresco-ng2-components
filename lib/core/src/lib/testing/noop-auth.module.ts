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

import { NgModule } from '@angular/core';
import { AuthModule, RedirectAuthService } from '../auth';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppConfigService } from '../app-config';
import { AppConfigServiceMock, CookieService } from '../common';
import { CookieServiceMock } from '../mock';
import { EMPTY, of } from 'rxjs';

@NgModule({
    imports: [AuthModule.forRoot({ useHash: true }), HttpClientTestingModule, RouterTestingModule],
    providers: [
        { provide: AppConfigService, useClass: AppConfigServiceMock },
        { provide: CookieService, useClass: CookieServiceMock },
        { provide: RedirectAuthService, useValue: { onLogin: EMPTY, init: () => {}, onTokenReceived: of() } }
    ]
})
export class NoopAuthModule {}
