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
import { Observable, of, from, ReplaySubject, throwError } from 'rxjs';
import { catchError, concatMap, first, map, switchMap, take, tap } from 'rxjs/operators';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { SavedSearch } from '../interfaces/saved-search.interface';

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

    private savedSearchFileNodeId: string;
    private createFileAttempt = false;

    readonly SAVED_SEARCHES_NODE_ID = 'saved-searches-node-id';

    savedSearches$ = new ReplaySubject<SavedSearch[]>(1);

    constructor(private apiService: AlfrescoApiService) {
        this.getSavedSearches()
            .pipe(take(1))
            .subscribe((searches) => this.savedSearches$.next(searches));
    }

    getSavedSearches(): Observable<SavedSearch[]> {
        return this.getSavedSearchesNodeId().pipe(
            concatMap((nodeId) => {
                this.savedSearchFileNodeId = nodeId;
                return from(this.nodesApi.getNodeContent(nodeId).then((content) => this.mapFileContentToSavedSearches(content))).pipe(
                    catchError((error) => {
                        if (!this.createFileAttempt) {
                            this.createFileAttempt = true;
                            localStorage.removeItem(this.SAVED_SEARCHES_NODE_ID);
                            return this.getSavedSearches();
                        }
                        return throwError(() => error);
                    })
                );
            })
        );
    }

    saveSearch(newSaveSearch: Pick<SavedSearch, 'name' | 'description' | 'encodedUrl'>): Observable<NodeEntry> {
        return this.getSavedSearches().pipe(
            take(1),
            switchMap((savedSearches: Array<SavedSearch>) => {
                const updatedSavedSearches = [...savedSearches, { ...newSaveSearch, order: savedSearches.length }];
                return from(this.nodesApi.updateNodeContent(this.savedSearchFileNodeId, JSON.stringify(updatedSavedSearches))).pipe(
                    tap(() => this.savedSearches$.next(updatedSavedSearches))
                );
            })
        );
    }

    private getSavedSearchesNodeId(): Observable<string> {
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
            })
        );
    }

    private async mapFileContentToSavedSearches(blob: Blob): Promise<Array<SavedSearch>> {
        return blob.text().then((content) => (content ? JSON.parse(content) : []));
    }
}
