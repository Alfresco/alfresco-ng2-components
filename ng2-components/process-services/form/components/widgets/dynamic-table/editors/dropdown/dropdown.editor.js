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
var core_1 = require("@angular/core");
var DropdownEditorComponent = (function () {
    function DropdownEditorComponent(formService, logService) {
        this.formService = formService;
        this.logService = logService;
        this.value = null;
        this.options = [];
    }
    DropdownEditorComponent.prototype.ngOnInit = function () {
        var field = this.table.field;
        if (field) {
            if (this.column.optionType === 'rest') {
                if (this.table.form && this.table.form.taskId) {
                    this.getValuesByTaskId(field);
                }
                else {
                    this.getValuesByProcessDefinitionId(field);
                }
            }
            else {
                this.options = this.column.options || [];
                this.value = this.table.getCellValue(this.row, this.column);
            }
        }
    };
    DropdownEditorComponent.prototype.getValuesByTaskId = function (field) {
        var _this = this;
        this.formService
            .getRestFieldValuesColumn(field.form.taskId, field.id, this.column.id)
            .subscribe(function (result) {
            _this.column.options = result || [];
            _this.options = _this.column.options;
            _this.value = _this.table.getCellValue(_this.row, _this.column);
        }, function (err) { return _this.handleError(err); });
    };
    DropdownEditorComponent.prototype.getValuesByProcessDefinitionId = function (field) {
        var _this = this;
        this.formService
            .getRestFieldValuesColumnByProcessId(field.form.processDefinitionId, field.id, this.column.id)
            .subscribe(function (result) {
            _this.column.options = result || [];
            _this.options = _this.column.options;
            _this.value = _this.table.getCellValue(_this.row, _this.column);
        }, function (err) { return _this.handleError(err); });
    };
    DropdownEditorComponent.prototype.onValueChanged = function (row, column, event) {
        var value = event.value;
        value = column.options.find(function (opt) { return opt.name === value; });
        row.value[column.id] = value;
    };
    DropdownEditorComponent.prototype.handleError = function (error) {
        this.logService.error(error);
    };
    __decorate([
        core_1.Input()
    ], DropdownEditorComponent.prototype, "table", void 0);
    __decorate([
        core_1.Input()
    ], DropdownEditorComponent.prototype, "row", void 0);
    __decorate([
        core_1.Input()
    ], DropdownEditorComponent.prototype, "column", void 0);
    DropdownEditorComponent = __decorate([
        core_1.Component({
            selector: 'adf-dropdown-editor',
            templateUrl: './dropdown.editor.html',
            styleUrls: ['./dropdown.editor.scss']
        })
    ], DropdownEditorComponent);
    return DropdownEditorComponent;
}());
exports.DropdownEditorComponent = DropdownEditorComponent;
