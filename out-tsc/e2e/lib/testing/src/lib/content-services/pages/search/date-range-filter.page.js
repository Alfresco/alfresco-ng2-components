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
var date_picker_page_1 = require("../../../material/pages/date-picker.page");
var browser_visibility_1 = require("../../../core/utils/browser-visibility");
var browser_actions_1 = require("../../../core/utils/browser-actions");
var DateRangeFilterPage = /** @class */ (function () {
    function DateRangeFilterPage(filter) {
        this.fromField = protractor_1.by.css('input[data-automation-id="date-range-from-input"]');
        this.fromDateToggle = protractor_1.by.css('mat-datepicker-toggle[data-automation-id="date-range-from-date-toggle"]');
        this.toField = protractor_1.by.css('input[data-automation-id="date-range-to-input"]');
        this.toDateToggle = protractor_1.by.css('mat-datepicker-toggle[data-automation-id="date-range-to-date-toggle"]');
        this.applyButton = protractor_1.by.css('button[data-automation-id="date-range-apply-btn"]');
        this.clearButton = protractor_1.by.css('button[data-automation-id="date-range-clear-btn"]');
        this.fromErrorMessage = protractor_1.by.css('mat-error[data-automation-id="date-range-from-error"]');
        this.toErrorMessage = protractor_1.by.css('mat-error[data-automation-id="date-range-to-error"]');
        this.filter = filter;
    }
    DateRangeFilterPage.prototype.getFromDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.filter.element(this.fromField).getAttribute('value')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.putFromDate = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkFromFieldIsDisplayed()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.filter.element(this.fromField), date)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.filter.element(this.fromField).sendKeys(protractor_1.protractor.Key.ENTER)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.getFromCalendarSelectedDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var datePicker, selectedDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openFromDatePicker()];
                    case 1:
                        datePicker = _a.sent();
                        return [4 /*yield*/, datePicker.getSelectedDate()];
                    case 2:
                        selectedDate = _a.sent();
                        return [4 /*yield*/, datePicker.closeDatePicker()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, selectedDate];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.openFromDatePicker = function () {
        return __awaiter(this, void 0, void 0, function () {
            var datePicker;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsClickable(this.filter.element(this.fromDateToggle))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.filter.element(this.fromDateToggle).click()];
                    case 2:
                        _a.sent();
                        datePicker = new date_picker_page_1.DatePickerPage();
                        return [4 /*yield*/, datePicker.checkDatePickerIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, datePicker];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.openToDatePicker = function () {
        return __awaiter(this, void 0, void 0, function () {
            var datePicker;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsClickable(this.filter.element(this.toDateToggle))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.filter.element(this.toDateToggle).click()];
                    case 2:
                        _a.sent();
                        datePicker = new date_picker_page_1.DatePickerPage();
                        return [4 /*yield*/, datePicker.checkDatePickerIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, datePicker];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.clickFromField = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsClickable(this.filter.element(this.fromField))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.filter.element(this.fromField).click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.checkFromErrorMessageIsDisplayed = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.fromErrorMessage))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.getText(this.filter.element(this.fromErrorMessage))];
                    case 2:
                        text = _a.sent();
                        return [4 /*yield*/, expect(text).toEqual(msg)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.checkFromErrorMessageIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.fromErrorMessage))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.checkFromFieldIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.fromField))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.checkFromDateToggleIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.fromDateToggle))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.getToDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.filter.element(this.toField).getAttribute('value')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.putToDate = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkToFieldIsDisplayed()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(protractor_1.element(this.toField), date)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.filter.element(this.toField).sendKeys(protractor_1.protractor.Key.ENTER)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.clickToField = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsClickable(this.filter.element(this.toField))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.filter.element(this.toField))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.checkToErrorMessageIsDisplayed = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.toErrorMessage))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.getText(this.filter.element(this.toErrorMessage))];
                    case 2:
                        text = _a.sent();
                        return [4 /*yield*/, expect(text).toEqual(msg)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.checkToFieldIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.toField))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.checkToDateToggleIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.toDateToggle))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.clickApplyButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsClickable(this.filter.element(this.applyButton))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.filter.element(this.applyButton).click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.checkApplyButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.applyButton))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.checkApplyButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isEnabled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.filter.element(this.applyButton).isEnabled()];
                    case 1:
                        isEnabled = _a.sent();
                        return [4 /*yield*/, expect(isEnabled).toBe(true)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.checkApplyButtonIsDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isEnabled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.filter.element(this.applyButton).isEnabled()];
                    case 1:
                        isEnabled = _a.sent();
                        return [4 /*yield*/, expect(isEnabled).toBe(false)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DateRangeFilterPage.prototype.checkClearButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.clearButton))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DateRangeFilterPage;
}());
exports.DateRangeFilterPage = DateRangeFilterPage;
//# sourceMappingURL=date-range-filter.page.js.map