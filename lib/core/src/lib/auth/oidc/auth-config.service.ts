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

import { Inject, Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { take } from 'rxjs/operators';
import { AppConfigService } from '../../app-config/app-config.service';
import { AUTH_MODULE_CONFIG, AuthModuleConfig } from './auth-config';
import { OauthConfigModel } from '../models/oauth-config.model';

/**
 * Create auth configuration factory
 *
 * @param authConfigService auth config service
 * @returns factory function
 */
export function authConfigFactory(authConfigService: AuthConfigService): Promise<AuthConfig> {
    return authConfigService.loadConfig();
}

@Injectable({
    providedIn: 'root'
})
export class AuthConfigService {
    constructor(private appConfigService: AppConfigService, @Inject(AUTH_MODULE_CONFIG) private readonly authModuleConfig: AuthModuleConfig) {}

    private _authConfig!: AuthConfig;
    get authConfig(): AuthConfig {
        return this._authConfig;
    }

    loadConfig(): Promise<AuthConfig> {
        return this.appConfigService.onLoad.pipe(take(1)).toPromise().then(this.loadAppConfig.bind(this));
    }

    loadAppConfig(): AuthConfig {
        const oauth2 = this.appConfigService.oauth2;
        const origin = this.getLocationOrigin();
        const redirectUri = this.getRedirectUri();
        const customQueryParams = oauth2.audience ? { audience: oauth2.audience } : {};
        const clockSkewInSec = this.getClockSkewInSec(oauth2);
        const sessionChecksEnabled = this.getSessionCheckEnabled(oauth2);

        return new AuthConfig({
            ...oauth2,
            oidc: oauth2.implicitFlow || oauth2.codeFlow || false,
            issuer: oauth2.host,
            nonceStateSeparator: '~',
            redirectUri,
            silentRefreshRedirectUri: oauth2.redirectSilentIframeUri,
            postLogoutRedirectUri: this.generatePostLogoutUri(origin, oauth2.redirectUriLogout),
            clientId: oauth2.clientId,
            scope: oauth2.scope,
            dummyClientSecret: oauth2.secret || '',
            logoutUrl: oauth2.logoutUrl,
            customQueryParams,
            ...(oauth2.codeFlow && { responseType: 'code' }),
            ...clockSkewInSec,
            ...sessionChecksEnabled
        });
    }

    getSessionCheckEnabled(oauth2: OauthConfigModel) {
        return typeof oauth2.sessionChecksEnabled === 'boolean' ? { sessionChecksEnabled: oauth2.sessionChecksEnabled } : {};
    }

    getClockSkewInSec(oauth2: OauthConfigModel) {
        return typeof oauth2.clockSkewInSec === 'number' ? { clockSkewInSec: oauth2.clockSkewInSec } : {};
    }

    getRedirectUri(): string {
        // required for this package as we handle the returned token on this view, with is provided by the AuthModule
        const viewUrl = `view/authentication-confirmation`;
        const useHash = this.authModuleConfig.useHash;

        const oauth2 = this.appConfigService.oauth2;

        const directUrl = oauth2.redirectUri?.startsWith('http');
        if (directUrl) {
            return oauth2.redirectUri;
        }

        const locationOrigin =
            oauth2.redirectUri && oauth2.redirectUri !== '/' ? this.getLocationOrigin() + '' + oauth2.redirectUri : this.getLocationOrigin();

        const redirectUri = useHash ? `${locationOrigin}/#/${viewUrl}` : `${locationOrigin}/${viewUrl}`;

        // handle issue from the OIDC library with hashStrategy and implicitFlow, with would append &state to the url with would lead to error
        // `cannot match any routes`, and displaying the wildcard ** error page
        return (oauth2.codeFlow || oauth2.implicitFlow) && useHash ? `${redirectUri}/?` : redirectUri;
    }

    private getLocationOrigin() {
        return window.location.origin;
    }

    private generatePostLogoutUri(hostUri: string = '', redirectUriLogout: string = ''): string {
        const hostUriWithoutSlash = hostUri.endsWith('/') ? hostUri.substring(0, hostUri.length - 1) : hostUri;
        const redirectUriLogoutWithoutSlash = redirectUriLogout.startsWith('/') ? redirectUriLogout.substring(1) : redirectUriLogout;

        return `${hostUriWithoutSlash}/${redirectUriLogoutWithoutSlash}`;
    }
}
