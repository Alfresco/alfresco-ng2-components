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
var processFiltersPage_1 = require("../pages/adf/process-services/processFiltersPage");
var commentsPage_1 = require("../pages/adf/commentsPage");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var users_actions_1 = require("../actions/users.actions");
var apps_actions_1 = require("../actions/APS/apps.actions");
describe('Comment component for Processes', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var processFiltersPage = new processFiltersPage_1.ProcessFiltersPage();
    var commentsPage = new commentsPage_1.CommentsPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var user, tenantId, appId, processInstanceId, addedComment;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var apps, users, importedApp, processWithComment;
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
                    return [4 /*yield*/, this.alfrescoJsApi.login(user.email, user.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location)];
                case 4:
                    importedApp = _a.sent();
                    appId = importedApp.id;
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', 'Comment APS')];
                case 5:
                    processWithComment = _a.sent();
                    processInstanceId = processWithComment.id;
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
    it('[C260464] Should be able to add a comment on APS and check on ADF', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.commentsApi.addProcessInstanceComment({ message: 'HELLO' }, processInstanceId)];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 2: return [4 /*yield*/, (_e.sent()).goToTaskApp()];
                case 3: return [4 /*yield*/, (_e.sent()).clickProcessButton()];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, processFiltersPage.selectFromProcessList('Comment APS')];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.commentsApi.getProcessInstanceComments(processInstanceId, { 'latestFirst': true })];
                case 7:
                    addedComment = _e.sent();
                    return [4 /*yield*/, commentsPage.checkUserIconIsDisplayed(0)];
                case 8:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, commentsPage.getTotalNumberOfComments()];
                case 9: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toEqual('Comments (' + addedComment.total + ')')];
                case 10:
                    _e.sent();
                    _b = expect;
                    return [4 /*yield*/, commentsPage.getMessage(0)];
                case 11: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toEqual(addedComment.data[0].message)];
                case 12:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, commentsPage.getUserName(0)];
                case 13: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toEqual(addedComment.data[0].createdBy.firstName + ' ' + addedComment.data[0].createdBy.lastName)];
                case 14:
                    _e.sent();
                    _d = expect;
                    return [4 /*yield*/, commentsPage.getTime(0)];
                case 15: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toMatch(/(ago|few)/)];
                case 16:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260465] Should not be able to view process comment on included task', function () { return __awaiter(_this, void 0, void 0, function () {
        var taskQuery, taskId, taskComments, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.commentsApi.addProcessInstanceComment({ message: 'GOODBYE' }, processInstanceId)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 2: return [4 /*yield*/, (_b.sent()).goToTaskApp()];
                case 3: return [4 /*yield*/, (_b.sent()).clickProcessButton()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.selectFromProcessList('Comment APS')];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.listTasks({ processInstanceId: processInstanceId })];
                case 7:
                    taskQuery = _b.sent();
                    taskId = taskQuery.data[0].id;
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.commentsApi.getTaskComments(taskId, { 'latestFirst': true })];
                case 8:
                    taskComments = _b.sent();
                    _a = expect;
                    return [4 /*yield*/, taskComments.total];
                case 9: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(0)];
                case 10:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260466] Should be able to display comments from Task on the related Process', function () { return __awaiter(_this, void 0, void 0, function () {
        var taskQuery, taskId, addedTaskComment, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.listTasks({ processInstanceId: processInstanceId })];
                case 1:
                    taskQuery = _e.sent();
                    taskId = taskQuery.data[0].id;
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.addTaskComment({ message: 'Task Comment' }, taskId)];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 3: return [4 /*yield*/, (_e.sent()).goToTaskApp()];
                case 4: return [4 /*yield*/, (_e.sent()).clickProcessButton()];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, processFiltersPage.selectFromProcessList('Comment APS')];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.commentsApi.getProcessInstanceComments(processInstanceId, { 'latestFirst': true })];
                case 8:
                    addedTaskComment = _e.sent();
                    return [4 /*yield*/, commentsPage.checkUserIconIsDisplayed(0)];
                case 9:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, commentsPage.getTotalNumberOfComments()];
                case 10: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toEqual('Comments (' + addedTaskComment.total + ')')];
                case 11:
                    _e.sent();
                    _b = expect;
                    return [4 /*yield*/, commentsPage.getMessage(0)];
                case 12: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toEqual(addedTaskComment.data[0].message)];
                case 13:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, commentsPage.getUserName(0)];
                case 14: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toEqual(addedTaskComment.data[0].createdBy.firstName + ' ' + addedTaskComment.data[0].createdBy.lastName)];
                case 15:
                    _e.sent();
                    _d = expect;
                    return [4 /*yield*/, commentsPage.getTime(0)];
                case 16: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toMatch(/(ago|few)/)];
                case 17:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=comment-component-processes.e2e.js.map