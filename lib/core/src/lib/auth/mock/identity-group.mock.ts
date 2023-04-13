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

import { IdentityGroupModel, IdentityGroupCountModel } from '../models/identity-group.model';
import { IdentityRoleModel } from '../models/identity-role.model';
import { IdentityJoinGroupRequestModel } from '../interfaces/identity-user.service.interface';

export const mockIdentityGroup1 = {
    id: 'mock-group-id-1', name: 'Mock Group 1', path: '/mock', subGroups: []
} as IdentityGroupModel;

export const mockIdentityGroup2 = {
    id: 'mock-group-id-2', name: 'Mock Group 2', path: '', subGroups: []
} as IdentityGroupModel;

export const mockIdentityGroup3 = {
  id: 'mock-group-id-3', name: 'Mock Group 3', path: '', subGroups: []
} as IdentityGroupModel;

export const mockIdentityGroup4 = {
    id: 'mock-group-id-4', name: 'Mock Group 4', path: '', subGroups: []
} as IdentityGroupModel;

export const mockIdentityGroup5 = {
    id: 'mock-group-id-5', name: 'Mock Group 5', path: '', subGroups: []
} as IdentityGroupModel;

export const mockIdentityGroupsCount = { count: 10 } as IdentityGroupCountModel;

export const mockIdentityGroups = [
    mockIdentityGroup1, mockIdentityGroup2, mockIdentityGroup3, mockIdentityGroup4, mockIdentityGroup5
];

export const roleMappingMock = [
    { id: 'role-id-1', name: 'role-name-1' }, { id: 'role-id-2', name: 'role-name-2' }
];

export const mockIdentityRoles = [
    new IdentityRoleModel({id: 'mock-role-id', name: 'MOCK-ADMIN-ROLE'}),
    new IdentityRoleModel({id: 'mock-role-id', name: 'MOCK-USER-ROLE'}),
    new IdentityRoleModel({id: 'mock-role-id', name: 'MOCK-ROLE-1'})
];

export const clientRoles: IdentityRoleModel[] = [
    new IdentityRoleModel({ name: 'MOCK-ADMIN-ROLE' }),
    new IdentityRoleModel({ name: 'MOCK-USER-ROLE' })
];

export const mockJoinGroupRequest: IdentityJoinGroupRequestModel = {userId: 'mock-hser-id', groupId: 'mock-group-id', realm: 'mock-realm-name'};

export const mockGroup1 = {
    id: 'mock-group-id-1', name: 'Mock Group 1', path: '/mock', subGroups: []
} as IdentityGroupModel;

export const mockGroup2 = {
    id: 'mock-group-id-2', name: 'Mock Group 2', path: '', subGroups: []
} as IdentityGroupModel;

export const mockGroups = [
    { id: 'mock-group-id-1', name: 'Mock Group 1', path: '/mock', subGroups: [] } as IdentityGroupModel,
    { id: 'mock-group-id-2', name: 'Mock Group 2', path: '', subGroups: [] } as IdentityGroupModel
];
