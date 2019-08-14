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
var platform_browser_1 = require("@angular/platform-browser");
var app_config_service_1 = require("../app-config/app-config.service");
var translation_service_1 = require("./translation.service");
var PageTitleService = /** @class */ (function () {
    function PageTitleService(titleService, appConfig, translationService) {
        var _this = this;
        this.titleService = titleService;
        this.appConfig = appConfig;
        this.translationService = translationService;
        this.originalTitle = '';
        this.translatedTitle = '';
        translationService.translate.onLangChange.subscribe(function () { return _this.onLanguageChanged(); });
        translationService.translate.onTranslationChange.subscribe(function () { return _this.onLanguageChanged(); });
    }
    /**
     * Sets the page title.
     * @param value The new title
     */
    PageTitleService.prototype.setTitle = function (value) {
        if (value === void 0) { value = ''; }
        this.originalTitle = value;
        this.translatedTitle = this.translationService.instant(value);
        this.updateTitle();
    };
    PageTitleService.prototype.onLanguageChanged = function () {
        this.translatedTitle = this.translationService.instant(this.originalTitle);
        this.updateTitle();
    };
    PageTitleService.prototype.updateTitle = function () {
        var name = this.appConfig.get('application.name') || 'Alfresco ADF Application';
        var title = this.translatedTitle ? this.translatedTitle + " - " + name : "" + name;
        this.titleService.setTitle(title);
    };
    PageTitleService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [platform_browser_1.Title,
            app_config_service_1.AppConfigService,
            translation_service_1.TranslationService])
    ], PageTitleService);
    return PageTitleService;
}());
exports.PageTitleService = PageTitleService;
//# sourceMappingURL=page-title.service.js.map