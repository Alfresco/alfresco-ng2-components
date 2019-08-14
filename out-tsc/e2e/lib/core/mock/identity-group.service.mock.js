"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var identity_group_model_1 = require("../userinfo/models/identity-group.model");
var identity_role_model_1 = require("../userinfo/models/identity-role.model");
exports.mockIdentityGroup1 = new identity_group_model_1.IdentityGroupModel({
    id: 'mock-group-id-1', name: 'Mock Group 1', path: '/mock', subGroups: []
});
exports.mockIdentityGroup2 = new identity_group_model_1.IdentityGroupModel({
    id: 'mock-group-id-2', name: 'Mock Group 2', path: '', subGroups: []
});
exports.mockIdentityGroup3 = new identity_group_model_1.IdentityGroupModel({
    id: 'mock-group-id-3', name: 'Mock Group 3', path: '', subGroups: []
});
exports.mockIdentityGroup4 = new identity_group_model_1.IdentityGroupModel({
    id: 'mock-group-id-4', name: 'Mock Group 4', path: '', subGroups: []
});
exports.mockIdentityGroup5 = new identity_group_model_1.IdentityGroupModel({
    id: 'mock-group-id-5', name: 'Mock Group 5', path: '', subGroups: []
});
exports.mockIdentityGroupsCount = { count: 10 };
exports.mockIdentityGroups = [
    exports.mockIdentityGroup1, exports.mockIdentityGroup2, exports.mockIdentityGroup3, exports.mockIdentityGroup5, exports.mockIdentityGroup5
];
exports.mockApplicationDetails = { id: 'mock-app-id', name: 'mock-app-name' };
exports.groupAPIMockError = {
    error: {
        errorKey: 'failed',
        statusCode: 400,
        stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.'
    }
};
exports.mockApiError = {
    oauth2Auth: {
        callCustomApi: function () {
            return Promise.reject(exports.groupAPIMockError);
        }
    }
};
exports.roleMappingMock = [
    { id: 'role-id-1', name: 'role-name-1' }, { id: 'role-id-2', name: 'role-name-2' }
];
exports.roleMappingApi = {
    oauth2Auth: {
        callCustomApi: function () {
            return Promise.resolve(exports.roleMappingMock);
        }
    }
};
exports.noRoleMappingApi = {
    oauth2Auth: {
        callCustomApi: function () {
            return Promise.resolve([]);
        }
    }
};
exports.groupsMockApi = {
    oauth2Auth: {
        callCustomApi: function () {
            return Promise.resolve(exports.mockIdentityGroups);
        }
    }
};
exports.getGroupsCountMockApi = {
    oauth2Auth: {
        callCustomApi: function () {
            return Promise.resolve(10);
        }
    }
};
exports.queryGroupsMockApi = {
    oauth2Auth: {
        callCustomApi: function () {
            return Promise.resolve(exports.mockIdentityGroups);
        }
    }
};
exports.createGroupMappingApi = {
    oauth2Auth: {
        callCustomApi: function () {
            return Promise.resolve();
        }
    }
};
exports.updateGroupMappingApi = {
    oauth2Auth: {
        callCustomApi: function () {
            return Promise.resolve();
        }
    }
};
exports.deleteGroupMappingApi = {
    oauth2Auth: {
        callCustomApi: function () {
            return Promise.resolve();
        }
    }
};
exports.returnCallQueryParameters = {
    oauth2Auth: {
        callCustomApi: function (queryUrl, operation, context, queryParams) {
            return Promise.resolve(queryParams);
        }
    }
};
exports.returnCallUrl = {
    oauth2Auth: {
        callCustomApi: function (queryUrl, operation, context, queryParams) {
            return Promise.resolve(queryUrl);
        }
    }
};
exports.applicationDetailsMockApi = {
    oauth2Auth: {
        callCustomApi: function () {
            return Promise.resolve([exports.mockApplicationDetails]);
        }
    }
};
exports.mockIdentityRoles = [
    new identity_role_model_1.IdentityRoleModel({ id: 'mock-role-id', name: 'MOCK-ADMIN-ROLE' }),
    new identity_role_model_1.IdentityRoleModel({ id: 'mock-role-id', name: 'MOCK-USER-ROLE' }),
    new identity_role_model_1.IdentityRoleModel({ id: 'mock-role-id', name: 'MOCK-ROLE-1' })
];
exports.clientRoles = ['MOCK-ADMIN-ROLE', 'MOCK-USER-ROLE'];
//# sourceMappingURL=identity-group.service.mock.js.map