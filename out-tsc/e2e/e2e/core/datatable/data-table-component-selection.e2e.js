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
var protractor_1 = require("protractor");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var js_api_1 = require("@alfresco/js-api");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
describe('Datatable component - selection', function () {
    var dataTablePage = new dataTablePage_1.DataTablePage();
    var loginPage = new adf_testing_1.LoginPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var dataTableComponent = new adf_testing_2.DataTableComponentPage();
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
                    return [4 /*yield*/, navigationBarPage.navigateToDatatable()];
                case 4:
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
    it('[C213258] Should be possible change the selection modes when change the selectionMode property', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, dataTablePage.selectRow('2')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, dataTableComponent.checkRowIsSelected('Id', '2')];
                case 2:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, dataTablePage.getNumberOfSelectedRows()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual(1)];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, dataTablePage.selectRow('3')];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, dataTableComponent.checkRowIsSelected('Id', '3')];
                case 6:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, dataTablePage.getNumberOfSelectedRows()];
                case 7: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(1)];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, dataTablePage.selectSelectionMode('Multiple')];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, dataTablePage.selectRow('1')];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, dataTableComponent.checkRowIsSelected('Id', '1')];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, dataTablePage.selectRowWithKeyboard('3')];
                case 12:
                    _c.sent();
                    return [4 /*yield*/, dataTableComponent.checkRowIsSelected('Id', '1')];
                case 13:
                    _c.sent();
                    return [4 /*yield*/, dataTableComponent.checkRowIsSelected('Id', '3')];
                case 14:
                    _c.sent();
                    return [4 /*yield*/, dataTablePage.checkRowIsNotSelected('2')];
                case 15:
                    _c.sent();
                    return [4 /*yield*/, dataTablePage.checkRowIsNotSelected('4')];
                case 16:
                    _c.sent();
                    return [4 /*yield*/, dataTablePage.selectSelectionMode('None')];
                case 17:
                    _c.sent();
                    return [4 /*yield*/, dataTablePage.selectRow('1')];
                case 18:
                    _c.sent();
                    return [4 /*yield*/, dataTablePage.checkNoRowIsSelected()];
                case 19:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260059] Should be possible select multiple row when multiselect is true', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dataTablePage.clickMultiSelect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.clickCheckbox('1')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.checkRowIsChecked('1')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.clickCheckbox('3')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.checkRowIsChecked('3')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.checkRowIsNotChecked('2')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.checkRowIsNotChecked('4')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.clickCheckbox('3')];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.checkRowIsNotChecked('3')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.checkRowIsChecked('1')];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260058] Should be possible select all the rows when multiselect is true', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dataTablePage.checkAllRows()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.checkRowIsChecked('1')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.checkRowIsChecked('2')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.checkRowIsChecked('3')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.checkRowIsChecked('4')];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277262] Should be possible reset the selected row when click on the reset button', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dataTablePage.checkRowIsChecked('1')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.checkRowIsChecked('2')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.checkRowIsChecked('3')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.checkRowIsChecked('4')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.clickReset()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, dataTablePage.checkNoRowIsSelected()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=data-table-component-selection.e2e.js.map