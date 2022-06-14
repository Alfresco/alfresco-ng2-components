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
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { take } from 'rxjs/operators';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { OauthConfigModel } from '../../models/oauth-config.model';
import { AuthenticationService } from '../../services/authentication.service';
import { StorageService } from '../../services/storage.service';

export const configureOIDCAuthentication = (oidcAuthentication: OIDCAuthentication) => () => oidcAuthentication.init();

@Injectable()
export class OIDCAuthentication {

    constructor(
        private appConfigService: AppConfigService,
        private storageService: StorageService,
        private authenticationService: AuthenticationService,
        private oauthService: OAuthService,
        private router: Router
    ) {}

    public init() {
        this.appConfigService.onLoad
            .pipe(take(1))
            .toPromise()
            .then(this.configure.bind(this));
    }

    private configure() {
        if (this.authenticationService.oidcHandlerEnabled()) {
            const authConfig = this.getAuthConfig(this.authenticationService.isAuthCodeFlow());
            this.oauthService.configure(authConfig);
            this.oauthService.tokenValidationHandler = new JwksValidationHandler();
            this.oauthService.setStorage(this.storageService);
            this.oauthService.setupAutomaticSilentRefresh();

            // This is what deald with the responded code and does the magic
            this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
                // initialNavigation: false needs because of the OIDC package!!!
                // https://manfredsteyer.github.io/angular-oauth2-oidc/docs/additional-documentation/routing-with-the-hashstrategy.html
                this.router.navigate(['/']);
            });
        }
    }

    private getAuthConfig(codeFlow = false): AuthConfig {
        const oauth2: OauthConfigModel = Object.assign({}, this.appConfigService.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null));

        return {
            issuer: oauth2.host,
            loginUrl: `${oauth2.host}/protocol/openid-connect/auth`,
            silentRefreshRedirectUri: oauth2.redirectSilentIframeUri,
            redirectUri: window.location.origin + oauth2.redirectUri,
            postLogoutRedirectUri: window.location.origin + oauth2.redirectUriLogout,
            clientId: oauth2.clientId,
            scope: oauth2.scope,
            dummyClientSecret: oauth2.secret,
            ...(codeFlow ? { responseType: 'code' } : {})
        };
    }
}
