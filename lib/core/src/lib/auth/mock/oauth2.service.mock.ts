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

import { mockGroups, mockIdentityGroups, roleMappingMock } from './identity-group.mock';
import { mockAssignedRoles, mockAvailableRoles, mockEffectiveRoles, mockIdentityUsers } from './identity-user.mock';

export const queryUsersMockApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve(mockIdentityUsers)
    }
};

export const createUserMockApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve()
    }
};

export const updateUserMockApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve()
    }
};

export const deleteUserMockApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve()
    }
};

export const getInvolvedGroupsMockApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve(mockGroups)
    }
};

export const joinGroupMockApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve()
    }
};

export const leaveGroupMockApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve()
    }
};

export const getAvailableRolesMockApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve(mockAvailableRoles)
    }
};

export const getAssignedRolesMockApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve(mockAssignedRoles)
    }
};

export const getEffectiveRolesMockApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve(mockEffectiveRoles)
    }
};

export const assignRolesMockApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve()
    }
};

export const removeRolesMockApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve()
    }
};

export const roleMappingApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve(roleMappingMock)
    }
};

export const noRoleMappingApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve([])
    }
};

export const groupsMockApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve(mockIdentityGroups)
    }
};

export const createGroupMappingApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve()
    }
};

export const updateGroupMappingApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve()
    }
};

export const deleteGroupMappingApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve()
    }
};

export const applicationDetailsMockApi: any = {
    oauth2Auth: {
        callCustomApi: () => Promise.resolve([{id: 'mock-app-id', name: 'mock-app-name'}])
    }
};
