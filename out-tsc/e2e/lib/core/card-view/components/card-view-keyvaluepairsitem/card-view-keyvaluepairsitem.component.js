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
var card_view_update_service_1 = require("../../services/card-view-update.service");
var card_view_models_1 = require("../../models/card-view.models");
var material_1 = require("@angular/material");
var CardViewKeyValuePairsItemComponent = /** @class */ (function () {
    function CardViewKeyValuePairsItemComponent(cardViewUpdateService) {
        this.cardViewUpdateService = cardViewUpdateService;
        this.editable = false;
    }
    CardViewKeyValuePairsItemComponent.prototype.ngOnChanges = function () {
        this.values = this.property.value || [];
        this.matTableValues = new material_1.MatTableDataSource(this.values);
    };
    CardViewKeyValuePairsItemComponent.prototype.isEditable = function () {
        return this.editable && this.property.editable;
    };
    CardViewKeyValuePairsItemComponent.prototype.add = function () {
        this.values.push({ name: '', value: '' });
    };
    CardViewKeyValuePairsItemComponent.prototype.remove = function (index) {
        this.values.splice(index, 1);
        this.save(true);
    };
    CardViewKeyValuePairsItemComponent.prototype.onBlur = function (value) {
        if (value.length) {
            this.save();
        }
    };
    CardViewKeyValuePairsItemComponent.prototype.save = function (remove) {
        var validValues = this.values.filter(function (i) { return i.name.length && i.value.length; });
        if (remove || validValues.length) {
            this.cardViewUpdateService.update(this.property, validValues);
            this.property.value = validValues;
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", card_view_models_1.CardViewKeyValuePairsItemModel)
    ], CardViewKeyValuePairsItemComponent.prototype, "property", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CardViewKeyValuePairsItemComponent.prototype, "editable", void 0);
    CardViewKeyValuePairsItemComponent = __decorate([
        core_1.Component({
            selector: 'adf-card-view-boolitem',
            templateUrl: './card-view-keyvaluepairsitem.component.html',
            styleUrls: ['./card-view-keyvaluepairsitem.component.scss']
        }),
        __metadata("design:paramtypes", [card_view_update_service_1.CardViewUpdateService])
    ], CardViewKeyValuePairsItemComponent);
    return CardViewKeyValuePairsItemComponent;
}());
exports.CardViewKeyValuePairsItemComponent = CardViewKeyValuePairsItemComponent;
//# sourceMappingURL=card-view-keyvaluepairsitem.component.js.map