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
var commentsPage_1 = require("../pages/adf/commentsPage");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var CONSTANTS = require("../util/constants");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var users_actions_1 = require("../actions/users.actions");
var apps_actions_1 = require("../actions/APS/apps.actions");
describe('Comment component for Processes', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var taskPage = new tasksPage_1.TasksPage();
    var commentsPage = new commentsPage_1.CommentsPage();
    var app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var user, tenantId, appId, secondUser, newTaskId;
    var taskName = {
        completed_task: 'Test Completed',
        multiple_users: 'Test Comment multiple users'
    };
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var apps, users, importedApp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'BPM',
                        hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                    });
                    apps = new apps_actions_1.AppsActions();
                    users = new users_actions_1.UsersActions();
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, users.createTenantAndUser(this.alfrescoJsApi)];
                case 2:
                    user = _a.sent();
                    tenantId = user.tenantId;
                    return [4 /*yield*/, users.createApsUser(this.alfrescoJsApi, tenantId)];
                case 3:
                    secondUser = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(user.email, user.password)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location)];
                case 5:
                    importedApp = _a.sent();
                    appId = importedApp.id;
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(user)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260237] Should not be able to add a comment on a completed task', function () { return __awaiter(_this, void 0, void 0, function () {
        var newTask, taskId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: taskName.completed_task })];
                case 1:
                    newTask = _a.sent();
                    taskId = newTask.id;
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskActionsApi.completeTask(taskId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 3: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 4: return [4 /*yield*/, (_a.sent()).clickTasksButton()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(taskName.completed_task)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, commentsPage.checkCommentInputIsNotDisplayed()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C212864] Should be able to add multiple comments on a single task using different users', function () { return __awaiter(_this, void 0, void 0, function () {
        var newTask, taskComment, secondTaskComment, totalCommentsLatest, thirdTaskComment, _a, _b, _c, _d, _e, _f, _g, totalComments, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: taskName.multiple_users })];
                case 1:
                    newTask = _t.sent();
                    newTaskId = newTask.id;
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.involveUser(newTaskId, { email: secondUser.email })];
                case 2:
                    _t.sent();
                    taskComment = { message: 'Task Comment' };
                    secondTaskComment = { message: 'Second Task Comment' };
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.addTaskComment(taskComment, newTaskId)];
                case 3:
                    _t.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.addTaskComment(secondTaskComment, newTaskId)];
                case 4:
                    _t.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 5: return [4 /*yield*/, (_t.sent()).goToTaskApp()];
                case 6: return [4 /*yield*/, (_t.sent()).clickTasksButton()];
                case 7:
                    _t.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 8:
                    _t.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(taskName.multiple_users)];
                case 9:
                    _t.sent();
                    return [4 /*yield*/, taskPage.taskDetails().selectActivityTab()];
                case 10:
                    _t.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.getTaskComments(newTaskId, { 'latestFirst': true })];
                case 11:
                    totalCommentsLatest = _t.sent();
                    thirdTaskComment = { message: 'Third Task Comment' };
                    return [4 /*yield*/, commentsPage.checkUserIconIsDisplayed(0)];
                case 12:
                    _t.sent();
                    return [4 /*yield*/, commentsPage.checkUserIconIsDisplayed(1)];
                case 13:
                    _t.sent();
                    _a = expect;
                    return [4 /*yield*/, commentsPage.getTotalNumberOfComments()];
                case 14: return [4 /*yield*/, _a.apply(void 0, [_t.sent()]).toEqual('Comments (' + totalCommentsLatest.total + ')')];
                case 15:
                    _t.sent();
                    _b = expect;
                    return [4 /*yield*/, commentsPage.getMessage(0)];
                case 16: return [4 /*yield*/, _b.apply(void 0, [_t.sent()]).toEqual(totalCommentsLatest.data[0].message)];
                case 17:
                    _t.sent();
                    _c = expect;
                    return [4 /*yield*/, commentsPage.getMessage(1)];
                case 18: return [4 /*yield*/, _c.apply(void 0, [_t.sent()]).toEqual(totalCommentsLatest.data[1].message)];
                case 19:
                    _t.sent();
                    _d = expect;
                    return [4 /*yield*/, commentsPage.getUserName(0)];
                case 20: return [4 /*yield*/, _d.apply(void 0, [_t.sent()]).toEqual(totalCommentsLatest.data[0].createdBy.firstName + ' ' + totalCommentsLatest.data[0].createdBy.lastName)];
                case 21:
                    _t.sent();
                    _e = expect;
                    return [4 /*yield*/, commentsPage.getUserName(1)];
                case 22: return [4 /*yield*/, _e.apply(void 0, [_t.sent()]).toEqual(totalCommentsLatest.data[1].createdBy.firstName + ' ' + totalCommentsLatest.data[1].createdBy.lastName)];
                case 23:
                    _t.sent();
                    _f = expect;
                    return [4 /*yield*/, commentsPage.getTime(0)];
                case 24: return [4 /*yield*/, _f.apply(void 0, [_t.sent()]).toMatch(/(ago|few)/)];
                case 25:
                    _t.sent();
                    _g = expect;
                    return [4 /*yield*/, commentsPage.getTime(1)];
                case 26: return [4 /*yield*/, _g.apply(void 0, [_t.sent()]).toMatch(/(ago|few)/)];
                case 27:
                    _t.sent();
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(secondUser)];
                case 28:
                    _t.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.addTaskComment(thirdTaskComment, newTaskId)];
                case 29:
                    _t.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 30: return [4 /*yield*/, (_t.sent()).goToTaskApp()];
                case 31: return [4 /*yield*/, (_t.sent()).clickTasksButton()];
                case 32:
                    _t.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS)];
                case 33:
                    _t.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().selectRow(taskName.multiple_users)];
                case 34:
                    _t.sent();
                    return [4 /*yield*/, taskPage.taskDetails().selectActivityTab()];
                case 35:
                    _t.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.getTaskComments(newTaskId, { 'latestFirst': true })];
                case 36:
                    totalComments = _t.sent();
                    return [4 /*yield*/, commentsPage.checkUserIconIsDisplayed(0)];
                case 37:
                    _t.sent();
                    return [4 /*yield*/, commentsPage.checkUserIconIsDisplayed(1)];
                case 38:
                    _t.sent();
                    return [4 /*yield*/, commentsPage.checkUserIconIsDisplayed(2)];
                case 39:
                    _t.sent();
                    _h = expect;
                    return [4 /*yield*/, commentsPage.getTotalNumberOfComments()];
                case 40: return [4 /*yield*/, _h.apply(void 0, [_t.sent()]).toEqual('Comments (' + totalComments.total + ')')];
                case 41:
                    _t.sent();
                    _j = expect;
                    return [4 /*yield*/, commentsPage.getMessage(0)];
                case 42: return [4 /*yield*/, _j.apply(void 0, [_t.sent()]).toEqual(totalComments.data[0].message)];
                case 43:
                    _t.sent();
                    _k = expect;
                    return [4 /*yield*/, commentsPage.getMessage(1)];
                case 44: return [4 /*yield*/, _k.apply(void 0, [_t.sent()]).toEqual(totalComments.data[1].message)];
                case 45:
                    _t.sent();
                    _l = expect;
                    return [4 /*yield*/, commentsPage.getMessage(2)];
                case 46: return [4 /*yield*/, _l.apply(void 0, [_t.sent()]).toEqual(totalComments.data[2].message)];
                case 47:
                    _t.sent();
                    _m = expect;
                    return [4 /*yield*/, commentsPage.getUserName(0)];
                case 48: return [4 /*yield*/, _m.apply(void 0, [_t.sent()]).toEqual(totalComments.data[0].createdBy.firstName + ' ' + totalComments.data[0].createdBy.lastName)];
                case 49:
                    _t.sent();
                    _o = expect;
                    return [4 /*yield*/, commentsPage.getUserName(1)];
                case 50: return [4 /*yield*/, _o.apply(void 0, [_t.sent()]).toEqual(totalComments.data[1].createdBy.firstName + ' ' + totalComments.data[1].createdBy.lastName)];
                case 51:
                    _t.sent();
                    _p = expect;
                    return [4 /*yield*/, commentsPage.getUserName(2)];
                case 52: return [4 /*yield*/, _p.apply(void 0, [_t.sent()]).toEqual(totalComments.data[2].createdBy.firstName + ' ' + totalComments.data[2].createdBy.lastName)];
                case 53:
                    _t.sent();
                    _q = expect;
                    return [4 /*yield*/, commentsPage.getTime(0)];
                case 54: return [4 /*yield*/, _q.apply(void 0, [_t.sent()]).toMatch(/(ago|few)/)];
                case 55:
                    _t.sent();
                    _r = expect;
                    return [4 /*yield*/, commentsPage.getTime(1)];
                case 56: return [4 /*yield*/, _r.apply(void 0, [_t.sent()]).toMatch(/(ago|few)/)];
                case 57:
                    _t.sent();
                    _s = expect;
                    return [4 /*yield*/, commentsPage.getTime(2)];
                case 58: return [4 /*yield*/, _s.apply(void 0, [_t.sent()]).toMatch(/(ago|few)/)];
                case 59:
                    _t.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=comment-component-tasks.e2e.js.map