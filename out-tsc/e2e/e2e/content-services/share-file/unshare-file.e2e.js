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
var CONSTANTS = require("../../util/constants");
var adf_testing_1 = require("@alfresco/adf-testing");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var contentServicesPage_1 = require("../../pages/adf/contentServicesPage");
var shareDialog_1 = require("../../pages/adf/dialog/shareDialog");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var fileModel_1 = require("../../models/ACS/fileModel");
var resources = require("../../util/resources");
var js_api_1 = require("@alfresco/js-api");
var protractor_1 = require("protractor");
describe('Unshare file', function () {
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var contentListPage = contentServicesPage.getDocumentList();
    var navBar = new navigationBarPage_1.NavigationBarPage();
    var errorPage = new adf_testing_1.ErrorPage();
    var notificationHistoryPage = new adf_testing_1.NotificationHistoryPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var shareDialog = new shareDialog_1.ShareDialog();
    var siteName = "PRIVATE-TEST-SITE-" + adf_testing_1.StringUtil.generateRandomString(5);
    var acsUser = new acsUserModel_1.AcsUserModel();
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var nodeBody;
    var nodeId;
    var testSite;
    var pngFileModel = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var site, memberBody, docLibId, testFile1Id, pngUploadedFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    site = {
                        title: siteName,
                        visibility: 'PRIVATE',
                        id: siteName
                    };
                    memberBody = {
                        id: acsUser.id,
                        role: CONSTANTS.CS_USER_ROLES.CONSUMER
                    };
                    nodeBody = {
                        name: adf_testing_1.StringUtil.generateRandomString(5),
                        nodeType: 'cm:content',
                        properties: {
                            'cm:title': adf_testing_1.StringUtil.generateRandomString(5)
                        }
                    };
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.createSite(site)];
                case 3:
                    testSite = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.getSiteContainers(siteName)];
                case 4:
                    docLibId = (_a.sent()).list.entries[0].entry.id;
                    return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.addNode(docLibId, nodeBody)];
                case 5:
                    testFile1Id = (_a.sent()).entry.id;
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.addSiteMember(siteName, memberBody)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.updateNode(testFile1Id, {
                            permissions: {
                                isInheritanceEnabled: false,
                                locallySet: [
                                    {
                                        authorityId: acsUser.id,
                                        name: CONSTANTS.CS_USER_ROLES.CONSUMER
                                    }
                                ]
                            }
                        })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sharedlinksApi.addSharedLink({ nodeId: testFile1Id })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-')];
                case 10:
                    pngUploadedFile = _a.sent();
                    nodeId = pngUploadedFile.entry.id;
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, navBar.clickContentServicesButton()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 13:
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
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.refresh()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('with permission', function () {
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, uploadActions.deleteFileOrFolder(nodeId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286550] Should display unshare confirmation dialog', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentListPage.selectRow(pngFileModel.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.clickShareButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.checkDialogIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.clickUnShareFile()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.confirmationDialogIsDisplayed()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286551] Should be able to cancel unshare action', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentListPage.selectRow(pngFileModel.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.clickShareButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.checkDialogIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.clickUnShareFile()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.confirmationDialogIsDisplayed()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.clickConfirmationDialogCancelButton()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.shareToggleButtonIsChecked()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286552] Should be able to confirm unshare action', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentListPage.selectRow(pngFileModel.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.clickShareButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.checkDialogIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.clickUnShareFile()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.confirmationDialogIsDisplayed()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.clickConfirmationDialogRemoveButton()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.dialogIsClosed()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280556] Should redirect to 404 when trying to access an unshared file', function () { return __awaiter(_this, void 0, void 0, function () {
            var sharedLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentListPage.selectRow(pngFileModel.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.clickShareButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.checkDialogIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.getShareLink()];
                    case 4:
                        sharedLink = _a.sent();
                        return [4 /*yield*/, shareDialog.clickUnShareFile()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.confirmationDialogIsDisplayed()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.clickConfirmationDialogRemoveButton()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.dialogIsClosed()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(sharedLink.replace(protractor_1.browser.params.testConfig.adf_acs.host, protractor_1.browser.params.testConfig.adf.host))];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, errorPage.checkErrorCode()];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('without permission', function () {
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.deleteSite(siteName, { permanent: true })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286555] Should NOT be able to unshare file without permission', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navBar.goToSite(testSite)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentListPage.doubleClickRow('documentLibrary')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentListPage.selectRow(nodeBody.name)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.clickShareButton()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.checkDialogIsDisplayed()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.shareToggleButtonIsChecked()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.clickUnShareFile()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.confirmationDialogIsDisplayed()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.clickConfirmationDialogRemoveButton()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.checkDialogIsDisplayed()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.shareToggleButtonIsChecked()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains("You don't have permission to unshare this file")];
                    case 12:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=unshare-file.e2e.js.map