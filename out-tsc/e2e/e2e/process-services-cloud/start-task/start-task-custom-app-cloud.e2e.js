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
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var tasksCloudDemoPage_1 = require("../../pages/adf/demo-shell/process-services/tasksCloudDemoPage");
var adf_testing_1 = require("@alfresco/adf-testing");
var resources = require("../../util/resources");
describe('Start Task', function () {
    var loginSSOPage = new adf_testing_1.LoginSSOPage();
    var taskHeaderCloudPage = new adf_testing_1.TaskHeaderCloudPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var appListCloudComponent = new adf_testing_1.AppListCloudPage();
    var tasksCloudDemoPage = new tasksCloudDemoPage_1.TasksCloudDemoPage();
    var startTask = new adf_testing_1.StartTasksCloudPage();
    var peopleCloudComponent = new adf_testing_1.PeopleCloudComponentPage();
    var settingsPage = new adf_testing_1.SettingsPage();
    var apiService = new adf_testing_1.ApiService(protractor_1.browser.params.config.oauth2.clientId, protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.providers);
    var standaloneTaskName = adf_testing_1.StringUtil.generateRandomString(5);
    var reassignTaskName = adf_testing_1.StringUtil.generateRandomString(5);
    var unassignedTaskName = adf_testing_1.StringUtil.generateRandomString(5);
    var taskName255Characters = adf_testing_1.StringUtil.generateRandomString(255);
    var taskNameBiggerThen255Characters = adf_testing_1.StringUtil.generateRandomString(256);
    var lengthValidationError = 'Length exceeded, 255 characters max.';
    var requiredError = 'Field required';
    var dateValidationError = 'Date format DD/MM/YYYY';
    var apsUser, testUser, activitiUser, groupInfo;
    var simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
    var identityService;
    var groupIdentityService;
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
                    return [4 /*yield*/, identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.APS_USER, identityService.ROLES.ACTIVITI_USER])];
                case 3:
                    apsUser = _a.sent();
                    return [4 /*yield*/, identityService.createIdentityUser()];
                case 4:
                    activitiUser = _a.sent();
                    return [4 /*yield*/, groupIdentityService.getGroupInfoByGroupName('hr')];
                case 5:
                    groupInfo = _a.sent();
                    return [4 /*yield*/, identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, apiService.login(testUser.email, testUser.password)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, settingsPage.setProviderBpmSso(protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.identityHost)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password)];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var tasksService, tasks, i, taskId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tasksService = new adf_testing_1.TasksService(apiService);
                    tasks = [standaloneTaskName, unassignedTaskName, reassignTaskName];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < tasks.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, tasksService.getTaskId(tasks[i], simpleApp)];
                case 2:
                    taskId = _a.sent();
                    if (!taskId) return [3 /*break*/, 4];
                    return [4 /*yield*/, tasksService.deleteTask(taskId, simpleApp)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5: return [4 /*yield*/, apiService.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, identityService.deleteIdentityUser(activitiUser.idIdentityService)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, identityService.deleteIdentityUser(apsUser.idIdentityService)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, identityService.deleteIdentityUser(testUser.idIdentityService)];
                case 9:
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
                    return [4 /*yield*/, appListCloudComponent.checkAppIsDisplayed(simpleApp)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, appListCloudComponent.goToApp(simpleApp)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C297675] Should create a task unassigned when assignee field is empty in Start Task form', function () { return __awaiter(_this, void 0, void 0, function () {
        var taskId, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, tasksCloudDemoPage.openNewTaskForm()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, startTask.checkFormIsDisplayed()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, peopleCloudComponent.clearAssignee()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, startTask.addName(unassignedTaskName)];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, startTask.clickStartButton()];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent()];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee()];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('CREATED')];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody()];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(unassignedTaskName)];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getIdCellValue(unassignedTaskName)];
                case 12:
                    taskId = _c.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().selectRow(unassignedTaskName)];
                case 13:
                    _c.sent();
                    return [4 /*yield*/, taskHeaderCloudPage.checkTaskPropertyListIsDisplayed()];
                case 14:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getId()];
                case 15: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(taskId)];
                case 16:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getAssignee()];
                case 17: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe('No assignee')];
                case 18:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291956] Should be able to create a new standalone task without assignee', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, tasksCloudDemoPage.openNewTaskForm()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, startTask.checkFormIsDisplayed()];
                case 2:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, peopleCloudComponent.getAssignee()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toContain(testUser.firstName, 'does not contain Admin')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, startTask.addName(unassignedTaskName)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, startTask.clickStartButton()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, startTask.checkStartButtonIsEnabled()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('CREATED')];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee()];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(unassignedTaskName)];
                case 12:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C290166] Should be possible to cancel a task', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, tasksCloudDemoPage.openNewTaskForm()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, startTask.checkFormIsDisplayed()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, startTask.checkStartButtonIsDisabled()];
                case 3:
                    _c.sent();
                    _b = (_a = startTask).blur;
                    return [4 /*yield*/, startTask.name];
                case 4: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, startTask.checkValidationErrorIsDisplayed(requiredError)];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, startTask.addName(standaloneTaskName)];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, startTask.addDescription('descriptions')];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, startTask.addDueDate('12/12/2018')];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, startTask.checkStartButtonIsEnabled()];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, startTask.clickCancelButton()];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(standaloneTaskName)];
                case 12:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C290180] Should be able to create a new standalone task', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tasksCloudDemoPage.openNewTaskForm()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, startTask.checkFormIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, startTask.addName(standaloneTaskName)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, startTask.addDescription('descriptions')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, startTask.addDueDate('12/12/2018')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, startTask.addPriority('50')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, startTask.clickStartButton()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(standaloneTaskName)];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C290181] Should be displayed an error message if task name exceed 255 characters', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, tasksCloudDemoPage.openNewTaskForm()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, startTask.checkFormIsDisplayed()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, startTask.addName(taskName255Characters)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, startTask.checkStartButtonIsEnabled()];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, startTask.addName(taskNameBiggerThen255Characters)];
                case 5:
                    _c.sent();
                    _b = (_a = startTask).blur;
                    return [4 /*yield*/, startTask.name];
                case 6: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, startTask.checkValidationErrorIsDisplayed(lengthValidationError)];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, startTask.checkStartButtonIsDisabled()];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, startTask.clickCancelButton()];
                case 10:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291774] Should be displayed an error message if the date is invalid', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, tasksCloudDemoPage.openNewTaskForm()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, startTask.addDueDate('12/12/2018')];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, startTask.checkStartButtonIsEnabled()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, startTask.addDueDate('invalid date')];
                case 4:
                    _c.sent();
                    _b = (_a = startTask).blur;
                    return [4 /*yield*/, startTask.dueDate];
                case 5: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, startTask.validateDate(dateValidationError)];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, startTask.checkStartButtonIsDisabled()];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, startTask.clickCancelButton()];
                case 9:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C290182] Should be possible to assign the task to another user', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, tasksCloudDemoPage.openNewTaskForm()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, startTask.checkFormIsDisplayed()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, startTask.addName(standaloneTaskName)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, peopleCloudComponent.searchAssigneeAndSelect(activitiUser.firstName + " " + activitiUser.lastName)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, startTask.checkStartButtonIsEnabled()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, startTask.clickStartButton()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                case 7:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                case 8: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('My Tasks')];
                case 9:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291953] Assignee field should display the logged user as default', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, tasksCloudDemoPage.openNewTaskForm()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, startTask.checkFormIsDisplayed()];
                case 2:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, peopleCloudComponent.getAssignee()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toContain(testUser.firstName, 'does not contain Admin')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, startTask.clickCancelButton()];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C305050] Should be able to reassign the removed user when starting a new task', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, tasksCloudDemoPage.openNewTaskForm()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, startTask.checkFormIsDisplayed()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, startTask.addName(reassignTaskName)];
                case 3:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, peopleCloudComponent.getAssignee()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(testUser.firstName + " " + testUser.lastName)];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, peopleCloudComponent.searchAssignee(apsUser.username)];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, peopleCloudComponent.checkUserIsDisplayed(apsUser.firstName + " " + apsUser.lastName)];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, peopleCloudComponent.selectAssigneeFromList(apsUser.firstName + " " + apsUser.lastName)];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, startTask.clickStartButton()];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clickCustomiseFilterHeader()];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().clearAssignee()];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.editTaskFilterCloudComponent().setStatusFilterDropDown('ALL')];
                case 12:
                    _c.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(reassignTaskName)];
                case 13:
                    _c.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().selectRow(reassignTaskName)];
                case 14:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getAssignee()];
                case 15: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(apsUser.username)];
                case 16:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=start-task-custom-app-cloud.e2e.js.map