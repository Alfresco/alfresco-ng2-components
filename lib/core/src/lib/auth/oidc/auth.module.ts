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

import { APP_INITIALIZER, inject, ModuleWithProviders, NgModule, InjectionToken } from '@angular/core';
import { AUTH_CONFIG, OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { AuthenticationService } from '../services/authentication.service';
import { AuthModuleConfig, AUTH_MODULE_CONFIG } from './auth-config';
import { authConfigFactory, AuthConfigService } from './auth-config.service';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './auth.service';
import { RedirectAuthService } from './redirect-auth.service';
import { AuthenticationConfirmationComponent } from './view/authentication-confirmation/authentication-confirmation.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { StorageService } from '../../common/services/storage.service';

export const JWT_STORAGE_SERVICE = new InjectionToken<OAuthStorage>('JWT_STORAGE_SERVICE', {
    providedIn: 'root',
    factory: () => inject(StorageService)
});

/**
 * Create a Login Factory function
 *
 * @param redirectService auth redirect service
 * @returns a factory function
 */
export function loginFactory(redirectService: RedirectAuthService): () => Promise<boolean> {
    return () => redirectService.init();
}

/**
 *  @returns current instance of OAuthStorage
 */
export function oauthStorageFactory(): OAuthStorage {
    return inject(JWT_STORAGE_SERVICE);
}

@NgModule({
    imports: [AuthRoutingModule, OAuthModule.forRoot(), AuthenticationConfirmationComponent],
    providers: [
        { provide: OAuthStorage, useFactory: oauthStorageFactory },
        { provide: AuthenticationService },
        {
            provide: AUTH_CONFIG,
            useFactory: authConfigFactory,
            deps: [AuthConfigService]
        },
        RedirectAuthService,
        { provide: AuthService, useExisting: RedirectAuthService },
        {
            provide: APP_INITIALIZER,
            useFactory: loginFactory,
            deps: [RedirectAuthService],
            multi: true
        },
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
