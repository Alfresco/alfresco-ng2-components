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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var app_config_service_1 = require("../app-config/app-config.service");
var user_preferences_service_1 = require("../services/user-preferences.service");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var DecimalNumberPipe = /** @class */ (function () {
    function DecimalNumberPipe(userPreferenceService, appConfig) {
        var _this = this;
        this.userPreferenceService = userPreferenceService;
        this.appConfig = appConfig;
        this.defaultLocale = DecimalNumberPipe_1.DEFAULT_LOCALE;
        this.defaultMinIntegerDigits = DecimalNumberPipe_1.DEFAULT_MIN_INTEGER_DIGITS;
        this.defaultMinFractionDigits = DecimalNumberPipe_1.DEFAULT_MIN_FRACTION_DIGITS;
        this.defaultMaxFractionDigits = DecimalNumberPipe_1.DEFAULT_MAX_FRACTION_DIGITS;
        this.onDestroy$ = new rxjs_1.Subject();
        if (this.userPreferenceService) {
            this.userPreferenceService.select(user_preferences_service_1.UserPreferenceValues.Locale)
                .pipe(operators_1.takeUntil(this.onDestroy$))
                .subscribe(function (locale) {
                if (locale) {
                    _this.defaultLocale = locale;
                }
            });
        }
        if (this.appConfig) {
            this.defaultMinIntegerDigits = this.appConfig.get('decimalValues.minIntegerDigits', DecimalNumberPipe_1.DEFAULT_MIN_INTEGER_DIGITS);
            this.defaultMinFractionDigits = this.appConfig.get('decimalValues.minFractionDigits', DecimalNumberPipe_1.DEFAULT_MIN_FRACTION_DIGITS);
            this.defaultMaxFractionDigits = this.appConfig.get('decimalValues.maxFractionDigits', DecimalNumberPipe_1.DEFAULT_MAX_FRACTION_DIGITS);
        }
    }
    DecimalNumberPipe_1 = DecimalNumberPipe;
    DecimalNumberPipe.prototype.transform = function (value, digitsInfo, locale) {
        var actualMinIntegerDigits = digitsInfo && digitsInfo.minIntegerDigits ? digitsInfo.minIntegerDigits : this.defaultMinIntegerDigits;
        var actualMinFractionDigits = digitsInfo && digitsInfo.minFractionDigits ? digitsInfo.minFractionDigits : this.defaultMinFractionDigits;
        var actualMaxFractionDigits = digitsInfo && digitsInfo.maxFractionDigits ? digitsInfo.maxFractionDigits : this.defaultMaxFractionDigits;
        var actualDigitsInfo = actualMinIntegerDigits + "." + actualMinFractionDigits + "-" + actualMaxFractionDigits;
        var actualLocale = locale || this.defaultLocale;
        var datePipe = new common_1.DecimalPipe(actualLocale);
        return datePipe.transform(value, actualDigitsInfo);
    };
    DecimalNumberPipe.prototype.ngOnDestroy = function () {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    };
    var DecimalNumberPipe_1;
    DecimalNumberPipe.DEFAULT_LOCALE = 'en-US';
    DecimalNumberPipe.DEFAULT_MIN_INTEGER_DIGITS = 1;
    DecimalNumberPipe.DEFAULT_MIN_FRACTION_DIGITS = 0;
    DecimalNumberPipe.DEFAULT_MAX_FRACTION_DIGITS = 2;
    DecimalNumberPipe = DecimalNumberPipe_1 = __decorate([
        core_1.Pipe({
            name: 'adfDecimalNumber',
            pure: false
        }),
        __metadata("design:paramtypes", [user_preferences_service_1.UserPreferencesService,
            app_config_service_1.AppConfigService])
    ], DecimalNumberPipe);
    return DecimalNumberPipe;
}());
exports.DecimalNumberPipe = DecimalNumberPipe;
//# sourceMappingURL=decimal-number.pipe.js.map