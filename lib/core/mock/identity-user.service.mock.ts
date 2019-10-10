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

import { IdentityUserModel } from '../models/identity-user.model';
import { IdentityRoleModel } from '../models/identity-role.model';
import { IdentityGroupModel } from '../models/identity-group.model';
import { IdentityJoinGroupRequestModel } from '../services/identity-user.service';

export const mockIdentityUser1: IdentityUserModel = { id: 'mock-user-id-1', username: 'userName1', firstName: 'first-name-1', lastName: 'last-name-1', email: 'abc@xyz.com' };
export const mockIdentityUser2: IdentityUserModel = { id: 'mock-user-id-2', username: 'userName2', firstName: 'first-name-2', lastName: 'last-name-2', email: 'abcd@xyz.com'};
export const mockIdentityUser3: IdentityUserModel = { id: 'mock-user-id-3', username: 'userName3', firstName: 'first-name-3', lastName: 'last-name-3', email: 'abcde@xyz.com' };
export const mockIdentityUser4: IdentityUserModel = { id: 'mock-user-id-4', username: 'userName4', firstName: 'first-name-4', lastName: 'last-name-4', email: 'abcde@xyz.com' };
export let  mockIdentityUser5: IdentityUserModel = { id: 'mock-user-id-5', username: 'userName5', firstName: 'first-name-5', lastName: 'last-name-5', email: 'abcde@xyz.com' };

export const mockIdentityUsers: IdentityUserModel[] = [
    mockIdentityUser1,
    mockIdentityUser2,
    mockIdentityUser3,
    mockIdentityUser4,
    mockIdentityUser5
];

export const mockIdentityRole  = new IdentityRoleModel({ id: 'id-1', name: 'MOCK-ADMIN-ROLE'});

export const mockAvailableRoles = [
    new IdentityRoleModel({ id: 'mock-role-id-1', name: 'MOCK-ADMIN-ROLE'}),
    new IdentityRoleModel({ id: 'mock-role-id-2', name: 'MOCK-USER-ROLE'}),
    new IdentityRoleModel({ id: 'mock-role-id-3', name: 'MOCK_MODELER-ROLE' }),
    new IdentityRoleModel({ id: 'mock-role-id-5', name: 'MOCK-ROLE-2'})
];

export const mockAssignedRoles = [
    new IdentityRoleModel({ id: 'mock-role-id-1', name: 'MOCK-ADMIN-ROLE'}),
    new IdentityRoleModel({ id: 'mock-role-id-2', name: 'MOCK_MODELER-ROLE' }),
    new IdentityRoleModel({ id: 'mock-role-id-3', name: 'MOCK-ROLE-1' })
];

export const mockEffectiveRoles = [
    new IdentityRoleModel({id: 'mock-role-id-1', name: 'MOCK-ACTIVE-ADMIN-ROLE'}),
    new IdentityRoleModel({id: 'mock-role-id-2', name: 'MOCK-ACTIVE-USER-ROLE'}),
    new IdentityRoleModel({id: 'mock-role-id-3', name: 'MOCK-ROLE-1'})
];

export const mockJoinGroupRequest: IdentityJoinGroupRequestModel = {userId: 'mock-hser-id', groupId: 'mock-group-id', realm: 'mock-realm-name'};

export const mockGroup1 = new IdentityGroupModel({
    id: 'mock-group-id-1', name: 'Mock Group 1', path: '/mock', subGroups: []
});

export const mockGroup2 = new IdentityGroupModel({
    id: 'mock-group-id-2', name: 'Mock Group 2', path: '', subGroups: []
});

export const mockGroups = [
    new IdentityGroupModel({ id: 'mock-group-id-1', name: 'Mock Group 1', path: '/mock', subGroups: [] }),
    new IdentityGroupModel({ id: 'mock-group-id-2', name: 'Mock Group 2', path: '', subGroups: [] })
];

export const queryUsersMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve(mockIdentityUsers);
        }
    }
};

export const createUserMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve();
        }
    }
};

export const updateUserMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve();
        }
    }
};

export const deleteUserMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve();
        }
    }
};

export const getInvolvedGroupsMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve(mockGroups);
        }
    }
};

export const joinGroupMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve();
        }
    }
};

export const leaveGroupMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve();
        }
    }
};

export const getAvailableRolesMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve(mockAvailableRoles);
        }
    }
};

export const getAssignedRolesMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve(mockAssignedRoles);
        }
    }
};

export const getEffectiveRolesMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve(mockEffectiveRoles);
        }
    }
};

export const assignRolesMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve();
        }
    }
};

export const removeRolesMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve();
        }
    }
};
