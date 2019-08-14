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
var people_process_service_1 = require("../../../../services/people-process.service");
var core_1 = require("@angular/core");
var form_service_1 = require("../../../services/form.service");
var widget_component_1 = require("./../widget.component");
var forms_1 = require("@angular/forms");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var PeopleWidgetComponent = /** @class */ (function (_super) {
    __extends(PeopleWidgetComponent, _super);
    function PeopleWidgetComponent(formService, peopleProcessService) {
        var _this = _super.call(this, formService) || this;
        _this.formService = formService;
        _this.peopleProcessService = peopleProcessService;
        _this.searchTerm = new forms_1.FormControl();
        _this.errorMsg = '';
        _this.searchTerms$ = _this.searchTerm.valueChanges;
        _this.users$ = _this.searchTerms$.pipe(operators_1.tap(function () {
            _this.errorMsg = '';
        }), operators_1.distinctUntilChanged(), operators_1.switchMap(function (searchTerm) {
            var value = searchTerm.email ? _this.getDisplayName(searchTerm) : searchTerm;
            return _this.formService.getWorkflowUsers(value, _this.groupId)
                .pipe(operators_1.catchError(function (err) {
                _this.errorMsg = err.message;
                return rxjs_1.of();
            }));
        }), operators_1.map(function (list) {
            var value = _this.searchTerm.value.email ? _this.getDisplayName(_this.searchTerm.value) : _this.searchTerm.value;
            _this.checkUserAndValidateForm(list, value);
            return list;
        }));
        _this.peopleSelected = new core_1.EventEmitter();
        return _this;
    }
    PeopleWidgetComponent.prototype.ngOnInit = function () {
        if (this.field) {
            if (this.field.value) {
                this.searchTerm.setValue(this.field.value);
            }
            if (this.field.readOnly) {
                this.searchTerm.disable();
            }
            var params = this.field.params;
            if (params && params.restrictWithGroup) {
                var restrictWithGroup = params.restrictWithGroup;
                this.groupId = restrictWithGroup.id;
            }
        }
    };
    PeopleWidgetComponent.prototype.checkUserAndValidateForm = function (list, value) {
        var isValidUser = this.isValidUser(list, value);
        if (isValidUser || value === '') {
            this.field.validationSummary.message = '';
            this.field.validate();
            this.field.form.validateForm();
        }
        else {
            this.field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_VALUE';
            this.field.markAsInvalid();
            this.field.form.markAsInvalid();
        }
    };
    PeopleWidgetComponent.prototype.isValidUser = function (users, name) {
        var _this = this;
        if (users) {
            return users.find(function (user) {
                var selectedUser = _this.getDisplayName(user).toLocaleLowerCase() === name.toLocaleLowerCase();
                if (selectedUser) {
                    _this.peopleSelected.emit(user && user.id || undefined);
                }
                return selectedUser;
            });
        }
    };
    PeopleWidgetComponent.prototype.getDisplayName = function (model) {
        if (model) {
            var displayName = (model.firstName || '') + " " + (model.lastName || '');
            return displayName.trim();
        }
        return '';
    };
    PeopleWidgetComponent.prototype.onItemSelect = function (item) {
        if (item) {
            this.field.value = item;
        }
    };
    __decorate([
        core_1.ViewChild('inputValue'),
        __metadata("design:type", core_1.ElementRef)
    ], PeopleWidgetComponent.prototype, "input", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], PeopleWidgetComponent.prototype, "peopleSelected", void 0);
    PeopleWidgetComponent = __decorate([
        core_1.Component({
            selector: 'people-widget',
            templateUrl: './people.widget.html',
            styleUrls: ['./people.widget.scss'],
            host: widget_component_1.baseHost,
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [form_service_1.FormService, people_process_service_1.PeopleProcessService])
    ], PeopleWidgetComponent);
    return PeopleWidgetComponent;
}(widget_component_1.WidgetComponent));
exports.PeopleWidgetComponent = PeopleWidgetComponent;
//# sourceMappingURL=people.widget.js.map