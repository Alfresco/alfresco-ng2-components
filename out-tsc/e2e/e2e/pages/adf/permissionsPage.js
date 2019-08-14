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
var column = {
    role: 'Role'
};
var PermissionsPage = /** @class */ (function () {
    function PermissionsPage() {
        this.dataTableComponentPage = new adf_testing_1.DataTableComponentPage();
        this.addPermissionButton = protractor_1.element(protractor_1.by.css("button[data-automation-id='adf-add-permission-button']"));
        this.addPermissionDialog = protractor_1.element(protractor_1.by.css('adf-add-permission-dialog'));
        this.searchUserInput = protractor_1.element(protractor_1.by.id('searchInput'));
        this.searchResults = protractor_1.element(protractor_1.by.css('#adf-add-permission-authority-results #adf-search-results-content'));
        this.addButton = protractor_1.element(protractor_1.by.id('add-permission-dialog-confirm-button'));
        this.permissionInheritedButton = protractor_1.element.all(protractor_1.by.css("div[class='adf-inherit_permission_button'] button")).first();
        this.noPermissions = protractor_1.element(protractor_1.by.css('div[id="adf-no-permissions-template"]'));
        this.assignPermissionError = protractor_1.element(protractor_1.by.css('simple-snack-bar'));
        this.deletePermissionButton = protractor_1.element(protractor_1.by.css("button[data-automation-id='adf-delete-permission-button']"));
        this.permissionDisplayContainer = protractor_1.element(protractor_1.by.css("div[id='adf-permission-display-container']"));
        this.closeButton = protractor_1.element(protractor_1.by.id('add-permission-dialog-close-button'));
    }
    PermissionsPage.prototype.clickCloseButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.closeButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.checkAddPermissionButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.addPermissionButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.clickAddPermissionButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.clickExecuteScript('button[data-automation-id="adf-add-permission-button"]')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.checkAddPermissionDialogIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.addPermissionDialog)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.checkSearchUserInputIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.searchUserInput)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.searchUserOrGroup = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.clearSendKeys(this.searchUserInput, name)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.checkResultListIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.searchResults)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.clickUserOrGroup = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var userOrGroupName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userOrGroupName = protractor_1.element(protractor_1.by.cssContainingText('mat-list-option .mat-list-text', name));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(userOrGroupName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.addButton)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.checkUserOrGroupIsAdded = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var userOrGroupName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userOrGroupName = protractor_1.element(protractor_1.by.css('div[data-automation-id="text_' + name + '"]'));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(userOrGroupName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.checkUserOrGroupIsDeleted = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var userOrGroupName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userOrGroupName = protractor_1.element(protractor_1.by.css('div[data-automation-id="text_' + name + '"]'));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(userOrGroupName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.checkPermissionInheritedButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.permissionInheritedButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.clickPermissionInheritedButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.permissionInheritedButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.clickDeletePermissionButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.deletePermissionButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.checkNoPermissionsIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.noPermissions)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.getPermissionInheritedButtonText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.getText(this.permissionInheritedButton)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PermissionsPage.prototype.checkPermissionsDatatableIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element(protractor_1.by.css('[class*="adf-datatable-permission"]')))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.getRoleCellValue = function (rowName) {
        return __awaiter(this, void 0, void 0, function () {
            var locator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        locator = this.dataTableComponentPage.getCellByRowContentAndColumn('Authority ID', rowName, column.role);
                        return [4 /*yield*/, adf_testing_2.BrowserActions.getText(locator)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PermissionsPage.prototype.clickRoleDropdownByUserOrGroupName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = this.dataTableComponentPage.getRow('Authority ID', name);
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(row.element(protractor_1.by.id('adf-select-role-permission')))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.getRoleDropdownOptions = function () {
        return protractor_1.element.all(protractor_1.by.css('.mat-option-text'));
    };
    PermissionsPage.prototype.selectOption = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var selectProcessDropdown;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectProcessDropdown = protractor_1.element(protractor_1.by.cssContainingText('.mat-option-text', name));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(selectProcessDropdown)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.getAssignPermissionErrorText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.getText(this.assignPermissionError)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PermissionsPage.prototype.checkPermissionContainerIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.permissionDisplayContainer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PermissionsPage.prototype.checkUserOrGroupIsDisplayed = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var userOrGroupName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userOrGroupName = protractor_1.element(protractor_1.by.cssContainingText('mat-list-option .mat-list-text', name));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(userOrGroupName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PermissionsPage;
}());
exports.PermissionsPage = PermissionsPage;
//# sourceMappingURL=permissionsPage.js.map