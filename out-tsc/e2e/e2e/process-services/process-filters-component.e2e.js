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
var resources = require("../util/resources");
var adf_testing_1 = require("@alfresco/adf-testing");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var processServicesPage_1 = require("../pages/adf/process-services/processServicesPage");
var startProcessPage_1 = require("../pages/adf/process-services/startProcessPage");
var processFiltersPage_1 = require("../pages/adf/process-services/processFiltersPage");
var processServiceTabBarPage_1 = require("../pages/adf/process-services/processServiceTabBarPage");
var processDetailsPage_1 = require("../pages/adf/process-services/processDetailsPage");
var processListPage_1 = require("../pages/adf/process-services/processListPage");
var js_api_1 = require("@alfresco/js-api");
var apps_actions_1 = require("../actions/APS/apps.actions");
var users_actions_1 = require("../actions/users.actions");
var protractor_1 = require("protractor");
describe('Process Filters Test', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var processListPage = new processListPage_1.ProcessListPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var processServicesPage = new processServicesPage_1.ProcessServicesPage();
    var startProcessPage = new startProcessPage_1.StartProcessPage();
    var processFiltersPage = new processFiltersPage_1.ProcessFiltersPage();
    var processServiceTabBarPage = new processServiceTabBarPage_1.ProcessServiceTabBarPage();
    var processDetailsPage = new processDetailsPage_1.ProcessDetailsPage();
    var appModel;
    var app = resources.Files.APP_WITH_DATE_FIELD_FORM;
    var processTitle = {
        running: 'Test_running',
        completed: 'Test_completed'
    };
    var processFilter = {
        running: 'Running',
        all: 'All',
        completed: 'Completed'
    };
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var apps, users, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apps = new apps_actions_1.AppsActions();
                    users = new users_actions_1.UsersActions();
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'BPM',
                        hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                    });
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, users.createTenantAndUser(this.alfrescoJsApi)];
                case 2:
                    user = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(user.email, user.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location)];
                case 4:
                    appModel = _a.sent();
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(user)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processServicesPage.checkApsContainer()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260387] Should the running process be displayed when clicking on Running filter', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processListPage.checkProcessListIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, startProcessPage.enterProcessName(processTitle.completed)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, startProcessPage.selectFromProcessDropdown(app.process_title)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, startProcessPage.clickFormStartProcessButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, processDetailsPage.clickCancelProcessButton()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, startProcessPage.enterProcessName(processTitle.running)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, startProcessPage.selectFromProcessDropdown(app.process_title)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, startProcessPage.clickFormStartProcessButton()];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsHighlighted(processFilter.running)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.selectFromProcessList(processTitle.running)];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, processDetailsPage.checkProcessDetailsCard()];
                case 20:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280063] Should both the new created process and a completed one to be displayed when clicking on All filter', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processListPage.checkProcessListIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.clickAllFilterButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsHighlighted(processFilter.all)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.selectFromProcessList(processTitle.running)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.selectFromProcessList(processTitle.completed)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, processDetailsPage.checkProcessDetailsCard()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280064] Should the completed process be displayed when clicking on Completed filter', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processListPage.checkProcessListIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.clickCompletedFilterButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsHighlighted(processFilter.completed)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.selectFromProcessList(processTitle.completed)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, processDetailsPage.checkProcessDetailsCard()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280407] Should be able to access the filters with URL', function () { return __awaiter(_this, void 0, void 0, function () {
        var defaultFiltersNumber, deployedApp, processFilterUrl, appDefinitions, taskAppFilters, _i, taskAppFilters_1, filter;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    defaultFiltersNumber = 3;
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.appsApi.getAppDefinitions()];
                case 1:
                    appDefinitions = _a.sent();
                    deployedApp = appDefinitions.data.find(function (currentApp) {
                        return currentApp.modelId === appModel.id;
                    });
                    processFilterUrl = protractor_1.browser.params.testConfig.adf.url + '/activiti/apps/' + deployedApp.id + '/processes/';
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.getUserProcessInstanceFilters({ appId: deployedApp.id })];
                case 2:
                    taskAppFilters = _a.sent();
                    return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processListPage.checkProcessListIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, expect(taskAppFilters.size).toBe(defaultFiltersNumber)];
                case 6:
                    _a.sent();
                    _i = 0, taskAppFilters_1 = taskAppFilters;
                    _a.label = 7;
                case 7:
                    if (!(_i < taskAppFilters_1.length)) return [3 /*break*/, 12];
                    filter = taskAppFilters_1[_i];
                    return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(processFilterUrl + filter.id)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, processListPage.checkProcessListIsDisplayed()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsHighlighted(filter.name)];
                case 10:
                    _a.sent();
                    _a.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 7];
                case 12: return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=process-filters-component.e2e.js.map