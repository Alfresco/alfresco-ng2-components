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
var SearchSortingPickerPage = /** @class */ (function () {
    function SearchSortingPickerPage() {
        this.sortingSelector = protractor_1.element(protractor_1.by.css('adf-sorting-picker div[class="mat-select-arrow"]'));
        this.orderArrow = protractor_1.element(protractor_1.by.css('adf-sorting-picker button mat-icon'));
        this.optionsDropdown = protractor_1.element(protractor_1.by.css('div .mat-select-panel'));
    }
    SearchSortingPickerPage.prototype.sortBy = function (sortOrder, sortType) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedSortingOption;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.sortingSelector)];
                    case 1:
                        _a.sent();
                        selectedSortingOption = protractor_1.element(protractor_1.by.cssContainingText('span[class="mat-option-text"]', sortType));
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(selectedSortingOption)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.sortByOrder(sortOrder)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *  Sort the list by name column.
     *
     * @param sortOrder : 'ASC' to sort the list ascendant and 'DESC' for descendant
     */
    SearchSortingPickerPage.prototype.sortByOrder = function (sortOrder) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.orderArrow)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.orderArrow.getText()];
                    case 2:
                        result = _a.sent();
                        if (!(sortOrder.toLocaleLowerCase() === 'asc')) return [3 /*break*/, 5];
                        if (!(result !== 'arrow_upward')) return [3 /*break*/, 4];
                        return [4 /*yield*/, protractor_1.browser.executeScript("document.querySelector('adf-sorting-picker button mat-icon').click();")];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        if (!(result === 'arrow_upward')) return [3 /*break*/, 7];
                        return [4 /*yield*/, protractor_1.browser.executeScript("document.querySelector('adf-sorting-picker button mat-icon').click();")];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPickerPage.prototype.clickSortingOption = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedSortingOption;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedSortingOption = protractor_1.element(protractor_1.by.cssContainingText('span[class="mat-option-text"]', option));
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(selectedSortingOption)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPickerPage.prototype.clickSortingSelector = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.sortingSelector)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPickerPage.prototype.checkOptionIsDisplayed = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var optionSelector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        optionSelector = this.optionsDropdown.element(protractor_1.by.cssContainingText('span[class="mat-option-text"]', option));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(optionSelector)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPickerPage.prototype.checkOptionIsNotDisplayed = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var optionSelector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        optionSelector = this.optionsDropdown.element(protractor_1.by.cssContainingText('span[class="mat-option-text"]', option));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(optionSelector)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPickerPage.prototype.checkOptionsDropdownIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.optionsDropdown)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPickerPage.prototype.checkSortingSelectorIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.sortingSelector)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchSortingPickerPage.prototype.checkOrderArrowIsDownward = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.orderArrow)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.orderArrow.getText()];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result !== 'arrow_upward'];
                }
            });
        });
    };
    SearchSortingPickerPage.prototype.checkOrderArrowIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.orderArrow)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SearchSortingPickerPage;
}());
exports.SearchSortingPickerPage = SearchSortingPickerPage;
//# sourceMappingURL=search-sorting-picker.page.js.map