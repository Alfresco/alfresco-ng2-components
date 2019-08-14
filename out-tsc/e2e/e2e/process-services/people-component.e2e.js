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
var tasksPage_1 = require("../pages/adf/process-services/tasksPage");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var processServicesPage_1 = require("../pages/adf/process-services/processServicesPage");
var CONSTANTS = require("../util/constants");
var tenant_1 = require("../models/APS/tenant");
var protractor_1 = require("protractor");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var users_actions_1 = require("../actions/users.actions");
var fs = require("fs");
var path = require("path");
describe('People component', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var processUserModel, assigneeUserModel, secondAssigneeUserModel;
    var app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var taskPage = new tasksPage_1.TasksPage();
    var peopleTitle = 'People this task is shared with ';
    var processServices = new processServicesPage_1.ProcessServicesPage();
    var tasks = ['no people involved task', 'remove people task', 'can not complete task', 'multiple users', 'completed filter'];
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var users, newTenant, pathFile, file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    users = new users_actions_1.UsersActions();
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'BPM',
                        hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                    });
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new tenant_1.Tenant())];
                case 2:
                    newTenant = _a.sent();
                    return [4 /*yield*/, users.createApsUser(this.alfrescoJsApi, newTenant.id)];
                case 3:
                    assigneeUserModel = _a.sent();
                    return [4 /*yield*/, users.createApsUser(this.alfrescoJsApi, newTenant.id)];
                case 4:
                    secondAssigneeUserModel = _a.sent();
                    return [4 /*yield*/, users.createApsUser(this.alfrescoJsApi, newTenant.id)];
                case 5:
                    processUserModel = _a.sent();
                    pathFile = path.join(protractor_1.browser.params.testConfig.main.rootPath + app.file_location);
                    file = fs.createReadStream(pathFile);
                    return [4 /*yield*/, this.alfrescoJsApi.login(processUserModel.email, processUserModel.password)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.appsApi.importAppDefinition(file)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: tasks[0] })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: tasks[1] })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: tasks[2] })];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: tasks[3] })];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: tasks[4] })];
                case 12:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(processUserModel)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processServices.goToTaskApp()];
                case 3: return [4 /*yield*/, (_a.sent()).clickTasksButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279989] Should no people be involved when no user is typed', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[0])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[0])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, taskPage.taskDetails().clickInvolvePeopleButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, taskPage.taskDetails().clickAddInvolvedUserButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, taskPage.taskDetails().checkNoPeopleIsInvolved()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279990] Should no people be involved when clicking on Cancel button', function () { return __awaiter(_this, void 0, void 0, function () {
        var taskDetails;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[0])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[0])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, taskPage.taskDetails()];
                case 3:
                    taskDetails = _a.sent();
                    return [4 /*yield*/, taskDetails.clickInvolvePeopleButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, taskDetails.typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, taskDetails.selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, taskDetails.checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, taskPage.taskDetails().clickCancelInvolvePeopleButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, taskPage.taskDetails().checkNoPeopleIsInvolved()];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C261029] Should People dialog be displayed when clicking on add people button', function () { return __awaiter(_this, void 0, void 0, function () {
        var taskDetails, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[0])];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[0])];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, taskPage.taskDetails()];
                case 3:
                    taskDetails = _c.sent();
                    return [4 /*yield*/, taskDetails.clickInvolvePeopleButton()];
                case 4:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getInvolvePeopleHeader()];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual('Add people and groups')];
                case 6:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getInvolvePeoplePlaceholder()];
                case 7: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual('Search user')];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, taskDetails.checkAddPeopleButtonIsEnabled()];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, taskDetails.checkCancelButtonIsEnabled()];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, taskDetails.clickCancelInvolvePeopleButton()];
                case 11:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279991] Should not be able to involve a user when is the creator of the task', function () { return __awaiter(_this, void 0, void 0, function () {
        var taskDetails;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[0])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[0])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, taskPage.taskDetails()];
                case 3:
                    taskDetails = _a.sent();
                    return [4 /*yield*/, taskDetails.clickInvolvePeopleButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, taskDetails.typeUser(processUserModel.firstName + ' ' + processUserModel.lastName)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, taskDetails.noUserIsDisplayedInSearchInvolvePeople(processUserModel.firstName + ' ' + processUserModel.lastName)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, taskPage.taskDetails().clickAddInvolvedUserButton()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, taskPage.taskDetails().checkNoPeopleIsInvolved()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C261030] Should involved user be removed when clicking on remove button', function () { return __awaiter(_this, void 0, void 0, function () {
        var taskDetails, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[0])];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[0])];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, taskPage.taskDetails()];
                case 3:
                    taskDetails = _b.sent();
                    return [4 /*yield*/, taskDetails.clickInvolvePeopleButton()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, taskDetails.typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, taskDetails.selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, taskDetails.checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, taskPage.taskDetails().clickAddInvolvedUserButton()];
                case 8:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 9: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])
                        .toEqual(assigneeUserModel.email)];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, taskPage.taskDetails().removeInvolvedUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, taskPage.taskDetails().checkNoPeopleIsInvolved()];
                case 12:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280013] Should not be able to complete a task by a involved user', function () { return __awaiter(_this, void 0, void 0, function () {
        var taskDetails, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[1])];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[1])];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, taskPage.taskDetails()];
                case 3:
                    taskDetails = _b.sent();
                    return [4 /*yield*/, taskDetails.clickInvolvePeopleButton()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, taskDetails.typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, taskDetails.selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, taskDetails.checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, taskPage.taskDetails().clickAddInvolvedUserButton()];
                case 8:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 9: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])
                        .toEqual(assigneeUserModel.email)];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(assigneeUserModel)];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 12: return [4 /*yield*/, (_b.sent()).goToTaskApp()];
                case 13: return [4 /*yield*/, (_b.sent()).clickTasksButton()];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS)];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[1])];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[1])];
                case 17:
                    _b.sent();
                    return [4 /*yield*/, taskPage.completeTaskNoFormNotDisplayed()];
                case 18:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C261031] Should be able to involve multiple users to a task', function () { return __awaiter(_this, void 0, void 0, function () {
        var taskDetails, _a, _b, taskDetails2, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[2])];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[2])];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, taskPage.taskDetails()];
                case 3:
                    taskDetails = _e.sent();
                    return [4 /*yield*/, taskPage.taskDetails().clickInvolvePeopleButton()];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, taskDetails.typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, taskDetails.selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, taskDetails.checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, taskPage.taskDetails().clickAddInvolvedUserButton()];
                case 8:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 9: return [4 /*yield*/, _a.apply(void 0, [_e.sent()])
                        .toEqual(assigneeUserModel.email)];
                case 10:
                    _e.sent();
                    _b = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getInvolvedPeopleTitle()];
                case 11: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toEqual(peopleTitle + '(1)')];
                case 12:
                    _e.sent();
                    return [4 /*yield*/, taskPage.taskDetails()];
                case 13:
                    taskDetails2 = _e.sent();
                    return [4 /*yield*/, taskDetails2.clickInvolvePeopleButton()];
                case 14:
                    _e.sent();
                    return [4 /*yield*/, taskDetails2.typeUser(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName)];
                case 15:
                    _e.sent();
                    return [4 /*yield*/, taskDetails2.selectUserToInvolve(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName)];
                case 16:
                    _e.sent();
                    return [4 /*yield*/, taskDetails2.checkUserIsSelected(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName)];
                case 17:
                    _e.sent();
                    return [4 /*yield*/, taskPage.taskDetails().clickAddInvolvedUserButton()];
                case 18:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getInvolvedUserEmail(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName)];
                case 19: return [4 /*yield*/, _c.apply(void 0, [_e.sent()])
                        .toEqual(secondAssigneeUserModel.email)];
                case 20:
                    _e.sent();
                    _d = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getInvolvedPeopleTitle()];
                case 21: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toEqual(peopleTitle + '(2)')];
                case 22:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280014] Should involved user see the task in completed filters when the task is completed', function () { return __awaiter(_this, void 0, void 0, function () {
        var taskDetails, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[3])];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[3])];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, taskPage.taskDetails()];
                case 3:
                    taskDetails = _c.sent();
                    return [4 /*yield*/, taskDetails.clickInvolvePeopleButton()];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, taskDetails.typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, taskDetails.selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, taskDetails.checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, taskPage.taskDetails().clickAddInvolvedUserButton()];
                case 8:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 9: return [4 /*yield*/, _a.apply(void 0, [_c.sent()])
                        .toEqual(assigneeUserModel.email)];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, taskPage.completeTaskNoForm()];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS)];
                case 12:
                    _c.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[3])];
                case 13:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 14: return [4 /*yield*/, _b.apply(void 0, [_c.sent()])
                        .toEqual(assigneeUserModel.email)];
                case 15:
                    _c.sent();
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(assigneeUserModel)];
                case 16:
                    _c.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 17: return [4 /*yield*/, (_c.sent()).goToTaskApp()];
                case 18: return [4 /*yield*/, (_c.sent()).clickTasksButton()];
                case 19:
                    _c.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS)];
                case 20:
                    _c.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[3])];
                case 21:
                    _c.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[3])];
                case 22:
                    _c.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS)];
                case 23:
                    _c.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsNotDisplayed(tasks[3])];
                case 24:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=people-component.e2e.js.map