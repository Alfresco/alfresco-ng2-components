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
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var treeViewPage_1 = require("../pages/adf/content-services/treeViewPage");
var acsUserModel_1 = require("../models/ACS/acsUserModel");
var protractor_1 = require("protractor");
var js_api_1 = require("@alfresco/js-api");
describe('Tree View Component', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var treeViewPage = new treeViewPage_1.TreeViewPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var treeFolder, secondTreeFolder, thirdTreeFolder;
    var nodeNames = {
        folder: 'Folder1',
        secondFolder: 'Folder2',
        thirdFolder: 'Folder3',
        parentFolder: '-my-',
        document: 'MyFile'
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
                    return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.nodes.addNode(nodeNames.parentFolder, {
                            name: nodeNames.folder,
                            nodeType: 'cm:folder'
                        })];
                case 4:
                    treeFolder = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.nodes.addNode(nodeNames.parentFolder, {
                            name: nodeNames.secondFolder,
                            nodeType: 'cm:folder'
                        })];
                case 5:
                    secondTreeFolder = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.nodes.addNode(secondTreeFolder.entry.id, {
                            name: nodeNames.thirdFolder,
                            nodeType: 'cm:folder'
                        })];
                case 6:
                    thirdTreeFolder = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.nodes.addNode(thirdTreeFolder.entry.id, {
                            name: nodeNames.document,
                            nodeType: 'cm:content'
                        })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickTreeViewButton()];
                case 9:
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
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(treeFolder.entry.id)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(secondTreeFolder.entry.id)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C289972] Should be able to show folders and sub-folders of a node as a tree view', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, treeViewPage.checkTreeViewTitleIsDisplayed()];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, treeViewPage.getNodeId()];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(nodeNames.parentFolder)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.folder)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.secondFolder)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, treeViewPage.clickNode(nodeNames.secondFolder)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, treeViewPage.checkClickedNodeName(nodeNames.secondFolder)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, treeViewPage.checkNodeIsDisplayedAsOpen(nodeNames.secondFolder)];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.thirdFolder)];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, treeViewPage.clickNode(nodeNames.thirdFolder)];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, treeViewPage.checkClickedNodeName(nodeNames.thirdFolder)];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, treeViewPage.checkNodeIsDisplayedAsOpen(nodeNames.thirdFolder)];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, treeViewPage.clickNode(nodeNames.secondFolder)];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, treeViewPage.checkClickedNodeName(nodeNames.secondFolder)];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.secondFolder)];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, treeViewPage.checkNodeIsNotDisplayed(nodeNames.thirdFolder)];
                case 16:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C289973] Should be able to change the default nodeId', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, treeViewPage.clearNodeIdInput()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, treeViewPage.checkNoNodeIdMessageIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, treeViewPage.addNodeId(secondTreeFolder.entry.id)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.thirdFolder)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, treeViewPage.addNodeId('ThisIdDoesNotExist')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, treeViewPage.checkErrorMessageIsDisplayed()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, treeViewPage.addNodeId(nodeNames.parentFolder)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.folder)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.secondFolder)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, treeViewPage.clickNode(nodeNames.secondFolder)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.thirdFolder)];
                case 11:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C290071] Should not be able to display files', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, treeViewPage.addNodeId(secondTreeFolder.entry.id)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, treeViewPage.checkNodeIsDisplayedAsClosed(nodeNames.thirdFolder)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, treeViewPage.clickNode(nodeNames.thirdFolder)];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, treeViewPage.getTotalNodes()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(1)];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=tree-view-component.e2e.js.map