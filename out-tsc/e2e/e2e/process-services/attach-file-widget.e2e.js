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
var CONSTANTS = require("../util/constants");
var fileModel_1 = require("../models/ACS/fileModel");
var protractor_1 = require("protractor");
var resources = require("../util/resources");
var viewerPage_1 = require("../pages/adf/viewerPage");
var apps_actions_1 = require("../actions/APS/apps.actions");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var js_api_1 = require("@alfresco/js-api");
var users_actions_1 = require("../actions/users.actions");
describe('Start Task - Task App', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var viewerPage = new viewerPage_1.ViewerPage();
    var widget = new adf_testing_1.Widget();
    var taskPage = new tasksPage_1.TasksPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var processUserModel;
    var app = resources.Files.WIDGETS_SMOKE_TEST;
    var pdfFile = new fileModel_1.FileModel({ 'name': resources.Files.ADF_DOCUMENTS.PDF.file_name });
    var appFields = app.form_fields;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var users, apps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    users = new users_actions_1.UsersActions();
                    apps = new apps_actions_1.AppsActions();
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
                    _a.sent();
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
                case 0:
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'BPM',
                        hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                    });
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C274690] Should be able to open a file attached to a start form', function () { return __awaiter(_this, void 0, void 0, function () {
        var newTask;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 2: return [4 /*yield*/, (_a.sent()).clickTasksButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, taskPage.createNewTask()];
                case 5:
                    newTask = _a.sent();
                    return [4 /*yield*/, newTask.addName('View file')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, newTask.addForm(app.formName)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, newTask.clickStartButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, widget.attachFileWidget().attachFile(appFields.attachFile_id, protractor_1.browser.params.testConfig.main.rootPath + pdfFile.location)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, widget.attachFileWidget().checkFileIsAttached(appFields.attachFile_id, pdfFile.name)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, widget.attachFileWidget().viewFile(pdfFile.name)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileContent('1', pdfFile.firstPageText)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkCloseButtonIsDisplayed()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed('View file')];
                case 15:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=attach-file-widget.e2e.js.map