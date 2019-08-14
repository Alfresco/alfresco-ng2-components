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
describe('Task filters cloud', function () {
    describe('Task Filters', function () {
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
        var newTask = adf_testing_1.StringUtil.generateRandomString(5), completedTask = adf_testing_1.StringUtil.generateRandomString(5);
        var simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiService.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                    case 1:
                        _a.sent();
                        identityService = new adf_testing_1.IdentityService(apiService);
                        groupIdentityService = new adf_testing_1.GroupIdentityService(apiService);
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
                        return [4 /*yield*/, settingsPage.setProviderBpmSso(protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.identityHost)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password)];
                    case 7:
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
        it('[C290011] Should display default filters when an app is deployed', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.completedTasksFilter().checkTaskFilterIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C290009] Should display default filters and created task', function () { return __awaiter(_this, void 0, void 0, function () {
            var task, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        tasksService = new adf_testing_1.TasksService(apiService);
                        return [4 /*yield*/, tasksService.createStandaloneTask(newTask, simpleApp)];
                    case 1:
                        task = _c.sent();
                        return [4 /*yield*/, tasksService.claimTask(task.entry.id, simpleApp)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.completedTasksFilter().clickTaskFilter()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('Completed Tasks')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(newTask)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe('My Tasks')];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(newTask)];
                    case 10:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C289955] Should display task in Complete Tasks List when task is completed', function () { return __awaiter(_this, void 0, void 0, function () {
            var toBeCompletedTask, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        tasksService = new adf_testing_1.TasksService(apiService);
                        return [4 /*yield*/, tasksService.createStandaloneTask(completedTask, simpleApp)];
                    case 1:
                        toBeCompletedTask = _c.sent();
                        return [4 /*yield*/, tasksService.claimTask(toBeCompletedTask.entry.id, simpleApp)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, tasksService.completeTask(toBeCompletedTask.entry.id, simpleApp)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('My Tasks')];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTask)];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.completedTasksFilter().clickTaskFilter()];
                    case 8:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 9: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe('Completed Tasks')];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTask)];
                    case 11:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291792] Should select the first task filter from the list as default', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.firstFilterIsActive()];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=task-filters-cloud.e2e.js.map