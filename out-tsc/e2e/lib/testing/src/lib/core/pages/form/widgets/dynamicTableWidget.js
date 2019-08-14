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
var formFields_1 = require("../formFields");
var protractor_1 = require("protractor");
var public_api_1 = require("../../../utils/public-api");
var DynamicTableWidget = /** @class */ (function () {
    function DynamicTableWidget() {
        this.formFields = new formFields_1.FormFields();
        this.labelLocator = protractor_1.by.css('dynamic-table-widget div div');
        this.columnNameLocator = protractor_1.by.css('table[id*="dynamic-table"] th');
        this.addButton = protractor_1.element(protractor_1.by.id('label-add-row'));
        this.cancelButton = protractor_1.element(protractor_1.by.cssContainingText('button span', 'Cancel'));
        this.editButton = protractor_1.element(protractor_1.by.cssContainingText('button span', 'edit'));
        this.addRow = protractor_1.element(protractor_1.by.id('dynamictable-add-row'));
        this.columnDateTime = protractor_1.element(protractor_1.by.id('columnDateTime'));
        this.columnDate = protractor_1.element(protractor_1.by.id('columnDate'));
        this.calendarHeader = protractor_1.element(protractor_1.by.css('div[class="mat-datetimepicker-calendar-header-date-time"]'));
        this.calendarContent = protractor_1.element(protractor_1.by.css('div[class="mat-datetimepicker-calendar-content"]'));
        this.saveButton = protractor_1.element(protractor_1.by.cssContainingText('button span', 'Save'));
        this.errorMessage = protractor_1.element(protractor_1.by.css('div[class="adf-error-text"]'));
        this.dateWidget = protractor_1.element.all(protractor_1.by.css('mat-datepicker-toggle button')).first();
        this.tableRow = protractor_1.element.all(protractor_1.by.css('tbody tr'));
        this.dataTableInput = protractor_1.element(protractor_1.by.id('id'));
    }
    DynamicTableWidget.prototype.getFieldLabel = function (fieldId) {
        return this.formFields.getFieldLabel(fieldId, this.labelLocator);
    };
    DynamicTableWidget.prototype.getColumnName = function (fieldId) {
        return this.formFields.getFieldText(fieldId, this.columnNameLocator);
    };
    DynamicTableWidget.prototype.clickAddButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserActions.click(this.addButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamicTableWidget.prototype.clickAddRow = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserActions.click(this.addRow)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamicTableWidget.prototype.clickTableRow = function (rowNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var tableRowByIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableRowByIndex = protractor_1.element(protractor_1.by.id('dynamictable-row-' + rowNumber));
                        return [4 /*yield*/, public_api_1.BrowserActions.click(tableRowByIndex)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamicTableWidget.prototype.clickEditButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserActions.click(this.editButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamicTableWidget.prototype.clickCancelButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserActions.click(this.cancelButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamicTableWidget.prototype.setDatatableInput = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsVisible(this.dataTableInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.dataTableInput.clear()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.dataTableInput.sendKeys(text)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamicTableWidget.prototype.getTableRowText = function (rowNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var tableRowByIndex;
            return __generator(this, function (_a) {
                tableRowByIndex = protractor_1.element(protractor_1.by.id('dynamictable-row-' + rowNumber));
                return [2 /*return*/, public_api_1.BrowserActions.getText(tableRowByIndex)];
            });
        });
    };
    DynamicTableWidget.prototype.checkTableRowIsNotVisible = function (rowNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var tableRowByIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableRowByIndex = protractor_1.element(protractor_1.by.id('dynamictable-row-' + rowNumber));
                        return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsNotVisible(tableRowByIndex)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamicTableWidget.prototype.clickColumnDateTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserActions.click(this.columnDateTime)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsVisible(this.calendarHeader)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsVisible(this.calendarContent)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, public_api_1.BrowserActions.closeMenuAndDialogs()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamicTableWidget.prototype.addRandomStringOnDateTime = function (randomText) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserActions.click(this.columnDateTime)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, public_api_1.BrowserActions.closeMenuAndDialogs()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.columnDateTime.sendKeys(randomText)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.columnDateTime.sendKeys(protractor_1.protractor.Key.ENTER)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, this.columnDateTime.getAttribute('value')];
                }
            });
        });
    };
    DynamicTableWidget.prototype.addRandomStringOnDate = function (randomText) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserActions.click(this.columnDate)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.columnDate.sendKeys(randomText)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamicTableWidget.prototype.clickSaveButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserActions.click(this.saveButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamicTableWidget.prototype.checkErrorMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, public_api_1.BrowserActions.getText(this.errorMessage)];
            });
        });
    };
    DynamicTableWidget.prototype.clickDateWidget = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserActions.click(this.dateWidget)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamicTableWidget.prototype.getTableRow = function (rowNumber) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsVisible(this.tableRow.get(rowNumber))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamicTableWidget.prototype.getTableCellText = function (rowNumber, columnNumber) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, public_api_1.BrowserActions.getText(this.tableRow.get(rowNumber).element(protractor_1.by.xpath("td[" + columnNumber + "]")))];
            });
        });
    };
    DynamicTableWidget.prototype.checkItemIsPresent = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var row, present;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = protractor_1.element(protractor_1.by.cssContainingText('table tbody tr td span', item));
                        return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsVisible(row)];
                    case 1:
                        present = _a.sent();
                        return [4 /*yield*/, expect(present).toBe(true)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DynamicTableWidget;
}());
exports.DynamicTableWidget = DynamicTableWidget;
//# sourceMappingURL=dynamicTableWidget.js.map