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
var BrowserActions = /** @class */ (function () {
    function BrowserActions() {
    }
    BrowserActions.click = function (elementFinder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(elementFinder)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsClickable(elementFinder)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, elementFinder.click()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserActions.getUrl = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, protractor_1.browser.get(url)];
            });
        });
    };
    BrowserActions.clickExecuteScript = function (elementCssSelector) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsPresent(protractor_1.element(protractor_1.by.css(elementCssSelector)))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.executeScript("document.querySelector('" + elementCssSelector + "').click();")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserActions.getText = function (elementFinder) {
        return __awaiter(this, void 0, void 0, function () {
            var present;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(elementFinder)];
                    case 1:
                        present = _a.sent();
                        if (present) {
                            return [2 /*return*/, elementFinder.getText()];
                        }
                        else {
                            return [2 /*return*/, ''];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserActions.getArrayText = function (elementFinders) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, elementFinders.getText()];
            });
        });
    };
    BrowserActions.getColor = function (elementFinder) {
        return __awaiter(this, void 0, void 0, function () {
            var webElem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(elementFinder)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, elementFinder.getWebElement()];
                    case 2:
                        webElem = _a.sent();
                        return [4 /*yield*/, webElem.getCssValue('color')];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BrowserActions.clearWithBackSpace = function (elementFinder) {
        return __awaiter(this, void 0, void 0, function () {
            var value, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(elementFinder)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, elementFinder.click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, elementFinder.getAttribute('value')];
                    case 3:
                        value = _a.sent();
                        i = value.length;
                        _a.label = 4;
                    case 4:
                        if (!(i >= 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, elementFinder.sendKeys(protractor_1.protractor.Key.BACK_SPACE)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        i--;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    BrowserActions.clearSendKeys = function (elementFinder, text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.click(elementFinder)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, elementFinder.sendKeys('')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, elementFinder.clear()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, elementFinder.sendKeys(text)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserActions.checkIsDisabled = function (elementFinder) {
        return __awaiter(this, void 0, void 0, function () {
            var valueCheck;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(elementFinder)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, elementFinder.getAttribute('disabled')];
                    case 2:
                        valueCheck = _a.sent();
                        return [4 /*yield*/, expect(valueCheck).toEqual('true')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserActions.rightClick = function (elementFinder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(elementFinder)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.actions().mouseMove(elementFinder).perform()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.actions().click(elementFinder, protractor_1.protractor.Button.RIGHT).perform()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserActions.closeMenuAndDialogs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var container;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = protractor_1.element(protractor_1.by.css('div.cdk-overlay-backdrop.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing'));
                        return [4 /*yield*/, protractor_1.browser.actions().sendKeys(protractor_1.protractor.Key.ESCAPE).perform()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(container)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserActions.closeDisabledMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // if the opened menu has only disabled items, pressing escape to close it won't work
                    return [4 /*yield*/, protractor_1.browser.actions().sendKeys(protractor_1.protractor.Key.ENTER).perform()];
                    case 1:
                        // if the opened menu has only disabled items, pressing escape to close it won't work
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserActions.clickOnDropdownOption = function (option, dropDownElement) {
        return __awaiter(this, void 0, void 0, function () {
            var optionElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.click(dropDownElement)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element('div[class*="mat-menu-content"] button'))];
                    case 2:
                        _a.sent();
                        optionElement = protractor_1.element(protractor_1.by.cssContainingText('div[class*="mat-menu-content"] button', option));
                        return [4 /*yield*/, this.click(optionElement)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserActions.clickOnSelectDropdownOption = function (option, dropDownElement) {
        return __awaiter(this, void 0, void 0, function () {
            var optionElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.click(dropDownElement)];
                    case 1:
                        _a.sent();
                        optionElement = protractor_1.element(protractor_1.by.cssContainingText('mat-option span.mat-option-text', option));
                        return [4 /*yield*/, this.click(optionElement)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return BrowserActions;
}());
exports.BrowserActions = BrowserActions;
//# sourceMappingURL=browser-actions.js.map