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
var resources = require("../util/resources");
var adf_testing_1 = require("@alfresco/adf-testing");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var processServicesPage_1 = require("../pages/adf/process-services/processServicesPage");
var tasksPage_1 = require("../pages/adf/process-services/tasksPage");
var tasksListPage_1 = require("../pages/adf/process-services/tasksListPage");
var taskDetailsPage_1 = require("../pages/adf/process-services/taskDetailsPage");
var processServiceTabBarPage_1 = require("../pages/adf/process-services/processServiceTabBarPage");
var appSettingsToggles_1 = require("../pages/adf/process-services/dialog/appSettingsToggles");
var taskFiltersDemoPage_1 = require("../pages/adf/demo-shell/process-services/taskFiltersDemoPage");
var js_api_1 = require("@alfresco/js-api");
var apps_actions_1 = require("../actions/APS/apps.actions");
var users_actions_1 = require("../actions/users.actions");
var protractor_1 = require("protractor");
describe('Task', function () {
    describe('Filters', function () {
        var loginPage = new adf_testing_1.LoginPage();
        var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
        var processServicesPage = new processServicesPage_1.ProcessServicesPage();
        var tasksPage = new tasksPage_1.TasksPage();
        var tasksListPage = new tasksListPage_1.TasksListPage();
        var taskDetailsPage = new taskDetailsPage_1.TaskDetailsPage();
        var taskFiltersDemoPage = new taskFiltersDemoPage_1.TaskFiltersDemoPage();
        var app = resources.Files.APP_WITH_DATE_FIELD_FORM;
        var appId, tenantId;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                    provider: 'BPM',
                    hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                });
                return [2 /*return*/];
            });
        }); });
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            var apps, users, user, appModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apps = new apps_actions_1.AppsActions();
                        users = new users_actions_1.UsersActions();
                        return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, users.createTenantAndUser(this.alfrescoJsApi)];
                    case 2:
                        user = _a.sent();
                        tenantId = user.tenantId;
                        return [4 /*yield*/, this.alfrescoJsApi.login(user.email, user.password)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location)];
                    case 4:
                        appModel = _a.sent();
                        appId = appModel.id;
                        return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(user)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, processServicesPage.checkApsContainer()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279967] Should display default filters when an app is deployed', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, taskFiltersDemoPage.involvedTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.queuedTasksFilter().checkTaskFilterIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.completedTasksFilter().checkTaskFilterIsDisplayed()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260330] Should display Task Filter List when app is in Task Tab', function () { return __awaiter(_this, void 0, void 0, function () {
            var task, _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, tasksPage.createNewTask()];
                    case 1:
                        task = _j.sent();
                        return [4 /*yield*/, task.addName('Test')];
                    case 2:
                        _j.sent();
                        return [4 /*yield*/, task.clickStartButton()];
                    case 3:
                        _j.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.myTasksFilter().clickTaskFilter()];
                    case 4:
                        _j.sent();
                        return [4 /*yield*/, tasksListPage.checkContentIsDisplayed('Test')];
                    case 5:
                        _j.sent();
                        _a = expect;
                        return [4 /*yield*/, taskFiltersDemoPage.checkActiveFilterActive()];
                    case 6: return [4 /*yield*/, _a.apply(void 0, [_j.sent()]).toBe('My Tasks')];
                    case 7:
                        _j.sent();
                        _b = expect;
                        return [4 /*yield*/, taskDetailsPage.checkTaskDetailsDisplayed()];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_j.sent()]).toBeDefined()];
                    case 9:
                        _j.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.queuedTasksFilter().clickTaskFilter()];
                    case 10:
                        _j.sent();
                        _c = expect;
                        return [4 /*yield*/, taskFiltersDemoPage.checkActiveFilterActive()];
                    case 11: return [4 /*yield*/, _c.apply(void 0, [_j.sent()]).toBe('Queued Tasks')];
                    case 12:
                        _j.sent();
                        return [4 /*yield*/, tasksListPage.checkContentIsNotDisplayed('Test')];
                    case 13:
                        _j.sent();
                        _d = expect;
                        return [4 /*yield*/, taskDetailsPage.checkTaskDetailsEmpty()];
                    case 14: return [4 /*yield*/, _d.apply(void 0, [_j.sent()]).toBeDefined()];
                    case 15:
                        _j.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.involvedTasksFilter().clickTaskFilter()];
                    case 16:
                        _j.sent();
                        _e = expect;
                        return [4 /*yield*/, taskFiltersDemoPage.checkActiveFilterActive()];
                    case 17: return [4 /*yield*/, _e.apply(void 0, [_j.sent()]).toBe('Involved Tasks')];
                    case 18:
                        _j.sent();
                        return [4 /*yield*/, tasksListPage.checkContentIsDisplayed('Test')];
                    case 19:
                        _j.sent();
                        _f = expect;
                        return [4 /*yield*/, taskDetailsPage.checkTaskDetailsDisplayed()];
                    case 20: return [4 /*yield*/, _f.apply(void 0, [_j.sent()]).toBeDefined()];
                    case 21:
                        _j.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.completedTasksFilter().clickTaskFilter()];
                    case 22:
                        _j.sent();
                        _g = expect;
                        return [4 /*yield*/, taskFiltersDemoPage.checkActiveFilterActive()];
                    case 23: return [4 /*yield*/, _g.apply(void 0, [_j.sent()]).toBe('Completed Tasks')];
                    case 24:
                        _j.sent();
                        return [4 /*yield*/, tasksListPage.checkContentIsNotDisplayed('Test')];
                    case 25:
                        _j.sent();
                        _h = expect;
                        return [4 /*yield*/, taskDetailsPage.checkTaskDetailsEmpty()];
                    case 26: return [4 /*yield*/, _h.apply(void 0, [_j.sent()]).toBeDefined()];
                    case 27:
                        _j.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260348] Should display task in Complete Tasks List when task is completed', function () { return __awaiter(_this, void 0, void 0, function () {
            var task, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0: return [4 /*yield*/, taskFiltersDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _l.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.queuedTasksFilter().checkTaskFilterIsDisplayed()];
                    case 2:
                        _l.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.involvedTasksFilter().checkTaskFilterIsDisplayed()];
                    case 3:
                        _l.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.completedTasksFilter().checkTaskFilterIsDisplayed()];
                    case 4:
                        _l.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 5:
                        _l.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.queuedTasksFilter().checkTaskFilterIsDisplayed()];
                    case 6:
                        _l.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.involvedTasksFilter().checkTaskFilterIsDisplayed()];
                    case 7:
                        _l.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.completedTasksFilter().checkTaskFilterIsDisplayed()];
                    case 8:
                        _l.sent();
                        return [4 /*yield*/, tasksPage.createNewTask()];
                    case 9:
                        task = _l.sent();
                        return [4 /*yield*/, task.addName('Test')];
                    case 10:
                        _l.sent();
                        return [4 /*yield*/, task.clickStartButton()];
                    case 11:
                        _l.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.myTasksFilter().clickTaskFilter()];
                    case 12:
                        _l.sent();
                        return [4 /*yield*/, tasksListPage.checkContentIsDisplayed('Test')];
                    case 13:
                        _l.sent();
                        _a = expect;
                        return [4 /*yield*/, taskFiltersDemoPage.checkActiveFilterActive()];
                    case 14: return [4 /*yield*/, _a.apply(void 0, [_l.sent()]).toBe('My Tasks')];
                    case 15:
                        _l.sent();
                        _b = expect;
                        return [4 /*yield*/, taskDetailsPage.checkTaskDetailsDisplayed()];
                    case 16: return [4 /*yield*/, _b.apply(void 0, [_l.sent()]).toBeDefined()];
                    case 17:
                        _l.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.queuedTasksFilter().clickTaskFilter()];
                    case 18:
                        _l.sent();
                        _c = expect;
                        return [4 /*yield*/, taskFiltersDemoPage.checkActiveFilterActive()];
                    case 19: return [4 /*yield*/, _c.apply(void 0, [_l.sent()]).toBe('Queued Tasks')];
                    case 20:
                        _l.sent();
                        _d = expect;
                        return [4 /*yield*/, tasksListPage.getNoTasksFoundMessage()];
                    case 21: return [4 /*yield*/, _d.apply(void 0, [_l.sent()]).toBe('No Tasks Found')];
                    case 22:
                        _l.sent();
                        _e = expect;
                        return [4 /*yield*/, taskDetailsPage.getEmptyTaskDetailsMessage()];
                    case 23: return [4 /*yield*/, _e.apply(void 0, [_l.sent()]).toBe('No task details found')];
                    case 24:
                        _l.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.involvedTasksFilter().clickTaskFilter()];
                    case 25:
                        _l.sent();
                        _f = expect;
                        return [4 /*yield*/, taskFiltersDemoPage.checkActiveFilterActive()];
                    case 26: return [4 /*yield*/, _f.apply(void 0, [_l.sent()]).toBe('Involved Tasks')];
                    case 27:
                        _l.sent();
                        return [4 /*yield*/, tasksListPage.checkContentIsDisplayed('Test')];
                    case 28:
                        _l.sent();
                        _g = expect;
                        return [4 /*yield*/, taskDetailsPage.checkTaskDetailsDisplayed()];
                    case 29: return [4 /*yield*/, _g.apply(void 0, [_l.sent()]).toBeDefined()];
                    case 30:
                        _l.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.completedTasksFilter().clickTaskFilter()];
                    case 31:
                        _l.sent();
                        _h = expect;
                        return [4 /*yield*/, taskFiltersDemoPage.checkActiveFilterActive()];
                    case 32: return [4 /*yield*/, _h.apply(void 0, [_l.sent()]).toBe('Completed Tasks')];
                    case 33:
                        _l.sent();
                        _j = expect;
                        return [4 /*yield*/, tasksListPage.getNoTasksFoundMessage()];
                    case 34: return [4 /*yield*/, _j.apply(void 0, [_l.sent()]).toBe('No Tasks Found')];
                    case 35:
                        _l.sent();
                        _k = expect;
                        return [4 /*yield*/, taskDetailsPage.getEmptyTaskDetailsMessage()];
                    case 36: return [4 /*yield*/, _k.apply(void 0, [_l.sent()]).toBe('No task details found')];
                    case 37:
                        _l.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260349] Should sort task by name when Name sorting is clicked', function () { return __awaiter(_this, void 0, void 0, function () {
            var task, task2, task3, task4, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, tasksPage.createNewTask()];
                    case 1:
                        task = _e.sent();
                        return [4 /*yield*/, task.addName('Test1')];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, task.clickStartButton()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, taskDetailsPage.clickCompleteTask()];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, tasksPage.createNewTask()];
                    case 5:
                        task2 = _e.sent();
                        return [4 /*yield*/, task2.addName('Test2')];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, task2.clickStartButton()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, taskDetailsPage.clickCompleteTask()];
                    case 8:
                        _e.sent();
                        return [4 /*yield*/, tasksPage.createNewTask()];
                    case 9:
                        task3 = _e.sent();
                        return [4 /*yield*/, task3.addName('Test3')];
                    case 10:
                        _e.sent();
                        return [4 /*yield*/, task3.clickStartButton()];
                    case 11:
                        _e.sent();
                        return [4 /*yield*/, tasksPage.createNewTask()];
                    case 12:
                        task4 = _e.sent();
                        return [4 /*yield*/, task4.addName('Test4')];
                    case 13:
                        _e.sent();
                        return [4 /*yield*/, task4.clickStartButton()];
                    case 14:
                        _e.sent();
                        return [4 /*yield*/, tasksListPage.checkContentIsDisplayed('Test4')];
                    case 15:
                        _e.sent();
                        return [4 /*yield*/, tasksListPage.checkRowIsSelected('Test4')];
                    case 16:
                        _e.sent();
                        return [4 /*yield*/, tasksListPage.checkContentIsDisplayed('Test3')];
                    case 17:
                        _e.sent();
                        return [4 /*yield*/, taskDetailsPage.checkTaskDetailsDisplayed()];
                    case 18:
                        _e.sent();
                        return [4 /*yield*/, tasksPage.clickSortByNameAsc()];
                    case 19:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(1)];
                    case 20: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toBe('Test3')];
                    case 21:
                        _e.sent();
                        return [4 /*yield*/, tasksPage.clickSortByNameDesc()];
                    case 22:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(1)];
                    case 23: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toBe('Test4')];
                    case 24:
                        _e.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.completedTasksFilter().clickTaskFilter()];
                    case 25:
                        _e.sent();
                        return [4 /*yield*/, tasksListPage.checkContentIsDisplayed('Test1')];
                    case 26:
                        _e.sent();
                        return [4 /*yield*/, tasksListPage.checkContentIsDisplayed('Test2')];
                    case 27:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(1)];
                    case 28: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toBe('Test2')];
                    case 29:
                        _e.sent();
                        return [4 /*yield*/, tasksPage.clickSortByNameAsc()];
                    case 30:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(1)];
                    case 31: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toBe('Test1')];
                    case 32:
                        _e.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.involvedTasksFilter().clickTaskFilter()];
                    case 33:
                        _e.sent();
                        return [4 /*yield*/, tasksListPage.checkContentIsDisplayed('Test3')];
                    case 34:
                        _e.sent();
                        return [4 /*yield*/, tasksListPage.checkContentIsDisplayed('Test4')];
                    case 35:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277264] Should display task filter results when task filter is selected', function () { return __awaiter(_this, void 0, void 0, function () {
            var task, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tasksPage.createNewTask()];
                    case 1:
                        task = _b.sent();
                        return [4 /*yield*/, task.addName('Test')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, task.clickStartButton()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.myTasksFilter().clickTaskFilter()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, tasksListPage.checkContentIsDisplayed('Test')];
                    case 5:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, taskDetailsPage.getTaskDetailsTitle()];
                    case 6: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('Test')];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Custom Filters', function () {
        var loginPage = new adf_testing_1.LoginPage();
        var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
        var processServicesPage = new processServicesPage_1.ProcessServicesPage();
        var processServiceTabBarPage = new processServiceTabBarPage_1.ProcessServiceTabBarPage();
        var appSettingsToggles = new appSettingsToggles_1.AppSettingsToggles();
        var taskFiltersDemoPage = new taskFiltersDemoPage_1.TaskFiltersDemoPage();
        var user;
        var appId;
        var importedApp;
        var taskFilterId;
        var app = resources.Files.APP_WITH_PROCESSES;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var apps, users, appDefinitions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apps = new apps_actions_1.AppsActions();
                        users = new users_actions_1.UsersActions();
                        this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                            provider: 'BPM',
                            hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                        });
                        return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, users.createTenantAndUser(this.alfrescoJsApi)];
                    case 2:
                        user = _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.login(user.email, user.password)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location)];
                    case 4:
                        importedApp = _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.activiti.appsApi.getAppDefinitions()];
                    case 5:
                        appDefinitions = _a.sent();
                        appId = appDefinitions.data.find(function (currentApp) {
                            return currentApp.modelId === importedApp.id;
                        }).id;
                        return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(user)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, processServicesPage.checkApsContainer()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260350] Should display a new filter when a filter is added', function () { return __awaiter(_this, void 0, void 0, function () {
            var newFilter, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newFilter = new js_api_1.UserProcessInstanceFilterRepresentation();
                        newFilter.name = 'New Task Filter';
                        newFilter.appId = appId;
                        newFilter.icon = 'glyphicon-filter';
                        newFilter.filter = { sort: 'created-desc', state: 'completed', assignment: 'involved' };
                        return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter)];
                    case 1:
                        result = _a.sent();
                        taskFilterId = result.id;
                        return [4 /*yield*/, protractor_1.browser.refresh()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.customTaskFilter('New Task Filter').checkTaskFilterIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.deleteUserTaskFilter(taskFilterId)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286447] Should display the task filter icon when a custom filter is added', function () { return __awaiter(_this, void 0, void 0, function () {
            var newFilter, result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        newFilter = new js_api_1.UserProcessInstanceFilterRepresentation();
                        newFilter.name = 'New Task Filter with icon';
                        newFilter.appId = appId;
                        newFilter.icon = 'glyphicon-cloud';
                        newFilter.filter = { sort: 'created-desc', state: 'completed', assignment: 'involved' };
                        return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter)];
                    case 1:
                        result = _b.sent();
                        taskFilterId = result.id;
                        return [4 /*yield*/, protractor_1.browser.refresh()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickSettingsButton()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(500)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, appSettingsToggles.enableTaskFiltersIcon()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickTasksButton()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.customTaskFilter('New Task Filter with icon').checkTaskFilterIsDisplayed()];
                    case 7:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, taskFiltersDemoPage.customTaskFilter('New Task Filter with icon').getTaskFilterIcon()];
                    case 8: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('cloud')];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.deleteUserTaskFilter(taskFilterId)];
                    case 10:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286449] Should display task filter icons only when showIcon property is set on true', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, taskFiltersDemoPage.myTasksFilter().checkTaskFilterHasNoIcon()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickSettingsButton()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, appSettingsToggles.enableTaskFiltersIcon()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickTasksButton()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, taskFiltersDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 5:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, taskFiltersDemoPage.myTasksFilter().getTaskFilterIcon()];
                    case 6: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('inbox')];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=task-filters-component.e2e.js.map