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
var SearchConfigurationService = /** @class */ (function () {
    function SearchConfigurationService() {
    }
    /**
     * Generates a QueryBody object with custom search parameters.
     * @param searchTerm Term text to search for
     * @param maxResults Maximum number of search results to show in a page
     * @param skipCount The offset of the start of the page within the results list
     * @returns Query body defined by the parameters
     */
    SearchConfigurationService.prototype.generateQueryBody = function (searchTerm, maxResults, skipCount) {
        var defaultQueryBody = {
            query: {
                query: searchTerm ? "'" + searchTerm + "*' OR name:'" + searchTerm + "*'" : searchTerm
            },
            include: ['path', 'allowableOperations'],
            paging: {
                maxItems: maxResults,
                skipCount: skipCount
            },
            filterQueries: [
                { query: "TYPE:'cm:folder' OR TYPE:'cm:content'" },
                { query: 'NOT cm:creator:System' }
            ]
        };
        return defaultQueryBody;
    };
    SearchConfigurationService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], SearchConfigurationService);
    return SearchConfigurationService;
}());
exports.SearchConfigurationService = SearchConfigurationService;
//# sourceMappingURL=search-configuration.service.js.map