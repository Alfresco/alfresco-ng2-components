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
var processFiltersPage_1 = require("../pages/adf/process-services/processFiltersPage");
var processDetailsPage_1 = require("../pages/adf/process-services/processDetailsPage");
var attachmentListPage_1 = require("../pages/adf/process-services/attachmentListPage");
var viewerPage_1 = require("../pages/adf/viewerPage");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var users_actions_1 = require("../actions/users.actions");
var apps_actions_1 = require("../actions/APS/apps.actions");
var fileModel_1 = require("../models/ACS/fileModel");
var protractor_1 = require("protractor");
describe('Attachment list action menu for processes', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var processFiltersPage = new processFiltersPage_1.ProcessFiltersPage();
    var processDetailsPage = new processDetailsPage_1.ProcessDetailsPage();
    var attachmentListPage = new attachmentListPage_1.AttachmentListPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var viewerPage = new viewerPage_1.ViewerPage();
    var app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var pngFile = new fileModel_1.FileModel({
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location,
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name
    });
    var downloadedPngFile = pngFile.name;
    var tenantId, appId;
    var processName = {
        active: 'Active Process',
        completed: 'Completed Process',
        taskApp: 'Task App Name',
        emptyList: 'Empty List',
        dragDrop: 'Drag and Drop'
    };
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var apps, users, user, importedApp;
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
                    tenantId = user.tenantId;
                    return [4 /*yield*/, this.alfrescoJsApi.login(user.email, user.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location)];
                case 4:
                    importedApp = _a.sent();
                    appId = importedApp.id;
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, importedApp, processName.completed)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, importedApp, processName.active)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', processName.taskApp)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', processName.emptyList)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, 'Task App', processName.dragDrop)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(user)];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260228] Should be able to access options of a file attached to an active process', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_b.sent()).goToApp(app.title)];
                case 2: return [4 /*yield*/, (_b.sent()).clickProcessButton()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.selectFromProcessList(processName.active)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, attachmentListPage.clickAttachFileButton(pngFile.location)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, attachmentListPage.viewFile(pngFile.name)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, viewerPage.checkFileNameIsDisplayed(pngFile.name)];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.selectFromProcessList(processName.active)];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, attachmentListPage.doubleClickFile(pngFile.name)];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, viewerPage.checkFileNameIsDisplayed(pngFile.name)];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.selectFromProcessList(processName.active)];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, attachmentListPage.downloadFile(pngFile.name)];
                case 17:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                case 18:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, adf_testing_1.FileBrowserUtil.isFileDownloaded(downloadedPngFile)];
                case 19: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true)];
                case 20:
                    _b.sent();
                    return [4 /*yield*/, attachmentListPage.removeFile(pngFile.name)];
                case 21:
                    _b.sent();
                    return [4 /*yield*/, attachmentListPage.checkFileIsRemoved(pngFile.name)];
                case 22:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279886] Should be able to access options of a file attached to a completed process', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_b.sent()).goToApp(app.title)];
                case 2: return [4 /*yield*/, (_b.sent()).clickProcessButton()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.selectFromProcessList(processName.completed)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, attachmentListPage.clickAttachFileButton(pngFile.location)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, processDetailsPage.clickCancelProcessButton()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.clickCompletedFilterButton()];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, attachmentListPage.checkAttachFileButtonIsNotDisplayed()];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, attachmentListPage.viewFile(pngFile.name)];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, viewerPage.checkFileNameIsDisplayed(pngFile.name)];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, processFiltersPage.clickCompletedFilterButton()];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, attachmentListPage.downloadFile(pngFile.name)];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                case 17:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, adf_testing_1.FileBrowserUtil.isFileDownloaded(downloadedPngFile)];
                case 18: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true)];
                case 19:
                    _b.sent();
                    return [4 /*yield*/, attachmentListPage.removeFile(pngFile.name)];
                case 20:
                    _b.sent();
                    return [4 /*yield*/, attachmentListPage.checkFileIsRemoved(pngFile.name)];
                case 21:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277296] Should allow upload file when clicking on \'add\' icon', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 2: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.selectFromProcessList(processName.taskApp)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, attachmentListPage.clickAttachFileButton(pngFile.location)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, attachmentListPage.checkFileIsAttached(pngFile.name)];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260235] Should empty list component be displayed when no file is attached', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 2: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, processFiltersPage.selectFromProcessList(processName.emptyList)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, attachmentListPage.checkEmptyAttachmentList()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, attachmentListPage.clickAttachFileButton(pngFile.location)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, attachmentListPage.checkFileIsAttached(pngFile.name)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, attachmentListPage.removeFile(pngFile.name)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, attachmentListPage.checkFileIsRemoved(pngFile.name)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, attachmentListPage.checkEmptyAttachmentList()];
                case 11:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=process-attachmentList-actionMenu.e2e.js.map