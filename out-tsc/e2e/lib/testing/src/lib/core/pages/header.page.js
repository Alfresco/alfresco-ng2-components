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
var HeaderPage = /** @class */ (function () {
    function HeaderPage() {
        this.checkBox = protractor_1.element(protractor_1.by.cssContainingText('.mat-checkbox-label', 'Show menu button'));
        this.headerColor = protractor_1.element(protractor_1.by.css('option[value="primary"]'));
        this.titleInput = protractor_1.element(protractor_1.by.css('input[name="title"]'));
        this.iconInput = protractor_1.element(protractor_1.by.css('input[placeholder="URL path"]'));
        this.hexColorInput = protractor_1.element(protractor_1.by.css('input[placeholder="hex color code"]'));
        this.logoHyperlinkInput = protractor_1.element(protractor_1.by.css('input[placeholder="Redirect URL"]'));
        this.logoTooltipInput = protractor_1.element(protractor_1.by.css('input[placeholder="Tooltip text"]'));
        this.positionStart = protractor_1.element.all(protractor_1.by.css('mat-radio-button[value="start"]')).first();
        this.positionEnd = protractor_1.element.all(protractor_1.by.css('mat-radio-button[value="end"]')).first();
        this.sideBarPositionRight = protractor_1.element(protractor_1.by.css('mat-sidenav.mat-drawer.mat-sidenav.mat-drawer-end'));
        this.sideBarPositionLeft = protractor_1.element(protractor_1.by.css('mat-sidenav.mat-drawer.mat-sidenav'));
    }
    HeaderPage.prototype.checkShowMenuCheckBoxIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.checkBox)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.checkChooseHeaderColourIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.headerColor)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.checkChangeTitleIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.titleInput)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.checkChangeUrlPathIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.iconInput)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.clickShowMenuButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            var checkBox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkBox = protractor_1.element.all(protractor_1.by.css('mat-checkbox')).first();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(checkBox)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.changeHeaderColor = function (color) {
        return __awaiter(this, void 0, void 0, function () {
            var headerColor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headerColor = protractor_1.element(protractor_1.by.css('option[value="' + color + '"]'));
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(headerColor)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.checkAppTitle = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var title;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        title = protractor_1.element(protractor_1.by.cssContainingText('.adf-app-title', name));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(title)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.addTitle = function (title) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.titleInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.titleInput, title)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.titleInput.sendKeys(protractor_1.protractor.Key.ENTER)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.checkIconIsDisplayed = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var icon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        icon = protractor_1.element(protractor_1.by.css('img[src="' + url + '"]'));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(icon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.addIcon = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.iconInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.iconInput, url)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.iconInput.sendKeys(protractor_1.protractor.Key.ENTER)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.checkHexColorInputIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.hexColorInput)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.checkLogoHyperlinkInputIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.logoHyperlinkInput)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.checkLogoTooltipInputIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.logoTooltipInput)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.addHexCodeColor = function (hexCode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.hexColorInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.hexColorInput, hexCode)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.hexColorInput.sendKeys(protractor_1.protractor.Key.ENTER)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.addLogoHyperlink = function (hyperlink) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.logoHyperlinkInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.logoHyperlinkInput, hyperlink)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.logoHyperlinkInput.sendKeys(protractor_1.protractor.Key.ENTER)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.addLogoTooltip = function (tooltip) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.logoTooltipInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.logoTooltipInput, tooltip)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.logoTooltipInput.sendKeys(protractor_1.protractor.Key.ENTER)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.sideBarPositionStart = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.positionStart)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.sideBarPositionEnd = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.executeScript('arguments[0].scrollIntoView()', this.positionEnd)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.positionEnd)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.checkSidebarPositionStart = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.sideBarPositionLeft)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeaderPage.prototype.checkSidebarPositionEnd = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.sideBarPositionRight)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return HeaderPage;
}());
exports.HeaderPage = HeaderPage;
//# sourceMappingURL=header.page.js.map