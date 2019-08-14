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
var commentsPage_1 = require("../../pages/adf/commentsPage");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var fileModel_1 = require("../../models/ACS/fileModel");
var protractor_1 = require("protractor");
var resources = require("../../util/resources");
var CONSTANTS = require("../../util/constants");
var js_api_1 = require("@alfresco/js-api");
describe('Comment Component', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var viewerPage = new viewerPage_1.ViewerPage();
    var commentsPage = new commentsPage_1.CommentsPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var userFullName, nodeId;
    var pngFileModel = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var comments = {
        first: 'This is a comment',
        multiline: 'This is a comment\n' + 'with a new line',
        second: 'This is another comment',
        codeType: "<form action=\"/action_page.php\">\n        First name: <input type=\"text\" name=\"fname\"><br>\n            Last name: <input type=\"text\" name=\"lname\"><br>\n        <input type=\"submit\" value=\"Submit\">\n        </form>",
        test: 'Test'
    };
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
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
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        var pngUploadedFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-')];
                case 2:
                    pngUploadedFile = _a.sent();
                    nodeId = pngUploadedFile.entry.id;
                    userFullName = pngUploadedFile.entry.createdByUser.displayName;
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
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
    it('[C276947] Should be able to add a comment on ACS and view on ADF', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.core.commentsApi.addComment(nodeId, { content: comments.test })];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, viewerPage.viewFile(pngFileModel.name)];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, viewerPage.checkImgViewerIsDisplayed()];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, viewerPage.clickInfoButton()];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, commentsPage.checkCommentsTabIsSelected()];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, commentsPage.checkCommentInputIsDisplayed()];
                case 7:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, commentsPage.getTotalNumberOfComments()];
                case 8: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toEqual('Comments (1)')];
                case 9:
                    _e.sent();
                    _b = expect;
                    return [4 /*yield*/, commentsPage.getMessage(0)];
                case 10: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toEqual(comments.test)];
                case 11:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, commentsPage.getUserName(0)];
                case 12: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toEqual(userFullName)];
                case 13:
                    _e.sent();
                    _d = expect;
                    return [4 /*yield*/, commentsPage.getTime(0)];
                case 14: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toMatch(/(ago|few)/)];
                case 15:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C276948] Should be able to add a comment on a file', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, viewerPage.viewFile(pngFileModel.name)];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, viewerPage.checkImgViewerIsDisplayed()];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, viewerPage.clickInfoButton()];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, viewerPage.clickOnCommentsTab()];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, commentsPage.addComment(comments.first)];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, commentsPage.checkUserIconIsDisplayed(0)];
                case 7:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, commentsPage.getTotalNumberOfComments()];
                case 8: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toEqual('Comments (1)')];
                case 9:
                    _e.sent();
                    _b = expect;
                    return [4 /*yield*/, commentsPage.getMessage(0)];
                case 10: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toEqual(comments.first)];
                case 11:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, commentsPage.getUserName(0)];
                case 12: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toEqual(userFullName)];
                case 13:
                    _e.sent();
                    _d = expect;
                    return [4 /*yield*/, commentsPage.getTime(0)];
                case 14: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toMatch(/(ago|few)/)];
                case 15:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280021] Should be able to add a multiline comment on a file', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, viewerPage.viewFile(pngFileModel.name)];
                case 1:
                    _j.sent();
                    return [4 /*yield*/, viewerPage.checkImgViewerIsDisplayed()];
                case 2:
                    _j.sent();
                    return [4 /*yield*/, viewerPage.clickInfoButton()];
                case 3:
                    _j.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                case 4:
                    _j.sent();
                    return [4 /*yield*/, viewerPage.clickOnCommentsTab()];
                case 5:
                    _j.sent();
                    return [4 /*yield*/, commentsPage.addComment(comments.multiline)];
                case 6:
                    _j.sent();
                    return [4 /*yield*/, commentsPage.checkUserIconIsDisplayed(0)];
                case 7:
                    _j.sent();
                    _a = expect;
                    return [4 /*yield*/, commentsPage.getTotalNumberOfComments()];
                case 8: return [4 /*yield*/, _a.apply(void 0, [_j.sent()]).toEqual('Comments (1)')];
                case 9:
                    _j.sent();
                    _b = expect;
                    return [4 /*yield*/, commentsPage.getMessage(0)];
                case 10: return [4 /*yield*/, _b.apply(void 0, [_j.sent()]).toEqual(comments.multiline)];
                case 11:
                    _j.sent();
                    _c = expect;
                    return [4 /*yield*/, commentsPage.getUserName(0)];
                case 12: return [4 /*yield*/, _c.apply(void 0, [_j.sent()]).toEqual(userFullName)];
                case 13:
                    _j.sent();
                    _d = expect;
                    return [4 /*yield*/, commentsPage.getTime(0)];
                case 14: return [4 /*yield*/, _d.apply(void 0, [_j.sent()]).toMatch(/(ago|few)/)];
                case 15:
                    _j.sent();
                    return [4 /*yield*/, commentsPage.addComment(comments.second)];
                case 16:
                    _j.sent();
                    return [4 /*yield*/, commentsPage.checkUserIconIsDisplayed(0)];
                case 17:
                    _j.sent();
                    _e = expect;
                    return [4 /*yield*/, commentsPage.getTotalNumberOfComments()];
                case 18: return [4 /*yield*/, _e.apply(void 0, [_j.sent()]).toEqual('Comments (2)')];
                case 19:
                    _j.sent();
                    _f = expect;
                    return [4 /*yield*/, commentsPage.getMessage(0)];
                case 20: return [4 /*yield*/, _f.apply(void 0, [_j.sent()]).toEqual(comments.second)];
                case 21:
                    _j.sent();
                    _g = expect;
                    return [4 /*yield*/, commentsPage.getUserName(0)];
                case 22: return [4 /*yield*/, _g.apply(void 0, [_j.sent()]).toEqual(userFullName)];
                case 23:
                    _j.sent();
                    _h = expect;
                    return [4 /*yield*/, commentsPage.getTime(0)];
                case 24: return [4 /*yield*/, _h.apply(void 0, [_j.sent()]).toMatch(/(ago|few)/)];
                case 25:
                    _j.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280022] Should not be able to add an HTML or other code input into the comment input filed', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, viewerPage.viewFile(pngFileModel.name)];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, viewerPage.checkImgViewerIsDisplayed()];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, viewerPage.clickInfoButton()];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, viewerPage.clickOnCommentsTab()];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, commentsPage.addComment(comments.codeType)];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, commentsPage.checkUserIconIsDisplayed(0)];
                case 7:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, commentsPage.getTotalNumberOfComments()];
                case 8: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toEqual('Comments (1)')];
                case 9:
                    _e.sent();
                    _b = expect;
                    return [4 /*yield*/, commentsPage.getMessage(0)];
                case 10: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toEqual('First name: Last name:')];
                case 11:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, commentsPage.getUserName(0)];
                case 12: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toEqual(userFullName)];
                case 13:
                    _e.sent();
                    _d = expect;
                    return [4 /*yield*/, commentsPage.getTime(0)];
                case 14: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toMatch(/(ago|few)/)];
                case 15:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Consumer Permissions', function () {
        var site, pngUploadedFile;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.createSite({
                                title: adf_testing_1.StringUtil.generateRandomString(8),
                                visibility: 'PUBLIC'
                            })];
                    case 2:
                        site = _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
                                id: acsUser.id,
                                role: CONSTANTS.CS_USER_ROLES.CONSUMER
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, site.entry.guid)];
                    case 4:
                        pngUploadedFile = _a.sent();
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
                    case 0: return [4 /*yield*/, uploadActions.deleteFileOrFolder(pngUploadedFile.entry.id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C290147] Should NOT be able to add comments to a site file with Consumer permissions', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.goToSite(site)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.viewFile(pngUploadedFile.entry.name)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.checkImgViewerIsDisplayed()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.checkInfoButtonIsDisplayed()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.clickInfoButton()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.checkInfoSideBarIsDisplayed()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, commentsPage.checkCommentsTabIsSelected()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, commentsPage.checkCommentInputIsNotDisplayed()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=comment-component.e2e.js.map