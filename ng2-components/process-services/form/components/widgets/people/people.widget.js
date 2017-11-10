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
var keycodes_1 = require("@angular/cdk/keycodes");
var core_1 = require("@angular/core");
var widget_component_1 = require("./../widget.component");
var PeopleWidgetComponent = (function (_super) {
    __extends(PeopleWidgetComponent, _super);
    function PeopleWidgetComponent(formService, peopleProcessService) {
        var _this = _super.call(this, formService) || this;
        _this.formService = formService;
        _this.peopleProcessService = peopleProcessService;
        _this.minTermLength = 1;
        _this.users = [];
        return _this;
    }
    PeopleWidgetComponent.prototype.ngOnInit = function () {
        if (this.field) {
            var params = this.field.params;
            if (params && params.restrictWithGroup) {
                var restrictWithGroup = params.restrictWithGroup;
                this.groupId = restrictWithGroup.id;
            }
        }
    };
    PeopleWidgetComponent.prototype.onKeyUp = function (event) {
        var value = this.input.nativeElement.value;
        if (value && value.length >= this.minTermLength && this.oldValue !== value) {
            if (event.keyCode !== keycodes_1.ESCAPE && event.keyCode !== keycodes_1.ENTER) {
                if (value.length >= this.minTermLength) {
                    this.oldValue = value;
                    this.searchUsers(value);
                }
            }
        }
        else {
            this.validateValue(value);
        }
    };
    PeopleWidgetComponent.prototype.searchUsers = function (userName) {
        var _this = this;
        this.formService.getWorkflowUsers(userName, this.groupId)
            .subscribe(function (result) {
            _this.users = result || [];
            _this.validateValue(userName);
        });
    };
    PeopleWidgetComponent.prototype.validateValue = function (userName) {
        if (this.isValidUser(userName)) {
            this.field.validationSummary.message = '';
        }
        else if (!userName) {
            this.field.value = null;
            this.users = [];
        }
        else {
            this.field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_VALUE';
            this.field.markAsInvalid();
            this.field.form.markAsInvalid();
        }
    };
    PeopleWidgetComponent.prototype.isValidUser = function (value) {
        var _this = this;
        var isValid = false;
        if (value) {
            var resultUser = this.users.find(function (user) { return _this.getDisplayName(user).toLocaleLowerCase() === value.toLocaleLowerCase(); });
            if (resultUser) {
                isValid = true;
            }
        }
        return isValid;
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
        core_1.ViewChild('inputValue')
    ], PeopleWidgetComponent.prototype, "input", void 0);
    PeopleWidgetComponent = __decorate([
        core_1.Component({
            selector: 'people-widget',
            templateUrl: './people.widget.html',
            styleUrls: ['./people.widget.scss'],
            host: widget_component_1.baseHost,
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], PeopleWidgetComponent);
    return PeopleWidgetComponent;
}(widget_component_1.WidgetComponent));
exports.PeopleWidgetComponent = PeopleWidgetComponent;
