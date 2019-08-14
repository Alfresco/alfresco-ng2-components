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
var JsonCellComponent = /** @class */ (function (_super) {
    __extends(JsonCellComponent, _super);
    function JsonCellComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JsonCellComponent.prototype.ngOnInit = function () {
        if (this.column && this.column.key && this.row && this.data) {
            this.value$.next(this.data.getValue(this.row, this.column));
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], JsonCellComponent.prototype, "copyContent", void 0);
    JsonCellComponent = __decorate([
        core_1.Component({
            selector: 'adf-json-cell',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n        <ng-container>\n            <span *ngIf=\"copyContent; else defaultJsonTemplate\" class=\"adf-datatable-cell-value\">\n                <pre\n                    class=\"adf-datatable-json-cell\"\n                    [adf-clipboard]=\"'CLIPBOARD.CLICK_TO_COPY'\"\n                    [clipboard-notification]=\"'CLIPBOARD.SUCCESS_COPY'\">{{ value$ | async | json }}</pre>\n            </span>\n        </ng-container>\n        <ng-template #defaultJsonTemplate>\n            <span class=\"adf-datatable-cell-value\">\n                <pre class=\"adf-datatable-json-cell\">{{ value$ | async | json }}</pre>\n            </span>\n        </ng-template>\n    ",
            styleUrls: ['./json-cell.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            host: { class: 'adf-datatable-content-cell' }
        })
    ], JsonCellComponent);
    return JsonCellComponent;
}(datatable_cell_component_1.DataTableCellComponent));
exports.JsonCellComponent = JsonCellComponent;
//# sourceMappingURL=json-cell.component.js.map