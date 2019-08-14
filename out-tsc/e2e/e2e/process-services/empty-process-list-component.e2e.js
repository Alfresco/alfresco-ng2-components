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
var resources = require("../util/resources");
var adf_testing_1 = require("@alfresco/adf-testing");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var processServicesPage_1 = require("../pages/adf/process-services/processServicesPage");
var processFiltersPage_1 = require("../pages/adf/process-services/processFiltersPage");
var processDetailsPage_1 = require("../pages/adf/process-services/processDetailsPage");
var processListPage_1 = require("../pages/adf/process-services/processListPage");
var startProcessPage_1 = require("../pages/adf/process-services/startProcessPage");
var js_api_1 = require("@alfresco/js-api");
var apps_actions_1 = require("../actions/APS/apps.actions");
var users_actions_1 = require("../actions/users.actions");
describe('Empty Process List Test', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var processServicesPage = new processServicesPage_1.ProcessServicesPage();
    var processFiltersPage = new processFiltersPage_1.ProcessFiltersPage();
    var processDetailsPage = new processDetailsPage_1.ProcessDetailsPage();
    var processListPage = new processListPage_1.ProcessListPage();
    var startProcessPage = new startProcessPage_1.StartProcessPage();
    var appA = resources.Files.APP_WITH_PROCESSES;
    var appB = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var user;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var apps, users;
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
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApi, appA.file_location)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApi, appB.file_location)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(user)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260494] Should add process to list when a process is created', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, processServicesPage.checkApsContainer()];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, processServicesPage.goToApp(appA.title)];
                case 3: return [4 /*yield*/, (_g.sent()).clickProcessButton()];
                case 4:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, processListPage.checkProcessListTitleIsDisplayed()];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_g.sent()]).toEqual('No Processes Found')];
                case 6:
                    _g.sent();
                    _b = expect;
                    return [4 /*yield*/, processDetailsPage.checkProcessDetailsMessage()];
                case 7: return [4 /*yield*/, _b.apply(void 0, [_g.sent()]).toEqual('No process details found')];
                case 8:
                    _g.sent();
                    return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                case 9:
                    _g.sent();
                    return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                case 10:
                    _g.sent();
                    return [4 /*yield*/, startProcessPage.selectFromProcessDropdown(appA.process_wse_name)];
                case 11:
                    _g.sent();
                    return [4 /*yield*/, startProcessPage.clickStartProcessButton()];
                case 12:
                    _g.sent();
                    _c = expect;
                    return [4 /*yield*/, processFiltersPage.numberOfProcessRows()];
                case 13: return [4 /*yield*/, _c.apply(void 0, [_g.sent()]).toEqual(1)];
                case 14:
                    _g.sent();
                    return [4 /*yield*/, processDetailsPage.checkProcessDetailsCard()];
                case 15:
                    _g.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 16:
                    _g.sent();
                    return [4 /*yield*/, processServicesPage.checkApsContainer()];
                case 17:
                    _g.sent();
                    return [4 /*yield*/, processServicesPage.goToApp(appB.title)];
                case 18: return [4 /*yield*/, (_g.sent()).clickProcessButton()];
                case 19:
                    _g.sent();
                    _d = expect;
                    return [4 /*yield*/, processListPage.checkProcessListTitleIsDisplayed()];
                case 20: return [4 /*yield*/, _d.apply(void 0, [_g.sent()]).toEqual('No Processes Found')];
                case 21:
                    _g.sent();
                    _e = expect;
                    return [4 /*yield*/, processDetailsPage.checkProcessDetailsMessage()];
                case 22: return [4 /*yield*/, _e.apply(void 0, [_g.sent()]).toEqual('No process details found')];
                case 23:
                    _g.sent();
                    return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                case 24:
                    _g.sent();
                    return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                case 25:
                    _g.sent();
                    return [4 /*yield*/, startProcessPage.selectFromProcessDropdown(appB.processName)];
                case 26:
                    _g.sent();
                    return [4 /*yield*/, startProcessPage.clickStartProcessButton()];
                case 27:
                    _g.sent();
                    _f = expect;
                    return [4 /*yield*/, processFiltersPage.numberOfProcessRows()];
                case 28: return [4 /*yield*/, _f.apply(void 0, [_g.sent()]).toEqual(1)];
                case 29:
                    _g.sent();
                    return [4 /*yield*/, processDetailsPage.checkProcessDetailsCard()];
                case 30:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=empty-process-list-component.e2e.js.map