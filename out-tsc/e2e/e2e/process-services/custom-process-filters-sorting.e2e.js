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
var processFiltersPage_1 = require("../pages/adf/process-services/processFiltersPage");
var filtersPage_1 = require("../pages/adf/process-services/filtersPage");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var users_actions_1 = require("../actions/users.actions");
var apps_actions_1 = require("../actions/APS/apps.actions");
describe('Sorting for process filters', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var processFiltersPage = new processFiltersPage_1.ProcessFiltersPage();
    var filtersPage = new filtersPage_1.FiltersPage();
    var apps = new apps_actions_1.AppsActions();
    var app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var tenantId, appId, user, processesQuery;
    var processFilter = {
        running_old_first: 'Running - Oldest first',
        completed_old_first: 'Completed - Oldest first',
        all_old_first: 'All - Oldest first',
        running_new_first: 'Running - Newest first',
        completed_new_first: 'Completed - Newest first',
        all_new_first: 'All - Newest first',
        completed_most_recently: 'Completed - Most recently',
        completed_least_recently: 'Completed - Least recently'
    };
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
        var users, importedApp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
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
                    importedApp = _a.sent();
                    appId = importedApp.id;
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(user)];
                case 5:
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
    it('[C260476] Should be able to create a filter on APS for running processes - Oldest first and check on ADF', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                        'appId': null, 'name': processFilter.running_old_first, 'icon': 'glyphicon-random',
                        'filter': { 'sort': 'created-asc', 'name': '', 'state': 'running' }
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 1')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 2')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 3')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 5: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 6: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.running_old_first)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, filtersPage.goToFilter(processFilter.running_old_first)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processApi.getProcessInstances({
                            'processDefinitionId': null, 'appDefinitionId': null, 'state': 'running', 'sort': 'created-asc'
                        })];
                case 10:
                    processesQuery = _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[0].name).toEqual('Process 1')];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[1].name).toEqual('Process 2')];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[2].name).toEqual('Process 3')];
                case 13:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260477] Should be able to create a filter on APS for completed processes - Oldest first and check on ADF', function () { return __awaiter(_this, void 0, void 0, function () {
        var firstProc, secondProc, thirdProc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                        'appId': null, 'name': processFilter.completed_old_first, 'icon': 'glyphicon-random',
                        'filter': { 'sort': 'created-asc', 'name': '', 'state': 'completed' }
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 1')];
                case 2:
                    firstProc = _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 2')];
                case 3:
                    secondProc = _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 3')];
                case 4:
                    thirdProc = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(firstProc.id)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(secondProc.id)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(thirdProc.id)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 8: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 9: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.completed_old_first)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, filtersPage.goToFilter(processFilter.completed_old_first)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processApi.getProcessInstances({
                            'processDefinitionId': null, 'appDefinitionId': null, 'state': 'completed', 'sort': 'created-asc'
                        })];
                case 13:
                    processesQuery = _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[0].name).toEqual('Process 1')];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[1].name).toEqual('Process 2')];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[2].name).toEqual('Process 3')];
                case 16:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260478] Should be able to create a filter on APS for all processes - Oldest first and check on ADF', function () { return __awaiter(_this, void 0, void 0, function () {
        var firstProc, secondProc, thirdProc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                        'appId': null, 'name': processFilter.all_old_first, 'icon': 'glyphicon-random',
                        'filter': { 'sort': 'created-asc', 'name': '', 'state': 'all' }
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 1')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 2')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 3')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 4')];
                case 5:
                    firstProc = _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 5')];
                case 6:
                    secondProc = _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 6')];
                case 7:
                    thirdProc = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(firstProc.id)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(secondProc.id)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(thirdProc.id)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 11: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 12: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.all_old_first)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, filtersPage.goToFilter(processFilter.all_old_first)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processApi.getProcessInstances({
                            'processDefinitionId': null, 'appDefinitionId': null, 'state': 'all', 'sort': 'created-asc'
                        })];
                case 16:
                    processesQuery = _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[0].name).toEqual('Process 1')];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[1].name).toEqual('Process 2')];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[2].name).toEqual('Process 3')];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[3].name).toEqual('Process 4')];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[4].name).toEqual('Process 5')];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[5].name).toEqual('Process 6')];
                case 22:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260479] Should be able to create a filter on APS for running processes - Newest first and check on ADF', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                        'appId': null, 'name': processFilter.running_new_first, 'icon': 'glyphicon-random',
                        'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 1')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 2')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 3')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 5: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 6: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.running_new_first)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, filtersPage.goToFilter(processFilter.running_new_first)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processApi.getProcessInstances({
                            'processDefinitionId': null, 'appDefinitionId': null, 'state': 'running', 'sort': 'created-desc'
                        })];
                case 10:
                    processesQuery = _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[0].name).toEqual('Process 3')];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[1].name).toEqual('Process 2')];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[2].name).toEqual('Process 1')];
                case 13:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260480] Should be able to create a filter on APS for completed processes - Newest first and check on ADF', function () { return __awaiter(_this, void 0, void 0, function () {
        var firstProc, secondProc, thirdProc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                        'appId': null, 'name': processFilter.completed_new_first, 'icon': 'glyphicon-random',
                        'filter': { 'sort': 'created-desc', 'name': '', 'state': 'completed' }
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 1')];
                case 2:
                    firstProc = _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 2')];
                case 3:
                    secondProc = _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 3')];
                case 4:
                    thirdProc = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(firstProc.id)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(secondProc.id)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(thirdProc.id)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 8: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 9: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.completed_new_first)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, filtersPage.goToFilter(processFilter.completed_new_first)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processApi.getProcessInstances({
                            'processDefinitionId': null, 'appDefinitionId': null, 'state': 'completed', 'sort': 'created-desc'
                        })];
                case 13:
                    processesQuery = _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[0].name).toEqual('Process 3')];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[1].name).toEqual('Process 2')];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[2].name).toEqual('Process 1')];
                case 16:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260481] Should be able to create a filter on APS for all processes - Newest first and check on ADF', function () { return __awaiter(_this, void 0, void 0, function () {
        var firstProc, secondProc, thirdProc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                        'appId': null, 'name': processFilter.all_new_first, 'icon': 'glyphicon-random',
                        'filter': { 'sort': 'created-desc', 'name': '', 'state': 'all' }
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 1')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 2')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 3')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 4')];
                case 5:
                    firstProc = _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 5')];
                case 6:
                    secondProc = _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 6')];
                case 7:
                    thirdProc = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(firstProc.id)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(secondProc.id)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(thirdProc.id)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 11: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 12: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.all_new_first)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, filtersPage.goToFilter(processFilter.all_new_first)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processApi.getProcessInstances({
                            'processDefinitionId': null, 'appDefinitionId': null, 'state': 'all', 'sort': 'created-desc'
                        })];
                case 16:
                    processesQuery = _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[0].name).toEqual('Process 6')];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[1].name).toEqual('Process 5')];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[2].name).toEqual('Process 4')];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[3].name).toEqual('Process 3')];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[4].name).toEqual('Process 2')];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[5].name).toEqual('Process 1')];
                case 22:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C272815] Should be able to create a filter on APS for completed processes - Completed most recently and check on ADF', function () { return __awaiter(_this, void 0, void 0, function () {
        var firstProc, secondProc, thirdProc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                        'appId': null, 'name': processFilter.completed_most_recently, 'icon': 'glyphicon-random',
                        'filter': { 'sort': 'ended-asc', 'name': '', 'state': 'completed' }
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 1')];
                case 2:
                    firstProc = _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 2')];
                case 3:
                    secondProc = _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 3')];
                case 4:
                    thirdProc = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(secondProc.id)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(firstProc.id)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(thirdProc.id)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 8: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 9: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.completed_most_recently)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, filtersPage.goToFilter(processFilter.completed_most_recently)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processApi.getProcessInstances({
                            'processDefinitionId': null, 'appDefinitionId': null, 'state': 'completed', 'sort': 'ended-asc'
                        })];
                case 13:
                    processesQuery = _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[0].name).toEqual('Process 2')];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[1].name).toEqual('Process 1')];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[2].name).toEqual('Process 3')];
                case 16:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C272816] Should be able to create a filter on APS for completed processes - Completed least recently and check on ADF', function () { return __awaiter(_this, void 0, void 0, function () {
        var firstProc, secondProc, thirdProc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                        'appId': null, 'name': processFilter.completed_least_recently, 'icon': 'glyphicon-random',
                        'filter': { 'sort': 'ended-desc', 'name': '', 'state': 'completed' }
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 1')];
                case 2:
                    firstProc = _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 2')];
                case 3:
                    secondProc = _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 3')];
                case 4:
                    thirdProc = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(secondProc.id)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(firstProc.id)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(thirdProc.id)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 8: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 9: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.completed_least_recently)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, filtersPage.goToFilter(processFilter.completed_least_recently)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.processApi.getProcessInstances({
                            'processDefinitionId': null, 'appDefinitionId': null, 'state': 'completed', 'sort': 'ended-desc'
                        })];
                case 13:
                    processesQuery = _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[0].name).toEqual('Process 3')];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[1].name).toEqual('Process 1')];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, expect(processesQuery.data[2].name).toEqual('Process 2')];
                case 16:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=custom-process-filters-sorting.e2e.js.map