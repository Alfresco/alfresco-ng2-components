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
var contentServicesPage_1 = require("../../pages/adf/contentServicesPage");
var viewerPage_1 = require("../../pages/adf/viewerPage");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var resources = require("../../util/resources");
var fileModel_1 = require("../../models/ACS/fileModel");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var js_api_1 = require("@alfresco/js-api");
describe('Viewer - properties', function () {
    var acsUser = new acsUserModel_1.AcsUserModel();
    var viewerPage = new viewerPage_1.ViewerPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var dataTable = new adf_testing_1.DataTableComponentPage();
    var pngFile = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    var fileForOverlay = new fileModel_1.FileModel({
        'name': 'fileForOverlay.png',
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var pngFileUploaded;
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
                    return [4 /*yield*/, uploadActions.uploadFile(pngFile.location, pngFile.name, '-my-')];
                case 4:
                    pngFileUploaded = _a.sent();
                    Object.assign(pngFile, pngFileUploaded.entry);
                    return [4 /*yield*/, uploadActions.uploadFile(fileForOverlay.location, fileForOverlay.name, '-my-')];
                case 5:
                    pngFileUploaded = _a.sent();
                    Object.assign(fileForOverlay, pngFileUploaded.entry);
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.viewFile(pngFile.name)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickLeftSidebarButton()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkLeftSideBarIsDisplayed()];
                case 11:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, uploadActions.deleteFileOrFolder(pngFile.getId())];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260066] Should Show/Hide viewer toolbar when showToolbar is true/false', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.checkToolbarIsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.disableToolbar()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkToolbarIsNotDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.enableToolbar()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260076] Should Show/Hide back button when allowGoBack is true/false', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.checkGoBackIsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.disableGoBack()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkGoBackIsNotDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.enableGoBack()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260077] Should Show toolbar options dropdown when adf-viewer-open-with directive is used', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.checkToolbarOptionsIsNotDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.enableToolbarOptions()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkToolbarOptionsIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.disableToolbarOptions()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260079] Should Show/Hide download button when allowDownload is true/false', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.checkDownloadButtonDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.disableDownload()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkDownloadButtonIsNotDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.enableDownload()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260082] Should Show/Hide print button when allowPrint is true/false', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.checkPrintButtonIsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.disablePrint()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkPrintButtonIsNotDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.enablePrint()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260092] Should show adf-viewer-toolbar-actions directive buttons when adf-viewer-toolbar-actions is used', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.checkMoreActionsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.disableMoreActions()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkMoreActionsIsNotDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.enableMoreActions()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260074] Should show a custom file name when displayName property is used', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.checkFileNameIsDisplayed(pngFile.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.enableCustomName()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.enterCustomName('test custom title')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileNameIsDisplayed('test custom title')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.disableCustomName()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260090] Should showSidebar allow right info-drawer to be shown', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.clickToggleRightSidebar()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickToggleRightSidebar()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsNotDisplayed()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286442] Should showLeftSidebar allow left info-drawer to be shown', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.clickToggleLeftSidebar()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkLeftSideBarIsNotDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickLeftSidebarButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkLeftSideBarIsDisplayed()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260089] Should Show/Hide info-drawer if allowSidebar true/false', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.clickInfoButton()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoButtonIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.disableAllowSidebar()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoButtonIsNotDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsNotDisplayed()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286596] Should Show/Hide left info-drawer if allowLeftSidebar true/false', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.checkLeftSideBarIsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkLeftSideBarButtonIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.disableAllowLeftSidebar()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkLeftSideBarButtonIsNotDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkLeftSideBarIsNotDisplayed()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260100] Should be possible to disable Overlay viewer', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickOverlayViewerButton()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dataTable.doubleClickRow('Name', fileForOverlay.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkOverlayViewerIsDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, dataTable.doubleClickRow('Name', pngFile.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkOverlayViewerIsDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.disableOverlay()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, dataTable.doubleClickRow('Name', fileForOverlay.name)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkImgContainerIsDisplayed()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInlineViewerIsDisplayed()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, dataTable.doubleClickRow('Name', pngFile.name)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkImgContainerIsDisplayed()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInlineViewerIsDisplayed()];
                case 15:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=viewer-properties.e2e.js.map