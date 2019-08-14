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
var startProcessPage_1 = require("./startProcessPage");
var adf_testing_1 = require("@alfresco/adf-testing");
var adf_testing_2 = require("@alfresco/adf-testing");
var ProcessFiltersPage = /** @class */ (function () {
    function ProcessFiltersPage() {
        this.dataTable = new adf_testing_1.DataTableComponentPage();
        this.runningFilter = protractor_1.element(protractor_1.by.css('span[data-automation-id="Running_filter"]'));
        this.completedFilter = protractor_1.element(protractor_1.by.css('div[class="mat-list-text"] > span[data-automation-id="Completed_filter"]'));
        this.allFilter = protractor_1.element(protractor_1.by.css('span[data-automation-id="All_filter"]'));
        this.createProcessButton = protractor_1.element(protractor_1.by.css('.adf-processes-menu button[data-automation-id="create-button"] > span'));
        this.newProcessButton = protractor_1.element(protractor_1.by.css('div > button[data-automation-id="btn-start-process"]'));
        this.processesPage = protractor_1.element(protractor_1.by.css('div[class="adf-grid"] > div[class="adf-grid-item adf-processes-menu"]'));
        this.accordionMenu = protractor_1.element(protractor_1.by.css('.adf-processes-menu mat-accordion'));
        this.buttonWindow = protractor_1.element(protractor_1.by.css('div > button[data-automation-id="btn-start-process"] > div'));
        this.noContentMessage = protractor_1.element.all(protractor_1.by.css('div[class="adf-empty-content__title"]')).first();
        this.rows = protractor_1.by.css('adf-process-instance-list div[class="adf-datatable-body"] div[class*="adf-datatable-row"]');
        this.tableBody = protractor_1.element.all(protractor_1.by.css('adf-datatable div[class="adf-datatable-body"]')).first();
        this.nameColumn = protractor_1.by.css('div[class*="adf-datatable-body"] div[class*="adf-datatable-row"] div[title="Name"] span');
        this.processIcon = protractor_1.by.xpath('ancestor::div[@class="mat-list-item-content"]/mat-icon');
    }
    ProcessFiltersPage.prototype.startProcess = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickCreateProcessButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.clickNewProcessDropdown()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, new startProcessPage_1.StartProcessPage()];
                }
            });
        });
    };
    ProcessFiltersPage.prototype.clickRunningFilterButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.runningFilter)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessFiltersPage.prototype.clickCompletedFilterButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.completedFilter)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, this.completedFilter.isEnabled()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessFiltersPage.prototype.clickAllFilterButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.allFilter)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, this.allFilter.isEnabled()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessFiltersPage.prototype.clickCreateProcessButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.accordionMenu)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.processesPage)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.createProcessButton)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessFiltersPage.prototype.clickNewProcessDropdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.buttonWindow)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.newProcessButton)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessFiltersPage.prototype.checkNoContentMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.noContentMessage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessFiltersPage.prototype.selectFromProcessList = function (title) {
        return __awaiter(this, void 0, void 0, function () {
            var processName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        processName = protractor_1.element.all(protractor_1.by.css("div[data-automation-id=\"text_" + title + "\"]")).first();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(processName)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessFiltersPage.prototype.checkFilterIsHighlighted = function (filterName) {
        return __awaiter(this, void 0, void 0, function () {
            var processNameHighlighted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        processNameHighlighted = protractor_1.element(protractor_1.by.css("mat-list-item.adf-active span[data-automation-id='" + filterName + "_filter']"));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(processNameHighlighted)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessFiltersPage.prototype.numberOfProcessRows = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.element.all(this.rows).count()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProcessFiltersPage.prototype.waitForTableBody = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.tableBody)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *  Sort the list by name column.
     *
     * @param sortOrder : 'ASC' to sort the list ascendant and 'DESC' for descendant
     */
    ProcessFiltersPage.prototype.sortByName = function (sortOrder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.sortByColumn(sortOrder, 'name')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessFiltersPage.prototype.getAllRowsNameColumn = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.getAllRowsColumnValues('Name')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProcessFiltersPage.prototype.checkFilterIsDisplayed = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var filterName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filterName = protractor_1.element(protractor_1.by.css("span[data-automation-id='" + name + "_filter']"));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(filterName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessFiltersPage.prototype.checkFilterHasNoIcon = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var filterName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filterName = protractor_1.element(protractor_1.by.css("span[data-automation-id='" + name + "_filter']"));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(filterName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(filterName.element(this.processIcon))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessFiltersPage.prototype.getFilterIcon = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var filterName, icon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filterName = protractor_1.element(protractor_1.by.css("span[data-automation-id='" + name + "_filter']"));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(filterName)];
                    case 1:
                        _a.sent();
                        icon = filterName.element(this.processIcon);
                        return [4 /*yield*/, adf_testing_2.BrowserActions.getText(icon)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProcessFiltersPage.prototype.checkFilterIsNotDisplayed = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var filterName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filterName = protractor_1.element(protractor_1.by.css("span[data-automation-id='" + name + "_filter']"));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(filterName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessFiltersPage.prototype.checkProcessesSortedByNameAsc = function () {
        return __awaiter(this, void 0, void 0, function () {
            var list, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllRowsNameColumn()];
                    case 1:
                        list = _a.sent();
                        i = 1;
                        _a.label = 2;
                    case 2:
                        if (!(i < list.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, expect(JSON.stringify(list[i]) > JSON.stringify(list[i - 1])).toEqual(true)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProcessFiltersPage.prototype.checkProcessesSortedByNameDesc = function () {
        return __awaiter(this, void 0, void 0, function () {
            var list, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllRowsNameColumn()];
                    case 1:
                        list = _a.sent();
                        i = 1;
                        _a.label = 2;
                    case 2:
                        if (!(i < list.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, expect(JSON.stringify(list[i]) < JSON.stringify(list[i - 1])).toEqual(true)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return ProcessFiltersPage;
}());
exports.ProcessFiltersPage = ProcessFiltersPage;
//# sourceMappingURL=processFiltersPage.js.map