/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { inject, Injectable } from '@angular/core';
import { NodePaging, QueriesApi, SearchRequest, ResultSetPaging, SearchApi } from '@alfresco/js-api';
import { Observable, Subject, from } from 'rxjs';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { SearchConfigurationService } from './search-configuration.service';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private apiService = inject(AlfrescoApiService);
    private searchConfigurationService = inject(SearchConfigurationService);

    dataLoaded = new Subject<ResultSetPaging>();

    private _queriesApi: QueriesApi;
    get queriesApi(): QueriesApi {
        this._queriesApi = this._queriesApi ?? new QueriesApi(this.apiService.getInstance());
        return this._queriesApi;
    }

    private _searchApi: SearchApi;
    get searchApi(): SearchApi {
        this._searchApi = this._searchApi ?? new SearchApi(this.apiService.getInstance());
        return this._searchApi;
    }

    /**
     * Gets a list of nodes that match the given search criteria.
     *
     * @param term Term to search for
     * @param options Options for delivery of the search results
     * @returns List of nodes resulting from the search
     */
    getNodeQueryResults(term: string, options?: SearchOptions): Observable<NodePaging> {
        const promise = this.queriesApi.findNodes(term, options);

        promise.then((nodePaging) => {
            this.dataLoaded.next(nodePaging);
        });

        return from(promise);
    }

    /**
     * Performs a search.
     *
     * @param searchTerm Term to search for
     * @param maxResults Maximum number of items in the list of results
     * @param skipCount Number of higher-ranked items to skip over in the list
     * @returns List of search results
     */
    search(searchTerm: string, maxResults: number, skipCount: number): Observable<ResultSetPaging> {
        const searchQuery = this.searchConfigurationService.generateQueryBody(searchTerm, maxResults, skipCount);
        const promise = this.searchApi.search(searchQuery);

        promise.then((nodePaging) => {
            this.dataLoaded.next(nodePaging);
        });

        return from(promise);
    }

    /**
     * Performs a search with its parameters supplied by a request object.
     *
     * @param queryBody Object containing the search parameters
     * @returns List of search results
     */
    searchByQueryBody(queryBody: SearchRequest): Observable<ResultSetPaging> {
        const promise = this.searchApi.search(queryBody);

        promise.then((nodePaging) => {
            this.dataLoaded.next(nodePaging);
        });

        return from(promise);
    }
}

export interface SearchOptions {
    /** The number of entities that exist in the collection before those included in this list. */
    skipCount?: number;

    /** The maximum number of items to return in the list. */
    maxItems?: number;

    /** The id of the node to start the search from. Supports the aliases -my-, -root- and -shared-. */
    rootNodeId?: string;

    /** Restrict the returned results to only those of the given node type and its sub-types. */
    nodeType?: string;

    /**
     * Return additional information about the node. The available optional fields are:
     * `allowableOperations`, `aspectNames`, `isLink`, `isLocked`, `path` and `properties`.
     */
    include?: string[];

    /**
     * String array to control the order of the entities returned in a list. You can use this
     * parameter to sort the list by one or more fields. Each field has a default sort order,
     * which is normally ascending order (but see the JS-API docs to check if any fields used
     * in a method have a descending default search order). To sort the entities in a specific
     * order, you can use the "ASC" and "DESC" keywords for any field.
     */
    orderBy?: string[];

    /**
     * List of field names. You can use this parameter to restrict the fields returned within
     * a response if, for example, you want to save on overall bandwidth. The list applies to a
     * returned individual entity or entries within a collection. If the API method also supports
     * the `include` parameter, then the fields specified in the include parameter are returned in
     * addition to those specified in the fields parameter.
     */
    fields?: string[];
}
