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

import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild,
    UrlTree
} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AppConfigService, AppConfigValues } from '../../app-config/app-config.service';
import { OauthConfigModel } from '../models/oauth-config.model';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from '../../common/services/storage.service';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

export abstract class AuthGuardBase implements CanActivate, CanActivateChild {
    protected authenticationService = inject(AuthenticationService);
    protected router = inject(Router);
    protected appConfigService = inject(AppConfigService);
    protected dialog = inject(MatDialog);
    private storageService = inject(StorageService);

    protected get withCredentials(): boolean {
        return this.appConfigService.get<boolean>(
            'auth.withCredentials',
            false
        );
    }

    abstract checkLogin(
        activeRoute: ActivatedRouteSnapshot,
        redirectUrl: string
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (this.authenticationService.isLoggedIn() && this.authenticationService.isOauth() && this.isLoginFragmentPresent()) {
            return this.redirectSSOSuccessURL();
        }

        return this.checkLogin(route, state.url);
    }

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.canActivate(route, state);
    }

    protected async redirectSSOSuccessURL(): Promise<boolean | UrlTree> {
        const redirectFragment = this.storageService.getItem('loginFragment');

        if (redirectFragment && this.getLoginRoute() !== redirectFragment) {
            await this.navigate(redirectFragment);
            this.storageService.removeItem('loginFragment');
            return false;
        }

        return true;
    }

    protected isLoginFragmentPresent(): boolean {
        return !!this.storageService.getItem('loginFragment');
    }

    protected async redirectToUrl(url: string): Promise<boolean | UrlTree> {
        let urlToRedirect = `/${this.getLoginRoute()}`;

        if (!this.authenticationService.isOauth()) {
            this.authenticationService.setRedirect({
                provider: this.getProvider(),
                url
            });

            urlToRedirect = `${urlToRedirect}?redirectUrl=${url}`;
            return this.navigate(urlToRedirect);
        } else if (this.getOauthConfig().silentLogin && !this.authenticationService.isPublicUrl()) {
            this.authenticationService.ssoImplicitLogin();
        } else {
            return this.navigate(urlToRedirect);
        }

        return false;
    }

    protected async navigate(url: string): Promise<boolean> {
        this.dialog.closeAll();
        await this.router.navigateByUrl(this.router.parseUrl(url));
        return false;
    }

    protected getOauthConfig(): OauthConfigModel {
        return this.appConfigService.oauth2;
    }

    protected getLoginRoute(): string {
        return (
            this.appConfigService &&
            this.appConfigService.get<string>(
                AppConfigValues.LOGIN_ROUTE,
                'login'
            )
        );
    }

    protected getProvider(): string {
        return (
            this.appConfigService &&
            this.appConfigService.get<string>(
                AppConfigValues.PROVIDERS,
                'ALL'
            )
        );
    }

    protected isOAuthWithoutSilentLogin(): boolean {
        const oauth = this.appConfigService.oauth2;
        return this.authenticationService.isOauth() && !!oauth && !oauth.silentLogin;
    }

    protected isSilentLogin(): boolean {
        const oauth = this.appConfigService.oauth2;;
        return this.authenticationService.isOauth() && oauth && oauth.silentLogin;
    }

}
