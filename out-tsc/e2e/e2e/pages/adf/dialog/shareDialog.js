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
var moment = require("moment");
var ShareDialog = /** @class */ (function () {
    function ShareDialog() {
        this.formControllersPage = new adf_testing_1.FormControllersPage();
        this.shareDialog = protractor_1.element(protractor_1.by.css('adf-share-dialog'));
        this.dialogTitle = protractor_1.element(protractor_1.by.css('[data-automation-id="adf-share-dialog-title"]'));
        this.shareToggle = protractor_1.element(protractor_1.by.css('[data-automation-id="adf-share-toggle"] label'));
        this.shareToggleChecked = protractor_1.element(protractor_1.by.css('mat-dialog-container mat-slide-toggle.mat-checked'));
        this.shareLink = protractor_1.element(protractor_1.by.css('[data-automation-id="adf-share-link"]'));
        this.closeButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-share-dialog-close"]'));
        this.snackBar = protractor_1.element(protractor_1.by.css('simple-snack-bar'));
        this.copySharedLinkButton = protractor_1.element(protractor_1.by.css('.adf-input-action'));
        this.timeDatePickerButton = protractor_1.element(protractor_1.by.css('mat-datetimepicker-toggle button'));
        this.dayPicker = protractor_1.element(protractor_1.by.css('mat-datetimepicker-month-view'));
        this.clockPicker = protractor_1.element(protractor_1.by.css('mat-datetimepicker-clock'));
        this.hoursPicker = protractor_1.element(protractor_1.by.css('.mat-datetimepicker-clock-hours'));
        this.minutePicker = protractor_1.element(protractor_1.by.css('.mat-datetimepicker-clock-minutes'));
        this.expirationDateInput = protractor_1.element(protractor_1.by.css('input[formcontrolname="time"]'));
        this.confirmationDialog = protractor_1.element(protractor_1.by.css('adf-confirm-dialog'));
        this.confirmationCancelButton = protractor_1.element(protractor_1.by.id('adf-confirm-cancel'));
        this.confirmationRemoveButton = protractor_1.element(protractor_1.by.id('adf-confirm-accept'));
    }
    ShareDialog.prototype.checkDialogIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.dialogTitle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.clickUnShareFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.shareToggle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.clickConfirmationDialogCancelButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.confirmationCancelButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.clickConfirmationDialogRemoveButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.confirmationRemoveButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.checkShareLinkIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.shareLink)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.getShareLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.shareLink)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.shareLink.getAttribute('value')];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShareDialog.prototype.clickCloseButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.closeButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.clickShareLinkButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.copySharedLinkButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.shareToggleButtonIsChecked = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsPresent(this.shareToggleChecked)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.dialogIsClosed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsStale(this.shareDialog)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.clickDateTimePickerButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.timeDatePickerButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.calendarTodayDayIsDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tomorrow, today;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tomorrow = moment().add(1, 'days').format('D');
                        if (!(tomorrow !== '1')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.dayPicker.element(protractor_1.by.css('.mat-datetimepicker-calendar-body-today')).getText()];
                    case 1:
                        today = _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsPresent(protractor_1.element(protractor_1.by.cssContainingText('.mat-datetimepicker-calendar-body-disabled', today)))];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.setDefaultDay = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tomorrow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.dayPicker)];
                    case 1:
                        _a.sent();
                        tomorrow = moment().add(1, 'days').format('LL');
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsClickable(this.dayPicker.element(protractor_1.by.css("td[aria-label=\"" + tomorrow + "\"]")))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.dayPicker.element(protractor_1.by.css("td[aria-label=\"" + tomorrow + "\"]")).click()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.setDefaultHour = function () {
        return __awaiter(this, void 0, void 0, function () {
            var selector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selector = '.mat-datetimepicker-clock-cell:not(.mat-datetimepicker-clock-cell-disabled)';
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.clockPicker)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.hoursPicker)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.hoursPicker.all(protractor_1.by.css(selector)).first().click()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.setDefaultMinutes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var selector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selector = '.mat-datetimepicker-clock-cell:not(.mat-datetimepicker-clock-cell-disabled)';
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.minutePicker)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.minutePicker.all(protractor_1.by.css(selector)).first().click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.dateTimePickerDialogIsClosed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsStale(protractor_1.element(protractor_1.by.css('mat-datetimepicker-content')))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.getExpirationDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.expirationDateInput.getAttribute('value')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShareDialog.prototype.expirationDateInputHasValue = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementHasValue(this.expirationDateInput, value)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDialog.prototype.confirmationDialogIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.confirmationDialog)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ShareDialog;
}());
exports.ShareDialog = ShareDialog;
//# sourceMappingURL=shareDialog.js.map