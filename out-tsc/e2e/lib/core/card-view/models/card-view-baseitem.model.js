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
Object.defineProperty(exports, "__esModule", { value: true });
var CardViewBaseItemModel = /** @class */ (function () {
    function CardViewBaseItemModel(cardViewItemProperties) {
        this.label = cardViewItemProperties.label || '';
        this.value = cardViewItemProperties.value && cardViewItemProperties.value.displayName || cardViewItemProperties.value;
        this.key = cardViewItemProperties.key;
        this.default = cardViewItemProperties.default;
        this.editable = !!cardViewItemProperties.editable;
        this.clickable = !!cardViewItemProperties.clickable;
        this.icon = cardViewItemProperties.icon || '';
        this.validators = cardViewItemProperties.validators || [];
        this.data = cardViewItemProperties.data || null;
    }
    CardViewBaseItemModel.prototype.isEmpty = function () {
        return this.value === undefined || this.value === null || this.value === '';
    };
    CardViewBaseItemModel.prototype.isValid = function (newValue) {
        if (!this.validators.length) {
            return true;
        }
        return this.validators
            .map(function (validator) { return validator.isValid(newValue); })
            .reduce(function (isValidUntilNow, isValid) { return isValidUntilNow && isValid; }, true);
    };
    CardViewBaseItemModel.prototype.getValidationErrors = function (value) {
        if (!this.validators.length) {
            return [];
        }
        return this.validators.filter(function (validator) { return !validator.isValid(value); }).map(function (validator) { return validator.message; });
    };
    return CardViewBaseItemModel;
}());
exports.CardViewBaseItemModel = CardViewBaseItemModel;
//# sourceMappingURL=card-view-baseitem.model.js.map