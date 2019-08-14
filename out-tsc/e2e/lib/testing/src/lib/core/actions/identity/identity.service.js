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
var user_model_1 = require("../../models/user.model");
var roles_service_1 = require("./roles.service");
var IdentityService = /** @class */ (function () {
    function IdentityService(api) {
        this.ROLES = {
            APS_USER: 'APS_USER',
            ACTIVITI_USER: 'ACTIVITI_USER',
            APS_ADMIN: 'APS_ADMIN',
            ACTIVITI_ADMIN: 'ACTIVITI_ADMIN',
            APS_DEVOPS_USER: 'APS_DEVOPS'
        };
        this.api = api;
    }
    IdentityService.prototype.createIdentityUserWithRole = function (apiService, roles) {
        return __awaiter(this, void 0, void 0, function () {
            var rolesService, user, i, roleId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rolesService = new roles_service_1.RolesService(apiService);
                        return [4 /*yield*/, this.createIdentityUser()];
                    case 1:
                        user = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < roles.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, rolesService.getRoleIdByRoleName(roles[i])];
                    case 3:
                        roleId = _a.sent();
                        return [4 /*yield*/, this.assignRole(user.idIdentityService, roleId, roles[i])];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/, user];
                }
            });
        });
    };
    IdentityService.prototype.createIdentityUser = function (user) {
        if (user === void 0) { user = new user_model_1.UserModel(); }
        return __awaiter(this, void 0, void 0, function () {
            var userIdentity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createUser(user)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getUserInfoByUsername(user.username)];
                    case 2:
                        userIdentity = _a.sent();
                        return [4 /*yield*/, this.resetPassword(userIdentity.id, user.password)];
                    case 3:
                        _a.sent();
                        user.idIdentityService = userIdentity.id;
                        return [2 /*return*/, user];
                }
            });
        });
    };
    IdentityService.prototype.createIdentityUserAndSyncECMBPM = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var createUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.api.config.provider === 'ECM' || this.api.config.provider === 'ALL')) return [3 /*break*/, 2];
                        createUser = {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            password: user.password,
                            email: user.email,
                            id: user.email
                        };
                        return [4 /*yield*/, this.api.apiService.core.peopleApi.addPerson(createUser)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(this.api.config.provider === 'BPM' || this.api.config.provider === 'ALL')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.api.apiService.activiti.adminUsersApi.createNewUser({
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                password: user.password,
                                type: 'enterprise',
                                tenantId: 1,
                                company: null
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.createIdentityUser(user)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    IdentityService.prototype.deleteIdentityUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.deleteUser(userId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    IdentityService.prototype.createUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var path, method, queryParams, postBody;
            return __generator(this, function (_a) {
                try {
                    path = '/users';
                    method = 'POST';
                    queryParams = {}, postBody = {
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        enabled: true,
                        email: user.email
                    };
                    return [2 /*return*/, this.api.performIdentityOperation(path, method, queryParams, postBody)];
                }
                catch (error) {
                    // tslint:disable-next-line:no-console
                    console.log('Create User - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
                }
                return [2 /*return*/];
            });
        });
    };
    IdentityService.prototype.deleteUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var path, method, queryParams, postBody;
            return __generator(this, function (_a) {
                path = "/users/" + userId;
                method = 'DELETE';
                queryParams = {}, postBody = {};
                return [2 /*return*/, this.api.performIdentityOperation(path, method, queryParams, postBody)];
            });
        });
    };
    IdentityService.prototype.getUserInfoByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var path, method, queryParams, postBody, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = "/users";
                        method = 'GET';
                        queryParams = { username: username }, postBody = {};
                        return [4 /*yield*/, this.api.performIdentityOperation(path, method, queryParams, postBody)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data[0]];
                }
            });
        });
    };
    IdentityService.prototype.resetPassword = function (id, password) {
        return __awaiter(this, void 0, void 0, function () {
            var path, method, queryParams, postBody;
            return __generator(this, function (_a) {
                path = "/users/" + id + "/reset-password";
                method = 'PUT';
                queryParams = {}, postBody = { type: 'password', value: password, temporary: false };
                return [2 /*return*/, this.api.performIdentityOperation(path, method, queryParams, postBody)];
            });
        });
    };
    IdentityService.prototype.addUserToGroup = function (userId, groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var path, method, queryParams, postBody;
            return __generator(this, function (_a) {
                try {
                    path = "/users/" + userId + "/groups/" + groupId;
                    method = 'PUT';
                    queryParams = {}, postBody = { realm: 'alfresco', userId: userId, groupId: groupId };
                    return [2 /*return*/, this.api.performIdentityOperation(path, method, queryParams, postBody)];
                }
                catch (error) {
                    // tslint:disable-next-line:no-console
                    console.log('Add User To Group - Service error, Response: ', JSON.parse(JSON.stringify(error)));
                }
                return [2 /*return*/];
            });
        });
    };
    IdentityService.prototype.assignRole = function (userId, roleId, roleName) {
        return __awaiter(this, void 0, void 0, function () {
            var path, method, queryParams, postBody;
            return __generator(this, function (_a) {
                path = "/users/" + userId + "/role-mappings/realm";
                method = 'POST';
                queryParams = {}, postBody = [{ id: roleId, name: roleName }];
                return [2 /*return*/, this.api.performIdentityOperation(path, method, queryParams, postBody)];
            });
        });
    };
    IdentityService.prototype.deleteClientRole = function (userId, clientId, roleId, roleName) {
        return __awaiter(this, void 0, void 0, function () {
            var path, method, queryParams, postBody;
            return __generator(this, function (_a) {
                path = "/users/" + userId + "/role-mappings/clients/" + clientId;
                method = 'DELETE', queryParams = {}, postBody = [{
                        id: roleId,
                        name: roleName,
                        composite: false,
                        clientRole: true,
                        containerId: clientId
                    }];
                return [2 /*return*/, this.api.performIdentityOperation(path, method, queryParams, postBody)];
            });
        });
    };
    return IdentityService;
}());
exports.IdentityService = IdentityService;
//# sourceMappingURL=identity.service.js.map