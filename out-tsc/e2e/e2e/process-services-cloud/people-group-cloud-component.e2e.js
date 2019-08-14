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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var peopleGroupCloudComponentPage_1 = require("../pages/adf/demo-shell/process-services/peopleGroupCloudComponentPage");
var adf_testing_1 = require("@alfresco/adf-testing");
var protractor_1 = require("protractor");
var adf_testing_2 = require("@alfresco/adf-testing");
var resources = require("../util/resources");
describe('People Groups Cloud Component', function () {
    describe('People Groups Cloud Component', function () {
        var loginSSOPage = new adf_testing_2.LoginSSOPage();
        var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
        var peopleGroupCloudComponentPage = new peopleGroupCloudComponentPage_1.PeopleGroupCloudComponentPage();
        var peopleCloudComponent = new adf_testing_1.PeopleCloudComponentPage();
        var groupCloudComponentPage = new adf_testing_1.GroupCloudComponentPage();
        var identityService;
        var groupIdentityService;
        var rolesService;
        var settingsPage = new adf_testing_1.SettingsPage();
        var apiService = new adf_testing_2.ApiService(protractor_1.browser.params.config.oauth2.clientId, protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.providers);
        var apsUser, testUser;
        var activitiUser;
        var noRoleUser;
        var groupAps;
        var groupActiviti;
        var groupNoRole;
        var apsUserRoleId;
        var apsAdminRoleId;
        var activitiAdminRoleId;
        var clientActivitiAdminRoleId, clientActivitiUserRoleId;
        var users = [];
        var groups = [];
        var clientId;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiService.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                    case 1:
                        _a.sent();
                        identityService = new adf_testing_2.IdentityService(apiService);
                        rolesService = new adf_testing_2.RolesService(apiService);
                        groupIdentityService = new adf_testing_2.GroupIdentityService(apiService);
                        return [4 /*yield*/, groupIdentityService.getClientIdByApplicationName(resources.ACTIVITI7_APPS.SIMPLE_APP.name)];
                    case 2:
                        clientId = _a.sent();
                        return [4 /*yield*/, groupIdentityService.createIdentityGroup()];
                    case 3:
                        groupActiviti = _a.sent();
                        return [4 /*yield*/, rolesService.getClientRoleIdByRoleName(groupActiviti.id, clientId, identityService.ROLES.ACTIVITI_ADMIN)];
                    case 4:
                        clientActivitiAdminRoleId = _a.sent();
                        return [4 /*yield*/, rolesService.getClientRoleIdByRoleName(groupActiviti.id, clientId, identityService.ROLES.ACTIVITI_USER)];
                    case 5:
                        clientActivitiUserRoleId = _a.sent();
                        return [4 /*yield*/, identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.APS_USER])];
                    case 6:
                        testUser = _a.sent();
                        return [4 /*yield*/, identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.APS_USER])];
                    case 7:
                        apsUser = _a.sent();
                        return [4 /*yield*/, identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER])];
                    case 8:
                        activitiUser = _a.sent();
                        return [4 /*yield*/, identityService.createIdentityUser()];
                    case 9:
                        noRoleUser = _a.sent();
                        return [4 /*yield*/, identityService.deleteClientRole(noRoleUser.idIdentityService, clientId, clientActivitiAdminRoleId, identityService.ROLES.ACTIVITI_ADMIN)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, identityService.deleteClientRole(noRoleUser.idIdentityService, clientId, clientActivitiUserRoleId, identityService.ROLES.ACTIVITI_USER)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, groupIdentityService.createIdentityGroup()];
                    case 12:
                        groupAps = _a.sent();
                        return [4 /*yield*/, rolesService.getRoleIdByRoleName(identityService.ROLES.APS_ADMIN)];
                    case 13:
                        apsAdminRoleId = _a.sent();
                        return [4 /*yield*/, rolesService.getRoleIdByRoleName(identityService.ROLES.APS_USER)];
                    case 14:
                        apsUserRoleId = _a.sent();
                        return [4 /*yield*/, groupIdentityService.assignRole(groupAps.id, apsAdminRoleId, identityService.ROLES.APS_ADMIN)];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, groupIdentityService.assignRole(groupAps.id, apsUserRoleId, identityService.ROLES.APS_USER)];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, rolesService.getRoleIdByRoleName(identityService.ROLES.ACTIVITI_ADMIN)];
                    case 17:
                        activitiAdminRoleId = _a.sent();
                        return [4 /*yield*/, groupIdentityService.assignRole(groupActiviti.id, activitiAdminRoleId, identityService.ROLES.ACTIVITI_ADMIN)];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, groupIdentityService.createIdentityGroup()];
                    case 19:
                        groupNoRole = _a.sent();
                        return [4 /*yield*/, groupIdentityService.addClientRole(groupAps.id, clientId, clientActivitiAdminRoleId, identityService.ROLES.ACTIVITI_ADMIN)];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, groupIdentityService.addClientRole(groupActiviti.id, clientId, clientActivitiAdminRoleId, identityService.ROLES.ACTIVITI_ADMIN)];
                    case 21:
                        _a.sent();
                        users = ["" + apsUser.idIdentityService, "" + activitiUser.idIdentityService, "" + noRoleUser.idIdentityService, "" + testUser.idIdentityService];
                        groups = ["" + groupAps.id, "" + groupActiviti.id, "" + groupNoRole.id];
                        return [4 /*yield*/, settingsPage.setProviderBpmSso(protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.identityHost)];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password)];
                    case 23:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var _i, users_1, user, _a, groups_1, group;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, apiService.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                    case 1:
                        _b.sent();
                        _i = 0, users_1 = users;
                        _b.label = 2;
                    case 2:
                        if (!(_i < users_1.length)) return [3 /*break*/, 5];
                        user = users_1[_i];
                        return [4 /*yield*/, identityService.deleteIdentityUser(user)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        _a = 0, groups_1 = groups;
                        _b.label = 6;
                    case 6:
                        if (!(_a < groups_1.length)) return [3 /*break*/, 9];
                        group = groups_1[_a];
                        return [4 /*yield*/, groupIdentityService.deleteIdentityGroup(group)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        _a++;
                        return [3 /*break*/, 6];
                    case 9: return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.navigateToPeopleGroupCloudPage()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.checkGroupsCloudComponentTitleIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.checkPeopleCloudComponentTitleIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.refresh()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('[C297674] Should be able to add filtering to People Cloud Component', function () {
            beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, peopleGroupCloudComponentPage.checkPeopleCloudMultipleSelectionIsSelected()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, peopleGroupCloudComponentPage.clickPeopleCloudFilterRole()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, peopleGroupCloudComponentPage.checkPeopleCloudFilterRole()];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('No role filtering', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, peopleCloudComponent.searchAssignee(noRoleUser.lastName)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, peopleCloudComponent.checkUserIsDisplayed(noRoleUser.firstName + " " + noRoleUser.lastName)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, peopleCloudComponent.searchAssignee(apsUser.lastName)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, peopleCloudComponent.checkUserIsDisplayed(apsUser.firstName + " " + apsUser.lastName)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, peopleCloudComponent.searchAssignee(activitiUser.lastName)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, peopleCloudComponent.checkUserIsDisplayed(activitiUser.firstName + " " + activitiUser.lastName)];
                        case 6:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('One role filtering', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.enterPeopleRoles("[\"" + identityService.ROLES.APS_USER + "\"]")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, peopleCloudComponent.searchAssignee(apsUser.lastName)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, peopleCloudComponent.checkUserIsDisplayed(apsUser.firstName + " " + apsUser.lastName)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, peopleCloudComponent.searchAssignee(activitiUser.lastName)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, peopleCloudComponent.checkUserIsNotDisplayed(activitiUser.firstName + " " + activitiUser.lastName)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, peopleCloudComponent.searchAssignee(noRoleUser.lastName)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, peopleCloudComponent.checkUserIsNotDisplayed(noRoleUser.firstName + " " + noRoleUser.lastName)];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Multiple roles filtering', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.enterPeopleRoles("[\"" + identityService.ROLES.APS_USER + "\", \"" + identityService.ROLES.ACTIVITI_USER + "\"]")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, peopleCloudComponent.searchAssignee(apsUser.lastName)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, peopleCloudComponent.checkUserIsDisplayed(apsUser.firstName + " " + apsUser.lastName)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, peopleCloudComponent.searchAssignee(activitiUser.lastName)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, peopleCloudComponent.checkUserIsDisplayed(activitiUser.firstName + " " + activitiUser.lastName)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, peopleCloudComponent.searchAssignee(noRoleUser.lastName)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, peopleCloudComponent.checkUserIsNotDisplayed(noRoleUser.firstName + " " + noRoleUser.lastName)];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('[C309674] Should be able to add filtering to Group Cloud Component', function () {
            beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.clickGroupCloudMultipleSelection()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, peopleGroupCloudComponentPage.clickGroupCloudFilterRole()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('No role filtering', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.clearField(peopleGroupCloudComponentPage.groupRoleInput)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupNoRole.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsDisplayed(groupNoRole.name)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupActiviti.name)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsDisplayed(groupActiviti.name)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupAps.name)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsDisplayed(groupAps.name)];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('One role filtering', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.enterGroupRoles("[\"" + identityService.ROLES.APS_ADMIN + "\"]")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupAps.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsDisplayed(groupAps.name)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupActiviti.name)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsNotDisplayed(groupActiviti.name)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupNoRole.name)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsNotDisplayed(groupNoRole.name)];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C309996] Should be able to filter groups based on composite roles Activit_Admin', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.enterGroupRoles("[\"" + identityService.ROLES.ACTIVITI_ADMIN + "\"]")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupActiviti.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsDisplayed(groupActiviti.name)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupNoRole.name)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsNotDisplayed(groupNoRole.name)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupAps.name)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsDisplayed(groupAps.name)];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C309996] Should be able to filter groups based on composite roles Aps_User', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.enterGroupRoles("[\"" + identityService.ROLES.APS_USER + "\"]")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupActiviti.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsNotDisplayed(groupActiviti.name)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupNoRole.name)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsNotDisplayed(groupNoRole.name)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupAps.name)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsDisplayed(groupAps.name)];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C309996] Should be able to filter groups based on composite roles Activiti_User', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.enterGroupRoles("[\"" + identityService.ROLES.ACTIVITI_USER + "\"]")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupActiviti.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsNotDisplayed(groupActiviti.name)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupNoRole.name)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsNotDisplayed(groupNoRole.name)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupAps.name)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsDisplayed(groupAps.name)];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Multiple roles filtering', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.enterGroupRoles("[\"" + identityService.ROLES.APS_ADMIN + "\", \"" + identityService.ROLES.ACTIVITI_ADMIN + "\"]")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupActiviti.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsDisplayed(groupActiviti.name)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupAps.name)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsDisplayed(groupAps.name)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.searchGroups(groupNoRole.name)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, groupCloudComponentPage.checkGroupIsNotDisplayed(groupNoRole.name)];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it('[C305033] Should fetch the preselect users based on the Validate flag set to True in Single mode selection', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.clickPeopleCloudSingleSelection()];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.checkPeopleCloudSingleSelectionIsSelected()];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.clickPreselectValidation()];
                    case 3:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, peopleGroupCloudComponentPage.getPreselectValidationStatus()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_g.sent()]).toBe('true')];
                    case 5:
                        _g.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.enterPeoplePreselect('[{"id":"12345","username":"someUsername","email":"someEmail"}]')];
                    case 6:
                        _g.sent();
                        _b = expect;
                        return [4 /*yield*/, peopleCloudComponent.getAssigneeFieldContent()];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_g.sent()]).toBe('')];
                    case 8:
                        _g.sent();
                        _c = expect;
                        return [4 /*yield*/, peopleGroupCloudComponentPage.getPreselectValidationStatus()];
                    case 9: return [4 /*yield*/, _c.apply(void 0, [_g.sent()]).toBe('true')];
                    case 10:
                        _g.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.enterPeoplePreselect("[{\"id\":\"" + noRoleUser.idIdentityService + "\"}]")];
                    case 11:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, peopleCloudComponent.getAssigneeFieldContent()];
                    case 12: return [4 /*yield*/, _d.apply(void 0, [_g.sent()]).toBe(noRoleUser.firstName + " " + noRoleUser.lastName)];
                    case 13:
                        _g.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.enterPeoplePreselect("[{\"email\":\"" + apsUser.email + "\"}]")];
                    case 14:
                        _g.sent();
                        _e = expect;
                        return [4 /*yield*/, peopleCloudComponent.getAssigneeFieldContent()];
                    case 15: return [4 /*yield*/, _e.apply(void 0, [_g.sent()]).toBe(apsUser.firstName + " " + apsUser.lastName)];
                    case 16:
                        _g.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.enterPeoplePreselect("[{\"username\":\"" + activitiUser.username + "\"}]")];
                    case 17:
                        _g.sent();
                        _f = expect;
                        return [4 /*yield*/, peopleCloudComponent.getAssigneeFieldContent()];
                    case 18: return [4 /*yield*/, _f.apply(void 0, [_g.sent()]).toBe(activitiUser.firstName + " " + activitiUser.lastName)];
                    case 19:
                        _g.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C309676] Should fetch the preselect users based on the Validate flag set to True in Multiple mode selection', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.checkPeopleCloudMultipleSelectionIsSelected()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.clickPreselectValidation()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, peopleGroupCloudComponentPage.getPreselectValidationStatus()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('true')];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.enterPeoplePreselect("[{\"id\":\"" + apsUser.idIdentityService + "\"},{\"id\":\"" + activitiUser.idIdentityService + "\"}," +
                                ("{\"id\":\"" + noRoleUser.idIdentityService + "\"}]"))];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkSelectedPeople(apsUser.firstName + " " + apsUser.lastName)];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkSelectedPeople(activitiUser.firstName + " " + activitiUser.lastName)];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkSelectedPeople(noRoleUser.firstName + " " + noRoleUser.lastName)];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.enterPeoplePreselect("[{\"email\":\"" + apsUser.email + "\"},{\"email\":\"" + activitiUser.email + "\"},{\"email\":\"" + noRoleUser.email + "\"}]")];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkSelectedPeople(apsUser.firstName + " " + apsUser.lastName)];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkSelectedPeople(activitiUser.firstName + " " + activitiUser.lastName)];
                    case 12:
                        _b.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkSelectedPeople(noRoleUser.firstName + " " + noRoleUser.lastName)];
                    case 13:
                        _b.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.enterPeoplePreselect("[{\"username\":\"" + apsUser.username + "\"},{\"username\":\"" + activitiUser.username + "\"}," +
                                ("{\"username\":\"" + noRoleUser.username + "\"}]"))];
                    case 14:
                        _b.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkSelectedPeople(apsUser.firstName + " " + apsUser.lastName)];
                    case 15:
                        _b.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkSelectedPeople(activitiUser.firstName + " " + activitiUser.lastName)];
                    case 16:
                        _b.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkSelectedPeople(noRoleUser.firstName + " " + noRoleUser.lastName)];
                    case 17:
                        _b.sent();
                        return [4 /*yield*/, peopleCloudComponent.searchAssigneeToExisting(noRoleUser.lastName)];
                    case 18:
                        _b.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkUserIsNotDisplayed(noRoleUser.firstName + " " + noRoleUser.lastName)];
                    case 19:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C309677] Should populate the Users without any validation when the Preselect flag is set to false', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.checkPeopleCloudMultipleSelectionIsSelected()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, peopleGroupCloudComponentPage.getPreselectValidationStatus()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('false')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.enterPeoplePreselect("[{\"id\":\"TestId1\",\"firstName\":\"TestFirstName1\",\"lastName\":\"TestLastName1\"}," +
                                "{\"id\":\"TestId2\",\"firstName\":\"TestFirstName2\",\"lastName\":\"TestLastName2\"}," +
                                "{\"id\":\"TestId3\",\"firstName\":\"TestFirstName3\",\"lastName\":\"TestLastName3\"}]")];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkSelectedPeople('TestFirstName1 TestLastName1')];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkSelectedPeople('TestFirstName2 TestLastName2')];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkSelectedPeople('TestFirstName3 TestLastName3')];
                    case 8:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C309678] Should not fetch the preselect users when mandatory parameters Id, Email and username are missing', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.checkPeopleCloudMultipleSelectionIsSelected()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.clickPreselectValidation()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, peopleGroupCloudComponentPage.getPreselectValidationStatus()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('true')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.enterPeoplePreselect("[{\"firstName\":\"" + apsUser.firstName + "\",\"lastName\":\"" + apsUser.lastName + ",\"" +
                                ("{\"firstName\":\"" + activitiUser.firstName + "\",\"lastName\":\"" + activitiUser.lastName + "\",{\"firstName\":\"" + noRoleUser.firstName + "\",\"lastName\":\"" + noRoleUser.lastName + "\"]"))];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(200)];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, peopleCloudComponent.getAssigneeFieldContent()];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe('')];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=people-group-cloud-component.e2e.js.map