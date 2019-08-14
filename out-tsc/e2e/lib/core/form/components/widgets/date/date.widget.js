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
/* tslint:disable:component-selector  */
var user_preferences_service_1 = require("../../../../services/user-preferences.service");
var momentDateAdapter_1 = require("../../../../utils/momentDateAdapter");
var moment_date_formats_model_1 = require("../../../../utils/moment-date-formats.model");
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var moment_es6_1 = require("moment-es6");
var form_service_1 = require("./../../../services/form.service");
var widget_component_1 = require("./../widget.component");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var DateWidgetComponent = /** @class */ (function (_super) {
    __extends(DateWidgetComponent, _super);
    function DateWidgetComponent(formService, dateAdapter, userPreferencesService) {
        var _this = _super.call(this, formService) || this;
        _this.formService = formService;
        _this.dateAdapter = dateAdapter;
        _this.userPreferencesService = userPreferencesService;
        _this.DATE_FORMAT = 'DD-MM-YYYY';
        _this.onDestroy$ = new rxjs_1.Subject();
        return _this;
    }
    DateWidgetComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userPreferencesService
            .select(user_preferences_service_1.UserPreferenceValues.Locale)
            .pipe(operators_1.takeUntil(this.onDestroy$))
            .subscribe(function (locale) { return _this.dateAdapter.setLocale(locale); });
        var momentDateAdapter = this.dateAdapter;
        momentDateAdapter.overrideDisplayFormat = this.field.dateDisplayFormat;
        if (this.field) {
            if (this.field.minValue) {
                this.minDate = moment_es6_1.default(this.field.minValue, this.DATE_FORMAT);
            }
            if (this.field.maxValue) {
                this.maxDate = moment_es6_1.default(this.field.maxValue, this.DATE_FORMAT);
            }
        }
        this.displayDate = moment_es6_1.default(this.field.value, this.field.dateDisplayFormat);
    };
    DateWidgetComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    };
    DateWidgetComponent.prototype.onDateChanged = function (newDateValue) {
        if (newDateValue && newDateValue.value) {
            this.field.value = newDateValue.value.format(this.field.dateDisplayFormat);
        }
        else if (newDateValue) {
            this.field.value = newDateValue;
        }
        else {
            this.field.value = null;
        }
        this.onFieldChanged(this.field);
    };
    DateWidgetComponent = __decorate([
        core_1.Component({
            selector: 'date-widget',
            providers: [
                { provide: material_1.DateAdapter, useClass: momentDateAdapter_1.MomentDateAdapter },
                { provide: material_1.MAT_DATE_FORMATS, useValue: moment_date_formats_model_1.MOMENT_DATE_FORMATS }
            ],
            templateUrl: './date.widget.html',
            styleUrls: ['./date.widget.scss'],
            host: widget_component_1.baseHost,
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [form_service_1.FormService,
            material_1.DateAdapter,
            user_preferences_service_1.UserPreferencesService])
    ], DateWidgetComponent);
    return DateWidgetComponent;
}(widget_component_1.WidgetComponent));
exports.DateWidgetComponent = DateWidgetComponent;
//# sourceMappingURL=date.widget.js.map