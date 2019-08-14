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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var adf_testing_1 = require("@alfresco/adf-testing");
var dataTablePage_1 = require("../../pages/adf/demo-shell/dataTablePage");
var adf_testing_2 = require("@alfresco/adf-testing");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var protractor_1 = require("protractor");
var js_api_1 = require("@alfresco/js-api");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var drop_actions_1 = require("../../actions/drop.actions");
var resources = require("../../util/resources");
var fileModel_1 = require("../../models/ACS/fileModel");
describe('Datatable component', function () {
    var dataTablePage = new dataTablePage_1.DataTablePage('defaultTable');
    var copyContentDataTablePage = new dataTablePage_1.DataTablePage('copyClipboardDataTable');
    var dragAndDropDataTablePage = new dataTablePage_1.DataTablePage();
    var loginPage = new adf_testing_1.LoginPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var dataTableComponent = new adf_testing_2.DataTableComponentPage();
    var notificationHistoryPage = new adf_testing_1.NotificationHistoryPage();
    var dragAndDrop = new drop_actions_1.DropActions();
    var pngFile = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'ECM',
                        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
                    });
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Datatable component', function () {
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.navigateToDatatable()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dataTablePage.dataTable.waitForTableBody()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataTablePage.clickReset()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C91314] Should be possible add new row to the table', function () { return __awaiter(_this, void 0, void 0, function () {
            var result, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTableComponent.numberOfRows()];
                    case 1:
                        result = _c.sent();
                        return [4 /*yield*/, dataTablePage.addRow()];
                    case 2:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTableComponent.numberOfRows()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual(result + 1)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, dataTablePage.addRow()];
                    case 5:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTableComponent.numberOfRows()];
                    case 6: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(result + 2)];
                    case 7:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260039] Should be possible replace rows', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataTablePage.replaceRows(1)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260041] Should be possible replace columns', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataTablePage.replaceColumns()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277314] Should filter the table rows when the input filter is passed', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, dataTablePage.replaceRows(1)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, dataTablePage.replaceColumns()];
                    case 2:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTableComponent.numberOfRows()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toEqual(4)];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, dataTablePage.insertFilter('Name')];
                    case 5:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTableComponent.numberOfRows()];
                    case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual(3)];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, dataTablePage.insertFilter('I')];
                    case 8:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, dataTableComponent.numberOfRows()];
                    case 9: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toEqual(1)];
                    case 10:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Datatable component - copyContent', function () {
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.navigateToCopyContentDatatable()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dataTablePage.dataTable.waitForTableBody()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307037] A tooltip is displayed when mouseOver a column with copyContent set to true', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, dataTablePage.mouseOverIdColumn('1')];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTablePage.getCopyContentTooltip()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('Click to copy')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, dataTablePage.mouseOverNameColumn('Name 2')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, dataTablePage.dataTable.copyContentTooltipIsNotDisplayed()];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307045] No tooltip is displayed when hover over a column with copyContent set to false', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataTablePage.mouseOverNameColumn('Name 2')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dataTablePage.dataTable.copyContentTooltipIsNotDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dataTablePage.clickOnNameColumn('Name 2')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyNotContains('Name 2')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307046] No tooltip is displayed when hover over a column that has default value for copyContent property', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataTablePage.mouseOverCreatedByColumn('Created One')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dataTablePage.dataTable.copyContentTooltipIsNotDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dataTablePage.clickOnCreatedByColumn('Created One')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyNotContains('Created One')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307040] A column value with copyContent set to true is copied when clicking on it', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTablePage.mouseOverIdColumn('1')];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTablePage.getCopyContentTooltip()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual('Click to copy')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, dataTablePage.clickOnIdColumn('1')];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('Text copied to clipboard')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, dataTablePage.clickOnIdColumn('2')];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('Text copied to clipboard')];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, dataTablePage.pasteClipboard()];
                    case 8:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTablePage.getClipboardInputText()];
                    case 9: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual('2')];
                    case 10:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307072] A tooltip is displayed when mouseOver a column with copyContent set to true', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, copyContentDataTablePage.mouseOverIdColumn('1')];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, copyContentDataTablePage.getCopyContentTooltip()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('Click to copy')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, copyContentDataTablePage.mouseOverNameColumn('First')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, copyContentDataTablePage.dataTable.copyContentTooltipIsNotDisplayed()];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307074] No tooltip is displayed when hover over a column with copyContent set to false', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, copyContentDataTablePage.mouseOverNameColumn('Second')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, copyContentDataTablePage.dataTable.copyContentTooltipIsNotDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, copyContentDataTablePage.clickOnNameColumn('Second')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyNotContains('Second')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307075] No tooltip is displayed when hover over a column that has default value for copyContent property', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, copyContentDataTablePage.mouseOverCreatedByColumn('Created one')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, copyContentDataTablePage.dataTable.copyContentTooltipIsNotDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, copyContentDataTablePage.clickOnCreatedByColumn('Created one')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyNotContains('Created One')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307073] A column value with copyContent set to true is copied when clicking on it', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, copyContentDataTablePage.mouseOverIdColumn('1')];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, copyContentDataTablePage.getCopyContentTooltip()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual('Click to copy')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, copyContentDataTablePage.clickOnIdColumn('1')];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('Text copied to clipboard')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, copyContentDataTablePage.clickOnIdColumn('2')];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('Text copied to clipboard')];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, copyContentDataTablePage.pasteClipboard()];
                    case 8:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, copyContentDataTablePage.getClipboardInputText()];
                    case 9: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual('2')];
                    case 10:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307100] A column value of type text and with copyContent set to true is copied when clicking on it', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, dataTablePage.mouseOverIdColumn('1')];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, dataTablePage.getCopyContentTooltip()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual('Click to copy')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, dataTablePage.clickOnIdColumn('1')];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('Text copied to clipboard')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, dataTablePage.pasteClipboard()];
                    case 6:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, dataTablePage.getClipboardInputText()];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual('1')];
                    case 8:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307101] A column value of type json and with copyContent set to true is copied when clicking on it', function () { return __awaiter(_this, void 0, void 0, function () {
            var jsonValue, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        jsonValue = "{   \"id\": 4 }";
                        return [4 /*yield*/, copyContentDataTablePage.mouseOverJsonColumn(2)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, copyContentDataTablePage.getCopyContentTooltip()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual('Click to copy')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, copyContentDataTablePage.clickOnJsonColumn(2)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('Text copied to clipboard')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, copyContentDataTablePage.pasteClipboard()];
                    case 6:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, copyContentDataTablePage.getClipboardInputText()];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toContain(jsonValue)];
                    case 8:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.clickHomeButton()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Datatable component - Drag and Drop', function () {
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.navigateToDragAndDropDatatable()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dragAndDropDataTablePage.dataTable.waitForTableBody()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307984] Should trigger the event handling header-drop and cell-drop', function () { return __awaiter(_this, void 0, void 0, function () {
            var dragAndDropHeader, dragAndDropCell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dragAndDropHeader = dragAndDropDataTablePage.getDropTargetIdColumnHeader();
                        return [4 /*yield*/, dragAndDrop.dropFile(dragAndDropHeader, pngFile.location)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('Dropped data on [ id ] header')];
                    case 2:
                        _a.sent();
                        dragAndDropCell = dragAndDropDataTablePage.getDropTargetIdColumnCell(1);
                        return [4 /*yield*/, dragAndDrop.dropFile(dragAndDropCell, pngFile.location)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('Dropped data on [ id ] cell')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=data-table-component.e2e.js.map