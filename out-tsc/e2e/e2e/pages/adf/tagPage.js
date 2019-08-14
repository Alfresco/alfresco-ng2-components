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
var TagPage = /** @class */ (function () {
    function TagPage() {
        this.addTagButton = protractor_1.element(protractor_1.by.css('button[id="add-tag"]'));
        this.insertNodeIdElement = protractor_1.element(protractor_1.by.css('input[id="nodeId"]'));
        this.newTagInput = protractor_1.element(protractor_1.by.css('input[id="new-tag-text"]'));
        this.tagListRow = protractor_1.element(protractor_1.by.css('adf-tag-node-actions-list mat-list-item'));
        this.tagListByNodeIdRow = protractor_1.element(protractor_1.by.css('adf-tag-node-list mat-chip'));
        this.errorMessage = protractor_1.element(protractor_1.by.css('mat-hint[data-automation-id="errorMessage"]'));
        this.tagListRowLocator = protractor_1.by.css('adf-tag-node-actions-list mat-list-item div');
        this.tagListByNodeIdRowLocator = protractor_1.by.css('adf-tag-node-list mat-chip span');
        this.tagListContentServicesRowLocator = protractor_1.by.css('div[class*="adf-list-tag"]');
        this.showDeleteButton = protractor_1.element(protractor_1.by.id('adf-remove-button-tag'));
        this.showMoreButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="show-more-tags"]'));
        this.showLessButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="show-fewer-tags"]'));
        this.tagsOnPage = protractor_1.element.all(protractor_1.by.css('div[class*="adf-list-tag"]'));
        this.confirmTag = protractor_1.element(protractor_1.by.id('adf-tag-node-send'));
    }
    TagPage.prototype.getNodeId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.insertNodeIdElement)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.insertNodeIdElement.getAttribute('value')];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TagPage.prototype.insertNodeId = function (nodeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.insertNodeIdElement, nodeId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(200)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.insertNodeIdElement.sendKeys(' ')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(200)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.insertNodeIdElement.sendKeys(protractor_1.protractor.Key.BACK_SPACE)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.clickConfirmTag()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.addNewTagInput = function (tag) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.newTagInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.newTagInput, tag)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.addTag = function (tag) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addNewTagInput(tag)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.addTagButton)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.deleteTagFromTagListByNodeId = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var deleteChip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deleteChip = protractor_1.element(protractor_1.by.id('tag_chips_delete_' + name));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(deleteChip)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.deleteTagFromTagList = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var deleteChip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deleteChip = protractor_1.element(protractor_1.by.id('tag_chips_delete_' + name));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(deleteChip)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.getNewTagInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.newTagInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.newTagInput.getAttribute('value')];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TagPage.prototype.getNewTagPlaceholder = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.newTagInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.newTagInput.getAttribute('placeholder')];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TagPage.prototype.addTagButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.addTagButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.addTagButton.isEnabled()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TagPage.prototype.checkTagIsDisplayedInTagList = function (tagName) {
        return __awaiter(this, void 0, void 0, function () {
            var tag;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tag = protractor_1.element(protractor_1.by.cssContainingText('div[id*="tag_name"]', tagName));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(tag)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.checkTagIsNotDisplayedInTagList = function (tagName) {
        return __awaiter(this, void 0, void 0, function () {
            var tag;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tag = protractor_1.element(protractor_1.by.cssContainingText('div[id*="tag_name"]', tagName));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(tag)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.checkTagIsNotDisplayedInTagListByNodeId = function (tagName) {
        return __awaiter(this, void 0, void 0, function () {
            var tag;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tag = protractor_1.element(protractor_1.by.cssContainingText('span[id*="tag_name"]', tagName));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(tag)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.checkTagIsDisplayedInTagListByNodeId = function (tagName) {
        return __awaiter(this, void 0, void 0, function () {
            var tag;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tag = protractor_1.element(protractor_1.by.cssContainingText('span[id*="tag_name"]', tagName));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(tag)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.checkTagListIsEmpty = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.tagListRow)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.checkTagListByNodeIdIsEmpty = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.tagListByNodeIdRow)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.checkTagIsDisplayedInTagListContentServices = function (tagName) {
        return __awaiter(this, void 0, void 0, function () {
            var tag;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tag = protractor_1.element(protractor_1.by.cssContainingText('div[class="adf-list-tag"][id*="tag_name"]', tagName));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(tag)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.getErrorMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.errorMessage)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TagPage.prototype.checkTagListIsOrderedAscending = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkListIsSorted(false, this.tagListRowLocator)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.checkTagListByNodeIdIsOrderedAscending = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkListIsSorted(false, this.tagListByNodeIdRowLocator)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.checkTagListContentServicesIsOrderedAscending = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkListIsSorted(false, this.tagListContentServicesRowLocator)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.checkListIsSorted = function (sortOrder, locator) {
        return __awaiter(this, void 0, void 0, function () {
            var tagList, initialList, sortedList;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tagList = protractor_1.element.all(locator);
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(tagList.first())];
                    case 1:
                        _a.sent();
                        initialList = [];
                        return [4 /*yield*/, tagList.each(function (currentElement) { return __awaiter(_this, void 0, void 0, function () {
                                var text;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, currentElement.getText()];
                                        case 1:
                                            text = _a.sent();
                                            initialList.push(text);
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        sortedList = initialList;
                        sortedList = sortedList.sort();
                        if (sortOrder === false) {
                            sortedList = sortedList.reverse();
                        }
                        return [2 /*return*/, initialList.toString() === sortedList.toString()];
                }
            });
        });
    };
    TagPage.prototype.checkDeleteTagFromTagListByNodeIdIsDisplayed = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var deleteChip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deleteChip = protractor_1.element(protractor_1.by.id('tag_chips_delete_' + name));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(deleteChip)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.checkDeleteTagFromTagListByNodeIdIsNotDisplayed = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var deleteChip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deleteChip = protractor_1.element(protractor_1.by.id('tag_chips_delete_' + name));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(deleteChip)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.clickShowDeleteButtonSwitch = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.showDeleteButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.checkShowMoreButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.showMoreButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.clickShowMoreButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.showMoreButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.clickShowLessButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.showLessButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.clickConfirmTag = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.confirmTag)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.checkTagsOnList = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tagsOnPage.count()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TagPage.prototype.checkShowLessButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.showLessButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.checkShowLessButtonIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.showLessButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.clickShowMoreButtonUntilNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var visible;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.showMoreButton.isDisplayed()];
                    case 1:
                        visible = _a.sent();
                        if (!visible) return [3 /*break*/, 4];
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.showMoreButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.clickShowMoreButtonUntilNotDisplayed()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TagPage.prototype.clickShowLessButtonUntilNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var visible;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.showLessButton.isDisplayed()];
                    case 1:
                        visible = _a.sent();
                        if (!visible) return [3 /*break*/, 4];
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.showLessButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.clickShowLessButtonUntilNotDisplayed()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return TagPage;
}());
exports.TagPage = TagPage;
//# sourceMappingURL=tagPage.js.map