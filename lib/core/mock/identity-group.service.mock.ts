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

export let mockIdentityGroup1 = new IdentityGroupModel({
    id: 'mock-group-id-1', name: 'Mock Group 1', path: '/mock', subGroups: []
});

export let mockIdentityGroup2 = new IdentityGroupModel({
    id: 'mock-group-id-2', name: 'Mock Group 2', path: '', subGroups: []
});

export let mockIdentityGroup3 = new IdentityGroupModel({
  id: 'mock-group-id-3', name: 'Mock Group 3', path: '', subGroups: []
});

export let mockIdentityGroup4 = new IdentityGroupModel({
    id: 'mock-group-id-4', name: 'Mock Group 4', path: '', subGroups: []
});

export let mockIdentityGroup5 = new IdentityGroupModel({
    id: 'mock-group-id-5', name: 'Mock Group 5', path: '', subGroups: []
});

export let mockIdentityGroupsCount = <IdentityGroupCountModel> { count: 10 };

export let mockIdentityGroups = [
    mockIdentityGroup1, mockIdentityGroup2, mockIdentityGroup3, mockIdentityGroup5, mockIdentityGroup5
];

export let mockApplicationDetails = {id: 'mock-app-id', name: 'mock-app-name'};

export let groupAPIMockError = {
    error: {
        errorKey: 'failed',
        statusCode: 400,
        stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.'
    }
};

export let mockApiError = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.reject(groupAPIMockError);
        }
    }
};

export let roleMappingMock = [
    { id: 'role-id-1', name: 'role-name-1' }, { id: 'role-id-2', name: 'role-name-2' }
];

export let roleMappingApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve(roleMappingMock);
        }
    }
};

export let noRoleMappingApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve([]);
        }
    }
};

export let groupsMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve(mockIdentityGroups);
        }
    }
};

export let getGroupsCountMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve(10);
        }
    }
};

export let queryGroupsMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve(mockIdentityGroups);
        }
    }
};

export let createGroupMappingApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve();
        }
    }
};

export let updateGroupMappingApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve();
        }
    }
};

export let deleteGroupMappingApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve();
        }
    }
};

export let returnCallQueryParameters = {
    oauth2Auth: {
        callCustomApi: (_queryUrl, _operation, _context, queryParams) => {
            return Promise.resolve(queryParams);
        }
    }
};

export let returnCallUrl = {
    oauth2Auth: {
        callCustomApi: (queryUrl) => {
            return Promise.resolve(queryUrl);
        }
    }
};

export let applicationDetailsMockApi = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.resolve([mockApplicationDetails]);
        }
    }
};

export let mockIdentityRoles = [
    new IdentityRoleModel({id: 'mock-role-id', name: 'MOCK-ADMIN-ROLE'}),
    new IdentityRoleModel({id: 'mock-role-id', name: 'MOCK-USER-ROLE'}),
    new IdentityRoleModel({id: 'mock-role-id', name: 'MOCK-ROLE-1'})
];

export let clientRoles = [ 'MOCK-ADMIN-ROLE', 'MOCK-USER-ROLE'];
