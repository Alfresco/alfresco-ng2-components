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
var adf_testing_1 = require("@alfresco/adf-testing");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var tasksCloudDemoPage_1 = require("../pages/adf/demo-shell/process-services/tasksCloudDemoPage");
var resources = require("../util/resources");
describe('Edit task filters cloud', function () {
    describe('Edit Task Filters', function () {
        var loginSSOPage = new adf_testing_1.LoginSSOPage();
        var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
        var appListCloudComponent = new adf_testing_1.AppListCloudPage();
        var tasksCloudDemoPage = new tasksCloudDemoPage_1.TasksCloudDemoPage();
        var settingsPage = new adf_testing_1.SettingsPage();
        var tasksService;
        var identityService;
        var groupIdentityService;
        var testUser, groupInfo;
        var apiService = new adf_testing_1.ApiService(protractor_1.browser.params.config.oauth2.clientId, protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, 'BPM');
        var simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
        var completedTaskName = adf_testing_1.StringUtil.generateRandomString(), assignedTaskName = adf_testing_1.StringUtil.generateRandomString();
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var assignedTask;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiService.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                    case 1:
                        _a.sent();
                        identityService = new adf_testing_1.IdentityService(apiService);
                        groupIdentityService = new adf_testing_1.GroupIdentityService(apiService);
                        tasksService = new adf_testing_1.TasksService(apiService);
                        return [4 /*yield*/, identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.APS_USER])];
                    case 2:
                        testUser = _a.sent();
                        return [4 /*yield*/, groupIdentityService.getGroupInfoByGroupName('hr')];
                    case 3:
                        groupInfo = _a.sent();
                        return [4 /*yield*/, identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, apiService.login(testUser.email, testUser.password)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, tasksService.createStandaloneTask(assignedTaskName, simpleApp)];
                    case 6:
                        assignedTask = _a.sent();
                        return [4 /*yield*/, tasksService.claimTask(assignedTask.entry.id, simpleApp)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, tasksService.createAndCompleteTask(completedTaskName, simpleApp)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, settingsPage.setProviderBpmSso(protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.identityHost)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password)];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiService.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, identityService.deleteIdentityUser(testUser.idIdentityService)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesCloudPage()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, appListCloudComponent.checkApsContainer()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, appListCloudComponent.goToApp(simpleApp)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291785] All the filters property should be set up accordingly with the Query Param', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 1:
                        _j.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 2:
                        _j.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_j.sent()]).toBe('My Tasks')];
                    case 4:
                        _j.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getStatusFilterDropDownValue()];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [_j.sent()]).toEqual('ASSIGNED')];
                    case 6:
                        _j.sent();
                        _c = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()];
                    case 7: return [4 /*yield*/, _c.apply(void 0, [_j.sent()]).toEqual('CreatedDate')];
                    case 8:
                        _j.sent();
                        _d = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getOrderFilterDropDownValue()];
                    case 9: return [4 /*yield*/, _d.apply(void 0, [_j.sent()]).toEqual('DESC')];
                    case 10:
                        _j.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assignedTaskName)];
                    case 11:
                        _j.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTaskName)];
                    case 12:
                        _j.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.completedTasksFilter().clickTaskFilter()];
                    case 13:
                        _j.sent();
                        _e = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 14: return [4 /*yield*/, _e.apply(void 0, [_j.sent()]).toBe('Completed Tasks')];
                    case 15:
                        _j.sent();
                        _f = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getStatusFilterDropDownValue()];
                    case 16: return [4 /*yield*/, _f.apply(void 0, [_j.sent()]).toEqual('COMPLETED')];
                    case 17:
                        _j.sent();
                        _g = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()];
                    case 18: return [4 /*yield*/, _g.apply(void 0, [_j.sent()]).toEqual('CreatedDate')];
                    case 19:
                        _j.sent();
                        _h = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getOrderFilterDropDownValue()];
                    case 20: return [4 /*yield*/, _h.apply(void 0, [_j.sent()]).toEqual('DESC')];
                    case 21:
                        _j.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(assignedTaskName)];
                    case 22:
                        _j.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName)];
                    case 23:
                        _j.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 24:
                        _j.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C306896] Delete Save and Save as actions should be displayed when clicking on custom filter header', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, editTaskFilterCloudComponent, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 3:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toBe('My Tasks')];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent()];
                    case 6:
                        editTaskFilterCloudComponent = _e.sent();
                        return [4 /*yield*/, editTaskFilterCloudComponent.checkSaveButtonIsDisplayed()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, editTaskFilterCloudComponent.checkSaveAsButtonIsDisplayed()];
                    case 8:
                        _e.sent();
                        return [4 /*yield*/, editTaskFilterCloudComponent.checkDeleteButtonIsDisplayed()];
                    case 9:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().checkSaveButtonIsEnabled()];
                    case 10: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toEqual(false)];
                    case 11:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().checkSaveAsButtonIsEnabled()];
                    case 12: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toEqual(false)];
                    case 13:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().checkDeleteButtonIsEnabled()];
                    case 14: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toEqual(true)];
                    case 15:
                        _e.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 16:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291795] New filter is added when clicking Save As button', function () { return __awaiter(_this, void 0, void 0, function () {
            var editTaskFilterCloudComponent, editTaskFilterDialog, _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 1:
                        _h.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent()];
                    case 2:
                        editTaskFilterCloudComponent = _h.sent();
                        return [4 /*yield*/, editTaskFilterCloudComponent.clickCustomiseFilterHeader()];
                    case 3:
                        _h.sent();
                        return [4 /*yield*/, editTaskFilterCloudComponent.setSortFilterDropDown('Id')];
                    case 4:
                        _h.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 5:
                        _h.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton()];
                    case 6:
                        _h.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog()];
                    case 7:
                        editTaskFilterDialog = _h.sent();
                        return [4 /*yield*/, editTaskFilterDialog.setFilterName('New')];
                    case 8:
                        _h.sent();
                        return [4 /*yield*/, editTaskFilterDialog.clickOnSaveButton()];
                    case 9:
                        _h.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 10: return [4 /*yield*/, _a.apply(void 0, [_h.sent()]).toBe('New')];
                    case 11:
                        _h.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 12:
                        _h.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().checkSaveButtonIsEnabled()];
                    case 13: return [4 /*yield*/, _b.apply(void 0, [_h.sent()]).toEqual(false)];
                    case 14:
                        _h.sent();
                        _c = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()];
                    case 15: return [4 /*yield*/, _c.apply(void 0, [_h.sent()]).toEqual('Id')];
                    case 16:
                        _h.sent();
                        _d = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().checkSaveAsButtonIsEnabled()];
                    case 17: return [4 /*yield*/, _d.apply(void 0, [_h.sent()]).toEqual(false)];
                    case 18:
                        _h.sent();
                        _e = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().checkDeleteButtonIsEnabled()];
                    case 19: return [4 /*yield*/, _e.apply(void 0, [_h.sent()]).toEqual(true)];
                    case 20:
                        _h.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 21:
                        _h.sent();
                        _f = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()];
                    case 22: return [4 /*yield*/, _f.apply(void 0, [_h.sent()]).toEqual('CreatedDate')];
                    case 23:
                        _h.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.customTaskFilter('custom-new').clickTaskFilter()];
                    case 24:
                        _h.sent();
                        _g = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()];
                    case 25: return [4 /*yield*/, _g.apply(void 0, [_h.sent()]).toEqual('Id')];
                    case 26:
                        _h.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton()];
                    case 27:
                        _h.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291796] Two filters with same name can be created when clicking the Save As button', function () { return __awaiter(_this, void 0, void 0, function () {
            var editTaskFilterCloudComponent, editTaskFilterDialog, _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent()];
                    case 2:
                        editTaskFilterCloudComponent = _f.sent();
                        return [4 /*yield*/, editTaskFilterCloudComponent.clickCustomiseFilterHeader()];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, editTaskFilterCloudComponent.setSortFilterDropDown('Id')];
                    case 4:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton()];
                    case 6:
                        _f.sent();
                        editTaskFilterDialog = editTaskFilterCloudComponent.editTaskFilterDialog();
                        return [4 /*yield*/, editTaskFilterDialog.setFilterName('New')];
                    case 7:
                        _f.sent();
                        return [4 /*yield*/, editTaskFilterDialog.clickOnSaveButton()];
                    case 8:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 9: return [4 /*yield*/, _a.apply(void 0, [_f.sent()]).toBe('New')];
                    case 10:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 11:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()];
                    case 12: return [4 /*yield*/, _b.apply(void 0, [_f.sent()]).toEqual('Id')];
                    case 13:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('Priority')];
                    case 14:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton()];
                    case 15:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('New')];
                    case 16:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().clickOnSaveButton()];
                    case 17:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 18: return [4 /*yield*/, _c.apply(void 0, [_f.sent()]).toBe('New')];
                    case 19:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 20:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()];
                    case 21: return [4 /*yield*/, _d.apply(void 0, [_f.sent()]).toEqual('Priority')];
                    case 22:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton()];
                    case 23:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.customTaskFilter('custom-new').clickTaskFilter()];
                    case 24:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 25:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()];
                    case 26: return [4 /*yield*/, _e.apply(void 0, [_f.sent()]).toEqual('Id')];
                    case 27:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton()];
                    case 28:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291797] A filter is overrided when clicking on save button', function () { return __awaiter(_this, void 0, void 0, function () {
            var editTaskFilterCloudComponent, editTaskFilterDialog, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent()];
                    case 2:
                        editTaskFilterCloudComponent = _e.sent();
                        return [4 /*yield*/, editTaskFilterCloudComponent.clickCustomiseFilterHeader()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, editTaskFilterCloudComponent.setSortFilterDropDown('Id')];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog()];
                    case 7:
                        editTaskFilterDialog = _e.sent();
                        return [4 /*yield*/, editTaskFilterDialog.setFilterName('New')];
                    case 8:
                        _e.sent();
                        return [4 /*yield*/, editTaskFilterDialog.clickOnSaveButton()];
                    case 9:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 10: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toBe('New')];
                    case 11:
                        _e.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 12:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()];
                    case 13: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toEqual('Id')];
                    case 14:
                        _e.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('Name')];
                    case 15:
                        _e.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveButton()];
                    case 16:
                        _e.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 17:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 18: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toBe('New')];
                    case 19:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()];
                    case 20: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toEqual('Name')];
                    case 21:
                        _e.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton()];
                    case 22:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291798] A filter is deleted when clicking on delete button', function () { return __awaiter(_this, void 0, void 0, function () {
            var editTaskFilterCloudComponent, editTaskFilterDialog, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent()];
                    case 2:
                        editTaskFilterCloudComponent = _d.sent();
                        return [4 /*yield*/, editTaskFilterCloudComponent.clickCustomiseFilterHeader()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, editTaskFilterCloudComponent.setSortFilterDropDown('Id')];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton()];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog()];
                    case 7:
                        editTaskFilterDialog = _d.sent();
                        return [4 /*yield*/, editTaskFilterDialog.setFilterName('New')];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, editTaskFilterDialog.clickOnSaveButton()];
                    case 9:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 10: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe('New')];
                    case 11:
                        _d.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 12:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()];
                    case 13: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual('Id')];
                    case 14:
                        _d.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickDeleteButton()];
                    case 15:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 16: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe('My Tasks')];
                    case 17:
                        _d.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.customTaskFilter('New').checkTaskFilterNotDisplayed()];
                    case 18:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291800] Task filter should not be created when task filter dialog is closed', function () { return __awaiter(_this, void 0, void 0, function () {
            var editTaskFilterCloudComponent, _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent()];
                    case 2:
                        editTaskFilterCloudComponent = _g.sent();
                        return [4 /*yield*/, editTaskFilterCloudComponent.clickCustomiseFilterHeader()];
                    case 3:
                        _g.sent();
                        return [4 /*yield*/, editTaskFilterCloudComponent.setSortFilterDropDown('Priority')];
                    case 4:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_g.sent()]).toEqual('Priority')];
                    case 6:
                        _g.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton()];
                    case 7:
                        _g.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getFilterName()];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_g.sent()]).toEqual('My Tasks')];
                    case 9:
                        _g.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().setFilterName('Cancel')];
                    case 10:
                        _g.sent();
                        _c = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getFilterName()];
                    case 11: return [4 /*yield*/, _c.apply(void 0, [_g.sent()]).toEqual('Cancel')];
                    case 12:
                        _g.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().clickOnCancelButton()];
                    case 13:
                        _g.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.customTaskFilter('Cancel').checkTaskFilterNotDisplayed()];
                    case 14:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 15: return [4 /*yield*/, _d.apply(void 0, [_g.sent()]).toEqual('My Tasks')];
                    case 16:
                        _g.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.completedTasksFilter().clickTaskFilter()];
                    case 17:
                        _g.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 18:
                        _g.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 19:
                        _g.sent();
                        _e = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 20: return [4 /*yield*/, _e.apply(void 0, [_g.sent()]).toBe('My Tasks')];
                    case 21:
                        _g.sent();
                        _f = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()];
                    case 22: return [4 /*yield*/, _f.apply(void 0, [_g.sent()]).toEqual('CreatedDate')];
                    case 23:
                        _g.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 24:
                        _g.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291801] Save button of task filter dialog should be disabled when task name is empty', function () { return __awaiter(_this, void 0, void 0, function () {
            var editTaskFilterCloudComponent, _a, _b, tasksCloud, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent()];
                    case 2:
                        editTaskFilterCloudComponent = _f.sent();
                        return [4 /*yield*/, editTaskFilterCloudComponent.clickCustomiseFilterHeader()];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, editTaskFilterCloudComponent.setSortFilterDropDown('Id')];
                    case 4:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_f.sent()]).toEqual('Id')];
                    case 6:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton()];
                    case 7:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getFilterName()];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_f.sent()]).toEqual('My Tasks')];
                    case 9:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent()];
                    case 10:
                        tasksCloud = _f.sent();
                        return [4 /*yield*/, tasksCloud.editTaskFilterDialog().clearFilterName()];
                    case 11:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getFilterName()];
                    case 12: return [4 /*yield*/, _c.apply(void 0, [_f.sent()]).toEqual('')];
                    case 13:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().checkSaveButtonIsEnabled()];
                    case 14: return [4 /*yield*/, _d.apply(void 0, [_f.sent()]).toEqual(false)];
                    case 15:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().checkCancelButtonIsEnabled()];
                    case 16: return [4 /*yield*/, _e.apply(void 0, [_f.sent()]).toEqual(true)];
                    case 17:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().clickOnCancelButton()];
                    case 18:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291799] Task filter dialog is displayed when clicking on Save As button', function () { return __awaiter(_this, void 0, void 0, function () {
            var tasksCloud, _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent()];
                    case 2:
                        tasksCloud = _f.sent();
                        return [4 /*yield*/, tasksCloud.clickCustomiseFilterHeader()];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, tasksCloud.setSortFilterDropDown('Id')];
                    case 4:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getSortFilterDropDownValue()];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_f.sent()]).toEqual('Id')];
                    case 6:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickSaveAsButton()];
                    case 7:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().checkSaveButtonIsEnabled()];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_f.sent()]).toEqual(true)];
                    case 9:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().checkCancelButtonIsEnabled()];
                    case 10: return [4 /*yield*/, _c.apply(void 0, [_f.sent()]).toEqual(true)];
                    case 11:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getTitle()];
                    case 12: return [4 /*yield*/, _d.apply(void 0, [_f.sent()]).toEqual('Save filter as')];
                    case 13:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().getFilterName()];
                    case 14: return [4 /*yield*/, _e.apply(void 0, [_f.sent()]).toEqual('My Tasks')];
                    case 15:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().editTaskFilterDialog().clickOnCancelButton()];
                    case 16:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=edit-task-filters-component.e2e.js.map