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
    RouterStateSnapshot
} from '@angular/router';
import { AuthenticationService } from './authentication.service';
import {
    AppConfigService,
    AppConfigValues
} from '../app-config/app-config.service';
import { Observable } from 'rxjs';

export abstract class AuthGuardBase implements CanActivate {
    abstract checkLogin(
        activeRoute: ActivatedRouteSnapshot,
        redirectUrl: string
    ): Observable<boolean> | Promise<boolean> | boolean;

    constructor(
        protected authenticationService: AuthenticationService,
        protected router: Router,
        protected appConfigService: AppConfigService
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.checkLogin(route, state.url);
    }

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate(route, state);
    }

    protected redirectToUrl(provider: string, url: string) {
        this.authenticationService.setRedirect({ provider, url });

        const pathToLogin = this.getLoginRoute();
        const urlToRedirect = `/${pathToLogin}?redirectUrl=${url}`;

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
}
