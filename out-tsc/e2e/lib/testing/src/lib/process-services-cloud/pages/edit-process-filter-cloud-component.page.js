"use strict";
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
var protractor_1 = require("protractor");
var edit_process_filter_dialog_page_1 = require("./dialog/edit-process-filter-dialog.page");
var browser_visibility_1 = require("../../core/utils/browser-visibility");
var browser_actions_1 = require("../../core/utils/browser-actions");
var EditProcessFilterCloudComponentPage = /** @class */ (function () {
    function EditProcessFilterCloudComponentPage() {
        this.customiseFilter = protractor_1.element(protractor_1.by.id('adf-edit-process-filter-title-id'));
        this.selectedOption = protractor_1.element.all(protractor_1.by.css('mat-option[class*="mat-selected"]')).first();
        this.saveButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-filter-action-save"]'));
        this.saveAsButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-filter-action-saveAs"]'));
        this.deleteButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-filter-action-delete"]'));
        this.editProcessFilterDialogPage = new edit_process_filter_dialog_page_1.EditProcessFilterDialogPage();
    }
    EditProcessFilterCloudComponentPage.prototype.editProcessFilterDialog = function () {
        return this.editProcessFilterDialogPage;
    };
    EditProcessFilterCloudComponentPage.prototype.clickCustomiseFilterHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.customiseFilter)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.driver.sleep(1000)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.checkCustomiseFilterHeaderIsExpanded = function () {
        return __awaiter(this, void 0, void 0, function () {
            var expansionPanelExtended, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expansionPanelExtended = protractor_1.element.all(protractor_1.by.css('mat-expansion-panel-header[class*="mat-expanded"]')).first();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(expansionPanelExtended)];
                    case 1:
                        _a.sent();
                        content = protractor_1.element.all(protractor_1.by.css('div[class*="mat-expansion-panel-content "][style*="visible"]')).first();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(content)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.setStatusFilterDropDown = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var statusElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickOnDropDownArrow('status')];
                    case 1:
                        _a.sent();
                        statusElement = protractor_1.element.all(protractor_1.by.cssContainingText('mat-option span', option)).first();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(statusElement)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.getStateFilterDropDownValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(protractor_1.element(protractor_1.by.css("mat-form-field[data-automation-id='status'] span")))];
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.setSortFilterDropDown = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var sortElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickOnDropDownArrow('sort')];
                    case 1:
                        _a.sent();
                        sortElement = protractor_1.element.all(protractor_1.by.cssContainingText('mat-option span', option)).first();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(sortElement)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.getSortFilterDropDownValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sortLocator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sortLocator = protractor_1.element.all(protractor_1.by.css("mat-form-field[data-automation-id='sort'] span")).first();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.getText(sortLocator)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.setOrderFilterDropDown = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var orderElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickOnDropDownArrow('order')];
                    case 1:
                        _a.sent();
                        orderElement = protractor_1.element.all(protractor_1.by.cssContainingText('mat-option span', option)).first();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(orderElement)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.getOrderFilterDropDownValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(protractor_1.element(protractor_1.by.css("mat-form-field[data-automation-id='order'] span")))];
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.clickOnDropDownArrow = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var dropDownArrow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dropDownArrow = protractor_1.element.all(protractor_1.by.css("mat-form-field[data-automation-id='" + option + "'] div[class='mat-select-arrow-wrapper']")).first();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(dropDownArrow)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.setAppNameDropDown = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var appNameElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickOnDropDownArrow('appName')];
                    case 1:
                        _a.sent();
                        appNameElement = protractor_1.element.all(protractor_1.by.cssContainingText('mat-option span', option)).first();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(appNameElement)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.checkAppNamesAreUnique = function () {
        return __awaiter(this, void 0, void 0, function () {
            var appNameList, appTextList, uniqueArray;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appNameList = protractor_1.element.all(protractor_1.by.css('mat-option[data-automation-id="adf-cloud-edit-process-property-optionsappName"] span'));
                        return [4 /*yield*/, appNameList.getText()];
                    case 1:
                        appTextList = _a.sent();
                        uniqueArray = appTextList.filter(function (appName) {
                            var sameAppNameArray = appTextList.filter(function (eachApp) { return eachApp === appName; });
                            return sameAppNameArray.length === 1;
                        });
                        return [2 /*return*/, uniqueArray.length === appTextList.length];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.getNumberOfAppNameOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dropdownOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickOnDropDownArrow('appName')];
                    case 1:
                        _a.sent();
                        dropdownOptions = protractor_1.element.all(protractor_1.by.css('.mat-select-panel mat-option'));
                        return [2 /*return*/, dropdownOptions.count()];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.setProcessInstanceId = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setProperty('processInstanceId', option)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.getProcessInstanceId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getProperty('processInstanceId')];
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.getProperty = function (property) {
        return __awaiter(this, void 0, void 0, function () {
            var locator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        locator = protractor_1.element.all(protractor_1.by.css('input[data-automation-id="adf-cloud-edit-process-property-' + property + '"]')).first();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(locator)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, locator.getAttribute('value')];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.setProperty = function (property, option) {
        return __awaiter(this, void 0, void 0, function () {
            var locator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        locator = protractor_1.element.all(protractor_1.by.css('input[data-automation-id="adf-cloud-edit-process-property-' + property + '"]')).first();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(locator)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, locator.clear()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, locator.sendKeys(option)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, locator.sendKeys(protractor_1.protractor.Key.ENTER)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.checkSaveButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.saveButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.checkSaveAsButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.saveAsButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.checkDeleteButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.deleteButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.checkDeleteButtonIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.deleteButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.checkSaveButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.saveButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.saveButton.isEnabled()];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.checkSaveAsButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.saveAsButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.saveAsButton.isEnabled()];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.checkDeleteButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.deleteButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.deleteButton.isEnabled()];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.clickSaveAsButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            var disabledButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        disabledButton = protractor_1.element(protractor_1.by.css(("button[data-automation-id='adf-filter-action-saveAs'][disabled]")));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(disabledButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.saveAsButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.driver.sleep(1000)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.clickDeleteButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.deleteButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditProcessFilterCloudComponentPage.prototype.clickSaveButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            var disabledButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        disabledButton = protractor_1.element(protractor_1.by.css(("button[id='adf-save-as-id'][disabled]")));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsClickable(this.saveButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.saveButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(disabledButton)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.saveButton.click()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return EditProcessFilterCloudComponentPage;
}());
exports.EditProcessFilterCloudComponentPage = EditProcessFilterCloudComponentPage;
//# sourceMappingURL=edit-process-filter-cloud-component.page.js.map