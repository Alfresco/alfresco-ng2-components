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
var uploadDialog_1 = require("../../pages/adf/dialog/uploadDialog");
var uploadToggles_1 = require("../../pages/adf/dialog/uploadToggles");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var fileModel_1 = require("../../models/ACS/fileModel");
var resources = require("../../util/resources");
var js_api_1 = require("@alfresco/js-api");
var drop_actions_1 = require("../../actions/drop.actions");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
describe('Upload component - Excluded Files', function () {
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var uploadDialog = new uploadDialog_1.UploadDialog();
    var uploadToggles = new uploadToggles_1.UploadToggles();
    var loginPage = new adf_testing_1.LoginPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var iniExcludedFile = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.INI.file_name,
        'location': resources.Files.ADF_DOCUMENTS.INI.file_location
    });
    var txtFileModel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });
    var pngFile = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
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
                    return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                case 5:
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
                case 0: return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279914] Should not allow upload default excluded files using D&D', function () { return __awaiter(_this, void 0, void 0, function () {
        var dragAndDropArea, dragAndDrop;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.checkDragAndDropDIsDisplayed()];
                case 1:
                    _a.sent();
                    dragAndDropArea = protractor_1.element.all(protractor_1.by.css('adf-upload-drag-area div')).first();
                    dragAndDrop = new drop_actions_1.DropActions();
                    return [4 /*yield*/, dragAndDrop.dropFile(dragAndDropArea, iniExcludedFile.location)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(iniExcludedFile.name)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260122] Should not allow upload default excluded files using Upload button', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.uploadFile(iniExcludedFile.location)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(iniExcludedFile.name)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C212862] Should not allow upload file excluded in the files extension of app.config.json', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('files', JSON.stringify({
                        excluded: ['.DS_Store', 'desktop.ini', '*.txt'],
                        'match-options': { 'nocase': true }
                    }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage
                            .uploadFile(txtFileModel.location)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(txtFileModel.name)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C274688] Should extension type added as excluded and accepted not be uploaded', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('files', JSON.stringify({
                        excluded: ['.DS_Store', 'desktop.ini', '*.png'],
                        'match-options': { 'nocase': true }
                    }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, uploadToggles.enableExtensionFilter()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, uploadToggles.addExtension('.png')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.uploadFile(pngFile.location)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(pngFile.name)];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=excluded-file.e2e.js.map