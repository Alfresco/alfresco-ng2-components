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
var alfresco_api_service_1 = require("../../../services/alfresco-api.service");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var DataTableCellComponent = /** @class */ (function () {
    function DataTableCellComponent(alfrescoApiService) {
        this.alfrescoApiService = alfrescoApiService;
        this.value$ = new rxjs_1.BehaviorSubject('');
        this.onDestroy$ = new rxjs_1.Subject();
    }
    DataTableCellComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.updateValue();
        this.alfrescoApiService.nodeUpdated
            .pipe(operators_1.takeUntil(this.onDestroy$))
            .subscribe(function (node) {
            if (_this.row) {
                if (_this.row['node'].entry.id === node.id) {
                    _this.row['node'].entry = node;
                    _this.row['cache'][_this.column.key] = _this.column.key.split('.').reduce(function (source, key) { return source[key]; }, node);
                    _this.updateValue();
                }
            }
        });
    };
    DataTableCellComponent.prototype.updateValue = function () {
        if (this.column && this.column.key && this.row && this.data) {
            var value = this.data.getValue(this.row, this.column);
            this.value$.next(value);
            if (!this.tooltip) {
                this.tooltip = value;
            }
        }
    };
    DataTableCellComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], DataTableCellComponent.prototype, "data", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], DataTableCellComponent.prototype, "column", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], DataTableCellComponent.prototype, "row", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], DataTableCellComponent.prototype, "copyContent", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataTableCellComponent.prototype, "tooltip", void 0);
    DataTableCellComponent = __decorate([
        core_1.Component({
            selector: 'adf-datatable-cell',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n        <ng-container>\n            <span *ngIf=\"copyContent; else defaultCell\"\n                adf-clipboard=\"CLIPBOARD.CLICK_TO_COPY\"\n                [clipboard-notification]=\"'CLIPBOARD.SUCCESS_COPY'\"\n                [attr.aria-label]=\"value$ | async\"\n                [title]=\"tooltip\"\n                class=\"adf-datatable-cell-value\"\n                >{{ value$ | async }}</span>\n        </ng-container>\n        <ng-template #defaultCell>\n            <span\n                [attr.aria-label]=\"value$ | async\"\n                [title]=\"tooltip\"\n                class=\"adf-datatable-cell-value\"\n            >{{ value$ | async }}</span>\n        </ng-template>\n    ",
            encapsulation: core_1.ViewEncapsulation.None,
            host: { class: 'adf-datatable-content-cell' }
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService])
    ], DataTableCellComponent);
    return DataTableCellComponent;
}());
exports.DataTableCellComponent = DataTableCellComponent;
//# sourceMappingURL=datatable-cell.component.js.map