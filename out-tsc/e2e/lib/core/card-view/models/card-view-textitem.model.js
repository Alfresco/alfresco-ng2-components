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
var CardViewTextItemModel = /** @class */ (function (_super) {
    __extends(CardViewTextItemModel, _super);
    function CardViewTextItemModel(cardViewTextItemProperties) {
        var _this = _super.call(this, cardViewTextItemProperties) || this;
        _this.type = 'text';
        _this.multiline = !!cardViewTextItemProperties.multiline;
        _this.multivalued = !!cardViewTextItemProperties.multivalued;
        _this.pipes = cardViewTextItemProperties.pipes || [];
        _this.clickCallBack = cardViewTextItemProperties.clickCallBack ? cardViewTextItemProperties.clickCallBack : null;
        return _this;
    }
    Object.defineProperty(CardViewTextItemModel.prototype, "displayValue", {
        get: function () {
            if (this.isEmpty()) {
                return this.default;
            }
            else {
                return this.applyPipes(this.value);
            }
        },
        enumerable: true,
        configurable: true
    });
    CardViewTextItemModel.prototype.applyPipes = function (displayValue) {
        if (this.pipes.length) {
            displayValue = this.pipes.reduce(function (accumulator, _a) {
                var pipe = _a.pipe, _b = _a.params, params = _b === void 0 ? [] : _b;
                return pipe.transform.apply(pipe, [accumulator].concat(params));
            }, displayValue);
        }
        return displayValue;
    };
    return CardViewTextItemModel;
}(card_view_baseitem_model_1.CardViewBaseItemModel));
exports.CardViewTextItemModel = CardViewTextItemModel;
//# sourceMappingURL=card-view-textitem.model.js.map