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
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AppConfigService } from '../app-config/app-config.service';
import { AuthenticationService } from './authentication.service';
import { AuthGuardBase } from './auth-guard-base';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardBpm extends AuthGuardBase {

    constructor(authenticationService: AuthenticationService,
                router: Router,
                appConfigService: AppConfigService) {
        super(authenticationService, router, appConfigService);
    }

    checkLogin(_: ActivatedRouteSnapshot, redirectUrl: string): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authenticationService.isBpmLoggedIn() || this.withCredentials) {
            return true;
        }
        this.redirectToUrl('BPM', redirectUrl);
        return false;
    }
}
