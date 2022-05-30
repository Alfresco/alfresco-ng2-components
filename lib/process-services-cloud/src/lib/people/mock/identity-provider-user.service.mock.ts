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
import { Observable, of } from 'rxjs';
import { IdentityUserModel } from '../../models/identity-user.model';
import { IdentityProviderUserServiceInterface, SearchUsersFilters } from '../services/identity-provider-user.service.interface';
import { mockUsers } from './user-cloud.mock';

export const mockSearchUserEmptyFilters: SearchUsersFilters = {
    roles: [],
    groups: [],
    withinApplication: ''
};

export const mockSearchUserByGroups: SearchUsersFilters = {
    roles: [],
    groups: ['fake-group-1', 'fake-group-2'],
    withinApplication: ''
};

export const mockSearchUserByGroupsAndRoles: SearchUsersFilters = {
    roles: ['fake-role-1', 'fake-role-2'],
    groups: ['fake-group-1', 'fake-group-2'],
    withinApplication: ''
};

export const mockSearchUserByGroupsAndRolesAndApp: SearchUsersFilters = {
    roles: ['fake-role-1', 'fake-role-2'],
    groups: ['fake-group-1', 'fake-group-2'],
    withinApplication: 'fake-app-name'
};

export const mockSearchUserByRoles: SearchUsersFilters = {
    roles: ['fake-role-1', 'fake-role-2'],
    groups: [],
    withinApplication: ''
};

export const mockSearchUserByRolesAndApp: SearchUsersFilters = {
    roles: ['fake-role-1', 'fake-role-2'],
    groups: [],
    withinApplication: 'fake-app-name'
};

export const mockSearchUserByApp: SearchUsersFilters = {
    roles: [],
    groups: [],
    withinApplication: 'fake-app-name'
};

export const mockSearchUserByAppAndGroups: SearchUsersFilters = {
    roles: [],
    groups: ['fake-group-1', 'fake-group-2'],
    withinApplication: 'fake-app-name'
};

export function oAuthUsersMockApiWithIdentityUsers(users: IdentityUserModel[]) {
    return {
        oauth2Auth: {
            callCustomApi: () => Promise.resolve(users)
        }
    };
}

@Injectable()
export class IdentityProviderUserServiceMock implements IdentityProviderUserServiceInterface {

    constructor() { }

    getCurrentUserInfo(): IdentityUserModel {
        return { username: 'currentUser', firstName: 'Test', lastName: 'User', email: 'currentUser@test.com' };
    }

    search(name: string, filters?: SearchUsersFilters): Observable<IdentityUserModel[]> {
        if (name.trim() === '') {
            return of([]);
        } else if (filters?.withinApplication && filters?.withinApplication !== '') {
            return this.searchUsersWithinApp(name, filters.withinApplication, filters?.roles, filters?.groups);
        } else if (filters?.roles && filters?.roles.length > 0) {
            return this.searchUsersWithGlobalRoles(name, filters.roles, filters?.groups);
        } else {
            return this.searchUsersByName(name, filters?.groups);
        }
    }

    searchUsersByName(name: string, groups?: string[]): Observable<IdentityUserModel[]> {
        // console.log('MOCK searchUsersByName');
        if (groups && groups.length > 0) {
            return this.searchUsersWithGroups(name, {groups});
        } else {
            return of(mockUsers);
        }
    }

    searchUsersWithGlobalRoles(name: string, roles: string [], groups?: string[]): Observable<IdentityUserModel[]> {
        // console.log('MOCK searchUsersWithGlobalRoles');
        if (groups && groups.length > 0) {
            return this.searchUsersWithGroups(name, {roles, groups});
        } else {
            return of(mockUsers);
        }
    }

    searchUsersWithinApp(name: string, withinApplication: string, roles?: string [], groups?: string[]): Observable<IdentityUserModel[]> {
        // console.log('MOCK searchUsersWithinApp');
        if (groups && groups.length > 0) {
            return this.searchUsersWithGroups(name, {roles, withinApplication, groups});
        } else {
            return of(mockUsers);
        }
    }

    searchUsersWithGroups(_name: string, filters: SearchUsersFilters): Observable<IdentityUserModel[]> {
        if (filters.groups.some(group => ['water', 'fire', 'air'].includes(group)) ) {
            return of([]);
        } else if (filters.groups.some(group => ['fake-group-1', 'fake-group-2', 'fake-group-3'].includes(group)) ) {
            return of(mockUsers);
        }

        return of(mockUsers);
    }
}
