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

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AuthenticationService } from '../../services';
import { OIDCAuthGuard } from './oidc-auth.guard';
import { OIDCAuthentication, configureOIDCAuthentication } from './oidc-authentication';
import { OIDCAuthenticationService } from './oidc-authentication.service';

@NgModule({
    imports: [
        OAuthModule.forRoot()
    ],
    providers: [
        OIDCAuthGuard,
        OIDCAuthentication,
        OIDCAuthenticationService,
        {
            provide: APP_INITIALIZER,
            useFactory: configureOIDCAuthentication,
            deps: [ OIDCAuthentication ], multi: true
        },
        {
            provide: AuthenticationService,
            useExisting: OIDCAuthenticationService
        }
    ]
})
export class OIDCAuthModule {}
