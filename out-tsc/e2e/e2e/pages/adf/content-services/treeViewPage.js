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
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var adf_testing_1 = require("@alfresco/adf-testing");
var TreeViewPage = /** @class */ (function () {
    function TreeViewPage() {
        this.treeViewTitle = protractor_1.element(protractor_1.by.cssContainingText('app-tree-view div', 'TREE VIEW TEST'));
        this.nodeIdInput = protractor_1.element(protractor_1.by.css('input[placeholder="Node Id"]'));
        this.noNodeMessage = protractor_1.element(protractor_1.by.id('adf-tree-view-missing-node'));
        this.nodesOnPage = protractor_1.element.all(protractor_1.by.css('mat-tree-node'));
    }
    TreeViewPage.prototype.checkTreeViewTitleIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.treeViewTitle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TreeViewPage.prototype.getNodeId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.nodeIdInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.nodeIdInput.getAttribute('value')];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TreeViewPage.prototype.clickNode = function (nodeName) {
        return __awaiter(this, void 0, void 0, function () {
            var node;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        node = protractor_1.element(protractor_1.by.css('mat-tree-node[id="' + nodeName + '-tree-child-node"] button'));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(node)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TreeViewPage.prototype.checkNodeIsDisplayedAsClosed = function (nodeName) {
        return __awaiter(this, void 0, void 0, function () {
            var node;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        node = protractor_1.element(protractor_1.by.css('mat-tree-node[id="' + nodeName + '-tree-child-node"][aria-expanded="false"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(node)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TreeViewPage.prototype.checkNodeIsDisplayedAsOpen = function (nodeName) {
        return __awaiter(this, void 0, void 0, function () {
            var node;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        node = protractor_1.element(protractor_1.by.css('mat-tree-node[id="' + nodeName + '-tree-child-node"][aria-expanded="true"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(node)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TreeViewPage.prototype.checkClickedNodeName = function (nodeName) {
        return __awaiter(this, void 0, void 0, function () {
            var clickedNode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clickedNode = protractor_1.element(protractor_1.by.cssContainingText('span', ' CLICKED NODE: ' + nodeName + ''));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(clickedNode)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TreeViewPage.prototype.checkNodeIsNotDisplayed = function (nodeName) {
        return __awaiter(this, void 0, void 0, function () {
            var node;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        node = protractor_1.element(protractor_1.by.id('' + nodeName + '-tree-child-node'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(node)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TreeViewPage.prototype.clearNodeIdInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.nodeIdInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearWithBackSpace(this.nodeIdInput)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TreeViewPage.prototype.checkNoNodeIdMessageIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.noNodeMessage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TreeViewPage.prototype.addNodeId = function (nodeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.nodeIdInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.nodeIdInput, nodeId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.nodeIdInput.sendKeys('a')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.nodeIdInput.sendKeys(protractor_1.protractor.Key.BACK_SPACE)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TreeViewPage.prototype.checkErrorMessageIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var clickedNode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clickedNode = protractor_1.element(protractor_1.by.cssContainingText('span', 'An Error Occurred '));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(clickedNode)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TreeViewPage.prototype.getTotalNodes = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nodesOnPage.count()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return TreeViewPage;
}());
exports.TreeViewPage = TreeViewPage;
//# sourceMappingURL=treeViewPage.js.map