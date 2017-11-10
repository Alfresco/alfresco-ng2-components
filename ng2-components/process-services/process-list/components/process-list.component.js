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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var core_2 = require("@adf/core");
var filter_process_model_1 = require("../models/filter-process.model");
var process_preset_model_1 = require("../models/process-preset.model");
var ProcessInstanceListComponent = (function () {
    function ProcessInstanceListComponent(processService, appConfig) {
        this.processService = processService;
        this.appConfig = appConfig;
        this.rowClick = new core_1.EventEmitter();
        this.success = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.isLoading = true;
        this.layoutPresets = {};
    }
    ProcessInstanceListComponent.prototype.ngAfterContentInit = function () {
        this.loadLayoutPresets();
        this.setupSchema();
        if (this.appId) {
            this.reload();
        }
    };
    /**
     * Setup html-based (html definitions) or code behind (data adapter) schema.
     * If component is assigned with an empty data adater the default schema settings applied.
     */
    ProcessInstanceListComponent.prototype.setupSchema = function () {
        var schema = [];
        if (this.columnList && this.columnList.columns && this.columnList.columns.length > 0) {
            schema = this.columnList.columns.map(function (c) { return c; });
        }
        if (!this.data) {
            this.data = new core_2.ObjectDataTableAdapter([], schema.length > 0 ? schema : this.getLayoutPreset(this.presetColumn));
        }
        else {
            if (schema && schema.length > 0) {
                this.data.setColumns(schema);
            }
            else if (this.data.getColumns().length === 0) {
                this.presetColumn ? this.setupDefaultColumns(this.presetColumn) : this.setupDefaultColumns();
            }
        }
    };
    ProcessInstanceListComponent.prototype.ngOnChanges = function (changes) {
        if (this.isPropertyChanged(changes)) {
            this.reload();
        }
    };
    ProcessInstanceListComponent.prototype.isPropertyChanged = function (changes) {
        var changed = false;
        var appId = changes['appId'];
        var processDefinitionKey = changes['processDefinitionKey'];
        var state = changes['state'];
        var sort = changes['sort'];
        var name = changes['name'];
        if (appId && appId.currentValue) {
            changed = true;
        }
        else if (processDefinitionKey && processDefinitionKey.currentValue) {
            changed = true;
        }
        else if (state && state.currentValue) {
            changed = true;
        }
        else if (sort && sort.currentValue) {
            changed = true;
        }
        else if (name && name.currentValue) {
            changed = true;
        }
        return changed;
    };
    ProcessInstanceListComponent.prototype.reload = function () {
        this.requestNode = this.createRequestNode();
        this.load(this.requestNode);
    };
    ProcessInstanceListComponent.prototype.load = function (requestNode) {
        var _this = this;
        this.isLoading = true;
        this.processService.getProcessInstances(requestNode, this.processDefinitionKey)
            .subscribe(function (response) {
            var instancesRow = _this.createDataRow(response);
            _this.renderInstances(instancesRow);
            _this.selectFirst();
            _this.success.emit(response);
            _this.isLoading = false;
        }, function (error) {
            _this.error.emit(error);
            _this.isLoading = false;
        });
    };
    /**
     * Create an array of ObjectDataRow
     * @param instances
     * @returns {ObjectDataRow[]}
     */
    ProcessInstanceListComponent.prototype.createDataRow = function (instances) {
        var instancesRows = [];
        instances.forEach(function (row) {
            instancesRows.push(new core_2.ObjectDataRow(row));
        });
        return instancesRows;
    };
    /**
     * Render the instances list
     *
     * @param instances
     */
    ProcessInstanceListComponent.prototype.renderInstances = function (instances) {
        instances = this.optimizeNames(instances);
        this.setDatatableSorting();
        this.data.setRows(instances);
    };
    /**
     * Sort the datatable rows based on current value of 'sort' property
     */
    ProcessInstanceListComponent.prototype.setDatatableSorting = function () {
        if (!this.sort) {
            return;
        }
        var sortingParams = this.sort.split('-');
        if (sortingParams.length === 2) {
            var sortColumn = sortingParams[0] === 'created' ? 'started' : sortingParams[0];
            var sortOrder = sortingParams[1];
            this.data.setSorting(new core_2.DataSorting(sortColumn, sortOrder));
        }
    };
    /**
     * Select the first instance of a list if present
     */
    ProcessInstanceListComponent.prototype.selectFirst = function () {
        if (!this.isListEmpty()) {
            var row = this.data.getRows()[0];
            row.isSelected = true;
            this.data.selectedRow = row;
            this.currentInstanceId = row.getValue('id');
        }
        else {
            if (this.data) {
                this.data.selectedRow = null;
            }
            this.currentInstanceId = null;
        }
    };
    /**
     * Return the current id
     * @returns {string}
     */
    ProcessInstanceListComponent.prototype.getCurrentId = function () {
        return this.currentInstanceId;
    };
    /**
     * Check if the list is empty
     * @returns {ObjectDataTableAdapter|boolean}
     */
    ProcessInstanceListComponent.prototype.isListEmpty = function () {
        return this.data === undefined ||
            (this.data && this.data.getRows() && this.data.getRows().length === 0);
    };
    /**
     * Emit the event rowClick passing the current task id when the row is clicked
     * @param event
     */
    ProcessInstanceListComponent.prototype.onRowClick = function (event) {
        var item = event;
        this.currentInstanceId = item.value.getValue('id');
        this.rowClick.emit(this.currentInstanceId);
    };
    /**
     * Emit the event rowClick passing the current task id when pressed the Enter key on the selected row
     * @param event
     */
    ProcessInstanceListComponent.prototype.onRowKeyUp = function (event) {
        if (event.detail.keyboardEvent.key === 'Enter') {
            event.preventDefault();
            this.currentInstanceId = event.detail.row.getValue('id');
            this.rowClick.emit(this.currentInstanceId);
        }
    };
    /**
     * Optimize name field
     * @param instances
     * @returns {any[]}
     */
    ProcessInstanceListComponent.prototype.optimizeNames = function (instances) {
        var _this = this;
        instances = instances.map(function (t) {
            t.obj.name = _this.getProcessNameOrDescription(t.obj, 'medium');
            return t;
        });
        return instances;
    };
    ProcessInstanceListComponent.prototype.getProcessNameOrDescription = function (processInstance, dateFormat) {
        var name = '';
        if (processInstance) {
            name = processInstance.name ||
                processInstance.processDefinitionName + ' - ' + this.getFormatDate(processInstance.started, dateFormat);
        }
        return name;
    };
    ProcessInstanceListComponent.prototype.getFormatDate = function (value, format) {
        var datePipe = new common_1.DatePipe('en-US');
        try {
            return datePipe.transform(value, format);
        }
        catch (err) {
            return '';
        }
    };
    ProcessInstanceListComponent.prototype.createRequestNode = function () {
        var requestNode = {
            appDefinitionId: this.appId,
            state: this.state,
            sort: this.sort
        };
        return new filter_process_model_1.ProcessFilterParamRepresentationModel(requestNode);
    };
    ProcessInstanceListComponent.prototype.setupDefaultColumns = function (preset) {
        if (preset === void 0) { preset = 'default'; }
        if (this.data) {
            var columns = this.getLayoutPreset(preset);
            this.data.setColumns(columns);
        }
    };
    ProcessInstanceListComponent.prototype.loadLayoutPresets = function () {
        var externalSettings = this.appConfig.get('adf-process-list.presets', null);
        if (externalSettings) {
            this.layoutPresets = Object.assign({}, process_preset_model_1.processPresetsDefaultModel, externalSettings);
        }
        else {
            this.layoutPresets = process_preset_model_1.processPresetsDefaultModel;
        }
    };
    ProcessInstanceListComponent.prototype.getLayoutPreset = function (name) {
        if (name === void 0) { name = 'default'; }
        return (this.layoutPresets[name] || this.layoutPresets['default']).map(function (col) { return new core_2.ObjectDataColumn(col); });
    };
    __decorate([
        core_1.ContentChild(ng2_alfresco_core_1.DataColumnListComponent)
    ], ProcessInstanceListComponent.prototype, "columnList", void 0);
    __decorate([
        core_1.Input()
    ], ProcessInstanceListComponent.prototype, "appId", void 0);
    __decorate([
        core_1.Input()
    ], ProcessInstanceListComponent.prototype, "processDefinitionKey", void 0);
    __decorate([
        core_1.Input()
    ], ProcessInstanceListComponent.prototype, "state", void 0);
    __decorate([
        core_1.Input()
    ], ProcessInstanceListComponent.prototype, "sort", void 0);
    __decorate([
        core_1.Input()
    ], ProcessInstanceListComponent.prototype, "name", void 0);
    __decorate([
        core_1.Input()
    ], ProcessInstanceListComponent.prototype, "presetColumn", void 0);
    __decorate([
        core_1.Input()
    ], ProcessInstanceListComponent.prototype, "data", void 0);
    __decorate([
        core_1.Output()
    ], ProcessInstanceListComponent.prototype, "rowClick", void 0);
    __decorate([
        core_1.Output()
    ], ProcessInstanceListComponent.prototype, "success", void 0);
    __decorate([
        core_1.Output()
    ], ProcessInstanceListComponent.prototype, "error", void 0);
    ProcessInstanceListComponent = __decorate([
        core_1.Component({
            selector: 'adf-process-instance-list',
            styleUrls: ['./process-list.component.css'],
            templateUrl: './process-list.component.html'
        })
    ], ProcessInstanceListComponent);
    return ProcessInstanceListComponent;
}());
exports.ProcessInstanceListComponent = ProcessInstanceListComponent;
