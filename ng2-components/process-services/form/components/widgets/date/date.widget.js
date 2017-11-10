"use strict";
/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:component-selector  */
var core_1 = require("@adf/core");
var core_2 = require("@angular/core");
var material_1 = require("@angular/material");
var moment = require("moment");
var widget_component_1 = require("./../widget.component");
var DateWidgetComponent = (function (_super) {
    __extends(DateWidgetComponent, _super);
    function DateWidgetComponent(formService, dateAdapter, preferences) {
        var _this = _super.call(this, formService) || this;
        _this.formService = formService;
        _this.dateAdapter = dateAdapter;
        _this.preferences = preferences;
        return _this;
    }
    DateWidgetComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.preferences.locale$.subscribe(function (locale) {
            _this.dateAdapter.setLocale(locale);
        });
        var momentDateAdapter = this.dateAdapter;
        momentDateAdapter.overrideDisplyaFormat = this.field.dateDisplayFormat;
        if (this.field) {
            if (this.field.minValue) {
                this.minDate = moment(this.field.minValue, 'DD/MM/YYYY');
            }
            if (this.field.maxValue) {
                this.maxDate = moment(this.field.maxValue, 'DD/MM/YYYY');
            }
        }
        this.displayDate = moment(this.field.value, this.field.dateDisplayFormat);
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
        this.checkVisibility(this.field);
    };
    DateWidgetComponent = __decorate([
        core_2.Component({
            selector: 'date-widget',
            providers: [
                { provide: material_1.DateAdapter, useClass: core_1.MomentDateAdapter },
                { provide: material_1.MAT_DATE_FORMATS, useValue: core_1.MOMENT_DATE_FORMATS }
            ],
            templateUrl: './date.widget.html',
            styleUrls: ['./date.widget.scss'],
            host: widget_component_1.baseHost,
            encapsulation: core_2.ViewEncapsulation.None
        })
    ], DateWidgetComponent);
    return DateWidgetComponent;
}(widget_component_1.WidgetComponent));
exports.DateWidgetComponent = DateWidgetComponent;
