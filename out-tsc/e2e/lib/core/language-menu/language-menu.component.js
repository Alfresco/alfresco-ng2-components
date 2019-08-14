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
var app_config_service_1 = require("../app-config/app-config.service");
var user_preferences_service_1 = require("../services/user-preferences.service");
var LanguageMenuComponent = /** @class */ (function () {
    function LanguageMenuComponent(appConfig, userPreference) {
        this.appConfig = appConfig;
        this.userPreference = userPreference;
        this.languages = [
            { key: 'en', label: 'English' }
        ];
    }
    LanguageMenuComponent.prototype.ngOnInit = function () {
        var languagesConfigApp = this.appConfig.get(app_config_service_1.AppConfigValues.APP_CONFIG_LANGUAGES_KEY);
        if (languagesConfigApp) {
            this.languages = languagesConfigApp;
        }
    };
    LanguageMenuComponent.prototype.changeLanguage = function (language) {
        this.userPreference.locale = language.key;
        this.userPreference.set('textOrientation', language.direction || 'ltr');
    };
    LanguageMenuComponent = __decorate([
        core_1.Component({
            selector: 'adf-language-menu',
            templateUrl: 'language-menu.component.html'
        }),
        __metadata("design:paramtypes", [app_config_service_1.AppConfigService,
            user_preferences_service_1.UserPreferencesService])
    ], LanguageMenuComponent);
    return LanguageMenuComponent;
}());
exports.LanguageMenuComponent = LanguageMenuComponent;
//# sourceMappingURL=language-menu.component.js.map