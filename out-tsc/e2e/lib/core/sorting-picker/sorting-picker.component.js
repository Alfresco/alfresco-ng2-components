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
var SortingPickerComponent = /** @class */ (function () {
    function SortingPickerComponent() {
        /** Available sorting options */
        this.options = [];
        /** Current sorting direction */
        this.ascending = true;
        /** Raised each time sorting key gets changed. */
        this.valueChange = new core_1.EventEmitter();
        /** Raised each time direction gets changed. */
        this.sortingChange = new core_1.EventEmitter();
    }
    SortingPickerComponent.prototype.onOptionChanged = function (event) {
        this.selected = event.value;
        this.valueChange.emit(this.selected);
    };
    SortingPickerComponent.prototype.toggleSortDirection = function () {
        this.ascending = !this.ascending;
        this.sortingChange.emit(this.ascending);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], SortingPickerComponent.prototype, "options", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], SortingPickerComponent.prototype, "selected", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SortingPickerComponent.prototype, "ascending", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], SortingPickerComponent.prototype, "valueChange", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], SortingPickerComponent.prototype, "sortingChange", void 0);
    SortingPickerComponent = __decorate([
        core_1.Component({
            selector: 'adf-sorting-picker',
            templateUrl: './sorting-picker.component.html',
            encapsulation: core_1.ViewEncapsulation.None,
            host: { class: 'adf-sorting-picker' }
        })
    ], SortingPickerComponent);
    return SortingPickerComponent;
}());
exports.SortingPickerComponent = SortingPickerComponent;
//# sourceMappingURL=sorting-picker.component.js.map