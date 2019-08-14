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
var tasksListPage_1 = require("../../process-services/tasksListPage");
var adf_testing_1 = require("@alfresco/adf-testing");
var protractor_1 = require("protractor");
var adf_testing_2 = require("@alfresco/adf-testing");
var TaskListDemoPage = /** @class */ (function () {
    function TaskListDemoPage() {
        this.taskListPage = new tasksListPage_1.TasksListPage();
        this.appId = protractor_1.element(protractor_1.by.css("input[data-automation-id='appId input']"));
        this.itemsPerPage = protractor_1.element(protractor_1.by.css("input[data-automation-id='items per page']"));
        this.itemsPerPageForm = protractor_1.element(protractor_1.by.css("mat-form-field[data-automation-id='items per page']"));
        this.processDefinitionId = protractor_1.element(protractor_1.by.css("input[data-automation-id='process definition id']"));
        this.processInstanceId = protractor_1.element(protractor_1.by.css("input[data-automation-id='process instance id']"));
        this.page = protractor_1.element(protractor_1.by.css("input[data-automation-id='page']"));
        this.pageForm = protractor_1.element(protractor_1.by.css("mat-form-field[data-automation-id='page']"));
        this.taskName = protractor_1.element(protractor_1.by.css("input[data-automation-id='task name']"));
        this.resetButton = protractor_1.element(protractor_1.by.css("div[class='adf-reset-button'] button"));
        this.dueBefore = protractor_1.element(protractor_1.by.css("input[data-automation-id='due before']"));
        this.dueAfter = protractor_1.element(protractor_1.by.css("input[data-automation-id='due after']"));
        this.taskId = protractor_1.element(protractor_1.by.css("input[data-automation-id='task id']"));
        this.stateDropDownArrow = protractor_1.element(protractor_1.by.css("mat-form-field[data-automation-id='state'] div[class*='arrow']"));
        this.stateSelector = protractor_1.element(protractor_1.by.css("div[class*='mat-select-panel']"));
    }
    TaskListDemoPage.prototype.taskList = function () {
        return this.taskListPage;
    };
    TaskListDemoPage.prototype.paginationPage = function () {
        return new adf_testing_1.PaginationPage();
    };
    TaskListDemoPage.prototype.typeAppId = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.appId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.clearSendKeys(this.appId, input)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskListDemoPage.prototype.clickAppId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.appId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskListDemoPage.prototype.getAppId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.appId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.appId.getAttribute('value')];
                }
            });
        });
    };
    TaskListDemoPage.prototype.typeTaskId = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.taskId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.clearSendKeys(this.taskId, input)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskListDemoPage.prototype.getTaskId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.taskId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.taskId.getAttribute('value')];
                }
            });
        });
    };
    TaskListDemoPage.prototype.typeTaskName = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.taskName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.clearSendKeys(this.taskName, input)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskListDemoPage.prototype.getTaskName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.taskName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.taskName.getAttribute('value')];
                }
            });
        });
    };
    TaskListDemoPage.prototype.typeItemsPerPage = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.itemsPerPage)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.clearSendKeys(this.itemsPerPage, input)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskListDemoPage.prototype.typeProcessDefinitionId = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.processDefinitionId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.clearSendKeys(this.processDefinitionId, input)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskListDemoPage.prototype.getProcessDefinitionId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.processInstanceId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.processInstanceId.getAttribute('value')];
                }
            });
        });
    };
    TaskListDemoPage.prototype.typeProcessInstanceId = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.processInstanceId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.clearSendKeys(this.processInstanceId, input)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskListDemoPage.prototype.getProcessInstanceId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.processInstanceId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.processInstanceId.getAttribute('value')];
                }
            });
        });
    };
    TaskListDemoPage.prototype.getItemsPerPageFieldErrorMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.itemsPerPageForm)];
                    case 1:
                        _a.sent();
                        errorMessage = this.itemsPerPageForm.element(protractor_1.by.css('mat-error'));
                        return [2 /*return*/, adf_testing_2.BrowserActions.getText(errorMessage)];
                }
            });
        });
    };
    TaskListDemoPage.prototype.typePage = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.page)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.clearSendKeys(this.page, input)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskListDemoPage.prototype.getPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.page)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.page.getAttribute('value')];
                }
            });
        });
    };
    TaskListDemoPage.prototype.getPageFieldErrorMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.pageForm)];
                    case 1:
                        _a.sent();
                        errorMessage = this.pageForm.element(protractor_1.by.css('mat-error'));
                        return [2 /*return*/, adf_testing_2.BrowserActions.getText(errorMessage)];
                }
            });
        });
    };
    TaskListDemoPage.prototype.typeDueAfter = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.dueAfter)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.clearSendKeys(this.dueAfter, input)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskListDemoPage.prototype.typeDueBefore = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.dueBefore)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.clearSendKeys(this.dueBefore, input)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskListDemoPage.prototype.clearText = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(input)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, input.clear()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskListDemoPage.prototype.clickResetButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.resetButton)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskListDemoPage.prototype.selectState = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var stateElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickOnStateDropDownArrow()];
                    case 1:
                        _a.sent();
                        stateElement = protractor_1.element.all(protractor_1.by.cssContainingText('mat-option span', state)).first();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(stateElement)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskListDemoPage.prototype.clickOnStateDropDownArrow = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.stateDropDownArrow)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.stateSelector)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskListDemoPage.prototype.getAllProcessDefinitionIds = function () {
        return this.taskList().getDataTable().getAllRowsColumnValues('Process Definition Id');
    };
    TaskListDemoPage.prototype.getAllProcessInstanceIds = function () {
        return this.taskList().getDataTable().getAllRowsColumnValues('Process Instance Id');
    };
    return TaskListDemoPage;
}());
exports.TaskListDemoPage = TaskListDemoPage;
//# sourceMappingURL=taskListDemoPage.js.map