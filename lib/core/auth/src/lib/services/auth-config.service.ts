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
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from '@alfresco/adf-core/common';
import { AppConfigService, AppConfigValues } from '@alfresco/adf-core/config';

export const configureAuth = (oidcAuthentication: AuthConfigService) => () => oidcAuthentication.load();

@Injectable()
export class AuthConfigService {

    _authConfig: AuthConfig;

    constructor(
        private appConfigService: AppConfigService,
        private storageService: StorageService,
        private oauthService: OAuthService,
        private router: Router
    ) {}

    public load() {
        this.appConfigService.onLoad
            .pipe(take(1))
            .toPromise()
            .then(this.configure.bind(this));
    }

    private configure() {
        this._authConfig = this.appConfigService.get<AuthConfig>(AppConfigValues.AUTH_CONFIG, null);
        // TODO: add the authenticaion object's schema to the app.config.schema.json
        this.oauthService.configure(this._authConfig);
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

    isCodeFlow(): boolean {
        return this._authConfig.responseType === 'code';
    }
}
