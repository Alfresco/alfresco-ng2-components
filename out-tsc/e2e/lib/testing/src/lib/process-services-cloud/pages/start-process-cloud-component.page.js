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
var browser_visibility_1 = require("../../core/utils/browser-visibility");
var browser_actions_1 = require("../../core/utils/browser-actions");
var formFields_1 = require("../../core/pages/form/formFields");
var StartProcessCloudPage = /** @class */ (function () {
    function StartProcessCloudPage() {
        this.defaultProcessName = protractor_1.element(protractor_1.by.css('input[id="processName"]'));
        this.processNameInput = protractor_1.element(protractor_1.by.id('processName'));
        this.selectProcessDropdownArrow = protractor_1.element(protractor_1.by.css('button[id="adf-select-process-dropdown"]'));
        this.cancelProcessButton = protractor_1.element(protractor_1.by.id('cancel_process'));
        this.formStartProcessButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-form-start process"]'));
        this.startProcessButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="btn-start"]'));
        this.noProcess = protractor_1.element(protractor_1.by.id('no-process-message'));
        this.processDefinition = protractor_1.element(protractor_1.by.css('input[id="processDefinitionName"]'));
        this.processDefinitionOptionsPanel = protractor_1.element(protractor_1.by.css('div[class*="processDefinitionOptions"]'));
    }
    StartProcessCloudPage.prototype.checkNoProcessMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.noProcess)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartProcessCloudPage.prototype.pressDownArrowAndEnter = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.processDefinition.sendKeys(protractor_1.protractor.Key.ARROW_DOWN)];
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
    StartProcessCloudPage.prototype.checkNoProcessDefinitionOptionIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.processDefinitionOptionsPanel)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartProcessCloudPage.prototype.enterProcessName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.processNameInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.processNameInput, name)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartProcessCloudPage.prototype.selectFromProcessDropdown = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickProcessDropdownArrow()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.selectOption(name)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartProcessCloudPage.prototype.clickProcessDropdownArrow = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.selectProcessDropdownArrow)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartProcessCloudPage.prototype.checkOptionIsDisplayed = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var selectProcessDropdown;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectProcessDropdown = protractor_1.element(protractor_1.by.cssContainingText('.mat-option-text', name));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(selectProcessDropdown)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsClickable(selectProcessDropdown)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartProcessCloudPage.prototype.selectOption = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var selectProcessDropdown;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectProcessDropdown = protractor_1.element(protractor_1.by.cssContainingText('.mat-option-text', name));
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(selectProcessDropdown)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartProcessCloudPage.prototype.clickCancelProcessButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.cancelProcessButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartProcessCloudPage.prototype.checkStartProcessButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.startProcessButton.isEnabled()];
            });
        });
    };
    StartProcessCloudPage.prototype.clickStartProcessButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.startProcessButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartProcessCloudPage.prototype.checkValidationErrorIsDisplayed = function (error, elementRef) {
        if (elementRef === void 0) { elementRef = 'mat-error'; }
        return __awaiter(this, void 0, void 0, function () {
            var errorElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errorElement = protractor_1.element(protractor_1.by.cssContainingText(elementRef, error));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(errorElement)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartProcessCloudPage.prototype.blur = function (locator) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(locator)];
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
    StartProcessCloudPage.prototype.clearField = function (locator) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(locator)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearWithBackSpace(locator)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartProcessCloudPage.prototype.formFields = function () {
        return new formFields_1.FormFields();
    };
    return StartProcessCloudPage;
}());
exports.StartProcessCloudPage = StartProcessCloudPage;
//# sourceMappingURL=start-process-cloud-component.page.js.map