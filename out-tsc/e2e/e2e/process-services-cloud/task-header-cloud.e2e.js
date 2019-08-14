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
var CONSTANTS = require("../util/constants");
var adf_testing_1 = require("@alfresco/adf-testing");
var moment = require("moment");
var protractor_1 = require("protractor");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var adf_testing_2 = require("@alfresco/adf-testing");
var tasksCloudDemoPage_1 = require("../pages/adf/demo-shell/process-services/tasksCloudDemoPage");
var resources = require("../util/resources");
describe('Task Header cloud component', function () {
    var basicCreatedTaskName = adf_testing_1.StringUtil.generateRandomString();
    var completedTaskName = adf_testing_1.StringUtil.generateRandomString();
    var basicCreatedTask;
    var basicCreatedDate;
    var completedTask;
    var completedCreatedDate;
    var subTask;
    var subTaskCreatedDate;
    var completedEndDate;
    var defaultDate;
    var groupInfo, testUser;
    var simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
    var priority = 30;
    var description = 'descriptionTask';
    var formatDate = 'MMM D, YYYY';
    var defaultFormat = 'M/D/YY';
    var taskHeaderCloudPage = new adf_testing_2.TaskHeaderCloudPage();
    var loginSSOPage = new adf_testing_2.LoginSSOPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var appListCloudComponent = new adf_testing_2.AppListCloudPage();
    var tasksCloudDemoPage = new tasksCloudDemoPage_1.TasksCloudDemoPage();
    var settingsPage = new adf_testing_1.SettingsPage();
    var apiService = new adf_testing_1.ApiService(protractor_1.browser.params.config.oauth2.clientId, protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.providers);
    var tasksService;
    var identityService;
    var groupIdentityService;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var createdTaskId, completedTaskId, subTaskId;
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
                    return [4 /*yield*/, groupIdentityService.getGroupInfoByGroupName('hr')];
                case 3:
                    groupInfo = _a.sent();
                    return [4 /*yield*/, identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apiService.login(testUser.email, testUser.password)];
                case 5:
                    _a.sent();
                    tasksService = new adf_testing_2.TasksService(apiService);
                    return [4 /*yield*/, tasksService.createStandaloneTask(basicCreatedTaskName, simpleApp)];
                case 6:
                    createdTaskId = _a.sent();
                    return [4 /*yield*/, tasksService.claimTask(createdTaskId.entry.id, simpleApp)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, tasksService.getTask(createdTaskId.entry.id, simpleApp)];
                case 8:
                    basicCreatedTask = _a.sent();
                    basicCreatedDate = moment(basicCreatedTask.entry.createdDate).format(formatDate);
                    return [4 /*yield*/, tasksService.createStandaloneTask(completedTaskName, simpleApp, { priority: priority, description: description, dueDate: basicCreatedTask.entry.createdDate })];
                case 9:
                    completedTaskId = _a.sent();
                    return [4 /*yield*/, tasksService.claimTask(completedTaskId.entry.id, simpleApp)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, tasksService.completeTask(completedTaskId.entry.id, simpleApp)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, tasksService.getTask(completedTaskId.entry.id, simpleApp)];
                case 12:
                    completedTask = _a.sent();
                    completedCreatedDate = moment(completedTask.entry.createdDate).format(formatDate);
                    completedEndDate = moment(completedTask.entry.endDate).format(formatDate);
                    defaultDate = moment(completedTask.entry.createdDate).format(defaultFormat);
                    return [4 /*yield*/, tasksService.createStandaloneSubtask(createdTaskId.entry.id, simpleApp, adf_testing_1.StringUtil.generateRandomString())];
                case 13:
                    subTaskId = _a.sent();
                    return [4 /*yield*/, tasksService.claimTask(subTaskId.entry.id, simpleApp)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, tasksService.getTask(subTaskId.entry.id, simpleApp)];
                case 15:
                    subTask = _a.sent();
                    subTaskCreatedDate = moment(subTask.entry.createdDate).format(formatDate);
                    return [4 /*yield*/, settingsPage.setProviderBpmSso(protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.identityHost)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password)];
                case 17:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apiService.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, identityService.deleteIdentityUser(testUser.idIdentityService)];
                case 2:
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
                    return [4 /*yield*/, appListCloudComponent.goToApp(simpleApp)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291943] Should display task details for assigned task', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                case 1:
                    _l.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(basicCreatedTaskName)];
                case 2:
                    _l.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().selectRow(basicCreatedTaskName)];
                case 3:
                    _l.sent();
                    _a = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getId()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_l.sent()]).toEqual(basicCreatedTask.entry.id)];
                case 5:
                    _l.sent();
                    _b = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getDescription()];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_l.sent()])
                        .toEqual(basicCreatedTask.entry.description === null ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : basicCreatedTask.entry.description)];
                case 7:
                    _l.sent();
                    _c = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getStatus()];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_l.sent()]).toEqual(basicCreatedTask.entry.status)];
                case 9:
                    _l.sent();
                    _d = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getPriority()];
                case 10: return [4 /*yield*/, _d.apply(void 0, [_l.sent()]).toEqual(basicCreatedTask.entry.priority === 0 ? '' : basicCreatedTask.entry.priority.toString())];
                case 11:
                    _l.sent();
                    _e = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getCategory()];
                case 12: return [4 /*yield*/, _e.apply(void 0, [_l.sent()]).toEqual(!basicCreatedTask.entry.category ?
                        CONSTANTS.TASK_DETAILS.NO_CATEGORY : basicCreatedTask.entry.category)];
                case 13:
                    _l.sent();
                    _f = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getDueDate()];
                case 14: return [4 /*yield*/, _f.apply(void 0, [_l.sent()]).toEqual(basicCreatedTask.entry.dueDate === null ?
                        CONSTANTS.TASK_DETAILS.NO_DATE : basicCreatedDate)];
                case 15:
                    _l.sent();
                    _g = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getEndDate()];
                case 16: return [4 /*yield*/, _g.apply(void 0, [_l.sent()]).toEqual('')];
                case 17:
                    _l.sent();
                    _h = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getCreated()];
                case 18: return [4 /*yield*/, _h.apply(void 0, [_l.sent()]).toEqual(basicCreatedDate)];
                case 19:
                    _l.sent();
                    _j = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getAssignee()];
                case 20: return [4 /*yield*/, _j.apply(void 0, [_l.sent()]).toEqual(basicCreatedTask.entry.assignee === null ? '' : basicCreatedTask.entry.assignee)];
                case 21:
                    _l.sent();
                    _k = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getParentName()];
                case 22: return [4 /*yield*/, _k.apply(void 0, [_l.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT)];
                case 23:
                    _l.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291944] Should display task details for completed task', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                case 1:
                    _l.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.completedTasksFilter().clickTaskFilter()];
                case 2:
                    _l.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName)];
                case 3:
                    _l.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().selectRow(completedTaskName)];
                case 4:
                    _l.sent();
                    _a = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getId()];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_l.sent()]).toEqual(completedTask.entry.id)];
                case 6:
                    _l.sent();
                    _b = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getDescription()];
                case 7: return [4 /*yield*/, _b.apply(void 0, [_l.sent()])
                        .toEqual(completedTask.entry.description === null ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : completedTask.entry.description)];
                case 8:
                    _l.sent();
                    _c = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getStatus()];
                case 9: return [4 /*yield*/, _c.apply(void 0, [_l.sent()]).toEqual(completedTask.entry.status)];
                case 10:
                    _l.sent();
                    _d = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getPriority()];
                case 11: return [4 /*yield*/, _d.apply(void 0, [_l.sent()]).toEqual(completedTask.entry.priority === '0' ? '' : completedTask.entry.priority.toString())];
                case 12:
                    _l.sent();
                    _e = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getCategory()];
                case 13: return [4 /*yield*/, _e.apply(void 0, [_l.sent()]).toEqual(!completedTask.entry.category ?
                        CONSTANTS.TASK_DETAILS.NO_CATEGORY : completedTask.entry.category)];
                case 14:
                    _l.sent();
                    _f = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getDueDate()];
                case 15: return [4 /*yield*/, _f.apply(void 0, [_l.sent()]).toEqual(completedTask.entry.dueDate === null ?
                        CONSTANTS.TASK_DETAILS.NO_DATE : completedCreatedDate)];
                case 16:
                    _l.sent();
                    _g = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getEndDate()];
                case 17: return [4 /*yield*/, _g.apply(void 0, [_l.sent()]).toEqual(completedEndDate)];
                case 18:
                    _l.sent();
                    _h = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getCreated()];
                case 19: return [4 /*yield*/, _h.apply(void 0, [_l.sent()]).toEqual(completedCreatedDate)];
                case 20:
                    _l.sent();
                    _j = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getAssignee()];
                case 21: return [4 /*yield*/, _j.apply(void 0, [_l.sent()]).toEqual(completedTask.entry.assignee === null ? '' : completedTask.entry.assignee)];
                case 22:
                    _l.sent();
                    _k = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getParentName()];
                case 23: return [4 /*yield*/, _k.apply(void 0, [_l.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_PARENT)];
                case 24:
                    _l.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291945] Should Parent Name and Parent Id not be empty in task details for sub task', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                case 1:
                    _m.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(subTask.entry.name)];
                case 2:
                    _m.sent();
                    return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().selectRow(subTask.entry.name)];
                case 3:
                    _m.sent();
                    _a = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getId()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_m.sent()]).toEqual(subTask.entry.id)];
                case 5:
                    _m.sent();
                    _b = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getDescription()];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_m.sent()])
                        .toEqual(subTask.entry.description === null ? CONSTANTS.TASK_DETAILS.NO_DESCRIPTION : subTask.entry.description)];
                case 7:
                    _m.sent();
                    _c = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getStatus()];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_m.sent()]).toEqual(subTask.entry.status)];
                case 9:
                    _m.sent();
                    _d = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getPriority()];
                case 10: return [4 /*yield*/, _d.apply(void 0, [_m.sent()]).toEqual(subTask.entry.priority === 0 ? '' : subTask.entry.priority.toString())];
                case 11:
                    _m.sent();
                    _e = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getCategory()];
                case 12: return [4 /*yield*/, _e.apply(void 0, [_m.sent()]).toEqual(!subTask.entry.category ?
                        CONSTANTS.TASK_DETAILS.NO_CATEGORY : subTask.entry.category)];
                case 13:
                    _m.sent();
                    _f = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getDueDate()];
                case 14: return [4 /*yield*/, _f.apply(void 0, [_m.sent()]).toEqual(subTask.entry.dueDate === null ?
                        CONSTANTS.TASK_DETAILS.NO_DATE : subTaskCreatedDate)];
                case 15:
                    _m.sent();
                    _g = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getEndDate()];
                case 16: return [4 /*yield*/, _g.apply(void 0, [_m.sent()]).toEqual('')];
                case 17:
                    _m.sent();
                    _h = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getCreated()];
                case 18: return [4 /*yield*/, _h.apply(void 0, [_m.sent()]).toEqual(subTaskCreatedDate)];
                case 19:
                    _m.sent();
                    _j = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getAssignee()];
                case 20: return [4 /*yield*/, _j.apply(void 0, [_m.sent()]).toEqual(subTask.entry.assignee === null ? '' : subTask.entry.assignee)];
                case 21:
                    _m.sent();
                    _k = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getParentName()];
                case 22: return [4 /*yield*/, _k.apply(void 0, [_m.sent()]).toEqual(basicCreatedTask.entry.name)];
                case 23:
                    _m.sent();
                    _l = expect;
                    return [4 /*yield*/, taskHeaderCloudPage.getParentTaskId()];
                case 24: return [4 /*yield*/, _l.apply(void 0, [_m.sent()])
                        .toEqual(subTask.entry.parentTaskId === null ? '' : subTask.entry.parentTaskId)];
                case 25:
                    _m.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Default Date format', function () {
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('dateValues', '{' +
                            '"defaultDateFormat": "shortDate",' +
                            '"defaultDateTimeFormat": "M/d/yy, h:mm a",' +
                            '"defaultLocale": "uk"' +
                            '}')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.navigateToProcessServicesCloudPage()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, appListCloudComponent.checkApsContainer()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, appListCloudComponent.goToApp(simpleApp)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C311280] Should pick up the default date format from the app configuration', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.myTasksFilter().clickTaskFilter()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.completedTasksFilter().clickTaskFilter()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(completedTaskName)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().selectRow(completedTaskName)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, taskHeaderCloudPage.checkTaskPropertyListIsDisplayed()];
                    case 5:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, taskHeaderCloudPage.getCreated()];
                    case 6: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(defaultDate)];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=task-header-cloud.e2e.js.map