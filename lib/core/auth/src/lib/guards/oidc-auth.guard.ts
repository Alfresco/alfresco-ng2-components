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

import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthConfigService } from '../services/auth-config.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(
        private authConfigService: AuthConfigService,
        private oauthService: OAuthService
    ) {}

    canActivate(): boolean {
        if (!this.oauthService.hasValidAccessToken()) {
            if (this.authConfigService.isCodeFlow()) {
                this.oauthService.initCodeFlow();
            } else {
                this.oauthService.initLoginFlow();
            }
            return false;
        }

        return true;
    }

    canActivateChild(): boolean {
        return this.canActivate();
    }
}
