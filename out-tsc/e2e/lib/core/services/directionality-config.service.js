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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var bidi_1 = require("@angular/cdk/bidi");
var user_preferences_service_1 = require("../services/user-preferences.service");
var platform_browser_1 = require("@angular/platform-browser");
var DirectionalityConfigService = /** @class */ (function () {
    function DirectionalityConfigService(document, rendererFactory, userPreferencesService, directionality) {
        var _this = this;
        this.document = document;
        this.rendererFactory = rendererFactory;
        this.userPreferencesService = userPreferencesService;
        this.directionality = directionality;
        var renderer = this.rendererFactory.createRenderer(null, null);
        this.userPreferencesService
            .select('textOrientation')
            .subscribe(function (direction) {
            renderer.setAttribute(_this.document.body, 'dir', direction);
            _this.directionality.value = direction;
        });
    }
    DirectionalityConfigService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __param(0, core_1.Inject(platform_browser_1.DOCUMENT)),
        __metadata("design:paramtypes", [Object, core_1.RendererFactory2,
            user_preferences_service_1.UserPreferencesService,
            bidi_1.Directionality])
    ], DirectionalityConfigService);
    return DirectionalityConfigService;
}());
exports.DirectionalityConfigService = DirectionalityConfigService;
//# sourceMappingURL=directionality-config.service.js.map