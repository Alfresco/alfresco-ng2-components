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
var browser_visibility_1 = require("../utils/browser-visibility");
var browser_actions_1 = require("../utils/browser-actions");
var PaginationPage = /** @class */ (function () {
    function PaginationPage() {
        this.pageSelectorDropDown = protractor_1.element(protractor_1.by.css('div[class*="adf-pagination__page-selector"]'));
        this.pageSelectorArrow = protractor_1.element(protractor_1.by.css('button[data-automation-id="page-selector"]'));
        this.itemsPerPage = protractor_1.element(protractor_1.by.css('span[class="adf-pagination__max-items"]'));
        this.currentPage = protractor_1.element(protractor_1.by.css('span[class="adf-pagination__current-page"]'));
        this.totalPages = protractor_1.element(protractor_1.by.css('span[class="adf-pagination__total-pages"]'));
        this.paginationRange = protractor_1.element(protractor_1.by.css('span[class="adf-pagination__range"]'));
        this.nextPageButton = protractor_1.element(protractor_1.by.css('button[class*="adf-pagination__next-button"]'));
        this.nextButtonDisabled = protractor_1.element(protractor_1.by.css('button[class*="adf-pagination__next-button"][disabled]'));
        this.previousButtonDisabled = protractor_1.element(protractor_1.by.css('button[class*="adf-pagination__previous-button"][disabled]'));
        this.pageDropDown = protractor_1.element(protractor_1.by.css('div[class*="adf-pagination__actualinfo-block"] button'));
        this.pageDropDownOptions = protractor_1.by.css('div[class*="mat-menu-content"] button');
        this.paginationSection = protractor_1.element(protractor_1.by.css('adf-pagination'));
        this.paginationSectionEmpty = protractor_1.element(protractor_1.by.css('adf-pagination[class*="adf-pagination__empty"]'));
        this.totalFiles = protractor_1.element(protractor_1.by.css('span[class="adf-pagination__range"]'));
    }
    PaginationPage.prototype.selectItemsPerPage = function (numberOfItem) {
        return __awaiter(this, void 0, void 0, function () {
            var itemsPerPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.executeScript("document.querySelector('div[class*=\"adf-pagination__perpage-block\"] button').click();")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.pageSelectorDropDown)];
                    case 2:
                        _a.sent();
                        itemsPerPage = protractor_1.element.all(protractor_1.by.cssContainingText('.mat-menu-item', numberOfItem)).first();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(itemsPerPage)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.pageSelectorDropDown)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PaginationPage.prototype.checkPageSelectorIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.pageSelectorArrow)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PaginationPage.prototype.checkPageSelectorIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.pageSelectorArrow)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PaginationPage.prototype.checkPaginationIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.paginationSectionEmpty)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PaginationPage.prototype.getCurrentItemsPerPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.itemsPerPage)];
            });
        });
    };
    PaginationPage.prototype.getCurrentPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.currentPage)];
            });
        });
    };
    PaginationPage.prototype.getTotalPages = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.totalPages)];
            });
        });
    };
    PaginationPage.prototype.getPaginationRange = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.paginationRange)];
            });
        });
    };
    PaginationPage.prototype.clickOnNextPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.executeScript("document.querySelector('button[class*=\"adf-pagination__next-button\"]').click();")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PaginationPage.prototype.clickOnPageDropdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.pageDropDown)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PaginationPage.prototype.clickOnPageDropdownOption = function (numberOfItemPerPage) {
        return __awaiter(this, void 0, void 0, function () {
            var option;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element.all(this.pageDropDownOptions).first())];
                    case 1:
                        _a.sent();
                        option = protractor_1.element(protractor_1.by.cssContainingText('div[class*="mat-menu-content"] button', numberOfItemPerPage));
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(option)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PaginationPage.prototype.getPageDropdownOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var initialList;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element.all(this.pageDropDownOptions).first())];
                    case 1:
                        _a.sent();
                        initialList = [];
                        return [4 /*yield*/, protractor_1.element.all(this.pageDropDownOptions).each(function (currentOption) { return __awaiter(_this, void 0, void 0, function () {
                                var text;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, currentOption.getText()];
                                        case 1:
                                            text = _a.sent();
                                            if (text !== '') {
                                                initialList.push(text);
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, initialList];
                }
            });
        });
    };
    PaginationPage.prototype.checkNextPageButtonIsDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.nextButtonDisabled)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PaginationPage.prototype.checkPreviousPageButtonIsDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.previousButtonDisabled)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PaginationPage.prototype.checkNextPageButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.nextButtonDisabled)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PaginationPage.prototype.checkPreviousPageButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.previousButtonDisabled)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PaginationPage.prototype.getTotalNumberOfFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalNumberOfFiles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.totalFiles)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.totalFiles.getText()];
                    case 2:
                        totalNumberOfFiles = _a.sent();
                        return [2 /*return*/, totalNumberOfFiles.split('of ')[1]];
                }
            });
        });
    };
    return PaginationPage;
}());
exports.PaginationPage = PaginationPage;
//# sourceMappingURL=pagination.page.js.map