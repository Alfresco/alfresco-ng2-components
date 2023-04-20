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

import { Injectable } from '@angular/core';
import { mockIdentityGroups, mockIdentityGroupsCount, mockIdentityRoles } from './identity-group.mock';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IdentityGroupServiceInterface } from '../interfaces/identity-group.interface';
import {
    IdentityGroupModel,
    IdentityGroupQueryResponse,
    IdentityGroupQueryCloudRequestModel,
    IdentityGroupSearchParam,
    IdentityGroupCountModel
} from '../models/identity-group.model';
import { IdentityRoleModel } from '../models/identity-role.model';

Injectable({ providedIn: 'root' });
export class IdentityGroupServiceMock implements IdentityGroupServiceInterface {

    getGroups(): Observable<IdentityGroupModel[]> {
        return of(mockIdentityGroups);
    }

    getAvailableRoles(_groupId: string): Observable<IdentityRoleModel[]> {
        return of(mockIdentityRoles);
    }

    getAssignedRoles(_groupId: string): Observable<IdentityRoleModel[]> {
        return of(mockIdentityRoles);
    }

    assignRoles(_groupId: string, _roles: IdentityRoleModel[]): Observable<any> {
        return of();
    }

    removeRoles(_groupId: string, _roles: IdentityRoleModel[]): Observable<any> {
        return of();
    }

    getEffectiveRoles(_groupId: string): Observable<IdentityRoleModel[]> {
        return of(mockIdentityRoles);
    }

    queryGroups(_requestQuery: IdentityGroupQueryCloudRequestModel): Observable<IdentityGroupQueryResponse> {
        return of();
    }

    getTotalGroupsCount(): Observable<IdentityGroupCountModel> {
        return of(mockIdentityGroupsCount);
    }

    createGroup(_newGroup: IdentityGroupModel): Observable<any> {
        return of();
    }

    updateGroup(_groupId: string, _updatedGroup: IdentityGroupModel): Observable<any> {
        return of();
    }

    deleteGroup(_groupId: string): Observable<any> {
        return of();
    }

    findGroupsByName(searchParams: IdentityGroupSearchParam): Observable<IdentityGroupModel[]> {
        if (searchParams.name === '') {
            return of([]);
        }

        return of(mockIdentityGroups.filter(group =>
            group.name.toUpperCase().includes(searchParams.name.toUpperCase())
        ));
    }

    getGroupRoles(_groupId: string): Observable<IdentityRoleModel[]> {
        return of(mockIdentityRoles);
    }

    checkGroupHasRole(groupId: string, roleNames: string[]): Observable<boolean> {
        return this.getGroupRoles(groupId).pipe(map((groupRoles) => {
            let hasRole = false;
            if (groupRoles?.length > 0) {
                roleNames.forEach((roleName: string) => {
                    const role = groupRoles.find(({ name }) => roleName === name);
                    if (role) {
                        hasRole = true;
                        return;
                    }
                });
            }
            return hasRole;
        }));
    }

    getClientIdByApplicationName(_applicationName: string): Observable<string> {
        return of('fake-client-id');
    }

    getClientRoles(groupId: string, _clientId: string): Observable<IdentityRoleModel[]> {
        if (['mock-group-id-1', 'mock-group-id-2'].includes(groupId)) {
            return of([{ id: 'mock-role-id', name: 'MOCK-ADMIN-ROLE' }]);
        }

        return of([{ id: 'mock-role-id', name: 'MOCK-USER-ROLE' }]);
    }

    checkGroupHasClientApp(groupId: string, clientId: string): Observable<boolean> {
        return this.getClientRoles(groupId, clientId).pipe(
            map((response) => response && response.length > 0)
        );
    }

    checkGroupHasAnyClientAppRole(groupId: string, clientId: string, roleNames: string[]): Observable<boolean> {
        return this.getClientRoles(groupId, clientId).pipe(
            map((clientRoles: any[]) => {
                let hasRole = false;
                if (clientRoles.length > 0) {
                    roleNames.forEach((roleName) => {
                        const role = clientRoles.find(({ name }) => name === roleName);

                        if (role) {
                            hasRole = true;
                            return;
                        }
                    });
                }
                return hasRole;
            })
        );
    }
}
