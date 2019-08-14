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
var card_view_textitem_model_1 = require("./card-view-textitem.model");
var card_view_validators_1 = require("../validators/card-view.validators");
var CardViewIntItemModel = /** @class */ (function (_super) {
    __extends(CardViewIntItemModel, _super);
    function CardViewIntItemModel(cardViewTextItemProperties) {
        var _this = _super.call(this, cardViewTextItemProperties) || this;
        _this.type = 'int';
        _this.validators.push(new card_view_validators_1.CardViewItemIntValidator());
        if (cardViewTextItemProperties.value) {
            _this.value = parseInt(cardViewTextItemProperties.value, 10);
        }
        return _this;
    }
    return CardViewIntItemModel;
}(card_view_textitem_model_1.CardViewTextItemModel));
exports.CardViewIntItemModel = CardViewIntItemModel;
//# sourceMappingURL=card-view-intitem.model.js.map