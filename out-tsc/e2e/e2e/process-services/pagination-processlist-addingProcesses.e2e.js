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
var adf_testing_2 = require("@alfresco/adf-testing");
var processFiltersPage_1 = require("../pages/adf/process-services/processFiltersPage");
var processDetailsPage_1 = require("../pages/adf/process-services/processDetailsPage");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var apps_actions_1 = require("../actions/APS/apps.actions");
var users_actions_1 = require("../actions/users.actions");
var protractor_1 = require("protractor");
describe('Process List - Pagination when adding processes', function () {
    var itemsPerPage = {
        fifteen: '15',
        fifteenValue: 15
    };
    var loginPage = new adf_testing_1.LoginPage();
    var paginationPage = new adf_testing_2.PaginationPage();
    var processFiltersPage = new processFiltersPage_1.ProcessFiltersPage();
    var processDetailsPage = new processDetailsPage_1.ProcessDetailsPage();
    var processUserModel;
    var app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var nrOfProcesses = 25;
    var page, totalPages;
    var i;
    var apps = new apps_actions_1.AppsActions();
    var resultApp;
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
                    processUserModel = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(processUserModel.email, processUserModel.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location)];
                case 4:
                    resultApp = _a.sent();
                    i = 0;
                    _a.label = 5;
                case 5:
                    if (!(i < (nrOfProcesses - 5))) return [3 /*break*/, 8];
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, resultApp)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8: return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(processUserModel)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, new navigationBarPage_1.NavigationBarPage().navigateToProcessServicesPage()];
                case 10: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 11: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                case 12:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C261046] Should keep Items per page after adding processes', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                case 1:
                    _l.sent();
                    return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                case 2:
                    _l.sent();
                    totalPages = 2;
                    page = 1;
                    return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.fifteen)];
                case 3:
                    _l.sent();
                    return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                case 4:
                    _l.sent();
                    return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                case 5:
                    _l.sent();
                    _a = expect;
                    return [4 /*yield*/, paginationPage.getCurrentPage()];
                case 6: return [4 /*yield*/, _a.apply(void 0, [_l.sent()]).toEqual('Page ' + page)];
                case 7:
                    _l.sent();
                    _b = expect;
                    return [4 /*yield*/, paginationPage.getTotalPages()];
                case 8: return [4 /*yield*/, _b.apply(void 0, [_l.sent()]).toEqual('of ' + totalPages)];
                case 9:
                    _l.sent();
                    _c = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 10: return [4 /*yield*/, _c.apply(void 0, [_l.sent()]).toEqual(itemsPerPage.fifteen)];
                case 11:
                    _l.sent();
                    _d = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 12: return [4 /*yield*/, _d.apply(void 0, [_l.sent()]).toEqual('Showing 1-' + itemsPerPage.fifteenValue * page + ' of ' + (nrOfProcesses - 5))];
                case 13:
                    _l.sent();
                    _e = expect;
                    return [4 /*yield*/, processFiltersPage.numberOfProcessRows()];
                case 14: return [4 /*yield*/, _e.apply(void 0, [_l.sent()]).toBe(itemsPerPage.fifteenValue)];
                case 15:
                    _l.sent();
                    return [4 /*yield*/, paginationPage.checkNextPageButtonIsEnabled()];
                case 16:
                    _l.sent();
                    return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                case 17:
                    _l.sent();
                    i;
                    _l.label = 18;
                case 18:
                    if (!(i < nrOfProcesses)) return [3 /*break*/, 21];
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, resultApp)];
                case 19:
                    _l.sent();
                    _l.label = 20;
                case 20:
                    i++;
                    return [3 /*break*/, 18];
                case 21:
                    page++;
                    return [4 /*yield*/, paginationPage.clickOnNextPage()];
                case 22:
                    _l.sent();
                    return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                case 23:
                    _l.sent();
                    return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                case 24:
                    _l.sent();
                    _f = expect;
                    return [4 /*yield*/, paginationPage.getCurrentPage()];
                case 25: return [4 /*yield*/, _f.apply(void 0, [_l.sent()]).toEqual('Page ' + page)];
                case 26:
                    _l.sent();
                    _g = expect;
                    return [4 /*yield*/, paginationPage.getTotalPages()];
                case 27: return [4 /*yield*/, _g.apply(void 0, [_l.sent()]).toEqual('of ' + totalPages)];
                case 28:
                    _l.sent();
                    _h = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 29: return [4 /*yield*/, _h.apply(void 0, [_l.sent()]).toEqual(itemsPerPage.fifteen)];
                case 30:
                    _l.sent();
                    _j = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 31: return [4 /*yield*/, _j.apply(void 0, [_l.sent()]).toEqual('Showing 16-' + nrOfProcesses + ' of ' + nrOfProcesses)];
                case 32:
                    _l.sent();
                    _k = expect;
                    return [4 /*yield*/, processFiltersPage.numberOfProcessRows()];
                case 33: return [4 /*yield*/, _k.apply(void 0, [_l.sent()]).toBe(nrOfProcesses - itemsPerPage.fifteenValue)];
                case 34:
                    _l.sent();
                    return [4 /*yield*/, paginationPage.checkNextPageButtonIsDisabled()];
                case 35:
                    _l.sent();
                    return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsEnabled()];
                case 36:
                    _l.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=pagination-processlist-addingProcesses.e2e.js.map