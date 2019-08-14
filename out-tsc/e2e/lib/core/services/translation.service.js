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
var core_2 = require("@ngx-translate/core");
var user_preferences_service_1 = require("./user-preferences.service");
exports.TRANSLATION_PROVIDER = new core_1.InjectionToken('Injection token for translation providers.');
var TranslationService = /** @class */ (function () {
    function TranslationService(translate, userPreferencesService, providers) {
        var _this = this;
        this.translate = translate;
        this.customLoader = this.translate.currentLoader;
        this.defaultLang = 'en';
        translate.setDefaultLang(this.defaultLang);
        this.customLoader.setDefaultLang(this.defaultLang);
        if (providers && providers.length > 0) {
            for (var _i = 0, providers_1 = providers; _i < providers_1.length; _i++) {
                var provider = providers_1[_i];
                this.addTranslationFolder(provider.name, provider.source);
            }
        }
        userPreferencesService.select(user_preferences_service_1.UserPreferenceValues.Locale).subscribe(function (locale) {
            if (locale) {
                _this.userLang = locale;
                _this.use(_this.userLang);
            }
        });
    }
    /**
     * Adds a new folder of translation source files.
     * @param name Name for the translation provider
     * @param path Path to the folder
     */
    TranslationService.prototype.addTranslationFolder = function (name, path) {
        if (name === void 0) { name = ''; }
        if (path === void 0) { path = ''; }
        if (!this.customLoader.providerRegistered(name)) {
            this.customLoader.registerProvider(name, path);
            if (this.userLang) {
                this.loadTranslation(this.userLang, this.defaultLang);
            }
            else {
                this.loadTranslation(this.defaultLang);
            }
        }
    };
    /**
     * Loads a translation file.
     * @param lang Language code for the language to load
     * @param fallback Language code to fall back to if the first one was unavailable
     */
    TranslationService.prototype.loadTranslation = function (lang, fallback) {
        var _this = this;
        this.translate.getTranslation(lang).subscribe(function () {
            _this.translate.use(lang);
            _this.onTranslationChanged(lang);
        }, function () {
            if (fallback && fallback !== lang) {
                _this.loadTranslation(fallback);
            }
        });
    };
    /**
     * Triggers a notification callback when the translation language changes.
     * @param lang The new language code
     */
    TranslationService.prototype.onTranslationChanged = function (lang) {
        this.translate.onTranslationChange.next({
            lang: lang,
            translations: this.customLoader.getFullTranslationJSON(lang)
        });
    };
    /**
     * Sets the target language for translations.
     * @param lang Code name for the language
     * @returns Translations available for the language
     */
    TranslationService.prototype.use = function (lang) {
        this.customLoader.init(lang);
        return this.translate.use(lang);
    };
    /**
     * Gets the translation for the supplied key.
     * @param key Key to translate
     * @param interpolateParams String(s) to be interpolated into the main message
     * @returns Translated text
     */
    TranslationService.prototype.get = function (key, interpolateParams) {
        return this.translate.get(key, interpolateParams);
    };
    /**
     * Directly returns the translation for the supplied key.
     * @param key Key to translate
     * @param interpolateParams String(s) to be interpolated into the main message
     * @returns Translated text
     */
    TranslationService.prototype.instant = function (key, interpolateParams) {
        return key ? this.translate.instant(key, interpolateParams) : '';
    };
    TranslationService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __param(2, core_1.Optional()), __param(2, core_1.Inject(exports.TRANSLATION_PROVIDER)),
        __metadata("design:paramtypes", [core_2.TranslateService,
            user_preferences_service_1.UserPreferencesService, Array])
    ], TranslationService);
    return TranslationService;
}());
exports.TranslationService = TranslationService;
//# sourceMappingURL=translation.service.js.map