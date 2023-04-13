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

import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { IdentityUserModel } from '../models/identity-user.model';
import { IdentityUserFilterInterface } from '../services/identity-user-filter.interface';

export const mockSearchUserEmptyFilters: IdentityUserFilterInterface = {
    roles: [],
    groups: [],
    withinApplication: ''
};

export const mockSearchUserByGroups: IdentityUserFilterInterface = {
    roles: [],
    groups: ['fake-group-1', 'fake-group-2'],
    withinApplication: ''
};

export const mockSearchUserByGroupsAndRoles: IdentityUserFilterInterface = {
    roles: ['fake-role-1', 'fake-role-2'],
    groups: ['fake-group-1', 'fake-group-2'],
    withinApplication: ''
};

export const mockSearchUserByGroupsAndRolesAndApp: IdentityUserFilterInterface = {
    roles: ['fake-role-1', 'fake-role-2'],
    groups: ['fake-group-1', 'fake-group-2'],
    withinApplication: 'fake-app-name'
};

export const mockSearchUserByRoles: IdentityUserFilterInterface = {
    roles: ['fake-role-1', 'fake-role-2'],
    groups: [],
    withinApplication: ''
};

export const mockSearchUserByRolesAndApp: IdentityUserFilterInterface = {
    roles: ['fake-role-1', 'fake-role-2'],
    groups: [],
    withinApplication: 'fake-app-name'
};

export const mockSearchUserByApp: IdentityUserFilterInterface = {
    roles: [],
    groups: [],
    withinApplication: 'fake-app-name'
};

export const mockSearchUserByAppAndGroups: IdentityUserFilterInterface = {
    roles: [],
    groups: ['fake-group-1', 'fake-group-2'],
    withinApplication: 'fake-app-name'
};

export function oAuthMockApiWithIdentityUsers(users: IdentityUserModel[]) {
    return {
        oauth2Auth: {
            callCustomApi: () => Promise.resolve(users)
        },
        reply: jasmine.createSpy('reply')
    } as any;
}

const errorResponse = new HttpErrorResponse({
    error: 'Mock Error',
    status: 404, statusText: 'Not Found'
});

export const oAuthMockApiWithError = {
    oauth2Auth: {
        callCustomApi: () => throwError(errorResponse)
    },
    reply: jasmine.createSpy('reply')
} as any;
