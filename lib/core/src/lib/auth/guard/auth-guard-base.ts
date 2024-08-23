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

import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { OauthConfigModel } from '../models/oauth-config.model';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from '../../common/services/storage.service';
import { BasicAlfrescoAuthService } from '../basic-auth/basic-alfresco-auth.service';
import { OidcAuthenticationService } from '../oidc/oidc-authentication.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardBaseService {
    constructor(
        private authenticationService: AuthenticationService,
        private basicAlfrescoAuthService: BasicAlfrescoAuthService,
        private oidcAuthenticationService: OidcAuthenticationService,
        private router: Router,
        private appConfigService: AppConfigService,
        private dialog: MatDialog,
        private storageService: StorageService
    ) {}

    get withCredentials(): boolean {
        return this.appConfigService.get<boolean>('auth.withCredentials', false);
    }

    async redirectSSOSuccessURL(): Promise<boolean> {
        const redirectFragment = this.storageService.getItem('loginFragment');

        if (redirectFragment && this.getLoginRoute() !== redirectFragment) {
            await this.navigate(redirectFragment);
            this.storageService.removeItem('loginFragment');
            return false;
        }

        return true;
    }

    isLoginFragmentPresent(): boolean {
        return !!this.storageService.getItem('loginFragment');
    }

    async redirectToUrl(url: string): Promise<boolean> {
        let urlToRedirect = `/${this.getLoginRoute()}`;

        if (!this.authenticationService.isOauth()) {
            this.basicAlfrescoAuthService.setRedirect({
                provider: this.getProvider(),
                url
            });

            urlToRedirect = `${urlToRedirect}?redirectUrl=${url}`;
            return this.navigate(urlToRedirect);
        } else if (this.getOauthConfig().silentLogin && !this.oidcAuthenticationService.isPublicUrl()) {
            if (!this.oidcAuthenticationService.hasValidIdToken() || !this.oidcAuthenticationService.hasValidAccessToken()) {
                this.oidcAuthenticationService.ssoLogin(url);
            }
        } else {
            return this.navigate(urlToRedirect);
        }

        return false;
    }

    async navigate(url: string): Promise<boolean> {
        this.dialog.closeAll();
        await this.router.navigateByUrl(this.router.parseUrl(url));
        return false;
    }

    private getOauthConfig(): OauthConfigModel {
        return this.appConfigService?.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null);
    }

    private getLoginRoute(): string {
        return this.appConfigService.get<string>(AppConfigValues.LOGIN_ROUTE, 'login');
    }

    private getProvider(): string {
        return this.appConfigService.get<string>(AppConfigValues.PROVIDERS, 'ALL');
    }

    isOAuthWithoutSilentLogin(): boolean {
        const oauth = this.appConfigService.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null);
        return this.authenticationService.isOauth() && !!oauth && !oauth.silentLogin;
    }

    isSilentLogin(): boolean {
        const oauth = this.appConfigService.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null);

        return this.authenticationService.isOauth() && oauth && oauth.silentLogin;
    }
}
