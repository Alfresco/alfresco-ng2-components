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
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var core_2 = require("@mat-datetimepicker/core");
var flex_layout_1 = require("@angular/flex-layout");
var core_3 = require("@ngx-translate/core");
var card_view_content_proxy_directive_1 = require("./directives/card-view-content-proxy.directive");
var card_view_component_1 = require("./components/card-view/card-view.component");
var card_view_boolitem_component_1 = require("./components/card-view-boolitem/card-view-boolitem.component");
var card_view_dateitem_component_1 = require("./components/card-view-dateitem/card-view-dateitem.component");
var card_view_item_dispatcher_component_1 = require("./components/card-view-item-dispatcher/card-view-item-dispatcher.component");
var card_view_mapitem_component_1 = require("./components/card-view-mapitem/card-view-mapitem.component");
var card_view_textitem_component_1 = require("./components/card-view-textitem/card-view-textitem.component");
var card_view_keyvaluepairsitem_component_1 = require("./components/card-view-keyvaluepairsitem/card-view-keyvaluepairsitem.component");
var card_view_selectitem_component_1 = require("./components/card-view-selectitem/card-view-selectitem.component");
var CardViewModule = /** @class */ (function () {
    function CardViewModule() {
    }
    CardViewModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                flex_layout_1.FlexLayoutModule,
                core_3.TranslateModule.forChild(),
                material_1.MatDatepickerModule,
                material_1.MatNativeDateModule,
                material_1.MatCheckboxModule,
                material_1.MatInputModule,
                material_1.MatTableModule,
                material_1.MatIconModule,
                material_1.MatSelectModule,
                material_1.MatButtonModule,
                core_2.MatDatetimepickerModule,
                core_2.MatNativeDatetimeModule
            ],
            declarations: [
                card_view_component_1.CardViewComponent,
                card_view_boolitem_component_1.CardViewBoolItemComponent,
                card_view_dateitem_component_1.CardViewDateItemComponent,
                card_view_mapitem_component_1.CardViewMapItemComponent,
                card_view_textitem_component_1.CardViewTextItemComponent,
                card_view_keyvaluepairsitem_component_1.CardViewKeyValuePairsItemComponent,
                card_view_selectitem_component_1.CardViewSelectItemComponent,
                card_view_item_dispatcher_component_1.CardViewItemDispatcherComponent,
                card_view_content_proxy_directive_1.CardViewContentProxyDirective
            ],
            entryComponents: [
                card_view_boolitem_component_1.CardViewBoolItemComponent,
                card_view_dateitem_component_1.CardViewDateItemComponent,
                card_view_mapitem_component_1.CardViewMapItemComponent,
                card_view_textitem_component_1.CardViewTextItemComponent,
                card_view_selectitem_component_1.CardViewSelectItemComponent,
                card_view_keyvaluepairsitem_component_1.CardViewKeyValuePairsItemComponent
            ],
            exports: [
                card_view_component_1.CardViewComponent,
                card_view_boolitem_component_1.CardViewBoolItemComponent,
                card_view_dateitem_component_1.CardViewDateItemComponent,
                card_view_mapitem_component_1.CardViewMapItemComponent,
                card_view_textitem_component_1.CardViewTextItemComponent,
                card_view_selectitem_component_1.CardViewSelectItemComponent,
                card_view_keyvaluepairsitem_component_1.CardViewKeyValuePairsItemComponent
            ]
        })
    ], CardViewModule);
    return CardViewModule;
}());
exports.CardViewModule = CardViewModule;
//# sourceMappingURL=card-view.module.js.map