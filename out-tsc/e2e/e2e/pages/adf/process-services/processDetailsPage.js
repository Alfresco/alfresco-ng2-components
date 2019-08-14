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
var ProcessDetailsPage = /** @class */ (function () {
    function ProcessDetailsPage() {
        // Process Details
        this.processTitle = protractor_1.element(protractor_1.by.css('mat-card-title[class="mat-card-title"]'));
        this.processDetailsMessage = protractor_1.element(protractor_1.by.css('adf-process-instance-details div[class="ng-star-inserted"]'));
        this.processStatusField = protractor_1.element(protractor_1.by.css('span[data-automation-id="card-textitem-value-status"]'));
        this.processEndDateField = protractor_1.element(protractor_1.by.css('span[data-automation-id="card-dateitem-ended"]'));
        this.processCategoryField = protractor_1.element(protractor_1.by.css('span[data-automation-id="card-textitem-value-category"]'));
        this.processBusinessKeyField = protractor_1.element(protractor_1.by.css('span[data-automation-id="card-textitem-value-businessKey"]'));
        this.processCreatedByField = protractor_1.element(protractor_1.by.css('span[data-automation-id="card-textitem-value-assignee"]'));
        this.processCreatedField = protractor_1.element(protractor_1.by.css('span[data-automation-id="card-dateitem-created"]'));
        this.processIdField = protractor_1.element(protractor_1.by.css('span[data-automation-id="card-textitem-value-id"]'));
        this.processDescription = protractor_1.element(protractor_1.by.css('span[data-automation-id="card-textitem-value-description"]'));
        this.showDiagramButtonDisabled = protractor_1.element(protractor_1.by.css('button[id="show-diagram-button"][disabled]'));
        this.propertiesList = protractor_1.element(protractor_1.by.css('div[class="adf-property-list"]'));
        // Show Diagram
        this.showDiagramButton = protractor_1.element(protractor_1.by.id('show-diagram-button'));
        this.diagramCanvas = protractor_1.element(protractor_1.by.css('svg[xmlns="http://www.w3.org/2000/svg"]'));
        this.backButton = protractor_1.element(protractor_1.by.css('app-show-diagram button[class="mat-mini-fab mat-accent"]'));
        // Comments
        this.commentInput = protractor_1.element(protractor_1.by.id('comment-input'));
        // Audit Log
        this.auditLogButton = protractor_1.element(protractor_1.by.css('button[adf-process-audit]'));
        // Cancel Process button
        this.cancelProcessButton = protractor_1.element(protractor_1.by.css('div[data-automation-id="header-status"] > button'));
        // Tasks
        this.activeTask = protractor_1.element(protractor_1.by.css('div[data-automation-id="active-tasks"]'));
        this.startForm = protractor_1.element(protractor_1.by.css('div[data-automation-id="start-form"]'));
        this.completedTask = protractor_1.element(protractor_1.by.css('div[data-automation-id="completed-tasks"]'));
        this.taskTitle = protractor_1.element(protractor_1.by.css('h2[class="adf-activiti-task-details__header"]'));
    }
    ProcessDetailsPage.prototype.checkDetailsAreDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.processStatusField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.processEndDateField)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.processCategoryField)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.processBusinessKeyField)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.processCreatedByField)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.processCreatedField)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.processIdField)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.processDescription)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.showDiagramButton)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.activeTask)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.cancelProcessButton)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.commentInput)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.auditLogButton)];
                    case 13:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessDetailsPage.prototype.checkProcessTitleIsDisplayed = function () {
        return adf_testing_1.BrowserActions.getText(this.processTitle);
    };
    ProcessDetailsPage.prototype.checkProcessDetailsMessage = function () {
        return adf_testing_1.BrowserActions.getText(this.processDetailsMessage);
    };
    ProcessDetailsPage.prototype.getProcessStatus = function () {
        return adf_testing_1.BrowserActions.getText(this.processStatusField);
    };
    ProcessDetailsPage.prototype.getEndDate = function () {
        return adf_testing_1.BrowserActions.getText(this.processEndDateField);
    };
    ProcessDetailsPage.prototype.getProcessCategory = function () {
        return adf_testing_1.BrowserActions.getText(this.processCategoryField);
    };
    ProcessDetailsPage.prototype.getBusinessKey = function () {
        return adf_testing_1.BrowserActions.getText(this.processBusinessKeyField);
    };
    ProcessDetailsPage.prototype.getCreatedBy = function () {
        return adf_testing_1.BrowserActions.getText(this.processCreatedByField);
    };
    ProcessDetailsPage.prototype.getCreated = function () {
        return adf_testing_1.BrowserActions.getText(this.processCreatedField);
    };
    ProcessDetailsPage.prototype.getId = function () {
        return adf_testing_1.BrowserActions.getText(this.processIdField);
    };
    ProcessDetailsPage.prototype.getProcessDescription = function () {
        return adf_testing_1.BrowserActions.getText(this.processDescription);
    };
    ProcessDetailsPage.prototype.clickShowDiagram = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.showDiagramButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.diagramCanvas)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.backButton)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessDetailsPage.prototype.checkShowDiagramIsDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.showDiagramButtonDisabled)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessDetailsPage.prototype.addComment = function (comment) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.commentInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.commentInput.sendKeys(comment)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.commentInput.sendKeys(protractor_1.protractor.Key.ENTER)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessDetailsPage.prototype.checkCommentIsDisplayed = function (comment) {
        return __awaiter(this, void 0, void 0, function () {
            var commentInserted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        commentInserted = protractor_1.element(protractor_1.by.cssContainingText('div[id="comment-message"]', comment));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(commentInserted)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessDetailsPage.prototype.clickAuditLogButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.auditLogButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessDetailsPage.prototype.clickCancelProcessButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.cancelProcessButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessDetailsPage.prototype.clickOnActiveTask = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.activeTask)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessDetailsPage.prototype.clickOnStartForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.startForm)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessDetailsPage.prototype.clickOnCompletedTask = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.completedTask)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessDetailsPage.prototype.checkActiveTaskTitleIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.taskTitle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessDetailsPage.prototype.checkProcessDetailsCard = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.propertiesList)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ProcessDetailsPage;
}());
exports.ProcessDetailsPage = ProcessDetailsPage;
//# sourceMappingURL=processDetailsPage.js.map