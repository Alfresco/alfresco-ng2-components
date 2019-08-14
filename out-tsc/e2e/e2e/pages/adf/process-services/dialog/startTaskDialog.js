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
var StartTaskDialog = /** @class */ (function () {
    function StartTaskDialog() {
        this.name = protractor_1.element(protractor_1.by.css('input[id="name_id"]'));
        this.dueDate = protractor_1.element(protractor_1.by.css('input[id="date_id"]'));
        this.description = protractor_1.element(protractor_1.by.css('textarea[id="description_id"]'));
        this.assignee = protractor_1.element(protractor_1.by.css('div#people-widget-content input'));
        this.startButton = protractor_1.element(protractor_1.by.css('button[id="button-start"]'));
        this.startButtonEnabled = protractor_1.element(protractor_1.by.css('button[id="button-start"]:not(disabled)'));
        this.cancelButton = protractor_1.element(protractor_1.by.css('button[id="button-cancel"]'));
        this.formDropDown = protractor_1.element(protractor_1.by.css('mat-select[id="form_id"]'));
    }
    StartTaskDialog.prototype.addName = function (userName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.name.clear()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.name.sendKeys(userName)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTaskDialog.prototype.addDescription = function (userDescription) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.description)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.description.sendKeys(userDescription)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTaskDialog.prototype.addDueDate = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.dueDate)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.dueDate.sendKeys(date)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTaskDialog.prototype.addAssignee = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.assignee)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.assignee.sendKeys(name)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.selectAssigneeFromList(name)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTaskDialog.prototype.selectAssigneeFromList = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var assigneeRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assigneeRow = protractor_1.element(protractor_1.by.cssContainingText('mat-option span.adf-people-label-name', name));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(assigneeRow)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(assigneeRow)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTaskDialog.prototype.getAssignee = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.assignee)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.assignee.getAttribute('placeholder')];
                }
            });
        });
    };
    StartTaskDialog.prototype.addForm = function (form) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.formDropDown)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.selectForm(form)];
                }
            });
        });
    };
    StartTaskDialog.prototype.selectForm = function (form) {
        return __awaiter(this, void 0, void 0, function () {
            var option;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        option = protractor_1.element(protractor_1.by.cssContainingText('span[class*="mat-option-text"]', form));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(option)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTaskDialog.prototype.clickStartButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, adf_testing_1.BrowserActions.click(this.startButton)];
            });
        });
    };
    StartTaskDialog.prototype.checkStartButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.startButtonEnabled)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTaskDialog.prototype.checkStartButtonIsDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element(protractor_1.by.css('button[id="button-start"]:disabled')))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTaskDialog.prototype.clickCancelButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.cancelButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTaskDialog.prototype.blur = function (locator) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(locator)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, locator.sendKeys(protractor_1.Key.TAB)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTaskDialog.prototype.checkValidationErrorIsDisplayed = function (error, elementRef) {
        if (elementRef === void 0) { elementRef = 'mat-error'; }
        return __awaiter(this, void 0, void 0, function () {
            var errorElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errorElement = protractor_1.element(protractor_1.by.cssContainingText(elementRef, error));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(errorElement)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return StartTaskDialog;
}());
exports.StartTaskDialog = StartTaskDialog;
//# sourceMappingURL=startTaskDialog.js.map