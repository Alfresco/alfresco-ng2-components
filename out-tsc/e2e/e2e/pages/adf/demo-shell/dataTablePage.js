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
var adf_testing_2 = require("@alfresco/adf-testing");
var DataTablePage = /** @class */ (function () {
    function DataTablePage(data) {
        this.columns = {
            id: 'Id',
            name: 'Name',
            createdBy: 'Created By',
            json: 'Json'
        };
        this.data = {
            copyClipboardDataTable: 'copyClipboard-datatable',
            defaultTable: 'datatable'
        };
        this.multiSelect = protractor_1.element(protractor_1.by.css("div[data-automation-id='multiselect'] label > div[class='mat-checkbox-inner-container']"));
        this.reset = protractor_1.element(protractor_1.by.xpath("//span[contains(text(),'Reset to default')]/.."));
        this.allSelectedRows = protractor_1.element.all(protractor_1.by.css("div[class*='is-selected']"));
        this.selectedRowNumber = protractor_1.element(protractor_1.by.css("div[class*='is-selected'] div[data-automation-id*='text_']"));
        this.selectAll = protractor_1.element(protractor_1.by.css("div[class*='header'] label"));
        this.addRowElement = protractor_1.element(protractor_1.by.xpath("//span[contains(text(),'Add row')]/.."));
        this.replaceRowsElement = protractor_1.element(protractor_1.by.xpath("//span[contains(text(),'Replace rows')]/.."));
        this.replaceColumnsElement = protractor_1.element(protractor_1.by.xpath("//span[contains(text(),'Replace columns')]/.."));
        this.createdOnColumn = protractor_1.element(protractor_1.by.css("div[data-automation-id='auto_id_createdOn']"));
        this.idColumnHeader = protractor_1.element(protractor_1.by.css("div[data-automation-id='auto_id_id']"));
        this.pasteClipboardInput = protractor_1.element(protractor_1.by.css("input[data-automation-id='paste clipboard input']"));
        if (this.data[data]) {
            this.dataTable = new adf_testing_1.DataTableComponentPage(protractor_1.element(protractor_1.by.css("div[data-automation-id='" + this.data[data] + "']")));
        }
        else {
            this.dataTable = new adf_testing_1.DataTableComponentPage(protractor_1.element(protractor_1.by.css("div[data-automation-id='" + this.data.defaultTable + "']")));
        }
    }
    DataTablePage.prototype.insertFilter = function (filterText) {
        return __awaiter(this, void 0, void 0, function () {
            var inputFilter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputFilter = protractor_1.element(protractor_1.by.css("#adf-datatable-filter-input"));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.clearSendKeys(inputFilter, filterText)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.addRow = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.addRowElement)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.replaceRows = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var rowID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rowID = this.dataTable.getCellElementByValue(this.columns.id, id);
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(rowID)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.replaceRowsElement)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(rowID)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.replaceColumns = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.replaceColumnsElement)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(this.createdOnColumn)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.clickMultiSelect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.multiSelect)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.clickReset = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.reset)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.checkRowIsNotSelected = function (rowNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var isRowSelected;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isRowSelected = this.dataTable.getCellElementByValue(this.columns.id, rowNumber)
                            .element(protractor_1.by.xpath("ancestor::div[contains(@class, 'adf-datatable-row custom-row-style ng-star-inserted is-selected')]"));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(isRowSelected)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.checkNoRowIsSelected = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(this.selectedRowNumber)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.checkAllRows = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.selectAll)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.checkRowIsChecked = function (rowNumber) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.getRowCheckbox(rowNumber))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.checkRowIsNotChecked = function (rowNumber) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(this.getRowCheckbox(rowNumber))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.getNumberOfSelectedRows = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.allSelectedRows.count()];
            });
        });
    };
    DataTablePage.prototype.clickCheckbox = function (rowNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var checkbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        checkbox = this.dataTable.getCellElementByValue(this.columns.id, rowNumber)
                            .element(protractor_1.by.xpath("ancestor::div[contains(@class, 'adf-datatable-row')]//mat-checkbox/label"));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(checkbox)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.selectRow = function (rowNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = this.dataTable.getCellElementByValue(this.columns.id, rowNumber);
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(row)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.selectRowWithKeyboard = function (rowNumber) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.actions().sendKeys(protractor_1.protractor.Key.COMMAND).perform()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.selectRow(rowNumber)];
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
    DataTablePage.prototype.selectSelectionMode = function (selectionMode) {
        return __awaiter(this, void 0, void 0, function () {
            var selectMode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectMode = protractor_1.element(protractor_1.by.cssContainingText("span[class='mat-option-text']", selectionMode));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.clickExecuteScript('div[class="mat-select-arrow"]')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(selectMode)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.getRowCheckbox = function (rowNumber) {
        return this.dataTable.getCellElementByValue(this.columns.id, rowNumber).element(protractor_1.by.xpath("ancestor::div/div/mat-checkbox[contains(@class, 'mat-checkbox-checked')]"));
    };
    DataTablePage.prototype.getCopyContentTooltip = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.getCopyContentTooltip()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DataTablePage.prototype.mouseOverNameColumn = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.mouseOverColumn(this.columns.name, name)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.mouseOverCreatedByColumn = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.mouseOverColumn(this.columns.createdBy, name)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.mouseOverIdColumn = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.mouseOverColumn(this.columns.id, name)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.mouseOverJsonColumn = function (rowNumber) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.mouseOverElement(this.dataTable.getCellByRowNumberAndColumnName(rowNumber - 1, this.columns.json))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.getDropTargetIdColumnCell = function (rowNumber) {
        return this.dataTable.getCellByRowNumberAndColumnName(rowNumber - 1, this.columns.id);
    };
    DataTablePage.prototype.getDropTargetIdColumnHeader = function () {
        return this.idColumnHeader;
    };
    DataTablePage.prototype.clickOnIdColumn = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.clickColumn(this.columns.id, name)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.clickOnJsonColumn = function (rowNumber) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.dataTable.getCellByRowNumberAndColumnName(rowNumber - 1, this.columns.json))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.clickOnNameColumn = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.clickColumn(this.columns.name, name)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.clickOnCreatedByColumn = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.clickColumn(this.columns.createdBy, name)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.pasteClipboard = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pasteClipboardInput.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.pasteClipboardInput)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.pasteClipboardInput.sendKeys(protractor_1.protractor.Key.chord(protractor_1.protractor.Key.SHIFT, protractor_1.protractor.Key.INSERT))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataTablePage.prototype.getClipboardInputText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.pasteClipboardInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.pasteClipboardInput.getAttribute('value')];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return DataTablePage;
}());
exports.DataTablePage = DataTablePage;
//# sourceMappingURL=dataTablePage.js.map