/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Inject, Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { take } from 'rxjs/operators';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { OauthConfigModel } from '../models/oauth-config.model';
import { AuthModuleConfig, AUTH_MODULE_CONFIG } from './auth-config';

export function authConfigFactory(authConfigService: AuthConfigService): Promise<AuthConfig> {
    return authConfigService.loadConfig();
}

@Injectable({
    providedIn: 'root'
})
export class AuthConfigService {
    constructor(
        private appConfigService: AppConfigService,
        @Inject(AUTH_MODULE_CONFIG) private readonly authModuleConfig: AuthModuleConfig
    ) {}

    private _authConfig!: AuthConfig;
    get authConfig(): AuthConfig {
        return this._authConfig;
    }

    loadConfig(): Promise<AuthConfig> {
        return this.appConfigService.onLoad.pipe(take(1)).toPromise().then(this.loadAppConfig.bind(this));
    }

    loadAppConfig(): AuthConfig {
        const oauth2: OauthConfigModel = Object.assign({}, this.appConfigService.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null));
        const origin = this.getLocationOrigin();
        const redirectUri = this.getRedirectUri();

        const authConfig: AuthConfig = {
            oidc: oauth2.implicitFlow || oauth2.codeFlow || false,
            issuer: oauth2.host,
            redirectUri,
            silentRefreshRedirectUri: `${origin}/silent-refresh.html`,
            postLogoutRedirectUri: `${origin}/${oauth2.redirectUriLogout}`,
            clientId: oauth2.clientId,
            scope: oauth2.scope,
            dummyClientSecret: oauth2.secret || '',
            ...(oauth2.codeFlow && { responseType: 'code' })
        };

        return authConfig;
    }

    getRedirectUri(): string {
        // required for this package as we handle the returned token on this view, with is provided by the AuthModule
        const viewUrl = `view/authentication-confirmation`;
        const useHash = this.authModuleConfig.useHash;

        const redirectUri = useHash
            ? `${this.getLocationOrigin()}/#/${viewUrl}`
            : `${this.getLocationOrigin()}/${viewUrl}`;

        const oauth2: OauthConfigModel = Object.assign({}, this.appConfigService.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null));

        // handle issue from the OIDC library with hashStrategy and implicitFlow, with would append &state to the url with would lead to error
        // `cannot match any routes`, and displaying the wildcard ** error page
        return oauth2.implicitFlow && useHash ? `${redirectUri}/?` : redirectUri;
    }

    private getLocationOrigin() {
        return window.location.origin;
    }
}
