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
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var versionManagerPage_1 = require("../../pages/adf/versionManagerPage");
var uploadDialog_1 = require("../../pages/adf/dialog/uploadDialog");
var contentServicesPage_1 = require("../../pages/adf/contentServicesPage");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var fileModel_1 = require("../../models/ACS/fileModel");
var protractor_2 = require("protractor");
var resources = require("../../util/resources");
var js_api_1 = require("@alfresco/js-api");
var node_actions_1 = require("../../actions/ACS/node.actions");
var CONSTANTS = require("../../util/constants");
describe('Version component permissions', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var versionManagePage = new versionManagerPage_1.VersionManagePage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var uploadDialog = new uploadDialog_1.UploadDialog();
    var notificationHistoryPage = new adf_testing_1.NotificationHistoryPage();
    var contentServices = new contentServicesPage_1.ContentServicesPage();
    var site;
    var acsUser = new acsUserModel_1.AcsUserModel();
    var consumerUser = new acsUserModel_1.AcsUserModel();
    var collaboratorUser = new acsUserModel_1.AcsUserModel();
    var contributorUser = new acsUserModel_1.AcsUserModel();
    var managerUser = new acsUserModel_1.AcsUserModel();
    var fileCreatorUser = new acsUserModel_1.AcsUserModel();
    var newVersionFile = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_B.file_location
    });
    var lockFileModel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG_C.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_C.file_location
    });
    var differentCreatorFile = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG_D.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_D.file_location
    });
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_2.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var nodeActions = new node_actions_1.NodeActions();
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var lockFileUploaded;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_2.browser.params.testConfig.adf.adminEmail, protractor_2.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(consumerUser)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(collaboratorUser)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(contributorUser)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(managerUser)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(fileCreatorUser)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.createSite({
                            title: adf_testing_1.StringUtil.generateRandomString(),
                            visibility: 'PUBLIC'
                        })];
                case 8:
                    site = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
                            id: consumerUser.id,
                            role: CONSTANTS.CS_USER_ROLES.CONSUMER
                        })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
                            id: collaboratorUser.id,
                            role: CONSTANTS.CS_USER_ROLES.COLLABORATOR
                        })];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
                            id: contributorUser.id,
                            role: CONSTANTS.CS_USER_ROLES.CONTRIBUTOR
                        })];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
                            id: managerUser.id,
                            role: CONSTANTS.CS_USER_ROLES.MANAGER
                        })];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
                            id: fileCreatorUser.id,
                            role: CONSTANTS.CS_USER_ROLES.MANAGER
                        })];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(lockFileModel.location, lockFileModel.name, site.entry.guid)];
                case 14:
                    lockFileUploaded = _a.sent();
                    Object.assign(lockFileModel, lockFileUploaded.entry);
                    nodeActions.lockNode(this.alfrescoJsApi, lockFileModel.id);
                    return [4 /*yield*/, this.alfrescoJsApi.login(fileCreatorUser.id, fileCreatorUser.password)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(differentCreatorFile.location, differentCreatorFile.name, site.entry.guid)];
                case 16:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Manager', function () {
        var sameCreatorFile = new fileModel_1.FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
        });
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var sameCreatorFileUploaded;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(managerUser.id, managerUser.password)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(sameCreatorFile.location, sameCreatorFile.name, site.entry.guid)];
                    case 2:
                        sameCreatorFileUploaded = _a.sent();
                        Object.assign(sameCreatorFile, sameCreatorFileUploaded.entry);
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(managerUser)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.openContentServicesFolder(site.entry.guid)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.nodes.deleteNode(sameCreatorFile.id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277200] should a user with Manager permission be able to upload a new version for a file with different creator', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, contentServices.versionManagerContent(differentCreatorFile.name)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(versionManagePage.showNewVersionButton)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.uploadNewVersionFile(newVersionFile.location)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.checkFileVersionExist('1.1')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, versionManagePage.getFileVersionName('1.1')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual(newVersionFile.name)];
                    case 6:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, versionManagePage.getFileVersionDate('1.1')];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).not.toBeUndefined()];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.deleteFileVersion('1.1')];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.clickAcceptConfirm()];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.checkFileVersionNotExist('1.1')];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.closeVersionDialog()];
                    case 12:
                        _c.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 13:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277204] Should be disabled the option for locked file', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, contentServices.getDocumentList().rightClickOnRow(lockFileModel.name)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contentServices.checkContextActionIsEnabled('Manage versions')];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(false, 'Manage versions is enabled')];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Consumer', function () {
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(consumerUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.openContentServicesFolder(site.entry.guid)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277197] Should a user with Consumer permission not be able to upload a new version for a file with different creator', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServices.versionManagerContent(differentCreatorFile.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains("You don't have access to do this")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277201] Should a user with Consumer permission not be able to upload a new version for a locked file', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, contentServices.getDocumentList().rightClickOnRow(lockFileModel.name)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contentServices.checkContextActionIsEnabled('Manage versions')];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(false, 'Manage version is enabled')];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Contributor', function () {
        var sameCreatorFile = new fileModel_1.FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
        });
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var sameCreatorFileUploaded;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(contributorUser.id, contributorUser.password)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(sameCreatorFile.location, sameCreatorFile.name, site.entry.guid)];
                    case 2:
                        sameCreatorFileUploaded = _a.sent();
                        Object.assign(sameCreatorFile, sameCreatorFileUploaded.entry);
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(contributorUser)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.openContentServicesFolder(site.entry.guid)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.nodes.deleteNode(sameCreatorFile.id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277177] Should a user with Contributor permission be able to upload a new version for the created file', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, contentServices.versionManagerContent(sameCreatorFile.name)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(versionManagePage.showNewVersionButton)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.uploadNewVersionFile(newVersionFile.location)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.checkFileVersionExist('1.1')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, versionManagePage.getFileVersionName('1.1')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual(newVersionFile.name)];
                    case 6:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, versionManagePage.getFileVersionDate('1.1')];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).not.toBeUndefined()];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.deleteFileVersion('1.1')];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.clickAcceptConfirm()];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.checkFileVersionNotExist('1.1')];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.closeVersionDialog()];
                    case 12:
                        _c.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 13:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277198] Should a user with Contributor permission not be able to upload a new version for a file with different creator', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServices.versionManagerContent(differentCreatorFile.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains("You don't have access to do this")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277202] Should be disabled the option for a locked file', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, contentServices.getDocumentList().rightClickOnRow(lockFileModel.name)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contentServices.checkContextActionIsEnabled('Manage versions')];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(false, 'Manage versions is enabled')];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Collaborator', function () {
        var sameCreatorFile = new fileModel_1.FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
        });
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var sameCreatorFileUploaded;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(collaboratorUser.id, collaboratorUser.password)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(sameCreatorFile.location, sameCreatorFile.name, site.entry.guid)];
                    case 2:
                        sameCreatorFileUploaded = _a.sent();
                        Object.assign(sameCreatorFile, sameCreatorFileUploaded.entry);
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(collaboratorUser)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.openContentServicesFolder(site.entry.guid)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.nodes.deleteNode(sameCreatorFile.id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277195] Should a user with Collaborator permission be able to upload a new version for the created file', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, contentServices.versionManagerContent(sameCreatorFile.name)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(versionManagePage.showNewVersionButton)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.uploadNewVersionFile(newVersionFile.location)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.checkFileVersionExist('1.1')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, versionManagePage.getFileVersionName('1.1')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual(newVersionFile.name)];
                    case 6:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, versionManagePage.getFileVersionDate('1.1')];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).not.toBeUndefined()];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.deleteFileVersion('1.1')];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.clickAcceptConfirm()];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.checkFileVersionNotExist('1.1')];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, versionManagePage.closeVersionDialog()];
                    case 12:
                        _c.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 13:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277199] should a user with Collaborator permission be able to upload a new version for a file with different creator', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, contentServices.versionManagerContent(differentCreatorFile.name)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(versionManagePage.showNewVersionButton)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, versionManagePage.uploadNewVersionFile(newVersionFile.location)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, versionManagePage.checkFileVersionExist('1.1')];
                    case 4:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, versionManagePage.getFileVersionName('1.1')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toEqual(newVersionFile.name)];
                    case 6:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, versionManagePage.getFileVersionDate('1.1')];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).not.toBeUndefined()];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, versionManagePage.clickActionButton('1.1')];
                    case 9:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, protractor_1.element(protractor_1.by.css("[id=\"adf-version-list-action-delete-1.1\"]")).isEnabled()];
                    case 10: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(false)];
                    case 11:
                        _d.sent();
                        return [4 /*yield*/, versionManagePage.closeActionsMenu()];
                    case 12:
                        _d.sent();
                        return [4 /*yield*/, versionManagePage.closeVersionDialog()];
                    case 13:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277203] Should a user with Collaborator permission not be able to upload a new version for a locked file', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, contentServices.getDocumentList().rightClickOnRow(lockFileModel.name)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contentServices.checkContextActionIsEnabled('Manage versions')];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(false, 'Manage versions is enabled')];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=version-permissions.e2e.js.map