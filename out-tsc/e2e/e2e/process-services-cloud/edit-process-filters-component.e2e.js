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
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var tasksCloudDemoPage_1 = require("../pages/adf/demo-shell/process-services/tasksCloudDemoPage");
var processCloudDemoPage_1 = require("../pages/adf/demo-shell/process-services/processCloudDemoPage");
var adf_testing_2 = require("@alfresco/adf-testing");
var resources = require("../util/resources");
describe('Edit process filters cloud', function () {
    describe('Edit process Filters', function () {
        var loginSSOPage = new adf_testing_1.LoginSSOPage();
        var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
        var appListCloudComponent = new adf_testing_2.AppListCloudPage();
        var tasksCloudDemoPage = new tasksCloudDemoPage_1.TasksCloudDemoPage();
        var processCloudDemoPage = new processCloudDemoPage_1.ProcessCloudDemoPage();
        var settingsPage = new adf_testing_1.SettingsPage();
        var simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
        var identityService;
        var groupIdentityService;
        var testUser, groupInfo;
        var apiService = new adf_testing_1.ApiService(protractor_1.browser.params.config.oauth2.clientId, protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, 'BPM');
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
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
                        return [4 /*yield*/, settingsPage.setProviderBpmSso(protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.identityHost)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password)];
                    case 6:
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
            var editProcessFilterCloud;
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
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, processCloudDemoPage.clickOnProcessFilters()];
                    case 5:
                        _a.sent();
                        editProcessFilterCloud = processCloudDemoPage.editProcessFilterCloudComponent();
                        return [4 /*yield*/, editProcessFilterCloud.clickCustomiseFilterHeader()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, editProcessFilterCloud.checkCustomiseFilterHeaderIsExpanded()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().clickProcessFilter()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291804] Delete Save and Save as actions should be displayed when clicking on custom filter header', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().clickProcessFilter()];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed()];
                    case 2:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toBe('All Processes')];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkSaveButtonIsDisplayed()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkSaveAsButtonIsDisplayed()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkDeleteButtonIsDisplayed()];
                    case 7:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkSaveButtonIsEnabled()];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toEqual(false)];
                    case 9:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkSaveAsButtonIsEnabled()];
                    case 10: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toEqual(false)];
                    case 11:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkDeleteButtonIsEnabled()];
                    case 12: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toEqual(true)];
                    case 13:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 14:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291805] New process filter is added when clicking Save As button', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().clickProcessFilter()];
                    case 1:
                        _h.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setSortFilterDropDown('Id')];
                    case 2:
                        _h.sent();
                        return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed()];
                    case 3:
                        _h.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton()];
                    case 4:
                        _h.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('New')];
                    case 5:
                        _h.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clickOnSaveButton()];
                    case 6:
                        _h.sent();
                        return [4 /*yield*/, protractor_1.browser.driver.sleep(1000)];
                    case 7:
                        _h.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 8: return [4 /*yield*/, _a.apply(void 0, [_h.sent()]).toBe('New')];
                    case 9:
                        _h.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 10:
                        _h.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkSaveButtonIsEnabled()];
                    case 11: return [4 /*yield*/, _b.apply(void 0, [_h.sent()]).toEqual(false)];
                    case 12:
                        _h.sent();
                        _c = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()];
                    case 13: return [4 /*yield*/, _c.apply(void 0, [_h.sent()]).toEqual('Id')];
                    case 14:
                        _h.sent();
                        _d = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkSaveAsButtonIsEnabled()];
                    case 15: return [4 /*yield*/, _d.apply(void 0, [_h.sent()]).toEqual(false)];
                    case 16:
                        _h.sent();
                        _e = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkDeleteButtonIsEnabled()];
                    case 17: return [4 /*yield*/, _e.apply(void 0, [_h.sent()]).toEqual(true)];
                    case 18:
                        _h.sent();
                        return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().clickProcessFilter()];
                    case 19:
                        _h.sent();
                        _f = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()];
                    case 20: return [4 /*yield*/, _f.apply(void 0, [_h.sent()]).toEqual('StartDate')];
                    case 21:
                        _h.sent();
                        return [4 /*yield*/, processCloudDemoPage.customProcessFilter('custom-new').clickProcessFilter()];
                    case 22:
                        _h.sent();
                        _g = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()];
                    case 23: return [4 /*yield*/, _g.apply(void 0, [_h.sent()]).toEqual('Id')];
                    case 24:
                        _h.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickDeleteButton()];
                    case 25:
                        _h.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291806] Two process filters with same name can be created when clicking the Save As button', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().clickProcessFilter()];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setSortFilterDropDown('Id')];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton()];
                    case 3:
                        _g.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('New')];
                    case 4:
                        _g.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clickOnSaveButton()];
                    case 5:
                        _g.sent();
                        return [4 /*yield*/, protractor_1.browser.driver.sleep(1000)];
                    case 6:
                        _g.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 7:
                        _g.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkCustomiseFilterHeaderIsExpanded()];
                    case 8:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 9: return [4 /*yield*/, _a.apply(void 0, [_g.sent()]).toBe('New')];
                    case 10:
                        _g.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()];
                    case 11: return [4 /*yield*/, _b.apply(void 0, [_g.sent()]).toEqual('Id')];
                    case 12:
                        _g.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setSortFilterDropDown('Name')];
                    case 13:
                        _g.sent();
                        _c = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()];
                    case 14: return [4 /*yield*/, _c.apply(void 0, [_g.sent()]).toEqual('Name')];
                    case 15:
                        _g.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton()];
                    case 16:
                        _g.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('New')];
                    case 17:
                        _g.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clickOnSaveButton()];
                    case 18:
                        _g.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 19:
                        _g.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkCustomiseFilterHeaderIsExpanded()];
                    case 20:
                        _g.sent();
                        return [4 /*yield*/, protractor_1.browser.driver.sleep(1000)];
                    case 21:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 22: return [4 /*yield*/, _d.apply(void 0, [_g.sent()]).toBe('New')];
                    case 23:
                        _g.sent();
                        _e = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()];
                    case 24: return [4 /*yield*/, _e.apply(void 0, [_g.sent()]).toEqual('Name')];
                    case 25:
                        _g.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickDeleteButton()];
                    case 26:
                        _g.sent();
                        return [4 /*yield*/, protractor_1.browser.driver.sleep(1000)];
                    case 27:
                        _g.sent();
                        return [4 /*yield*/, processCloudDemoPage.customProcessFilter('custom-new').clickProcessFilter()];
                    case 28:
                        _g.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 29:
                        _g.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkCustomiseFilterHeaderIsExpanded()];
                    case 30:
                        _g.sent();
                        _f = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()];
                    case 31: return [4 /*yield*/, _f.apply(void 0, [_g.sent()]).toEqual('Id')];
                    case 32:
                        _g.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickDeleteButton()];
                    case 33:
                        _g.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291807] A process filter is overrided when clicking on save button', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().clickProcessFilter()];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setSortFilterDropDown('Id')];
                    case 2:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed()];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton()];
                    case 4:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('New')];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clickOnSaveButton()];
                    case 6:
                        _f.sent();
                        return [4 /*yield*/, protractor_1.browser.driver.sleep(1000)];
                    case 7:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 8: return [4 /*yield*/, _a.apply(void 0, [_f.sent()]).toBe('New')];
                    case 9:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 10:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkCustomiseFilterHeaderIsExpanded()];
                    case 11:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()];
                    case 12: return [4 /*yield*/, _b.apply(void 0, [_f.sent()]).toEqual('Id')];
                    case 13:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setSortFilterDropDown('Name')];
                    case 14:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()];
                    case 15: return [4 /*yield*/, _c.apply(void 0, [_f.sent()]).toEqual('Name')];
                    case 16:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickSaveButton()];
                    case 17:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 18:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkCustomiseFilterHeaderIsExpanded()];
                    case 19:
                        _f.sent();
                        return [4 /*yield*/, protractor_1.browser.driver.sleep(1000)];
                    case 20:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 21: return [4 /*yield*/, _d.apply(void 0, [_f.sent()]).toBe('New')];
                    case 22:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()];
                    case 23: return [4 /*yield*/, _e.apply(void 0, [_f.sent()]).toEqual('Name')];
                    case 24:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickDeleteButton()];
                    case 25:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291808] A process filter is deleted when clicking on delete button', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().clickProcessFilter()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setSortFilterDropDown('Id')];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('New')];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, protractor_1.browser.driver.sleep(1000)];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clickOnSaveButton()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 8:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 9: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe('New')];
                    case 10:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()];
                    case 11: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual('Id')];
                    case 12:
                        _d.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickDeleteButton()];
                    case 13:
                        _d.sent();
                        return [4 /*yield*/, protractor_1.browser.driver.sleep(1000)];
                    case 14:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 15: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe('All Processes')];
                    case 16:
                        _d.sent();
                        return [4 /*yield*/, processCloudDemoPage.customProcessFilter('New').checkProcessFilterNotDisplayed()];
                    case 17:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291810] Process filter should not be created when process filter dialog is closed', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().clickProcessFilter()];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setSortFilterDropDown('Id')];
                    case 2:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed()];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton()];
                    case 4:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('Cancel')];
                    case 5:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().getFilterName()];
                    case 6: return [4 /*yield*/, _a.apply(void 0, [_f.sent()]).toEqual('Cancel')];
                    case 7:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clickOnCancelButton()];
                    case 8:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.customProcessFilter('Cancel').checkProcessFilterNotDisplayed()];
                    case 9:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 10: return [4 /*yield*/, _b.apply(void 0, [_f.sent()]).toEqual('All Processes')];
                    case 11:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.runningProcessesFilter().clickProcessFilter()];
                    case 12:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 13: return [4 /*yield*/, _c.apply(void 0, [_f.sent()]).toEqual('Running Processes')];
                    case 14:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 15:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().clickProcessFilter()];
                    case 16:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                    case 17: return [4 /*yield*/, _d.apply(void 0, [_f.sent()]).toEqual('All Processes')];
                    case 18:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()];
                    case 19: return [4 /*yield*/, _e.apply(void 0, [_f.sent()]).toEqual('StartDate')];
                    case 20:
                        _f.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 21:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291811] Save button of process filter dialog should be disabled when process name is empty', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().clickProcessFilter()];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setSortFilterDropDown('Id')];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton()];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clearFilterName()];
                    case 5:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().getFilterName()];
                    case 6: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toEqual('')];
                    case 7:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().checkSaveButtonIsEnabled()];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toEqual(false)];
                    case 9:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().checkCancelButtonIsEnabled()];
                    case 10: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toEqual(true)];
                    case 11:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clickOnCancelButton()];
                    case 12:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                    case 13:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().checkCustomiseFilterHeaderIsExpanded()];
                    case 14:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setSortFilterDropDown('StartDate')];
                    case 15:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().getSortFilterDropDownValue()];
                    case 16: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toEqual('StartDate')];
                    case 17:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickSaveButton()];
                    case 18:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291809] Process filter dialog is displayed when clicking on Save As button', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().clickProcessFilter()];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setSortFilterDropDown('Name')];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.allProcessesFilter().checkProcessFilterIsDisplayed()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton()];
                    case 4:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().checkCancelButtonIsEnabled()];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toEqual(true)];
                    case 6:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().checkSaveButtonIsEnabled()];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toEqual(true)];
                    case 8:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().getTitle()];
                    case 9: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toEqual('Save filter as')];
                    case 10:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().getFilterName()];
                    case 11: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toEqual('All Processes')];
                    case 12:
                        _e.sent();
                        return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().clickOnCancelButton()];
                    case 13:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=edit-process-filters-component.e2e.js.map