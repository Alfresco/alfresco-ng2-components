/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import {
    ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router,
    PRIMARY_OUTLET, UrlTree, UrlSegmentGroup, UrlSegment
} from '@angular/router';
import { AlfrescoApiService } from './alfresco-api.service';
import { AuthenticationService } from './authentication.service';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable()
export class AuthGuardEcm implements CanActivate {
    constructor(
        private authService: AuthenticationService,
        private apiService: AlfrescoApiService,
        private router: Router,
        private appConfig: AppConfigService) {
    }

    private get authApi() {
        return this.apiService.getInstance().ecmAuth;
    }

    private isLoggedIn(): Promise<boolean> {
        if (this.authApi === undefined || !this.authApi.isLoggedIn()) {
            return Promise.resolve(false);
        }

        return this.authApi
            .validateTicket()
            .then(() => true, () => false)
            .catch(() => false);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.canActivate(route, state);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.isLoggedIn().then(isLoggedIn => {
            if (!isLoggedIn) {
                const navigation = this.getNavigationCommands(state.url);

                this.authService.setRedirect({ provider: 'ECM', navigation });
                const pathToLogin = this.getRouteDestinationForLogin();
                this.router.navigate(['/' + pathToLogin]);
            }

            return isLoggedIn;
        });
    }

    private getRouteDestinationForLogin(): string {
        return this.appConfig &&
               this.appConfig.get<string>('loginRoute') ?
                        this.appConfig.get<string>('loginRoute') : 'login';
    }

    private getNavigationCommands(redirectUrl: string): any[] {
        const urlTree: UrlTree = this.router.parseUrl(redirectUrl);
        const urlSegmentGroup: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];

        if (!urlSegmentGroup) {
            return [redirectUrl];
        }

        const urlSegments: UrlSegment[] = urlSegmentGroup.segments;

        return urlSegments.reduce(function(acc, item) {
            acc.push(item.path, item.parameters);
            return acc;
        }, []);
    }
}
