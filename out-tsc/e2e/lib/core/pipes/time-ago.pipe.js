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
var moment_es6_1 = require("moment-es6");
var core_1 = require("@angular/core");
var app_config_service_1 = require("../app-config/app-config.service");
var user_preferences_service_1 = require("../services/user-preferences.service");
var common_1 = require("@angular/common");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var TimeAgoPipe = /** @class */ (function () {
    function TimeAgoPipe(userPreferenceService, appConfig) {
        var _this = this;
        this.userPreferenceService = userPreferenceService;
        this.appConfig = appConfig;
        this.onDestroy$ = new rxjs_1.Subject();
        this.userPreferenceService
            .select(user_preferences_service_1.UserPreferenceValues.Locale)
            .pipe(operators_1.takeUntil(this.onDestroy$))
            .subscribe(function (locale) {
            _this.defaultLocale = locale || TimeAgoPipe_1.DEFAULT_LOCALE;
        });
        this.defaultDateTimeFormat = this.appConfig.get('dateValues.defaultDateTimeFormat', TimeAgoPipe_1.DEFAULT_DATE_TIME_FORMAT);
    }
    TimeAgoPipe_1 = TimeAgoPipe;
    TimeAgoPipe.prototype.transform = function (value, locale) {
        if (value !== null && value !== undefined) {
            var actualLocale = locale || this.defaultLocale;
            var then = moment_es6_1.default(value);
            var diff = moment_es6_1.default().locale(actualLocale).diff(then, 'days');
            if (diff > 7) {
                var datePipe = new common_1.DatePipe(actualLocale);
                return datePipe.transform(value, this.defaultDateTimeFormat);
            }
            else {
                return then.locale(actualLocale).fromNow();
            }
        }
        return '';
    };
    TimeAgoPipe.prototype.ngOnDestroy = function () {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    };
    var TimeAgoPipe_1;
    TimeAgoPipe.DEFAULT_LOCALE = 'en-US';
    TimeAgoPipe.DEFAULT_DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';
    TimeAgoPipe = TimeAgoPipe_1 = __decorate([
        core_1.Pipe({
            name: 'adfTimeAgo'
        }),
        __metadata("design:paramtypes", [user_preferences_service_1.UserPreferencesService,
            app_config_service_1.AppConfigService])
    ], TimeAgoPipe);
    return TimeAgoPipe;
}());
exports.TimeAgoPipe = TimeAgoPipe;
//# sourceMappingURL=time-ago.pipe.js.map