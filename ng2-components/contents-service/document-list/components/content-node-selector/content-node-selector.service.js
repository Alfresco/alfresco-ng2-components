"use strict";
/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
/**
 * Internal service used by ContentNodeSelector component.
 */
var ContentNodeSelectorService = (function () {
    function ContentNodeSelectorService(searchService) {
        this.searchService = searchService;
    }
    /**
     * Performs a search for content node selection
     *
     * @param searchTerm    The term to search for
     * @param skipCount     From where to start the loading
     * @param rootNodeId    The root is to start the search from
     * @param maxItems      How many items to load
     */
    ContentNodeSelectorService.prototype.search = function (searchTerm, rootNodeId, skipCount, maxItems) {
        searchTerm = searchTerm + '*';
        var searchOpts = {
            include: ['path', 'allowableOperations'],
            skipCount: skipCount,
            rootNodeId: rootNodeId,
            nodeType: 'cm:folder',
            maxItems: maxItems,
            orderBy: null
        };
        return this.searchService.getNodeQueryResults(searchTerm, searchOpts);
    };
    ContentNodeSelectorService = __decorate([
        core_1.Injectable()
    ], ContentNodeSelectorService);
    return ContentNodeSelectorService;
}());
exports.ContentNodeSelectorService = ContentNodeSelectorService;
