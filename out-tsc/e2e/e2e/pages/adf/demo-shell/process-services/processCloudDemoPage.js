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
var adf_testing_2 = require("@alfresco/adf-testing");
var ProcessCloudDemoPage = /** @class */ (function () {
    function ProcessCloudDemoPage() {
        this.allProcesses = protractor_1.element(protractor_1.by.css('span[data-automation-id="all-processes_filter"]'));
        this.runningProcesses = protractor_1.element(protractor_1.by.css('span[data-automation-id="running-processes_filter"]'));
        this.completedProcesses = protractor_1.element(protractor_1.by.css('span[data-automation-id="completed-processes_filter"]'));
        this.activeFilter = protractor_1.element(protractor_1.by.css("mat-list-item[class*='active'] span"));
        this.processFilters = protractor_1.element(protractor_1.by.css("mat-expansion-panel[data-automation-id='Process Filters']"));
        this.processFiltersList = protractor_1.element(protractor_1.by.css('adf-cloud-process-filters'));
        this.createButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="create-button"'));
        this.newProcessButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="btn-start-process"]'));
        this.processListCloud = new adf_testing_2.ProcessListCloudComponentPage();
        this.editProcessFilterCloud = new adf_testing_2.EditProcessFilterCloudComponentPage();
    }
    ProcessCloudDemoPage.prototype.editProcessFilterCloudComponent = function () {
        return this.editProcessFilterCloud;
    };
    ProcessCloudDemoPage.prototype.processListCloudComponent = function () {
        return this.processListCloud;
    };
    ProcessCloudDemoPage.prototype.getAllRowsByIdColumn = function () {
        return this.processListCloud.getAllRowsByColumn('Id');
    };
    ProcessCloudDemoPage.prototype.allProcessesFilter = function () {
        return new adf_testing_2.ProcessFiltersCloudComponentPage(this.allProcesses);
    };
    ProcessCloudDemoPage.prototype.runningProcessesFilter = function () {
        return new adf_testing_2.ProcessFiltersCloudComponentPage(this.runningProcesses);
    };
    ProcessCloudDemoPage.prototype.completedProcessesFilter = function () {
        return new adf_testing_2.ProcessFiltersCloudComponentPage(this.completedProcesses);
    };
    ProcessCloudDemoPage.prototype.customProcessFilter = function (filterName) {
        return new adf_testing_2.ProcessFiltersCloudComponentPage(protractor_1.element(protractor_1.by.css("span[data-automation-id=\"" + filterName + "_filter\"]")));
    };
    ProcessCloudDemoPage.prototype.getActiveFilterName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.activeFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, adf_testing_2.BrowserActions.getText(this.activeFilter)];
                }
            });
        });
    };
    ProcessCloudDemoPage.prototype.clickOnProcessFilters = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.processFilters)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessCloudDemoPage.prototype.openNewProcessForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickOnCreateButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.newProcessButtonIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.newProcessButton)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessCloudDemoPage.prototype.newProcessButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.newProcessButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessCloudDemoPage.prototype.isProcessFiltersListVisible = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.processFiltersList)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessCloudDemoPage.prototype.clickOnCreateButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.createButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ProcessCloudDemoPage;
}());
exports.ProcessCloudDemoPage = ProcessCloudDemoPage;
//# sourceMappingURL=processCloudDemoPage.js.map