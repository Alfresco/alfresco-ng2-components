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

import { Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../services/authentication.service';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { OauthConfigModel } from '../models/oauth-config.model';
import { StorageService } from '../../common/services/storage.service';
import { BasicAlfrescoAuthService } from '../basic-auth/basic-alfresco-auth.service';
import { OidcAuthenticationService } from '../oidc/oidc-authentication.service';

const authenticationService = inject(AuthenticationService);
const basicAlfrescoAuthService = inject(BasicAlfrescoAuthService);
const oidcAuthenticationService = inject(OidcAuthenticationService);
const router = inject(Router);
const appConfigService = inject(AppConfigService);
const dialog = inject(MatDialog);
const storageService = inject(StorageService);

const getOauthConfig = (): OauthConfigModel => appConfigService?.get(AppConfigValues.OAUTHCONFIG, null);

const getLoginRoute = (): string => appConfigService.get<string>(AppConfigValues.LOGIN_ROUTE, 'login');

const getProvider = (): string => appConfigService.get<string>(AppConfigValues.PROVIDERS, 'ALL');

export const isLoginFragmentPresent = (): boolean => !!storageService.getItem('loginFragment');

export const withCredentials = (): boolean => appConfigService.get<boolean>('auth.withCredentials', false);

export const navigate = async (url: string): Promise<boolean> => {
    dialog.closeAll();
    await router.navigateByUrl(router.parseUrl(url));
    return false;
};

export const redirectToUrl = async (url: string): Promise<boolean | UrlTree> => {
    let urlToRedirect = `/${getLoginRoute()}`;

    if (!authenticationService.isOauth()) {
        basicAlfrescoAuthService.setRedirect({
            provider: getProvider(),
            url
        });

        urlToRedirect = `${urlToRedirect}?redirectUrl=${url}`;
        return navigate(urlToRedirect);
    } else if (getOauthConfig().silentLogin && !oidcAuthenticationService.isPublicUrl()) {
        if (!oidcAuthenticationService.hasValidIdToken() || !oidcAuthenticationService.hasValidAccessToken()) {
            oidcAuthenticationService.ssoLogin(url);
        }
    } else {
        return navigate(urlToRedirect);
    }

    return false;
};

export const redirectSSOSuccessURL = async (): Promise<boolean | UrlTree> => {
    const redirectFragment = storageService.getItem('loginFragment');
    if (redirectFragment && getLoginRoute() !== redirectFragment) {
        await navigate(redirectFragment);
        storageService.removeItem('loginFragment');
        return false;
    }
    return true;
};
