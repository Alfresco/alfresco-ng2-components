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
var contentServicesPage_1 = require("../../pages/adf/contentServicesPage");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var viewerPage_1 = require("../../pages/adf/viewerPage");
var shareDialog_1 = require("../../pages/adf/dialog/shareDialog");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var fileModel_1 = require("../../models/ACS/fileModel");
var protractor_1 = require("protractor");
var resources = require("../../util/resources");
var js_api_1 = require("@alfresco/js-api");
describe('Share file', function () {
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var contentListPage = contentServicesPage.getDocumentList();
    var shareDialog = new shareDialog_1.ShareDialog();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var viewerPage = new viewerPage_1.ViewerPage();
    var notificationHistoryPage = new adf_testing_1.NotificationHistoryPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var pngFileModel = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    var nodeId;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var pngUploadedFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-')];
                case 4:
                    pngUploadedFile = _a.sent();
                    nodeId = pngUploadedFile.entry.id;
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 6:
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
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(nodeId)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Shared link dialog', function () {
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentListPage.selectRow(pngFileModel.name)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286549] Should check automatically toggle button in Share dialog', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.clickShareButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.checkDialogIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.shareToggleButtonIsChecked()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286544] Should display notification when clicking URL copy button', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.clickShareButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.checkDialogIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.clickShareLinkButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('Link copied to the clipboard')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286543] Should be possible to close Share dialog', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.clickShareButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.checkDialogIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.checkShareLinkIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286578] Should disable today option in expiration day calendar', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.clickShareButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.checkDialogIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.clickDateTimePickerButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.calendarTodayDayIsDisabled()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286548] Should be possible to set expiry date for link', function () { return __awaiter(_this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.clickShareButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.checkDialogIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.clickDateTimePickerButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.setDefaultDay()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.setDefaultHour()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.setDefaultMinutes()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.dateTimePickerDialogIsClosed()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.getExpirationDate()];
                    case 8:
                        value = _a.sent();
                        return [4 /*yield*/, shareDialog.clickCloseButton()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.dialogIsClosed()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.clickShareButton()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.checkDialogIsDisplayed()];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.expirationDateInputHasValue(value)];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                    case 14:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286578] Should disable today option in expiration day calendar', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.clickShareButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.checkDialogIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.clickDateTimePickerButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.calendarTodayDayIsDisabled()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C310329] Should be possible to set expiry date only for link', function () { return __awaiter(_this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('sharedLinkDateTimePickerType', JSON.stringify('date'))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.clickShareButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.checkDialogIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.clickDateTimePickerButton()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.setDefaultDay()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.dateTimePickerDialogIsClosed()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.getExpirationDate()];
                    case 7:
                        value = _a.sent();
                        return [4 /*yield*/, shareDialog.clickCloseButton()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.dialogIsClosed()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.clickShareButton()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.checkDialogIsDisplayed()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.expirationDateInputHasValue(value)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                    case 13:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Shared link preview', function () {
        afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286565] Should open file when logged user access shared link', function () { return __awaiter(_this, void 0, void 0, function () {
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
                        return [4 /*yield*/, shareDialog.clickShareLinkButton()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.getShareLink()];
                    case 5:
                        sharedLink = _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('Link copied to the clipboard')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(sharedLink)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.checkFileNameIsDisplayed(pngFileModel.name)];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C287803] Should the URL be kept the same when opening the share dialog multiple times', function () { return __awaiter(_this, void 0, void 0, function () {
            var sharedLink, secondSharedLink;
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
                        return [4 /*yield*/, shareDialog.clickShareLinkButton()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.getShareLink()];
                    case 5:
                        sharedLink = _a.sent();
                        return [4 /*yield*/, shareDialog.clickCloseButton()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('Link copied to the clipboard')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.clickShareButton()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.checkDialogIsDisplayed()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.clickShareLinkButton()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.getShareLink()];
                    case 11:
                        secondSharedLink = _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('Link copied to the clipboard')];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, expect(sharedLink).toEqual(secondSharedLink)];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(sharedLink)];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.checkFileNameIsDisplayed(pngFileModel.name)];
                    case 15:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286539] Should open file when non-logged user access shared link', function () { return __awaiter(_this, void 0, void 0, function () {
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
                        return [4 /*yield*/, shareDialog.checkShareLinkIsDisplayed()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, shareDialog.getShareLink()];
                    case 5:
                        sharedLink = _a.sent();
                        return [4 /*yield*/, shareDialog.clickCloseButton()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(sharedLink)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.checkFileNameIsDisplayed(pngFileModel.name)];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=share-file.e2e.js.map