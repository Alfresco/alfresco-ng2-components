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
var js_api_1 = require("@alfresco/js-api");
var users_actions_1 = require("../actions/users.actions");
var tenant_1 = require("../models/APS/tenant");
var Task = require("../models/APS/Task");
var TaskModel = require("../models/APS/TaskModel");
var FormModel = require("../models/APS/FormModel");
var apps_actions_1 = require("../actions/APS/apps.actions");
var processServicesPage_1 = require("../pages/adf/process-services/processServicesPage");
var resources = require("../util/resources");
var CONSTANTS = require("../util/constants");
var dateFormat = require("dateformat");
var adf_testing_1 = require("@alfresco/adf-testing");
var tasksPage_1 = require("../pages/adf/process-services/tasksPage");
var protractor_1 = require("protractor");
describe('Task Details component', function () {
    var processServices = new processServicesPage_1.ProcessServicesPage();
    var processUserModel, appModel;
    var app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var tasks = ['Modifying task', 'Information box', 'No form', 'Not Created', 'Refreshing form', 'Assignee task', 'Attach File'];
    var TASK_DATE_FORMAT = 'mmm d, yyyy';
    var formModel;
    var apps;
    var loginPage = new adf_testing_1.LoginPage();
    var taskPage = new tasksPage_1.TasksPage();
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var users, newTenant;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    users = new users_actions_1.UsersActions();
                    apps = new apps_actions_1.AppsActions();
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
                    return [4 /*yield*/, this.alfrescoJsApi.login(processUserModel.email, processUserModel.password)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location)];
                case 5:
                    appModel = _a.sent();
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
                case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + '/activiti')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260506] Should display task details for standalone task - Task App', function () { return __awaiter(_this, void 0, void 0, function () {
        var task, _a, allTasks, taskModel, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, taskForm, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, processServices.goToTaskApp()];
                case 1: return [4 /*yield*/, (_p.sent()).clickTasksButton()];
                case 2:
                    _p.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 3:
                    _p.sent();
                    return [4 /*yield*/, taskPage.createNewTask()];
                case 4:
                    task = _p.sent();
                    return [4 /*yield*/, task.addName(tasks[1])];
                case 5:
                    _p.sent();
                    return [4 /*yield*/, task.addDescription('Description')];
                case 6:
                    _p.sent();
                    return [4 /*yield*/, task.addForm(app.formName)];
                case 7:
                    _p.sent();
                    return [4 /*yield*/, task.clickStartButton()];
                case 8:
                    _p.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getTitle()];
                case 9: return [4 /*yield*/, _a.apply(void 0, [_p.sent()]).toEqual('Activities')];
                case 10:
                    _p.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }))];
                case 11:
                    allTasks = _p.sent();
                    taskModel = new TaskModel(allTasks.data[0]);
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName())];
                case 12:
                    _p.sent();
                    _b = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getCreated()];
                case 13: return [4 /*yield*/, _b.apply(void 0, [_p.sent()]).toEqual(dateFormat(taskModel.getCreated(), TASK_DATE_FORMAT))];
                case 14:
                    _p.sent();
                    _c = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getId()];
                case 15: return [4 /*yield*/, _c.apply(void 0, [_p.sent()]).toEqual(taskModel.getId())];
                case 16:
                    _p.sent();
                    _d = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDescription()];
                case 17: return [4 /*yield*/, _d.apply(void 0, [_p.sent()]).toEqual(taskModel.getDescription())];
                case 18:
                    _p.sent();
                    _e = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getAssignee()];
                case 19: return [4 /*yield*/, _e.apply(void 0, [_p.sent()]).toEqual(taskModel.getAssignee().getEntireName())];
                case 20:
                    _p.sent();
                    _f = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getCategory()];
                case 21: return [4 /*yield*/, _f.apply(void 0, [_p.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY)];
                case 22:
                    _p.sent();
                    _g = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDueDate()];
                case 23: return [4 /*yield*/, _g.apply(void 0, [_p.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE)];
                case 24:
                    _p.sent();
                    _h = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getParentName()];
                case 25: return [4 /*yield*/, _h.apply(void 0, [_p.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT)];
                case 26:
                    _p.sent();
                    _j = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getParentTaskId()];
                case 27: return [4 /*yield*/, _j.apply(void 0, [_p.sent()]).toEqual('')];
                case 28:
                    _p.sent();
                    _k = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDuration()];
                case 29: return [4 /*yield*/, _k.apply(void 0, [_p.sent()]).toEqual('')];
                case 30:
                    _p.sent();
                    _l = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getEndDate()];
                case 31: return [4 /*yield*/, _l.apply(void 0, [_p.sent()]).toEqual('')];
                case 32:
                    _p.sent();
                    _m = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getStatus()];
                case 33: return [4 /*yield*/, _m.apply(void 0, [_p.sent()]).toEqual(CONSTANTS.TASK_STATUS.RUNNING)];
                case 34:
                    _p.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskFormsApi.getTaskForm(allTasks.data[0].id)];
                case 35:
                    taskForm = _p.sent();
                    formModel = new FormModel(taskForm);
                    _o = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getFormName()];
                case 36: return [4 /*yield*/, _o.apply(void 0, [_p.sent()]).toEqual(formModel.getName())];
                case 37:
                    _p.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C263946] Should display task details for standalone task - Custom App', function () { return __awaiter(_this, void 0, void 0, function () {
        var task, _a, allTasks, taskModel, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, taskForm, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, processServices.goToTaskApp()];
                case 1: return [4 /*yield*/, (_p.sent()).clickTasksButton()];
                case 2:
                    _p.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 3:
                    _p.sent();
                    return [4 /*yield*/, taskPage.createNewTask()];
                case 4:
                    task = _p.sent();
                    return [4 /*yield*/, task.addName(tasks[1])];
                case 5:
                    _p.sent();
                    return [4 /*yield*/, task.addDescription('Description')];
                case 6:
                    _p.sent();
                    return [4 /*yield*/, task.addForm(app.formName)];
                case 7:
                    _p.sent();
                    return [4 /*yield*/, task.clickStartButton()];
                case 8:
                    _p.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getTitle()];
                case 9: return [4 /*yield*/, _a.apply(void 0, [_p.sent()]).toEqual('Activities')];
                case 10:
                    _p.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }))];
                case 11:
                    allTasks = _p.sent();
                    taskModel = new TaskModel(allTasks.data[0]);
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName())];
                case 12:
                    _p.sent();
                    _b = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getCreated()];
                case 13: return [4 /*yield*/, _b.apply(void 0, [_p.sent()]).toEqual(dateFormat(taskModel.getCreated(), TASK_DATE_FORMAT))];
                case 14:
                    _p.sent();
                    _c = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getId()];
                case 15: return [4 /*yield*/, _c.apply(void 0, [_p.sent()]).toEqual(taskModel.getId())];
                case 16:
                    _p.sent();
                    _d = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDescription()];
                case 17: return [4 /*yield*/, _d.apply(void 0, [_p.sent()]).toEqual(taskModel.getDescription())];
                case 18:
                    _p.sent();
                    _e = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getAssignee()];
                case 19: return [4 /*yield*/, _e.apply(void 0, [_p.sent()]).toEqual(taskModel.getAssignee().getEntireName())];
                case 20:
                    _p.sent();
                    _f = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getCategory()];
                case 21: return [4 /*yield*/, _f.apply(void 0, [_p.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY)];
                case 22:
                    _p.sent();
                    _g = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDueDate()];
                case 23: return [4 /*yield*/, _g.apply(void 0, [_p.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE)];
                case 24:
                    _p.sent();
                    _h = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getParentName()];
                case 25: return [4 /*yield*/, _h.apply(void 0, [_p.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT)];
                case 26:
                    _p.sent();
                    _j = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDuration()];
                case 27: return [4 /*yield*/, _j.apply(void 0, [_p.sent()]).toEqual('')];
                case 28:
                    _p.sent();
                    _k = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getEndDate()];
                case 29: return [4 /*yield*/, _k.apply(void 0, [_p.sent()]).toEqual('')];
                case 30:
                    _p.sent();
                    _l = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getParentTaskId()];
                case 31: return [4 /*yield*/, _l.apply(void 0, [_p.sent()]).toEqual('')];
                case 32:
                    _p.sent();
                    _m = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getStatus()];
                case 33: return [4 /*yield*/, _m.apply(void 0, [_p.sent()]).toEqual(CONSTANTS.TASK_STATUS.RUNNING)];
                case 34:
                    _p.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskFormsApi.getTaskForm(allTasks.data[0].id)];
                case 35:
                    taskForm = _p.sent();
                    formModel = new FormModel(taskForm);
                    _o = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getFormName()];
                case 36: return [4 /*yield*/, _o.apply(void 0, [_p.sent()]).toEqual(formModel.getName())];
                case 37:
                    _p.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286706] Should display task details for task - Task App', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, allTasks, taskModel, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, taskForm, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, appModel)];
                case 1:
                    _p.sent();
                    return [4 /*yield*/, processServices.goToTaskApp()];
                case 2: return [4 /*yield*/, (_p.sent()).clickTasksButton()];
                case 3:
                    _p.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 4:
                    _p.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getTitle()];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_p.sent()]).toEqual('Activities')];
                case 6:
                    _p.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }))];
                case 7:
                    allTasks = _p.sent();
                    taskModel = new TaskModel(allTasks.data[0]);
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName())];
                case 8:
                    _p.sent();
                    _b = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getCreated()];
                case 9: return [4 /*yield*/, _b.apply(void 0, [_p.sent()]).toEqual(dateFormat(taskModel.getCreated(), TASK_DATE_FORMAT))];
                case 10:
                    _p.sent();
                    _c = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getId()];
                case 11: return [4 /*yield*/, _c.apply(void 0, [_p.sent()]).toEqual(taskModel.getId())];
                case 12:
                    _p.sent();
                    _d = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDescription()];
                case 13: return [4 /*yield*/, _d.apply(void 0, [_p.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_DESCRIPTION)];
                case 14:
                    _p.sent();
                    _e = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getAssignee()];
                case 15: return [4 /*yield*/, _e.apply(void 0, [_p.sent()]).toEqual(taskModel.getAssignee().getEntireName())];
                case 16:
                    _p.sent();
                    _f = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getCategory()];
                case 17: return [4 /*yield*/, _f.apply(void 0, [_p.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY)];
                case 18:
                    _p.sent();
                    _g = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDueDate()];
                case 19: return [4 /*yield*/, _g.apply(void 0, [_p.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE)];
                case 20:
                    _p.sent();
                    _h = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getParentName()];
                case 21: return [4 /*yield*/, _h.apply(void 0, [_p.sent()]).toEqual(appModel.definition.models[0].name)];
                case 22:
                    _p.sent();
                    _j = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDuration()];
                case 23: return [4 /*yield*/, _j.apply(void 0, [_p.sent()]).toEqual('')];
                case 24:
                    _p.sent();
                    _k = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getEndDate()];
                case 25: return [4 /*yield*/, _k.apply(void 0, [_p.sent()]).toEqual('')];
                case 26:
                    _p.sent();
                    _l = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getParentTaskId()];
                case 27: return [4 /*yield*/, _l.apply(void 0, [_p.sent()]).toEqual('')];
                case 28:
                    _p.sent();
                    _m = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getStatus()];
                case 29: return [4 /*yield*/, _m.apply(void 0, [_p.sent()]).toEqual(CONSTANTS.TASK_STATUS.RUNNING)];
                case 30:
                    _p.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskFormsApi.getTaskForm(allTasks.data[0].id)];
                case 31:
                    taskForm = _p.sent();
                    formModel = new FormModel(taskForm);
                    _o = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getFormName()];
                case 32: return [4 /*yield*/, _o.apply(void 0, [_p.sent()])
                        .toEqual(formModel.getName() === null ? CONSTANTS.TASK_DETAILS.NO_FORM : formModel.getName())];
                case 33:
                    _p.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286705] Should display task details for task - Custom App', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, allTasks, taskModel, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, taskForm, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, appModel)];
                case 1:
                    _p.sent();
                    return [4 /*yield*/, processServices.goToTaskApp()];
                case 2: return [4 /*yield*/, (_p.sent()).clickTasksButton()];
                case 3:
                    _p.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 4:
                    _p.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getTitle()];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_p.sent()]).toEqual('Activities')];
                case 6:
                    _p.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }))];
                case 7:
                    allTasks = _p.sent();
                    taskModel = new TaskModel(allTasks.data[0]);
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName())];
                case 8:
                    _p.sent();
                    _b = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getCreated()];
                case 9: return [4 /*yield*/, _b.apply(void 0, [_p.sent()]).toEqual(dateFormat(taskModel.getCreated(), TASK_DATE_FORMAT))];
                case 10:
                    _p.sent();
                    _c = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getId()];
                case 11: return [4 /*yield*/, _c.apply(void 0, [_p.sent()]).toEqual(taskModel.getId())];
                case 12:
                    _p.sent();
                    _d = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDescription()];
                case 13: return [4 /*yield*/, _d.apply(void 0, [_p.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_DESCRIPTION)];
                case 14:
                    _p.sent();
                    _e = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getAssignee()];
                case 15: return [4 /*yield*/, _e.apply(void 0, [_p.sent()]).toEqual(taskModel.getAssignee().getEntireName())];
                case 16:
                    _p.sent();
                    _f = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getCategory()];
                case 17: return [4 /*yield*/, _f.apply(void 0, [_p.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY)];
                case 18:
                    _p.sent();
                    _g = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDueDate()];
                case 19: return [4 /*yield*/, _g.apply(void 0, [_p.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE)];
                case 20:
                    _p.sent();
                    _h = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getParentName()];
                case 21: return [4 /*yield*/, _h.apply(void 0, [_p.sent()]).toEqual(appModel.definition.models[0].name)];
                case 22:
                    _p.sent();
                    _j = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDuration()];
                case 23: return [4 /*yield*/, _j.apply(void 0, [_p.sent()]).toEqual('')];
                case 24:
                    _p.sent();
                    _k = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getEndDate()];
                case 25: return [4 /*yield*/, _k.apply(void 0, [_p.sent()]).toEqual('')];
                case 26:
                    _p.sent();
                    _l = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getParentTaskId()];
                case 27: return [4 /*yield*/, _l.apply(void 0, [_p.sent()]).toEqual('')];
                case 28:
                    _p.sent();
                    _m = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getStatus()];
                case 29: return [4 /*yield*/, _m.apply(void 0, [_p.sent()]).toEqual(CONSTANTS.TASK_STATUS.RUNNING)];
                case 30:
                    _p.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskFormsApi.getTaskForm(allTasks.data[0].id)];
                case 31:
                    taskForm = _p.sent();
                    formModel = new FormModel(taskForm);
                    _o = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getFormName()];
                case 32: return [4 /*yield*/, _o.apply(void 0, [_p.sent()])
                        .toEqual(formModel.getName() === null ? CONSTANTS.TASK_DETAILS.NO_FORM : formModel.getName())];
                case 33:
                    _p.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286708] Should display task details for subtask - Task App', function () { return __awaiter(_this, void 0, void 0, function () {
        var taskName, checklistName, dialog, allTasks, taskModel, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    taskName = 'TaskAppSubtask';
                    checklistName = 'TaskAppChecklist';
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.createNewTask({ 'name': taskName })];
                case 1:
                    _m.sent();
                    return [4 /*yield*/, processServices.goToTaskApp()];
                case 2: return [4 /*yield*/, (_m.sent()).clickTasksButton()];
                case 3:
                    _m.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 4:
                    _m.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(taskName)];
                case 5:
                    _m.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(taskName)];
                case 6:
                    _m.sent();
                    return [4 /*yield*/, taskPage.clickOnAddChecklistButton()];
                case 7:
                    dialog = _m.sent();
                    return [4 /*yield*/, dialog.addName(checklistName)];
                case 8:
                    _m.sent();
                    return [4 /*yield*/, dialog.clickCreateChecklistButton()];
                case 9:
                    _m.sent();
                    return [4 /*yield*/, taskPage.checkChecklistIsDisplayed(checklistName)];
                case 10:
                    _m.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(checklistName)];
                case 11:
                    _m.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(checklistName)];
                case 12:
                    _m.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }))];
                case 13:
                    allTasks = _m.sent();
                    taskModel = new TaskModel(allTasks.data[0]);
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName())];
                case 14:
                    _m.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getCreated()];
                case 15: return [4 /*yield*/, _a.apply(void 0, [_m.sent()]).toEqual(dateFormat(taskModel.getCreated(), TASK_DATE_FORMAT))];
                case 16:
                    _m.sent();
                    _b = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getId()];
                case 17: return [4 /*yield*/, _b.apply(void 0, [_m.sent()]).toEqual(taskModel.getId())];
                case 18:
                    _m.sent();
                    _c = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDescription()];
                case 19: return [4 /*yield*/, _c.apply(void 0, [_m.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_DESCRIPTION)];
                case 20:
                    _m.sent();
                    _d = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getAssignee()];
                case 21: return [4 /*yield*/, _d.apply(void 0, [_m.sent()]).toEqual(taskModel.getAssignee().getEntireName())];
                case 22:
                    _m.sent();
                    _e = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getCategory()];
                case 23: return [4 /*yield*/, _e.apply(void 0, [_m.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY)];
                case 24:
                    _m.sent();
                    _f = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDueDate()];
                case 25: return [4 /*yield*/, _f.apply(void 0, [_m.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE)];
                case 26:
                    _m.sent();
                    _g = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getParentName()];
                case 27: return [4 /*yield*/, _g.apply(void 0, [_m.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT)];
                case 28:
                    _m.sent();
                    _h = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDuration()];
                case 29: return [4 /*yield*/, _h.apply(void 0, [_m.sent()]).toEqual('')];
                case 30:
                    _m.sent();
                    _j = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getEndDate()];
                case 31: return [4 /*yield*/, _j.apply(void 0, [_m.sent()]).toEqual('')];
                case 32:
                    _m.sent();
                    _k = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getParentTaskId()];
                case 33: return [4 /*yield*/, _k.apply(void 0, [_m.sent()]).toEqual(taskModel.getParentTaskId())];
                case 34:
                    _m.sent();
                    _l = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getStatus()];
                case 35: return [4 /*yield*/, _l.apply(void 0, [_m.sent()]).toEqual(CONSTANTS.TASK_STATUS.RUNNING)];
                case 36:
                    _m.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286707] Should display task details for subtask - Custom App', function () { return __awaiter(_this, void 0, void 0, function () {
        var checklistName, _a, dialog, allTasks, taskModel, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    checklistName = 'CustomAppChecklist';
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, appModel)];
                case 1:
                    _o.sent();
                    return [4 /*yield*/, processServices.goToTaskApp()];
                case 2: return [4 /*yield*/, (_o.sent()).clickTasksButton()];
                case 3:
                    _o.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 4:
                    _o.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getTitle()];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_o.sent()]).toEqual('Activities')];
                case 6:
                    _o.sent();
                    return [4 /*yield*/, taskPage.clickOnAddChecklistButton()];
                case 7:
                    dialog = _o.sent();
                    return [4 /*yield*/, dialog.addName(checklistName)];
                case 8:
                    _o.sent();
                    return [4 /*yield*/, dialog.clickCreateChecklistButton()];
                case 9:
                    _o.sent();
                    return [4 /*yield*/, taskPage.checkChecklistIsDisplayed(checklistName)];
                case 10:
                    _o.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(checklistName)];
                case 11:
                    _o.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(checklistName)];
                case 12:
                    _o.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }))];
                case 13:
                    allTasks = _o.sent();
                    taskModel = new TaskModel(allTasks.data[0]);
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName())];
                case 14:
                    _o.sent();
                    _b = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getCreated()];
                case 15: return [4 /*yield*/, _b.apply(void 0, [_o.sent()]).toEqual(dateFormat(taskModel.getCreated(), TASK_DATE_FORMAT))];
                case 16:
                    _o.sent();
                    _c = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getId()];
                case 17: return [4 /*yield*/, _c.apply(void 0, [_o.sent()]).toEqual(taskModel.getId())];
                case 18:
                    _o.sent();
                    _d = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDescription()];
                case 19: return [4 /*yield*/, _d.apply(void 0, [_o.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_DESCRIPTION)];
                case 20:
                    _o.sent();
                    _e = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getAssignee()];
                case 21: return [4 /*yield*/, _e.apply(void 0, [_o.sent()]).toEqual(taskModel.getAssignee().getEntireName())];
                case 22:
                    _o.sent();
                    _f = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getCategory()];
                case 23: return [4 /*yield*/, _f.apply(void 0, [_o.sent()]).toEqual(taskModel.getCategory())];
                case 24:
                    _o.sent();
                    _g = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDueDate()];
                case 25: return [4 /*yield*/, _g.apply(void 0, [_o.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE)];
                case 26:
                    _o.sent();
                    _h = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getParentName()];
                case 27: return [4 /*yield*/, _h.apply(void 0, [_o.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT)];
                case 28:
                    _o.sent();
                    _j = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDuration()];
                case 29: return [4 /*yield*/, _j.apply(void 0, [_o.sent()]).toEqual('')];
                case 30:
                    _o.sent();
                    _k = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getEndDate()];
                case 31: return [4 /*yield*/, _k.apply(void 0, [_o.sent()]).toEqual('')];
                case 32:
                    _o.sent();
                    _l = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getParentTaskId()];
                case 33: return [4 /*yield*/, _l.apply(void 0, [_o.sent()]).toEqual(taskModel.getParentTaskId())];
                case 34:
                    _o.sent();
                    _m = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getStatus()];
                case 35: return [4 /*yield*/, _m.apply(void 0, [_o.sent()]).toEqual(CONSTANTS.TASK_STATUS.RUNNING)];
                case 36:
                    _o.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286709] Should display task details for completed task - Task App', function () { return __awaiter(_this, void 0, void 0, function () {
        var taskName, taskId, getTaskResponse, taskModel, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    taskName = 'TaskAppCompleted';
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.createNewTask({ 'name': taskName })];
                case 1:
                    taskId = _r.sent();
                    return [4 /*yield*/, processServices.goToTaskApp()];
                case 2: return [4 /*yield*/, (_r.sent()).clickTasksButton()];
                case 3:
                    _r.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 4:
                    _r.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(taskName)];
                case 5:
                    _r.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(taskName)];
                case 6:
                    _r.sent();
                    return [4 /*yield*/, taskPage.completeTaskNoForm()];
                case 7:
                    _r.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS)];
                case 8:
                    _r.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(taskName)];
                case 9:
                    _r.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.getTask(taskId.id)];
                case 10:
                    getTaskResponse = _r.sent();
                    taskModel = new TaskModel(getTaskResponse);
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(taskModel.getName())];
                case 11:
                    _r.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getCreated()];
                case 12: return [4 /*yield*/, _a.apply(void 0, [_r.sent()]).toEqual(dateFormat(taskModel.getCreated(), TASK_DATE_FORMAT))];
                case 13:
                    _r.sent();
                    _b = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getId()];
                case 14: return [4 /*yield*/, _b.apply(void 0, [_r.sent()]).toEqual(taskModel.getId())];
                case 15:
                    _r.sent();
                    _c = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDescription()];
                case 16: return [4 /*yield*/, _c.apply(void 0, [_r.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_DESCRIPTION)];
                case 17:
                    _r.sent();
                    _d = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getAssignee()];
                case 18: return [4 /*yield*/, _d.apply(void 0, [_r.sent()]).toEqual(taskModel.getAssignee().getEntireName())];
                case 19:
                    _r.sent();
                    _e = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getCategory()];
                case 20: return [4 /*yield*/, _e.apply(void 0, [_r.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_CATEGORY)];
                case 21:
                    _r.sent();
                    _f = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDueDate()];
                case 22: return [4 /*yield*/, _f.apply(void 0, [_r.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_DATE)];
                case 23:
                    _r.sent();
                    _g = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getParentName()];
                case 24: return [4 /*yield*/, _g.apply(void 0, [_r.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT)];
                case 25:
                    _r.sent();
                    _j = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getDuration()];
                case 26:
                    _k = (_h = _j.apply(void 0, [_r.sent()])).toEqual;
                    return [4 /*yield*/, taskPage.taskDetails().getDuration()];
                case 27: return [4 /*yield*/, _k.apply(_h, [_r.sent()])];
                case 28:
                    _r.sent();
                    _m = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getEndDate()];
                case 29:
                    _o = (_l = _m.apply(void 0, [_r.sent()])).toEqual;
                    return [4 /*yield*/, taskPage.taskDetails().getEndDate()];
                case 30: return [4 /*yield*/, _o.apply(_l, [_r.sent()])];
                case 31:
                    _r.sent();
                    _p = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getParentTaskId()];
                case 32: return [4 /*yield*/, _p.apply(void 0, [_r.sent()]).toEqual('')];
                case 33:
                    _r.sent();
                    _q = expect;
                    return [4 /*yield*/, taskPage.taskDetails().getStatus()];
                case 34: return [4 /*yield*/, _q.apply(void 0, [_r.sent()]).toEqual(CONSTANTS.TASK_STATUS.COMPLETED)];
                case 35:
                    _r.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=task-details.e2e.js.map