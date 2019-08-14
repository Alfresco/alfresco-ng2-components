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
var processServiceTabBarPage_1 = require("../pages/adf/process-services/processServiceTabBarPage");
var appSettingsToggles_1 = require("../pages/adf/process-services/dialog/appSettingsToggles");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var js_api_1 = require("@alfresco/js-api");
var users_actions_1 = require("../actions/users.actions");
describe('New Process Filters', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var processFiltersPage = new processFiltersPage_1.ProcessFiltersPage();
    var processServiceTabBarPage = new processServiceTabBarPage_1.ProcessServiceTabBarPage();
    var appSettingsToggles = new appSettingsToggles_1.AppSettingsToggles();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var tenantId, user, filterId, customProcessFilter;
    var processFilter = {
        running: 'Running',
        all: 'All',
        completed: 'Completed',
        new_filter: 'New Filter',
        edited: 'Edited Filter',
        new_icon: 'New icon',
        edit_icon: 'Edit icon',
        deleted: 'To delete'
    };
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
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
                    tenantId = user.tenantId;
                    return [4 /*yield*/, this.alfrescoJsApi.login(user.email, user.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(user)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279965] Should be able to view default filters on ADF', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 2: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.running)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.all)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.completed)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260473] Should be able to create a new filter on APS and display it on ADF', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                        'appId': null,
                        'name': processFilter.new_filter,
                        'icon': 'glyphicon-random',
                        'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
                    })];
                case 1:
                    customProcessFilter = _a.sent();
                    filterId = customProcessFilter.id;
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 2: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 3: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.new_filter)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286450] Should display the process filter icon when a custom filter is added', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                        'appId': null,
                        'name': processFilter.new_icon,
                        'icon': 'glyphicon-cloud',
                        'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
                    })];
                case 1:
                    customProcessFilter = _b.sent();
                    filterId = customProcessFilter.id;
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 2: return [4 /*yield*/, (_b.sent()).goToTaskApp()];
                case 3: return [4 /*yield*/, (_b.sent()).clickProcessButton()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.new_icon)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, processServiceTabBarPage.clickSettingsButton()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, appSettingsToggles.enableProcessFiltersIcon()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.new_icon)];
                case 9:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, processFiltersPage.getFilterIcon(processFilter.new_icon)];
                case 10: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('cloud')];
                case 11:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260474] Should be able to edit a filter on APS and check it on ADF', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.alfrescoJsApi.activiti.userFiltersApi.updateUserProcessInstanceFilter(filterId, {
                        'appId': null,
                        'name': processFilter.edited,
                        'icon': 'glyphicon-random',
                        'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
                    });
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 2: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.edited)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286451] Should display changes on a process filter when this filter icon is edited', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                        'appId': null,
                        'name': processFilter.edit_icon,
                        'icon': 'glyphicon-random',
                        'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
                    })];
                case 1:
                    customProcessFilter = _b.sent();
                    filterId = customProcessFilter.id;
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 2: return [4 /*yield*/, (_b.sent()).goToTaskApp()];
                case 3: return [4 /*yield*/, (_b.sent()).clickProcessButton()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.edit_icon)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.updateUserProcessInstanceFilter(filterId, {
                            'appId': null,
                            'name': processFilter.edit_icon,
                            'icon': 'glyphicon-cloud',
                            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
                        })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 7: return [4 /*yield*/, (_b.sent()).goToTaskApp()];
                case 8: return [4 /*yield*/, (_b.sent()).clickProcessButton()];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.edit_icon)];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, processServiceTabBarPage.clickSettingsButton()];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, appSettingsToggles.enableProcessFiltersIcon()];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.edit_icon)];
                case 14:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, processFiltersPage.getFilterIcon(processFilter.edit_icon)];
                case 15: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('cloud')];
                case 16:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286452] Should display process filter icons only when showIcon property is set on true', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_b.sent()).goToTaskApp()];
                case 2: return [4 /*yield*/, (_b.sent()).clickProcessButton()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterHasNoIcon(processFilter.all)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, processServiceTabBarPage.clickSettingsButton()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, appSettingsToggles.enableProcessFiltersIcon()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsDisplayed(processFilter.all)];
                case 8:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, processFiltersPage.getFilterIcon(processFilter.all)];
                case 9: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('dashboard')];
                case 10:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260475] Should be able to delete a filter on APS and check it on ADF', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                        'appId': null,
                        'name': processFilter.deleted,
                        'icon': 'glyphicon-random',
                        'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
                    })];
                case 1:
                    customProcessFilter = _a.sent();
                    filterId = customProcessFilter.id;
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.userFiltersApi.deleteUserProcessInstanceFilter(filterId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 3: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 4: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.checkFilterIsNotDisplayed(processFilter.deleted)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=custom-process-filters.e2e.js.map