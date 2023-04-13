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

import { Observable } from 'rxjs';
import {
    IdentityGroupModel,
    IdentityGroupQueryResponse,
    IdentityGroupCountModel,
    IdentityGroupQueryCloudRequestModel,
    IdentityGroupSearchParam
} from '../models/identity-group.model';
import { IdentityRoleModel } from '../models/identity-role.model';

export interface IdentityGroupServiceInterface {

    getGroups(): Observable<IdentityGroupModel[]>;
    getAvailableRoles(groupId: string): Observable<IdentityRoleModel[]>;
    getAssignedRoles(groupId: string): Observable<IdentityRoleModel[]>;
    assignRoles(groupId: string, roles: IdentityRoleModel[]): Observable<any>;
    removeRoles(groupId: string, roles: IdentityRoleModel[]): Observable<any>;
    getEffectiveRoles(groupId: string): Observable<IdentityRoleModel[]>;
    queryGroups(requestQuery: IdentityGroupQueryCloudRequestModel): Observable<IdentityGroupQueryResponse>;
    getTotalGroupsCount(): Observable<IdentityGroupCountModel>;
    createGroup(newGroup: IdentityGroupModel): Observable<any>;
    updateGroup(groupId: string, updatedGroup: IdentityGroupModel);
    deleteGroup(groupId: string): Observable<any>;
    findGroupsByName(searchParams: IdentityGroupSearchParam): Observable<IdentityGroupModel[]>;
    getGroupRoles(groupId: string): Observable<IdentityRoleModel[]>;
    checkGroupHasRole(groupId: string, roleNames: string[]): Observable<boolean>;
    getClientIdByApplicationName(applicationName: string): Observable<string>;
    getClientRoles(groupId: string, clientId: string): Observable<IdentityRoleModel[]>;
    checkGroupHasClientApp(groupId: string, clientId: string): Observable<boolean>;
    checkGroupHasAnyClientAppRole(groupId: string, clientId: string, roleNames: string[]): Observable<boolean>;
}
