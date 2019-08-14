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
var card_view_textitem_model_1 = require("../../models/card-view-textitem.model");
var card_view_update_service_1 = require("../../services/card-view-update.service");
var app_config_service_1 = require("../../../app-config/app-config.service");
var CardViewTextItemComponent = /** @class */ (function () {
    function CardViewTextItemComponent(cardViewUpdateService, appConfig) {
        this.cardViewUpdateService = cardViewUpdateService;
        this.appConfig = appConfig;
        this.editable = false;
        this.displayEmpty = true;
        this.inEdit = false;
        this.valueSeparator = this.appConfig.get('content-metadata.multi-value-pipe-separator') || CardViewTextItemComponent_1.DEFAULT_SEPARATOR;
    }
    CardViewTextItemComponent_1 = CardViewTextItemComponent;
    CardViewTextItemComponent.prototype.ngOnChanges = function () {
        this.editedValue = this.property.multiline ? this.property.displayValue : this.property.value;
    };
    CardViewTextItemComponent.prototype.showProperty = function () {
        return this.displayEmpty || !this.property.isEmpty();
    };
    CardViewTextItemComponent.prototype.isEditable = function () {
        return this.editable && this.property.editable;
    };
    CardViewTextItemComponent.prototype.isClickable = function () {
        return !!this.property.clickable;
    };
    CardViewTextItemComponent.prototype.hasIcon = function () {
        return !!this.property.icon;
    };
    CardViewTextItemComponent.prototype.hasErrors = function () {
        return this.errorMessages && this.errorMessages.length > 0;
    };
    CardViewTextItemComponent.prototype.setEditMode = function (editStatus) {
        var _this = this;
        this.inEdit = editStatus;
        setTimeout(function () {
            if (_this.editorInput) {
                _this.editorInput.nativeElement.click();
            }
        }, 0);
    };
    CardViewTextItemComponent.prototype.reset = function () {
        this.editedValue = this.property.multiline ? this.property.displayValue : this.property.value;
        this.setEditMode(false);
        this.resetErrorMessages();
    };
    CardViewTextItemComponent.prototype.resetErrorMessages = function () {
        this.errorMessages = [];
    };
    CardViewTextItemComponent.prototype.update = function () {
        if (this.property.isValid(this.editedValue)) {
            var updatedValue = this.prepareValueForUpload(this.property, this.editedValue);
            this.cardViewUpdateService.update(this.property, updatedValue);
            this.property.value = updatedValue;
            this.setEditMode(false);
            this.resetErrorMessages();
        }
        else {
            this.errorMessages = this.property.getValidationErrors(this.editedValue);
        }
    };
    CardViewTextItemComponent.prototype.prepareValueForUpload = function (property, value) {
        if (property.multivalued) {
            var listOfValues = value.split(this.valueSeparator.trim()).map(function (item) { return item.trim(); });
            return listOfValues;
        }
        return value;
    };
    CardViewTextItemComponent.prototype.onTextAreaInputChange = function () {
        this.errorMessages = this.property.getValidationErrors(this.editedValue);
    };
    CardViewTextItemComponent.prototype.clicked = function () {
        if (typeof this.property.clickCallBack === 'function') {
            this.property.clickCallBack();
        }
        else {
            this.cardViewUpdateService.clicked(this.property);
        }
    };
    var CardViewTextItemComponent_1;
    CardViewTextItemComponent.DEFAULT_SEPARATOR = ', ';
    __decorate([
        core_1.Input(),
        __metadata("design:type", card_view_textitem_model_1.CardViewTextItemModel)
    ], CardViewTextItemComponent.prototype, "property", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CardViewTextItemComponent.prototype, "editable", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CardViewTextItemComponent.prototype, "displayEmpty", void 0);
    __decorate([
        core_1.ViewChild('editorInput'),
        __metadata("design:type", Object)
    ], CardViewTextItemComponent.prototype, "editorInput", void 0);
    CardViewTextItemComponent = CardViewTextItemComponent_1 = __decorate([
        core_1.Component({
            selector: 'adf-card-view-textitem',
            templateUrl: './card-view-textitem.component.html',
            styleUrls: ['./card-view-textitem.component.scss']
        }),
        __metadata("design:paramtypes", [card_view_update_service_1.CardViewUpdateService,
            app_config_service_1.AppConfigService])
    ], CardViewTextItemComponent);
    return CardViewTextItemComponent;
}());
exports.CardViewTextItemComponent = CardViewTextItemComponent;
//# sourceMappingURL=card-view-textitem.component.js.map