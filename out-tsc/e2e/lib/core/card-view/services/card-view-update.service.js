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
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
function transformKeyToObject(key, value) {
    var objectLevels = key.split('.').reverse();
    return objectLevels.reduce(function (previousValue, currentValue) {
        var _a;
        return _a = {}, _a[currentValue] = previousValue, _a;
    }, value);
}
exports.transformKeyToObject = transformKeyToObject;
var CardViewUpdateService = /** @class */ (function () {
    function CardViewUpdateService() {
        this.itemUpdated$ = new rxjs_1.Subject();
        this.itemClicked$ = new rxjs_1.Subject();
    }
    CardViewUpdateService.prototype.update = function (property, newValue) {
        this.itemUpdated$.next({
            target: property,
            changed: transformKeyToObject(property.key, newValue)
        });
    };
    CardViewUpdateService.prototype.clicked = function (property) {
        this.itemClicked$.next({
            target: property
        });
    };
    CardViewUpdateService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CardViewUpdateService);
    return CardViewUpdateService;
}());
exports.CardViewUpdateService = CardViewUpdateService;
//# sourceMappingURL=card-view-update.service.js.map