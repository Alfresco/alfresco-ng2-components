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
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var core_2 = require("@mat-datetimepicker/core");
var moment_1 = require("@mat-datetimepicker/moment");
var moment_es6_1 = require("moment-es6");
var card_view_dateitem_model_1 = require("../../models/card-view-dateitem.model");
var card_view_update_service_1 = require("../../services/card-view-update.service");
var user_preferences_service_1 = require("../../../services/user-preferences.service");
var momentDateAdapter_1 = require("../../../utils/momentDateAdapter");
var moment_date_formats_model_1 = require("../../../utils/moment-date-formats.model");
var app_config_service_1 = require("../../../app-config/app-config.service");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var CardViewDateItemComponent = /** @class */ (function () {
    function CardViewDateItemComponent(cardViewUpdateService, dateAdapter, userPreferencesService, appConfig) {
        this.cardViewUpdateService = cardViewUpdateService;
        this.dateAdapter = dateAdapter;
        this.userPreferencesService = userPreferencesService;
        this.appConfig = appConfig;
        this.editable = false;
        this.displayEmpty = true;
        this.displayClearAction = true;
        this.onDestroy$ = new rxjs_1.Subject();
        this.dateFormat = this.appConfig.get('dateValues.defaultDateFormat');
    }
    CardViewDateItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userPreferencesService
            .select(user_preferences_service_1.UserPreferenceValues.Locale)
            .pipe(operators_1.takeUntil(this.onDestroy$))
            .subscribe(function (locale) {
            _this.dateAdapter.setLocale(locale);
            _this.property.locale = locale;
        });
        this.dateAdapter.overrideDisplayFormat = 'MMM DD';
        if (this.property.value) {
            this.valueDate = moment_es6_1.default(this.property.value, this.dateFormat);
        }
    };
    CardViewDateItemComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    };
    CardViewDateItemComponent.prototype.showProperty = function () {
        return this.displayEmpty || !this.property.isEmpty();
    };
    CardViewDateItemComponent.prototype.showClearAction = function () {
        return this.displayClearAction && (!this.property.isEmpty() || !!this.property.default);
    };
    CardViewDateItemComponent.prototype.isEditable = function () {
        return this.editable && this.property.editable;
    };
    CardViewDateItemComponent.prototype.showDatePicker = function () {
        this.datepicker.open();
    };
    CardViewDateItemComponent.prototype.onDateChanged = function (newDateValue) {
        if (newDateValue) {
            var momentDate = moment_es6_1.default(newDateValue.value, this.dateFormat, true);
            if (momentDate.isValid()) {
                this.valueDate = momentDate;
                this.cardViewUpdateService.update(this.property, momentDate.toDate());
                this.property.value = momentDate.toDate();
            }
        }
    };
    CardViewDateItemComponent.prototype.onDateClear = function () {
        this.valueDate = null;
        this.cardViewUpdateService.update(this.property, null);
        this.property.value = null;
        this.property.default = null;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", card_view_dateitem_model_1.CardViewDateItemModel)
    ], CardViewDateItemComponent.prototype, "property", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CardViewDateItemComponent.prototype, "editable", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CardViewDateItemComponent.prototype, "displayEmpty", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CardViewDateItemComponent.prototype, "displayClearAction", void 0);
    __decorate([
        core_1.ViewChild('datetimePicker'),
        __metadata("design:type", core_2.MatDatetimepicker)
    ], CardViewDateItemComponent.prototype, "datepicker", void 0);
    CardViewDateItemComponent = __decorate([
        core_1.Component({
            providers: [
                { provide: material_1.DateAdapter, useClass: momentDateAdapter_1.MomentDateAdapter },
                { provide: material_1.MAT_DATE_FORMATS, useValue: moment_date_formats_model_1.MOMENT_DATE_FORMATS },
                { provide: core_2.DatetimeAdapter, useClass: moment_1.MomentDatetimeAdapter },
                { provide: core_2.MAT_DATETIME_FORMATS, useValue: moment_1.MAT_MOMENT_DATETIME_FORMATS }
            ],
            selector: 'adf-card-view-dateitem',
            templateUrl: './card-view-dateitem.component.html',
            styleUrls: ['./card-view-dateitem.component.scss']
        }),
        __metadata("design:paramtypes", [card_view_update_service_1.CardViewUpdateService,
            material_1.DateAdapter,
            user_preferences_service_1.UserPreferencesService,
            app_config_service_1.AppConfigService])
    ], CardViewDateItemComponent);
    return CardViewDateItemComponent;
}());
exports.CardViewDateItemComponent = CardViewDateItemComponent;
//# sourceMappingURL=card-view-dateitem.component.js.map