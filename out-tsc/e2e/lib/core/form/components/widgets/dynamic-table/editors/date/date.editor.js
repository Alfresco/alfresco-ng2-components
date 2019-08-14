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
/* tslint:disable:component-selector  */
var user_preferences_service_1 = require("../../../../../../services/user-preferences.service");
var momentDateAdapter_1 = require("../../../../../../utils/momentDateAdapter");
var moment_date_formats_model_1 = require("../../../../../../utils/moment-date-formats.model");
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var moment_es6_1 = require("moment-es6");
var dynamic_table_widget_model_1 = require("./../../dynamic-table.widget.model");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var DateEditorComponent = /** @class */ (function () {
    function DateEditorComponent(dateAdapter, userPreferencesService) {
        this.dateAdapter = dateAdapter;
        this.userPreferencesService = userPreferencesService;
        this.DATE_FORMAT = 'DD-MM-YYYY';
        this.onDestroy$ = new rxjs_1.Subject();
    }
    DateEditorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userPreferencesService
            .select(user_preferences_service_1.UserPreferenceValues.Locale)
            .pipe(operators_1.takeUntil(this.onDestroy$))
            .subscribe(function (locale) { return _this.dateAdapter.setLocale(locale); });
        var momentDateAdapter = this.dateAdapter;
        momentDateAdapter.overrideDisplayFormat = this.DATE_FORMAT;
        this.value = moment_es6_1.default(this.table.getCellValue(this.row, this.column), this.DATE_FORMAT);
    };
    DateEditorComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    };
    DateEditorComponent.prototype.onDateChanged = function (newDateValue) {
        if (newDateValue && newDateValue.value) {
            /* validates the user inputs */
            var momentDate = moment_es6_1.default(newDateValue.value, this.DATE_FORMAT, true);
            if (!momentDate.isValid()) {
                this.row.value[this.column.id] = newDateValue.value;
            }
            else {
                this.row.value[this.column.id] = momentDate.format('YYYY-MM-DD') + "T00:00:00.000Z";
                this.table.flushValue();
            }
        }
        else {
            /* removes the date  */
            this.row.value[this.column.id] = '';
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", dynamic_table_widget_model_1.DynamicTableModel)
    ], DateEditorComponent.prototype, "table", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], DateEditorComponent.prototype, "row", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], DateEditorComponent.prototype, "column", void 0);
    DateEditorComponent = __decorate([
        core_1.Component({
            selector: 'adf-date-editor',
            templateUrl: './date.editor.html',
            providers: [
                { provide: material_1.DateAdapter, useClass: momentDateAdapter_1.MomentDateAdapter },
                { provide: material_1.MAT_DATE_FORMATS, useValue: moment_date_formats_model_1.MOMENT_DATE_FORMATS }
            ],
            styleUrls: ['./date.editor.scss']
        }),
        __metadata("design:paramtypes", [material_1.DateAdapter,
            user_preferences_service_1.UserPreferencesService])
    ], DateEditorComponent);
    return DateEditorComponent;
}());
exports.DateEditorComponent = DateEditorComponent;
//# sourceMappingURL=date.editor.js.map