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

import { inject, Injectable } from '@angular/core';
import { IUserAccessService } from '../user-access.service';
import { ApplicationAccessModel } from '../../models/application-access.model';
import { BffAuthService } from './bff-auth.service';

/* eslint-disable no-console */
@Injectable()
export class BffUserAccessService implements IUserAccessService {
    private applicationAccess: ApplicationAccessModel;
    private bffAuthService = inject(BffAuthService);

    fetchUserAccess() {
        console.log('[BffUserAccessService] fetchUserAccess');
        const { user } = this.bffAuthService.userInfo;
        if (user.appKey && user.roles?.length > 0) {
            this.applicationAccess = {
                name: user.appKey,
                roles: user.roles
            };
            console.log('✅[BffUserAccessService] fetchUserAccess applicationAccess: ', this.applicationAccess);
        } else {
            this.applicationAccess = null;
        }
    }

    hasGlobalAccess(rolesToCheck: string[]): boolean {
        if (!rolesToCheck?.length) {
            return true;
        }
        const hasAccess = this.applicationAccess?.roles?.some((role) => rolesToCheck.includes(role)) ?? false;
        console.log('[BffUserAccessService] hasGlobalAccess() hasAccess: ', hasAccess);
        return hasAccess;
    }

    hasApplicationAccess(appName: string, rolesToCheck: string[]): boolean {
        if (!appName) {
            return false;
        }
        if (!rolesToCheck?.length) {
            return true;
        }
        const { name, roles } = this.applicationAccess || {};
        if (name !== appName || !roles?.length) {
            return false;
        }
        return roles.some((role) => rolesToCheck.includes(role));
    }
}
