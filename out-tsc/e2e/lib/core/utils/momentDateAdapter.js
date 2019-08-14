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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var material_1 = require("@angular/material");
var moment_1 = require("moment");
var moment_es6_1 = require("moment-es6");
var MomentDateAdapter = /** @class */ (function (_super) {
    __extends(MomentDateAdapter, _super);
    function MomentDateAdapter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.localeData = moment_es6_1.default.localeData();
        return _this;
    }
    MomentDateAdapter.prototype.getYear = function (date) {
        return date.year();
    };
    MomentDateAdapter.prototype.getMonth = function (date) {
        return date.month();
    };
    MomentDateAdapter.prototype.getDate = function (date) {
        return date.date();
    };
    MomentDateAdapter.prototype.getDayOfWeek = function (date) {
        return date.day();
    };
    MomentDateAdapter.prototype.getMonthNames = function (style) {
        switch (style) {
            case 'long':
                return this.localeData.months();
            case 'short':
                return this.localeData.monthsShort();
            case 'narrow':
                return this.localeData.monthsShort().map(function (month) { return month[0]; });
            default:
                return;
        }
    };
    MomentDateAdapter.prototype.getDateNames = function () {
        var dateNames = [];
        for (var date = 1; date <= 31; date++) {
            dateNames.push(String(date));
        }
        return dateNames;
    };
    MomentDateAdapter.prototype.getDayOfWeekNames = function (style) {
        switch (style) {
            case 'long':
                return this.localeData.weekdays();
            case 'short':
                return this.localeData.weekdaysShort();
            case 'narrow':
                return this.localeData.weekdaysShort();
            default:
                return;
        }
    };
    MomentDateAdapter.prototype.getYearName = function (date) {
        return String(date.year());
    };
    MomentDateAdapter.prototype.getFirstDayOfWeek = function () {
        return this.localeData.firstDayOfWeek();
    };
    MomentDateAdapter.prototype.getNumDaysInMonth = function (date) {
        return date.daysInMonth();
    };
    MomentDateAdapter.prototype.clone = function (date) {
        var locale = this.locale || 'en';
        return date.clone().locale(locale);
    };
    MomentDateAdapter.prototype.createDate = function (year, month, date) {
        return moment_es6_1.default([year, month, date]);
    };
    MomentDateAdapter.prototype.today = function () {
        var locale = this.locale || 'en';
        return moment_es6_1.default().locale(locale);
    };
    MomentDateAdapter.prototype.parse = function (value, parseFormat) {
        var locale = this.locale || 'en';
        if (value && typeof value === 'string') {
            var m = moment_es6_1.default(value, parseFormat, locale, true);
            if (!m.isValid()) {
                // use strict parsing because Moment's parser is very forgiving, and this can lead to undesired behavior.
                m = moment_es6_1.default(value, this.overrideDisplayFormat, locale, true);
            }
            if (m.isValid()) {
                // if user omits year, it defaults to 2001, so check for that issue.
                if (m.year() === 2001 && value.indexOf('2001') === -1) {
                    // if 2001 not actually in the value string, change to current year
                    var currentYear = new Date().getFullYear();
                    m.set('year', currentYear);
                    // if date is in the future, set previous year
                    if (m.isAfter(moment_es6_1.default())) {
                        m.set('year', currentYear - 1);
                    }
                }
            }
            return m;
        }
        return value ? moment_es6_1.default(value).locale(locale) : null;
    };
    MomentDateAdapter.prototype.format = function (date, displayFormat) {
        date = this.clone(date);
        displayFormat = this.overrideDisplayFormat ? this.overrideDisplayFormat : displayFormat;
        if (date && date.format) {
            return date.format(displayFormat);
        }
        else {
            return '';
        }
    };
    MomentDateAdapter.prototype.addCalendarYears = function (date, years) {
        return date.clone().add(years, 'y');
    };
    MomentDateAdapter.prototype.addCalendarMonths = function (date, months) {
        return date.clone().add(months, 'M');
    };
    MomentDateAdapter.prototype.addCalendarDays = function (date, days) {
        return date.clone().add(days, 'd');
    };
    MomentDateAdapter.prototype.getISODateString = function (date) {
        return date.toISOString();
    };
    MomentDateAdapter.prototype.setLocale = function (locale) {
        _super.prototype.setLocale.call(this, locale);
        this.localeData = moment_es6_1.default.localeData(locale);
    };
    MomentDateAdapter.prototype.compareDate = function (first, second) {
        return first.diff(second, 'seconds', true);
    };
    MomentDateAdapter.prototype.sameDate = function (first, second) {
        if (first == null) {
            // same if both null
            return second == null;
        }
        else if (moment_1.isMoment(first)) {
            return first.isSame(second);
        }
        else {
            var isSame = _super.prototype.sameDate.call(this, first, second);
            return isSame;
        }
    };
    MomentDateAdapter.prototype.clampDate = function (date, min, max) {
        if (min && date.isBefore(min)) {
            return min;
        }
        else if (max && date.isAfter(max)) {
            return max;
        }
        else {
            return date;
        }
    };
    MomentDateAdapter.prototype.isDateInstance = function (date) {
        var isValidDateInstance = false;
        if (date) {
            isValidDateInstance = date._isAMomentObject;
        }
        return isValidDateInstance;
    };
    MomentDateAdapter.prototype.isValid = function (date) {
        return date.isValid();
    };
    MomentDateAdapter.prototype.toIso8601 = function (date) {
        return this.clone(date).format();
    };
    MomentDateAdapter.prototype.fromIso8601 = function (iso8601String) {
        var locale = this.locale || 'en';
        var d = moment_es6_1.default(iso8601String, moment_es6_1.default.ISO_8601).locale(locale);
        return this.isValid(d) ? d : null;
    };
    MomentDateAdapter.prototype.invalid = function () {
        return moment_es6_1.default.invalid();
    };
    return MomentDateAdapter;
}(material_1.DateAdapter));
exports.MomentDateAdapter = MomentDateAdapter;
//# sourceMappingURL=momentDateAdapter.js.map