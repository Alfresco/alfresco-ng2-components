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
var StartTasksCloudPage = /** @class */ (function () {
    function StartTasksCloudPage() {
        this.name = protractor_1.element(protractor_1.by.css('input[id="name_id"]'));
        this.dueDate = protractor_1.element(protractor_1.by.css('input[id="date_id"]'));
        this.description = protractor_1.element(protractor_1.by.css('textarea[id="description_id"]'));
        this.priority = protractor_1.element(protractor_1.by.css('input[formcontrolname="priority"]'));
        this.startButton = protractor_1.element(protractor_1.by.css('button[id="button-start"]'));
        this.startButtonEnabled = protractor_1.element(protractor_1.by.css('button[id="button-start"]:not(disabled)'));
        this.cancelButton = protractor_1.element(protractor_1.by.css('button[id="button-cancel"]'));
        this.form = protractor_1.element.all(protractor_1.by.css('adf-cloud-start-task form')).first();
        this.formDefinitionSelector = protractor_1.element(protractor_1.by.css('.adf-form-definition-selector'));
    }
    StartTasksCloudPage.prototype.checkFormIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.form)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTasksCloudPage.prototype.addName = function (userName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.name, userName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTasksCloudPage.prototype.addDescription = function (userDescription) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.description, userDescription)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTasksCloudPage.prototype.addPriority = function (userPriority) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.priority, userPriority)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTasksCloudPage.prototype.addDueDate = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.dueDate)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.dueDate, date)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTasksCloudPage.prototype.clickStartButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.startButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTasksCloudPage.prototype.checkStartButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.startButtonEnabled)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTasksCloudPage.prototype.checkStartButtonIsDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element(protractor_1.by.css('button[id="button-start"]:disabled')))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTasksCloudPage.prototype.clickCancelButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.cancelButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTasksCloudPage.prototype.blur = function (locator) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(locator)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsClickable(locator)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(locator)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, locator.sendKeys(protractor_1.Key.TAB)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTasksCloudPage.prototype.checkValidationErrorIsDisplayed = function (error, elementRef) {
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
    StartTasksCloudPage.prototype.validateAssignee = function (error) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkValidationErrorIsDisplayed(error, '.adf-start-task-cloud-error')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTasksCloudPage.prototype.validateDate = function (error) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkValidationErrorIsDisplayed(error, '.adf-error-text')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTasksCloudPage.prototype.selectFormDefinition = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.formDefinitionSelector)];
                    case 1:
                        _a.sent();
                        row = protractor_1.element(protractor_1.by.cssContainingText('mat-option span', option));
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(row)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTasksCloudPage.prototype.checkFormDefinitionIsDisplayed = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.formDefinitionSelector)];
                    case 1:
                        _a.sent();
                        row = protractor_1.element(protractor_1.by.cssContainingText('mat-option span', option));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(row)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.closeMenuAndDialogs()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StartTasksCloudPage.prototype.checkFormDefinitionIsNotDisplayed = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.formDefinitionSelector)];
                    case 1:
                        _a.sent();
                        row = protractor_1.element(protractor_1.by.cssContainingText('mat-option span', option));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(row)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.closeMenuAndDialogs()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return StartTasksCloudPage;
}());
exports.StartTasksCloudPage = StartTasksCloudPage;
//# sourceMappingURL=start-tasks-cloud-component.page.js.map