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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var identity_user_model_1 = require("../models/identity-user.model");
var jwt_helper_service_1 = require("../../services/jwt-helper.service");
var log_service_1 = require("../../services/log.service");
var app_config_service_1 = require("../../app-config/app-config.service");
var alfresco_api_service_1 = require("../../services/alfresco-api.service");
var IdentityUserService = /** @class */ (function () {
    function IdentityUserService(jwtHelperService, alfrescoApiService, appConfigService, logService) {
        this.jwtHelperService = jwtHelperService;
        this.alfrescoApiService = alfrescoApiService;
        this.appConfigService = appConfigService;
        this.logService = logService;
    }
    /**
     * Gets the name and other basic details of the current user.
     * @returns The user's details
     */
    IdentityUserService.prototype.getCurrentUserInfo = function () {
        var familyName = this.jwtHelperService.getValueFromLocalAccessToken(jwt_helper_service_1.JwtHelperService.FAMILY_NAME);
        var givenName = this.jwtHelperService.getValueFromLocalAccessToken(jwt_helper_service_1.JwtHelperService.GIVEN_NAME);
        var email = this.jwtHelperService.getValueFromLocalAccessToken(jwt_helper_service_1.JwtHelperService.USER_EMAIL);
        var username = this.jwtHelperService.getValueFromLocalAccessToken(jwt_helper_service_1.JwtHelperService.USER_PREFERRED_USERNAME);
        var user = { firstName: givenName, lastName: familyName, email: email, username: username };
        return new identity_user_model_1.IdentityUserModel(user);
    };
    /**
     * Find users based on search input.
     * @param search Search query string
     * @returns List of users
     */
    IdentityUserService.prototype.findUsersByName = function (search) {
        if (search === '') {
            return rxjs_1.of([]);
        }
        var url = this.buildUserUrl();
        var httpMethod = 'GET', pathParams = {}, queryParams = { search: search }, bodyParam = {}, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return (rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, Object, null, null)));
    };
    /**
     * Find users based on username input.
     * @param username Search query string
     * @returns List of users
     */
    IdentityUserService.prototype.findUserByUsername = function (username) {
        if (username === '') {
            return rxjs_1.of([]);
        }
        var url = this.buildUserUrl();
        var httpMethod = 'GET', pathParams = {}, queryParams = { username: username }, bodyParam = {}, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return (rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, Object, null, null)));
    };
    /**
     * Find users based on email input.
     * @param email Search query string
     * @returns List of users
     */
    IdentityUserService.prototype.findUserByEmail = function (email) {
        if (email === '') {
            return rxjs_1.of([]);
        }
        var url = this.buildUserUrl();
        var httpMethod = 'GET', pathParams = {}, queryParams = { email: email }, bodyParam = {}, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return (rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, Object, null, null)));
    };
    /**
     * Find users based on id input.
     * @param id Search query string
     * @returns users object
     */
    IdentityUserService.prototype.findUserById = function (id) {
        if (id === '') {
            return rxjs_1.of([]);
        }
        var url = this.buildUserUrl() + '/' + id;
        var httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return (rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, Object, null, null)));
    };
    /**
     * Get client roles of a user for a particular client.
     * @param userId ID of the target user
     * @param clientId ID of the client app
     * @returns List of client roles
     */
    IdentityUserService.prototype.getClientRoles = function (userId, clientId) {
        var url = this.buildUserClientRoleMapping(userId, clientId);
        var httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, Object, null, null));
    };
    /**
     * Checks whether user has access to a client app.
     * @param userId ID of the target user
     * @param clientId ID of the client app
     * @returns True if the user has access, false otherwise
     */
    IdentityUserService.prototype.checkUserHasClientApp = function (userId, clientId) {
        return this.getClientRoles(userId, clientId).pipe(operators_1.map(function (clientRoles) {
            if (clientRoles.length > 0) {
                return true;
            }
            return false;
        }));
    };
    /**
     * Checks whether a user has any of the client app roles.
     * @param userId ID of the target user
     * @param clientId ID of the client app
     * @param roleNames List of role names to check for
     * @returns True if the user has one or more of the roles, false otherwise
     */
    IdentityUserService.prototype.checkUserHasAnyClientAppRole = function (userId, clientId, roleNames) {
        return this.getClientRoles(userId, clientId).pipe(operators_1.map(function (clientRoles) {
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
        }));
    };
    /**
     * Gets the client ID for an application.
     * @param applicationName Name of the application
     * @returns Client ID string
     */
    IdentityUserService.prototype.getClientIdByApplicationName = function (applicationName) {
        var url = this.buildGetClientsUrl();
        var httpMethod = 'GET', pathParams = {}, queryParams = { clientId: applicationName }, bodyParam = {}, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance()
            .oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, Object, null, null)).pipe(operators_1.map(function (response) {
            var clientId = response && response.length > 0 ? response[0].id : '';
            return clientId;
        }));
    };
    /**
     * Checks if a user has access to an application.
     * @param userId ID of the user
     * @param applicationName Name of the application
     * @returns True if the user has access, false otherwise
     */
    IdentityUserService.prototype.checkUserHasApplicationAccess = function (userId, applicationName) {
        var _this = this;
        return this.getClientIdByApplicationName(applicationName).pipe(operators_1.switchMap(function (clientId) {
            return _this.checkUserHasClientApp(userId, clientId);
        }));
    };
    /**
     * Checks if a user has any application role.
     * @param userId ID of the target user
     * @param applicationName Name of the application
     * @param roleNames List of role names to check for
     * @returns True if the user has one or more of the roles, false otherwise
     */
    IdentityUserService.prototype.checkUserHasAnyApplicationRole = function (userId, applicationName, roleNames) {
        var _this = this;
        return this.getClientIdByApplicationName(applicationName).pipe(operators_1.switchMap(function (clientId) {
            return _this.checkUserHasAnyClientAppRole(userId, clientId, roleNames);
        }));
    };
    /**
     * Gets details for all users.
     * @returns Array of user info objects
     */
    IdentityUserService.prototype.getUsers = function () {
        var url = this.buildUserUrl();
        var httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {}, formParams = {}, authNames = [], contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts, null, null)).pipe(operators_1.map(function (response) {
            return response;
        }));
    };
    /**
     * Gets a list of roles for a user.
     * @param userId ID of the user
     * @returns Array of role info objects
     */
    IdentityUserService.prototype.getUserRoles = function (userId) {
        var url = this.buildRolesUrl(userId);
        var httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, Object, null, null)).pipe(operators_1.map(function (response) {
            return response;
        }));
    };
    /**
     * Gets an array of users (including the current user) who have any of the roles in the supplied list.
     * @param roleNames List of role names to look for
     * @returns Array of user info objects
     */
    IdentityUserService.prototype.getUsersByRolesWithCurrentUser = function (roleNames) {
        return __awaiter(this, void 0, void 0, function () {
            var filteredUsers, users, i, hasAnyRole;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filteredUsers = [];
                        if (!(roleNames && roleNames.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getUsers().toPromise()];
                    case 1:
                        users = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < users.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.userHasAnyRole(users[i].id, roleNames)];
                    case 3:
                        hasAnyRole = _a.sent();
                        if (hasAnyRole) {
                            filteredUsers.push(users[i]);
                        }
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, filteredUsers];
                }
            });
        });
    };
    /**
     * Gets an array of users (not including the current user) who have any of the roles in the supplied list.
     * @param roleNames List of role names to look for
     * @returns Array of user info objects
     */
    IdentityUserService.prototype.getUsersByRolesWithoutCurrentUser = function (roleNames) {
        return __awaiter(this, void 0, void 0, function () {
            var filteredUsers, currentUser_1, users, i, hasAnyRole;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filteredUsers = [];
                        if (!(roleNames && roleNames.length > 0)) return [3 /*break*/, 5];
                        currentUser_1 = this.getCurrentUserInfo();
                        return [4 /*yield*/, this.getUsers().toPromise()];
                    case 1:
                        users = _a.sent();
                        users = users.filter(function (user) { return user.username !== currentUser_1.username; });
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < users.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.userHasAnyRole(users[i].id, roleNames)];
                    case 3:
                        hasAnyRole = _a.sent();
                        if (hasAnyRole) {
                            filteredUsers.push(users[i]);
                        }
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, filteredUsers];
                }
            });
        });
    };
    IdentityUserService.prototype.userHasAnyRole = function (userId, roleNames) {
        return __awaiter(this, void 0, void 0, function () {
            var userRoles, hasAnyRole;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserRoles(userId).toPromise()];
                    case 1:
                        userRoles = _a.sent();
                        hasAnyRole = roleNames.some(function (roleName) {
                            var filteredRoles = userRoles.filter(function (userRole) {
                                return userRole.name.toLocaleLowerCase() === roleName.toLocaleLowerCase();
                            });
                            return filteredRoles.length > 0;
                        });
                        return [2 /*return*/, hasAnyRole];
                }
            });
        });
    };
    /**
     * Checks if a user has one of the roles from a list.
     * @param userId ID of the target user
     * @param roleNames Array of roles to check for
     * @returns True if the user has one of the roles, false otherwise
     */
    IdentityUserService.prototype.checkUserHasRole = function (userId, roleNames) {
        return this.getUserRoles(userId).pipe(operators_1.map(function (userRoles) {
            var hasRole = false;
            if (userRoles && userRoles.length > 0) {
                roleNames.forEach(function (roleName) {
                    var role = userRoles.find(function (userRole) {
                        return roleName === userRole.name;
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
     * Gets details for all users.
     * @returns Array of user information objects.
     */
    IdentityUserService.prototype.queryUsers = function (requestQuery) {
        var _this = this;
        var url = this.buildUserUrl();
        var httpMethod = 'GET', pathParams = {}, queryParams = { first: requestQuery.first, max: requestQuery.max }, bodyParam = {}, headerParams = {}, formParams = {}, authNames = [], contentTypes = ['application/json'];
        return this.getTotalUsersCount().pipe(operators_1.switchMap(function (totalCount) {
            return rxjs_1.from(_this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, null, null, null)).pipe(operators_1.map(function (response) {
                return {
                    entries: response,
                    pagination: {
                        skipCount: requestQuery.first,
                        maxItems: requestQuery.max,
                        count: totalCount,
                        hasMoreItems: false,
                        totalItems: totalCount
                    }
                };
            }), operators_1.catchError(function (error) { return _this.handleError(error); }));
        }));
    };
    /**
     * Gets users total count.
     * @returns Number of users count.
     */
    IdentityUserService.prototype.getTotalUsersCount = function () {
        var _this = this;
        var url = this.buildUserUrl() + "/count";
        var contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance()
            .oauth2Auth.callCustomApi(url, 'GET', null, null, null, null, null, contentTypes, accepts, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Creates new user.
     * @param newUser Object containing the new user details.
     * @returns Empty response when the user created.
     */
    IdentityUserService.prototype.createUser = function (newUser) {
        var _this = this;
        var url = this.buildUserUrl();
        var request = JSON.stringify(newUser);
        var httpMethod = 'POST', pathParams = {}, queryParams = {}, bodyParam = request, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Updates user details.
     * @param userId Id of the user.
     * @param updatedUser Object containing the user details.
     * @returns Empty response when the user updated.
     */
    IdentityUserService.prototype.updateUser = function (userId, updatedUser) {
        var _this = this;
        var url = this.buildUserUrl() + '/' + userId;
        var request = JSON.stringify(updatedUser);
        var httpMethod = 'PUT', pathParams = {}, queryParams = {}, bodyParam = request, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Deletes User.
     * @param userId Id of the  user.
     * @returns Empty response when the user deleted.
     */
    IdentityUserService.prototype.deleteUser = function (userId) {
        var _this = this;
        var url = this.buildUserUrl() + '/' + userId;
        var httpMethod = 'DELETE', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Changes user password.
     * @param userId Id of the user.
     * @param credentials Details of user Credentials.
     * @returns Empty response when the password changed.
     */
    IdentityUserService.prototype.changePassword = function (userId, newPassword) {
        var _this = this;
        var url = this.buildUserUrl() + '/' + userId + '/reset-password';
        var request = JSON.stringify(newPassword);
        var httpMethod = 'PUT', pathParams = {}, queryParams = {}, bodyParam = request, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Gets involved groups.
     * @param userId Id of the user.
     * @returns Array of involved groups information objects.
     */
    IdentityUserService.prototype.getInvolvedGroups = function (userId) {
        var _this = this;
        var url = this.buildUserUrl() + '/' + userId + '/groups/';
        var httpMethod = 'GET', pathParams = { id: userId }, queryParams = {}, bodyParam = {}, headerParams = {}, formParams = {}, authNames = [], contentTypes = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Joins group.
     * @param joinGroupRequest Details of join group request (IdentityJoinGroupRequestModel).
     * @returns Empty response when the user joined the group.
     */
    IdentityUserService.prototype.joinGroup = function (joinGroupRequest) {
        var _this = this;
        var url = this.buildUserUrl() + '/' + joinGroupRequest.userId + '/groups/' + joinGroupRequest.groupId;
        var request = JSON.stringify(joinGroupRequest);
        var httpMethod = 'PUT', pathParams = {}, queryParams = {}, bodyParam = request, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Leaves group.
     * @param userId Id of the user.
     * @param groupId Id of the  group.
     * @returns Empty response when the user left the group.
     */
    IdentityUserService.prototype.leaveGroup = function (userId, groupId) {
        var _this = this;
        var url = this.buildUserUrl() + '/' + userId + '/groups/' + groupId;
        var httpMethod = 'DELETE', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Gets available roles
     * @param userId Id of the user.
     * @returns Array of available roles information objects
     */
    IdentityUserService.prototype.getAvailableRoles = function (userId) {
        var _this = this;
        var url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm/available';
        var httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {}, formParams = {}, authNames = [], contentTypes = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Gets assigned roles.
     * @param userId Id of the user.
     * @returns Array of assigned roles information objects
     */
    IdentityUserService.prototype.getAssignedRoles = function (userId) {
        var _this = this;
        var url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm';
        var httpMethod = 'GET', pathParams = { id: userId }, queryParams = {}, bodyParam = {}, headerParams = {}, formParams = {}, authNames = [], contentTypes = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Gets effective roles.
     * @param userId Id of the user.
     * @returns Array of composite roles information objects
     */
    IdentityUserService.prototype.getEffectiveRoles = function (userId) {
        var _this = this;
        var url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm/composite';
        var httpMethod = 'GET', pathParams = { id: userId }, queryParams = {}, bodyParam = {}, headerParams = {}, formParams = {}, authNames = [], contentTypes = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Assigns roles to the user.
     * @param userId Id of the user.
     * @param roles Array of roles.
     * @returns Empty response when the role assigned.
     */
    IdentityUserService.prototype.assignRoles = function (userId, roles) {
        var _this = this;
        var url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm';
        var request = JSON.stringify(roles);
        var httpMethod = 'POST', pathParams = {}, queryParams = {}, bodyParam = request, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    /**
     * Removes assigned roles.
     * @param userId Id of the user.
     * @param roles Array of roles.
     * @returns Empty response when the role removed.
     */
    IdentityUserService.prototype.removeRoles = function (userId, removedRoles) {
        var _this = this;
        var url = this.buildUserUrl() + '/' + userId + '/role-mappings/realm';
        var request = JSON.stringify(removedRoles);
        var httpMethod = 'DELETE', pathParams = {}, queryParams = {}, bodyParam = request, headerParams = {}, formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return rxjs_1.from(this.alfrescoApiService.getInstance().oauth2Auth.callCustomApi(url, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, null, null, null)).pipe(operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    IdentityUserService.prototype.buildUserUrl = function () {
        return this.appConfigService.get('identityHost') + "/users";
    };
    IdentityUserService.prototype.buildUserClientRoleMapping = function (userId, clientId) {
        return this.appConfigService.get('identityHost') + "/users/" + userId + "/role-mappings/clients/" + clientId;
    };
    IdentityUserService.prototype.buildRolesUrl = function (userId) {
        return this.appConfigService.get('identityHost') + "/users/" + userId + "/role-mappings/realm/composite";
    };
    IdentityUserService.prototype.buildGetClientsUrl = function () {
        return this.appConfigService.get('identityHost') + "/clients";
    };
    /**
     * Throw the error
     * @param error
     */
    IdentityUserService.prototype.handleError = function (error) {
        this.logService.error(error);
        return rxjs_1.throwError(error || 'Server error');
    };
    IdentityUserService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [jwt_helper_service_1.JwtHelperService,
            alfresco_api_service_1.AlfrescoApiService,
            app_config_service_1.AppConfigService,
            log_service_1.LogService])
    ], IdentityUserService);
    return IdentityUserService;
}());
exports.IdentityUserService = IdentityUserService;
//# sourceMappingURL=identity-user.service.js.map