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
        var settingsPage = new adf_testing_1.SettingsPage();
        var apiService = new adf_testing_2.ApiService(protractor_1.browser.params.config.oauth2.clientId, protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.providers);
        var identityService;
        var groupIdentityService;
        var rolesService;
        var apsUser, testUser;
        var activitiUser;
        var noRoleUser;
        var groupAps;
        var groupActiviti;
        var groupNoRole;
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
                        return [4 /*yield*/, groupIdentityService.assignRole(groupAps.id, apsAdminRoleId, identityService.ROLES.APS_ADMIN)];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, rolesService.getRoleIdByRoleName(identityService.ROLES.ACTIVITI_ADMIN)];
                    case 15:
                        activitiAdminRoleId = _a.sent();
                        return [4 /*yield*/, groupIdentityService.assignRole(groupActiviti.id, activitiAdminRoleId, identityService.ROLES.ACTIVITI_ADMIN)];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, groupIdentityService.createIdentityGroup()];
                    case 17:
                        groupNoRole = _a.sent();
                        return [4 /*yield*/, groupIdentityService.addClientRole(groupAps.id, clientId, clientActivitiAdminRoleId, identityService.ROLES.ACTIVITI_ADMIN)];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, groupIdentityService.addClientRole(groupActiviti.id, clientId, clientActivitiAdminRoleId, identityService.ROLES.ACTIVITI_ADMIN)];
                    case 19:
                        _a.sent();
                        users = ["" + apsUser.idIdentityService, "" + activitiUser.idIdentityService, "" + noRoleUser.idIdentityService, "" + testUser.idIdentityService];
                        groups = ["" + groupAps.id, "" + groupActiviti.id, "" + groupNoRole.id];
                        return [4 /*yield*/, settingsPage.setProviderBpmSso(protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.identityHost)];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password)];
                    case 21:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var i, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiService.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                    case 1:
                        _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < users.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, identityService.deleteIdentityUser(users[i])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        i = 0;
                        _a.label = 6;
                    case 6:
                        if (!(i < groups.length)) return [3 /*break*/, 9];
                        return [4 /*yield*/, groupIdentityService.deleteIdentityGroup(groups[i])];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        i++;
                        return [3 /*break*/, 6];
                    case 9: return [4 /*yield*/, identityService.deleteIdentityUser(testUser.idIdentityService)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, identityService.deleteIdentityUser(apsUser.idIdentityService)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, identityService.deleteIdentityUser(activitiUser.idIdentityService)];
                    case 12:
                        _a.sent();
                        return [2 /*return*/];
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
        it('[C305041] Should filter the People Single Selection with the Application name filter', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.checkPeopleCloudSingleSelectionIsSelected()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.clickPeopleFilerByApp()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.enterPeopleAppName(resources.ACTIVITI7_APPS.SIMPLE_APP.name)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, peopleCloudComponent.searchAssignee("" + activitiUser.firstName)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkUserIsDisplayed("" + activitiUser.firstName + ' ' + ("" + activitiUser.lastName))];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, peopleCloudComponent.selectAssigneeFromList("" + activitiUser.firstName + ' ' + ("" + activitiUser.lastName))];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(100)];
                    case 7:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, peopleCloudComponent.getAssigneeFieldContent()];
                    case 8: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe("" + activitiUser.firstName + ' ' + ("" + activitiUser.lastName))];
                    case 9:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C305041] Should filter the People Multiple Selection with the Application name filter', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.clickPeopleCloudMultipleSelection()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.clickPeopleFilerByApp()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.enterPeopleAppName(resources.ACTIVITI7_APPS.SIMPLE_APP.name)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, peopleCloudComponent.searchAssignee("" + apsUser.firstName)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkUserIsDisplayed("" + apsUser.firstName + ' ' + ("" + apsUser.lastName))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, peopleCloudComponent.selectAssigneeFromList("" + apsUser.firstName + ' ' + ("" + apsUser.lastName))];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkSelectedPeople("" + apsUser.firstName + ' ' + ("" + apsUser.lastName))];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, peopleCloudComponent.searchAssigneeToExisting("" + activitiUser.firstName)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkUserIsDisplayed("" + activitiUser.firstName + ' ' + ("" + activitiUser.lastName))];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, peopleCloudComponent.selectAssigneeFromList("" + activitiUser.firstName + ' ' + ("" + activitiUser.lastName))];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkSelectedPeople("" + activitiUser.firstName + ' ' + ("" + activitiUser.lastName))];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, peopleCloudComponent.searchAssigneeToExisting("" + noRoleUser.firstName)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, peopleCloudComponent.checkUserIsNotDisplayed("" + noRoleUser.firstName + ' ' + ("" + noRoleUser.lastName))];
                    case 13:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C305041] Should filter the Groups Single Selection with the Application name filter', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.clickGroupCloudSingleSelection()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.clickGroupFilerByApp()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.enterGroupAppName(resources.ACTIVITI7_APPS.SIMPLE_APP.name)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, groupCloudComponentPage.searchGroups("" + groupActiviti.name)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, groupCloudComponentPage.checkGroupIsDisplayed("" + groupActiviti.name)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, groupCloudComponentPage.selectGroupFromList("" + groupActiviti.name)];
                    case 6:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, groupCloudComponentPage.getGroupsFieldContent()];
                    case 7: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe("" + groupActiviti.name)];
                    case 8:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C305041] Should filter the Groups Multiple Selection with the Application name filter', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, peopleGroupCloudComponentPage.clickGroupCloudMultipleSelection()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.clickGroupFilerByApp()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, peopleGroupCloudComponentPage.enterGroupAppName(resources.ACTIVITI7_APPS.SIMPLE_APP.name)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, groupCloudComponentPage.searchGroups("" + groupAps.name)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, groupCloudComponentPage.checkGroupIsDisplayed("" + groupAps.name)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, groupCloudComponentPage.selectGroupFromList("" + groupAps.name)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, groupCloudComponentPage.checkSelectedGroup("" + groupAps.name)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, groupCloudComponentPage.searchGroupsToExisting("" + groupActiviti.name)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, groupCloudComponentPage.checkGroupIsDisplayed("" + groupActiviti.name)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, groupCloudComponentPage.selectGroupFromList("" + groupActiviti.name)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, groupCloudComponentPage.checkSelectedGroup("" + groupActiviti.name)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, groupCloudComponentPage.searchGroupsToExisting("" + groupNoRole.name)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, groupCloudComponentPage.checkGroupIsNotDisplayed("" + groupNoRole.name)];
                    case 13:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=people-group-cloud-filter-component.e2e.js.map