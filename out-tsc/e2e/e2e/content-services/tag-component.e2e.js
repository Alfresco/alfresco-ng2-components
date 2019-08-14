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
var acsUserModel_1 = require("../models/ACS/acsUserModel");
var fileModel_1 = require("../models/ACS/fileModel");
var adf_testing_1 = require("@alfresco/adf-testing");
var tagPage_1 = require("../pages/adf/tagPage");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var protractor_1 = require("protractor");
describe('Tag component', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var tagPage = new tagPage_1.TagPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var pdfFileModel = new fileModel_1.FileModel({ name: resources.Files.ADF_DOCUMENTS.PDF.file_name });
    var deleteFile = new fileModel_1.FileModel({ name: adf_testing_1.StringUtil.generateRandomString() });
    var sameTag = adf_testing_1.StringUtil.generateRandomString().toLowerCase();
    var tagList = [
        adf_testing_1.StringUtil.generateRandomString().toLowerCase(),
        adf_testing_1.StringUtil.generateRandomString().toLowerCase(),
        adf_testing_1.StringUtil.generateRandomString().toLowerCase(),
        adf_testing_1.StringUtil.generateRandomString().toLowerCase()
    ];
    var tags = [
        { tag: 'test-tag-01' }, { tag: 'test-tag-02' }, { tag: 'test-tag-03' }, { tag: 'test-tag-04' }, { tag: 'test-tag-05' },
        { tag: 'test-tag-06' }, { tag: 'test-tag-07' }, { tag: 'test-tag-08' }, { tag: 'test-tag-09' }, { tag: 'test-tag-10' },
        { tag: 'test-tag-11' }
    ];
    var uppercaseTag = adf_testing_1.StringUtil.generateRandomString().toUpperCase();
    var digitsTag = adf_testing_1.StringUtil.generateRandomStringDigits();
    var nonLatinTag = adf_testing_1.StringUtil.generateRandomStringNonLatin();
    var pdfUploadedFile, nodeId;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var uploadedDeleteFile;
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
                    return [4 /*yield*/, uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, '-my-')];
                case 4:
                    pdfUploadedFile = _a.sent();
                    nodeId = pdfUploadedFile.entry.id;
                    return [4 /*yield*/, uploadActions.uploadFile(deleteFile.location, deleteFile.name, '-my-')];
                case 5:
                    uploadedDeleteFile = _a.sent();
                    Object.assign(pdfFileModel, pdfUploadedFile.entry);
                    Object.assign(deleteFile, uploadedDeleteFile.entry);
                    return [4 /*yield*/, this.alfrescoJsApi.core.tagsApi.addTag(nodeId, tags)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 7:
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
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(pdfUploadedFile.entry.id)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260374] Should NOT be possible to add a new tag without Node ID', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickTagButton()];
                case 1:
                    _f.sent();
                    _a = expect;
                    return [4 /*yield*/, tagPage.getNodeId()];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_f.sent()]).toEqual('')];
                case 3:
                    _f.sent();
                    _b = expect;
                    return [4 /*yield*/, tagPage.getNewTagPlaceholder()];
                case 4: return [4 /*yield*/, _b.apply(void 0, [_f.sent()]).toEqual('New Tag')];
                case 5:
                    _f.sent();
                    _c = expect;
                    return [4 /*yield*/, tagPage.addTagButtonIsEnabled()];
                case 6: return [4 /*yield*/, _c.apply(void 0, [_f.sent()]).toEqual(false)];
                case 7:
                    _f.sent();
                    return [4 /*yield*/, tagPage.checkTagListIsEmpty()];
                case 8:
                    _f.sent();
                    return [4 /*yield*/, tagPage.checkTagListByNodeIdIsEmpty()];
                case 9:
                    _f.sent();
                    return [4 /*yield*/, tagPage.addNewTagInput('a')];
                case 10:
                    _f.sent();
                    _d = expect;
                    return [4 /*yield*/, tagPage.addTagButtonIsEnabled()];
                case 11: return [4 /*yield*/, _d.apply(void 0, [_f.sent()]).toEqual(false)];
                case 12:
                    _f.sent();
                    _e = expect;
                    return [4 /*yield*/, tagPage.getNewTagInput()];
                case 13: return [4 /*yield*/, _e.apply(void 0, [_f.sent()]).toEqual('a')];
                case 14:
                    _f.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C268151] Should be possible to add a new tag to a Node', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tagPage.insertNodeId(pdfFileModel.id)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, tagPage.addTag(tagList[0])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, tagPage.checkTagIsDisplayedInTagList(tagList[0])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, tagPage.checkTagIsDisplayedInTagListByNodeId(tagList[0])];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260377] Should NOT be possible to add a tag that already exists', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, tagPage.insertNodeId(pdfFileModel.id)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, tagPage.addTag(sameTag)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, tagPage.checkTagIsDisplayedInTagList(sameTag)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, tagPage.addTag(sameTag)];
                case 4:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, tagPage.getErrorMessage()];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('Tag already exists')];
                case 6:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C91326] Should be possible to create a tag with different characters', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tagPage.insertNodeId(pdfFileModel.id)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, tagPage.addTag(uppercaseTag + digitsTag + nonLatinTag)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 3:
                    _a.sent(); // wait CS return tags
                    return [4 /*yield*/, tagPage.checkTagIsDisplayedInTagList(uppercaseTag.toLowerCase() + digitsTag + nonLatinTag)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, tagPage.checkTagIsDisplayedInTagListByNodeId(uppercaseTag.toLowerCase() + digitsTag + nonLatinTag)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, tagPage.checkTagIsNotDisplayedInTagList(uppercaseTag + digitsTag + nonLatinTag)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260375] Should be possible to delete a tag', function () { return __awaiter(_this, void 0, void 0, function () {
        var deleteTag;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deleteTag = adf_testing_1.StringUtil.generateRandomString().toUpperCase();
                    return [4 /*yield*/, tagPage.insertNodeId(deleteFile.id)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, tagPage.addTag(deleteTag)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, tagPage.checkTagIsDisplayedInTagList(deleteTag.toLowerCase())];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, tagPage.checkTagIsDisplayedInTagListByNodeId(deleteTag.toLowerCase())];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, tagPage.deleteTagFromTagListByNodeId(deleteTag.toLowerCase())];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, tagPage.checkTagIsNotDisplayedInTagList(deleteTag.toLowerCase())];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, tagPage.checkTagIsNotDisplayedInTagListByNodeId(deleteTag.toLowerCase())];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, tagPage.insertNodeId(deleteFile.id)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, tagPage.addTag(deleteTag)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, tagPage.checkTagIsDisplayedInTagList(deleteTag.toLowerCase())];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, tagPage.checkTagIsDisplayedInTagListByNodeId(deleteTag.toLowerCase())];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, tagPage.deleteTagFromTagList(deleteTag.toLowerCase())];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, tagPage.checkTagIsNotDisplayedInTagList(deleteTag.toLowerCase())];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, tagPage.checkTagIsNotDisplayedInTagListByNodeId(deleteTag.toLowerCase())];
                case 14:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286290] Should be able to hide the delete option from a tag component', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tagPage.insertNodeId(pdfFileModel.id)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, tagPage.addTag(tagList[3])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, tagPage.checkTagIsDisplayedInTagListByNodeId(tagList[3])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, tagPage.checkDeleteTagFromTagListByNodeIdIsDisplayed(tagList[3])];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, tagPage.clickShowDeleteButtonSwitch()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, tagPage.checkDeleteTagFromTagListByNodeIdIsNotDisplayed(tagList[3])];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286472] Should be able to click Show more/less button on List Tags Content Services', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, tagPage.insertNodeId(pdfFileModel.id)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, tagPage.checkShowMoreButtonIsDisplayed()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, tagPage.checkShowLessButtonIsNotDisplayed()];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, tagPage.checkTagsOnList()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(10)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, tagPage.clickShowMoreButton()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, tagPage.checkShowLessButtonIsDisplayed()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, tagPage.clickShowLessButton()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, tagPage.checkShowLessButtonIsNotDisplayed()];
                case 9:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260378] Should be possible to add multiple tags', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tagPage.insertNodeId(pdfFileModel.id)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, tagPage.addTag(tagList[2])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 3:
                    _a.sent(); // wait CS return tags
                    return [4 /*yield*/, tagPage.checkTagListIsOrderedAscending()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, tagPage.checkTagListByNodeIdIsOrderedAscending()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, tagPage.checkTagListContentServicesIsOrderedAscending()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=tag-component.e2e.js.map