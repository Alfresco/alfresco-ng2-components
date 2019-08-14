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
var core_1 = require("@angular/core");
var form_service_1 = require("./../../services/form.service");
var index_1 = require("./core/index");
exports.baseHost = {
    '(click)': 'event($event)',
    '(blur)': 'event($event)',
    '(change)': 'event($event)',
    '(focus)': 'event($event)',
    '(focusin)': 'event($event)',
    '(focusout)': 'event($event)',
    '(input)': 'event($event)',
    '(invalid)': 'event($event)',
    '(select)': 'event($event)'
};
/**
 * Base widget component.
 */
var WidgetComponent = /** @class */ (function () {
    function WidgetComponent(formService) {
        this.formService = formService;
        /** Does the widget show a read-only value? (ie, can't be edited) */
        this.readOnly = false;
        /**
         * Emitted when a field value changes.
         */
        this.fieldChanged = new core_1.EventEmitter();
    }
    WidgetComponent_1 = WidgetComponent;
    WidgetComponent.prototype.hasField = function () {
        return this.field ? true : false;
    };
    // Note for developers:
    // returns <any> object to be able binding it to the <element required="required"> attribute
    WidgetComponent.prototype.isRequired = function () {
        if (this.field && this.field.required) {
            return true;
        }
        return null;
    };
    WidgetComponent.prototype.isValid = function () {
        return this.field.validationSummary ? true : false;
    };
    WidgetComponent.prototype.hasValue = function () {
        return this.field &&
            this.field.value !== null &&
            this.field.value !== undefined;
    };
    WidgetComponent.prototype.isInvalidFieldRequired = function () {
        return !this.field.isValid && !this.field.validationSummary && this.isRequired();
    };
    WidgetComponent.prototype.ngAfterViewInit = function () {
        this.fieldChanged.emit(this.field);
    };
    WidgetComponent.prototype.checkVisibility = function (field) {
        this.fieldChanged.emit(field);
    };
    WidgetComponent.prototype.onFieldChanged = function (field) {
        this.fieldChanged.emit(field);
    };
    WidgetComponent.prototype.getHyperlinkUrl = function (field) {
        var url = WidgetComponent_1.DEFAULT_HYPERLINK_URL;
        if (field && field.hyperlinkUrl) {
            url = field.hyperlinkUrl;
            if (!/^https?:\/\//i.test(url)) {
                url = "" + WidgetComponent_1.DEFAULT_HYPERLINK_SCHEME + url;
            }
        }
        return url;
    };
    WidgetComponent.prototype.getHyperlinkText = function (field) {
        if (field) {
            return field.displayText || field.hyperlinkUrl;
        }
        return null;
    };
    WidgetComponent.prototype.event = function (event) {
        this.formService.formEvents.next(event);
    };
    var WidgetComponent_1;
    WidgetComponent.DEFAULT_HYPERLINK_URL = '#';
    WidgetComponent.DEFAULT_HYPERLINK_SCHEME = 'http://';
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], WidgetComponent.prototype, "readOnly", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", index_1.FormFieldModel)
    ], WidgetComponent.prototype, "field", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], WidgetComponent.prototype, "fieldChanged", void 0);
    WidgetComponent = WidgetComponent_1 = __decorate([
        core_1.Component({
            selector: 'base-widget',
            template: '',
            host: exports.baseHost,
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [form_service_1.FormService])
    ], WidgetComponent);
    return WidgetComponent;
}());
exports.WidgetComponent = WidgetComponent;
//# sourceMappingURL=widget.component.js.map