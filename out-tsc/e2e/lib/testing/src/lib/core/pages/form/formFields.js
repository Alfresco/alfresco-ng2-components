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
var public_api_1 = require("../../utils/public-api");
var FormFields = /** @class */ (function () {
    function FormFields() {
        this.formContent = protractor_1.element(protractor_1.by.css('adf-form-renderer'));
        this.refreshButton = protractor_1.element(protractor_1.by.css('div[class*="form-reload-button"] mat-icon'));
        this.saveButton = protractor_1.element(protractor_1.by.cssContainingText('mat-card-actions[class*="adf-for"] span', 'SAVE'));
        this.valueLocator = protractor_1.by.css('input');
        this.labelLocator = protractor_1.by.css('label');
        this.noFormMessage = protractor_1.element(protractor_1.by.css('span[id*="no-form-message"]'));
        this.completedTaskNoFormMessage = protractor_1.element(protractor_1.by.css('div[id*="completed-form-message"] p'));
        this.attachFormButton = protractor_1.element(protractor_1.by.id('adf-no-form-attach-form-button'));
        this.selectFormDropDownArrow = protractor_1.element.all(protractor_1.by.css('adf-attach-form div[class*="mat-select-arrow"]')).first();
        this.selectFormContent = protractor_1.element(protractor_1.by.css('div[class*="mat-select-panel"]'));
        this.completeButton = protractor_1.element(protractor_1.by.id('adf-form-complete'));
        this.errorMessage = protractor_1.by.css('.adf-error-text-container .adf-error-text');
    }
    FormFields.prototype.setFieldValue = function (locator, field, value) {
        return __awaiter(this, void 0, void 0, function () {
            var fieldElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fieldElement = protractor_1.element(locator(field));
                        return [4 /*yield*/, public_api_1.BrowserActions.clearSendKeys(fieldElement, value)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FormFields.prototype.checkWidgetIsVisible = function (fieldId) {
        return __awaiter(this, void 0, void 0, function () {
            var fieldElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fieldElement = protractor_1.element.all(protractor_1.by.css("adf-form-field div[id='field-" + fieldId + "-container']")).first();
                        return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsVisible(fieldElement)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FormFields.prototype.checkWidgetIsHidden = function (fieldId) {
        return __awaiter(this, void 0, void 0, function () {
            var hiddenElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hiddenElement = protractor_1.element(protractor_1.by.css("adf-form-field div[id='field-" + fieldId + "-container'][hidden]"));
                        return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsNotVisible(hiddenElement)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FormFields.prototype.checkWidgetIsNotHidden = function (fieldId) {
        return __awaiter(this, void 0, void 0, function () {
            var hiddenElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkWidgetIsVisible(fieldId)];
                    case 1:
                        _a.sent();
                        hiddenElement = protractor_1.element(protractor_1.by.css("adf-form-field div[id='field-" + fieldId + "-container'][hidden]"));
                        return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsNotVisible(hiddenElement, 6000)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FormFields.prototype.getWidget = function (fieldId) {
        return protractor_1.element(protractor_1.by.css("adf-form-field div[id='field-" + fieldId + "-container']"));
    };
    FormFields.prototype.getFieldValue = function (fieldId, valueLocatorParam) {
        return __awaiter(this, void 0, void 0, function () {
            var valueWidget;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWidget(fieldId)];
                    case 1: return [4 /*yield*/, (_a.sent()).element(valueLocatorParam || this.valueLocator)];
                    case 2:
                        valueWidget = _a.sent();
                        return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsVisible(valueWidget)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, valueWidget.getAttribute('value')];
                }
            });
        });
    };
    FormFields.prototype.getFieldLabel = function (fieldId, labelLocatorParam) {
        return __awaiter(this, void 0, void 0, function () {
            var label;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWidget(fieldId)];
                    case 1: return [4 /*yield*/, (_a.sent()).all(labelLocatorParam || this.labelLocator).first()];
                    case 2:
                        label = _a.sent();
                        return [2 /*return*/, public_api_1.BrowserActions.getText(label)];
                }
            });
        });
    };
    FormFields.prototype.getFieldErrorMessage = function (fieldId) {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWidget(fieldId)];
                    case 1:
                        error = _a.sent();
                        error.element(this.errorMessage);
                        return [2 /*return*/, public_api_1.BrowserActions.getText(error)];
                }
            });
        });
    };
    FormFields.prototype.getFieldText = function (fieldId, labelLocatorParam) {
        return __awaiter(this, void 0, void 0, function () {
            var label;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWidget(fieldId)];
                    case 1: return [4 /*yield*/, (_a.sent()).element(labelLocatorParam || this.labelLocator)];
                    case 2:
                        label = _a.sent();
                        return [2 /*return*/, public_api_1.BrowserActions.getText(label)];
                }
            });
        });
    };
    FormFields.prototype.getFieldPlaceHolder = function (fieldId, locator) {
        if (locator === void 0) { locator = 'input'; }
        return __awaiter(this, void 0, void 0, function () {
            var placeHolderLocator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        placeHolderLocator = protractor_1.element(protractor_1.by.css(locator + "#" + fieldId));
                        return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsVisible(placeHolderLocator)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, placeHolderLocator.getAttribute('placeholder')];
                }
            });
        });
    };
    FormFields.prototype.checkFieldValue = function (locator, field, val) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementHasValue(protractor_1.element(locator(field)), val)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FormFields.prototype.refreshForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserActions.click(this.refreshButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FormFields.prototype.saveForm = function () {
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
    FormFields.prototype.noFormIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsNotVisible(this.formContent)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FormFields.prototype.checkFormIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsVisible(this.formContent)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FormFields.prototype.getNoFormMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, public_api_1.BrowserActions.getText(this.noFormMessage)];
            });
        });
    };
    FormFields.prototype.getCompletedTaskNoFormMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, public_api_1.BrowserActions.getText(this.completedTaskNoFormMessage)];
            });
        });
    };
    FormFields.prototype.clickOnAttachFormButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserActions.click(this.attachFormButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FormFields.prototype.selectForm = function (formName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserActions.click(this.selectFormDropDownArrow)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsVisible(this.selectFormContent)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.selectFormFromDropDown(formName)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FormFields.prototype.selectFormFromDropDown = function (formName) {
        return __awaiter(this, void 0, void 0, function () {
            var formNameElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        formNameElement = protractor_1.element(protractor_1.by.cssContainingText('span', formName));
                        return [4 /*yield*/, public_api_1.BrowserActions.click(formNameElement)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FormFields.prototype.checkWidgetIsReadOnlyMode = function (fieldId) {
        return __awaiter(this, void 0, void 0, function () {
            var widget, widgetReadOnly;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        widget = protractor_1.element(protractor_1.by.css("adf-form-field div[id='field-" + fieldId + "-container']"));
                        widgetReadOnly = widget.element(protractor_1.by.css('div[class*="adf-readonly"]'));
                        return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsVisible(widgetReadOnly)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, widgetReadOnly];
                }
            });
        });
    };
    FormFields.prototype.completeForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserActions.click(this.completeButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FormFields.prototype.setValueInInputById = function (fieldId, value) {
        return __awaiter(this, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = protractor_1.element(protractor_1.by.id(fieldId));
                        return [4 /*yield*/, public_api_1.BrowserActions.clearSendKeys(input, value)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FormFields.prototype.isCompleteFormButtonDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsVisible(this.completeButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.completeButton.getAttribute('disabled')];
                }
            });
        });
    };
    return FormFields;
}());
exports.FormFields = FormFields;
//# sourceMappingURL=formFields.js.map