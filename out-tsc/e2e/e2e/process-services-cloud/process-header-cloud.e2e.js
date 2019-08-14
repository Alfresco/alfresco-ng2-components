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
var CONSTANTS = require("../util/constants");
var moment = require("moment");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var adf_testing_1 = require("@alfresco/adf-testing");
var adf_testing_2 = require("@alfresco/adf-testing");
var tasksCloudDemoPage_1 = require("../pages/adf/demo-shell/process-services/tasksCloudDemoPage");
var adf_testing_3 = require("@alfresco/adf-testing");
var processCloudDemoPage_1 = require("../pages/adf/demo-shell/process-services/processCloudDemoPage");
var resources = require("../util/resources");
describe('Process Header cloud component', function () {
    describe('Process Header cloud component', function () {
        var simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
        var subProcessApp = resources.ACTIVITI7_APPS.SUB_PROCESS_APP.name;
        var formatDate = 'MMM D, YYYY';
        var processHeaderCloudPage = new adf_testing_3.ProcessHeaderCloudPage();
        var loginSSOPage = new adf_testing_1.LoginSSOPage();
        var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
        var appListCloudComponent = new adf_testing_2.AppListCloudPage();
        var tasksCloudDemoPage = new tasksCloudDemoPage_1.TasksCloudDemoPage();
        var processCloudDemoPage = new processCloudDemoPage_1.ProcessCloudDemoPage();
        var settingsPage = new adf_testing_1.SettingsPage();
        var apiService = new adf_testing_1.ApiService(protractor_1.browser.params.config.oauth2.clientId, protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.providers);
        var processDefinitionService;
        var processInstancesService;
        var queryService;
        var identityService;
        var groupIdentityService;
        var testUser, groupInfo;
        var runningProcess, runningCreatedDate, parentCompleteProcess, childCompleteProcess, completedCreatedDate;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var processDefinition, childProcessDefinition, parentProcessInstance;
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
                        processDefinitionService = new adf_testing_1.ProcessDefinitionsService(apiService);
                        return [4 /*yield*/, processDefinitionService.getProcessDefinitions(simpleApp)];
                    case 6:
                        processDefinition = _a.sent();
                        return [4 /*yield*/, processDefinitionService.getProcessDefinitions(subProcessApp)];
                    case 7:
                        childProcessDefinition = _a.sent();
                        processInstancesService = new adf_testing_1.ProcessInstancesService(apiService);
                        return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, simpleApp, { name: adf_testing_1.StringUtil.generateRandomString(), businessKey: 'test' })];
                    case 8:
                        runningProcess = _a.sent();
                        runningCreatedDate = moment(runningProcess.entry.startDate).format(formatDate);
                        return [4 /*yield*/, processInstancesService.createProcessInstance(childProcessDefinition.list.entries[0].entry.key, subProcessApp)];
                    case 9:
                        parentCompleteProcess = _a.sent();
                        queryService = new adf_testing_1.QueryService(apiService);
                        return [4 /*yield*/, queryService.getProcessInstanceSubProcesses(parentCompleteProcess.entry.id, subProcessApp)];
                    case 10:
                        parentProcessInstance = _a.sent();
                        childCompleteProcess = parentProcessInstance.list.entries[0];
                        completedCreatedDate = moment(childCompleteProcess.entry.startDate).format(formatDate);
                        return [4 /*yield*/, settingsPage.setProviderBpmSso(protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.identityHost)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password)];
                    case 12:
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
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C305010] Should display process details for running process', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0: return [4 /*yield*/, appListCloudComponent.goToApp(simpleApp)];
                    case 1:
                        _k.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded()];
                    case 2:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.clickOnProcessFilters()];
                    case 3:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.runningProcessesFilter().checkProcessFilterIsDisplayed()];
                    case 4:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.runningProcessesFilter().clickProcessFilter()];
                    case 5:
                        _k.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 6: return [4 /*yield*/, _a.apply(void 0, [_k.sent()]).toBe('Running Processes')];
                    case 7:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(runningProcess.entry.name)];
                    case 8:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkProcessListIsLoaded()];
                    case 9:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().selectRow(runningProcess.entry.name)];
                    case 10:
                        _k.sent();
                        _b = expect;
                        return [4 /*yield*/, processHeaderCloudPage.getId()];
                    case 11: return [4 /*yield*/, _b.apply(void 0, [_k.sent()]).toEqual(runningProcess.entry.id)];
                    case 12:
                        _k.sent();
                        _c = expect;
                        return [4 /*yield*/, processHeaderCloudPage.getName()];
                    case 13: return [4 /*yield*/, _c.apply(void 0, [_k.sent()]).toEqual(runningProcess.entry.name)];
                    case 14:
                        _k.sent();
                        _d = expect;
                        return [4 /*yield*/, processHeaderCloudPage.getStatus()];
                    case 15: return [4 /*yield*/, _d.apply(void 0, [_k.sent()]).toEqual(runningProcess.entry.status)];
                    case 16:
                        _k.sent();
                        _e = expect;
                        return [4 /*yield*/, processHeaderCloudPage.getInitiator()];
                    case 17: return [4 /*yield*/, _e.apply(void 0, [_k.sent()]).toEqual(runningProcess.entry.initiator)];
                    case 18:
                        _k.sent();
                        _f = expect;
                        return [4 /*yield*/, processHeaderCloudPage.getStartDate()];
                    case 19: return [4 /*yield*/, _f.apply(void 0, [_k.sent()]).toEqual(runningCreatedDate)];
                    case 20:
                        _k.sent();
                        _g = expect;
                        return [4 /*yield*/, processHeaderCloudPage.getParentId()];
                    case 21: return [4 /*yield*/, _g.apply(void 0, [_k.sent()]).toEqual(CONSTANTS.PROCESS_DETAILS.NO_PARENT)];
                    case 22:
                        _k.sent();
                        _h = expect;
                        return [4 /*yield*/, processHeaderCloudPage.getBusinessKey()];
                    case 23: return [4 /*yield*/, _h.apply(void 0, [_k.sent()]).toEqual(runningProcess.entry.businessKey)];
                    case 24:
                        _k.sent();
                        _j = expect;
                        return [4 /*yield*/, processHeaderCloudPage.getLastModified()];
                    case 25: return [4 /*yield*/, _j.apply(void 0, [_k.sent()]).toEqual(runningCreatedDate)];
                    case 26:
                        _k.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C305008] Should display process details for completed process', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0: return [4 /*yield*/, appListCloudComponent.goToApp(subProcessApp)];
                    case 1:
                        _k.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded()];
                    case 2:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.clickOnProcessFilters()];
                    case 3:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.completedProcessesFilter().checkProcessFilterIsDisplayed()];
                    case 4:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.completedProcessesFilter().clickProcessFilter()];
                    case 5:
                        _k.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 6: return [4 /*yield*/, _a.apply(void 0, [_k.sent()]).toBe('Completed Processes')];
                    case 7:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(childCompleteProcess.entry.name)];
                    case 8:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkProcessListIsLoaded()];
                    case 9:
                        _k.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().selectRowById(childCompleteProcess.entry.id)];
                    case 10:
                        _k.sent();
                        _b = expect;
                        return [4 /*yield*/, processHeaderCloudPage.getId()];
                    case 11: return [4 /*yield*/, _b.apply(void 0, [_k.sent()]).toEqual(childCompleteProcess.entry.id)];
                    case 12:
                        _k.sent();
                        _c = expect;
                        return [4 /*yield*/, processHeaderCloudPage.getName()];
                    case 13: return [4 /*yield*/, _c.apply(void 0, [_k.sent()]).toEqual(CONSTANTS.PROCESS_DETAILS.NO_NAME)];
                    case 14:
                        _k.sent();
                        _d = expect;
                        return [4 /*yield*/, processHeaderCloudPage.getStatus()];
                    case 15: return [4 /*yield*/, _d.apply(void 0, [_k.sent()]).toEqual(childCompleteProcess.entry.status)];
                    case 16:
                        _k.sent();
                        _e = expect;
                        return [4 /*yield*/, processHeaderCloudPage.getInitiator()];
                    case 17: return [4 /*yield*/, _e.apply(void 0, [_k.sent()]).toEqual(childCompleteProcess.entry.initiator)];
                    case 18:
                        _k.sent();
                        _f = expect;
                        return [4 /*yield*/, processHeaderCloudPage.getStartDate()];
                    case 19: return [4 /*yield*/, _f.apply(void 0, [_k.sent()]).toEqual(completedCreatedDate)];
                    case 20:
                        _k.sent();
                        _g = expect;
                        return [4 /*yield*/, processHeaderCloudPage.getParentId()];
                    case 21: return [4 /*yield*/, _g.apply(void 0, [_k.sent()]).toEqual(childCompleteProcess.entry.parentId)];
                    case 22:
                        _k.sent();
                        _h = expect;
                        return [4 /*yield*/, processHeaderCloudPage.getBusinessKey()];
                    case 23: return [4 /*yield*/, _h.apply(void 0, [_k.sent()]).toEqual(CONSTANTS.PROCESS_DETAILS.NO_BUSINESS_KEY)];
                    case 24:
                        _k.sent();
                        _j = expect;
                        return [4 /*yield*/, processHeaderCloudPage.getLastModified()];
                    case 25: return [4 /*yield*/, _j.apply(void 0, [_k.sent()]).toEqual(completedCreatedDate)];
                    case 26:
                        _k.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=process-header-cloud.e2e.js.map