/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NodesApi, NodeEntry, SearchApi, SEARCH_LANGUAGE, ResultSetPaging } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { concatMap, first, map } from 'rxjs/operators';
import { AlfrescoApiService } from '../../services/alfresco-api.service';

@Injectable({
    providedIn: 'root'
})
export class SavedSearchesService {
    private _searchApi: SearchApi;
    get searchApi(): SearchApi {
        this._searchApi = this._searchApi ?? new SearchApi(this.apiService.getInstance());
        return this._searchApi;
    }

    private _nodesApi: NodesApi;
    get nodesApi(): NodesApi {
        this._nodesApi = this._nodesApi ?? new NodesApi(this.apiService.getInstance());
        return this._nodesApi;
    }

    readonly SAVED_SEARCHES_NODE_ID = 'saved-searches-node-id';

    constructor(private apiService: AlfrescoApiService) {}

    getSavedSearches() {
        return this.getSavedSearchesNodeId().pipe(concatMap((nodeId) => from(this.nodesApi.getNodeContent(nodeId))));
    }

    getSavedSearchesNodeId(): Observable<string> {
        let savedSearchesNodeId = localStorage.getItem(this.SAVED_SEARCHES_NODE_ID) ?? '';
        if (savedSearchesNodeId === '') {
            return from(this.nodesApi.getNode('-my-')).pipe(
                first(),
                map((node) => node.entry.id),
                concatMap((parentNodeId) =>
                    from(
                        this.searchApi.search({
                            query: {
                                language: SEARCH_LANGUAGE.AFTS,
                                query: `cm:name:"saved-searches.json" AND PARENT:"${parentNodeId}"`
                            }
                        })
                    ).pipe(
                        first(),
                        concatMap((searchResult: ResultSetPaging) => {
                            if (searchResult.list.entries.length > 0) {
                                savedSearchesNodeId = searchResult.list.entries[0].entry.id;
                                localStorage.setItem(this.SAVED_SEARCHES_NODE_ID, savedSearchesNodeId);
                            } else {
                                return this.createSavedSearchesNode(parentNodeId).pipe(
                                    first(),
                                    map((node) => {
                                        localStorage.setItem(this.SAVED_SEARCHES_NODE_ID, node.entry.id);
                                        return node.entry.id;
                                    })
                                );
                            }
                            return savedSearchesNodeId;
                        })
                    )
                )
            );
        } else {
            return of(savedSearchesNodeId);
        }
    }

    private createSavedSearchesNode(parentNodeId: string): Observable<NodeEntry> {
        return from(
            this.nodesApi.createNode(parentNodeId, {
                name: 'saved-searches.json',
                nodeType: 'cm:content'
                //TODO request fails with this aspect, probably different namespace to be used??
                // aspectNames: ['sys:hidden']
            })
        );
    }
}
