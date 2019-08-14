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
var log_service_1 = require("../../../../services/log.service");
var keycodes_1 = require("@angular/cdk/keycodes");
var core_1 = require("@angular/core");
var form_service_1 = require("./../../../services/form.service");
var widget_component_1 = require("./../widget.component");
var TypeaheadWidgetComponent = /** @class */ (function (_super) {
    __extends(TypeaheadWidgetComponent, _super);
    function TypeaheadWidgetComponent(formService, logService) {
        var _this = _super.call(this, formService) || this;
        _this.formService = formService;
        _this.logService = logService;
        _this.minTermLength = 1;
        _this.options = [];
        return _this;
    }
    TypeaheadWidgetComponent.prototype.ngOnInit = function () {
        if (this.field.form.taskId && this.field.restUrl) {
            this.getValuesByTaskId();
        }
        else if (this.field.form.processDefinitionId && this.field.restUrl) {
            this.getValuesByProcessDefinitionId();
        }
        if (this.isReadOnlyType()) {
            this.value = this.field.value;
        }
    };
    TypeaheadWidgetComponent.prototype.getValuesByTaskId = function () {
        var _this = this;
        this.formService
            .getRestFieldValues(this.field.form.taskId, this.field.id)
            .subscribe(function (formFieldOption) {
            var options = formFieldOption || [];
            _this.field.options = options;
            var fieldValue = _this.field.value;
            if (fieldValue) {
                var toSelect = options.find(function (item) { return item.id === fieldValue || item.name.toLocaleLowerCase() === fieldValue.toLocaleLowerCase(); });
                if (toSelect) {
                    _this.value = toSelect.name;
                }
            }
            _this.onFieldChanged(_this.field);
            _this.field.updateForm();
        }, function (err) { return _this.handleError(err); });
    };
    TypeaheadWidgetComponent.prototype.getValuesByProcessDefinitionId = function () {
        var _this = this;
        this.formService
            .getRestFieldValuesByProcessId(this.field.form.processDefinitionId, this.field.id)
            .subscribe(function (formFieldOption) {
            var options = formFieldOption || [];
            _this.field.options = options;
            var fieldValue = _this.field.value;
            if (fieldValue) {
                var toSelect = options.find(function (item) { return item.id === fieldValue; });
                if (toSelect) {
                    _this.value = toSelect.name;
                }
            }
            _this.onFieldChanged(_this.field);
            _this.field.updateForm();
        }, function (err) { return _this.handleError(err); });
    };
    TypeaheadWidgetComponent.prototype.getOptions = function () {
        var val = this.value.trim().toLocaleLowerCase();
        return this.field.options.filter(function (item) {
            var name = item.name.toLocaleLowerCase();
            return name.indexOf(val) > -1;
        });
    };
    TypeaheadWidgetComponent.prototype.isValidOptionName = function (optionName) {
        var option = this.field.options.find(function (item) { return item.name && item.name.toLocaleLowerCase() === optionName.toLocaleLowerCase(); });
        return option ? true : false;
    };
    TypeaheadWidgetComponent.prototype.onKeyUp = function (event) {
        if (this.value && this.value.trim().length >= this.minTermLength && this.oldValue !== this.value) {
            if (event.keyCode !== keycodes_1.ESCAPE && event.keyCode !== keycodes_1.ENTER) {
                if (this.value.length >= this.minTermLength) {
                    this.options = this.getOptions();
                    this.oldValue = this.value;
                    if (this.isValidOptionName(this.value)) {
                        this.field.value = this.options[0].id;
                    }
                }
            }
        }
        if (this.isValueDefined() && this.value.trim().length === 0) {
            this.oldValue = this.value;
            this.options = [];
        }
    };
    TypeaheadWidgetComponent.prototype.onItemSelect = function (item) {
        if (item) {
            this.field.value = item.id;
            this.value = item.name;
            this.onFieldChanged(this.field);
        }
    };
    TypeaheadWidgetComponent.prototype.validate = function () {
        this.field.value = this.value;
    };
    TypeaheadWidgetComponent.prototype.isValueDefined = function () {
        return this.value !== null && this.value !== undefined;
    };
    TypeaheadWidgetComponent.prototype.handleError = function (error) {
        this.logService.error(error);
    };
    TypeaheadWidgetComponent.prototype.isReadOnlyType = function () {
        return this.field.type === 'readonly' ? true : false;
    };
    TypeaheadWidgetComponent = __decorate([
        core_1.Component({
            selector: 'typeahead-widget',
            templateUrl: './typeahead.widget.html',
            styleUrls: ['./typeahead.widget.scss'],
            host: widget_component_1.baseHost,
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [form_service_1.FormService,
            log_service_1.LogService])
    ], TypeaheadWidgetComponent);
    return TypeaheadWidgetComponent;
}(widget_component_1.WidgetComponent));
exports.TypeaheadWidgetComponent = TypeaheadWidgetComponent;
//# sourceMappingURL=typeahead.widget.js.map