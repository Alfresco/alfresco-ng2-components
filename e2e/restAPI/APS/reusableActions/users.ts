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

import TenantsAPI = require('../../../restAPI/APS/enterprise/TenantsAPI');
import UserAPI = require('../../../restAPI/APS/enterprise/UsersAPI');
import GroupsAPI = require('../../../restAPI/APS/enterprise/GroupsAPI');
import adminEndpointsAPI = require('../../../restAPI/APS/enterprise/AdminEndpointsAPI');

import Tenant = require('../../../models/APS/Tenant');
import User = require('../../../models/APS/User');
import Group = require('../../../models/APS/Group');

import Endpoint = require('../../../models/APS/Endpoint');
import BasicAuth = require('../../../models/APS/BasicAuth');

import CONSTANTS = require('../../../util/constants.js');
import RESPONSE_STATUS_OK = CONSTANTS.HTTP_RESPONSE_STATUS.OK;

/**
 * Create tenant and a user
 */
module.exports.createTenantAndUser = async (alfrescoJsApi) => {
    let newTenant = await alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

    let user = new User({ tenantId: newTenant.id });

    await alfrescoJsApi.activiti.adminUsersApi.createNewUser(user);

    return user;
};

/**
 *  Delete tenant
 *
 * @param auth - authentication credentials
 * @param tenantId - tenant ID
 * @returns {Promise.<T>|*|!Thenable.<R>}
 */
module.exports.cleanupTenant = async (alfrescoJsApi, tenantId) => {
    await alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
};

/**
 * Create tenant authentication and endpoint
 *
 * @param auth - authentication credentials
 * @param authDetails - basic authentication details
 * @param endpointDetails - endpoint details
 */
module.exports.createAuthAndEndpoint = function (auth, authDetails, endpointDetails) {
    return adminEndpointsAPI.createBasicAuth(auth, basicAuthentication = new BasicAuth(authDetails))
        .then(function (result) {
            expect(result.statusCode).toEqual(RESPONSE_STATUS_OK.CODE);
            let response = JSON.parse(result.responseBody);
            endpointDetails.basicAuthId = response.id;
            endpointDetails.basicAuthName = response.name;
            endpointDetails.tenantId = response.tenantId;
            return adminEndpointsAPI.createEndpoint(auth, endpoint = new Endpoint(endpointDetails));
        })
        .then(function (result) {
            expect(result.statusCode).toEqual(RESPONSE_STATUS_OK.CODE);
            endpointDetails.id = JSON.parse(result.responseBody).id;
            return endpointDetails;
        })
        .catch(function (error) {
            console.error('Create basic auth and endpoint failed with error: ', error);
        });
};

/**
 *  Add group capabilities
 *
 * @param auth - authentication credentials
 * @param tenantId - tenant ID
 * @param userId - user ID
 * @param capabilitiesList - {Array}
 * @returns {Promise.<T>|*|!Thenable.<R>}
 */
module.exports.createGroupAndAddCapabilities = function (auth, tenantId, userId, capabilitiesList) {
    let groupUtils = new GroupsAPI();
    let groupId;
    return groupUtils.createGroup(auth, new Group({ 'tenantId': tenantId, 'type': '' }))
        .then(function (result) {
            groupId = JSON.parse(result.responseBody).id;
            return groupUtils.addUserToGroup(auth, userId, groupId);
        })
        .then(function (result) {
            return groupUtils.addGroupCapabilities(auth, groupId, capabilitiesList);
        })
        .catch(function (error) {
            console.error('Create group and add capabilities failed with error: ', error);
        });
};
