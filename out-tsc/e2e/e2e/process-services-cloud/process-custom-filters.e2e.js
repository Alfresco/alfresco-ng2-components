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
describe('Process list cloud', function () {
    describe('Process List', function () {
        var loginSSOPage = new adf_testing_1.LoginSSOPage();
        var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
        var appListCloudComponent = new adf_testing_2.AppListCloudPage();
        var processCloudDemoPage = new processCloudDemoPage_1.ProcessCloudDemoPage();
        var tasksCloudDemoPage = new tasksCloudDemoPage_1.TasksCloudDemoPage();
        var settingsPage = new adf_testing_1.SettingsPage();
        var apiService = new adf_testing_1.ApiService(protractor_1.browser.params.config.oauth2.clientId, protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.providers);
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
        var completedProcess, runningProcessInstance, switchProcessInstance, noOfApps, testUser, groupInfo, anotherProcessInstance;
        var candidateBaseApp = resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.name;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var processDefinition, anotherProcessDefinition, task, claimedTask;
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
                        processDefinitionService = new adf_testing_1.ProcessDefinitionsService(apiService);
                        return [4 /*yield*/, processDefinitionService
                                .getProcessDefinitionByName(resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.processes.candidateGroupProcess, candidateBaseApp)];
                    case 6:
                        processDefinition = _a.sent();
                        return [4 /*yield*/, processDefinitionService
                                .getProcessDefinitionByName(resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.processes.anotherCandidateGroupProcess, candidateBaseApp)];
                    case 7:
                        anotherProcessDefinition = _a.sent();
                        processInstancesService = new adf_testing_1.ProcessInstancesService(apiService);
                        return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                                'name': adf_testing_1.StringUtil.generateRandomString(),
                                'businessKey': adf_testing_1.StringUtil.generateRandomString()
                            })];
                    case 9:
                        runningProcessInstance = _a.sent();
                        return [4 /*yield*/, processInstancesService.createProcessInstance(anotherProcessDefinition.entry.key, candidateBaseApp, {
                                'name': adf_testing_1.StringUtil.generateRandomString(),
                                'businessKey': adf_testing_1.StringUtil.generateRandomString()
                            })];
                    case 10:
                        anotherProcessInstance = _a.sent();
                        return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                                'name': adf_testing_1.StringUtil.generateRandomString(),
                                'businessKey': adf_testing_1.StringUtil.generateRandomString()
                            })];
                    case 11:
                        switchProcessInstance = _a.sent();
                        return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                                'name': adf_testing_1.StringUtil.generateRandomString(),
                                'businessKey': adf_testing_1.StringUtil.generateRandomString()
                            })];
                    case 12:
                        completedProcess = _a.sent();
                        queryService = new adf_testing_1.QueryService(apiService);
                        return [4 /*yield*/, protractor_1.browser.sleep(4000)];
                    case 13:
                        _a.sent(); // eventual consistency query
                        return [4 /*yield*/, queryService.getProcessInstanceTasks(completedProcess.entry.id, candidateBaseApp)];
                    case 14:
                        task = _a.sent();
                        tasksService = new adf_testing_1.TasksService(apiService);
                        return [4 /*yield*/, tasksService.claimTask(task.list.entries[0].entry.id, candidateBaseApp)];
                    case 15:
                        claimedTask = _a.sent();
                        return [4 /*yield*/, tasksService.completeTask(claimedTask.entry.id, candidateBaseApp)];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, settingsPage.setProviderBpmSso(protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.identityHost)];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password)];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.LocalStorageUtil.setConfigField('adf-edit-process-filter', JSON.stringify(editProcessFilterConfigFile))];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.LocalStorageUtil.setConfigField('adf-cloud-process-list', JSON.stringify(processListCloudConfigFile))];
                    case 20:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, processInstancesService.deleteProcessInstance(anotherProcessInstance.entry.id, candidateBaseApp)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, apiService.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, identityService.deleteIdentityUser(testUser.idIdentityService)];
                    case 3:
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
        it('[C290069] Should display processes ordered by name when Name is selected from sort dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var editProcessFilterCloudComponent, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        editProcessFilterCloudComponent = processCloudDemoPage.editProcessFilterCloudComponent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.clickCustomiseFilterHeader()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setStatusFilterDropDown('RUNNING')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setSortFilterDropDown('Name')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setOrderFilterDropDown('ASC')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Name')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setOrderFilterDropDown('DESC')];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Name')];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291783] Should display processes ordered by id when Id is selected from sort dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var editProcessFilterCloudComponent, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        editProcessFilterCloudComponent = processCloudDemoPage.editProcessFilterCloudComponent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.clickCustomiseFilterHeader()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setStatusFilterDropDown('RUNNING')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setSortFilterDropDown('Id')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setOrderFilterDropDown('ASC')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Id')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setOrderFilterDropDown('DESC')];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Id')];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C305054] Should display processes ordered by status when Status is selected from sort dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var editProcessFilterCloudComponent, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        editProcessFilterCloudComponent = processCloudDemoPage.editProcessFilterCloudComponent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.clickCustomiseFilterHeader()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setStatusFilterDropDown('ALL')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setSortFilterDropDown('Status')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setOrderFilterDropDown('ASC')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Status')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setOrderFilterDropDown('DESC')];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Status')];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C305054] Should display processes ordered by initiator when Initiator is selected from sort dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var editProcessFilterCloudComponent, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        editProcessFilterCloudComponent = processCloudDemoPage.editProcessFilterCloudComponent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.clickCustomiseFilterHeader()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setStatusFilterDropDown('ALL')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setSortFilterDropDown('Initiator')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setOrderFilterDropDown('ASC')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Initiator')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setOrderFilterDropDown('DESC')];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Initiator')];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C305054] Should display processes ordered by processdefinitionid date when ProcessDefinitionId is selected from sort dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var editProcessFilterCloudComponent, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        editProcessFilterCloudComponent = processCloudDemoPage.editProcessFilterCloudComponent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.clickCustomiseFilterHeader()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setStatusFilterDropDown('ALL')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setSortFilterDropDown('ProcessDefinitionId')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setOrderFilterDropDown('ASC')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Process Definition Id')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setOrderFilterDropDown('DESC')];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Process Definition Id')];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C305054] Should display processes ordered by processdefinitionkey date when ProcessDefinitionKey is selected from sort dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var editProcessFilterCloudComponent, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        editProcessFilterCloudComponent = processCloudDemoPage.editProcessFilterCloudComponent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.clickCustomiseFilterHeader()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setStatusFilterDropDown('ALL')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setSortFilterDropDown('ProcessDefinitionKey')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setOrderFilterDropDown('ASC')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Process Definition Key')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setOrderFilterDropDown('DESC')];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Process Definition Key')];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C305054] Should display processes ordered by last modified date when Last Modified is selected from sort dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var editProcessFilterCloudComponent, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        editProcessFilterCloudComponent = processCloudDemoPage.editProcessFilterCloudComponent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.clickCustomiseFilterHeader()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setStatusFilterDropDown('ALL')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setSortFilterDropDown('LastModified')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setOrderFilterDropDown('ASC')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Last Modified')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setOrderFilterDropDown('DESC')];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Last Modified')];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C305054] Should display processes ordered by business key date when BusinessKey is selected from sort dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var editProcessFilterCloudComponent, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        editProcessFilterCloudComponent = processCloudDemoPage.editProcessFilterCloudComponent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.clickCustomiseFilterHeader()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setStatusFilterDropDown('ALL')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setSortFilterDropDown('BusinessKey')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.setOrderFilterDropDown('ASC')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Business Key')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setOrderFilterDropDown('DESC')];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Business Key')];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C305054] Should display the actions filters Save, SaveAs and Delete', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, editProcessFilterCloudComponent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().clickProcessFilter()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('All Processes')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 5:
                        _b.sent();
                        editProcessFilterCloudComponent = processCloudDemoPage.editProcessFilterCloudComponent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.checkSaveButtonIsDisplayed()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.checkSaveAsButtonIsDisplayed()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, editProcessFilterCloudComponent.checkDeleteButtonIsDisplayed()];
                    case 8:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297697] The value of the filter should be preserved when saving it', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProcessInstanceId(completedProcess.entry.id)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('New')];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clickOnSaveButton()];
                    case 5:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 6: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe('New')];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(completedProcess.entry.id)];
                    case 8:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().numberOfRows()];
                    case 9: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe(1)];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 11:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getProcessInstanceId()];
                    case 12: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toEqual(completedProcess.entry.id)];
                    case 13:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297646] Should display the filter dropdown fine , after switching between saved filters', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0: return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 1:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getNumberOfAppNameOptions()];
                    case 2:
                        noOfApps = _k.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkAppNamesAreUnique()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_k.sent()]).toBe(true)];
                    case 4:
                        _k.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 5:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('RUNNING')];
                    case 6:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setAppNameDropDown(candidateBaseApp)];
                    case 7:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProcessInstanceId(runningProcessInstance.entry.id)];
                    case 8:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(runningProcessInstance.entry.id)];
                    case 9:
                        _k.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getNumberOfAppNameOptions()];
                    case 10: return [4 /*yield*/, _b.apply(void 0, [_k.sent()]).toBe(noOfApps)];
                    case 11:
                        _k.sent();
                        _c = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkAppNamesAreUnique()];
                    case 12: return [4 /*yield*/, _c.apply(void 0, [_k.sent()]).toBe(true)];
                    case 13:
                        _k.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 14:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton()];
                    case 15:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('SavedFilter')];
                    case 16:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clickOnSaveButton()];
                    case 17:
                        _k.sent();
                        _d = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 18: return [4 /*yield*/, _d.apply(void 0, [_k.sent()]).toBe('SavedFilter')];
                    case 19:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 20:
                        _k.sent();
                        _e = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getProcessInstanceId()];
                    case 21: return [4 /*yield*/, _e.apply(void 0, [_k.sent()]).toEqual(runningProcessInstance.entry.id)];
                    case 22:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('RUNNING')];
                    case 23:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setAppNameDropDown(candidateBaseApp)];
                    case 24:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProcessInstanceId(switchProcessInstance.entry.id)];
                    case 25:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(switchProcessInstance.entry.id)];
                    case 26:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton()];
                    case 27:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('SwitchFilter')];
                    case 28:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clickOnSaveButton()];
                    case 29:
                        _k.sent();
                        _f = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 30: return [4 /*yield*/, _f.apply(void 0, [_k.sent()]).toBe('SwitchFilter')];
                    case 31:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 32:
                        _k.sent();
                        _g = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getProcessInstanceId()];
                    case 33: return [4 /*yield*/, _g.apply(void 0, [_k.sent()]).toEqual(switchProcessInstance.entry.id)];
                    case 34:
                        _k.sent();
                        _h = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getNumberOfAppNameOptions()];
                    case 35: return [4 /*yield*/, _h.apply(void 0, [_k.sent()]).toBe(noOfApps)];
                    case 36:
                        _k.sent();
                        _j = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkAppNamesAreUnique()];
                    case 37: return [4 /*yield*/, _j.apply(void 0, [_k.sent()]).toBe(true)];
                    case 38:
                        _k.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 39:
                        _k.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('Process List - Check Action Filters', function () {
            beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, adf_testing_2.LocalStorageUtil.setConfigField('adf-edit-process-filter', JSON.stringify({
                                'actions': [
                                    'save',
                                    'saveAs'
                                ]
                            }))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, navigationBarPage.navigateToProcessServicesCloudPage()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, appListCloudComponent.checkApsContainer()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, appListCloudComponent.goToApp(candidateBaseApp)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded()];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, processCloudDemoPage.clickOnProcessFilters()];
                        case 6:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C305054] Should display the actions filters Save and SaveAs, Delete button is not displayed', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().clickProcessFilter()];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed()];
                        case 2:
                            _b.sent();
                            _a = expect;
                            return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                        case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('All Processes')];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                        case 5:
                            _b.sent();
                            return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkSaveButtonIsDisplayed()];
                        case 6:
                            _b.sent();
                            return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkSaveAsButtonIsDisplayed()];
                        case 7:
                            _b.sent();
                            return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkDeleteButtonIsNotDisplayed()];
                        case 8:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
//# sourceMappingURL=process-custom-filters.e2e.js.map