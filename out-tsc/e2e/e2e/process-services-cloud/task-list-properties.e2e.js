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
var task_list_cloud_config_1 = require("./config/task-list-cloud.config");
var moment = require("moment");
var resources = require("../util/resources");
describe('Edit task filters and task list properties', function () {
    var loginSSOPage = new adf_testing_1.LoginSSOPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var appListCloudComponent = new adf_testing_1.AppListCloudPage();
    var tasksCloudDemoPage = new tasksCloudDemoPage_1.TasksCloudDemoPage();
    var tasksService;
    var processDefinitionService;
    var processInstancesService;
    var identityService;
    var groupIdentityService;
    var apiService = new adf_testing_1.ApiService(protractor_1.browser.params.config.oauth2.clientId, protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.providers);
    var simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
    var candidateBaseApp = resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.name;
    var noTasksFoundMessage = 'No Tasks Found';
    var createdTask, notAssigned, notDisplayedTask, processDefinition, processInstance, priorityTask, subTask, otherOwnerTask, testUser, groupInfo;
    var priority = 30;
    var beforeDate = moment().add(-1, 'days').format('DD/MM/YYYY');
    var currentDate = adf_testing_1.DateUtil.formatDate('DD/MM/YYYY');
    var afterDate = moment().add(1, 'days').format('DD/MM/YYYY');
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var settingsPage, jsonFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apiService.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                case 1:
                    _a.sent();
                    identityService = new adf_testing_1.IdentityService(apiService);
                    groupIdentityService = new adf_testing_1.GroupIdentityService(apiService);
                    tasksService = new adf_testing_1.TasksService(apiService);
                    settingsPage = new adf_testing_1.SettingsPage();
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
                    return [4 /*yield*/, tasksService.createStandaloneTask(adf_testing_1.StringUtil.generateRandomString(), simpleApp)];
                case 6:
                    otherOwnerTask = _a.sent();
                    return [4 /*yield*/, tasksService.claimTask(otherOwnerTask.entry.id, simpleApp)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, tasksService.createStandaloneTask(adf_testing_1.StringUtil.generateRandomString(), simpleApp)];
                case 8:
                    createdTask = _a.sent();
                    return [4 /*yield*/, tasksService.claimTask(createdTask.entry.id, simpleApp)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, tasksService.createStandaloneTask(adf_testing_1.StringUtil.generateRandomString(), simpleApp)];
                case 10:
                    notAssigned = _a.sent();
                    return [4 /*yield*/, tasksService.createStandaloneTask(adf_testing_1.StringUtil.generateRandomString(), simpleApp, { priority: priority })];
                case 11:
                    priorityTask = _a.sent();
                    return [4 /*yield*/, tasksService.claimTask(priorityTask.entry.id, simpleApp)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, tasksService.createStandaloneTask(adf_testing_1.StringUtil.generateRandomString(), candidateBaseApp)];
                case 13:
                    notDisplayedTask = _a.sent();
                    return [4 /*yield*/, tasksService.claimTask(notDisplayedTask.entry.id, candidateBaseApp)];
                case 14:
                    _a.sent();
                    processDefinitionService = new adf_testing_1.ProcessDefinitionsService(apiService);
                    return [4 /*yield*/, processDefinitionService
                            .getProcessDefinitionByName(resources.ACTIVITI7_APPS.SIMPLE_APP.processes.dropdownrestprocess, simpleApp)];
                case 15:
                    processDefinition = _a.sent();
                    processInstancesService = new adf_testing_1.ProcessInstancesService(apiService);
                    return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp)];
                case 16:
                    processInstance = _a.sent();
                    return [4 /*yield*/, tasksService.createStandaloneTask(adf_testing_1.StringUtil.generateRandomString(), simpleApp, { 'parentTaskId': createdTask.entry.id })];
                case 17:
                    subTask = _a.sent();
                    return [4 /*yield*/, tasksService.claimTask(subTask.entry.id, simpleApp)];
                case 18:
                    _a.sent();
                    jsonFile = new task_list_cloud_config_1.TaskListCloudConfiguration().getConfiguration();
                    return [4 /*yield*/, settingsPage.setProviderBpmSso(protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.identityHost)];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password)];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('adf-cloud-task-list', JSON.stringify(jsonFile))];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('adf-edit-task-filter', JSON.stringify({
                            'filterProperties': [
                                'taskId',
                                'appName',
                                'status',
                                'assignee',
                                'taskName',
                                'parentTaskId',
                                'priority',
                                'standAlone',
                                'owner',
                                'processDefinitionId',
                                'processInstanceId',
                                'lastModified',
                                'sort',
                                'order'
                            ],
                            'sortProperties': [
                                'id',
                                'name',
                                'createdDate',
                                'priority',
                                'processDefinitionId',
                                'processInstanceId',
                                'parentTaskId',
                                'priority',
                                'standAlone',
                                'owner',
                                'assignee'
                            ],
                            'actions': [
                                'save',
                                'saveAs',
                                'delete'
                            ]
                        }))];
                case 22:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 5 * 60 * 1000);
    afterAll(function (done) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apiService.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, identityService.deleteIdentityUser(testUser.idIdentityService)];
                case 2:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Edit task filters and task list properties - filter properties', function () {
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
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C292004] Filter by appName', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe('My Tasks')];
                    case 3:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getAppNameDropDownValue()];
                    case 4: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual(simpleApp)];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTask.entry.name)];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(notDisplayedTask.entry.name)];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setAppNameDropDown(candidateBaseApp)];
                    case 8:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getAppNameDropDownValue()];
                    case 9: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toEqual(candidateBaseApp)];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(notDisplayedTask.entry.name)];
                    case 11:
                        _d.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTask.entry.name)];
                    case 12:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291906] Should be able to see only the task with specific taskId when typing it in the task Id field', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('My Tasks')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setId(createdTask.entry.id)];
                    case 4:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getId()];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(createdTask.entry.id)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(createdTask.entry.id)];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getRowsWithSameId(createdTask.entry.id).then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(list.length).toEqual(1)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 8:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291907] Should be able to see No tasks found when typing an invalid task id', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe('My Tasks')];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setId('invalidId')];
                    case 4:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getId()];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual('invalidId')];
                    case 6:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()];
                    case 7: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toEqual(noTasksFoundMessage)];
                    case 8:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297476] Filter by taskName', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('My Tasks')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setTaskName(createdTask.entry.name)];
                    case 4:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getTaskName()];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(createdTask.entry.name)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTask.entry.name)];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getRowsWithSameName(createdTask.entry.name).then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(list.length).toEqual(1)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 8:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297613] Should be able to see No tasks found when typing a task name that does not exist', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe('My Tasks')];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setTaskName('invalidName')];
                    case 4:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().getTaskName()];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual('invalidName')];
                    case 6:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()];
                    case 7: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toEqual(noTasksFoundMessage)];
                    case 8:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297480] Should be able to see only tasks that are part of a specific process when processInstanceId is set', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('My Tasks')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setProcessInstanceId(processInstance.entry.id)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee()];
                    case 6:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().getNumberOfRows()];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(1)];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByProcessInstanceId(processInstance.entry.id)];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297684] Should be able to see No tasks found when typing an invalid processInstanceId', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('My Tasks')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setProcessInstanceId('invalidTaskId')];
                    case 4:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(noTasksFoundMessage)];
                    case 6:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297478] Should be able to see only tasks that are assigned to a specific user when assignee is set', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('My Tasks')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setAssignee('admin.adf')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTask.entry.name)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(notAssigned.entry.name)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297686] Should be able to see No tasks found when typing an invalid user to assignee field', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('My Tasks')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setAssignee('invalid')];
                    case 4:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(noTasksFoundMessage)];
                    case 6:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297482] Should be able to see only tasks with specific priority when priority is set', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('My Tasks')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setPriority(priority)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(priorityTask.entry.name)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTask.entry.name)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297687] Should be able to see No tasks found when typing unused value for priority field', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('My Tasks')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setPriority('87650')];
                    case 4:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(noTasksFoundMessage)];
                    case 6:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297481] Should be able to see only tasks with specific parentTaskId when parentTaskId is set', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('My Tasks')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setParentTaskId(subTask.entry.parentTaskId)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(subTask.entry.name)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTask.entry.name)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297486] Filter by Owner', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('My Tasks')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL')];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee()];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOwner(testUser.username)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(notAssigned.entry.name)];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTask.entry.name)];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOwner('invalid')];
                    case 9:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()];
                    case 10: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(noTasksFoundMessage)];
                    case 11:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297484] Task is displayed when typing into lastModifiedFrom field a date before the task CreatedDate', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('My Tasks')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(beforeDate)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTask.entry.name)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(afterDate)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTask.entry.name)];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297689] Task is not displayed when typing into lastModifiedFrom field the same date as tasks CreatedDate', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('My Tasks')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(currentDate)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTask.entry.name)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297485] Task is displayed when typing into lastModifiedTo field a date after the task CreatedDate', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('My Tasks')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(afterDate)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTask.entry.name)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(beforeDate)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTask.entry.name)];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297690] Task is not displayed when typing into lastModifiedTo field the same date as tasks CreatedDate', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('My Tasks')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(currentDate)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(createdTask.entry.name)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297691] Task is not displayed when typing into lastModifiedFrom field a date before the task due date  ' +
            'and into lastModifiedTo a date before task due date', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('My Tasks')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(beforeDate)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(beforeDate)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setTaskName(createdTask.entry.name)];
                    case 6:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(noTasksFoundMessage)];
                    case 8:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297692] Task is displayed when typing into lastModifiedFrom field a date before the tasks due date ' +
            'and into lastModifiedTo a date after', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('My Tasks')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(beforeDate)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(afterDate)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setTaskName(createdTask.entry.name)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTask.entry.name)];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C297693] Task is not displayed when typing into lastModifiedFrom field a date after the tasks due date ' +
            'and into lastModifiedTo a date after', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('My Tasks')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedFrom(afterDate)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setLastModifiedTo(afterDate)];
                    case 5:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getNoTasksFoundMessage()];
                    case 6: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(noTasksFoundMessage)];
                    case 7:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Edit task filters and task list properties - sort properties', function () {
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
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C306901] Should display tasks sorted by task name when taskName is selected from sort dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ASSIGNED')];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('Name')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC')];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Name')];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC')];
                    case 6:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Name')];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 8:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C290156] Should display tasks ordered by id when Id is selected from sort dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ASSIGNED')];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('Id')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC')];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Id')];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC')];
                    case 6:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Id')];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 8:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C306903] Should display tasks sorted by processDefinitionId when processDefinitionId is selected from sort dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ASSIGNED')];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('ProcessDefinitionId')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC')];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'ProcessDefinitionId')];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC')];
                    case 6:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'ProcessDefinitionId')];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 8:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C306905] Should display tasks sorted by processInstanceId when processInstanceId is selected from sort dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ASSIGNED')];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('ProcessInstanceId')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC')];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'ProcessInstanceId')];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC')];
                    case 6:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'ProcessInstanceId')];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 8:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C306907] Should display tasks sorted by assignee when assignee is selected from sort dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('Assignee')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Assignee')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC')];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Assignee')];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C306911] Should display tasks sorted by parentTaskId when parentTaskId is selected from sort dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('ParentTaskId')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'ParentTaskId')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC')];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'ParentTaskId')];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C290087] Should display tasks ordered by priority when Priority is selected from sort dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('Priority')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Priority')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC')];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Priority')];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307114] Should display tasks sorted by standAlone when standAlone is selected from sort dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('StandAlone')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'StandAlone')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC')];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'StandAlone')];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307115] Should display tasks sorted by owner when owner is selected from sort dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setSortFilterDropDown('Owner')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('ASC')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('ASC', 'Owner')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setOrderFilterDropDown('DESC')];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkListIsSorted('DESC', 'Owner')];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=task-list-properties.e2e.js.map