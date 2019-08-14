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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var card_view_dateitem_component_1 = require("../components/card-view-dateitem/card-view-dateitem.component");
var card_view_mapitem_component_1 = require("../components/card-view-mapitem/card-view-mapitem.component");
var card_view_textitem_component_1 = require("../components/card-view-textitem/card-view-textitem.component");
var card_view_selectitem_component_1 = require("../components/card-view-selectitem/card-view-selectitem.component");
var card_view_boolitem_component_1 = require("../components/card-view-boolitem/card-view-boolitem.component");
var card_view_keyvaluepairsitem_component_1 = require("../components/card-view-keyvaluepairsitem/card-view-keyvaluepairsitem.component");
var dynamic_component_mapper_service_1 = require("../../services/dynamic-component-mapper.service");
var CardItemTypeService = /** @class */ (function (_super) {
    __extends(CardItemTypeService, _super);
    function CardItemTypeService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultValue = card_view_textitem_component_1.CardViewTextItemComponent;
        _this.types = {
            'text': dynamic_component_mapper_service_1.DynamicComponentResolver.fromType(card_view_textitem_component_1.CardViewTextItemComponent),
            'select': dynamic_component_mapper_service_1.DynamicComponentResolver.fromType(card_view_selectitem_component_1.CardViewSelectItemComponent),
            'int': dynamic_component_mapper_service_1.DynamicComponentResolver.fromType(card_view_textitem_component_1.CardViewTextItemComponent),
            'float': dynamic_component_mapper_service_1.DynamicComponentResolver.fromType(card_view_textitem_component_1.CardViewTextItemComponent),
            'date': dynamic_component_mapper_service_1.DynamicComponentResolver.fromType(card_view_dateitem_component_1.CardViewDateItemComponent),
            'datetime': dynamic_component_mapper_service_1.DynamicComponentResolver.fromType(card_view_dateitem_component_1.CardViewDateItemComponent),
            'bool': dynamic_component_mapper_service_1.DynamicComponentResolver.fromType(card_view_boolitem_component_1.CardViewBoolItemComponent),
            'map': dynamic_component_mapper_service_1.DynamicComponentResolver.fromType(card_view_mapitem_component_1.CardViewMapItemComponent),
            'keyvaluepairs': dynamic_component_mapper_service_1.DynamicComponentResolver.fromType(card_view_keyvaluepairsitem_component_1.CardViewKeyValuePairsItemComponent)
        };
        return _this;
    }
    CardItemTypeService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CardItemTypeService);
    return CardItemTypeService;
}(dynamic_component_mapper_service_1.DynamicComponentMapper));
exports.CardItemTypeService = CardItemTypeService;
//# sourceMappingURL=card-item-types.service.js.map