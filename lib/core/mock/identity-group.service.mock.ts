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

import { IdentityGroupModel, IdentityGroupCountModel } from '../models/identity-group.model';
import { IdentityRoleModel } from '../models/identity-role.model';

export const mockIdentityGroup1 = <IdentityGroupModel> {
    id: 'mock-group-id-1', name: 'Mock Group 1', path: '/mock', subGroups: []
};

export const mockIdentityGroup2 = <IdentityGroupModel> {
    id: 'mock-group-id-2', name: 'Mock Group 2', path: '', subGroups: []
};

export const mockIdentityGroup3 = <IdentityGroupModel> {
  id: 'mock-group-id-3', name: 'Mock Group 3', path: '', subGroups: []
};

export const mockIdentityGroup4 = <IdentityGroupModel> {
    id: 'mock-group-id-4', name: 'Mock Group 4', path: '', subGroups: []
};

export const mockIdentityGroup5 = <IdentityGroupModel> {
    id: 'mock-group-id-5', name: 'Mock Group 5', path: '', subGroups: []
};

export const mockIdentityGroupsCount = <IdentityGroupCountModel> { count: 10 };

export const mockIdentityGroups = [
    mockIdentityGroup1, mockIdentityGroup2, mockIdentityGroup3, mockIdentityGroup4, mockIdentityGroup5
];

export const mockApplicationDetails = {id: 'mock-app-id', name: 'mock-app-name'};

export const roleMappingMock = [
    { id: 'role-id-1', name: 'role-name-1' }, { id: 'role-id-2', name: 'role-name-2' }
];

export const roleMappingApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve(roleMappingMock);
        }
    }
};

export const noRoleMappingApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve([]);
        }
    }
};

export const groupsMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve(mockIdentityGroups);
        }
    }
};

export const createGroupMappingApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve();
        }
    }
};

export const updateGroupMappingApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve();
        }
    }
};

export const deleteGroupMappingApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve();
        }
    }
};

export const applicationDetailsMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve([mockApplicationDetails]);
        }
    }
};

export const mockIdentityRoles = [
    new IdentityRoleModel({id: 'mock-role-id', name: 'MOCK-ADMIN-ROLE'}),
    new IdentityRoleModel({id: 'mock-role-id', name: 'MOCK-USER-ROLE'}),
    new IdentityRoleModel({id: 'mock-role-id', name: 'MOCK-ROLE-1'})
];

export const clientRoles = [ 'MOCK-ADMIN-ROLE', 'MOCK-USER-ROLE'];
