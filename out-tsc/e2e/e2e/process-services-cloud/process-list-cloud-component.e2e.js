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
var processCloudDemoPage_1 = require("../pages/adf/demo-shell/process-services/processCloudDemoPage");
var adf_testing_2 = require("@alfresco/adf-testing");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var process_list_cloud_config_1 = require("./config/process-list-cloud.config");
var resources = require("../util/resources");
describe('Process list cloud', function () {
    describe('Process List', function () {
        var loginSSOPage = new adf_testing_1.LoginSSOPage();
        var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
        var appListCloudComponent = new adf_testing_2.AppListCloudPage();
        var processCloudDemoPage = new processCloudDemoPage_1.ProcessCloudDemoPage();
        var settingsPage = new adf_testing_1.SettingsPage();
        var apiService = new adf_testing_1.ApiService(protractor_1.browser.params.config.oauth2.clientId, protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, 'BPM');
        var processDefinitionService;
        var processInstancesService;
        var identityService;
        var groupIdentityService;
        var testUser, groupInfo;
        var candidateBaseApp = resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.name;
        var jsonFile;
        var runningProcess;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var processDefinition;
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
                        return [4 /*yield*/, processDefinitionService
                                .getProcessDefinitionByName(resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.processes.candidateGroupProcess, candidateBaseApp)];
                    case 6:
                        processDefinition = _a.sent();
                        processInstancesService = new adf_testing_1.ProcessInstancesService(apiService);
                        return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp)];
                    case 7:
                        runningProcess = _a.sent();
                        return [4 /*yield*/, settingsPage.setProviderBpmSso(protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.identityHost)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password)];
                    case 9:
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
            var processListCloudConfiguration, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        processListCloudConfiguration = new process_list_cloud_config_1.ProcessListCloudConfiguration();
                        jsonFile = processListCloudConfiguration.getConfiguration();
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('adf-cloud-process-list', JSON.stringify(jsonFile))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, navigationBarPage.navigateToProcessServicesCloudPage()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, appListCloudComponent.checkApsContainer()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, appListCloudComponent.goToApp(candidateBaseApp)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, processCloudDemoPage.clickOnProcessFilters()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, processCloudDemoPage.runningProcessesFilter().checkProcessFilterIsDisplayed()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, processCloudDemoPage.runningProcessesFilter().clickProcessFilter()];
                    case 7:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 8: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('Running Processes')];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkProcessListIsLoaded()];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(runningProcess.entry.id)];
                    case 11:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291997] Should be able to change the default columns', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().getNumberOfColumns()];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(10)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('id')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('name')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('status')];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('startDate')];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('appName')];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('businessKey')];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('initiator')];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('lastModified')];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('processDefinitionId')];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().checkColumnIsDisplayed('processDefinitionKey')];
                    case 12:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=process-list-cloud-component.e2e.js.map