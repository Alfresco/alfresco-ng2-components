/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { GroupModel, GroupRoleModel } from '../models/group.model';

export let mockGroup1 = new GroupModel({
    id: 'mock-id-1', name: 'Mock Group 1', path: '/mock', subGroups: []
});

export let mockGroup2 = new GroupModel({
    id: 'mock-id-2', name: 'Mock Group 2', path: '', subGroups: []
});

export let mockGroup3 = new GroupModel({
  id: 'mock-id-3', name: 'Fake Group 3', path: '', subGroups: []
});

export let mockGroups = [
    mockGroup1, mockGroup2, mockGroup3
];

export let mockApplicationDetails = {id: 'mock-app-id', name: 'mock-app-name'};

export let mockError = {
    error: {
        errorKey: 'failed',
        statusCode: 400,
        stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.'
    }
};

export let mockApiError = {
    oauth2Auth: {
        callCustomApi: () => {
            return Promise.reject(mockError);
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
            return Promise.resolve(mockGroups);
        }
    }
};

export let returnCallQueryParameters = {
    oauth2Auth: {
        callCustomApi: (queryUrl, operation, context, queryParams) => {
            return Promise.resolve(queryParams);
        }
    }
};

export let returnCallUrl = {
    oauth2Auth: {
        callCustomApi: (queryUrl, operation, context, queryParams) => {
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

export let groupRoles = [
    new GroupRoleModel({id: 'mock-id', name: 'MOCK-ADMIN-ROLE'}),
    new GroupRoleModel({id: 'mock-id', name: 'MOCK-USER-ROLE'}),
    new GroupRoleModel({id: 'mock-id', name: 'MOCK-ROLE-1'})
];

export let clientRoles = [ 'MOCK-ADMIN-ROLE', 'MOCK-USER-ROLE'];
