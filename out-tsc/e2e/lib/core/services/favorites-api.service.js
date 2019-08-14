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
var rxjs_1 = require("rxjs");
var alfresco_api_service_1 = require("./alfresco-api.service");
var user_preferences_service_1 = require("./user-preferences.service");
var operators_1 = require("rxjs/operators");
var FavoritesApiService = /** @class */ (function () {
    function FavoritesApiService(apiService, preferences) {
        this.apiService = apiService;
        this.preferences = preferences;
    }
    FavoritesApiService_1 = FavoritesApiService;
    FavoritesApiService.remapEntry = function (_a) {
        var entry = _a.entry;
        entry.properties = {
            'cm:title': entry.title,
            'cm:description': entry.description
        };
        return { entry: entry };
    };
    FavoritesApiService.prototype.remapFavoritesData = function (data) {
        if (data === void 0) { data = {}; }
        var list = (data.list || {});
        var pagination = (list.pagination || {});
        var entries = this
            .remapFavoriteEntries(list.entries || []);
        return {
            list: { entries: entries, pagination: pagination }
        };
    };
    FavoritesApiService.prototype.remapFavoriteEntries = function (entries) {
        return entries
            .map(function (_a) {
            var target = _a.entry.target;
            return ({
                entry: target.file || target.folder
            });
        })
            .filter(function (_a) {
            var entry = _a.entry;
            return (!!entry);
        })
            .map(FavoritesApiService_1.remapEntry);
    };
    Object.defineProperty(FavoritesApiService.prototype, "favoritesApi", {
        get: function () {
            return this.apiService.getInstance().core.favoritesApi;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the favorites for a user.
     * @param personId ID of the user
     * @param options Options supported by JS-API
     * @returns List of favorites
     */
    FavoritesApiService.prototype.getFavorites = function (personId, options) {
        var defaultOptions = {
            maxItems: this.preferences.paginationSize,
            skipCount: 0,
            where: '(EXISTS(target/file) OR EXISTS(target/folder))',
            include: ['properties', 'allowableOperations']
        };
        var queryOptions = Object.assign(defaultOptions, options);
        var promise = this.favoritesApi
            .getFavorites(personId, queryOptions)
            .then(this.remapFavoritesData);
        return rxjs_1.from(promise).pipe(operators_1.catchError(function (err) { return rxjs_1.of(err); }));
    };
    var FavoritesApiService_1;
    FavoritesApiService = FavoritesApiService_1 = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            user_preferences_service_1.UserPreferencesService])
    ], FavoritesApiService);
    return FavoritesApiService;
}());
exports.FavoritesApiService = FavoritesApiService;
//# sourceMappingURL=favorites-api.service.js.map