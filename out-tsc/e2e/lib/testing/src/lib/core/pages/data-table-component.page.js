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
var DataTableComponentPage = /** @class */ (function () {
    function DataTableComponentPage(rootElement) {
        if (rootElement === void 0) { rootElement = protractor_1.element.all(protractor_1.by.css('adf-datatable')).first(); }
        this.rows = protractor_1.by.css("adf-datatable div[class*='adf-datatable-body'] div[class*='adf-datatable-row']");
        this.rootElement = rootElement;
        this.list = this.rootElement.all(protractor_1.by.css("div[class*='adf-datatable-body'] div[class*='adf-datatable-row']"));
        this.contents = this.rootElement.all(protractor_1.by.css('div[class="adf-datatable-body"] span'));
        this.tableBody = this.rootElement.all(protractor_1.by.css("div[class='adf-datatable-body']")).first();
        this.allColumns = this.rootElement.all(protractor_1.by.css('div[data-automation-id*="auto_id_entry."]'));
        this.selectedRowNumber = this.rootElement.element(protractor_1.by.css("div[class*='is-selected'] div[data-automation-id*='text_']"));
        this.allSelectedRows = this.rootElement.all(protractor_1.by.css("div[class*='is-selected']"));
        this.selectAll = this.rootElement.element(protractor_1.by.css("div[class*='adf-datatable-header'] mat-checkbox"));
        this.copyColumnTooltip = this.rootElement.element(protractor_1.by.css("adf-copy-content-tooltip span"));
    }
    DataTableComponentPage.prototype.checkAllRowsButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.selectAll)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.checkAllRows = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.selectAll)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.selectAll.element(protractor_1.by.css('input[aria-checked="true"]')))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.uncheckAllRows = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.selectAll)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.selectAll.element(protractor_1.by.css('input[aria-checked="true"]')))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.clickCheckbox = function (columnName, columnValue) {
        return __awaiter(this, void 0, void 0, function () {
            var checkbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkbox = this.getRowCheckbox(columnName, columnValue);
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(checkbox)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.checkRowIsNotChecked = function (columnName, columnValue) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.getRowCheckbox(columnName, columnValue).element(protractor_1.by.css('input[aria-checked="true"]')))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.checkRowIsChecked = function (columnName, columnValue) {
        return __awaiter(this, void 0, void 0, function () {
            var rowCheckbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rowCheckbox = this.getRowCheckbox(columnName, columnValue);
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(rowCheckbox.element(protractor_1.by.css('input[aria-checked="true"]')))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.getRowCheckbox = function (columnName, columnValue) {
        return this.getRow(columnName, columnValue).element(protractor_1.by.css('mat-checkbox'));
    };
    DataTableComponentPage.prototype.checkNoRowIsSelected = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.selectedRowNumber)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.getNumberOfSelectedRows = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.allSelectedRows.count()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DataTableComponentPage.prototype.selectRow = function (columnName, columnValue) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        row = this.getRow(columnName, columnValue);
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(row)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.selectRowWithKeyboard = function (columnName, columnValue) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.actions().sendKeys(protractor_1.protractor.Key.COMMAND).perform()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.selectRow(columnName, columnValue)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.actions().sendKeys(protractor_1.protractor.Key.NULL).perform()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.checkRowIsSelected = function (columnName, columnValue) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedRow = this.getCellElementByValue(columnName, columnValue).element(protractor_1.by.xpath("ancestor::div[contains(@class, 'is-selected')]"));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(selectedRow)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.checkRowIsNotSelected = function (columnName, columnValue) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedRow = this.getCellElementByValue(columnName, columnValue).element(protractor_1.by.xpath("ancestor::div[contains(@class, 'is-selected')]"));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(selectedRow)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.getColumnValueForRow = function (identifyingColumn, identifyingValue, columnName) {
        return __awaiter(this, void 0, void 0, function () {
            var row, rowColumn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = this.getRow(identifyingColumn, identifyingValue);
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(row)];
                    case 1:
                        _a.sent();
                        rowColumn = row.element(protractor_1.by.css("div[title=\"" + columnName + "\"] span"));
                        return [4 /*yield*/, browser_actions_1.BrowserActions.getText(rowColumn)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Check the list is sorted.
     *
     * @param sortOrder: 'ASC' if the list is await expected to be sorted ascending and 'DESC' for descending
     * @param columnTitle: titleColumn column
     * @return 'true' if the list is sorted as await expected and 'false' if it isn't
     */
    DataTableComponentPage.prototype.checkListIsSorted = function (sortOrder, columnTitle) {
        return __awaiter(this, void 0, void 0, function () {
            var column, initialList, sortedList;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        column = protractor_1.element.all(protractor_1.by.css("div.adf-datatable-cell[title='" + columnTitle + "'] span"));
                        initialList = [];
                        return [4 /*yield*/, column.each(function (currentElement) { return __awaiter(_this, void 0, void 0, function () {
                                var text;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, currentElement.getText()];
                                        case 1:
                                            text = _a.sent();
                                            if (text.length !== 0) {
                                                initialList.push(text.toLowerCase());
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        sortedList = initialList;
                        sortedList = sortedList.sort();
                        if (sortOrder.toLocaleLowerCase() === 'desc') {
                            sortedList = sortedList.reverse();
                        }
                        return [2 /*return*/, initialList.toString() === sortedList.toString()];
                }
            });
        });
    };
    DataTableComponentPage.prototype.rightClickOnRow = function (columnName, columnValue) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = this.getRow(columnName, columnValue);
                        return [4 /*yield*/, protractor_1.browser.actions().mouseMove(row).perform()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.actions().click(row, protractor_1.protractor.Button.RIGHT).perform()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element(protractor_1.by.id('adf-context-menu-content')))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.getTooltip = function (columnName, columnValue) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCellElementByValue(columnName, columnValue).getAttribute('title')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DataTableComponentPage.prototype.rightClickOnRowByIndex = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = this.getRowByIndex(index);
                        return [4 /*yield*/, browser_actions_1.BrowserActions.rightClick(row)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element(protractor_1.by.id('adf-context-menu-content')))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.getFileHyperlink = function (filename) {
        return protractor_1.element(protractor_1.by.cssContainingText('adf-name-column[class*="adf-datatable-link"] span', filename));
    };
    DataTableComponentPage.prototype.numberOfRows = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rootElement.all(this.rows).count()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DataTableComponentPage.prototype.getAllRowsColumnValues = function (column) {
        return __awaiter(this, void 0, void 0, function () {
            var columnLocator;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        columnLocator = protractor_1.by.css("adf-datatable div[class*='adf-datatable-body'] div[class*='adf-datatable-row'] div[title='" + column + "'] span");
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsPresent(protractor_1.element.all(columnLocator).first())];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.element.all(columnLocator)
                                .filter(function (el) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, el.isPresent()];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); })
                                .map(function (el) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, el.getText()];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DataTableComponentPage.prototype.getRowsWithSameColumnValues = function (columnName, columnValue) {
        return __awaiter(this, void 0, void 0, function () {
            var columnLocator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        columnLocator = protractor_1.by.css("div[title='" + columnName + "'] div[data-automation-id=\"text_" + columnValue + "\"] span");
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.rootElement.all(columnLocator).first())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.rootElement.all(columnLocator).getText()];
                }
            });
        });
    };
    DataTableComponentPage.prototype.doubleClickRow = function (columnName, columnValue) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = this.getRow(columnName, columnValue);
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(row)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.actions().sendKeys(protractor_1.protractor.Key.ENTER).perform()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.waitForTableBody = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.tableBody)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.getFirstElementDetail = function (detail) {
        return __awaiter(this, void 0, void 0, function () {
            var firstNode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        firstNode = protractor_1.element.all(protractor_1.by.css("adf-datatable div[title=\"" + detail + "\"] span")).first();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.getText(firstNode)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DataTableComponentPage.prototype.geCellElementDetail = function (detail) {
        return protractor_1.element.all(protractor_1.by.css("adf-datatable div[title=\"" + detail + "\"] span"));
    };
    /**
     *  Sort the list by name column.
     *
     * @param sortOrder : 'ASC' to sort the list ascendant and 'DESC' for descendant
     */
    DataTableComponentPage.prototype.sortByColumn = function (sortOrder, titleColumn) {
        return __awaiter(this, void 0, void 0, function () {
            var locator, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        locator = protractor_1.by.css("div[data-automation-id=\"auto_id_" + titleColumn + "\"]");
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element(locator))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.element(locator).getAttribute('class')];
                    case 2:
                        result = _a.sent();
                        if (!(sortOrder.toLocaleLowerCase() === 'asc')) return [3 /*break*/, 5];
                        if (!!result.includes('sorted-asc')) return [3 /*break*/, 4];
                        if (!(result.includes('sorted-desc') || result.includes('sortable'))) return [3 /*break*/, 4];
                        return [4 /*yield*/, protractor_1.element(locator).click()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 10];
                    case 5:
                        if (!result.includes('sorted-asc')) return [3 /*break*/, 7];
                        return [4 /*yield*/, protractor_1.element(locator).click()];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 7:
                        if (!result.includes('sortable')) return [3 /*break*/, 10];
                        return [4 /*yield*/, protractor_1.element(locator).click()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.element(locator).click()];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.checkContentIsDisplayed = function (columnName, columnValue) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = this.getCellElementByValue(columnName, columnValue);
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(row)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.checkContentIsNotDisplayed = function (columnName, columnValue) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = this.getCellElementByValue(columnName, columnValue);
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(row)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.getRow = function (columnName, columnValue) {
        return this.rootElement.all(protractor_1.by.css("div[title=\"" + columnName + "\"] div[data-automation-id=\"text_" + columnValue + "\"]")).first()
            .element(protractor_1.by.xpath("ancestor::div[contains(@class, 'adf-datatable-row')]"));
    };
    DataTableComponentPage.prototype.getRowByIndex = function (index) {
        return this.rootElement.element(protractor_1.by.xpath("//div[contains(@class,'adf-datatable-body')]//div[contains(@class,'adf-datatable-row')][" + index + "]"));
    };
    DataTableComponentPage.prototype.contentInPosition = function (position) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.contents.first())];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.getText(this.contents.get(position - 1))];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DataTableComponentPage.prototype.getCellElementByValue = function (columnName, columnValue) {
        return this.rootElement.all(protractor_1.by.css("div[title=\"" + columnName + "\"] div[data-automation-id=\"text_" + columnValue + "\"] span")).first();
    };
    DataTableComponentPage.prototype.tableIsLoaded = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.rootElement)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.waitTillContentLoaded = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.contents.first())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.checkColumnIsDisplayed = function (column) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element(protractor_1.by.css("div[data-automation-id=\"auto_id_entry." + column + "\"]")))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.getNumberOfColumns = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.allColumns.count()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DataTableComponentPage.prototype.getNumberOfRows = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.list.count()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DataTableComponentPage.prototype.getCellByRowNumberAndColumnName = function (rowNumber, columnName) {
        return this.list.get(rowNumber).all(protractor_1.by.css("div[title=\"" + columnName + "\"] span")).first();
    };
    DataTableComponentPage.prototype.getCellByRowContentAndColumn = function (rowColumn, rowContent, columnName) {
        return this.getRow(rowColumn, rowContent).element(protractor_1.by.css("div[title='" + columnName + "']"));
    };
    DataTableComponentPage.prototype.selectRowByContent = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = this.getCellByContent(content);
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(row)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.checkRowByContentIsSelected = function (folderName) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedRow = this.getCellByContent(folderName).element(protractor_1.by.xpath("ancestor::div[contains(@class, 'is-selected')]"));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(selectedRow)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.checkRowByContentIsNotSelected = function (folderName) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedRow = this.getCellByContent(folderName).element(protractor_1.by.xpath("ancestor::div[contains(@class, 'is-selected')]"));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(selectedRow)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.getCellByContent = function (content) {
        return this.rootElement.all(protractor_1.by.cssContainingText("div[class*='adf-datatable-row'] div[class*='adf-datatable-cell']", content)).first();
    };
    DataTableComponentPage.prototype.checkCellByHighlightContent = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cell = this.rootElement.element(protractor_1.by.cssContainingText("div[class*='adf-datatable-row'] div[class*='adf-name-location-cell-name'] span.adf-highlight", content));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(cell)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.clickRowByContent = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var resultElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resultElement = this.rootElement.all(protractor_1.by.css("div[data-automation-id='" + name + "']")).first();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(resultElement)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.clickRowByContentCheckbox = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var resultElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resultElement = this.rootElement.all(protractor_1.by.css("div[data-automation-id='" + name + "']")).first().element(protractor_1.by.xpath("ancestor::div/div/mat-checkbox"));
                        return [4 /*yield*/, protractor_1.browser.actions().mouseMove(resultElement)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(resultElement)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.checkRowContentIsDisplayed = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var resultElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resultElement = this.rootElement.all(protractor_1.by.css("div[data-automation-id='" + content + "']")).first();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(resultElement)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.checkRowContentIsNotDisplayed = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var resultElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resultElement = this.rootElement.all(protractor_1.by.css("div[data-automation-id='" + content + "']")).first();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(resultElement)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.checkRowContentIsDisabled = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var resultElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resultElement = this.rootElement.all(protractor_1.by.css("div[data-automation-id='" + content + "'] div.adf-cell-value img[aria-label='disable']")).first();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(resultElement)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.doubleClickRowByContent = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var resultElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resultElement = this.rootElement.all(protractor_1.by.css("div[data-automation-id='" + name + "']")).first();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(resultElement)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.actions().sendKeys(protractor_1.protractor.Key.ENTER).perform()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.getCopyContentTooltip = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.getText(this.copyColumnTooltip)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DataTableComponentPage.prototype.copyContentTooltipIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsStale(this.copyColumnTooltip)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.mouseOverColumn = function (columnName, columnValue) {
        return __awaiter(this, void 0, void 0, function () {
            var column;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        column = this.getCellElementByValue(columnName, columnValue);
                        return [4 /*yield*/, this.mouseOverElement(column)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.mouseOverElement = function (elem) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(elem)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.actions().mouseMove(elem).perform()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTableComponentPage.prototype.clickColumn = function (columnName, columnValue) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.clickExecuteScript("div[title=\"" + columnName + "\"] div[data-automation-id=\"text_" + columnValue + "\"] span")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DataTableComponentPage;
}());
exports.DataTableComponentPage = DataTableComponentPage;
//# sourceMappingURL=data-table-component.page.js.map