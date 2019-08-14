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
var formFields_1 = require("../formFields");
var protractor_1 = require("protractor");
var public_api_1 = require("../../../utils/public-api");
var PeopleWidget = /** @class */ (function () {
    function PeopleWidget() {
        this.peopleField = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-people-search-input"]'));
        this.firstResult = protractor_1.element(protractor_1.by.id('adf-people-widget-user-0'));
        this.formFields = new formFields_1.FormFields();
        this.labelLocator = protractor_1.by.css('div[class*="display-text-widget"]');
        this.inputLocator = protractor_1.by.id('involvepeople');
        this.peopleDropDownList = protractor_1.by.css('div[class*="adf-people-widget-list"]');
    }
    PeopleWidget.prototype.getFieldLabel = function (fieldId) {
        return this.formFields.getFieldLabel(fieldId, this.labelLocator);
    };
    PeopleWidget.prototype.getFieldValue = function (fieldId) {
        return this.formFields.getFieldValue(fieldId, this.inputLocator);
    };
    PeopleWidget.prototype.getFieldText = function (fieldId) {
        return this.formFields.getFieldText(fieldId, this.labelLocator);
    };
    PeopleWidget.prototype.insertUser = function (fieldId, value) {
        return this.formFields.setValueInInputById(fieldId, value);
    };
    PeopleWidget.prototype.checkDropDownListIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element(this.peopleDropDownList))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleWidget.prototype.checkUserIsListed = function (userName) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = protractor_1.element(protractor_1.by.cssContainingText('.adf-people-label-name', userName));
                        return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsVisible(user)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleWidget.prototype.selectUserFromDropDown = function (userName) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = protractor_1.element(protractor_1.by.cssContainingText('.adf-people-label-name', userName));
                        return [4 /*yield*/, public_api_1.BrowserActions.click(user)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleWidget.prototype.checkPeopleFieldIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsVisible(this.peopleField)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleWidget.prototype.fillPeopleField = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsClickable(this.peopleField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.peopleField.sendKeys(value)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleWidget.prototype.selectUserFromDropdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, public_api_1.BrowserVisibility.waitUntilElementIsVisible(this.firstResult)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, public_api_1.BrowserActions.click(this.firstResult)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PeopleWidget;
}());
exports.PeopleWidget = PeopleWidget;
//# sourceMappingURL=peopleWidget.js.map