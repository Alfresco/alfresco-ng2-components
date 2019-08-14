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
var card_view_selectitem_model_1 = require("../../models/card-view-selectitem.model");
var card_view_update_service_1 = require("../../services/card-view-update.service");
var rxjs_1 = require("rxjs");
var CardViewSelectItemComponent = /** @class */ (function () {
    function CardViewSelectItemComponent(cardViewUpdateService) {
        this.cardViewUpdateService = cardViewUpdateService;
        this.editable = false;
        this.displayNoneOption = true;
    }
    CardViewSelectItemComponent.prototype.ngOnChanges = function () {
        this.value = this.property.value;
    };
    CardViewSelectItemComponent.prototype.isEditable = function () {
        return this.editable && this.property.editable;
    };
    CardViewSelectItemComponent.prototype.getOptions = function () {
        return this.options$ || this.property.options$;
    };
    CardViewSelectItemComponent.prototype.onChange = function (event) {
        var selectedOption = event.value !== undefined ? event.value : null;
        this.cardViewUpdateService.update(this.property, selectedOption);
        this.property.value = selectedOption;
    };
    CardViewSelectItemComponent.prototype.showNoneOption = function () {
        return this.displayNoneOption;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", card_view_selectitem_model_1.CardViewSelectItemModel)
    ], CardViewSelectItemComponent.prototype, "property", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CardViewSelectItemComponent.prototype, "editable", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", rxjs_1.Observable)
    ], CardViewSelectItemComponent.prototype, "options$", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CardViewSelectItemComponent.prototype, "displayNoneOption", void 0);
    CardViewSelectItemComponent = __decorate([
        core_1.Component({
            selector: 'adf-card-view-selectitem',
            templateUrl: './card-view-selectitem.component.html',
            styleUrls: ['./card-view-selectitem.component.scss']
        }),
        __metadata("design:paramtypes", [card_view_update_service_1.CardViewUpdateService])
    ], CardViewSelectItemComponent);
    return CardViewSelectItemComponent;
}());
exports.CardViewSelectItemComponent = CardViewSelectItemComponent;
//# sourceMappingURL=card-view-selectitem.component.js.map