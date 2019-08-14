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
var folderDialog_1 = require("../../pages/adf/dialog/folderDialog");
var metadataViewPage_1 = require("../../pages/adf/metadataViewPage");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var js_api_1 = require("@alfresco/js-api");
var protractor_1 = require("protractor");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
describe('Create folder directive', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var createFolderDialog = new folderDialog_1.FolderDialog();
    var notificationHistoryPage = new adf_testing_1.NotificationHistoryPage();
    var metadataViewPage = new metadataViewPage_1.MetadataViewPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'ECM',
                        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
                    });
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                case 4:
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
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.actions().sendKeys(protractor_1.Key.ESCAPE).perform()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.actions().sendKeys(protractor_1.Key.ESCAPE).perform()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260154] Should not create the folder if cancel button is clicked', function () { return __awaiter(_this, void 0, void 0, function () {
        var folderName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    folderName = 'cancelFolder';
                    return [4 /*yield*/, contentServicesPage.clickOnCreateNewFolder()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.addFolderName(folderName)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.clickOnCancelButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(folderName)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260155] Should enable the Create button only when a folder name is present', function () { return __awaiter(_this, void 0, void 0, function () {
        var folderName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    folderName = 'NotEnableFolder';
                    return [4 /*yield*/, contentServicesPage.clickOnCreateNewFolder()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.checkCreateUpdateBtnIsDisabled()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.addFolderName(folderName)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.checkCreateUpdateBtnIsEnabled()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260156] Should not be possible create two folder with the same name', function () { return __awaiter(_this, void 0, void 0, function () {
        var folderName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    folderName = 'duplicate';
                    return [4 /*yield*/, contentServicesPage.createNewFolder(folderName)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderName)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.createNewFolder(folderName)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('There\'s already a folder with this name. Try a different name.')];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260157] Should be possible create a folder under a folder with the same name', function () { return __awaiter(_this, void 0, void 0, function () {
        var folderName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    folderName = 'sameSubFolder';
                    return [4 /*yield*/, contentServicesPage.createNewFolder(folderName)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderName)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.doubleClickRow(folderName)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.createNewFolder(folderName)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderName)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260158] Should be possible add a folder description when create a new folder', function () { return __awaiter(_this, void 0, void 0, function () {
        var folderName, description, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    folderName = 'folderDescription';
                    description = 'this is the description';
                    return [4 /*yield*/, contentServicesPage.clickOnCreateNewFolder()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, createFolderDialog.addFolderName(folderName)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, createFolderDialog.addFolderDescription(description)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, createFolderDialog.clickOnCreateUpdateButton()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderName)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.metadataContent(folderName)];
                case 6:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, metadataViewPage.getPropertyText('properties.cm:description')];
                case 7: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('this is the description')];
                case 8:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260159] Should not be possible create a folder with banned character', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.refresh()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.clickOnCreateNewFolder()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.addFolderName('*')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.checkCreateUpdateBtnIsDisabled()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.addFolderName('<')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.checkCreateUpdateBtnIsDisabled()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.addFolderName('>')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.checkCreateUpdateBtnIsDisabled()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.addFolderName('\\')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.checkCreateUpdateBtnIsDisabled()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.addFolderName('/')];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.checkCreateUpdateBtnIsDisabled()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.addFolderName('?')];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.checkCreateUpdateBtnIsDisabled()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.addFolderName(':')];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.checkCreateUpdateBtnIsDisabled()];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.addFolderName('|')];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, createFolderDialog.checkCreateUpdateBtnIsDisabled()];
                case 18:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=create-folder-directive.e2e.js.map