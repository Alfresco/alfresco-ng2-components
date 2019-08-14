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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var app_config_service_1 = require("../../app-config/app-config.service");
var alfresco_api_service_1 = require("../../services/alfresco-api.service");
var log_service_1 = require("../../services/log.service");
var IdentityGroupService = /** @class */ (function () {
    function IdentityGroupService(alfrescoApiService, appConfigService, logService) {
        this.alfrescoApiService = alfrescoApiService;
        this.appConfigService = appConfigService;
        this.logService = logService;
    }
    /**
     * Gets all groups.
     * @returns Array of group information objects
     */
    IdentityGroupService.prototype.getGroups = function () {
        var _this = this;
        var url = this.getGroupsApi();
        var httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {}, formParams = {}, authNames = [], contentTypes = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Queries groups.
     * @returns Array of user information objects
     */
    IdentityGroupService.prototype.queryGroups = function (requestQuery) {
        var _this = this;
        var url = this.getGroupsApi();
        var httpMethod = 'GET', pathParams = {}, queryParams = { first: requestQuery.first || 0, max: requestQuery.max || 5 }, bodyParam = {}, headerParams = {}, formParams = {}, authNames = [], contentTypes = ['application/json'];
        return this.getTotalGroupsCount().pipe(operators_1.switchMap(function (totalCount) {
            return rxjs_1.from(_this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, null, null, null)).pipe(operators_1.map(function (response) {
                return {
                    entries: response,
                    pagination: {
                        skipCount: requestQuery.first,
                        maxItems: requestQuery.max,
                        count: totalCount.count,
                        hasMoreItems: false,
                        totalItems: totalCount.count
                    }
                };
            }), operators_1.catchError(function (error) { return _this.handleError(error); }));
        }));
    };
    /**
     * Gets groups total count.
     * @returns Number of groups count.
     */
    IdentityGroupService.prototype.getTotalGroupsCount = function () {
        var _this = this;
        var url = this.getGroupsApi() + "/count";
        var contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance()
            .oauth2Auth.callCustomApi(url, 'GET', null, null, null, null, null, contentTypes, accepts, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Creates new group.
     * @param newGroup Object of containing the new group details.
     * @returns Empty response when the group created.
     */
    IdentityGroupService.prototype.createGroup = function (newGroup) {
        var _this = this;
        var url = this.getGroupsApi();
        var httpMethod = 'POST', pathParams = {}, queryParams = {}, bodyParam = newGroup, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Updates group details.
     * @param groupId Id of the targeted group.
     * @param updatedGroup Object of containing the group details
     * @returns Empty response when the group updated.
     */
    IdentityGroupService.prototype.updateGroup = function (groupId, updatedGroup) {
        var _this = this;
        var url = this.getGroupsApi() + ("/" + groupId);
        var request = JSON.stringify(updatedGroup);
        var httpMethod = 'PUT', pathParams = {}, queryParams = {}, bodyParam = request, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Deletes Group.
     * @param groupId Id of the group.
     * @returns Empty response when the group deleted.
     */
    IdentityGroupService.prototype.deleteGroup = function (groupId) {
        var _this = this;
        var url = this.getGroupsApi() + ("/" + groupId);
        var httpMethod = 'DELETE', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Finds groups filtered by name.
     * @param searchParams Object containing the name filter string
     * @returns List of group information
     */
    IdentityGroupService.prototype.findGroupsByName = function (searchParams) {
        var _this = this;
        if (searchParams.name === '') {
            return rxjs_1.of([]);
        }
        var url = this.getGroupsApi();
        var httpMethod = 'GET', pathParams = {}, queryParams = { search: searchParams.name }, bodyParam = {}, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return (rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, Object, null, null))).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Gets details for a specified group.
     * @param groupId Id of the target group
     * @returns Group details
     */
    IdentityGroupService.prototype.getGroupRoles = function (groupId) {
        var _this = this;
        var url = this.buildRolesUrl(groupId);
        var httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return (rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, Object, null, null))).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Check that a group has one or more roles from the supplied list.
     * @param groupId Id of the target group
     * @param roleNames Array of role names
     * @returns True if the group has one or more of the roles, false otherwise
     */
    IdentityGroupService.prototype.checkGroupHasRole = function (groupId, roleNames) {
        return this.getGroupRoles(groupId).pipe(operators_1.map(function (groupRoles) {
            var hasRole = false;
            if (groupRoles && groupRoles.length > 0) {
                roleNames.forEach(function (roleName) {
                    var role = groupRoles.find(function (groupRole) {
                        return roleName === groupRole.name;
                    });
                    if (role) {
                        hasRole = true;
                        return;
                    }
                });
            }
            return hasRole;
        }));
    };
    /**
     * Gets the client Id using the app name.
     * @param applicationName Name of the app
     * @returns client Id string
     */
    IdentityGroupService.prototype.getClientIdByApplicationName = function (applicationName) {
        var _this = this;
        var url = this.getApplicationIdApi();
        var httpMethod = 'GET', pathParams = {}, queryParams = { clientId: applicationName }, bodyParam = {}, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance()
            .oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, Object, null, null)).pipe(operators_1.map(function (response) {
            var clientId = response && response.length > 0 ? response[0].id : '';
            return clientId;
        }), operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Gets client roles.
     * @param groupId Id of the target group
     * @param clientId Id of the client
     * @returns List of roles
     */
    IdentityGroupService.prototype.getClientRoles = function (groupId, clientId) {
        var url = this.groupClientRoleMappingApi(groupId, clientId);
        var httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, Object, null, null));
    };
    /**
     * Checks if a group has a client app.
     * @param groupId Id of the target group
     * @param clientId Id of the client
     * @returns True if the group has the client app, false otherwise
     */
    IdentityGroupService.prototype.checkGroupHasClientApp = function (groupId, clientId) {
        var _this = this;
        return this.getClientRoles(groupId, clientId).pipe(operators_1.map(function (response) {
            if (response && response.length > 0) {
                return true;
            }
            return false;
        }), operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Check if a group has any of the client app roles in the supplied list.
     * @param groupId Id of the target group
     * @param clientId Id of the client
     * @param roleNames Array of role names to check
     * @returns True if the group has one or more of the roles, false otherwise
     */
    IdentityGroupService.prototype.checkGroupHasAnyClientAppRole = function (groupId, clientId, roleNames) {
        var _this = this;
        return this.getClientRoles(groupId, clientId).pipe(operators_1.map(function (clientRoles) {
            var hasRole = false;
            if (clientRoles.length > 0) {
                roleNames.forEach(function (roleName) {
                    var role = clientRoles.find(function (availableRole) {
                        return availableRole.name === roleName;
                    });
                    if (role) {
                        hasRole = true;
                        return;
                    }
                });
            }
            return hasRole;
        }), operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    IdentityGroupService.prototype.groupClientRoleMappingApi = function (groupId, clientId) {
        return this.appConfigService.get('identityHost') + "/groups/" + groupId + "/role-mappings/clients/" + clientId;
    };
    IdentityGroupService.prototype.getApplicationIdApi = function () {
        return this.appConfigService.get('identityHost') + "/clients";
    };
    IdentityGroupService.prototype.getGroupsApi = function () {
        return this.appConfigService.get('identityHost') + "/groups";
    };
    IdentityGroupService.prototype.buildRolesUrl = function (groupId) {
        return this.appConfigService.get('identityHost') + "/groups/" + groupId + "/role-mappings/realm/composite";
    };
    /**
     * Throw the error
     * @param error
     */
    IdentityGroupService.prototype.handleError = function (error) {
        this.logService.error(error);
        return rxjs_1.throwError(error || 'Server error');
    };
    IdentityGroupService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            app_config_service_1.AppConfigService,
            log_service_1.LogService])
    ], IdentityGroupService);
    return IdentityGroupService;
}());
exports.IdentityGroupService = IdentityGroupService;
//# sourceMappingURL=identity-group.service.js.map