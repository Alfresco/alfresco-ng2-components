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

import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild,
    UrlTree
} from '@angular/router';
import { AuthenticationService } from './authentication.service';
import {
    AppConfigService,
    AppConfigValues
} from '../app-config/app-config.service';
import { OauthConfigModel } from '../models/oauth-config.model';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';

export abstract class AuthGuardBase implements CanActivate, CanActivateChild {

    abstract checkLogin(
        activeRoute: ActivatedRouteSnapshot,
        redirectUrl: string
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

    protected get withCredentials(): boolean {
        return this.appConfigService.get<boolean>(
            'auth.withCredentials',
            false
        );
    }

    constructor(
        protected authenticationService: AuthenticationService,
        protected router: Router,
        protected appConfigService: AppConfigService,
        protected dialog: MatDialog,
        private storageService: StorageService
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const redirectFragment = this.storageService.getItem('loginFragment');
        if (this.authenticationService.isEcmLoggedIn() || this.withCredentials) {
            if (redirectFragment) {
                this.storageService.removeItem('loginFragment');
                return this.router.createUrlTree([redirectFragment]);
            }
            return true;
        }

        const checkLogin = this.checkLogin(route, state.url);

        if (!checkLogin) {
            this.dialog.closeAll();
        }

        return checkLogin;
    }

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.canActivate(route, state);
    }

    protected redirectToUrl(provider: string, url: string) {
        const pathToLogin = `/${this.getLoginRoute()}`;
        let urlToRedirect;

        if (!this.authenticationService.isOauth()) {
            this.authenticationService.setRedirect({ provider, url });

            urlToRedirect = `/${pathToLogin}?redirectUrl=${url}`;
        } else {
            urlToRedirect = pathToLogin;
        }

        this.dialog.closeAll();
        this.router.navigateByUrl(urlToRedirect);
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

    protected isOAuthWithoutSilentLogin(): boolean {
        const oauth = this.appConfigService.get<OauthConfigModel>(
            AppConfigValues.OAUTHCONFIG,
            null
        );
        return (
            this.authenticationService.isOauth() && !!oauth && !oauth.silentLogin
        );
    }

    protected isSilentLogin(): boolean {
        const oauth = this.appConfigService.get<OauthConfigModel>(
            AppConfigValues.OAUTHCONFIG,
            null
        );

        return this.authenticationService.isOauth() && oauth && oauth.silentLogin;
    }

}
