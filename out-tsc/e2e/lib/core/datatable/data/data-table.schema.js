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
var data_column_list_component_1 = require("../../data-column/data-column-list.component");
var object_datacolumn_model_1 = require("./object-datacolumn.model");
var DataTableSchema = /** @class */ (function () {
    function DataTableSchema(appConfigService, presetKey, presetsModel) {
        this.appConfigService = appConfigService;
        this.presetKey = presetKey;
        this.presetsModel = presetsModel;
        this.layoutPresets = {};
    }
    DataTableSchema.prototype.createDatatableSchema = function () {
        this.loadLayoutPresets();
        if (!this.columns || this.columns.length === 0) {
            this.columns = this.mergeJsonAndHtmlSchema();
        }
    };
    DataTableSchema.prototype.loadLayoutPresets = function () {
        var externalSettings = this.appConfigService.get(this.presetKey, null);
        if (externalSettings) {
            this.layoutPresets = Object.assign({}, this.presetsModel, externalSettings);
        }
        else {
            this.layoutPresets = this.presetsModel;
        }
    };
    DataTableSchema.prototype.mergeJsonAndHtmlSchema = function () {
        var customSchemaColumns = this.getSchemaFromConfig(this.presetColumn).concat(this.getSchemaFromHtml(this.columnList));
        if (customSchemaColumns.length === 0) {
            customSchemaColumns = this.getDefaultLayoutPreset();
        }
        return customSchemaColumns;
    };
    DataTableSchema.prototype.getSchemaFromHtml = function (columnList) {
        var schema = [];
        if (columnList && columnList.columns && columnList.columns.length > 0) {
            schema = columnList.columns.map(function (c) { return c; });
        }
        return schema;
    };
    DataTableSchema.prototype.getSchemaFromConfig = function (presetColumn) {
        return presetColumn ? (this.layoutPresets[presetColumn]).map(function (col) { return new object_datacolumn_model_1.ObjectDataColumn(col); }) : [];
    };
    DataTableSchema.prototype.getDefaultLayoutPreset = function () {
        return (this.layoutPresets['default']).map(function (col) { return new object_datacolumn_model_1.ObjectDataColumn(col); });
    };
    __decorate([
        core_1.ContentChild(data_column_list_component_1.DataColumnListComponent),
        __metadata("design:type", data_column_list_component_1.DataColumnListComponent)
    ], DataTableSchema.prototype, "columnList", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataTableSchema.prototype, "presetColumn", void 0);
    return DataTableSchema;
}());
exports.DataTableSchema = DataTableSchema;
//# sourceMappingURL=data-table.schema.js.map