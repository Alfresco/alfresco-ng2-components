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
var NotificationPage = /** @class */ (function () {
    function NotificationPage() {
        this.messageField = protractor_1.element(protractor_1.by.css('input[data-automation-id="notification-message"]'));
        this.horizontalPosition = protractor_1.element(protractor_1.by.css('mat-select[data-automation-id="notification-horizontal-position"]'));
        this.verticalPosition = protractor_1.element(protractor_1.by.css('mat-select[data-automation-id="notification-vertical-position"]'));
        this.durationField = protractor_1.element(protractor_1.by.css('input[data-automation-id="notification-duration"]'));
        this.direction = protractor_1.element(protractor_1.by.css('mat-select[data-automation-id="notification-direction"]'));
        this.actionToggle = protractor_1.element(protractor_1.by.css('mat-slide-toggle[data-automation-id="notification-action-toggle"]'));
        this.notificationSnackBar = protractor_1.element.all(protractor_1.by.css('simple-snack-bar')).first();
        this.actionOutput = protractor_1.element(protractor_1.by.css('div[data-automation-id="notification-action-output"]'));
        this.selectionDropDown = protractor_1.element.all(protractor_1.by.css('.mat-select-panel')).first();
        this.notificationsPage = protractor_1.element(protractor_1.by.css('.adf-sidenav-link[data-automation-id="Notifications"]'));
        this.notificationConfig = protractor_1.element(protractor_1.by.css('p[data-automation-id="notification-custom-object"]'));
    }
    NotificationPage.prototype.checkNotifyContains = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element.all(protractor_1.by.cssContainingText('simple-snack-bar', message)).first())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationPage.prototype.goToNotificationsPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.notificationsPage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationPage.prototype.getConfigObject = function () {
        return adf_testing_1.BrowserActions.getText(this.notificationConfig);
    };
    NotificationPage.prototype.checkNotificationSnackBarIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.notificationSnackBar)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationPage.prototype.checkNotificationSnackBarIsDisplayedWithMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var notificationSnackBarMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        notificationSnackBarMessage = protractor_1.element(protractor_1.by.cssContainingText('simple-snack-bar', message));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(notificationSnackBarMessage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationPage.prototype.checkNotificationSnackBarIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.notificationSnackBar)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationPage.prototype.enterMessageField = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.messageField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.messageField, text)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationPage.prototype.enterDurationField = function (time) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.durationField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.durationField, time)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationPage.prototype.selectHorizontalPosition = function (selectedItem) {
        return __awaiter(this, void 0, void 0, function () {
            var selectItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectItem = protractor_1.element(protractor_1.by.cssContainingText('span[class="mat-option-text"]', selectedItem));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.horizontalPosition)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.selectionDropDown)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(selectItem)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationPage.prototype.selectVerticalPosition = function (selectedItem) {
        return __awaiter(this, void 0, void 0, function () {
            var selectItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectItem = protractor_1.element(protractor_1.by.cssContainingText('span[class="mat-option-text"]', selectedItem));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.verticalPosition)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.selectionDropDown)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(selectItem)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationPage.prototype.selectDirection = function (selectedItem) {
        return __awaiter(this, void 0, void 0, function () {
            var selectItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectItem = protractor_1.element(protractor_1.by.cssContainingText('span[class="mat-option-text"]', selectedItem));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.direction)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.selectionDropDown)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(selectItem)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationPage.prototype.clickNotificationButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            var button;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        button = protractor_1.element(protractor_1.by.css('button[data-automation-id="notification-custom-config-button"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(button)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationPage.prototype.checkActionEvent = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.actionOutput)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationPage.prototype.clickActionToggle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.actionToggle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationPage.prototype.clickActionButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.executeScript("document.querySelector(\"simple-snack-bar > div > button\").click();")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationPage.prototype.clearMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.messageField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.messageField, '')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return NotificationPage;
}());
exports.NotificationPage = NotificationPage;
//# sourceMappingURL=notificationPage.js.map