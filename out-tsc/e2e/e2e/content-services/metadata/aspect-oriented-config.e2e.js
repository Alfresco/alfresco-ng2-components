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
var viewerPage_1 = require("../../pages/adf/viewerPage");
var metadataViewPage_1 = require("../../pages/adf/metadataViewPage");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var fileModel_1 = require("../../models/ACS/fileModel");
var protractor_1 = require("protractor");
var resources = require("../../util/resources");
var js_api_1 = require("@alfresco/js-api");
var contentServicesPage_1 = require("../../pages/adf/contentServicesPage");
var material_1 = require("../../util/material");
describe('Aspect oriented config', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var viewerPage = new viewerPage_1.ViewerPage();
    var metadataViewPage = new metadataViewPage_1.MetadataViewPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var modelOneName = 'modelOne', emptyAspectName = 'emptyAspect';
    var defaultModel = 'cm', defaultEmptyPropertiesAspect = 'taggable', aspectName = 'Taggable';
    var acsUser = new acsUserModel_1.AcsUserModel();
    var pngFileModel = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    var uploadActions;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var e_1, e_2, uploadedFile, aspects;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'ECM',
                        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
                    });
                    uploadActions = new adf_testing_1.UploadActions(this.alfrescoJsApi);
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, this.alfrescoJsApi.core.customModelApi.createCustomModel('ACTIVE', modelOneName, modelOneName, modelOneName, modelOneName)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    return [3 /*break*/, 5];
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, this.alfrescoJsApi.core.customModelApi.createCustomAspect(modelOneName, emptyAspectName, null, emptyAspectName, emptyAspectName)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    e_2 = _a.sent();
                    return [3 /*break*/, 8];
                case 8: return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-')];
                case 11:
                    uploadedFile = _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.getNode(uploadedFile.entry.id)];
                case 13:
                    aspects = _a.sent();
                    aspects.entry.aspectNames.push(modelOneName.concat(':', emptyAspectName));
                    aspects.entry.aspectNames.push(defaultModel.concat(':', defaultEmptyPropertiesAspect));
                    return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.updateNode(uploadedFile.entry.id, { aspectNames: aspects.entry.aspectNames })];
                case 14:
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
                case 0: return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C261117] Should be possible restrict the display properties of one an aspect', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('content-metadata', JSON.stringify({
                        presets: {
                            default: [
                                {
                                    title: 'IMAGE',
                                    items: [
                                        {
                                            aspect: 'exif:exif',
                                            properties: [
                                                'exif:pixelXDimension',
                                                'exif:pixelYDimension',
                                                'exif:isoSpeedRatings'
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.viewFile(pngFileModel.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickInfoButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnPropertiesTab()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.informationButtonIsDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnInformationButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.clickMetadataGroup('IMAGE')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkPropertyIsVisible('properties.exif:pixelXDimension', 'textitem')];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkPropertyIsVisible('properties.exif:pixelYDimension', 'textitem')];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkPropertyIsNotVisible('properties.exif:isoSpeedRatings', 'textitem')];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.editIconClick()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkPropertyIsVisible('properties.exif:isoSpeedRatings', 'textitem')];
                case 14:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260185] Should ignore not existing aspect when present in the configuration', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('content-metadata', JSON.stringify({
                        presets: {
                            default: {
                                'exif:exif': '*',
                                'cm:versionable': '*',
                                'not:exists': '*'
                            }
                        }
                    }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.viewFile(pngFileModel.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickInfoButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnPropertiesTab()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.informationButtonIsDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnInformationButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkMetadataGroupIsPresent('EXIF')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkMetadataGroupIsPresent('properties')];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkMetadataGroupIsPresent('Versionable')];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkMetadataGroupIsNotPresent('exists')];
                case 12:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260183] Should show all the aspect if the content-metadata configuration is NOT provided', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('content-metadata', '{}')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.viewFile(pngFileModel.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickInfoButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnPropertiesTab()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.informationButtonIsDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnInformationButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkMetadataGroupIsPresent('EXIF')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkMetadataGroupIsPresent('properties')];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkMetadataGroupIsPresent('Versionable')];
                case 11:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260182] Should show all the aspects if the default configuration contains the star symbol', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('content-metadata', JSON.stringify({
                        presets: {
                            default: '*'
                        }
                    }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.viewFile(pngFileModel.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickInfoButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnPropertiesTab()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.informationButtonIsDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnInformationButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkMetadataGroupIsPresent('EXIF')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkMetadataGroupIsPresent('properties')];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkMetadataGroupIsPresent('Versionable')];
                case 11:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C268899] Should be possible use a Translation key as Title of a metadata group', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('content-metadata', '{' +
                        '  "presets": {' +
                        '    "default": [' +
                        '      {' +
                        '        "title": "GROUP-TITLE1-TRANSLATION-KEY",' +
                        '        "items": [' +
                        '          {' +
                        '            "aspect": "exif:exif",' +
                        '            "properties": "*"' +
                        '          }' +
                        '        ]' +
                        '      },' +
                        '      {' +
                        '        "title": "GROUP-TITLE2-TRANSLATION-KEY",' +
                        '        "items": [' +
                        '          {' +
                        '            "aspect": "exif:exif",' +
                        '            "properties": "*"' +
                        '          }' +
                        '        ]' +
                        '      }' +
                        '    ]' +
                        '  }' +
                        '}')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, viewerPage.viewFile(pngFileModel.name)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, viewerPage.clickInfoButton()];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnPropertiesTab()];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, metadataViewPage.informationButtonIsDisplayed()];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnInformationButton()];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, metadataViewPage.checkMetadataGroupIsPresent('GROUP-TITLE1-TRANSLATION-KEY')];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, metadataViewPage.checkMetadataGroupIsPresent('GROUP-TITLE2-TRANSLATION-KEY')];
                case 10:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, metadataViewPage.getMetadataGroupTitle('GROUP-TITLE1-TRANSLATION-KEY')];
                case 11: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('CUSTOM TITLE TRANSLATION ONE')];
                case 12:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, metadataViewPage.getMetadataGroupTitle('GROUP-TITLE2-TRANSLATION-KEY')];
                case 13: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe('CUSTOM TITLE TRANSLATION TWO')];
                case 14:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279968] Should be possible use a custom preset', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('content-metadata', '{' +
                        '    "presets": {' +
                        '        "custom-preset": {' +
                        '            "exif:exif": "*",' +
                        '            "cm:versionable": "*"' +
                        '        }' +
                        '    }' +
                        '}')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.viewFile(pngFileModel.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickInfoButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnPropertiesTab()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, material_1.check(metadataViewPage.presetSwitch)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.enterPresetText('custom-preset')];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.informationButtonIsDisplayed()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnInformationButton()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkMetadataGroupIsPresent('properties')];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkMetadataGroupIsPresent('Versionable')];
                case 12:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C299186] The aspect without properties is not displayed', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('content-metadata', '{' +
                        '    "presets": { "' + modelOneName +
                        '       ": { "' + modelOneName + ':' + emptyAspectName +
                        '            ":"*"' +
                        '        }' +
                        '    }' +
                        '}')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.viewFile(pngFileModel.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickInfoButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnPropertiesTab()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.informationButtonIsDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnInformationButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkMetadataGroupIsNotPresent(emptyAspectName)];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C299187] The aspect with empty properties is displayed when edit', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('content-metadata', '{' +
                        '    "presets": { "' + defaultModel +
                        '       ": { "' + defaultModel + ':' + defaultEmptyPropertiesAspect +
                        '            ":"*"' +
                        '        }' +
                        '    }' +
                        '}')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.viewFile(pngFileModel.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickInfoButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnPropertiesTab()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.informationButtonIsDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.clickOnInformationButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkMetadataGroupIsNotPresent(aspectName)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.editIconClick()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, metadataViewPage.checkMetadataGroupIsPresent(aspectName)];
                case 11:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=aspect-oriented-config.e2e.js.map