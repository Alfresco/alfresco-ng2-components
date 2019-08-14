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
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var taskListDemoPage_1 = require("../pages/adf/demo-shell/process-services/taskListDemoPage");
var adf_testing_2 = require("@alfresco/adf-testing");
var moment = require("moment");
var tenant_1 = require("../models/APS/tenant");
var protractor_1 = require("protractor");
var resources = require("../util/resources");
var util_1 = require("../util/util");
var js_api_1 = require("@alfresco/js-api");
var apps_actions_1 = require("../actions/APS/apps.actions");
var appsRuntime_actions_1 = require("../actions/APS/appsRuntime.actions");
var users_actions_1 = require("../actions/users.actions");
describe('Start Task - Custom App', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var taskListSinglePage = new taskListDemoPage_1.TaskListDemoPage();
    var paginationPage = new adf_testing_2.PaginationPage();
    var processUserModel;
    var app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var appRuntime, secondAppRuntime;
    var secondApp = resources.Files.WIDGETS_SMOKE_TEST;
    var appModel, secondAppModel;
    var completedTasks = [];
    var paginationTasksName = ['t01', 't02', 't03', 't04', 't05', 't06', 't07', 't08', 't09', 't10', 't11', 't12', 't13', 'taskOne', 'taskTwo', 'taskOne'];
    var completedTasksName = ['completed01', 'completed02', 'completed03'];
    var allTasksName = ['t01', 'taskOne', 'taskTwo', 'taskOne', 't13', 't12', 't11', 't10', 't09', 't08', 't07', 't06', 't05', 't04', 't03', 't02',
        'User Task', 'User Task', 'User Task', 'User Task'];
    var invalidAppId = '1234567890', invalidName = 'invalidName', invalidTaskId = '0000';
    var noTasksFoundMessage = 'No Tasks Found';
    var nrOfTasks = 20;
    var currentPage = 1;
    var totalNrOfPages = 'of 4';
    var currentDateStandardFormat = adf_testing_2.DateUtil.formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ');
    var currentDate = adf_testing_2.DateUtil.formatDate('MM/DD/YYYY');
    var beforeDate = moment().add(-1, 'days').format('MM/DD/YYYY');
    var afterDate = moment().add(1, 'days').format('MM/DD/YYYY');
    var taskWithDueDate;
    var processDefinitionId;
    var itemsPerPage = {
        five: '5',
        fiveValue: 5,
        ten: '10',
        tenValue: 10,
        fifteen: '15',
        fifteenValue: 15,
        twenty: '20',
        twentyValue: 20,
        default: '25'
    };
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var apps, appsRuntime, users, newTenant, i, i, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    apps = new apps_actions_1.AppsActions();
                    appsRuntime = new appsRuntime_actions_1.AppsRuntimeActions();
                    users = new users_actions_1.UsersActions();
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'BPM',
                        hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                    });
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new tenant_1.Tenant())];
                case 2:
                    newTenant = _c.sent();
                    return [4 /*yield*/, users.createApsUser(this.alfrescoJsApi, newTenant.id)];
                case 3:
                    processUserModel = _c.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(processUserModel.email, processUserModel.password)];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location)];
                case 5:
                    appModel = _c.sent();
                    return [4 /*yield*/, appsRuntime.getRuntimeAppByName(this.alfrescoJsApi, app.title)];
                case 6:
                    appRuntime = _c.sent();
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApi, secondApp.file_location)];
                case 7:
                    secondAppModel = _c.sent();
                    return [4 /*yield*/, appsRuntime.getRuntimeAppByName(this.alfrescoJsApi, secondApp.title)];
                case 8:
                    secondAppRuntime = _c.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, appModel)];
                case 9:
                    processDefinitionId = _c.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, appModel)];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, secondAppModel)];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, secondAppModel)];
                case 12:
                    _c.sent();
                    i = 1;
                    _c.label = 13;
                case 13:
                    if (!(i < paginationTasksName.length)) return [3 /*break*/, 16];
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.createNewTask({ 'name': paginationTasksName[i] })];
                case 14:
                    _c.sent();
                    _c.label = 15;
                case 15:
                    i++;
                    return [3 /*break*/, 13];
                case 16:
                    i = 0;
                    _c.label = 17;
                case 17:
                    if (!(i < 3)) return [3 /*break*/, 21];
                    _a = completedTasks;
                    _b = i;
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.createNewTask({
                            'name': completedTasksName[i],
                            'dueDate': adf_testing_2.DateUtil.formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ', new Date(), i + 2)
                        })];
                case 18:
                    _a[_b] = _c.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskActionsApi.completeTask(completedTasks[i].id)];
                case 19:
                    _c.sent();
                    _c.label = 20;
                case 20:
                    i++;
                    return [3 /*break*/, 17];
                case 21: return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.createNewTask({
                        'name': paginationTasksName[0],
                        'dueDate': currentDateStandardFormat
                    })];
                case 22:
                    taskWithDueDate = _c.sent();
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(processUserModel)];
                case 23:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('', function () {
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.clickTaskListButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, taskListSinglePage.clickResetButton()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286362] Default pagination settings on task list', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_f.sent()]).toEqual(itemsPerPage.twenty)];
                    case 2:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 3: return [4 /*yield*/, _b.apply(void 0, [_f.sent()]).toEqual('Showing 1-' + nrOfTasks + ' of ' + nrOfTasks)];
                    case 4:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 5: return [4 /*yield*/, _c.apply(void 0, [_f.sent()]).toBe(nrOfTasks)];
                    case 6:
                        _f.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, allTasksName)).toEqual(true)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 7:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 8: return [4 /*yield*/, _d.apply(void 0, [_f.sent()]).toEqual('Page 1')];
                    case 9:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 10: return [4 /*yield*/, _e.apply(void 0, [_f.sent()]).toEqual('of 1')];
                    case 11:
                        _f.sent();
                        return [4 /*yield*/, paginationPage.checkPageSelectorIsNotDisplayed()];
                    case 12:
                        _f.sent();
                        return [4 /*yield*/, paginationPage.checkNextPageButtonIsDisabled()];
                    case 13:
                        _f.sent();
                        return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                    case 14:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286367] 20 Items per page', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeItemsPerPage(itemsPerPage.twentyValue)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().waitForTableBody()];
                    case 2:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toEqual(itemsPerPage.twenty)];
                    case 4:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual('Showing 1-' + nrOfTasks + ' of ' + nrOfTasks)];
                    case 6:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 7: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(nrOfTasks)];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, allTasksName)).toEqual(true)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, paginationPage.checkNextPageButtonIsDisabled()];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                    case 11:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286365] 5 Items per page', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            var _this = this;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeItemsPerPage(itemsPerPage.fiveValue)];
                    case 1:
                        _o.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().waitForTableBody()];
                    case 2:
                        _o.sent();
                        _a = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_o.sent()]).toEqual(itemsPerPage.five)];
                    case 4:
                        _o.sent();
                        _b = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [_o.sent()]).toEqual('Showing 1-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks)];
                    case 6:
                        _o.sent();
                        _c = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 7: return [4 /*yield*/, _c.apply(void 0, [_o.sent()]).toBe(itemsPerPage.fiveValue)];
                    case 8:
                        _o.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, allTasksName.slice(0, 5))).toEqual(true)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 9:
                        _o.sent();
                        return [4 /*yield*/, paginationPage.clickOnNextPage()];
                    case 10:
                        _o.sent();
                        currentPage++;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().waitForTableBody()];
                    case 11:
                        _o.sent();
                        _d = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 12: return [4 /*yield*/, _d.apply(void 0, [_o.sent()]).toEqual(itemsPerPage.five)];
                    case 13:
                        _o.sent();
                        _e = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 14: return [4 /*yield*/, _e.apply(void 0, [_o.sent()]).toEqual('Showing 6-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks)];
                    case 15:
                        _o.sent();
                        _f = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 16: return [4 /*yield*/, _f.apply(void 0, [_o.sent()]).toBe(itemsPerPage.fiveValue)];
                    case 17:
                        _o.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, allTasksName.slice(5, 10))).toEqual(true)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 18:
                        _o.sent();
                        return [4 /*yield*/, paginationPage.clickOnNextPage()];
                    case 19:
                        _o.sent();
                        currentPage++;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().waitForTableBody()];
                    case 20:
                        _o.sent();
                        _g = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 21: return [4 /*yield*/, _g.apply(void 0, [_o.sent()]).toEqual(itemsPerPage.five)];
                    case 22:
                        _o.sent();
                        _h = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 23: return [4 /*yield*/, _h.apply(void 0, [_o.sent()]).toEqual('Showing 11-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks)];
                    case 24:
                        _o.sent();
                        _j = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 25: return [4 /*yield*/, _j.apply(void 0, [_o.sent()]).toBe(itemsPerPage.fiveValue)];
                    case 26:
                        _o.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, allTasksName.slice(10, 15))).toEqual(true)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 27:
                        _o.sent();
                        return [4 /*yield*/, paginationPage.clickOnNextPage()];
                    case 28:
                        _o.sent();
                        currentPage++;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().waitForTableBody()];
                    case 29:
                        _o.sent();
                        _k = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 30: return [4 /*yield*/, _k.apply(void 0, [_o.sent()]).toEqual(itemsPerPage.five)];
                    case 31:
                        _o.sent();
                        _l = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 32: return [4 /*yield*/, _l.apply(void 0, [_o.sent()]).toEqual('Showing 16-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks)];
                    case 33:
                        _o.sent();
                        _m = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 34: return [4 /*yield*/, _m.apply(void 0, [_o.sent()]).toBe(itemsPerPage.fiveValue)];
                    case 35:
                        _o.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, allTasksName.slice(15, 20))).toEqual(true)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 36:
                        _o.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286364] 10 Items per page', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            var _this = this;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        currentPage = 1;
                        return [4 /*yield*/, taskListSinglePage.typeItemsPerPage(itemsPerPage.tenValue)];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().waitForTableBody()];
                    case 2:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_g.sent()]).toEqual(itemsPerPage.ten)];
                    case 4:
                        _g.sent();
                        _b = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [_g.sent()]).toEqual('Showing 1-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfTasks)];
                    case 6:
                        _g.sent();
                        _c = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 7: return [4 /*yield*/, _c.apply(void 0, [_g.sent()]).toBe(itemsPerPage.tenValue)];
                    case 8:
                        _g.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, allTasksName.slice(0, 10))).toEqual(true)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 9:
                        _g.sent();
                        return [4 /*yield*/, paginationPage.clickOnNextPage()];
                    case 10:
                        _g.sent();
                        currentPage++;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().waitForTableBody()];
                    case 11:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 12: return [4 /*yield*/, _d.apply(void 0, [_g.sent()]).toEqual(itemsPerPage.ten)];
                    case 13:
                        _g.sent();
                        _e = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 14: return [4 /*yield*/, _e.apply(void 0, [_g.sent()]).toEqual('Showing 11-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfTasks)];
                    case 15:
                        _g.sent();
                        _f = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 16: return [4 /*yield*/, _f.apply(void 0, [_g.sent()]).toBe(itemsPerPage.tenValue)];
                    case 17:
                        _g.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, allTasksName.slice(10, 20))).toEqual(true)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 18:
                        _g.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286363] 15 Items per page', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            var _this = this;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        currentPage = 1;
                        return [4 /*yield*/, taskListSinglePage.typeItemsPerPage(itemsPerPage.fifteenValue)];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().waitForTableBody()];
                    case 2:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_g.sent()]).toEqual(itemsPerPage.fifteen)];
                    case 4:
                        _g.sent();
                        _b = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [_g.sent()]).toEqual('Showing 1-' + itemsPerPage.fifteenValue * currentPage + ' of ' + nrOfTasks)];
                    case 6:
                        _g.sent();
                        _c = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 7: return [4 /*yield*/, _c.apply(void 0, [_g.sent()]).toBe(itemsPerPage.fifteenValue)];
                    case 8:
                        _g.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, allTasksName.slice(0, 15))).toEqual(true)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 9:
                        _g.sent();
                        currentPage++;
                        return [4 /*yield*/, paginationPage.clickOnNextPage()];
                    case 10:
                        _g.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().waitForTableBody()];
                    case 11:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 12: return [4 /*yield*/, _d.apply(void 0, [_g.sent()]).toEqual(itemsPerPage.fifteen)];
                    case 13:
                        _g.sent();
                        _e = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 14: return [4 /*yield*/, _e.apply(void 0, [_g.sent()]).toEqual('Showing 16-' + nrOfTasks + ' of ' + nrOfTasks)];
                    case 15:
                        _g.sent();
                        _f = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 16: return [4 /*yield*/, _f.apply(void 0, [_g.sent()]).toBe(nrOfTasks - itemsPerPage.fifteenValue)];
                    case 17:
                        _g.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, allTasksName.slice(15, 20))).toEqual(true)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 18:
                        _g.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286366] Pagination is not displayed when no task is displayed', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeAppId(secondAppRuntime.id)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, taskListSinglePage.getAppId()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(secondAppRuntime.id.toString())];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed()];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286406] Invalid values for items per page', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeItemsPerPage('0')];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.clickAppId()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, taskListSinglePage.getItemsPerPageFieldErrorMessage()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('Value must be greater than or equal to 1')];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286404] Navigate using page field', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            var _this = this;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0:
                        currentPage = 1;
                        return [4 /*yield*/, taskListSinglePage.typeItemsPerPage(itemsPerPage.fiveValue)];
                    case 1:
                        _o.sent();
                        return [4 /*yield*/, taskListSinglePage.typePage(currentPage)];
                    case 2:
                        _o.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().waitForTableBody()];
                    case 3:
                        _o.sent();
                        _a = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_o.sent()]).toEqual('Page ' + currentPage)];
                    case 5:
                        _o.sent();
                        _b = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 6: return [4 /*yield*/, _b.apply(void 0, [_o.sent()]).toEqual(totalNrOfPages)];
                    case 7:
                        _o.sent();
                        return [4 /*yield*/, paginationPage.checkPageSelectorIsDisplayed()];
                    case 8:
                        _o.sent();
                        _c = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 9: return [4 /*yield*/, _c.apply(void 0, [_o.sent()]).toBe(itemsPerPage.fiveValue)];
                    case 10:
                        _o.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, allTasksName.slice(0, 5))).toEqual(true)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 11:
                        _o.sent();
                        currentPage++;
                        return [4 /*yield*/, taskListSinglePage.typePage(currentPage)];
                    case 12:
                        _o.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().waitForTableBody()];
                    case 13:
                        _o.sent();
                        _d = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 14: return [4 /*yield*/, _d.apply(void 0, [_o.sent()]).toEqual('Page ' + currentPage)];
                    case 15:
                        _o.sent();
                        _e = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 16: return [4 /*yield*/, _e.apply(void 0, [_o.sent()]).toEqual(totalNrOfPages)];
                    case 17:
                        _o.sent();
                        return [4 /*yield*/, paginationPage.checkPageSelectorIsDisplayed()];
                    case 18:
                        _o.sent();
                        _f = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 19: return [4 /*yield*/, _f.apply(void 0, [_o.sent()]).toBe(itemsPerPage.fiveValue)];
                    case 20:
                        _o.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, allTasksName.slice(5, 10))).toEqual(true)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 21:
                        _o.sent();
                        currentPage++;
                        return [4 /*yield*/, taskListSinglePage.typePage(currentPage)];
                    case 22:
                        _o.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().waitForTableBody()];
                    case 23:
                        _o.sent();
                        _g = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 24: return [4 /*yield*/, _g.apply(void 0, [_o.sent()]).toEqual('Page ' + currentPage)];
                    case 25:
                        _o.sent();
                        _h = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 26: return [4 /*yield*/, _h.apply(void 0, [_o.sent()]).toEqual(totalNrOfPages)];
                    case 27:
                        _o.sent();
                        return [4 /*yield*/, paginationPage.checkPageSelectorIsDisplayed()];
                    case 28:
                        _o.sent();
                        _j = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 29: return [4 /*yield*/, _j.apply(void 0, [_o.sent()]).toBe(itemsPerPage.fiveValue)];
                    case 30:
                        _o.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, allTasksName.slice(10, 15))).toEqual(true)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 31:
                        _o.sent();
                        currentPage++;
                        return [4 /*yield*/, taskListSinglePage.typePage(currentPage)];
                    case 32:
                        _o.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().waitForTableBody()];
                    case 33:
                        _o.sent();
                        _k = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 34: return [4 /*yield*/, _k.apply(void 0, [_o.sent()]).toEqual('Page ' + currentPage)];
                    case 35:
                        _o.sent();
                        _l = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 36: return [4 /*yield*/, _l.apply(void 0, [_o.sent()]).toEqual(totalNrOfPages)];
                    case 37:
                        _o.sent();
                        return [4 /*yield*/, paginationPage.checkPageSelectorIsDisplayed()];
                    case 38:
                        _o.sent();
                        _m = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 39: return [4 /*yield*/, _m.apply(void 0, [_o.sent()]).toBe(itemsPerPage.fiveValue)];
                    case 40:
                        _o.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, allTasksName.slice(15, 20))).toEqual(true)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 41:
                        _o.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286405] Type invalid values to page field', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typePage('0')];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.clickAppId()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, taskListSinglePage.getPageFieldErrorMessage()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('Value must be greater than or equal to 1')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.clickResetButton()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.typePage('2')];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed()];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286413] Task is displayed when typing into dueAfter field a date before the tasks due date', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeDueAfter(beforeDate)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().checkContentIsDisplayed(paginationTasksName[0])];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(1)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286414] Task is not displayed when typing into dueAfter field a date after the task due date', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeDueAfter(afterDate)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286415] Task is not displayed when typing into dueAfter field the same date as tasks due date', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeDueAfter(currentDate)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286424] Task is not displayed when typing into dueBefore field a date before the tasks due date', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeDueBefore(beforeDate)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286425] Task is displayed when typing into dueBefore field a date after the task due date', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeDueBefore(afterDate)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().checkContentIsDisplayed(paginationTasksName[0])];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(1)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286426] Task is not displayed when typing into dueBefore field the same date as tasks due date', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeDueBefore(currentDate)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286428] Task is not displayed when typing into dueAfter field a date before the task due date and into dueBefore a date before task due date', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeDueBefore(beforeDate)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, taskListSinglePage.typeDueAfter(beforeDate)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286427] Task is displayed when typing into dueAfter field a date before the tasks due date and into dueBefore a date after', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeDueBefore(afterDate)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.typeDueAfter(beforeDate)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().checkContentIsDisplayed(paginationTasksName[0])];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(1)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286429] Task is not displayed when typing into dueAfter field a date after the tasks due date and into dueBefore a date after', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeDueBefore(afterDate)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, taskListSinglePage.typeDueAfter(afterDate)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280515] Should be able to see only the tasks of a specific app when typing the apps id in the appId field', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeAppId(appRuntime.id)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, taskListSinglePage.getAppId()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(appRuntime.id.toString())];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().checkContentIsDisplayed(app.taskName)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().checkContentIsDisplayed(app.taskName)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().checkContentIsNotDisplayed(paginationTasksName[13])];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280569] Should be able to see No tasks found when typing an invalid appId', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeAppId(invalidAppId)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, taskListSinglePage.getAppId()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual(invalidAppId.toString())];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getNoTasksFoundMessage()];
                    case 4: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(noTasksFoundMessage)];
                    case 5:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280570] Should be able to see only the tasks with specific name when typing the name in the task name field', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeTaskName(paginationTasksName[13])];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, taskListSinglePage.getTaskName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual(paginationTasksName[13])];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().checkContentIsDisplayed(paginationTasksName[13])];
                    case 4:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getRowsDisplayedWithSameName(paginationTasksName[13])];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [(_c.sent()).length]).toBe(2)];
                    case 6:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280571] Should be able to see No tasks found when typing a task name that does not exist', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeTaskName(invalidName)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, taskListSinglePage.getTaskName()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual(invalidName)];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getNoTasksFoundMessage()];
                    case 4: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(noTasksFoundMessage)];
                    case 5:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280629] Should be able to see only the task with specific taskId when typing it in the task Id field', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeTaskId(taskWithDueDate.id)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, taskListSinglePage.getTaskId()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual(taskWithDueDate.id)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().checkContentIsDisplayed(taskWithDueDate.name)];
                    case 4:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(1)];
                    case 6:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280630] Should be able to see No tasks found when typing an invalid taskId', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.typeTaskId(invalidTaskId)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, taskListSinglePage.getTaskId()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual(invalidTaskId)];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getNoTasksFoundMessage()];
                    case 4: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(noTasksFoundMessage)];
                    case 5:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286589] Should be able to see only completed tasks when choosing Completed from state drop down', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.selectState('Completed')];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().checkContentIsDisplayed(completedTasks[0].name)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().checkContentIsDisplayed(completedTasks[1].name)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().checkContentIsDisplayed(completedTasks[2].name)];
                    case 4:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(3)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286597] Should be able to see only running tasks when choosing Active from state drop down', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.selectState('Active')];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().checkContentIsNotDisplayed(completedTasks[0].name)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().checkContentIsNotDisplayed(completedTasks[1].name)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().checkContentIsNotDisplayed(completedTasks[2].name)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, allTasksName)).toEqual(true)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 5:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 6: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(20)];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286598] Should be able to see all tasks when choosing All from state drop down', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, taskListSinglePage.selectState('All')];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().checkContentIsDisplayed(completedTasks[0].name)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().checkContentIsDisplayed(completedTasks[1].name)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().checkContentIsDisplayed(completedTasks[2].name)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, allTasksName)).toEqual(true)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 5:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                    case 6: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(23)];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('[C286622] Should be able to see only tasks that are part of a specific process when processDefinitionId is set', function () { return __awaiter(_this, void 0, void 0, function () {
        var processDefinitionIds, _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    processDefinitionIds = [processDefinitionId.processDefinitionId, processDefinitionId.processDefinitionId,
                        processDefinitionId.processDefinitionId, processDefinitionId.processDefinitionId];
                    return [4 /*yield*/, navigationBarPage.clickTaskListButton()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, taskListSinglePage.clickResetButton()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, taskListSinglePage.typeProcessDefinitionId(processDefinitionId.processDefinitionId)];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(4)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, taskListSinglePage.getAllProcessDefinitionIds().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, processDefinitionIds)).toEqual(true)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 6:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286623] Should be able to see No tasks found when typing an invalid processDefinitionId', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickTaskListButton()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, taskListSinglePage.clickResetButton()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, taskListSinglePage.typeProcessDefinitionId(invalidTaskId)];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, taskListSinglePage.taskList().getNoTasksFoundMessage()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(noTasksFoundMessage)];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286622] Should be able to see only tasks that are part of a specific process when processInstanceId is set', function () { return __awaiter(_this, void 0, void 0, function () {
        var processInstanceIds, _a, _b;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    processInstanceIds = [processDefinitionId.id];
                    return [4 /*yield*/, navigationBarPage.clickTaskListButton()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, taskListSinglePage.clickResetButton()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, taskListSinglePage.typeProcessInstanceId(processDefinitionId.id)];
                case 3:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, taskListSinglePage.getProcessInstanceId()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual(processDefinitionId.id)];
                case 5:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, taskListSinglePage.taskList().getDataTable().numberOfRows()];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(1)];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, taskListSinglePage.getAllProcessInstanceIds().then(function (list) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, processInstanceIds)).toEqual(true)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 8:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286623] Should be able to see No tasks found when typing an invalid processInstanceId', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickTaskListButton()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, taskListSinglePage.clickResetButton()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, taskListSinglePage.typeProcessInstanceId(invalidTaskId)];
                case 3:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, taskListSinglePage.getProcessInstanceId()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual(invalidTaskId)];
                case 5:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, taskListSinglePage.taskList().getNoTasksFoundMessage()];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(noTasksFoundMessage)];
                case 7:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=custom-tasks-filters.e2e.js.map