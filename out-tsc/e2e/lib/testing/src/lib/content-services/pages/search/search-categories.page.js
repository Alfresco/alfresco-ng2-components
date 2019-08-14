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
var search_text_page_1 = require("./search-text.page");
var search_checkList_page_1 = require("./search-checkList.page");
var search_radio_page_1 = require("./search-radio.page");
var date_range_filter_page_1 = require("./date-range-filter.page");
var number_range_filter_page_1 = require("./number-range-filter.page");
var search_slider_page_1 = require("./search-slider.page");
var browser_actions_1 = require("../../../core/utils/browser-actions");
var browser_visibility_1 = require("../../../core/utils/browser-visibility");
var SearchCategoriesPage = /** @class */ (function () {
    function SearchCategoriesPage() {
    }
    SearchCategoriesPage.checkListFiltersPage = function (filter) {
        return new search_checkList_page_1.SearchCheckListPage(filter);
    };
    SearchCategoriesPage.textFiltersPage = function (filter) {
        return new search_text_page_1.SearchTextPage(filter);
    };
    SearchCategoriesPage.radioFiltersPage = function (filter) {
        return new search_radio_page_1.SearchRadioPage(filter);
    };
    SearchCategoriesPage.dateRangeFilter = function (filter) {
        return new date_range_filter_page_1.DateRangeFilterPage(filter);
    };
    SearchCategoriesPage.numberRangeFilter = function (filter) {
        return new number_range_filter_page_1.NumberRangeFilterPage(filter);
    };
    SearchCategoriesPage.sliderFilter = function (filter) {
        return new search_slider_page_1.SearchSliderPage(filter);
    };
    SearchCategoriesPage.prototype.checkFilterIsDisplayed = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(filter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCategoriesPage.prototype.clickFilter = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(filter.element(protractor_1.by.css('mat-expansion-panel-header')))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCategoriesPage.prototype.clickFilterHeader = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var fileSizeFilterHeader;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileSizeFilterHeader = filter.element(protractor_1.by.css('mat-expansion-panel-header'));
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(fileSizeFilterHeader)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCategoriesPage.prototype.checkFilterIsCollapsed = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var elementClass;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, filter.getAttribute('class')];
                    case 1:
                        elementClass = _a.sent();
                        return [4 /*yield*/, expect(elementClass).not.toContain('mat-expanded')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchCategoriesPage.prototype.checkFilterIsExpanded = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var elementClass;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, filter.getAttribute('class')];
                    case 1:
                        elementClass = _a.sent();
                        return [4 /*yield*/, expect(elementClass).toContain('mat-expanded')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SearchCategoriesPage;
}());
exports.SearchCategoriesPage = SearchCategoriesPage;
//# sourceMappingURL=search-categories.page.js.map