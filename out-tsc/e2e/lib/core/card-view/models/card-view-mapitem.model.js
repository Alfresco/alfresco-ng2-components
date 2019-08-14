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
var CardViewMapItemModel = /** @class */ (function (_super) {
    __extends(CardViewMapItemModel, _super);
    function CardViewMapItemModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'map';
        return _this;
    }
    Object.defineProperty(CardViewMapItemModel.prototype, "displayValue", {
        get: function () {
            if (this.value && this.value.size > 0) {
                return this.value.values().next().value;
            }
            else {
                return this.default;
            }
        },
        enumerable: true,
        configurable: true
    });
    return CardViewMapItemModel;
}(card_view_baseitem_model_1.CardViewBaseItemModel));
exports.CardViewMapItemModel = CardViewMapItemModel;
//# sourceMappingURL=card-view-mapitem.model.js.map