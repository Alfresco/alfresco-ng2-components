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
var data_table_component_page_1 = require("../../core/pages/data-table-component.page");
var browser_visibility_1 = require("../../core/utils/browser-visibility");
var browser_actions_1 = require("../../core/utils/browser-actions");
var DocumentListPage = /** @class */ (function () {
    function DocumentListPage(rootElement) {
        if (rootElement === void 0) { rootElement = protractor_1.element.all(protractor_1.by.css('adf-document-list')).first(); }
        this.actionMenu = protractor_1.element(protractor_1.by.css('div[role="menu"]'));
        this.optionButton = protractor_1.by.css('button[data-automation-id*="action_menu_"]');
        this.rootElement = rootElement;
        this.dataTable = new data_table_component_page_1.DataTableComponentPage(this.rootElement);
        this.tableBody = rootElement.all(protractor_1.by.css('div[class="adf-datatable-body"]')).first();
    }
    DocumentListPage.prototype.checkLockedIcon = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var row, lockIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = this.dataTable.getRow('Display name', content);
                        lockIcon = row.element(protractor_1.by.cssContainingText('div[title="Lock"] mat-icon', 'lock'));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(lockIcon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DocumentListPage.prototype.checkUnlockedIcon = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var row, lockIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = this.dataTable.getRow('Display name', content);
                        lockIcon = row.element(protractor_1.by.cssContainingText('div[title="Lock"] mat-icon', 'lock_open'));
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(lockIcon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DocumentListPage.prototype.waitForTableBody = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.tableBody)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DocumentListPage.prototype.getTooltip = function (nodeName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.getTooltip('Display name', nodeName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DocumentListPage.prototype.selectRow = function (nodeName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.selectRow('Display name', nodeName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DocumentListPage.prototype.rightClickOnRow = function (nodeName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.rightClickOnRow('Display name', nodeName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DocumentListPage.prototype.clickOnActionMenu = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        row = this.dataTable.getRow('Display name', content);
                        return [4 /*yield*/, row.element(this.optionButton).click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.actionMenu)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(500)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DocumentListPage.prototype.checkActionMenuIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.actionMenu)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DocumentListPage.prototype.dataTablePage = function () {
        return new data_table_component_page_1.DataTableComponentPage(this.rootElement);
    };
    DocumentListPage.prototype.getAllRowsColumnValues = function (column) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.getAllRowsColumnValues(column)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DocumentListPage.prototype.doubleClickRow = function (nodeName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataTable.doubleClickRow('Display name', nodeName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DocumentListPage;
}());
exports.DocumentListPage = DocumentListPage;
//# sourceMappingURL=document-list.page.js.map