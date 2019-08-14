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
var tasksPage_1 = require("../pages/adf/process-services/tasksPage");
var adf_testing_2 = require("@alfresco/adf-testing");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var CONSTANTS = require("../util/constants");
var js_api_1 = require("@alfresco/js-api");
var apps_actions_1 = require("../actions/APS/apps.actions");
var users_actions_1 = require("../actions/users.actions");
var resources = require("../util/resources");
var protractor_1 = require("protractor");
describe('Items per page set to 15 and adding of tasks', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var taskPage = new tasksPage_1.TasksPage();
    var paginationPage = new adf_testing_2.PaginationPage();
    var processUserModel;
    var app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var currentPage = 1;
    var nrOfTasks = 25;
    var totalPages = 2;
    var i;
    var resultApp;
    var apps = new apps_actions_1.AppsActions();
    var itemsPerPage = {
        fifteen: '15',
        fifteenValue: 15
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
                    if (!(i < (nrOfTasks - 5))) return [3 /*break*/, 8];
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
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260306] Items per page set to 15 and adding of tasks', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, new navigationBarPage_1.NavigationBarPage().navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_l.sent()).goToTaskApp()];
                case 2:
                    _l.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS)];
                case 3:
                    _l.sent();
                    return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.fifteen)];
                case 4:
                    _l.sent();
                    _a = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_l.sent()]).toEqual(itemsPerPage.fifteen)];
                case 6:
                    _l.sent();
                    _b = expect;
                    return [4 /*yield*/, paginationPage.getCurrentPage()];
                case 7: return [4 /*yield*/, _b.apply(void 0, [_l.sent()]).toEqual('Page ' + currentPage)];
                case 8:
                    _l.sent();
                    _c = expect;
                    return [4 /*yield*/, paginationPage.getTotalPages()];
                case 9: return [4 /*yield*/, _c.apply(void 0, [_l.sent()]).toEqual('of ' + totalPages)];
                case 10:
                    _l.sent();
                    _d = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 11: return [4 /*yield*/, _d.apply(void 0, [_l.sent()]).toEqual('Showing 1-' + itemsPerPage.fifteenValue + ' of ' + (nrOfTasks - 5))];
                case 12:
                    _l.sent();
                    _e = expect;
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().numberOfRows()];
                case 13: return [4 /*yield*/, _e.apply(void 0, [_l.sent()]).toBe(itemsPerPage.fifteenValue)];
                case 14:
                    _l.sent();
                    i;
                    _l.label = 15;
                case 15:
                    if (!(i < nrOfTasks)) return [3 /*break*/, 18];
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, resultApp)];
                case 16:
                    _l.sent();
                    _l.label = 17;
                case 17:
                    i++;
                    return [3 /*break*/, 15];
                case 18:
                    currentPage++;
                    return [4 /*yield*/, paginationPage.clickOnNextPage()];
                case 19:
                    _l.sent();
                    _f = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 20: return [4 /*yield*/, _f.apply(void 0, [_l.sent()]).toEqual(itemsPerPage.fifteen)];
                case 21:
                    _l.sent();
                    _g = expect;
                    return [4 /*yield*/, paginationPage.getCurrentPage()];
                case 22: return [4 /*yield*/, _g.apply(void 0, [_l.sent()]).toEqual('Page ' + currentPage)];
                case 23:
                    _l.sent();
                    _h = expect;
                    return [4 /*yield*/, paginationPage.getTotalPages()];
                case 24: return [4 /*yield*/, _h.apply(void 0, [_l.sent()]).toEqual('of ' + totalPages)];
                case 25:
                    _l.sent();
                    _j = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 26: return [4 /*yield*/, _j.apply(void 0, [_l.sent()]).toEqual('Showing 16-' + nrOfTasks + ' of ' + nrOfTasks)];
                case 27:
                    _l.sent();
                    _k = expect;
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().numberOfRows()];
                case 28: return [4 /*yield*/, _k.apply(void 0, [_l.sent()]).toBe(nrOfTasks - itemsPerPage.fifteenValue)];
                case 29:
                    _l.sent();
                    return [4 /*yield*/, paginationPage.checkNextPageButtonIsDisabled()];
                case 30:
                    _l.sent();
                    return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsEnabled()];
                case 31:
                    _l.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=pagination-tasklist-addingTasks.e2e.js.map