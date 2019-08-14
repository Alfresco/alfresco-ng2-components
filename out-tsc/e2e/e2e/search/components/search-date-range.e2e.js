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
var searchDialog_1 = require("../../pages/adf/dialog/searchDialog");
var adf_testing_2 = require("@alfresco/adf-testing");
var searchResultsPage_1 = require("../../pages/adf/searchResultsPage");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var searchFiltersPage_1 = require("../../pages/adf/searchFiltersPage");
var search_config_1 = require("../search.config");
var js_api_1 = require("@alfresco/js-api");
var protractor_1 = require("protractor");
describe('Search Date Range Filter', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var searchDialog = new searchDialog_1.SearchDialog();
    var searchFilters = new searchFiltersPage_1.SearchFiltersPage();
    var dateRangeFilter = searchFilters.createdDateRangeFilterPage();
    var searchResults = new searchResultsPage_1.SearchResultsPage();
    var datePicker = new adf_testing_1.DatePickerPage();
    var navigationBar = new navigationBarPage_1.NavigationBarPage();
    var dataTable = new adf_testing_2.DataTableComponentPage();
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'ECM',
                        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
                    });
                    return [4 /*yield*/, loginPage.loginToContentServices(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter('*')];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchFilters.checkCreatedRangeFilterIsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchFilters.clickCreatedRangeFilterHeader()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchFilters.checkCreatedRangeFilterIsExpanded()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.refresh()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277106] Should display default values for Date Range widget', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dateRangeFilter.checkFromFieldIsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.checkFromDateToggleIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.checkToFieldIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.checkToDateToggleIsDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.checkApplyButtonIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.checkApplyButtonIsDisabled()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.checkClearButtonIsDisplayed()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277104] Should be able to set dates using date pickers', function () { return __awaiter(_this, void 0, void 0, function () {
        var fromDatePicker, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, dateRangeFilter.checkFromDateToggleIsDisplayed()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, dateRangeFilter.openFromDatePicker()];
                case 2:
                    fromDatePicker = _d.sent();
                    return [4 /*yield*/, fromDatePicker.selectTodayDate()];
                case 3:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, dateRangeFilter.getFromDate()];
                case 4:
                    _c = (_a = _b.apply(void 0, [_d.sent()])).toEqual;
                    return [4 /*yield*/, dateRangeFilter.getFromCalendarSelectedDate()];
                case 5: return [4 /*yield*/, _c.apply(_a, [_d.sent()])];
                case 6:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277105] Should be able to type a date', function () { return __awaiter(_this, void 0, void 0, function () {
        var date, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    date = '01-May-18';
                    return [4 /*yield*/, dateRangeFilter.putFromDate(date)];
                case 1:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, dateRangeFilter.getFromCalendarSelectedDate()];
                case 2:
                    _c = (_a = _b.apply(void 0, [_d.sent()])).toEqual;
                    return [4 /*yield*/, dateRangeFilter.getFromDate()];
                case 3: return [4 /*yield*/, _c.apply(_a, [_d.sent()])];
                case 4:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277119] FROM and TO dates should depend on each other', function () { return __awaiter(_this, void 0, void 0, function () {
        var fromDatePicker, datePickerTo, datePickerFrom;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dateRangeFilter.checkFromDateToggleIsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.openFromDatePicker()];
                case 2:
                    fromDatePicker = _a.sent();
                    return [4 /*yield*/, fromDatePicker.checkDatesAfterDateAreDisabled(new Date())];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, fromDatePicker.closeDatePicker()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.checkToDateToggleIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.openToDatePicker()];
                case 6:
                    datePickerTo = _a.sent();
                    return [4 /*yield*/, datePickerTo.checkDatesAfterDateAreDisabled(new Date())];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, datePickerTo.closeDatePicker()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.checkFromDateToggleIsDisplayed()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.openFromDatePicker()];
                case 10:
                    datePickerFrom = _a.sent();
                    return [4 /*yield*/, datePickerFrom.selectTodayDate()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, datePickerFrom.checkDatePickerIsNotDisplayed()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.checkToDateToggleIsDisplayed()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.openToDatePicker()];
                case 14:
                    datePickerTo = _a.sent();
                    return [4 /*yield*/, datePickerTo.checkDatesBeforeDateAreDisabled(new Date())];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, datePickerTo.checkDatesAfterDateAreDisabled(new Date())];
                case 16:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277107] Should be able to apply a date range', function () { return __awaiter(_this, void 0, void 0, function () {
        var datePickerToday, fromDate, toDatePicker, toDate, results, _i, results_1, currentResult, currentDate, currentDateFormatted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dateRangeFilter.checkFromDateToggleIsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.openFromDatePicker()];
                case 2:
                    datePickerToday = _a.sent();
                    return [4 /*yield*/, datePickerToday.selectTodayDate()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, datePickerToday.checkDatePickerIsNotDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.getFromDate()];
                case 5:
                    fromDate = _a.sent();
                    fromDate = adf_testing_1.DateUtil.formatDate('DD-MM-YY', adf_testing_1.DateUtil.parse(fromDate, 'DD-MMM-YY'));
                    return [4 /*yield*/, dateRangeFilter.checkApplyButtonIsDisabled()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.checkToDateToggleIsDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.openToDatePicker()];
                case 8:
                    toDatePicker = _a.sent();
                    return [4 /*yield*/, toDatePicker.selectTodayDate()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, toDatePicker.checkDatePickerIsNotDisplayed()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.getToDate()];
                case 11:
                    toDate = _a.sent();
                    toDate = adf_testing_1.DateUtil.formatDate('DD-MM-YY', adf_testing_1.DateUtil.parse(toDate, 'DD-MMM-YY'), 1);
                    return [4 /*yield*/, dateRangeFilter.checkApplyButtonIsEnabled()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.clickApplyButton()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, searchResults.sortByCreated('ASC')];
                case 14:
                    _a.sent();
                    results = dataTable.geCellElementDetail('Created');
                    _i = 0, results_1 = results;
                    _a.label = 15;
                case 15:
                    if (!(_i < results_1.length)) return [3 /*break*/, 19];
                    currentResult = results_1[_i];
                    currentDate = currentResult.getAttribute('title');
                    currentDateFormatted = adf_testing_1.DateUtil.parse(currentDate, 'MMM DD, YYYY, h:mm:ss a');
                    return [4 /*yield*/, expect(currentDateFormatted <= adf_testing_1.DateUtil.parse(toDate, 'DD-MM-YY')).toBe(true)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, expect(currentDateFormatted >= adf_testing_1.DateUtil.parse(fromDate, 'DD-MM-YY')).toBe(true)];
                case 17:
                    _a.sent();
                    _a.label = 18;
                case 18:
                    _i++;
                    return [3 /*break*/, 15];
                case 19: return [2 /*return*/];
            }
        });
    }); });
    it('[C277108] Should display a warning message when user doesn\'t set the date range at all', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dateRangeFilter.checkFromFieldIsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.clickFromField()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.clickToField()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.checkFromErrorMessageIsDisplayed('Required value')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.clickFromField()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.checkToErrorMessageIsDisplayed('Required value')];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277114] Should display warning message if user doesn\'t set the date range properly', function () { return __awaiter(_this, void 0, void 0, function () {
        var toDate, fromDate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    toDate = '01-May-18';
                    fromDate = '16-May-18';
                    return [4 /*yield*/, dateRangeFilter.checkToFieldIsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.putToDate(toDate)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.checkFromFieldIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.putFromDate(fromDate)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.clickFromField()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.checkToErrorMessageIsDisplayed('No days selected.')];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277115] Should display warning message if user types a date later than today\'s date', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dateRangeFilter.checkFromFieldIsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.putFromDate(adf_testing_1.DateUtil.formatDate('DD-MMM-YY', new Date(), 1))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.checkFromErrorMessageIsDisplayed('The date is beyond the maximum date.')];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277108] Should display a warning message when user doesn\'t set the date range at all', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dateRangeFilter.checkFromFieldIsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.putFromDate('Wrong Format')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.clickToField()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.checkFromErrorMessageIsDisplayed('Invalid date. The date must be in the format \'DD-MMM-YY\'')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.putFromDate('01-May-18')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, dateRangeFilter.checkFromErrorMessageIsNotDisplayed()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('configuration change', function () {
        var jsonFile;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                jsonFile = search_config_1.SearchConfiguration.getConfiguration();
                return [2 /*return*/];
            });
        }); });
        it('[C277117] Should be able to change date format', function () { return __awaiter(_this, void 0, void 0, function () {
            var todayDate, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, navigationBar.clickContentServicesButton()];
                    case 1:
                        _b.sent();
                        jsonFile.categories[4].component.settings.dateFormat = 'MM-DD-YY';
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter('*')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, searchFilters.checkCreatedRangeFilterIsDisplayed()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, searchFilters.clickCreatedRangeFilterHeader()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, searchFilters.checkCreatedRangeFilterIsExpanded()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, dateRangeFilter.checkFromFieldIsDisplayed()];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, dateRangeFilter.openFromDatePicker()];
                    case 9:
                        _b.sent();
                        todayDate = adf_testing_1.DateUtil.formatDate('MM-DD-YY');
                        return [4 /*yield*/, datePicker.selectTodayDate()];
                    case 10:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, dateRangeFilter.getFromDate()];
                    case 11: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(todayDate)];
                    case 12:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=search-date-range.e2e.js.map