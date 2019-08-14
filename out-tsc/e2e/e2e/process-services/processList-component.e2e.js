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
var processListDemoPage_1 = require("../pages/adf/demo-shell/process-services/processListDemoPage");
var protractor_1 = require("protractor");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var apps_actions_1 = require("../actions/APS/apps.actions");
var users_actions_1 = require("../actions/users.actions");
describe('Process List Test', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var processListDemoPage = new processListDemoPage_1.ProcessListDemoPage();
    var appWithDateField = resources.Files.APP_WITH_DATE_FIELD_FORM;
    var appWithUserWidget = resources.Files.APP_WITH_USER_WIDGET;
    var appDateModel, appUserWidgetModel, user;
    var processList = ['Process With Date', 'Process With Date 2', 'Process With User Widget', 'Process With User Widget 2'];
    var processName = {
        procWithDate: 'Process With Date',
        completedProcWithDate: 'Process With Date 2',
        procWithUserWidget: 'Process With User Widget',
        completedProcWithUserWidget: 'Process With User Widget 2'
    };
    var errorMessages = {
        appIdNumber: 'App ID must be a number',
        insertAppId: 'Insert App ID'
    };
    var appWithDateFieldId;
    var procWithDate, completedProcWithDate, completedProcWithUserWidget;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var apps, users, procWithDateTaskId, procWithUserWidgetTaskId;
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
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApi, appWithDateField.file_location)];
                case 4:
                    appDateModel = _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, appDateModel, processName.procWithDate)];
                case 5:
                    procWithDate = _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, appDateModel, processName.completedProcWithDate)];
                case 6:
                    completedProcWithDate = _a.sent();
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApi, appWithUserWidget.file_location)];
                case 7:
                    appUserWidgetModel = _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, appUserWidgetModel, processName.procWithUserWidget)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, appUserWidgetModel, processName.completedProcWithUserWidget)];
                case 9:
                    completedProcWithUserWidget = _a.sent();
                    return [4 /*yield*/, apps.getAppDefinitionId(this.alfrescoJsApi, appDateModel.id)];
                case 10:
                    appWithDateFieldId = _a.sent();
                    return [4 /*yield*/, apps.getProcessTaskId(this.alfrescoJsApi, completedProcWithDate.id)];
                case 11:
                    procWithDateTaskId = _a.sent();
                    return [4 /*yield*/, apps.getProcessTaskId(this.alfrescoJsApi, completedProcWithUserWidget.id)];
                case 12:
                    procWithUserWidgetTaskId = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.completeTaskForm(procWithDateTaskId.toString(), { values: { label: null } })];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskFormsApi.completeTaskForm(procWithUserWidgetTaskId.toString(), { values: { label: null } })];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(user)];
                case 15:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.modelsApi.deleteModel(appDateModel.id)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.modelsApi.deleteModel(appUserWidgetModel.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(user.tenantId)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + '/process-list')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286638] Should display all process by default', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processListDemoPage.checkAppIdFieldIsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessInstanceIdFieldIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessInstanceIdFieldIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkSortFieldIsDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkStateFieldIsDisplayed()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C282006] Should be able to filter processes with App ID', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processListDemoPage.addAppId('a')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkErrorMessageIsDisplayed(errorMessages.appIdNumber)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.clickResetButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.addAppId('12345')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkNoProcessFoundIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.addAppId(appWithDateFieldId)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsDisplayed(processName.procWithDate)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithDate)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsNotDisplayed(processName.procWithUserWidget)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithUserWidget)];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C282015] Should be able to filter by Process Definition ID', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processListDemoPage.addProcessDefinitionId(procWithDate.processDefinitionId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsDisplayed(processName.procWithDate)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithDate)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsNotDisplayed(processName.procWithUserWidget)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithUserWidget)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C282016] Should be able to filter by Process Instance ID', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processListDemoPage.addProcessInstanceId(procWithDate.id)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsDisplayed(processName.procWithDate)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithDate)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsNotDisplayed(processName.procWithUserWidget)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithUserWidget)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C282017] Should be able to filter by Status', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processListDemoPage.selectStateFilter('Active')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithDate)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithUserWidget)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsDisplayed(processName.procWithDate)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsDisplayed(processName.procWithUserWidget)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.selectStateFilter('Completed')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithDate)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithUserWidget)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsNotDisplayed(processName.procWithDate)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsNotDisplayed(processName.procWithUserWidget)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.selectStateFilter('All')];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithDate)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithUserWidget)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsDisplayed(processName.procWithDate)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.checkProcessIsDisplayed(processName.procWithUserWidget)];
                case 15:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C282010] Should be able to sort by creation date', function () { return __awaiter(_this, void 0, void 0, function () {
        var sortedProcessListNamesAsc, sortedProcessListNamesDesc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processListDemoPage.selectSorting('asc')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.getDisplayedProcessesNames()];
                case 2:
                    sortedProcessListNamesAsc = _a.sent();
                    return [4 /*yield*/, expect(JSON.stringify(processList) === JSON.stringify(sortedProcessListNamesAsc)).toBe(true)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.selectSorting('desc')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processListDemoPage.getDisplayedProcessesNames()];
                case 5:
                    sortedProcessListNamesDesc = _a.sent();
                    return [4 /*yield*/, expect(JSON.stringify(processList.reverse()) === JSON.stringify(sortedProcessListNamesDesc)).toBe(true)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=processList-component.e2e.js.map