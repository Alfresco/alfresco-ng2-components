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

import { inject, ModuleWithProviders, NgModule, InjectionToken, provideAppInitializer, EnvironmentProviders, Provider } from '@angular/core';
import { AUTH_CONFIG, OAuthStorage, provideOAuthClient } from 'angular-oauth2-oidc';
import { AuthenticationService } from '../services/authentication.service';
import { AuthModuleConfig, AUTH_MODULE_CONFIG } from './auth-config';
import { authConfigFactory, AuthConfigService } from './auth-config.service';
import { AuthService } from './auth.service';
import { RedirectAuthService } from './redirect-auth.service';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { StorageService } from '../../common/services/storage.service';
import { provideRouter } from '@angular/router';
import { AUTH_ROUTES } from './auth.routes';

export const JWT_STORAGE_SERVICE = new InjectionToken<OAuthStorage>('JWT_STORAGE_SERVICE', {
    providedIn: 'root',
    factory: () => inject(StorageService)
});

/**
 *  @returns current instance of OAuthStorage
 */
export function oauthStorageFactory(): OAuthStorage {
    return inject(JWT_STORAGE_SERVICE);
}

/**
 * Provides core authentication api
 *
 * @param config Optional configuration parameters
 * @returns Angular providers
 */
export function provideCoreAuth(config: AuthModuleConfig = { useHash: false }): (Provider | EnvironmentProviders)[] {
    config.preventClearHashAfterLogin = config.preventClearHashAfterLogin ?? true;
    return [
        provideHttpClient(),
        provideOAuthClient(),
        provideRouter(AUTH_ROUTES),
        { provide: OAuthStorage, useFactory: oauthStorageFactory },
        AuthenticationService,
        {
            provide: AUTH_CONFIG,
            useFactory: authConfigFactory,
            deps: [AuthConfigService]
        },
        RedirectAuthService,
        { provide: AuthService, useExisting: RedirectAuthService },
        provideAppInitializer(() => {
            const redirectService = inject(RedirectAuthService);
            return redirectService.init();
        }),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        { provide: AUTH_MODULE_CONFIG, useValue: config }
    ];
}

/** @deprecated use `provideCoreAuth()` provider api instead */
@NgModule({
    providers: [
        provideHttpClient(),
        provideOAuthClient(),
        provideRouter(AUTH_ROUTES),
        { provide: OAuthStorage, useFactory: oauthStorageFactory },
        AuthenticationService,
        {
            provide: AUTH_CONFIG,
            useFactory: authConfigFactory,
            deps: [AuthConfigService]
        },
        RedirectAuthService,
        { provide: AuthService, useExisting: RedirectAuthService },
        provideAppInitializer(() => {
            const redirectService = inject(RedirectAuthService);
            return redirectService.init();
        }),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ]
})
export class AuthModule {
    static forRoot(config: AuthModuleConfig = { useHash: false }): ModuleWithProviders<AuthModule> {
        config.preventClearHashAfterLogin = config.preventClearHashAfterLogin ?? true;
        return {
            ngModule: AuthModule,
            providers: [{ provide: AUTH_MODULE_CONFIG, useValue: config }]
        };
    }
}
