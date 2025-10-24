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

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';

@Component({ template: '', standalone: true })
export class FrontChannelLogoutComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly authService = inject(AuthService);

    ngOnInit() {
        const { issuerParam, sessionIdParam } = this.getIssuerAndSessionIdFromRouteParams();

        const { storedIssuer, storedSessionId } = this.getIssuerAndSessionIdFromAuthService();

        this.logoutIfIssuerAndSessionIdMatch(storedIssuer, issuerParam, storedSessionId, sessionIdParam);
    }

    private logoutIfIssuerAndSessionIdMatch(storedIssuer: string, issuerParam: string, storedSessionId: string, sessionIdParam: string) {
        const storedIssuerMatchUrlIssuerParam = storedIssuer && issuerParam && storedIssuer === issuerParam;
        const storedSessionIdMatchUrlSessionIdParam = storedSessionId && sessionIdParam && storedSessionId === sessionIdParam;

        if (storedIssuerMatchUrlIssuerParam && storedSessionIdMatchUrlSessionIdParam) {
            this.authService.logout();
        }
    }

    private getIssuerAndSessionIdFromAuthService() {
        const storedIssuer = this.authService.getStoredIssuer();
        const storedSessionId = this.authService.getStoredSessionId();
        return { storedIssuer, storedSessionId };
    }

    private getIssuerAndSessionIdFromRouteParams() {
        const queryParamMap = this.activatedRoute.snapshot.queryParamMap;
        const issuerParam = queryParamMap.get('iss');
        const sessionIdParam = queryParamMap.get('sid');
        return { issuerParam, sessionIdParam };
    }
}
