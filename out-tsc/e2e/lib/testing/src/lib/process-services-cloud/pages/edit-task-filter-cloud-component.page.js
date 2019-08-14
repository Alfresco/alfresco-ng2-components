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
var edit_task_filter_dialog_page_1 = require("./dialog/edit-task-filter-dialog.page");
var browser_visibility_1 = require("../../core/utils/browser-visibility");
var browser_actions_1 = require("../../core/utils/browser-actions");
var EditTaskFilterCloudComponentPage = /** @class */ (function () {
    function EditTaskFilterCloudComponentPage() {
        this.customiseFilter = protractor_1.element(protractor_1.by.id('adf-edit-task-filter-title-id'));
        this.selectedOption = protractor_1.element.all(protractor_1.by.css('mat-option[class*="mat-selected"]')).first();
        this.assignee = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-cloud-edit-task-property-assignee"]'));
        this.priority = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-cloud-edit-task-property-priority"]'));
        this.taskName = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-cloud-edit-task-property-taskName"]'));
        this.id = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-cloud-edit-task-property-taskId"]'));
        this.processDefinitionId = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-cloud-edit-task-property-processDefinitionId"]'));
        this.processInstanceId = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-cloud-edit-task-property-processInstanceId"]'));
        this.lastModifiedFrom = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-cloud-edit-task-property-lastModifiedFrom"]'));
        this.lastModifiedTo = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-cloud-edit-task-property-lastModifiedTo"]'));
        this.parentTaskId = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-cloud-edit-task-property-parentTaskId"]'));
        this.owner = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-cloud-edit-task-property-owner"]'));
        this.saveButton = protractor_1.element(protractor_1.by.css('[data-automation-id="adf-filter-action-save"]'));
        this.saveAsButton = protractor_1.element(protractor_1.by.css('[data-automation-id="adf-filter-action-saveAs"]'));
        this.deleteButton = protractor_1.element(protractor_1.by.css('[data-automation-id="adf-filter-action-delete"]'));
        this.editTaskFilterDialogPage = new edit_task_filter_dialog_page_1.EditTaskFilterDialogPage();
    }
    EditTaskFilterCloudComponentPage.prototype.editTaskFilterDialog = function () {
        return this.editTaskFilterDialogPage;
    };
    EditTaskFilterCloudComponentPage.prototype.clickCustomiseFilterHeader = function () {
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
    EditTaskFilterCloudComponentPage.prototype.setStatusFilterDropDown = function (option) {
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
    EditTaskFilterCloudComponentPage.prototype.getStatusFilterDropDownValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(protractor_1.element.all(protractor_1.by.css("mat-select[data-automation-id='adf-cloud-edit-task-property-status'] span")).first())];
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.setSortFilterDropDown = function (option) {
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
    EditTaskFilterCloudComponentPage.prototype.getSortFilterDropDownValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var elementSort;
            return __generator(this, function (_a) {
                elementSort = protractor_1.element.all(protractor_1.by.css("mat-select[data-automation-id='adf-cloud-edit-task-property-sort'] span")).first();
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(elementSort)];
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.setOrderFilterDropDown = function (option) {
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
    EditTaskFilterCloudComponentPage.prototype.getOrderFilterDropDownValue = function () {
        return browser_actions_1.BrowserActions.getText(protractor_1.element.all(protractor_1.by.css("mat-select[data-automation-id='adf-cloud-edit-task-property-order'] span")).first());
    };
    EditTaskFilterCloudComponentPage.prototype.clickOnDropDownArrow = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var dropDownArrow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dropDownArrow = protractor_1.element.all(protractor_1.by.css("mat-form-field[data-automation-id='" + option + "'] div[class*='arrow']")).first();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(dropDownArrow)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.selectedOption)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.setAssignee = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setProperty('assignee', option)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.getAssignee = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.assignee)];
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.setPriority = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setProperty('priority', option)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.getPriority = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.priority)];
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.setParentTaskId = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setProperty('parentTaskId', option)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.getParentTaskId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.parentTaskId)];
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.setOwner = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setProperty('owner', option)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.getOwner = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.owner)];
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.setLastModifiedFrom = function (lastModifiedFromDate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clearField(this.lastModifiedFrom)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.setProperty('lastModifiedFrom', lastModifiedFromDate)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.getLastModifiedFrom = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.lastModifiedFrom)];
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.setLastModifiedTo = function (lastModifiedToDate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clearField(this.lastModifiedTo)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.setProperty('lastModifiedTo', lastModifiedToDate)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.getLastModifiedTo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.lastModifiedTo)];
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.checkSaveButtonIsDisplayed = function () {
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
    EditTaskFilterCloudComponentPage.prototype.checkSaveAsButtonIsDisplayed = function () {
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
    EditTaskFilterCloudComponentPage.prototype.checkDeleteButtonIsDisplayed = function () {
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
    EditTaskFilterCloudComponentPage.prototype.checkSaveButtonIsEnabled = function () {
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
    EditTaskFilterCloudComponentPage.prototype.checkSaveAsButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.saveButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.saveAsButton.isEnabled()];
                }
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.checkDeleteButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.saveButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.deleteButton.isEnabled()];
                }
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.clickSaveAsButton = function () {
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
    EditTaskFilterCloudComponentPage.prototype.clickDeleteButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.deleteButton)];
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
    EditTaskFilterCloudComponentPage.prototype.clickSaveButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.saveButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.clearAssignee = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.clearWithBackSpace(this.assignee)];
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
    EditTaskFilterCloudComponentPage.prototype.clearField = function (locator) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(locator, ' ')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, locator.sendKeys(protractor_1.protractor.Key.BACK_SPACE)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.setAppNameDropDown = function (option) {
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
    EditTaskFilterCloudComponentPage.prototype.getAppNameDropDownValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var locator;
            return __generator(this, function (_a) {
                locator = protractor_1.element.all(protractor_1.by.css("mat-select[data-automation-id='adf-cloud-edit-task-property-appName'] span")).first();
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(locator)];
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.setId = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setProperty('taskId', option)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.getId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.id.getAttribute('value')];
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.setTaskName = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setProperty('taskName', option)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.getTaskName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.taskName.getAttribute('value')];
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.setProcessDefinitionId = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setProperty('processDefinitionId', option)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.getProcessDefinitionId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.processDefinitionId.getAttribute('value')];
            });
        });
    };
    EditTaskFilterCloudComponentPage.prototype.setProcessInstanceId = function (option) {
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
    EditTaskFilterCloudComponentPage.prototype.setProperty = function (property, option) {
        return __awaiter(this, void 0, void 0, function () {
            var locator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        locator = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-cloud-edit-task-property-' + property + '"]'));
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
    EditTaskFilterCloudComponentPage.prototype.getProcessInstanceId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.processInstanceId.getAttribute('value')];
            });
        });
    };
    return EditTaskFilterCloudComponentPage;
}());
exports.EditTaskFilterCloudComponentPage = EditTaskFilterCloudComponentPage;
//# sourceMappingURL=edit-task-filter-cloud-component.page.js.map