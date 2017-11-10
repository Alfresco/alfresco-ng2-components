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
var core_1 = require("@angular/core");
var widget_component_1 = require("./../widget.component");
var dynamic_table_widget_model_1 = require("./dynamic-table.widget.model");
var DynamicTableWidgetComponent = (function (_super) {
    __extends(DynamicTableWidgetComponent, _super);
    function DynamicTableWidgetComponent(formService, elementRef, visibilityService, logService, cd) {
        var _this = _super.call(this, formService) || this;
        _this.formService = formService;
        _this.elementRef = elementRef;
        _this.visibilityService = visibilityService;
        _this.logService = logService;
        _this.cd = cd;
        _this.ERROR_MODEL_NOT_FOUND = 'Table model not found';
        _this.editMode = false;
        _this.editRow = null;
        _this.selectArrayCode = [32, 0, 13];
        return _this;
    }
    DynamicTableWidgetComponent.prototype.ngOnInit = function () {
        if (this.field) {
            this.content = new dynamic_table_widget_model_1.DynamicTableModel(this.field, this.formService);
            this.visibilityService.refreshVisibility(this.field.form);
        }
    };
    DynamicTableWidgetComponent.prototype.forceFocusOnAddButton = function () {
        if (this.content) {
            this.cd.detectChanges();
            var buttonAddRow = this.elementRef.nativeElement.querySelector('#' + this.content.id + '-add-row');
            if (this.isDynamicTableReady(buttonAddRow)) {
                buttonAddRow.focus();
            }
        }
    };
    DynamicTableWidgetComponent.prototype.isDynamicTableReady = function (buttonAddRow) {
        return this.field && !this.editMode && buttonAddRow;
    };
    DynamicTableWidgetComponent.prototype.isValid = function () {
        var result = true;
        if (this.content && this.content.field) {
            result = this.content.field.isValid;
        }
        return result;
    };
    DynamicTableWidgetComponent.prototype.onRowClicked = function (row) {
        if (this.content) {
            this.content.selectedRow = row;
        }
    };
    DynamicTableWidgetComponent.prototype.onKeyPressed = function ($event, row) {
        if (this.content && this.isEnterOrSpacePressed($event.keyCode)) {
            this.content.selectedRow = row;
        }
    };
    DynamicTableWidgetComponent.prototype.isEnterOrSpacePressed = function (keycode) {
        return this.selectArrayCode.indexOf(keycode) !== -1;
    };
    DynamicTableWidgetComponent.prototype.hasSelection = function () {
        return !!(this.content && this.content.selectedRow);
    };
    DynamicTableWidgetComponent.prototype.moveSelectionUp = function () {
        if (this.content && !this.readOnly) {
            this.content.moveRow(this.content.selectedRow, -1);
            return true;
        }
        return false;
    };
    DynamicTableWidgetComponent.prototype.moveSelectionDown = function () {
        if (this.content && !this.readOnly) {
            this.content.moveRow(this.content.selectedRow, 1);
            return true;
        }
        return false;
    };
    DynamicTableWidgetComponent.prototype.deleteSelection = function () {
        if (this.content && !this.readOnly) {
            this.content.deleteRow(this.content.selectedRow);
            return true;
        }
        return false;
    };
    DynamicTableWidgetComponent.prototype.addNewRow = function () {
        if (this.content && !this.readOnly) {
            this.editRow = {
                isNew: true,
                selected: false,
                value: {}
            };
            this.editMode = true;
            return true;
        }
        return false;
    };
    DynamicTableWidgetComponent.prototype.editSelection = function () {
        if (this.content && !this.readOnly) {
            this.editRow = this.copyRow(this.content.selectedRow);
            this.editMode = true;
            return true;
        }
        return false;
    };
    DynamicTableWidgetComponent.prototype.getCellValue = function (row, column) {
        if (this.content) {
            var result = this.content.getCellValue(row, column);
            if (column.type === 'Amount') {
                return (column.amountCurrency || '$') + ' ' + (result || 0);
            }
            return result;
        }
        return null;
    };
    DynamicTableWidgetComponent.prototype.onSaveChanges = function () {
        if (this.content) {
            if (this.editRow.isNew) {
                var row = this.copyRow(this.editRow);
                this.content.selectedRow = null;
                this.content.addRow(row);
                this.editRow.isNew = false;
            }
            else {
                this.content.selectedRow.value = this.copyObject(this.editRow.value);
            }
            this.content.flushValue();
        }
        else {
            this.logService.error(this.ERROR_MODEL_NOT_FOUND);
        }
        this.editMode = false;
        this.forceFocusOnAddButton();
    };
    DynamicTableWidgetComponent.prototype.onCancelChanges = function () {
        this.editMode = false;
        this.editRow = null;
        this.forceFocusOnAddButton();
    };
    DynamicTableWidgetComponent.prototype.copyRow = function (row) {
        return {
            value: this.copyObject(row.value)
        };
    };
    DynamicTableWidgetComponent.prototype.copyObject = function (obj) {
        var _this = this;
        var result = obj;
        if (typeof obj === 'object' && obj !== null && obj !== undefined) {
            result = Object.assign({}, obj);
            Object.keys(obj).forEach(function (key) {
                if (typeof obj[key] === 'object') {
                    result[key] = _this.copyObject(obj[key]);
                }
            });
        }
        return result;
    };
    DynamicTableWidgetComponent = __decorate([
        core_1.Component({
            selector: 'dynamic-table-widget',
            templateUrl: './dynamic-table.widget.html',
            styleUrls: ['./dynamic-table.widget.scss'],
            host: widget_component_1.baseHost,
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], DynamicTableWidgetComponent);
    return DynamicTableWidgetComponent;
}(widget_component_1.WidgetComponent));
exports.DynamicTableWidgetComponent = DynamicTableWidgetComponent;
