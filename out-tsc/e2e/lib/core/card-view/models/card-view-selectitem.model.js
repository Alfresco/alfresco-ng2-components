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
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var CardViewSelectItemModel = /** @class */ (function (_super) {
    __extends(CardViewSelectItemModel, _super);
    function CardViewSelectItemModel(cardViewSelectItemProperties) {
        var _this = _super.call(this, cardViewSelectItemProperties) || this;
        _this.type = 'select';
        _this.options$ = cardViewSelectItemProperties.options$;
        return _this;
    }
    Object.defineProperty(CardViewSelectItemModel.prototype, "displayValue", {
        get: function () {
            var _this = this;
            return this.options$.pipe(operators_1.switchMap(function (options) {
                var option = options.find(function (o) { return o.key === _this.value; });
                return rxjs_1.of(option ? option.label : '');
            }));
        },
        enumerable: true,
        configurable: true
    });
    return CardViewSelectItemModel;
}(card_view_baseitem_model_1.CardViewBaseItemModel));
exports.CardViewSelectItemModel = CardViewSelectItemModel;
//# sourceMappingURL=card-view-selectitem.model.js.map