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
var adf_testing_1 = require("@alfresco/adf-testing");
var adf_testing_2 = require("@alfresco/adf-testing");
var protractor_1 = require("protractor");
var ProcessListDemoPage = /** @class */ (function () {
    function ProcessListDemoPage() {
        this.appIdInput = protractor_1.element(protractor_1.by.css('input[data-automation-id="app-id"]'));
        this.resetButton = protractor_1.element(protractor_1.by.cssContainingText('button span', 'Reset'));
        this.emptyProcessContent = protractor_1.element(protractor_1.by.css('div[class="adf-empty-content"]'));
        this.processDefinitionInput = protractor_1.element(protractor_1.by.css('input[data-automation-id="process-definition-id"]'));
        this.processInstanceInput = protractor_1.element(protractor_1.by.css('input[data-automation-id="process-instance-id"]'));
        this.stateSelector = protractor_1.element(protractor_1.by.css('mat-select[data-automation-id="state"'));
        this.sortSelector = protractor_1.element(protractor_1.by.css('mat-select[data-automation-id="sort"'));
        this.dataTable = new adf_testing_2.DataTableComponentPage();
    }
    ProcessListDemoPage.prototype.getDisplayedProcessesNames = function () {
        return this.dataTable.getAllRowsColumnValues('Name');
    };
    ProcessListDemoPage.prototype.selectSorting = function (sort) {
        return __awaiter(this, void 0, void 0, function () {
            var sortLocator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.sortSelector)];
                    case 1:
                        _a.sent();
                        sortLocator = protractor_1.element(protractor_1.by.cssContainingText('mat-option span', sort));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(sortLocator)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessListDemoPage.prototype.selectStateFilter = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var stateLocator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.stateSelector)];
                    case 1:
                        _a.sent();
                        stateLocator = protractor_1.element(protractor_1.by.cssContainingText('mat-option span', state));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(stateLocator)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessListDemoPage.prototype.addAppId = function (appId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.appIdInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.appIdInput.sendKeys(protractor_1.protractor.Key.ENTER)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.appIdInput.clear()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.appIdInput.sendKeys(appId)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessListDemoPage.prototype.clickResetButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.resetButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessListDemoPage.prototype.checkErrorMessageIsDisplayed = function (error) {
        return __awaiter(this, void 0, void 0, function () {
            var errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errorMessage = protractor_1.element(protractor_1.by.cssContainingText('mat-error', error));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(errorMessage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessListDemoPage.prototype.checkNoProcessFoundIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.emptyProcessContent)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessListDemoPage.prototype.checkProcessIsNotDisplayed = function (processName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.checkContentIsNotDisplayed('Name', processName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessListDemoPage.prototype.checkProcessIsDisplayed = function (processName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.checkContentIsDisplayed('Name', processName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessListDemoPage.prototype.checkAppIdFieldIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.appIdInput)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessListDemoPage.prototype.checkProcessInstanceIdFieldIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.processInstanceInput)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessListDemoPage.prototype.checkStateFieldIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.stateSelector)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessListDemoPage.prototype.checkSortFieldIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.sortSelector)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessListDemoPage.prototype.addProcessDefinitionId = function (procDefinitionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.processDefinitionInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.clearSendKeys(this.processDefinitionInput, procDefinitionId)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessListDemoPage.prototype.addProcessInstanceId = function (procInstanceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.processInstanceInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.clearSendKeys(this.processInstanceInput, procInstanceId)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ProcessListDemoPage;
}());
exports.ProcessListDemoPage = ProcessListDemoPage;
//# sourceMappingURL=processListDemoPage.js.map