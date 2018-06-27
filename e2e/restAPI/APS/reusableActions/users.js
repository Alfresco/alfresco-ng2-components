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

let TenantsAPI = require('../../../restAPI/APS/enterprise/TenantsAPI');
let UserAPI = require('../../../restAPI/APS/enterprise/UsersAPI');
let GroupsAPI = require('../../../restAPI/APS/enterprise/GroupsAPI');
let adminEndpointsAPI = require('../../../restAPI/APS/enterprise/AdminEndpointsAPI');

let Tenant = require('../../../models/APS/Tenant');
let User = require('../../../models/APS/User');
let Group = require('../../../models/APS/Group');

let Endpoint = require('../../../models/APS/Endpoint');
let BasicAuth = require('../../../models/APS/BasicAuth');

let CONSTANTS = require('../../../util/constants.js');
let RESPONSE_STATUS_OK = CONSTANTS.HTTP_RESPONSE_STATUS.OK;

/**
 * Create tenant and a single user
 *
 * @param auth - authentication credentials
 * @returns {*|Promise.<T>|!Thenable.<R>} - user json
 */
module.exports.createTenantAndUser = function(auth) {
    let tenantUtils = new TenantsAPI();
    return tenantUtils.createTenant(auth, new Tenant())
        .then(function(result) {
            expect(result.statusCode).toEqual(RESPONSE_STATUS_OK.CODE);
            return new UserAPI().createUser(auth, user = new User({ tenantId: JSON.parse(result.responseBody).id }));
        })
        .then(function(result) {
            expect(result.statusCode).toEqual(RESPONSE_STATUS_OK.CODE);
            response = JSON.parse(result.responseBody);
            response.password = user.password;
            return response;
        })
        .catch(function(error) {
            console.error('Create tenant and user failed with error: ', error);
        });
};

/**
 *  Delete tenant
 *
 * @param auth - authentication credentials
 * @param tenantId - tenant ID
 * @returns {Promise.<T>|*|!Thenable.<R>}
 */
module.exports.cleanupTenant = function(auth, tenantId) {
    let tenantUtils = new TenantsAPI();
    return tenantUtils.deleteTenant(auth, tenantId)
        .then(function(result){
            expect(result.statusCode).toEqual(RESPONSE_STATUS_OK.CODE);
        })
        .catch(function(error) {
            console.error('Cleanup tenant failed with error:', error);
        });
};

/**
 * Create tenant authentication and endpoint
 *
 * @param auth - authentication credentials
 * @param authDetails - basic authentication details
 * @param endpointDetails - endpoint details
 */
module.exports.createAuthAndEndpoint = function(auth, authDetails, endpointDetails) {
    return adminEndpointsAPI.createBasicAuth(auth, basicAuthentication = new BasicAuth(authDetails))
        .then(function(result) {
            expect(result.statusCode).toEqual(RESPONSE_STATUS_OK.CODE);
            let response = JSON.parse(result.responseBody);
            endpointDetails.basicAuthId = response.id;
            endpointDetails.basicAuthName = response.name;
            endpointDetails.tenantId = response.tenantId;
            return adminEndpointsAPI.createEndpoint(auth, endpoint = new Endpoint(endpointDetails))
        })
        .then(function(result) {
            expect(result.statusCode).toEqual(RESPONSE_STATUS_OK.CODE);
            endpointDetails.id = JSON.parse(result.responseBody).id;
            return endpointDetails;
        })
        .catch(function(error) {
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
module.exports.createGroupAndAddCapabilities = function(auth, tenantId, userId, capabilitiesList) {
    let groupUtils = new GroupsAPI();
    let groupId;
    return groupUtils.createGroup(auth, new Group({'tenantId':tenantId, "type":''}))
        .then(function(result) {
            groupId = JSON.parse(result.responseBody).id;
            return groupUtils.addUserToGroup(auth, userId, groupId);
        })
        .then(function(result) {
            return groupUtils.addGroupCapabilities(auth, groupId, capabilitiesList);
        })
        .catch(function(error) {
            console.error('Create group and add capabilities failed with error: ', error);
        });
};