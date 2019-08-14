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
var processServicesPage_1 = require("../pages/adf/process-services/processServicesPage");
var createChecklistDialog_1 = require("../pages/adf/process-services/dialog/createChecklistDialog");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var CONSTANTS = require("../util/constants");
var tenant_1 = require("../models/APS/tenant");
var protractor_1 = require("protractor");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var users_actions_1 = require("../actions/users.actions");
var fs = require("fs");
var path = require("path");
describe('Checklist component', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var processUserModel;
    var app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var taskPage = new tasksPage_1.TasksPage();
    var processServices = new processServicesPage_1.ProcessServicesPage();
    var checklistDialog = new createChecklistDialog_1.ChecklistDialog();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var tasks = ['no checklist created task', 'checklist number task', 'remove running checklist', 'remove completed checklist', 'hierarchy'];
    var checklists = ['cancelCheckList', 'dialogChecklist', 'addFirstChecklist', 'addSecondChecklist'];
    var removeChecklist = ['removeFirstRunningChecklist', 'removeSecondRunningChecklist', 'removeFirstCompletedChecklist', 'removeSecondCompletedChecklist'];
    var hierarchyChecklist = ['checklistOne', 'checklistTwo', 'checklistOneChild', 'checklistTwoChild'];
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var users, newTenant, pathFile, file, i;
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
                    processUserModel = _a.sent();
                    pathFile = path.join(protractor_1.browser.params.testConfig.main.rootPath + app.file_location);
                    file = fs.createReadStream(pathFile);
                    return [4 /*yield*/, this.alfrescoJsApi.login(processUserModel.email, processUserModel.password)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.appsApi.importAppDefinition(file)];
                case 5:
                    _a.sent();
                    for (i = 0; i < tasks.length; i++) {
                        this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: tasks[i] });
                    }
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(processUserModel)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickHomeButton()];
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
    it('[C279976] Should no checklist be created when no title is typed', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[0])];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[0])];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, taskPage.clickOnAddChecklistButton()];
                case 3: return [4 /*yield*/, (_b.sent()).clickCreateChecklistButton()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, taskPage.checkChecklistDialogIsNotDisplayed()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, taskPage.checkNoChecklistIsDisplayed()];
                case 6:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.getNumberOfChecklists()];
                case 7: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('0')];
                case 8:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279975] Should no checklist be created when clicking on Cancel button on checklist dialog', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[0])];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[0])];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, taskPage.clickOnAddChecklistButton()];
                case 3: return [4 /*yield*/, (_b.sent()).addName(checklists[0])];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, checklistDialog.clickCancelButton()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, taskPage.checkChecklistDialogIsNotDisplayed()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, taskPage.checkNoChecklistIsDisplayed()];
                case 7:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.getNumberOfChecklists()];
                case 8: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('0')];
                case 9:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C261025] Should Checklist dialog be displayed when clicking on add checklist button', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[0])];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[0])];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, taskPage.clickOnAddChecklistButton()];
                case 3: return [4 /*yield*/, (_c.sent())];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, taskPage.checkChecklistDialogIsDisplayed()];
                case 5:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.usingCheckListDialog().getDialogTitle()];
                case 6: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual('New Check')];
                case 7:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, taskPage.usingCheckListDialog().getNameFieldPlaceholder()];
                case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual('Name')];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, taskPage.usingCheckListDialog().checkAddChecklistButtonIsEnabled()];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, checklistDialog.checkCancelButtonIsEnabled()];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, taskPage.usingCheckListDialog().clickCancelButton()];
                case 12:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C261026] Should Checklist number increase when a new checklist is added', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[1])];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[1])];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, taskPage.clickOnAddChecklistButton()];
                case 3: return [4 /*yield*/, (_c.sent()).addName(checklists[2])];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, checklistDialog.clickCreateChecklistButton()];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, taskPage.checkChecklistIsDisplayed(checklists[2])];
                case 6:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.getNumberOfChecklists()];
                case 7: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual('1')];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, taskPage.clickOnAddChecklistButton()];
                case 9: return [4 /*yield*/, (_c.sent()).addName(checklists[3])];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, checklistDialog.clickCreateChecklistButton()];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, taskPage.checkChecklistIsDisplayed(checklists[3])];
                case 12:
                    _c.sent();
                    return [4 /*yield*/, taskPage.checkChecklistIsDisplayed(checklists[2])];
                case 13:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, taskPage.getNumberOfChecklists()];
                case 14: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual('2')];
                case 15:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279980] Should checklist be removed when clicking on remove button', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[2])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[2])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, taskPage.clickOnAddChecklistButton()];
                case 3: return [4 /*yield*/, (_a.sent())];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, taskPage.checkChecklistDialogIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, checklistDialog.addName(removeChecklist[0])];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, checklistDialog.clickCreateChecklistButton()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, taskPage.checkChecklistIsDisplayed(removeChecklist[0])];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, taskPage.clickOnAddChecklistButton()];
                case 9: return [4 /*yield*/, (_a.sent()).addName(removeChecklist[1])];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, checklistDialog.clickCreateChecklistButton()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, taskPage.checkChecklistIsDisplayed(removeChecklist[1])];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, taskPage.removeChecklists(removeChecklist[1])];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, taskPage.checkChecklistIsDisplayed(removeChecklist[0])];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, taskPage.checkChecklistIsNotDisplayed(removeChecklist[1])];
                case 15:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C261027] Should not be able to remove a completed Checklist when clicking on remove button', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[3])];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[3])];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, taskPage.clickOnAddChecklistButton()];
                case 3: return [4 /*yield*/, (_b.sent()).addName(removeChecklist[2])];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, checklistDialog.clickCreateChecklistButton()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, taskPage.checkChecklistIsDisplayed(removeChecklist[2])];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, taskPage.clickOnAddChecklistButton()];
                case 7: return [4 /*yield*/, (_b.sent()).addName(removeChecklist[3])];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, checklistDialog.clickCreateChecklistButton()];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, taskPage.checkChecklistIsDisplayed(removeChecklist[3])];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(removeChecklist[3])];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, taskPage.completeTaskNoForm()];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsNotDisplayed(removeChecklist[3])];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[3])];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, taskPage.checkChecklistIsDisplayed(removeChecklist[2])];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, taskPage.checkChecklistIsDisplayed(removeChecklist[3])];
                case 16:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.getNumberOfChecklists()];
                case 17: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('2')];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, taskPage.checkChecklistsRemoveButtonIsNotDisplayed(removeChecklist[3])];
                case 19:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C261028] Should all checklists of a task be completed when the task is completed', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[4])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[4])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, taskPage.clickOnAddChecklistButton()];
                case 3: return [4 /*yield*/, (_a.sent()).addName(hierarchyChecklist[0])];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, checklistDialog.clickCreateChecklistButton()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, taskPage.clickOnAddChecklistButton()];
                case 6: return [4 /*yield*/, (_a.sent()).addName(hierarchyChecklist[1])];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, checklistDialog.clickCreateChecklistButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(hierarchyChecklist[0])];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, taskPage.clickOnAddChecklistButton()];
                case 10: return [4 /*yield*/, (_a.sent()).addName(hierarchyChecklist[2])];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, checklistDialog.clickCreateChecklistButton()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, taskPage.checkChecklistIsDisplayed(hierarchyChecklist[2])];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(hierarchyChecklist[1])];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, taskPage.clickOnAddChecklistButton()];
                case 15: return [4 /*yield*/, (_a.sent()).addName(hierarchyChecklist[3])];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, checklistDialog.clickCreateChecklistButton()];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, taskPage.checkChecklistIsDisplayed(hierarchyChecklist[3])];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[4])];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, taskPage.completeTaskNoForm()];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS)];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[4])];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(hierarchyChecklist[0])];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(hierarchyChecklist[1])];
                case 24:
                    _a.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(hierarchyChecklist[2])];
                case 25:
                    _a.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(hierarchyChecklist[3])];
                case 26:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=checklist-component.e2e.js.map