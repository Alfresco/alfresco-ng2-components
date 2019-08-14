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
var viewerPage_1 = require("../../pages/adf/viewerPage");
var metadataViewPage_1 = require("../../pages/adf/metadataViewPage");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var fileModel_1 = require("../../models/ACS/fileModel");
var protractor_1 = require("protractor");
var resources = require("../../util/resources");
var dateFormat = require("dateformat");
var js_api_1 = require("@alfresco/js-api");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
describe('Metadata component', function () {
    var METADATA = {
        DATA_FORMAT: 'mmm d, yyyy',
        TITLE: 'Details',
        COMMENTS_TAB: 'COMMENTS',
        PROPERTY_TAB: 'PROPERTIES',
        DEFAULT_ASPECT: 'Properties',
        MORE_INFO_BUTTON: 'More information',
        LESS_INFO_BUTTON: 'Less information',
        ARROW_DOWN: 'keyboard_arrow_down',
        ARROW_UP: 'keyboard_arrow_up',
        EDIT_BUTTON_TOOLTIP: 'Edit'
    };
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var viewerPage = new viewerPage_1.ViewerPage();
    var metadataViewPage = new metadataViewPage_1.MetadataViewPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var folderName = 'Metadata Folder';
    var pngFileModel = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
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
                    Object.assign(pngFileModel, pngUploadedFile.entry);
                    pngFileModel.update(pngUploadedFile.entry);
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
    describe('Viewer Metadata', function () {
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
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('content-metadata', JSON.stringify({
                                presets: {
                                    default: {
                                        'exif:exif': '*'
                                    }
                                }
                            }))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, viewerPage.viewFile(pngFileModel.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.checkFileIsLoaded()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, viewerPage.clickCloseButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C245652] Should be possible to display a file\'s properties', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0: return [4 /*yield*/, viewerPage.clickInfoButton()];
                    case 1:
                        _o.sent();
                        return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                    case 2:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.clickOnPropertiesTab()];
                    case 3:
                        _o.sent();
                        _a = expect;
                        return [4 /*yield*/, metadataViewPage.getTitle()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_o.sent()]).toEqual(METADATA.TITLE)];
                    case 5:
                        _o.sent();
                        _b = expect;
                        return [4 /*yield*/, viewerPage.getActiveTab()];
                    case 6: return [4 /*yield*/, _b.apply(void 0, [_o.sent()]).toEqual(METADATA.PROPERTY_TAB)];
                    case 7:
                        _o.sent();
                        _c = expect;
                        return [4 /*yield*/, metadataViewPage.getExpandedAspectName()];
                    case 8: return [4 /*yield*/, _c.apply(void 0, [_o.sent()]).toEqual(METADATA.DEFAULT_ASPECT)];
                    case 9:
                        _o.sent();
                        _d = expect;
                        return [4 /*yield*/, metadataViewPage.getName()];
                    case 10: return [4 /*yield*/, _d.apply(void 0, [_o.sent()]).toEqual(pngFileModel.name)];
                    case 11:
                        _o.sent();
                        _e = expect;
                        return [4 /*yield*/, metadataViewPage.getCreator()];
                    case 12: return [4 /*yield*/, _e.apply(void 0, [_o.sent()]).toEqual(pngFileModel.getCreatedByUser().displayName)];
                    case 13:
                        _o.sent();
                        _f = expect;
                        return [4 /*yield*/, metadataViewPage.getCreatedDate()];
                    case 14: return [4 /*yield*/, _f.apply(void 0, [_o.sent()]).toEqual(dateFormat(pngFileModel.createdAt, METADATA.DATA_FORMAT))];
                    case 15:
                        _o.sent();
                        _g = expect;
                        return [4 /*yield*/, metadataViewPage.getModifier()];
                    case 16: return [4 /*yield*/, _g.apply(void 0, [_o.sent()]).toEqual(pngFileModel.getCreatedByUser().displayName)];
                    case 17:
                        _o.sent();
                        _h = expect;
                        return [4 /*yield*/, metadataViewPage.getModifiedDate()];
                    case 18: return [4 /*yield*/, _h.apply(void 0, [_o.sent()]).toEqual(dateFormat(pngFileModel.createdAt, METADATA.DATA_FORMAT))];
                    case 19:
                        _o.sent();
                        _j = expect;
                        return [4 /*yield*/, metadataViewPage.getMimetypeName()];
                    case 20: return [4 /*yield*/, _j.apply(void 0, [_o.sent()]).toEqual(pngFileModel.getContent().mimeTypeName)];
                    case 21:
                        _o.sent();
                        _k = expect;
                        return [4 /*yield*/, metadataViewPage.getSize()];
                    case 22: return [4 /*yield*/, _k.apply(void 0, [_o.sent()]).toEqual(pngFileModel.getContent().getSizeInBytes())];
                    case 23:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.editIconIsDisplayed()];
                    case 24:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.informationButtonIsDisplayed()];
                    case 25:
                        _o.sent();
                        _l = expect;
                        return [4 /*yield*/, metadataViewPage.getInformationButtonText()];
                    case 26: return [4 /*yield*/, _l.apply(void 0, [_o.sent()]).toEqual(METADATA.LESS_INFO_BUTTON)];
                    case 27:
                        _o.sent();
                        _m = expect;
                        return [4 /*yield*/, metadataViewPage.getInformationIconText()];
                    case 28: return [4 /*yield*/, _m.apply(void 0, [_o.sent()]).toEqual(METADATA.ARROW_UP)];
                    case 29:
                        _o.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272769] Should be possible to display more details when clicking on More Information button', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, viewerPage.clickInfoButton()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, metadataViewPage.clickOnPropertiesTab()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, metadataViewPage.informationButtonIsDisplayed()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, metadataViewPage.clickOnInformationButton()];
                    case 5:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, metadataViewPage.getInformationButtonText()];
                    case 6: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual(METADATA.MORE_INFO_BUTTON)];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, metadataViewPage.getInformationIconText()];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(METADATA.ARROW_DOWN)];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C270952] Should be possible to open/close properties using info icon', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, viewerPage.clickInfoButton()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, metadataViewPage.clickOnPropertiesTab()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, metadataViewPage.informationButtonIsDisplayed()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, viewerPage.clickInfoButton()];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, viewerPage.checkInfoSideBarIsNotDisplayed()];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, viewerPage.clickInfoButton()];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                    case 8:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, viewerPage.getActiveTab()];
                    case 9: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toEqual(METADATA.COMMENTS_TAB)];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, metadataViewPage.clickOnPropertiesTab()];
                    case 11:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, viewerPage.getActiveTab()];
                    case 12: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual(METADATA.PROPERTY_TAB)];
                    case 13:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, metadataViewPage.getEditIconTooltip()];
                    case 14: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toEqual(METADATA.EDIT_BUTTON_TOOLTIP)];
                    case 15:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C245654] Should be possible edit the basic Metadata Info of a Document', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0: return [4 /*yield*/, viewerPage.clickInfoButton()];
                    case 1:
                        _o.sent();
                        return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                    case 2:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.clickOnPropertiesTab()];
                    case 3:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.editIconIsDisplayed()];
                    case 4:
                        _o.sent();
                        _a = expect;
                        return [4 /*yield*/, viewerPage.getActiveTab()];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_o.sent()]).toEqual(METADATA.PROPERTY_TAB)];
                    case 6:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.editIconClick()];
                    case 7:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.editPropertyIconIsDisplayed('name')];
                    case 8:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title')];
                    case 9:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.editPropertyIconIsDisplayed('properties.cm:description')];
                    case 10:
                        _o.sent();
                        _b = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyIconTooltip('name')];
                    case 11: return [4 /*yield*/, _b.apply(void 0, [_o.sent()]).toEqual('Edit')];
                    case 12:
                        _o.sent();
                        _c = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyIconTooltip('properties.cm:title')];
                    case 13: return [4 /*yield*/, _c.apply(void 0, [_o.sent()]).toEqual('Edit')];
                    case 14:
                        _o.sent();
                        _d = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyIconTooltip('properties.cm:description')];
                    case 15: return [4 /*yield*/, _d.apply(void 0, [_o.sent()]).toEqual('Edit')];
                    case 16:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.clickEditPropertyIcons('name')];
                    case 17:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.updatePropertyIconIsDisplayed('name')];
                    case 18:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.clearPropertyIconIsDisplayed('name')];
                    case 19:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.enterPropertyText('name', 'exampleText')];
                    case 20:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.clickClearPropertyIcon('name')];
                    case 21:
                        _o.sent();
                        _e = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('name')];
                    case 22: return [4 /*yield*/, _e.apply(void 0, [_o.sent()]).toEqual(resources.Files.ADF_DOCUMENTS.PNG.file_name)];
                    case 23:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.clickEditPropertyIcons('name')];
                    case 24:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.enterPropertyText('name', 'exampleText.png')];
                    case 25:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.clickUpdatePropertyIcon('name')];
                    case 26:
                        _o.sent();
                        _f = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('name')];
                    case 27: return [4 /*yield*/, _f.apply(void 0, [_o.sent()]).toEqual('exampleText.png')];
                    case 28:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.clickEditPropertyIcons('properties.cm:title')];
                    case 29:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.enterPropertyText('properties.cm:title', 'example title')];
                    case 30:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.clickUpdatePropertyIcon('properties.cm:title')];
                    case 31:
                        _o.sent();
                        _g = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('properties.cm:title')];
                    case 32: return [4 /*yield*/, _g.apply(void 0, [_o.sent()]).toEqual('example title')];
                    case 33:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.clickEditPropertyIcons('properties.cm:description')];
                    case 34:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.enterDescriptionText('example description')];
                    case 35:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.clickUpdatePropertyIcon('properties.cm:description')];
                    case 36:
                        _o.sent();
                        _h = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('properties.cm:description')];
                    case 37: return [4 /*yield*/, _h.apply(void 0, [_o.sent()]).toEqual('example description')];
                    case 38:
                        _o.sent();
                        return [4 /*yield*/, viewerPage.clickCloseButton()];
                    case 39:
                        _o.sent();
                        return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                    case 40:
                        _o.sent();
                        return [4 /*yield*/, viewerPage.viewFile('exampleText.png')];
                    case 41:
                        _o.sent();
                        return [4 /*yield*/, viewerPage.clickInfoButton()];
                    case 42:
                        _o.sent();
                        return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                    case 43:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.clickOnPropertiesTab()];
                    case 44:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.editIconIsDisplayed()];
                    case 45:
                        _o.sent();
                        _j = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('name')];
                    case 46: return [4 /*yield*/, _j.apply(void 0, [_o.sent()]).toEqual('exampleText.png')];
                    case 47:
                        _o.sent();
                        _k = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('properties.cm:title')];
                    case 48: return [4 /*yield*/, _k.apply(void 0, [_o.sent()]).toEqual('example title')];
                    case 49:
                        _o.sent();
                        _l = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('properties.cm:description')];
                    case 50: return [4 /*yield*/, _l.apply(void 0, [_o.sent()]).toEqual('example description')];
                    case 51:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.editIconClick()];
                    case 52:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.clickEditPropertyIcons('name')];
                    case 53:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.enterPropertyText('name', resources.Files.ADF_DOCUMENTS.PNG.file_name)];
                    case 54:
                        _o.sent();
                        return [4 /*yield*/, metadataViewPage.clickUpdatePropertyIcon('name')];
                    case 55:
                        _o.sent();
                        _m = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('name')];
                    case 56: return [4 /*yield*/, _m.apply(void 0, [_o.sent()]).toEqual(resources.Files.ADF_DOCUMENTS.PNG.file_name)];
                    case 57:
                        _o.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260181] Should be possible edit all the metadata aspect', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, viewerPage.clickInfoButton()];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, metadataViewPage.clickOnPropertiesTab()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, metadataViewPage.editIconIsDisplayed()];
                    case 4:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, viewerPage.getActiveTab()];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toEqual(METADATA.PROPERTY_TAB)];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, metadataViewPage.clickOnInformationButton()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, metadataViewPage.clickMetadataGroup('EXIF')];
                    case 8:
                        _e.sent();
                        return [4 /*yield*/, metadataViewPage.editIconClick()];
                    case 9:
                        _e.sent();
                        return [4 /*yield*/, metadataViewPage.clickEditPropertyIcons('properties.exif:software')];
                    case 10:
                        _e.sent();
                        return [4 /*yield*/, metadataViewPage.enterPropertyText('properties.exif:software', 'test custom text software')];
                    case 11:
                        _e.sent();
                        return [4 /*yield*/, metadataViewPage.clickUpdatePropertyIcon('properties.exif:software')];
                    case 12:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('properties.exif:software')];
                    case 13: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toEqual('test custom text software')];
                    case 14:
                        _e.sent();
                        return [4 /*yield*/, metadataViewPage.clickEditPropertyIcons('properties.exif:isoSpeedRatings')];
                    case 15:
                        _e.sent();
                        return [4 /*yield*/, metadataViewPage.enterPropertyText('properties.exif:isoSpeedRatings', 'test custom text isoSpeedRatings')];
                    case 16:
                        _e.sent();
                        return [4 /*yield*/, metadataViewPage.clickUpdatePropertyIcon('properties.exif:isoSpeedRatings')];
                    case 17:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('properties.exif:isoSpeedRatings')];
                    case 18: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toEqual('test custom text isoSpeedRatings')];
                    case 19:
                        _e.sent();
                        return [4 /*yield*/, metadataViewPage.clickEditPropertyIcons('properties.exif:fNumber')];
                    case 20:
                        _e.sent();
                        return [4 /*yield*/, metadataViewPage.enterPropertyText('properties.exif:fNumber', 22)];
                    case 21:
                        _e.sent();
                        return [4 /*yield*/, metadataViewPage.clickUpdatePropertyIcon('properties.exif:fNumber')];
                    case 22:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('properties.exif:fNumber')];
                    case 23: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toEqual('22')];
                    case 24:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Folder metadata', function () {
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, uploadActions.createFolder(folderName, '-my-')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C261157] Should be possible use the metadata component When the node is a Folder', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.metadataContent(folderName)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('name')];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual(folderName)];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('createdByUser.displayName')];
                    case 4: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(acsUser.firstName + ' ' + acsUser.lastName)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                    case 6:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C261158] Should be possible edit the metadata When the node is a Folder', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.metadataContent(folderName)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, metadataViewPage.editIconClick()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, metadataViewPage.clickEditPropertyIcons('name')];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, metadataViewPage.enterPropertyText('name', 'newnameFolder')];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, metadataViewPage.clickClearPropertyIcon('name')];
                    case 5:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('name')];
                    case 6: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toEqual(folderName)];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, metadataViewPage.clickEditPropertyIcons('name')];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, metadataViewPage.enterPropertyText('name', 'newnameFolder')];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, metadataViewPage.clickUpdatePropertyIcon('name')];
                    case 10:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('name')];
                    case 11: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual('newnameFolder')];
                    case 12:
                        _d.sent();
                        return [4 /*yield*/, metadataViewPage.clickEditPropertyIcons('name')];
                    case 13:
                        _d.sent();
                        return [4 /*yield*/, metadataViewPage.enterPropertyText('name', folderName)];
                    case 14:
                        _d.sent();
                        return [4 /*yield*/, metadataViewPage.clickUpdatePropertyIcon('name')];
                    case 15:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('name')];
                    case 16: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toEqual(folderName)];
                    case 17:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('[C279960] Should show the last username modifier when modify a File', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, loginPage.loginToContentServices(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + ("/(overlay:files/" + pngFileModel.id + "/view)"))];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, viewerPage.clickInfoButton()];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnPropertiesTab()];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, metadataViewPage.editIconIsDisplayed()];
                case 6:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, viewerPage.getActiveTab()];
                case 7: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toEqual(METADATA.PROPERTY_TAB)];
                case 8:
                    _d.sent();
                    return [4 /*yield*/, metadataViewPage.editIconClick()];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, metadataViewPage.clickEditPropertyIcons('properties.cm:description')];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, metadataViewPage.enterDescriptionText('check author example description')];
                case 11:
                    _d.sent();
                    return [4 /*yield*/, metadataViewPage.clickUpdatePropertyIcon('properties.cm:description')];
                case 12:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, metadataViewPage.getPropertyText('properties.cm:description')];
                case 13: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual('check author example description')];
                case 14:
                    _d.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 15:
                    _d.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 16:
                    _d.sent();
                    return [4 /*yield*/, viewerPage.viewFile(pngFileModel.name)];
                case 17:
                    _d.sent();
                    return [4 /*yield*/, viewerPage.checkFileIsLoaded()];
                case 18:
                    _d.sent();
                    return [4 /*yield*/, viewerPage.clickInfoButton()];
                case 19:
                    _d.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                case 20:
                    _d.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnPropertiesTab()];
                case 21:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, metadataViewPage.getPropertyText('modifiedByUser.displayName')];
                case 22: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toEqual('Administrator')];
                case 23:
                    _d.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 24:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 25:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=metadata-smoke-tests.e2e.js.map