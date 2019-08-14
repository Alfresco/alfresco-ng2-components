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
describe('Task form cloud component', function () {
    var loginSSOPage = new adf_testing_1.LoginSSOPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var appListCloudComponent = new adf_testing_1.AppListCloudPage();
    var tasksCloudDemoPage = new tasksCloudDemoPage_1.TasksCloudDemoPage();
    var taskHeaderCloudPage = new adf_testing_1.TaskHeaderCloudPage();
    var taskFormCloudComponent = new adf_testing_1.TaskFormCloudComponent();
    var settingsPage = new adf_testing_1.SettingsPage();
    var widget = new adf_testing_1.Widget();
    var formToTestValidationsKey = 'form-49904910-603c-48e9-8c8c-1d442c0fa524';
    var tasksService;
    var processDefinitionService;
    var processInstancesService;
    var identityService;
    var completedTask, createdTask, assigneeTask, toBeCompletedTask, formValidationsTask, testUser;
    var candidateBaseApp = resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.name;
    var completedTaskName = adf_testing_1.StringUtil.generateRandomString(), assignedTaskName = adf_testing_1.StringUtil.generateRandomString();
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var apiService, processDefinition;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apiService = new adf_testing_1.ApiService(protractor_1.browser.params.config.oauth2.clientId, protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.providers);
                    return [4 /*yield*/, apiService.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                case 1:
                    _a.sent();
                    identityService = new adf_testing_1.IdentityService(apiService);
                    return [4 /*yield*/, identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.APS_USER])];
                case 2:
                    testUser = _a.sent();
                    return [4 /*yield*/, apiService.login(testUser.email, testUser.password)];
                case 3:
                    _a.sent();
                    tasksService = new adf_testing_1.TasksService(apiService);
                    return [4 /*yield*/, tasksService.createStandaloneTask(adf_testing_1.StringUtil.generateRandomString(), candidateBaseApp)];
                case 4:
                    createdTask = _a.sent();
                    return [4 /*yield*/, tasksService.createStandaloneTask(adf_testing_1.StringUtil.generateRandomString(), candidateBaseApp)];
                case 5:
                    assigneeTask = _a.sent();
                    return [4 /*yield*/, tasksService.claimTask(assigneeTask.entry.id, candidateBaseApp)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, tasksService.createStandaloneTaskWithForm(adf_testing_1.StringUtil.generateRandomString(), candidateBaseApp, formToTestValidationsKey)];
                case 7:
                    formValidationsTask = _a.sent();
                    return [4 /*yield*/, tasksService.claimTask(formValidationsTask.entry.id, candidateBaseApp)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, tasksService.createStandaloneTask(adf_testing_1.StringUtil.generateRandomString(), candidateBaseApp)];
                case 9:
                    toBeCompletedTask = _a.sent();
                    return [4 /*yield*/, tasksService.claimTask(toBeCompletedTask.entry.id, candidateBaseApp)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, tasksService.createStandaloneTask(assignedTaskName, candidateBaseApp)];
                case 11:
                    completedTask = _a.sent();
                    return [4 /*yield*/, tasksService.claimTask(completedTask.entry.id, candidateBaseApp)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, tasksService.createAndCompleteTask(completedTaskName, candidateBaseApp)];
                case 13:
                    _a.sent();
                    processDefinitionService = new adf_testing_1.ProcessDefinitionsService(apiService);
                    return [4 /*yield*/, processDefinitionService
                            .getProcessDefinitionByName(resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.processes.candidateUserProcess, candidateBaseApp)];
                case 14:
                    processDefinition = _a.sent();
                    processInstancesService = new adf_testing_1.ProcessInstancesService(apiService);
                    return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, settingsPage.setProviderBpmSso(protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.identityHost)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password)];
                case 17:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 5 * 60 * 1000);
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, identityService.deleteIdentityUser(testUser.id)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, this.alfrescoJsApi.logout()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.executeScript('window.sessionStorage.clear();')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.executeScript('window.localStorage.clear();')];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C307032] Should display the appropriate title for the unclaim option of a Task', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesCloudPage()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, appListCloudComponent.checkApsContainer()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, appListCloudComponent.goToApp(candidateBaseApp)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assigneeTask.entry.name)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().selectRow(assigneeTask.entry.name)];
                case 6:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, taskFormCloudComponent.getReleaseButtonText()];
                case 7: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('RELEASE')];
                case 8:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C310142] Empty content is displayed when having a task without form', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesCloudPage()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, appListCloudComponent.checkApsContainer()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, appListCloudComponent.goToApp(candidateBaseApp)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assigneeTask.entry.name)];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().selectRow(assigneeTask.entry.name)];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, taskFormCloudComponent.checkFormIsNotDisplayed()];
                case 7:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, taskFormCloudComponent.getFormTitle()];
                case 8: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe(assigneeTask.entry.name)];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, taskFormCloudComponent.checkFormContentIsEmpty()];
                case 10:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, taskFormCloudComponent.getEmptyFormContentTitle()];
                case 11: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe("No form available")];
                case 12:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, taskFormCloudComponent.getEmptyFormContentSubtitle()];
                case 13: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe("Attach a form that can be viewed later")];
                case 14:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C310199] Should not be able to complete a task when required field is empty or invalid data is added to a field', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesCloudPage()];
                case 1:
                    _j.sent();
                    return [4 /*yield*/, appListCloudComponent.checkApsContainer()];
                case 2:
                    _j.sent();
                    return [4 /*yield*/, appListCloudComponent.goToApp(candidateBaseApp)];
                case 3:
                    _j.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                case 4:
                    _j.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(formValidationsTask.entry.name)];
                case 5:
                    _j.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().selectRow(formValidationsTask.entry.name)];
                case 6:
                    _j.sent();
                    return [4 /*yield*/, taskFormCloudComponent.checkFormIsDisplayed()];
                case 7:
                    _j.sent();
                    return [4 /*yield*/, taskFormCloudComponent.formFields().checkFormIsDisplayed()];
                case 8:
                    _j.sent();
                    return [4 /*yield*/, taskFormCloudComponent.formFields().checkWidgetIsVisible('Text0tma8h')];
                case 9:
                    _j.sent();
                    return [4 /*yield*/, taskFormCloudComponent.formFields().checkWidgetIsVisible('Date0m1moq')];
                case 10:
                    _j.sent();
                    return [4 /*yield*/, taskFormCloudComponent.formFields().checkWidgetIsVisible('Number0klykr')];
                case 11:
                    _j.sent();
                    return [4 /*yield*/, taskFormCloudComponent.formFields().checkWidgetIsVisible('Amount0mtp1h')];
                case 12:
                    _j.sent();
                    _a = expect;
                    return [4 /*yield*/, taskFormCloudComponent.getCompleteButton()];
                case 13: return [4 /*yield*/, (_j.sent()).isEnabled()];
                case 14: return [4 /*yield*/, _a.apply(void 0, [_j.sent()]).toBe(false)];
                case 15:
                    _j.sent();
                    return [4 /*yield*/, widget.textWidget().setValue('Text0tma8h', 'Some random text')];
                case 16:
                    _j.sent();
                    _b = expect;
                    return [4 /*yield*/, taskFormCloudComponent.getCompleteButton()];
                case 17: return [4 /*yield*/, (_j.sent()).isEnabled()];
                case 18: return [4 /*yield*/, _b.apply(void 0, [_j.sent()]).toBe(true)];
                case 19:
                    _j.sent();
                    return [4 /*yield*/, widget.dateWidget().setDateInput('Date0m1moq', 'invalid date')];
                case 20:
                    _j.sent();
                    return [4 /*yield*/, protractor_1.browser.actions().sendKeys(protractor_1.protractor.Key.ENTER).perform()];
                case 21:
                    _j.sent();
                    _c = expect;
                    return [4 /*yield*/, taskFormCloudComponent.getCompleteButton()];
                case 22: return [4 /*yield*/, (_j.sent()).isEnabled()];
                case 23: return [4 /*yield*/, _c.apply(void 0, [_j.sent()]).toBe(false)];
                case 24:
                    _j.sent();
                    return [4 /*yield*/, widget.dateWidget().setDateInput('Date0m1moq', '20-10-2018')];
                case 25:
                    _j.sent();
                    return [4 /*yield*/, protractor_1.browser.actions().sendKeys(protractor_1.protractor.Key.ENTER).perform()];
                case 26:
                    _j.sent();
                    _d = expect;
                    return [4 /*yield*/, taskFormCloudComponent.getCompleteButton()];
                case 27: return [4 /*yield*/, (_j.sent()).isEnabled()];
                case 28: return [4 /*yield*/, _d.apply(void 0, [_j.sent()]).toBe(true)];
                case 29:
                    _j.sent();
                    return [4 /*yield*/, widget.numberWidget().setFieldValue('Number0klykr', 'invalid number')];
                case 30:
                    _j.sent();
                    _e = expect;
                    return [4 /*yield*/, taskFormCloudComponent.getCompleteButton()];
                case 31: return [4 /*yield*/, (_j.sent()).isEnabled()];
                case 32: return [4 /*yield*/, _e.apply(void 0, [_j.sent()]).toBe(false)];
                case 33:
                    _j.sent();
                    return [4 /*yield*/, widget.numberWidget().setFieldValue('Number0klykr', '26')];
                case 34:
                    _j.sent();
                    _f = expect;
                    return [4 /*yield*/, taskFormCloudComponent.getCompleteButton()];
                case 35: return [4 /*yield*/, (_j.sent()).isEnabled()];
                case 36: return [4 /*yield*/, _f.apply(void 0, [_j.sent()]).toBe(true)];
                case 37:
                    _j.sent();
                    return [4 /*yield*/, widget.amountWidget().setFieldValue('Amount0mtp1h', 'invalid amount')];
                case 38:
                    _j.sent();
                    _g = expect;
                    return [4 /*yield*/, taskFormCloudComponent.getCompleteButton()];
                case 39: return [4 /*yield*/, (_j.sent()).isEnabled()];
                case 40: return [4 /*yield*/, _g.apply(void 0, [_j.sent()]).toBe(false)];
                case 41:
                    _j.sent();
                    return [4 /*yield*/, widget.amountWidget().setFieldValue('Amount0mtp1h', '660')];
                case 42:
                    _j.sent();
                    _h = expect;
                    return [4 /*yield*/, taskFormCloudComponent.getCompleteButton()];
                case 43: return [4 /*yield*/, (_j.sent()).isEnabled()];
                case 44: return [4 /*yield*/, _h.apply(void 0, [_j.sent()]).toBe(true)];
                case 45:
                    _j.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Complete task - cloud directive', function () {
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
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307093] Complete button is not displayed when the task is already completed', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.completedTasksFilter().clickTaskFilter()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('Completed Tasks')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().selectRow(completedTaskName)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, taskHeaderCloudPage.checkTaskPropertyListIsDisplayed()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, taskFormCloudComponent.checkCompleteButtonIsNotDisplayed()];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307095] Task can not be completed by owner user', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('My Tasks')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, protractor_1.browser.driver.sleep(1000)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('CREATED')];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(createdTask.entry.name)];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().selectRow(createdTask.entry.name)];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, taskHeaderCloudPage.checkTaskPropertyListIsDisplayed()];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, taskFormCloudComponent.checkCompleteButtonIsNotDisplayed()];
                    case 11:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307110] Task list is displayed after clicking on Cancel button', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('My Tasks')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assigneeTask.entry.name)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().selectRow(assigneeTask.entry.name)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, taskHeaderCloudPage.checkTaskPropertyListIsDisplayed()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, taskFormCloudComponent.clickCancelButton()];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe('My Tasks')];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(assigneeTask.entry.name)];
                    case 10:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307094] Standalone Task can be completed by a user that is owner and assignee', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('My Tasks')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(toBeCompletedTask.entry.name)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().selectRow(toBeCompletedTask.entry.name)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, taskHeaderCloudPage.checkTaskPropertyListIsDisplayed()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, taskFormCloudComponent.checkCompleteButtonIsDisplayed()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, taskFormCloudComponent.clickCompleteButton()];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(toBeCompletedTask.entry.name)];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.completedTasksFilter().clickTaskFilter()];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(toBeCompletedTask.entry.name)];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, taskFormCloudComponent.checkCompleteButtonIsNotDisplayed()];
                    case 12:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307111] Task of a process can be completed by a user that is owner and assignee', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('My Tasks')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTask.entry.name)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().selectRow(completedTask.entry.name)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, taskHeaderCloudPage.checkTaskPropertyListIsDisplayed()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, taskFormCloudComponent.checkCompleteButtonIsDisplayed()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, taskFormCloudComponent.clickCompleteButton()];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(completedTask.entry.name)];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.completedTasksFilter().clickTaskFilter()];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTask.entry.name)];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, taskFormCloudComponent.checkCompleteButtonIsNotDisplayed()];
                    case 12:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=task-form-cloud-component.e2e.js.map