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
var adf_testing_1 = require("@alfresco/adf-testing");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var processCloudDemoPage_1 = require("../pages/adf/demo-shell/process-services/processCloudDemoPage");
var tasksCloudDemoPage_1 = require("../pages/adf/demo-shell/process-services/tasksCloudDemoPage");
var adf_testing_2 = require("@alfresco/adf-testing");
var resources = require("../util/resources");
var protractor_1 = require("protractor");
var process_list_cloud_config_1 = require("./config/process-list-cloud.config");
var edit_process_filter_config_1 = require("./config/edit-process-filter.config");
var processListPage_1 = require("../pages/adf/process-services/processListPage");
var moment = require("moment");
describe('Process filters cloud', function () {
    var loginSSOPage = new adf_testing_1.LoginSSOPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var appListCloudComponent = new adf_testing_2.AppListCloudPage();
    var processCloudDemoPage = new processCloudDemoPage_1.ProcessCloudDemoPage();
    var tasksCloudDemoPage = new tasksCloudDemoPage_1.TasksCloudDemoPage();
    var processListPage = new processListPage_1.ProcessListPage();
    var settingsPage = new adf_testing_1.SettingsPage();
    var apiService = new adf_testing_1.ApiService(protractor_1.browser.params.config.oauth2.clientId, protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.providers);
    var beforeDate = moment().add(-1, 'days').format('DD/MM/YYYY');
    var currentDate = adf_testing_1.DateUtil.formatDate('DD/MM/YYYY');
    var afterDate = moment().add(1, 'days').format('DD/MM/YYYY');
    var processListCloudConfiguration = new process_list_cloud_config_1.ProcessListCloudConfiguration();
    var editProcessFilterConfiguration = new edit_process_filter_config_1.EditProcessFilterConfiguration();
    var processListCloudConfigFile = processListCloudConfiguration.getConfiguration();
    var editProcessFilterConfigFile = editProcessFilterConfiguration.getConfiguration();
    var tasksService;
    var identityService;
    var groupIdentityService;
    var processDefinitionService;
    var processInstancesService;
    var queryService;
    var completedProcess, runningProcessInstance, suspendProcessInstance, testUser, anotherUser, groupInfo, anotherProcessInstance, processDefinition, anotherProcessDefinition, differentAppUserProcessInstance, simpleAppProcessDefinition;
    var candidateBaseApp = resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.name;
    var simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var task, claimedTask;
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
                    return [4 /*yield*/, identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.APS_USER])];
                case 3:
                    anotherUser = _a.sent();
                    return [4 /*yield*/, groupIdentityService.getGroupInfoByGroupName('hr')];
                case 4:
                    groupInfo = _a.sent();
                    return [4 /*yield*/, identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, identityService.addUserToGroup(anotherUser.idIdentityService, groupInfo.id)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, apiService.login(anotherUser.email, anotherUser.password)];
                case 7:
                    _a.sent();
                    processDefinitionService = new adf_testing_1.ProcessDefinitionsService(apiService);
                    return [4 /*yield*/, processDefinitionService
                            .getProcessDefinitionByName(resources.ACTIVITI7_APPS.SIMPLE_APP.processes.simpleProcess, simpleApp)];
                case 8:
                    simpleAppProcessDefinition = _a.sent();
                    processInstancesService = new adf_testing_1.ProcessInstancesService(apiService);
                    return [4 /*yield*/, processInstancesService.createProcessInstance(simpleAppProcessDefinition.entry.key, simpleApp, {
                            'name': adf_testing_1.StringUtil.generateRandomString(),
                            'businessKey': adf_testing_1.StringUtil.generateRandomString()
                        })];
                case 9:
                    differentAppUserProcessInstance = _a.sent();
                    return [4 /*yield*/, apiService.login(testUser.email, testUser.password)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, processDefinitionService
                            .getProcessDefinitionByName(resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.processes.candidateGroupProcess, candidateBaseApp)];
                case 11:
                    processDefinition = _a.sent();
                    return [4 /*yield*/, processDefinitionService
                            .getProcessDefinitionByName(resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.processes.anotherCandidateGroupProcess, candidateBaseApp)];
                case 12:
                    anotherProcessDefinition = _a.sent();
                    return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                            'name': adf_testing_1.StringUtil.generateRandomString(),
                            'businessKey': adf_testing_1.StringUtil.generateRandomString()
                        })];
                case 13:
                    runningProcessInstance = _a.sent();
                    return [4 /*yield*/, processInstancesService.createProcessInstance(anotherProcessDefinition.entry.key, candidateBaseApp, {
                            'name': adf_testing_1.StringUtil.generateRandomString(),
                            'businessKey': adf_testing_1.StringUtil.generateRandomString()
                        })];
                case 14:
                    anotherProcessInstance = _a.sent();
                    return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                            'name': adf_testing_1.StringUtil.generateRandomString(),
                            'businessKey': adf_testing_1.StringUtil.generateRandomString()
                        })];
                case 15:
                    suspendProcessInstance = _a.sent();
                    return [4 /*yield*/, processInstancesService.suspendProcessInstance(suspendProcessInstance.entry.id, candidateBaseApp)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                            'name': adf_testing_1.StringUtil.generateRandomString(),
                            'businessKey': adf_testing_1.StringUtil.generateRandomString()
                        })];
                case 17:
                    completedProcess = _a.sent();
                    queryService = new adf_testing_1.QueryService(apiService);
                    return [4 /*yield*/, protractor_1.browser.sleep(4000)];
                case 18:
                    _a.sent(); // eventual consistency query
                    return [4 /*yield*/, queryService.getProcessInstanceTasks(completedProcess.entry.id, candidateBaseApp)];
                case 19:
                    task = _a.sent();
                    tasksService = new adf_testing_1.TasksService(apiService);
                    return [4 /*yield*/, tasksService.claimTask(task.list.entries[0].entry.id, candidateBaseApp)];
                case 20:
                    claimedTask = _a.sent();
                    return [4 /*yield*/, tasksService.completeTask(claimedTask.entry.id, candidateBaseApp)];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, settingsPage.setProviderBpmSso(protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.identityHost)];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password)];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_2.LocalStorageUtil.setConfigField('adf-edit-process-filter', JSON.stringify(editProcessFilterConfigFile))];
                case 24:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_2.LocalStorageUtil.setConfigField('adf-cloud-process-list', JSON.stringify(processListCloudConfigFile))];
                case 25:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processInstancesService.deleteProcessInstance(runningProcessInstance.entry.id, candidateBaseApp)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processInstancesService.deleteProcessInstance(anotherProcessInstance.entry.id, candidateBaseApp)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processInstancesService.deleteProcessInstance(suspendProcessInstance.entry.id, candidateBaseApp)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apiService.login(anotherUser.email, anotherUser.password)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processInstancesService.deleteProcessInstance(differentAppUserProcessInstance.entry.id, simpleApp)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apiService.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, identityService.deleteIdentityUser(testUser.idIdentityService)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, identityService.deleteIdentityUser(anotherUser.idIdentityService)];
                case 8:
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
                    return [4 /*yield*/, appListCloudComponent.goToApp(candidateBaseApp)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.clickOnProcessFilters()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C306887] Should be able to filter by appName', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setAppNameDropDown(candidateBaseApp)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('initiator', testUser.username)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(differentAppUserProcessInstance.entry.name)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C306889] Should be able to see "No process found" when using an app with no processes in the appName field', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setAppNameDropDown('subprocessapp')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('initiator', testUser.username)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 4:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, processListPage.checkProcessListTitleIsDisplayed()];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('No Processes Found')];
                case 6:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C306890] Should be able to filter by initiator', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('initiator', testUser.username)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(differentAppUserProcessInstance.entry.name)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C306891] Should be able to see "No process found" when providing an initiator whitout processes', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('initiator', anotherUser.username)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, processListPage.checkProcessListTitleIsDisplayed()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('No Processes Found')];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C311315] Should be able to filter by process definition id', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processDefinitionId', processDefinition.entry.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processDefinitionId', anotherProcessDefinition.entry.id)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name)];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C311316] Should be able to filter by process definition key', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processDefinitionKey', processDefinition.entry.key)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processDefinitionKey', anotherProcessDefinition.entry.key)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name)];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C311317] Should be able to filter by process instance id', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processInstanceId', runningProcessInstance.entry.id)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name)];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, protractor_1.browser.driver.sleep(1000)];
                case 5:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfRows()];
                case 6: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(1)];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processInstanceId', anotherProcessInstance.entry.id)];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name)];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name)];
                case 11:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfRows()];
                case 12: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(1)];
                case 13:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C311321] Should be able to filter by process name', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processName', runningProcessInstance.entry.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processName', anotherProcessInstance.entry.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name)];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C306892] Should be able to filter by process status - Running', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('RUNNING')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(suspendProcessInstance.entry.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(completedProcess.entry.name)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C306892] Should be able to filter by process status - Completed', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('COMPLETED')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(completedProcess.entry.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(suspendProcessInstance.entry.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(anotherProcessInstance.entry.name)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C306892] Should be able to filter by process status - Suspended', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('SUSPENDED')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(suspendProcessInstance.entry.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(anotherProcessInstance.entry.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(completedProcess.entry.name)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C306892] Should be able to filter by process status - All', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('ALL')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(anotherProcessInstance.entry.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(suspendProcessInstance.entry.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(completedProcess.entry.name)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C311318] Should be able to filter by lastModifiedFrom - displays record when date = currentDate', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('lastModifiedFrom', currentDate)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C311318] Should be able to filter by lastModifiedFrom - displays record when date = beforeDate', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('lastModifiedFrom', beforeDate)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C311318] Should be able to filter by lastModifiedFrom - does not display record when date = afterDate', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('lastModifiedFrom', afterDate)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C311319] Should be able to filter by lastModifiedTo - displays record when date = currentDate', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('lastModifiedTo', currentDate)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C311319] Should be able to filter by lastModifiedTo - does not display record when date = beforeDate', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('lastModifiedTo', beforeDate)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsNotDisplayedByName(runningProcessInstance.entry.name)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C311319] Should be able to filter by lastModifiedTo - displays record when date = afterDate', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('lastModifiedTo', afterDate)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcessInstance.entry.name)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C311319] Should not display any processes when the lastModifiedFrom and lastModifiedTo are set to a future date', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('lastModifiedFrom', afterDate)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('lastModifiedTo', afterDate)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                case 4:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, processListPage.checkProcessListTitleIsDisplayed()];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('No Processes Found')];
                case 6:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=process-filter-results.e2e.js.map