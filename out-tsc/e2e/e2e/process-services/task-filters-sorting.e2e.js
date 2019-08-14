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
var taskFiltersDemoPage_1 = require("../pages/adf/demo-shell/process-services/taskFiltersDemoPage");
var js_api_1 = require("@alfresco/js-api");
var apps_actions_1 = require("../actions/APS/apps.actions");
var users_actions_1 = require("../actions/users.actions");
var protractor_1 = require("protractor");
describe('Task Filters Sorting', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var processServicesPage = new processServicesPage_1.ProcessServicesPage();
    var tasksPage = new tasksPage_1.TasksPage();
    var tasksListPage = new tasksListPage_1.TasksListPage();
    var taskDetailsPage = new taskDetailsPage_1.TaskDetailsPage();
    var taskFiltersDemoPage = new taskFiltersDemoPage_1.TaskFiltersDemoPage();
    var user;
    var appId;
    var importedApp;
    var app = resources.Files.APP_WITH_PROCESSES;
    var tasks = [
        { name: 'Task 1 Completed', dueDate: '01/01/2019' },
        { name: 'Task 2 Completed', dueDate: '02/01/2019' },
        { name: 'Task 3 Completed', dueDate: '03/01/2019' },
        { name: 'Task 4', dueDate: '01/01/2019' },
        { name: 'Task 5', dueDate: '02/01/2019' },
        { name: 'Task 6', dueDate: '03/01/2019' }
    ];
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var apps, users, appDefinitions, task, task2, task3, task4, task5, task6;
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
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, processServicesPage.checkApsContainer()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, tasksPage.createNewTask()];
                case 10:
                    task = _a.sent();
                    return [4 /*yield*/, task.addName(tasks[0].name)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, task.addDueDate(tasks[0].dueDate)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, task.clickStartButton()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.clickCompleteTask()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, tasksPage.createNewTask()];
                case 15:
                    task2 = _a.sent();
                    return [4 /*yield*/, task2.addName(tasks[1].name)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, task2.addDueDate(tasks[1].dueDate)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, task2.clickStartButton()];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.clickCompleteTask()];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, tasksPage.createNewTask()];
                case 20:
                    task3 = _a.sent();
                    return [4 /*yield*/, task3.addName(tasks[2].name)];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, task3.addDueDate(tasks[2].dueDate)];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, task3.clickStartButton()];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.clickCompleteTask()];
                case 24:
                    _a.sent();
                    return [4 /*yield*/, tasksPage.createNewTask()];
                case 25:
                    task4 = _a.sent();
                    return [4 /*yield*/, task4.addName(tasks[3].name)];
                case 26:
                    _a.sent();
                    return [4 /*yield*/, task4.addDueDate(tasks[3].dueDate)];
                case 27:
                    _a.sent();
                    return [4 /*yield*/, task4.clickStartButton()];
                case 28:
                    _a.sent();
                    return [4 /*yield*/, tasksPage.createNewTask()];
                case 29:
                    task5 = _a.sent();
                    return [4 /*yield*/, task5.addName(tasks[4].name)];
                case 30:
                    _a.sent();
                    return [4 /*yield*/, task5.addDueDate(tasks[4].dueDate)];
                case 31:
                    _a.sent();
                    return [4 /*yield*/, task5.clickStartButton()];
                case 32:
                    _a.sent();
                    return [4 /*yield*/, tasksPage.createNewTask()];
                case 33:
                    task6 = _a.sent();
                    return [4 /*yield*/, task6.addName(tasks[5].name)];
                case 34:
                    _a.sent();
                    return [4 /*yield*/, task6.addDueDate(tasks[5].dueDate)];
                case 35:
                    _a.sent();
                    return [4 /*yield*/, task6.clickStartButton()];
                case 36:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277254] Should display tasks under new filter from newest to oldest when they are completed', function () { return __awaiter(_this, void 0, void 0, function () {
        var newFilter, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    newFilter = new js_api_1.UserProcessInstanceFilterRepresentation();
                    newFilter.name = 'Newest first';
                    newFilter.appId = appId;
                    newFilter.icon = 'glyphicon-filter';
                    newFilter.filter = { sort: 'created-desc', state: 'completed', assignment: 'involved' };
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.refresh()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, taskFiltersDemoPage.customTaskFilter('Newest first').clickTaskFilter()];
                case 3:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(1)];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe(tasks[2].name)];
                case 5:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(2)];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe(tasks[1].name)];
                case 7:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(3)];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(tasks[0].name)];
                case 9:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277255] Should display tasks under new filter from oldest to newest when they are completed', function () { return __awaiter(_this, void 0, void 0, function () {
        var newFilter, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    newFilter = new js_api_1.UserProcessInstanceFilterRepresentation();
                    newFilter.name = 'Newest last';
                    newFilter.appId = appId;
                    newFilter.icon = 'glyphicon-filter';
                    newFilter.filter = { sort: 'created-asc', state: 'completed', assignment: 'involved' };
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.refresh()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, taskFiltersDemoPage.customTaskFilter('Newest last').clickTaskFilter()];
                case 3:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(1)];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe(tasks[0].name)];
                case 5:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(2)];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe(tasks[1].name)];
                case 7:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(3)];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(tasks[2].name)];
                case 9:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277256] Should display tasks under new filter from closest due date to farthest when they are completed', function () { return __awaiter(_this, void 0, void 0, function () {
        var newFilter, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    newFilter = new js_api_1.UserProcessInstanceFilterRepresentation();
                    newFilter.name = 'Due first';
                    newFilter.appId = appId;
                    newFilter.icon = 'glyphicon-filter';
                    newFilter.filter = { sort: 'due-desc', state: 'completed', assignment: 'involved' };
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.refresh()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, taskFiltersDemoPage.customTaskFilter('Due first').clickTaskFilter()];
                case 3:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(1)];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe(tasks[2].name)];
                case 5:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(2)];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe(tasks[1].name)];
                case 7:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(3)];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(tasks[0].name)];
                case 9:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277257] Should display tasks under new filter from farthest due date to closest when they are completed', function () { return __awaiter(_this, void 0, void 0, function () {
        var newFilter, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    newFilter = new js_api_1.UserProcessInstanceFilterRepresentation();
                    newFilter.name = 'Due last';
                    newFilter.appId = appId;
                    newFilter.icon = 'glyphicon-filter';
                    newFilter.filter = { sort: 'due-asc', state: 'completed', assignment: 'involved' };
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.refresh()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, taskFiltersDemoPage.customTaskFilter('Due last').clickTaskFilter()];
                case 3:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(1)];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe(tasks[0].name)];
                case 5:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(2)];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe(tasks[1].name)];
                case 7:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(3)];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(tasks[2].name)];
                case 9:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277258] Should display tasks under new filter from newest to oldest when they are open  ', function () { return __awaiter(_this, void 0, void 0, function () {
        var newFilter, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    newFilter = new js_api_1.UserProcessInstanceFilterRepresentation();
                    newFilter.name = 'Newest first Open';
                    newFilter.appId = appId;
                    newFilter.icon = 'glyphicon-filter';
                    newFilter.filter = { sort: 'created-desc', state: 'open', assignment: 'involved' };
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.refresh()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, taskFiltersDemoPage.customTaskFilter('Newest first Open').clickTaskFilter()];
                case 3:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(1)];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe(tasks[5].name)];
                case 5:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(2)];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe(tasks[4].name)];
                case 7:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(3)];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(tasks[3].name)];
                case 9:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277259] Should display tasks under new filter from oldest to newest when they are open', function () { return __awaiter(_this, void 0, void 0, function () {
        var newFilter, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    newFilter = new js_api_1.UserProcessInstanceFilterRepresentation();
                    newFilter.name = 'Newest last Open';
                    newFilter.appId = appId;
                    newFilter.icon = 'glyphicon-filter';
                    newFilter.filter = { sort: 'created-asc', state: 'open', assignment: 'involved' };
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.refresh()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, taskFiltersDemoPage.customTaskFilter('Newest last Open').clickTaskFilter()];
                case 3:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(1)];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe(tasks[3].name)];
                case 5:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(2)];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe(tasks[4].name)];
                case 7:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(3)];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(tasks[5].name)];
                case 9:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277260] Should display tasks under new filter from closest due date to farthest when they are open', function () { return __awaiter(_this, void 0, void 0, function () {
        var newFilter, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    newFilter = new js_api_1.UserProcessInstanceFilterRepresentation();
                    newFilter.name = 'Due first Open';
                    newFilter.appId = appId;
                    newFilter.icon = 'glyphicon-filter';
                    newFilter.filter = { sort: 'due-desc', state: 'open', assignment: 'involved' };
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.refresh()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, taskFiltersDemoPage.customTaskFilter('Due first Open').clickTaskFilter()];
                case 3:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(1)];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe(tasks[5].name)];
                case 5:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(2)];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe(tasks[4].name)];
                case 7:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(3)];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(tasks[3].name)];
                case 9:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277261] Should display tasks under new filter from farthest due date to closest when they are open', function () { return __awaiter(_this, void 0, void 0, function () {
        var newFilter, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    newFilter = new js_api_1.UserProcessInstanceFilterRepresentation();
                    newFilter.name = 'Due last Open';
                    newFilter.appId = appId;
                    newFilter.icon = 'glyphicon-filter';
                    newFilter.filter = { sort: 'due-asc', state: 'open', assignment: 'involved' };
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserTaskFilter(newFilter)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.refresh()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, taskFiltersDemoPage.customTaskFilter('Due last Open').clickTaskFilter()];
                case 3:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(1)];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe(tasks[3].name)];
                case 5:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(2)];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe(tasks[4].name)];
                case 7:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, tasksListPage.getDataTable().contentInPosition(3)];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(tasks[5].name)];
                case 9:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=task-filters-sorting.e2e.js.map