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
var processFiltersPage_1 = require("../pages/adf/process-services/processFiltersPage");
var startProcessPage_1 = require("../pages/adf/process-services/startProcessPage");
var processDetailsPage_1 = require("../pages/adf/process-services/processDetailsPage");
var taskDetailsPage_1 = require("../pages/adf/process-services/taskDetailsPage");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var apps_actions_1 = require("../actions/APS/apps.actions");
var users_actions_1 = require("../actions/users.actions");
var protractor_1 = require("protractor");
var processServiceTabBarPage_1 = require("../pages/adf/process-services/processServiceTabBarPage");
describe('Form widgets - People', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var processUserModel;
    var app = resources.Files.APP_WITH_USER_WIDGET;
    var processFiltersPage = new processFiltersPage_1.ProcessFiltersPage();
    var appModel;
    var alfrescoJsApi;
    var widget = new adf_testing_1.Widget();
    var startProcess = new startProcessPage_1.StartProcessPage();
    var processDetailsPage = new processDetailsPage_1.ProcessDetailsPage();
    var taskDetails = new taskDetailsPage_1.TaskDetailsPage();
    var processServiceTabBarPage = new processServiceTabBarPage_1.ProcessServiceTabBarPage();
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var users, appsActions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    users = new users_actions_1.UsersActions();
                    appsActions = new apps_actions_1.AppsActions();
                    alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'BPM',
                        hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                    });
                    return [4 /*yield*/, alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, users.createTenantAndUser(alfrescoJsApi)];
                case 2:
                    processUserModel = _a.sent();
                    return [4 /*yield*/, alfrescoJsApi.login(processUserModel.email, processUserModel.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, appsActions.importPublishDeployApp(alfrescoJsApi, app.file_location)];
                case 4:
                    appModel = _a.sent();
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(processUserModel)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new navigationBarPage_1.NavigationBarPage().navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_a.sent()).goToApp(appModel.name)];
                case 2: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, widget.peopleWidget().checkPeopleFieldIsDisplayed()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, widget.peopleWidget().fillPeopleField(processUserModel.firstName)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, widget.peopleWidget().selectUserFromDropdown()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286577] Should be able to start a process with people widget', function () { return __awaiter(_this, void 0, void 0, function () {
        var taskId, taskForm, userEmail;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, startProcess.clickFormStartProcessButton()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processDetailsPage.clickOnActiveTask()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, taskDetails.getId()];
                case 3:
                    taskId = _a.sent();
                    return [4 /*yield*/, alfrescoJsApi.activiti.taskApi.getTaskForm(taskId)];
                case 4:
                    taskForm = _a.sent();
                    userEmail = taskForm['fields'][0].fields['1'][0].value.email;
                    return [4 /*yield*/, expect(userEmail).toEqual(processUserModel.email)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286576] Should be able to see user in completed task', function () { return __awaiter(_this, void 0, void 0, function () {
        var taskId, taskForm, userEmail;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, startProcess.enterProcessName(app.processName)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, startProcess.clickFormStartProcessButton()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processDetailsPage.clickOnActiveTask()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, taskDetails.checkCompleteFormButtonIsDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, taskDetails.clickCompleteFormTask()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.clickCompletedFilterButton()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.selectFromProcessList(app.processName)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, processDetailsPage.clickOnCompletedTask()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, taskDetails.getId()];
                case 10:
                    taskId = _a.sent();
                    return [4 /*yield*/, alfrescoJsApi.activiti.taskApi.getTaskForm(taskId)];
                case 11:
                    taskForm = _a.sent();
                    userEmail = taskForm['fields'][0].fields['1'][0].value.email;
                    return [4 /*yield*/, expect(userEmail).toEqual(processUserModel.email)];
                case 12:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=form-people-widget.e2e.js.map