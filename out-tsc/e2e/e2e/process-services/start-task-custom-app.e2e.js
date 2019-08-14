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
var tasksPage_1 = require("../pages/adf/process-services/tasksPage");
var attachmentListPage_1 = require("../pages/adf/process-services/attachmentListPage");
var processServiceTabBarPage_1 = require("../pages/adf/process-services/processServiceTabBarPage");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var tenant_1 = require("../models/APS/tenant");
var fileModel_1 = require("../models/ACS/fileModel");
var protractor_2 = require("protractor");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var apps_actions_1 = require("../actions/APS/apps.actions");
var users_actions_1 = require("../actions/users.actions");
var CONSTANTS = require("../util/constants");
describe('Start Task - Custom App', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var attachmentListPage = new attachmentListPage_1.AttachmentListPage();
    var processServiceTabBarPage = new processServiceTabBarPage_1.ProcessServiceTabBarPage();
    var processUserModel, assigneeUserModel;
    var app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var formTextField = app.form_fields.form_fieldId;
    var formFieldValue = 'First value ';
    var taskPage = new tasksPage_1.TasksPage();
    var firstComment = 'comm1', firstChecklist = 'checklist1';
    var tasks = ['Modifying task', 'Information box', 'No form', 'Not Created', 'Refreshing form', 'Assignee task', 'Attach File', 'Spinner'];
    var showHeaderTask = 'Show Header';
    var appModel;
    var pngFile = new fileModel_1.FileModel({
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location,
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name
    });
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var apps, users, newTenant;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apps = new apps_actions_1.AppsActions();
                    users = new users_actions_1.UsersActions();
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'BPM',
                        hostBpm: protractor_2.browser.params.testConfig.adf_aps.host
                    });
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_2.browser.params.testConfig.adf.adminEmail, protractor_2.browser.params.testConfig.adf.adminPassword)];
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
                    processUserModel = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(processUserModel.email, processUserModel.password)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location)];
                case 6:
                    appModel = _a.sent();
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(processUserModel)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C263942] Should be possible to modify a task', function () { return __awaiter(_this, void 0, void 0, function () {
        var task, taskDetails, _a, checklistDialog;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_b.sent()).goToApp(appModel.name)];
                case 2: return [4 /*yield*/, (_b.sent()).clickTasksButton()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, taskPage.createNewTask()];
                case 5:
                    task = _b.sent();
                    return [4 /*yield*/, task.addName(tasks[0])];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, task.addForm(app.formName)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, task.clickStartButton()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, taskPage
                            .tasksListPage()
                            .checkContentIsDisplayed(tasks[0])];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, taskPage.taskDetails()];
                case 10:
                    taskDetails = _b.sent();
                    return [4 /*yield*/, taskDetails.clickInvolvePeopleButton()];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, taskDetails.typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, taskDetails.selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, taskDetails.checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, taskDetails.clickAddInvolvedUserButton()];
                case 15:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 16: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(assigneeUserModel.email)];
                case 17:
                    _b.sent();
                    return [4 /*yield*/, taskDetails.selectActivityTab()];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, taskDetails.addComment(firstComment)];
                case 19:
                    _b.sent();
                    return [4 /*yield*/, taskDetails.checkCommentIsDisplayed(firstComment)];
                case 20:
                    _b.sent();
                    return [4 /*yield*/, taskPage.clickOnAddChecklistButton()];
                case 21:
                    checklistDialog = _b.sent();
                    return [4 /*yield*/, checklistDialog.addName(firstChecklist)];
                case 22:
                    _b.sent();
                    return [4 /*yield*/, checklistDialog.clickCreateChecklistButton()];
                case 23:
                    _b.sent();
                    return [4 /*yield*/, taskPage
                            .checkChecklistIsDisplayed(firstChecklist)];
                case 24:
                    _b.sent();
                    return [4 /*yield*/, taskPage
                            .taskDetails()
                            .selectDetailsTab()];
                case 25:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C263947] Should be able to start a task without form', function () { return __awaiter(_this, void 0, void 0, function () {
        var task, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_b.sent()).goToApp(appModel.name)];
                case 2: return [4 /*yield*/, (_b.sent()).clickTasksButton()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, taskPage
                            .filtersPage()
                            .goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, taskPage.createNewTask()];
                case 6:
                    task = _b.sent();
                    return [4 /*yield*/, task.addName(tasks[2])];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, task.clickStartButton()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, taskPage
                            .tasksListPage()
                            .checkContentIsDisplayed(tasks[2])];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, taskPage
                            .formFields()
                            .noFormIsDisplayed()];
                case 10:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getFormName()];
                case 11: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_FORM)];
                case 12:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C263948] Should be possible to cancel a task', function () { return __awaiter(_this, void 0, void 0, function () {
        var task, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_b.sent()).goToApp(appModel.name)];
                case 2: return [4 /*yield*/, (_b.sent()).clickTasksButton()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, taskPage.createNewTask()];
                case 5:
                    task = _b.sent();
                    return [4 /*yield*/, task.addName(tasks[3])];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, task.checkStartButtonIsEnabled()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, task.clickCancelButton()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsNotDisplayed(tasks[3])];
                case 9:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.filtersPage().getActiveFilter()];
                case 10: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 11:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C263949] Should be possible to save filled form', function () { return __awaiter(_this, void 0, void 0, function () {
        var task;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_a.sent()).goToApp(appModel.name)];
                case 2: return [4 /*yield*/, (_a.sent()).clickTasksButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, taskPage.filtersPage()
                            .goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, taskPage.createNewTask()];
                case 5:
                    task = _a.sent();
                    return [4 /*yield*/, task.addForm(app.formName)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, task.addName(tasks[4])];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, task.clickStartButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, taskPage
                            .tasksListPage()
                            .checkContentIsDisplayed(tasks[4])];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, taskPage.formFields()
                            .setFieldValue(protractor_1.by.id, formTextField, formFieldValue)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, taskPage
                            .formFields()
                            .refreshForm()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, taskPage
                            .formFields().checkFieldValue(protractor_1.by.id, formTextField, '')];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, taskPage
                            .tasksListPage()
                            .checkContentIsDisplayed(tasks[4])];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, taskPage
                            .formFields()
                            .setFieldValue(protractor_1.by.id, formTextField, formFieldValue)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, taskPage.formFields().checkFieldValue(protractor_1.by.id, formTextField, formFieldValue)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, taskPage
                            .formFields()
                            .saveForm()];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, taskPage.formFields().checkFieldValue(protractor_1.by.id, formTextField, formFieldValue)];
                case 17:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C263951] Should be possible to assign a user', function () { return __awaiter(_this, void 0, void 0, function () {
        var task, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_b.sent()).goToApp(appModel.name)];
                case 2: return [4 /*yield*/, (_b.sent()).clickTasksButton()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, taskPage.createNewTask()];
                case 5:
                    task = _b.sent();
                    return [4 /*yield*/, task.addName(tasks[5])];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, task.addAssignee(assigneeUserModel.firstName)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, task.clickStartButton()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, taskPage
                            .tasksListPage()
                            .checkTaskListIsLoaded()];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, taskPage
                            .tasksListPage()
                            .getDataTable().waitForTableBody()];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, taskPage.filtersPage()
                            .goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS)];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, taskPage.tasksListPage()
                            .checkContentIsDisplayed(tasks[5])];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[5])];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, taskPage.checkTaskTitle(tasks[5])];
                case 14:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getAssignee()];
                case 15: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)];
                case 16:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Attach a file', function () { return __awaiter(_this, void 0, void 0, function () {
        var task;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_a.sent()).goToApp(appModel.name)];
                case 2: return [4 /*yield*/, (_a.sent()).clickTasksButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, taskPage.createNewTask()];
                case 5:
                    task = _a.sent();
                    return [4 /*yield*/, task.addName(tasks[6])];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, task.clickStartButton()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, attachmentListPage.clickAttachFileButton(pngFile.location)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, attachmentListPage.checkFileIsAttached(pngFile.name)];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C263945] Should Information box be hidden when showHeaderContent property is set on false on custom app', function () { return __awaiter(_this, void 0, void 0, function () {
        var task;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_a.sent()).goToApp(appModel.name)];
                case 2: return [4 /*yield*/, (_a.sent()).clickTasksButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, taskPage.createNewTask()];
                case 5:
                    task = _a.sent();
                    return [4 /*yield*/, task.addName(showHeaderTask)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, task.clickStartButton()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(showHeaderTask)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, processServiceTabBarPage.clickSettingsButton()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, taskPage.taskDetails().appSettingsToggles().disableShowHeader()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, processServiceTabBarPage.clickTasksButton()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, taskPage.taskDetails().taskInfoDrawerIsNotDisplayed()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, processServiceTabBarPage.clickSettingsButton()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, taskPage.taskDetails().appSettingsToggles().enableShowHeader()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, processServiceTabBarPage.clickTasksButton()];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, taskPage.taskDetails().taskInfoDrawerIsDisplayed()];
                case 16:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=start-task-custom-app.e2e.js.map