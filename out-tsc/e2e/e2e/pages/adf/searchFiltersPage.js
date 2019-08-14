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
var SearchFiltersPage = /** @class */ (function () {
    function SearchFiltersPage() {
        this.searchCategoriesPage = new adf_testing_1.SearchCategoriesPage();
        this.searchFilters = protractor_1.element(protractor_1.by.css('adf-search-filter'));
        this.fileTypeFilter = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.TYPE"]'));
        this.creatorFilter = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.CREATOR"]'));
        this.fileSizeFilter = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_FIELDS.SIZE"]'));
        this.nameFilter = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="expansion-panel-Name"]'));
        this.checkListFilter = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="expansion-panel-Check List"]'));
        this.createdDateRangeFilter = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="expansion-panel-Created Date (range)"]'));
        this.typeFilter = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="expansion-panel-Type"]'));
        this.sizeRangeFilter = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="expansion-panel-Content Size (range)"]'));
        this.sizeSliderFilter = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="expansion-panel-Content Size"]'));
        this.facetQueriesDefaultGroup = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="expansion-panel-SEARCH.FACET_QUERIES.MY_FACET_QUERIES"],' +
            'mat-expansion-panel[data-automation-id="expansion-panel-My facet queries"]'));
        this.facetQueriesTypeGroup = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="expansion-panel-Type facet queries"]'));
        this.facetQueriesSizeGroup = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="expansion-panel-Size facet queries"]'));
        this.facetIntervalsByCreated = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="expansion-panel-The Created"]'));
        this.facetIntervalsByModified = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="expansion-panel-TheModified"]'));
    }
    SearchFiltersPage.prototype.checkSearchFiltersIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.searchFilters)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.sizeRangeFilterPage = function () {
        return adf_testing_1.SearchCategoriesPage.numberRangeFilter(this.sizeRangeFilter);
    };
    SearchFiltersPage.prototype.createdDateRangeFilterPage = function () {
        return adf_testing_1.SearchCategoriesPage.dateRangeFilter(this.createdDateRangeFilter);
    };
    SearchFiltersPage.prototype.textFiltersPage = function () {
        return adf_testing_1.SearchCategoriesPage.textFiltersPage(this.nameFilter);
    };
    SearchFiltersPage.prototype.checkListFiltersPage = function () {
        return adf_testing_1.SearchCategoriesPage.checkListFiltersPage(this.checkListFilter);
    };
    SearchFiltersPage.prototype.creatorCheckListFiltersPage = function () {
        return adf_testing_1.SearchCategoriesPage.checkListFiltersPage(this.creatorFilter);
    };
    SearchFiltersPage.prototype.fileTypeCheckListFiltersPage = function () {
        return adf_testing_1.SearchCategoriesPage.checkListFiltersPage(this.fileTypeFilter);
    };
    SearchFiltersPage.prototype.typeFiltersPage = function () {
        return adf_testing_1.SearchCategoriesPage.radioFiltersPage(this.typeFilter);
    };
    SearchFiltersPage.prototype.checkCustomFacetFieldLabelIsDisplayed = function (fieldLabel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element(protractor_1.by.css("mat-expansion-panel[data-automation-id=\"expansion-panel-" + fieldLabel + "\"]")))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.sizeSliderFilterPage = function () {
        return adf_testing_1.SearchCategoriesPage.sliderFilter(this.sizeSliderFilter);
    };
    SearchFiltersPage.prototype.checkCheckListFilterIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsDisplayed(this.checkListFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkNameFilterIsExpanded = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsExpanded(this.nameFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkNameFilterIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsDisplayed(this.nameFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkDefaultFacetQueryGroupIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsDisplayed(this.facetQueriesDefaultGroup)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkTypeFacetQueryGroupIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsDisplayed(this.facetQueriesTypeGroup)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkSizeFacetQueryGroupIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsDisplayed(this.facetQueriesSizeGroup)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkFacetIntervalsByCreatedIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsDisplayed(this.facetIntervalsByCreated)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkFacetIntervalsByModifiedIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsDisplayed(this.facetIntervalsByModified)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.isTypeFacetQueryGroupPresent = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.facetQueriesTypeGroup.isPresent()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SearchFiltersPage.prototype.isSizeFacetQueryGroupPresent = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.facetQueriesSizeGroup.isPresent()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SearchFiltersPage.prototype.clickCheckListFilter = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.clickFilter(this.checkListFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.clickFileTypeListFilter = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.clickFilter(this.fileTypeFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.clickFileSizeFilterHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.clickFilterHeader(this.fileSizeFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkFileSizeFilterIsCollapsed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsCollapsed(this.fileSizeFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkFileTypeFilterIsCollapsed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsCollapsed(this.fileTypeFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkCheckListFilterIsCollapsed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsCollapsed(this.checkListFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkCheckListFilterIsExpanded = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsExpanded(this.checkListFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkCreatedRangeFilterIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsDisplayed(this.createdDateRangeFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.clickCreatedRangeFilterHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.clickFilterHeader(this.createdDateRangeFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkCreatedRangeFilterIsExpanded = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsExpanded(this.createdDateRangeFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkTypeFilterIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsDisplayed(this.typeFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkTypeFilterIsCollapsed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsCollapsed(this.typeFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.clickTypeFilterHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.clickFilterHeader(this.typeFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkSizeRangeFilterIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsDisplayed(this.createdDateRangeFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.clickSizeRangeFilterHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.clickFilterHeader(this.sizeRangeFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkSizeRangeFilterIsExpanded = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsExpanded(this.sizeRangeFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkSizeRangeFilterIsCollapsed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsCollapsed(this.sizeRangeFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkSizeSliderFilterIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsDisplayed(this.sizeSliderFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.clickSizeSliderFilterHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.clickFilterHeader(this.sizeSliderFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkSizeSliderFilterIsExpanded = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsExpanded(this.sizeSliderFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkSizeSliderFilterIsCollapsed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsCollapsed(this.sizeSliderFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkFacetIntervalsByCreatedIsExpanded = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsExpanded(this.facetIntervalsByCreated)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkFacetIntervalsByCreatedIsCollapsed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsCollapsed(this.facetIntervalsByCreated)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.clickFacetIntervalsByCreatedFilterHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.clickFilterHeader(this.facetIntervalsByCreated)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkFacetIntervalsByModifiedIsExpanded = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsExpanded(this.facetIntervalsByModified)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkFacetIntervalsByModifiedIsCollapsed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.checkFilterIsCollapsed(this.facetIntervalsByModified)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.clickFacetIntervalsByModifiedFilterHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchCategoriesPage.clickFilterHeader(this.facetIntervalsByModified)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkFileTypeFacetLabelIsDisplayed = function (fileType) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.fileTypeFilter.element(protractor_1.by.cssContainingText('.adf-facet-label', fileType)))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchFiltersPage.prototype.checkFileTypeFacetLabelIsNotDisplayed = function (fileType) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.fileTypeFilter.element(protractor_1.by.cssContainingText('.adf-facet-label', fileType)))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SearchFiltersPage;
}());
exports.SearchFiltersPage = SearchFiltersPage;
//# sourceMappingURL=searchFiltersPage.js.map