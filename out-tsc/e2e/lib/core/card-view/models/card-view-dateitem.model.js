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
Object.defineProperty(exports, "__esModule", { value: true });
var card_view_baseitem_model_1 = require("./card-view-baseitem.model");
var localized_date_pipe_1 = require("../../pipes/localized-date.pipe");
var CardViewDateItemModel = /** @class */ (function (_super) {
    __extends(CardViewDateItemModel, _super);
    function CardViewDateItemModel(cardViewDateItemProperties) {
        var _this = _super.call(this, cardViewDateItemProperties) || this;
        _this.type = 'date';
        if (cardViewDateItemProperties.format) {
            _this.format = cardViewDateItemProperties.format;
        }
        if (cardViewDateItemProperties.locale) {
            _this.locale = cardViewDateItemProperties.locale;
        }
        return _this;
    }
    Object.defineProperty(CardViewDateItemModel.prototype, "displayValue", {
        get: function () {
            if (!this.value) {
                return this.default;
            }
            else {
                this.localizedDatePipe = new localized_date_pipe_1.LocalizedDatePipe();
                return this.localizedDatePipe.transform(this.value, this.format, this.locale);
            }
        },
        enumerable: true,
        configurable: true
    });
    return CardViewDateItemModel;
}(card_view_baseitem_model_1.CardViewBaseItemModel));
exports.CardViewDateItemModel = CardViewDateItemModel;
//# sourceMappingURL=card-view-dateitem.model.js.map