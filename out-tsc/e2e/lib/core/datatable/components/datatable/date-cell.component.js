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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var datatable_cell_component_1 = require("./datatable-cell.component");
var user_preferences_service_1 = require("../../../services/user-preferences.service");
var alfresco_api_service_1 = require("../../../services/alfresco-api.service");
var app_config_service_1 = require("../../../app-config/app-config.service");
var operators_1 = require("rxjs/operators");
var DateCellComponent = /** @class */ (function (_super) {
    __extends(DateCellComponent, _super);
    function DateCellComponent(userPreferenceService, alfrescoApiService, appConfig) {
        var _this = _super.call(this, alfrescoApiService) || this;
        _this.dateFormat = appConfig.get('dateValues.defaultDateFormat', DateCellComponent_1.DATE_FORMAT);
        if (userPreferenceService) {
            userPreferenceService
                .select(user_preferences_service_1.UserPreferenceValues.Locale)
                .pipe(operators_1.takeUntil(_this.onDestroy$))
                .subscribe(function (locale) { return _this.currentLocale = locale; });
        }
        return _this;
    }
    DateCellComponent_1 = DateCellComponent;
    Object.defineProperty(DateCellComponent.prototype, "format", {
        get: function () {
            if (this.column) {
                return this.column.format || this.dateFormat;
            }
            return this.dateFormat;
        },
        enumerable: true,
        configurable: true
    });
    var DateCellComponent_1;
    DateCellComponent.DATE_FORMAT = 'medium';
    DateCellComponent = DateCellComponent_1 = __decorate([
        core_1.Component({
            selector: 'adf-date-cell',
            template: "\n        <ng-container>\n            <span\n                [attr.aria-label]=\"value$ | async | adfTimeAgo: currentLocale\"\n                title=\"{{ tooltip | adfLocalizedDate: 'medium' }}\"\n                class=\"adf-datatable-cell-value\"\n                *ngIf=\"format === 'timeAgo'; else standard_date\">\n                {{ value$ | async | adfTimeAgo: currentLocale }}\n            </span>\n        </ng-container>\n        <ng-template #standard_date>\n            <span\n                class=\"adf-datatable-cell-value\"\n                title=\"{{ tooltip | adfLocalizedDate: format }}\"\n                class=\"adf-datatable-cell-value\"\n                [attr.aria-label]=\"value$ | async | adfLocalizedDate: format\">\n                {{ value$ | async | adfLocalizedDate: format }}\n            </span>\n        </ng-template>\n    ",
            encapsulation: core_1.ViewEncapsulation.None,
            host: { class: 'adf-date-cell adf-datatable-content-cell' }
        }),
        __metadata("design:paramtypes", [user_preferences_service_1.UserPreferencesService,
            alfresco_api_service_1.AlfrescoApiService,
            app_config_service_1.AppConfigService])
    ], DateCellComponent);
    return DateCellComponent;
}(datatable_cell_component_1.DataTableCellComponent));
exports.DateCellComponent = DateCellComponent;
//# sourceMappingURL=date-cell.component.js.map