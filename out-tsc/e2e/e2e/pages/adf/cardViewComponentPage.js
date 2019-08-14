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
var CardViewComponentPage = /** @class */ (function () {
    function CardViewComponentPage() {
        this.addButton = protractor_1.element(protractor_1.by.className('adf-card-view__key-value-pairs__add-btn'));
        this.selectValue = 'mat-option';
        this.textField = protractor_1.element(protractor_1.by.css("input[data-automation-id='card-textitem-editinput-name']"));
        this.intField = protractor_1.element(protractor_1.by.css("input[data-automation-id='card-textitem-editinput-int']"));
        this.floatField = protractor_1.element(protractor_1.by.css("input[data-automation-id='card-textitem-editinput-float']"));
        this.valueInputField = protractor_1.element(protractor_1.by.xpath("//*[contains(@id,'input') and @placeholder='Value']"));
        this.nameInputField = protractor_1.element(protractor_1.by.xpath("//*[contains(@id,'input') and @placeholder='Name']"));
        this.consoleLog = protractor_1.element(protractor_1.by.className('adf-console'));
        this.deleteButton = protractor_1.element.all(protractor_1.by.className('adf-card-view__key-value-pairs__remove-btn')).first();
        this.select = protractor_1.element(protractor_1.by.css('mat-select[data-automation-class="select-box"]'));
        this.checkbox = protractor_1.element(protractor_1.by.css("mat-checkbox[data-automation-id='card-boolean-boolean']"));
        this.resetButton = protractor_1.element(protractor_1.by.css("#adf-reset-card-log"));
        this.listContent = protractor_1.element(protractor_1.by.css('.mat-select-panel'));
        this.editableSwitch = protractor_1.element(protractor_1.by.id('adf-toggle-editable'));
    }
    CardViewComponentPage.prototype.clickOnAddButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.addButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.clickOnResetButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.resetButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.clickOnTextField = function () {
        return __awaiter(this, void 0, void 0, function () {
            var toggleText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        toggleText = protractor_1.element(protractor_1.by.css("div[data-automation-id='card-textitem-edit-toggle-name']"));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(toggleText)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.textField)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.clickOnTextClearIcon = function () {
        return __awaiter(this, void 0, void 0, function () {
            var clearIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clearIcon = protractor_1.element(protractor_1.by.css("mat-icon[data-automation-id=\"card-textitem-reset-name\"]"));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(clearIcon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.clickOnTextSaveIcon = function () {
        return __awaiter(this, void 0, void 0, function () {
            var saveIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        saveIcon = protractor_1.element(protractor_1.by.css("mat-icon[data-automation-id=\"card-textitem-update-name\"]"));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(saveIcon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.getTextFieldText = function () {
        var textField = protractor_1.element(protractor_1.by.css("span[data-automation-id=\"card-textitem-value-name\"]"));
        return adf_testing_1.BrowserActions.getText(textField);
    };
    CardViewComponentPage.prototype.enterTextField = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.textField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.textField, text)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.clickOnIntField = function () {
        return __awaiter(this, void 0, void 0, function () {
            var toggleText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        toggleText = protractor_1.element(protractor_1.by.css('div[data-automation-id="card-textitem-edit-toggle-int"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(toggleText)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.intField)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.clickOnIntClearIcon = function () {
        return __awaiter(this, void 0, void 0, function () {
            var clearIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clearIcon = protractor_1.element(protractor_1.by.css('mat-icon[data-automation-id="card-textitem-reset-int"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(clearIcon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.clickOnIntSaveIcon = function () {
        return __awaiter(this, void 0, void 0, function () {
            var saveIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        saveIcon = protractor_1.element(protractor_1.by.css('mat-icon[data-automation-id="card-textitem-update-int"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(saveIcon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.enterIntField = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.intField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.intField, text)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.getIntFieldText = function () {
        var textField = protractor_1.element(protractor_1.by.css('span[data-automation-id="card-textitem-value-int"]'));
        return adf_testing_1.BrowserActions.getText(textField);
    };
    CardViewComponentPage.prototype.getErrorInt = function () {
        var errorElement = protractor_1.element(protractor_1.by.css('mat-error[data-automation-id="card-textitem-error-int"]'));
        return adf_testing_1.BrowserActions.getText(errorElement);
    };
    CardViewComponentPage.prototype.clickOnFloatField = function () {
        return __awaiter(this, void 0, void 0, function () {
            var toggleText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        toggleText = protractor_1.element(protractor_1.by.css('div[data-automation-id="card-textitem-edit-toggle-float"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(toggleText)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.floatField)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.clickOnFloatClearIcon = function () {
        return __awaiter(this, void 0, void 0, function () {
            var clearIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clearIcon = protractor_1.element(protractor_1.by.css("mat-icon[data-automation-id=\"card-textitem-reset-float\"]"));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(clearIcon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.clickOnFloatSaveIcon = function () {
        return __awaiter(this, void 0, void 0, function () {
            var saveIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        saveIcon = protractor_1.element(protractor_1.by.css("mat-icon[data-automation-id=\"card-textitem-update-float\"]"));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(saveIcon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.enterFloatField = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.floatField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.floatField, text)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.getFloatFieldText = function () {
        var textField = protractor_1.element(protractor_1.by.css('span[data-automation-id="card-textitem-value-float"]'));
        return adf_testing_1.BrowserActions.getText(textField);
    };
    CardViewComponentPage.prototype.getErrorFloat = function () {
        var errorElement = protractor_1.element(protractor_1.by.css('mat-error[data-automation-id="card-textitem-error-float"]'));
        return adf_testing_1.BrowserActions.getText(errorElement);
    };
    CardViewComponentPage.prototype.setName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.nameInputField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.nameInputField.sendKeys(name)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.setValue = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.valueInputField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.valueInputField.sendKeys(value)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.waitForOutput = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.consoleLog)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.getOutputText = function (index) {
        return adf_testing_1.BrowserActions.getText(this.consoleLog.all(protractor_1.by.css('p')).get(index));
    };
    CardViewComponentPage.prototype.deletePairsValues = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.deleteButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.clickSelectBox = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.select)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.listContent)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.checkboxClick = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.checkbox)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.selectValueFromComboBox = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        value = protractor_1.element.all(protractor_1.by.className(this.selectValue)).get(index);
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(value)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CardViewComponentPage.prototype.disableEdit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var check, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.editableSwitch)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.editableSwitch.getAttribute('class')];
                    case 2:
                        check = _b.sent();
                        if (!(check.indexOf('mat-checked') > -1)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.editableSwitch.click()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, this.editableSwitch.getAttribute('class')];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).not.toContain('mat-checked')];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return CardViewComponentPage;
}());
exports.CardViewComponentPage = CardViewComponentPage;
//# sourceMappingURL=cardViewComponentPage.js.map