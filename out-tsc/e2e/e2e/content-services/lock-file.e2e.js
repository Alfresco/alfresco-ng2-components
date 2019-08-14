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
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var contentServicesPage_1 = require("../pages/adf/contentServicesPage");
var lockFilePage_1 = require("../pages/adf/lockFilePage");
var acsUserModel_1 = require("../models/ACS/acsUserModel");
var fileModel_1 = require("../models/ACS/fileModel");
var CONSTANTS = require("../util/constants");
var protractor_1 = require("protractor");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
describe('Lock File', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var lockFilePage = new lockFilePage_1.LockFilePage();
    var contentServices = new contentServicesPage_1.ContentServicesPage();
    var adminUser = new acsUserModel_1.AcsUserModel();
    var managerUser = new acsUserModel_1.AcsUserModel();
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var pngFileModel = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    var pngFileToLock = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG_B.file_location
    });
    var nodeId, site, documentLibrary, lockedFileNodeId;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var resultNode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(adminUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(managerUser)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(adminUser.id, adminUser.password)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.createSite({
                            title: adf_testing_1.StringUtil.generateRandomString(),
                            visibility: 'PRIVATE'
                        })];
                case 5:
                    site = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.getNodeChildren(site.entry.guid)];
                case 6:
                    resultNode = _a.sent();
                    documentLibrary = resultNode.list.entries[0].entry.id;
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
                            id: managerUser.id,
                            role: CONSTANTS.CS_USER_ROLES.MANAGER
                        })];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Lock file interaction with the UI', function () {
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var pngLockedUploadedFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, uploadActions.uploadFile(pngFileToLock.location, pngFileToLock.name, documentLibrary)];
                    case 1:
                        pngLockedUploadedFile = _a.sent();
                        lockedFileNodeId = pngLockedUploadedFile.entry.id;
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            var pngUploadedFile, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, documentLibrary)];
                    case 1:
                        pngUploadedFile = _a.sent();
                        nodeId = pngUploadedFile.entry.id;
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(adminUser)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.openContentServicesFolder(documentLibrary)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServices.waitForTableBody()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.alfrescoJsApi.login(adminUser.id, adminUser.password)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(nodeId)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.alfrescoJsApi.login(adminUser.id, adminUser.password)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.unlockNode(lockedFileNodeId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(lockedFileNodeId)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        it('[C286604] Should be able to open Lock file option by clicking the lock image', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServices.lockContent(pngFileModel.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.checkLockFileCheckboxIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.checkCancelButtonIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.checkSaveButtonIsDisplayed()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286625] Should be able to click Cancel to cancel lock file operation', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServices.lockContent(pngFileModel.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.checkLockFileCheckboxIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickCancelButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServices.checkUnlockedIcon(pngFileModel.name)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286603] Should be able to click on Lock file checkbox and lock a file', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServices.lockContent(pngFileToLock.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.checkLockFileCheckboxIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickLockFileCheckbox()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickSaveButton()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, contentServices.checkLockedIcon(pngFileToLock.name)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286618] Should be able to uncheck Lock file checkbox and unlock a file', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServices.lockContent(pngFileModel.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.checkLockFileCheckboxIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickLockFileCheckbox()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickSaveButton()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, contentServices.checkLockedIcon(pngFileModel.name)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, contentServices.lockContent(pngFileModel.name)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickLockFileCheckbox()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickSaveButton()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, contentServices.checkUnlockedIcon(pngFileModel.name)];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Locked file without owner permissions', function () {
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            var pngUploadedFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, documentLibrary)];
                    case 1:
                        pngUploadedFile = _a.sent();
                        nodeId = pngUploadedFile.entry.id;
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(managerUser)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.openContentServicesFolder(documentLibrary)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(adminUser.id, adminUser.password)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.unlockNode(nodeId)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(nodeId)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_4 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
        it('[C286610] Should not be able to delete a locked file', function () { return __awaiter(_this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServices.lockContent(pngFileModel.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.checkLockFileCheckboxIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickLockFileCheckbox()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickSaveButton()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 9]);
                        return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.deleteNode(nodeId)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 7:
                        error_5 = _a.sent();
                        return [4 /*yield*/, expect(error_5.status).toEqual(409)];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); });
        it('[C286611] Should not be able to rename a locked file', function () { return __awaiter(_this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServices.lockContent(pngFileModel.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.checkLockFileCheckboxIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickLockFileCheckbox()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickSaveButton()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 9]);
                        return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.updateNode(nodeId, { name: 'My new name' })];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 7:
                        error_6 = _a.sent();
                        return [4 /*yield*/, expect(error_6.status).toEqual(409)];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); });
        it('[C286612] Should not be able to move a locked file', function () { return __awaiter(_this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServices.lockContent(pngFileModel.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.checkLockFileCheckboxIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickLockFileCheckbox()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickSaveButton()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 9]);
                        return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.moveNode(nodeId, { targetParentId: '-my-' })];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 7:
                        error_7 = _a.sent();
                        return [4 /*yield*/, expect(error_7.status).toEqual(409)];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); });
        it('[C286613] Should not be able to update a new version on a locked file', function () { return __awaiter(_this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServices.lockContent(pngFileModel.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.checkLockFileCheckboxIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickLockFileCheckbox()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickSaveButton()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 9]);
                        return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.updateNodeContent(nodeId, 'NEW FILE CONTENT')];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 7:
                        error_8 = _a.sent();
                        return [4 /*yield*/, expect(error_8.status).toEqual(409)];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Locked file with owner permissions', function () {
        var pngFileToBeLocked;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, uploadActions.uploadFile(pngFileToLock.location, pngFileToLock.name, documentLibrary)];
                    case 1:
                        pngFileToBeLocked = _a.sent();
                        lockedFileNodeId = pngFileToBeLocked.entry.id;
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            var pngUploadedFile, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, documentLibrary)];
                    case 1:
                        pngUploadedFile = _a.sent();
                        nodeId = pngUploadedFile.entry.id;
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(adminUser)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.openContentServicesFolder(documentLibrary)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_10 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
            var error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(adminUser.id, adminUser.password)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(nodeId)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_11 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        it('[C286614] Owner of the locked file should be able to rename if Allow owner to modify is checked', function () { return __awaiter(_this, void 0, void 0, function () {
            var response, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServices.lockContent(pngFileModel.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.checkLockFileCheckboxIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickLockFileCheckbox()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickAllowOwnerCheckbox()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickSaveButton()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 9, , 10]);
                        return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.updateNode(nodeId, { name: 'My new name' })];
                    case 7:
                        response = _a.sent();
                        return [4 /*yield*/, expect(response.entry.name).toEqual('My new name')];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        error_12 = _a.sent();
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        }); });
        it('[C286615] Owner of the locked file should be able to update a new version if Allow owner to modify is checked', function () { return __awaiter(_this, void 0, void 0, function () {
            var response, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServices.lockContent(pngFileModel.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.checkLockFileCheckboxIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickLockFileCheckbox()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickAllowOwnerCheckbox()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickSaveButton()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 9, , 10]);
                        return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.updateNodeContent(nodeId, 'NEW FILE CONTENT')];
                    case 7:
                        response = _a.sent();
                        return [4 /*yield*/, expect(response.entry.modifiedAt).toBeGreaterThan(response.entry.createdAt)];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        error_13 = _a.sent();
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        }); });
        it('[C286616] Owner of the locked file should be able to move if Allow owner to modify is checked', function () { return __awaiter(_this, void 0, void 0, function () {
            var movedFile, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServices.lockContent(pngFileModel.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.checkLockFileCheckboxIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickLockFileCheckbox()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickAllowOwnerCheckbox()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickSaveButton()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 10, , 11]);
                        return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.moveNode(nodeId, { targetParentId: '-my-' })];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.getNode(nodeId)];
                    case 8:
                        movedFile = _a.sent();
                        return [4 /*yield*/, expect(movedFile.entry.parentId).not.toEqual(documentLibrary)];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        error_14 = _a.sent();
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        }); });
        it('[C286617] Owner of the locked file should be able to delete if Allow owner to modify is checked', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServices.lockContent(pngFileToLock.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.checkLockFileCheckboxIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickLockFileCheckbox()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickAllowOwnerCheckbox()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, lockFilePage.clickSaveButton()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, contentServices.deleteContent(pngFileToBeLocked.entry.name)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, contentServices.checkContentIsNotDisplayed(pngFileToBeLocked.entry.name)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=lock-file.e2e.js.map