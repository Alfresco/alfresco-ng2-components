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
var protractor_1 = require("protractor");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var tasksCloudDemoPage_1 = require("../../pages/adf/demo-shell/process-services/tasksCloudDemoPage");
var adf_testing_1 = require("@alfresco/adf-testing");
var resources = require("../../util/resources");
describe('Start Task - Group Cloud Component', function () {
    var loginSSOPage = new adf_testing_1.LoginSSOPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var appListCloudComponent = new adf_testing_1.AppListCloudPage();
    var tasksCloudDemoPage = new tasksCloudDemoPage_1.TasksCloudDemoPage();
    var startTask = new adf_testing_1.StartTasksCloudPage();
    var peopleCloudComponent = new adf_testing_1.PeopleCloudComponentPage();
    var settingsPage = new adf_testing_1.SettingsPage();
    var apiService = new adf_testing_1.ApiService(protractor_1.browser.params.config.oauth2.clientId, protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.providers);
    var groupCloud = new adf_testing_1.GroupCloudComponentPage();
    var bothGroupsTaskName = adf_testing_1.StringUtil.generateRandomString(5);
    var oneGroupTaskName = adf_testing_1.StringUtil.generateRandomString(5);
    var apsUser, testUser, hrGroup, testGroup;
    var simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
    var identityService;
    var groupIdentityService;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var rolesService, apsAdminRoleId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apiService.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                case 1:
                    _a.sent();
                    identityService = new adf_testing_1.IdentityService(apiService);
                    groupIdentityService = new adf_testing_1.GroupIdentityService(apiService);
                    return [4 /*yield*/, identityService.createIdentityUser()];
                case 2:
                    testUser = _a.sent();
                    return [4 /*yield*/, identityService.createIdentityUser()];
                case 3:
                    apsUser = _a.sent();
                    return [4 /*yield*/, groupIdentityService.getGroupInfoByGroupName('hr')];
                case 4:
                    hrGroup = _a.sent();
                    return [4 /*yield*/, groupIdentityService.getGroupInfoByGroupName('testgroup')];
                case 5:
                    testGroup = _a.sent();
                    rolesService = new adf_testing_1.RolesService(apiService);
                    return [4 /*yield*/, rolesService.getRoleIdByRoleName(identityService.ROLES.APS_USER)];
                case 6:
                    apsAdminRoleId = _a.sent();
                    return [4 /*yield*/, groupIdentityService.assignRole(testGroup.id, apsAdminRoleId, identityService.ROLES.APS_USER)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, identityService.addUserToGroup(testUser.idIdentityService, testGroup.id)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, identityService.addUserToGroup(apsUser.idIdentityService, hrGroup.id)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, settingsPage.setProviderBpmSso(protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.identityHost)];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var tasksService, bothGroupsTaskId, oneGroupTaskId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apiService.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                case 1:
                    _a.sent();
                    tasksService = new adf_testing_1.TasksService(apiService);
                    return [4 /*yield*/, tasksService.getTaskId(bothGroupsTaskName, simpleApp)];
                case 2:
                    bothGroupsTaskId = _a.sent();
                    return [4 /*yield*/, tasksService.deleteTask(bothGroupsTaskId, simpleApp)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, tasksService.getTaskId(oneGroupTaskName, simpleApp)];
                case 4:
                    oneGroupTaskId = _a.sent();
                    return [4 /*yield*/, tasksService.deleteTask(oneGroupTaskId, simpleApp)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, identityService.deleteIdentityUser(apsUser.idIdentityService)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, identityService.deleteIdentityUser(testUser.idIdentityService)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesCloudPage()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, appListCloudComponent.checkApsContainer()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, appListCloudComponent.checkAppIsDisplayed(simpleApp)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, appListCloudComponent.goToApp(simpleApp)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.openNewTaskForm()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, startTask.checkFormIsDisplayed()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291954] Should be able to select/delete an group for a standalone task', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, peopleCloudComponent.clearAssignee()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.searchGroups(testGroup.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.checkGroupIsDisplayed(testGroup.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.selectGroupFromList(testGroup.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.checkSelectedGroup(testGroup.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.searchGroups(hrGroup.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.checkGroupIsDisplayed(hrGroup.name)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.selectGroupFromList(hrGroup.name)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.checkSelectedGroup(hrGroup.name)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.removeSelectedGroup(testGroup.name)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.checkGroupNotSelected(testGroup.name)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, startTask.addName(oneGroupTaskName)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, startTask.clickStartButton()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(apsUser.email, apsUser.password)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesCloudPage()];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, appListCloudComponent.checkApsContainer()];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, appListCloudComponent.checkAppIsDisplayed(simpleApp)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, appListCloudComponent.goToApp(simpleApp)];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody()];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee()];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('CREATED')];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody()];
                case 24:
                    _a.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(oneGroupTaskName)];
                case 25:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291955] Should be able to select multiple groups when the selection mode=multiple', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, peopleCloudComponent.clearAssignee()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.searchGroups(testGroup.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.checkGroupIsDisplayed(testGroup.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.selectGroupFromList(testGroup.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.checkSelectedGroup(testGroup.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.searchGroups(hrGroup.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.checkGroupIsDisplayed(hrGroup.name)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.selectGroupFromList(hrGroup.name)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.checkSelectedGroup(hrGroup.name)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, startTask.addName(bothGroupsTaskName)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, startTask.clickStartButton()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(apsUser.email, apsUser.password)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesCloudPage()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, appListCloudComponent.checkApsContainer()];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, appListCloudComponent.checkAppIsDisplayed(simpleApp)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, appListCloudComponent.goToApp(simpleApp)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody()];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee()];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('CREATED')];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody()];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(bothGroupsTaskName)];
                case 23:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291993] Should NOT be able to find a group already selected', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, groupCloud.searchGroups(testGroup.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.checkGroupIsDisplayed(testGroup.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.selectGroupFromList(testGroup.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.checkSelectedGroup(testGroup.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.searchGroups(testGroup.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.checkGroupIsNotDisplayed(testGroup.name)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291995] Should be able to add a group previously removed', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, groupCloud.searchGroups(testGroup.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.checkGroupIsDisplayed(testGroup.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.selectGroupFromList(testGroup.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.checkSelectedGroup(testGroup.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.removeSelectedGroup(testGroup.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.checkGroupNotSelected(testGroup.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.searchGroups(testGroup.name)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.checkGroupIsDisplayed(testGroup.name)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.selectGroupFromList(testGroup.name)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, groupCloud.checkSelectedGroup(testGroup.name)];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=start-task-group-cloud.e2e.js.map