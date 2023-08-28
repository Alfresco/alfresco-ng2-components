/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable } from '@angular/core';
import { FindNodesQuery, NodePaging, QueriesApi, ResultSetPaging, SearchApi, SearchRequest } from '@alfresco/js-api';
import { Observable, Subject, from, throwError } from 'rxjs';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { SearchConfigurationService } from './search-configuration.service';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    dataLoaded: Subject<ResultSetPaging> = new Subject();

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

    constructor(private apiService: AlfrescoApiService, private searchConfigurationService: SearchConfigurationService) {}

    /**
     * Gets a list of nodes that match the given search criteria.
     *
     * @param term Term to search for
     * @param options Options for delivery of the search results
     * @returns List of nodes resulting from the search
     */
    getNodeQueryResults(term: string, options?: FindNodesQuery): Observable<NodePaging> {
        const promise = this.queriesApi.findNodes(term, options);

        promise
            .then((nodePaging) => {
                this.dataLoaded.next(nodePaging);
            })
            .catch((err) => this.handleError(err));

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

        promise
            .then((nodePaging) => {
                this.dataLoaded.next(nodePaging);
            })
            .catch((err) => this.handleError(err));

        return from(promise);
    }

    /**
     * Performs a search with its parameters supplied by a QueryBody object.
     *
     * @param queryBody Object containing the search parameters
     * @returns List of search results
     */
    searchByQueryBody(queryBody: SearchRequest): Observable<ResultSetPaging> {
        const promise = this.searchApi.search(queryBody);

        promise
            .then((nodePaging) => {
                this.dataLoaded.next(nodePaging);
            })
            .catch((err) => this.handleError(err));

        return from(promise);
    }

    private handleError(error: any): Observable<any> {
        return throwError(error || 'Server error');
    }
}
