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
var search_configuration_service_1 = require("./search-configuration.service");
var SearchService = /** @class */ (function () {
    function SearchService(apiService, searchConfigurationService) {
        this.apiService = apiService;
        this.searchConfigurationService = searchConfigurationService;
        this.dataLoaded = new rxjs_1.Subject();
    }
    /**
     * Gets a list of nodes that match the given search criteria.
     * @param term Term to search for
     * @param options Options for delivery of the search results
     * @returns List of nodes resulting from the search
     */
    SearchService.prototype.getNodeQueryResults = function (term, options) {
        var _this = this;
        var promise = this.apiService.getInstance().core.queriesApi.findNodes(term, options);
        promise.then(function (nodePaging) {
            _this.dataLoaded.next(nodePaging);
        }).catch(function (err) { return _this.handleError(err); });
        return rxjs_1.from(promise);
    };
    /**
     * Performs a search.
     * @param searchTerm Term to search for
     * @param maxResults Maximum number of items in the list of results
     * @param skipCount Number of higher-ranked items to skip over in the list
     * @returns List of search results
     */
    SearchService.prototype.search = function (searchTerm, maxResults, skipCount) {
        var _this = this;
        var searchQuery = Object.assign(this.searchConfigurationService.generateQueryBody(searchTerm, maxResults, skipCount));
        var promise = this.apiService.getInstance().search.searchApi.search(searchQuery);
        promise.then(function (nodePaging) {
            _this.dataLoaded.next(nodePaging);
        }).catch(function (err) { return _this.handleError(err); });
        return rxjs_1.from(promise);
    };
    /**
     * Performs a search with its parameters supplied by a QueryBody object.
     * @param queryBody Object containing the search parameters
     * @returns List of search results
     */
    SearchService.prototype.searchByQueryBody = function (queryBody) {
        var _this = this;
        var promise = this.apiService.getInstance().search.searchApi.search(queryBody);
        promise.then(function (nodePaging) {
            _this.dataLoaded.next(nodePaging);
        }).catch(function (err) { return _this.handleError(err); });
        return rxjs_1.from(promise);
    };
    SearchService.prototype.handleError = function (error) {
        return rxjs_1.throwError(error || 'Server error');
    };
    SearchService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            search_configuration_service_1.SearchConfigurationService])
    ], SearchService);
    return SearchService;
}());
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map