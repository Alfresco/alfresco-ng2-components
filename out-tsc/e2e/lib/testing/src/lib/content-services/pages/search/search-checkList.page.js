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
var browser_actions_1 = require("../../../core/utils/browser-actions");
var browser_visibility_1 = require("../../../core/utils/browser-visibility");
var SearchCheckListPage = /** @class */ (function () {
    function SearchCheckListPage(filter) {
        this.inputBy = protractor_1.by.css('div[class*="mat-expansion-panel-content"] input');
        this.showMoreBy = protractor_1.by.css('button[title="Show more"]');
        this.showLessBy = protractor_1.by.css('button[title="Show less"]');
        this.clearAllButton = protractor_1.by.css('button');
        this.filter = filter;
    }
    SearchCheckListPage.prototype.clickCheckListOption = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter)];
                    case 1:
                        _a.sent();
                        result = this.filter.all(protractor_1.by.css("mat-checkbox[data-automation-id*='" + option + "'] .mat-checkbox-inner-container")).first();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(result)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.checkChipIsDisplayed = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element(protractor_1.by.cssContainingText('mat-chip', option)).element(protractor_1.by.css('mat-icon')))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.checkChipIsNotDisplayed = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(protractor_1.element(protractor_1.by.cssContainingText('mat-chip', option)).element(protractor_1.by.css('mat-icon')))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.removeFilterOption = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var cancelChipButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cancelChipButton = protractor_1.element(protractor_1.by.cssContainingText('mat-chip', option)).element(protractor_1.by.css('mat-icon'));
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(cancelChipButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.filterBy = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkSearchFilterInputIsDisplayed()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.searchInFilter(option)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.clickCheckListOption(option)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    SearchCheckListPage.prototype.checkSearchFilterInputIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter.all(this.inputBy).first())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.searchInFilter = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var inputElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsClickable(this.filter)];
                    case 1:
                        _a.sent();
                        inputElement = this.filter.all(this.inputBy).first();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsClickable(inputElement)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(inputElement, option)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.checkShowLessButtonIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.showLessBy))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.checkShowLessButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.showLessBy))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.checkShowMoreButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.showMoreBy))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.checkShowMoreButtonIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.showMoreBy))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.clickShowMoreButtonUntilIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var visible;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.isElementPresent(this.filter.element(this.showMoreBy))];
                    case 1:
                        visible = _a.sent();
                        if (!visible) return [3 /*break*/, 4];
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.filter.element(this.showMoreBy))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.clickShowMoreButtonUntilIsNotDisplayed()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.clickShowLessButtonUntilIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var visible;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.isElementPresent(this.filter.element(this.showLessBy))];
                    case 1:
                        visible = _a.sent();
                        if (!visible) return [3 /*break*/, 4];
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.filter.element(this.showLessBy))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.clickShowLessButtonUntilIsNotDisplayed()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.getBucketNumberOfFilterType = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var fileTypeFilter, valueOfBucket, numberOfBucket, totalNumberOfBucket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileTypeFilter = this.filter.all(protractor_1.by.css('mat-checkbox[data-automation-id*=".' + option + '"] span')).first();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(fileTypeFilter)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fileTypeFilter.getText()];
                    case 2:
                        valueOfBucket = _a.sent();
                        numberOfBucket = valueOfBucket.split('(')[1];
                        totalNumberOfBucket = numberOfBucket.split(')')[0];
                        return [2 /*return*/, totalNumberOfBucket.trim()];
                }
            });
        });
    };
    SearchCheckListPage.prototype.checkCheckListOptionIsDisplayed = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter)];
                    case 1:
                        _a.sent();
                        result = this.filter.element(protractor_1.by.css("mat-checkbox[data-automation-id*='-" + option + "']"));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(result)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.checkCheckListOptionIsNotSelected = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter)];
                    case 1:
                        _a.sent();
                        result = this.filter.element(protractor_1.by.css("mat-checkbox[data-automation-id*='-" + option + "'][class*='checked']"));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(result)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.checkCheckListOptionIsSelected = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter)];
                    case 1:
                        _a.sent();
                        result = this.filter.element(protractor_1.by.css("mat-checkbox[data-automation-id*='-" + option + "'][class*='checked']"));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(result)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.checkClearAllButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter)];
                    case 1:
                        _a.sent();
                        result = this.filter.element(this.clearAllButton);
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(result)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.clickClearAllButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter)];
                    case 1:
                        _a.sent();
                        result = this.filter.element(this.clearAllButton);
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(result)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.getCheckListOptionsNumberOnPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var checkListOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter)];
                    case 1:
                        _a.sent();
                        checkListOptions = this.filter.all(protractor_1.by.css('div[class="checklist"] mat-checkbox'));
                        return [2 /*return*/, checkListOptions.count()];
                }
            });
        });
    };
    SearchCheckListPage.prototype.clickShowMoreButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.filter.element(this.showMoreBy))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCheckListPage.prototype.clickShowLessButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.filter.element(this.showLessBy))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SearchCheckListPage;
}());
exports.SearchCheckListPage = SearchCheckListPage;
//# sourceMappingURL=search-checkList.page.js.map