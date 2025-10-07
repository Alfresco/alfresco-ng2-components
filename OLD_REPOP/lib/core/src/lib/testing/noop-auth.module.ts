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

import { EnvironmentProviders, Injectable, NgModule, Provider } from '@angular/core';
import { JWT_STORAGE_SERVICE, provideCoreAuth } from '../auth/oidc/auth.module';
import { RedirectAuthService } from '../auth/oidc/redirect-auth.service';
import { AppConfigService, provideAppConfig } from '../app-config';
import { AppConfigServiceMock, CookieService, StorageService } from '../common';
import { CookieServiceMock } from '../mock';
import { EMPTY, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NoopRedirectAuthService extends RedirectAuthService {
    onLogin = EMPTY;
    onTokenReceived = of();

    init(): Promise<boolean> {
        return Promise.resolve(true);
    }
}

/**
 * Provides testing api for Core Auth layer
 *
 * Example:
 * ```typescript
 * TestBed.configureTestingModule({
 *     providers: [provideCoreAuthTesting()]
 * });
 * ```
 *
 * @returns list of Angular providers
 */
export function provideCoreAuthTesting(): (Provider | EnvironmentProviders)[] {
    return [
        provideCoreAuth({ useHash: true }),
        { provide: AppConfigService, useClass: AppConfigServiceMock },
        { provide: CookieService, useClass: CookieServiceMock },
        { provide: RedirectAuthService, useClass: NoopRedirectAuthService },
        provideAppConfig(),
        { provide: JWT_STORAGE_SERVICE, useClass: StorageService }
    ];
}

/* @deprecated use `provideCoreAuthTesting()` instead */
@NgModule({
    providers: [...provideCoreAuthTesting()]
})
export class NoopAuthModule {}
