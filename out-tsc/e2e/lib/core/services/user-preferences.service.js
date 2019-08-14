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
var core_2 = require("@ngx-translate/core");
var rxjs_1 = require("rxjs");
var app_config_service_1 = require("../app-config/app-config.service");
var storage_service_1 = require("./storage.service");
var operators_1 = require("rxjs/operators");
var alfresco_api_service_1 = require("./alfresco-api.service");
var UserPreferenceValues;
(function (UserPreferenceValues) {
    UserPreferenceValues["PaginationSize"] = "paginationSize";
    UserPreferenceValues["Locale"] = "locale";
    UserPreferenceValues["SupportedPageSizes"] = "supportedPageSizes";
    UserPreferenceValues["ExpandedSideNavStatus"] = "expandedSidenav";
})(UserPreferenceValues = exports.UserPreferenceValues || (exports.UserPreferenceValues = {}));
var UserPreferencesService = /** @class */ (function () {
    function UserPreferencesService(translate, appConfig, storage, alfrescoApiService) {
        this.translate = translate;
        this.appConfig = appConfig;
        this.storage = storage;
        this.alfrescoApiService = alfrescoApiService;
        this.defaults = {
            paginationSize: 25,
            supportedPageSizes: [5, 10, 15, 20],
            locale: 'en',
            expandedSidenav: true
        };
        this.userPreferenceStatus = this.defaults;
        this.alfrescoApiService.alfrescoApiInitialized.subscribe(this.initUserPreferenceStatus.bind(this));
        this.onChangeSubject = new rxjs_1.BehaviorSubject(this.userPreferenceStatus);
        this.onChange = this.onChangeSubject.asObservable();
    }
    UserPreferencesService.prototype.initUserPreferenceStatus = function () {
        this.initUserLanguage();
        this.set(UserPreferenceValues.PaginationSize, this.paginationSize);
        this.set(UserPreferenceValues.SupportedPageSizes, JSON.stringify(this.supportedPageSizes));
    };
    UserPreferencesService.prototype.initUserLanguage = function () {
        if (this.locale || this.appConfig.get(UserPreferenceValues.Locale)) {
            var locale = this.locale || this.getDefaultLocale();
            this.set(UserPreferenceValues.Locale, locale);
            this.set('textOrientation', this.getLanguageByKey(locale).direction || 'ltr');
        }
        else {
            var locale = this.locale || this.getDefaultLocale();
            this.setWithoutStore(UserPreferenceValues.Locale, locale);
            this.setWithoutStore('textOrientation', this.getLanguageByKey(locale).direction || 'ltr');
        }
    };
    /**
     * Sets up a callback to notify when a property has changed.
     * @param property The property to watch
     * @returns Notification callback
     */
    UserPreferencesService.prototype.select = function (property) {
        return this.onChange
            .pipe(operators_1.map(function (userPreferenceStatus) { return userPreferenceStatus[property]; }), operators_1.distinctUntilChanged());
    };
    /**
     * Gets a preference property.
     * @param property Name of the property
     * @param defaultValue Default to return if the property is not found
     * @returns Preference property
     */
    UserPreferencesService.prototype.get = function (property, defaultValue) {
        var key = this.getPropertyKey(property);
        var value = this.storage.getItem(key);
        if (value === undefined || value === null) {
            return defaultValue;
        }
        return value;
    };
    /**
     * Sets a preference property.
     * @param property Name of the property
     * @param value New value for the property
     */
    UserPreferencesService.prototype.set = function (property, value) {
        if (!property) {
            return;
        }
        this.storage.setItem(this.getPropertyKey(property), value);
        this.userPreferenceStatus[property] = value;
        this.onChangeSubject.next(this.userPreferenceStatus);
    };
    /**
     * Sets a preference property.
     * @param property Name of the property
     * @param value New value for the property
     */
    UserPreferencesService.prototype.setWithoutStore = function (property, value) {
        if (!property) {
            return;
        }
        this.userPreferenceStatus[property] = value;
        this.onChangeSubject.next(this.userPreferenceStatus);
    };
    /**
     * Check if an item is present in the storage
     * @param property Name of the property
     * @returns True if the item is present, false otherwise
     */
    UserPreferencesService.prototype.hasItem = function (property) {
        if (!property) {
            return;
        }
        return this.storage.hasItem(this.getPropertyKey(property));
    };
    /**
     * Gets the active storage prefix for preferences.
     * @returns Storage prefix
     */
    UserPreferencesService.prototype.getStoragePrefix = function () {
        return this.storage.getItem('USER_PROFILE') || 'GUEST';
    };
    /**
     * Sets the active storage prefix for preferences.
     * @param value Name of the prefix
     */
    UserPreferencesService.prototype.setStoragePrefix = function (value) {
        this.storage.setItem('USER_PROFILE', value || 'GUEST');
        this.initUserPreferenceStatus();
    };
    /**
     * Gets the full property key with prefix.
     * @param property The property name
     * @returns Property key
     */
    UserPreferencesService.prototype.getPropertyKey = function (property) {
        return this.getStoragePrefix() + "__" + property;
    };
    Object.defineProperty(UserPreferencesService.prototype, "supportedPageSizes", {
        /**
         * Gets an array containing the available page sizes.
         * @returns Array of page size values
         */
        get: function () {
            var supportedPageSizes = this.get(UserPreferenceValues.SupportedPageSizes);
            if (supportedPageSizes) {
                return JSON.parse(supportedPageSizes);
            }
            else {
                return this.appConfig.get('pagination.supportedPageSizes', this.defaults.supportedPageSizes);
            }
        },
        set: function (value) {
            this.set(UserPreferenceValues.SupportedPageSizes, JSON.stringify(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserPreferencesService.prototype, "paginationSize", {
        get: function () {
            var paginationSize = this.get(UserPreferenceValues.PaginationSize);
            if (paginationSize) {
                return Number(paginationSize);
            }
            else {
                return Number(this.appConfig.get('pagination.size', this.defaults.paginationSize));
            }
        },
        /** Pagination size. */
        set: function (value) {
            this.set(UserPreferenceValues.PaginationSize, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserPreferencesService.prototype, "locale", {
        /** Current locale setting. */
        get: function () {
            return this.get(UserPreferenceValues.Locale);
        },
        set: function (value) {
            this.set(UserPreferenceValues.Locale, value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the default locale.
     * @returns Default locale language code
     */
    UserPreferencesService.prototype.getDefaultLocale = function () {
        return this.appConfig.get(UserPreferenceValues.Locale) || this.translate.getBrowserCultureLang() || 'en';
    };
    UserPreferencesService.prototype.getLanguageByKey = function (key) {
        return (this.appConfig
            .get(app_config_service_1.AppConfigValues.APP_CONFIG_LANGUAGES_KEY, [{ key: 'en' }])
            .find(function (language) { return key.includes(language.key); }) || { key: 'en' });
    };
    UserPreferencesService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [core_2.TranslateService,
            app_config_service_1.AppConfigService,
            storage_service_1.StorageService,
            alfresco_api_service_1.AlfrescoApiService])
    ], UserPreferencesService);
    return UserPreferencesService;
}());
exports.UserPreferencesService = UserPreferencesService;
//# sourceMappingURL=user-preferences.service.js.map