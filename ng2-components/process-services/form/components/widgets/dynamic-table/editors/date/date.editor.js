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
var DateEditorComponent = (function () {
    function DateEditorComponent(dateAdapter, preferences) {
        this.dateAdapter = dateAdapter;
        this.preferences = preferences;
        this.DATE_FORMAT = 'DD-MM-YYYY';
    }
    DateEditorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.preferences.locale$.subscribe(function (locale) {
            _this.dateAdapter.setLocale(locale);
        });
        var momentDateAdapter = this.dateAdapter;
        momentDateAdapter.overrideDisplyaFormat = this.DATE_FORMAT;
        this.value = moment(this.table.getCellValue(this.row, this.column), this.DATE_FORMAT);
    };
    DateEditorComponent.prototype.onDateChanged = function (newDateValue) {
        if (newDateValue) {
            var momentDate = moment(newDateValue, this.DATE_FORMAT, true);
            if (!momentDate.isValid()) {
                this.row.value[this.column.id] = '';
            }
            else {
                this.row.value[this.column.id] = momentDate.format('YYYY-MM-DD') + "T00:00:00.000Z";
                this.table.flushValue();
            }
        }
    };
    __decorate([
        core_2.Input()
    ], DateEditorComponent.prototype, "table", void 0);
    __decorate([
        core_2.Input()
    ], DateEditorComponent.prototype, "row", void 0);
    __decorate([
        core_2.Input()
    ], DateEditorComponent.prototype, "column", void 0);
    DateEditorComponent = __decorate([
        core_2.Component({
            selector: 'adf-date-editor',
            templateUrl: './date.editor.html',
            providers: [
                { provide: material_1.DateAdapter, useClass: core_1.MomentDateAdapter },
                { provide: material_1.MAT_DATE_FORMATS, useValue: core_1.MOMENT_DATE_FORMATS }
            ],
            styleUrls: ['./date.editor.scss']
        })
    ], DateEditorComponent);
    return DateEditorComponent;
}());
exports.DateEditorComponent = DateEditorComponent;
