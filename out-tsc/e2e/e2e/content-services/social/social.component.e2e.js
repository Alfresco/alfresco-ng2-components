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
var js_api_1 = require("@alfresco/js-api");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var fileModel_1 = require("../../models/ACS/fileModel");
var resources = require("../../util/resources");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var socialPage_1 = require("../../pages/adf/demo-shell/socialPage");
var protractor_1 = require("protractor");
describe('Social component', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var likePage = new adf_testing_1.LikePage();
    var ratePage = new adf_testing_1.RatePage();
    var socialPage = new socialPage_1.SocialPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var componentOwner = new acsUserModel_1.AcsUserModel();
    var componentVisitor = new acsUserModel_1.AcsUserModel();
    var secondComponentVisitor = new acsUserModel_1.AcsUserModel();
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var blueLikeColor = ('rgba(33, 150, 243, 1)');
    var greyLikeColor = ('rgba(128, 128, 128, 1)');
    var yellowRatedStarColor = ('rgba(255, 233, 68, 1)');
    var averageStarColor = ('rgba(128, 128, 128, 1)');
    var emptyFile;
    var emptyFileModel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(componentOwner)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(componentVisitor)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(secondComponentVisitor)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(componentOwner.id, componentOwner.password)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(emptyFileModel.location, emptyFileModel.name, '-my-')];
                case 6:
                    emptyFile = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.updateNode(emptyFile.entry.id, {
                            permissions: {
                                locallySet: [{
                                        authorityId: componentVisitor.getId(),
                                        name: 'Consumer',
                                        accessStatus: 'ALLOWED'
                                    }, {
                                        authorityId: secondComponentVisitor.getId(),
                                        name: 'Consumer',
                                        accessStatus: 'ALLOWED'
                                    }]
                            }
                        })];
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
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(emptyFile.entry.id)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('User interaction on their own components', function () {
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(componentOwner)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickSocialButton()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C203006] Should be able to like and unlike their components but not rate them,', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, socialPage.writeCustomNodeId(emptyFile.entry.id)];
                    case 1:
                        _j.sent();
                        _a = expect;
                        return [4 /*yield*/, socialPage.getNodeIdFieldValue()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_j.sent()]).toEqual(emptyFile.entry.id)];
                    case 3:
                        _j.sent();
                        return [4 /*yield*/, likePage.clickLike()];
                    case 4:
                        _j.sent();
                        _b = expect;
                        return [4 /*yield*/, likePage.getLikeCounter()];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [_j.sent()]).toBe('1')];
                    case 6:
                        _j.sent();
                        return [4 /*yield*/, likePage.removeHoverFromLikeButton()];
                    case 7:
                        _j.sent();
                        _c = expect;
                        return [4 /*yield*/, likePage.getLikedIconColor()];
                    case 8: return [4 /*yield*/, _c.apply(void 0, [_j.sent()]).toBe(blueLikeColor)];
                    case 9:
                        _j.sent();
                        return [4 /*yield*/, ratePage.rateComponent(4)];
                    case 10:
                        _j.sent();
                        _d = expect;
                        return [4 /*yield*/, ratePage.getRatingCounter()];
                    case 11: return [4 /*yield*/, _d.apply(void 0, [_j.sent()]).toBe('0')];
                    case 12:
                        _j.sent();
                        _e = expect;
                        return [4 /*yield*/, ratePage.isNotStarRated(4)];
                    case 13: return [4 /*yield*/, _e.apply(void 0, [_j.sent()])];
                    case 14:
                        _j.sent();
                        _f = expect;
                        return [4 /*yield*/, ratePage.getUnratedStarColor(4)];
                    case 15: return [4 /*yield*/, _f.apply(void 0, [_j.sent()]).toBe(averageStarColor)];
                    case 16:
                        _j.sent();
                        return [4 /*yield*/, likePage.clickUnlike()];
                    case 17:
                        _j.sent();
                        _g = expect;
                        return [4 /*yield*/, likePage.getLikeCounter()];
                    case 18: return [4 /*yield*/, _g.apply(void 0, [_j.sent()]).toBe('0')];
                    case 19:
                        _j.sent();
                        return [4 /*yield*/, likePage.removeHoverFromLikeButton()];
                    case 20:
                        _j.sent();
                        _h = expect;
                        return [4 /*yield*/, likePage.getUnLikedIconColor()];
                    case 21: return [4 /*yield*/, _h.apply(void 0, [_j.sent()]).toBe(greyLikeColor)];
                    case 22:
                        _j.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('User interaction on components that belong to other users', function () {
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(componentVisitor)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickSocialButton()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260324] Should be able to like and unlike a component', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, socialPage.writeCustomNodeId(emptyFile.entry.id)];
                    case 1:
                        _h.sent();
                        _a = expect;
                        return [4 /*yield*/, socialPage.getNodeIdFieldValue()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_h.sent()]).toEqual(emptyFile.entry.id)];
                    case 3:
                        _h.sent();
                        _b = expect;
                        return [4 /*yield*/, likePage.getLikeCounter()];
                    case 4: return [4 /*yield*/, _b.apply(void 0, [_h.sent()]).toEqual('0')];
                    case 5:
                        _h.sent();
                        _c = expect;
                        return [4 /*yield*/, likePage.getUnLikedIconColor()];
                    case 6: return [4 /*yield*/, _c.apply(void 0, [_h.sent()]).toBe(greyLikeColor)];
                    case 7:
                        _h.sent();
                        return [4 /*yield*/, likePage.clickLike()];
                    case 8:
                        _h.sent();
                        _d = expect;
                        return [4 /*yield*/, likePage.getLikeCounter()];
                    case 9: return [4 /*yield*/, _d.apply(void 0, [_h.sent()]).toBe('1')];
                    case 10:
                        _h.sent();
                        return [4 /*yield*/, likePage.removeHoverFromLikeButton()];
                    case 11:
                        _h.sent();
                        _e = expect;
                        return [4 /*yield*/, likePage.getLikedIconColor()];
                    case 12: return [4 /*yield*/, _e.apply(void 0, [_h.sent()]).toBe(blueLikeColor)];
                    case 13:
                        _h.sent();
                        return [4 /*yield*/, likePage.clickUnlike()];
                    case 14:
                        _h.sent();
                        _f = expect;
                        return [4 /*yield*/, likePage.getLikeCounter()];
                    case 15: return [4 /*yield*/, _f.apply(void 0, [_h.sent()]).toBe('0')];
                    case 16:
                        _h.sent();
                        return [4 /*yield*/, likePage.removeHoverFromLikeButton()];
                    case 17:
                        _h.sent();
                        _g = expect;
                        return [4 /*yield*/, likePage.getUnLikedIconColor()];
                    case 18: return [4 /*yield*/, _g.apply(void 0, [_h.sent()]).toBe(greyLikeColor)];
                    case 19:
                        _h.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C310198] Should be able to rate and unRate a component', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, socialPage.writeCustomNodeId(emptyFile.entry.id)];
                    case 1:
                        _h.sent();
                        _a = expect;
                        return [4 /*yield*/, socialPage.getNodeIdFieldValue()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_h.sent()]).toEqual(emptyFile.entry.id)];
                    case 3:
                        _h.sent();
                        _b = expect;
                        return [4 /*yield*/, ratePage.getRatingCounter()];
                    case 4: return [4 /*yield*/, _b.apply(void 0, [_h.sent()]).toBe('0')];
                    case 5:
                        _h.sent();
                        return [4 /*yield*/, ratePage.rateComponent(4)];
                    case 6:
                        _h.sent();
                        _c = expect;
                        return [4 /*yield*/, ratePage.getRatingCounter()];
                    case 7: return [4 /*yield*/, _c.apply(void 0, [_h.sent()]).toBe('1')];
                    case 8:
                        _h.sent();
                        _d = expect;
                        return [4 /*yield*/, ratePage.isStarRated(4)];
                    case 9: return [4 /*yield*/, _d.apply(void 0, [_h.sent()])];
                    case 10:
                        _h.sent();
                        _e = expect;
                        return [4 /*yield*/, ratePage.getRatedStarColor(4)];
                    case 11: return [4 /*yield*/, _e.apply(void 0, [_h.sent()]).toBe(yellowRatedStarColor)];
                    case 12:
                        _h.sent();
                        return [4 /*yield*/, ratePage.removeRating(4)];
                    case 13:
                        _h.sent();
                        _f = expect;
                        return [4 /*yield*/, ratePage.getRatingCounter()];
                    case 14: return [4 /*yield*/, _f.apply(void 0, [_h.sent()]).toBe('0')];
                    case 15:
                        _h.sent();
                        _g = expect;
                        return [4 /*yield*/, ratePage.isNotStarRated(4)];
                    case 16: return [4 /*yield*/, _g.apply(void 0, [_h.sent()])];
                    case 17:
                        _h.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Multiple Users interaction', function () {
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(componentVisitor)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickSocialButton()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C310197] Should be able to like, unLike, display total likes', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0: return [4 /*yield*/, socialPage.writeCustomNodeId(emptyFile.entry.id)];
                    case 1:
                        _k.sent();
                        _a = expect;
                        return [4 /*yield*/, socialPage.getNodeIdFieldValue()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_k.sent()]).toEqual(emptyFile.entry.id)];
                    case 3:
                        _k.sent();
                        _b = expect;
                        return [4 /*yield*/, likePage.getUnLikedIconColor()];
                    case 4: return [4 /*yield*/, _b.apply(void 0, [_k.sent()]).toBe(greyLikeColor)];
                    case 5:
                        _k.sent();
                        return [4 /*yield*/, likePage.clickLike()];
                    case 6:
                        _k.sent();
                        _c = expect;
                        return [4 /*yield*/, likePage.getLikeCounter()];
                    case 7: return [4 /*yield*/, _c.apply(void 0, [_k.sent()]).toBe('1')];
                    case 8:
                        _k.sent();
                        return [4 /*yield*/, likePage.removeHoverFromLikeButton()];
                    case 9:
                        _k.sent();
                        _d = expect;
                        return [4 /*yield*/, likePage.getLikedIconColor()];
                    case 10: return [4 /*yield*/, _d.apply(void 0, [_k.sent()]).toBe(blueLikeColor)];
                    case 11:
                        _k.sent();
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(secondComponentVisitor)];
                    case 12:
                        _k.sent();
                        return [4 /*yield*/, navigationBarPage.clickSocialButton()];
                    case 13:
                        _k.sent();
                        return [4 /*yield*/, socialPage.writeCustomNodeId(emptyFile.entry.id)];
                    case 14:
                        _k.sent();
                        _e = expect;
                        return [4 /*yield*/, likePage.getUnLikedIconColor()];
                    case 15: return [4 /*yield*/, _e.apply(void 0, [_k.sent()]).toBe(greyLikeColor)];
                    case 16:
                        _k.sent();
                        return [4 /*yield*/, likePage.clickLike()];
                    case 17:
                        _k.sent();
                        _f = expect;
                        return [4 /*yield*/, likePage.getLikeCounter()];
                    case 18: return [4 /*yield*/, _f.apply(void 0, [_k.sent()]).toEqual('2')];
                    case 19:
                        _k.sent();
                        return [4 /*yield*/, likePage.removeHoverFromLikeButton()];
                    case 20:
                        _k.sent();
                        _g = expect;
                        return [4 /*yield*/, likePage.getLikedIconColor()];
                    case 21: return [4 /*yield*/, _g.apply(void 0, [_k.sent()]).toBe(blueLikeColor)];
                    case 22:
                        _k.sent();
                        return [4 /*yield*/, likePage.clickUnlike()];
                    case 23:
                        _k.sent();
                        _h = expect;
                        return [4 /*yield*/, likePage.getLikeCounter()];
                    case 24: return [4 /*yield*/, _h.apply(void 0, [_k.sent()]).toEqual('1')];
                    case 25:
                        _k.sent();
                        return [4 /*yield*/, likePage.removeHoverFromLikeButton()];
                    case 26:
                        _k.sent();
                        _j = expect;
                        return [4 /*yield*/, likePage.getUnLikedIconColor()];
                    case 27: return [4 /*yield*/, _j.apply(void 0, [_k.sent()]).toBe(greyLikeColor)];
                    case 28:
                        _k.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260327] Should be able to rate, unRate, display total ratings, display average rating', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0: return [4 /*yield*/, socialPage.writeCustomNodeId(emptyFile.entry.id)];
                    case 1:
                        _m.sent();
                        _a = expect;
                        return [4 /*yield*/, socialPage.getNodeIdFieldValue()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_m.sent()]).toEqual(emptyFile.entry.id)];
                    case 3:
                        _m.sent();
                        return [4 /*yield*/, ratePage.rateComponent(4)];
                    case 4:
                        _m.sent();
                        _b = expect;
                        return [4 /*yield*/, ratePage.getRatingCounter()];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [_m.sent()]).toEqual('1')];
                    case 6:
                        _m.sent();
                        _c = expect;
                        return [4 /*yield*/, ratePage.isStarRated(4)];
                    case 7: return [4 /*yield*/, _c.apply(void 0, [_m.sent()])];
                    case 8:
                        _m.sent();
                        _d = expect;
                        return [4 /*yield*/, ratePage.getRatedStarColor(4)];
                    case 9: return [4 /*yield*/, _d.apply(void 0, [_m.sent()]).toBe(yellowRatedStarColor)];
                    case 10:
                        _m.sent();
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(secondComponentVisitor)];
                    case 11:
                        _m.sent();
                        return [4 /*yield*/, navigationBarPage.clickSocialButton()];
                    case 12:
                        _m.sent();
                        return [4 /*yield*/, socialPage.writeCustomNodeId(emptyFile.entry.id)];
                    case 13:
                        _m.sent();
                        _e = expect;
                        return [4 /*yield*/, socialPage.getNodeIdFieldValue()];
                    case 14: return [4 /*yield*/, _e.apply(void 0, [_m.sent()]).toEqual(emptyFile.entry.id)];
                    case 15:
                        _m.sent();
                        _f = expect;
                        return [4 /*yield*/, ratePage.getRatingCounter()];
                    case 16: return [4 /*yield*/, _f.apply(void 0, [_m.sent()]).toEqual('1')];
                    case 17:
                        _m.sent();
                        _g = expect;
                        return [4 /*yield*/, ratePage.getAverageStarColor(4)];
                    case 18: return [4 /*yield*/, _g.apply(void 0, [_m.sent()]).toBe(averageStarColor)];
                    case 19:
                        _m.sent();
                        return [4 /*yield*/, ratePage.rateComponent(0)];
                    case 20:
                        _m.sent();
                        _h = expect;
                        return [4 /*yield*/, ratePage.getRatingCounter()];
                    case 21: return [4 /*yield*/, _h.apply(void 0, [_m.sent()]).toEqual('2')];
                    case 22:
                        _m.sent();
                        _j = expect;
                        return [4 /*yield*/, ratePage.isStarRated(2)];
                    case 23: return [4 /*yield*/, _j.apply(void 0, [_m.sent()])];
                    case 24:
                        _m.sent();
                        return [4 /*yield*/, ratePage.removeRating(0)];
                    case 25:
                        _m.sent();
                        _k = expect;
                        return [4 /*yield*/, ratePage.getRatingCounter()];
                    case 26: return [4 /*yield*/, _k.apply(void 0, [_m.sent()]).toEqual('1')];
                    case 27:
                        _m.sent();
                        _l = expect;
                        return [4 /*yield*/, ratePage.getAverageStarColor(4)];
                    case 28: return [4 /*yield*/, _l.apply(void 0, [_m.sent()]).toBe(averageStarColor)];
                    case 29:
                        _m.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=social.component.e2e.js.map