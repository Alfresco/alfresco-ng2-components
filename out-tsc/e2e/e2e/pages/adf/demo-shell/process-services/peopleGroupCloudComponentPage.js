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
var PeopleGroupCloudComponentPage = /** @class */ (function () {
    function PeopleGroupCloudComponentPage() {
        this.peopleCloudSingleSelectionChecked = protractor_1.element(protractor_1.by.css('mat-radio-button[data-automation-id="adf-people-single-mode"][class*="mat-radio-checked"]'));
        this.peopleCloudMultipleSelectionChecked = protractor_1.element(protractor_1.by.css('mat-radio-button[data-automation-id="adf-people-multiple-mode"][class*="mat-radio-checked"]'));
        this.peopleCloudSingleSelection = protractor_1.element(protractor_1.by.css('mat-radio-button[data-automation-id="adf-people-single-mode"]'));
        this.peopleCloudMultipleSelection = protractor_1.element(protractor_1.by.css('mat-radio-button[data-automation-id="adf-people-multiple-mode"]'));
        this.peopleCloudFilterRole = protractor_1.element(protractor_1.by.css('mat-radio-button[data-automation-id="adf-people-filter-role"]'));
        this.groupCloudSingleSelection = protractor_1.element(protractor_1.by.css('mat-radio-button[data-automation-id="adf-group-single-mode"]'));
        this.groupCloudMultipleSelection = protractor_1.element(protractor_1.by.css('mat-radio-button[data-automation-id="adf-group-multiple-mode"]'));
        this.groupCloudFilterRole = protractor_1.element(protractor_1.by.css('mat-radio-button[data-automation-id="adf-group-filter-role"]'));
        this.peopleRoleInput = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-people-roles-input"]'));
        this.peopleAppInput = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-people-app-input"]'));
        this.peoplePreselect = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-people-preselect-input"]'));
        this.groupRoleInput = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-group-roles-input"]'));
        this.groupAppInput = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-group-app-input"]'));
        this.peopleCloudComponentTitle = protractor_1.element(protractor_1.by.cssContainingText('mat-card-title', 'People Cloud Component'));
        this.groupCloudComponentTitle = protractor_1.element(protractor_1.by.cssContainingText('mat-card-title', 'Groups Cloud Component'));
        this.preselectValidation = protractor_1.element(protractor_1.by.css('mat-checkbox.adf-preselect-value'));
        this.preselectValidationStatus = protractor_1.element(protractor_1.by.css('mat-checkbox.adf-preselect-value label input'));
        this.peopleFilterByAppName = protractor_1.element(protractor_1.by.css('.people-control-options mat-radio-button[value="appName"]'));
        this.groupFilterByAppName = protractor_1.element(protractor_1.by.css('.groups-control-options mat-radio-button[value="appName"]'));
    }
    PeopleGroupCloudComponentPage.prototype.checkPeopleCloudComponentTitleIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.peopleCloudComponentTitle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.checkGroupsCloudComponentTitleIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.groupCloudComponentTitle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.clickPeopleCloudSingleSelection = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.peopleCloudSingleSelection)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.clickPeopleCloudMultipleSelection = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.peopleCloudMultipleSelection)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.checkPeopleCloudSingleSelectionIsSelected = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.peopleCloudSingleSelectionChecked)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.checkPeopleCloudMultipleSelectionIsSelected = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.peopleCloudMultipleSelectionChecked)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.checkPeopleCloudFilterRole = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.peopleCloudFilterRole)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.clickPeopleCloudFilterRole = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.peopleCloudFilterRole)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.clickGroupCloudFilterRole = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.groupCloudFilterRole)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.enterPeopleRoles = function (roles) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.peopleRoleInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.peopleRoleInput, roles)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.enterPeoplePreselect = function (preselect) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.peoplePreselect)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.peoplePreselect, preselect)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.clearField = function (locator) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(locator)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(locator, '')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.clickGroupCloudSingleSelection = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.groupCloudSingleSelection)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.clickGroupCloudMultipleSelection = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.groupCloudMultipleSelection)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.enterGroupRoles = function (roles) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.groupRoleInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.groupRoleInput, roles)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.clickPreselectValidation = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.preselectValidation)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.getPreselectValidationStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.preselectValidationStatus)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.preselectValidationStatus.getAttribute('aria-checked')];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.clickPeopleFilerByApp = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.peopleFilterByAppName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.clickGroupFilerByApp = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.groupFilterByAppName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.enterPeopleAppName = function (appName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.peopleAppInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.peopleAppInput, appName)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PeopleGroupCloudComponentPage.prototype.enterGroupAppName = function (appName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.groupAppInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.groupAppInput, appName)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PeopleGroupCloudComponentPage;
}());
exports.PeopleGroupCloudComponentPage = PeopleGroupCloudComponentPage;
//# sourceMappingURL=peopleGroupCloudComponentPage.js.map