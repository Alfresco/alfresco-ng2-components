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
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var CONSTANTS = require("../util/constants");
var tenant_1 = require("../models/APS/tenant");
var Task = require("../models/APS/Task");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var users_actions_1 = require("../actions/users.actions");
var fs = require("fs");
var path = require("path");
describe('Start Task - Task App', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var processUserModel;
    var app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var taskPage = new tasksPage_1.TasksPage();
    var tasks = ['Standalone task', 'Completed standalone task', 'Add a form', 'Remove form'];
    var noFormMessage = 'No forms attached';
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
                    processUserModel = _a.sent();
                    pathFile = path.join(protractor_1.browser.params.testConfig.main.rootPath + app.file_location);
                    file = fs.createReadStream(pathFile);
                    return [4 /*yield*/, this.alfrescoJsApi.login(processUserModel.email, processUserModel.password)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.appsApi.importAppDefinition(file)];
                case 5:
                    _a.sent();
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
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 2: return [4 /*yield*/, (_a.sent()).clickTasksButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260421] Should a standalone task be displayed when creating a new task without form', function () { return __awaiter(_this, void 0, void 0, function () {
        var task, taskDetails, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, taskPage.createNewTask()];
                case 1:
                    task = _c.sent();
                    return [4 /*yield*/, task.addName(tasks[0])];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, task.clickStartButton()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[0])];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, taskPage.taskDetails().noFormIsDisplayed()];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, taskPage.taskDetails()];
                case 6:
                    taskDetails = _c.sent();
                    return [4 /*yield*/, taskDetails.checkCompleteTaskButtonIsDisplayed()];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, taskDetails.checkCompleteTaskButtonIsEnabled()];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, taskPage.taskDetails().checkAttachFormButtonIsDisplayed()];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, taskPage.taskDetails().checkAttachFormButtonIsEnabled()];
                case 10:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getFormName()];
                case 11: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_FORM)];
                case 12:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, taskPage.formFields().getNoFormMessage()];
                case 13: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(noFormMessage)];
                case 14:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C268910] Should a standalone task be displayed in completed tasks when completing it', function () { return __awaiter(_this, void 0, void 0, function () {
        var task, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, taskPage.createNewTask()];
                case 1:
                    task = _c.sent();
                    return [4 /*yield*/, task.addName(tasks[1])];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, task.clickStartButton()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[1])];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, taskPage.formFields().noFormIsDisplayed()];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, taskPage.completeTaskNoForm()];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS)];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(tasks[1])];
                case 8:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.formFields().getCompletedTaskNoFormMessage()];
                case 9: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual('Task ' + tasks[1] + ' completed')];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, taskPage.formFields().noFormIsDisplayed()];
                case 11:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getFormName()];
                case 12: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_FORM)];
                case 13:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C268911] Should allow adding a form to a standalone task when clicking on Add form button', function () { return __awaiter(_this, void 0, void 0, function () {
        var task, formFields, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, taskPage.createNewTask()];
                case 1:
                    task = _b.sent();
                    return [4 /*yield*/, task.addName(tasks[2])];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, task.clickStartButton()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[2])];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, taskPage.formFields().noFormIsDisplayed()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, taskPage.formFields()];
                case 6:
                    formFields = _b.sent();
                    return [4 /*yield*/, formFields.clickOnAttachFormButton()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, formFields.selectForm(app.formName)];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, formFields.clickOnAttachFormButton()];
                case 9:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getFormName()];
                case 10: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(app.formName)];
                case 11:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C268912] Should a standalone task be displayed when removing the form from APS', function () { return __awaiter(_this, void 0, void 0, function () {
        var task, _a, listOfTasks, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, taskPage.createNewTask()];
                case 1:
                    task = _d.sent();
                    return [4 /*yield*/, task.addName(tasks[3])];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, task.addForm(app.formName)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, task.clickStartButton()];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[3])];
                case 5:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getFormName()];
                case 6: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toEqual(app.formName)];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }))];
                case 8:
                    listOfTasks = _d.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.removeForm(listOfTasks.data[0].id)];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.refresh()];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(tasks[3])];
                case 11:
                    _d.sent();
                    return [4 /*yield*/, taskPage.checkTaskTitle(tasks[3])];
                case 12:
                    _d.sent();
                    return [4 /*yield*/, taskPage.formFields().noFormIsDisplayed()];
                case 13:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getFormName()];
                case 14: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_FORM)];
                case 15:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, taskPage.formFields().getNoFormMessage()];
                case 16: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toEqual(noFormMessage)];
                case 17:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=standalone-task.e2e.js.map