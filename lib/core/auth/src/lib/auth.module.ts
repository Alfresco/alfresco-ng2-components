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

import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
// import { AuthenticationService } from '@alfresco/adf-core';
import { AuthGuard } from './guards/oidc-auth.guard';
import { AuthConfigService, configureAuth } from './services/auth-config.service';
// import { AuthService } from './services/oidc-authentication.service';

@NgModule({
    imports: [
        HttpClientModule,
        OAuthModule.forRoot()
    ],
    providers: [
        AuthGuard,
        AuthConfigService,
        // AuthService,
        {
            provide: APP_INITIALIZER,
            useFactory: configureAuth,
            deps: [ AuthConfigService ]
        },
        // TODO: CANARY: This is temporary, we are reproviding ADF's AuthenticationService with our own implementation to work with the new auth library
        // TODO: But we need definitely need a cleaner solution for this. Which means, first we need to make the apis capable of handling multiple http clients
        // {
        //     provide: AuthenticationService,
        //     useExisting: AuthService
        // }
    ]
})
export class AuthModule {}
