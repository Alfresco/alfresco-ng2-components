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
var TasksCloudDemoPage = /** @class */ (function () {
    function TasksCloudDemoPage() {
        this.myTasks = protractor_1.element(protractor_1.by.css('span[data-automation-id="my-tasks-filter"]'));
        this.completedTasks = protractor_1.element(protractor_1.by.css('span[data-automation-id="completed-tasks-filter"]'));
        this.activeFilter = protractor_1.element(protractor_1.by.css("mat-list-item[class*='active'] span"));
        this.defaultActiveFilter = protractor_1.element.all(protractor_1.by.css('.adf-filters__entry')).first();
        this.createButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="create-button"'));
        this.newTaskButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="btn-start-task"]'));
        this.settingsButton = protractor_1.element.all(protractor_1.by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Settings')).first();
        this.appButton = protractor_1.element.all(protractor_1.by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'App')).first();
        this.modeDropDownArrow = protractor_1.element(protractor_1.by.css('mat-form-field[data-automation-id="selectionMode"] div[class*="arrow-wrapper"]'));
        this.modeSelector = protractor_1.element(protractor_1.by.css("div[class*='mat-select-panel']"));
        this.displayTaskDetailsToggle = protractor_1.element(protractor_1.by.css('mat-slide-toggle[data-automation-id="taskDetailsRedirection"]'));
        this.displayProcessDetailsToggle = protractor_1.element(protractor_1.by.css('mat-slide-toggle[data-automation-id="processDetailsRedirection"]'));
        this.multiSelectionToggle = protractor_1.element(protractor_1.by.css('mat-slide-toggle[data-automation-id="multiSelection"]'));
        this.testingModeToggle = protractor_1.element(protractor_1.by.css('mat-slide-toggle[data-automation-id="testingMode"]'));
        this.selectedRows = protractor_1.element(protractor_1.by.xpath("//div[text()=' Selected rows: ']"));
        this.noOfSelectedRows = protractor_1.element.all(protractor_1.by.xpath("//div[text()=' Selected rows: ']//li"));
        this.formControllersPage = new adf_testing_1.FormControllersPage();
        this.editTaskFilterCloud = new adf_testing_1.EditTaskFilterCloudComponentPage();
    }
    TasksCloudDemoPage.prototype.disableDisplayTaskDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(this.displayTaskDetailsToggle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TasksCloudDemoPage.prototype.disableDisplayProcessDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(this.displayProcessDetailsToggle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TasksCloudDemoPage.prototype.enableMultiSelection = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.multiSelectionToggle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TasksCloudDemoPage.prototype.enableTestingMode = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.testingModeToggle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TasksCloudDemoPage.prototype.taskListCloudComponent = function () {
        return new adf_testing_1.TaskListCloudComponentPage();
    };
    TasksCloudDemoPage.prototype.editTaskFilterCloudComponent = function () {
        return this.editTaskFilterCloud;
    };
    TasksCloudDemoPage.prototype.myTasksFilter = function () {
        return new adf_testing_1.TaskFiltersCloudComponentPage(this.myTasks);
    };
    TasksCloudDemoPage.prototype.completedTasksFilter = function () {
        return new adf_testing_1.TaskFiltersCloudComponentPage(this.completedTasks);
    };
    TasksCloudDemoPage.prototype.getActiveFilterName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.activeFilter)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TasksCloudDemoPage.prototype.customTaskFilter = function (filterName) {
        return new adf_testing_1.TaskFiltersCloudComponentPage(protractor_1.element(protractor_1.by.css("span[data-automation-id=\"" + filterName + "-filter\"]")));
    };
    TasksCloudDemoPage.prototype.openNewTaskForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.createButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clickExecuteScript('button[data-automation-id="btn-start-task"]')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TasksCloudDemoPage.prototype.firstFilterIsActive = function () {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.defaultActiveFilter.getAttribute('class')];
                    case 1:
                        value = _a.sent();
                        return [2 /*return*/, value.includes('adf-active')];
                }
            });
        });
    };
    TasksCloudDemoPage.prototype.clickSettingsButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.settingsButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(400)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.multiSelectionToggle)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsClickable(this.modeDropDownArrow)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TasksCloudDemoPage.prototype.clickAppButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.appButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TasksCloudDemoPage.prototype.selectSelectionMode = function (mode) {
        return __awaiter(this, void 0, void 0, function () {
            var modeElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickOnSelectionModeDropDownArrow()];
                    case 1:
                        _a.sent();
                        modeElement = protractor_1.element.all(protractor_1.by.cssContainingText('mat-option span', mode)).first();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(modeElement)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TasksCloudDemoPage.prototype.clickOnSelectionModeDropDownArrow = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.modeDropDownArrow)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.modeSelector)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TasksCloudDemoPage.prototype.checkSelectedRowsIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.selectedRows)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TasksCloudDemoPage.prototype.getNoOfSelectedRows = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkSelectedRowsIsDisplayed()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.noOfSelectedRows.count()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TasksCloudDemoPage.prototype.getSelectedTaskRowText = function (rowNo) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkSelectedRowsIsDisplayed()];
                    case 1:
                        _a.sent();
                        row = protractor_1.element(protractor_1.by.xpath("//div[text()=' Selected rows: ']//li[" + rowNo + "]"));
                        return [4 /*yield*/, row.getText()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return TasksCloudDemoPage;
}());
exports.TasksCloudDemoPage = TasksCloudDemoPage;
//# sourceMappingURL=tasksCloudDemoPage.js.map