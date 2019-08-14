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
var adf_testing_2 = require("@alfresco/adf-testing");
var resources = require("../util/resources");
describe('Task filters cloud', function () {
    describe('Filters', function () {
        var loginSSOPage = new adf_testing_1.LoginSSOPage();
        var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
        var appListCloudComponent = new adf_testing_2.AppListCloudPage();
        var tasksCloudDemoPage = new tasksCloudDemoPage_1.TasksCloudDemoPage();
        var settingsPage = new adf_testing_1.SettingsPage();
        var apiService = new adf_testing_1.ApiService(protractor_1.browser.params.config.oauth2.clientId, protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.providers);
        var tasksService;
        var identityService;
        var groupIdentityService;
        var processDefinitionService;
        var processInstancesService;
        var queryService;
        var createdTaskName = adf_testing_1.StringUtil.generateRandomString(), completedTaskName = adf_testing_1.StringUtil.generateRandomString(), assignedTaskName = adf_testing_1.StringUtil.generateRandomString(), deletedTaskName = adf_testing_1.StringUtil.generateRandomString();
        var simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
        var assignedTask, deletedTask, testUser, groupInfo;
        var orderByNameAndPriority = ['cCreatedTask', 'dCreatedTask', 'eCreatedTask'];
        var priority = 30;
        var nrOfTasks = 3;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var i, processDefinition, processInstance, secondProcessInstance;
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
                        tasksService = new adf_testing_1.TasksService(apiService);
                        return [4 /*yield*/, tasksService.createStandaloneTask(createdTaskName, simpleApp)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, tasksService.createStandaloneTask(assignedTaskName, simpleApp)];
                    case 7:
                        assignedTask = _a.sent();
                        return [4 /*yield*/, tasksService.claimTask(assignedTask.entry.id, simpleApp)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, tasksService.createAndCompleteTask(completedTaskName, simpleApp)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, tasksService.createStandaloneTask(deletedTaskName, simpleApp)];
                    case 10:
                        deletedTask = _a.sent();
                        return [4 /*yield*/, tasksService.deleteTask(deletedTask.entry.id, simpleApp)];
                    case 11:
                        _a.sent();
                        i = 0;
                        _a.label = 12;
                    case 12:
                        if (!(i < nrOfTasks)) return [3 /*break*/, 15];
                        return [4 /*yield*/, tasksService.createStandaloneTask(orderByNameAndPriority[i], simpleApp, { priority: priority })];
                    case 13:
                        _a.sent();
                        priority = priority + 20;
                        _a.label = 14;
                    case 14:
                        i++;
                        return [3 /*break*/, 12];
                    case 15:
                        processDefinitionService = new adf_testing_1.ProcessDefinitionsService(apiService);
                        return [4 /*yield*/, processDefinitionService
                                .getProcessDefinitionByName(resources.ACTIVITI7_APPS.SIMPLE_APP.processes.simpleProcess, simpleApp)];
                    case 16:
                        processDefinition = _a.sent();
                        processInstancesService = new adf_testing_1.ProcessInstancesService(apiService);
                        return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp)];
                    case 17:
                        processInstance = _a.sent();
                        return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp)];
                    case 18:
                        secondProcessInstance = _a.sent();
                        queryService = new adf_testing_1.QueryService(apiService);
                        return [4 /*yield*/, protractor_1.browser.sleep(4000)];
                    case 19:
                        _a.sent(); // eventual consistency query
                        return [4 /*yield*/, queryService.getProcessInstanceTasks(secondProcessInstance.entry.id, simpleApp)];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, processInstancesService.suspendProcessInstance(processInstance.entry.id, simpleApp)];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, processInstancesService.deleteProcessInstance(secondProcessInstance.entry.id, simpleApp)];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, queryService.getProcessInstanceTasks(processInstance.entry.id, simpleApp)];
                    case 23:
                        _a.sent();
                        return [4 /*yield*/, settingsPage.setProviderBpmSso(protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.identityHost)];
                    case 24:
                        _a.sent();
                        return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password)];
                    case 25:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, 5 * 60 * 1000);
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
        }); }, 60000);
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
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C290045] Should display only tasks with Assigned status when Assigned is selected from status dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ASSIGNED')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assignedTaskName)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTaskName)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTaskName)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(deletedTaskName)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C290061] Should display only tasks with Completed status when Completed is selected from status dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('COMPLETED')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(assignedTaskName)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTaskName)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(deletedTaskName)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C290139] Should display only tasks with all statuses when All is selected from status dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(deletedTaskName)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assignedTaskName)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTaskName)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C290060] Should display only tasks with Created status when Created is selected from status dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('CREATED')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTaskName)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(assignedTaskName)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTaskName)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(deletedTaskName)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C290155] Should display only tasks with Cancelled status when Cancelled is selected from status dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('CANCELLED')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(deletedTaskName)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(assignedTaskName)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTaskName)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTaskName)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=tasks-custom-filters.e2e.js.map