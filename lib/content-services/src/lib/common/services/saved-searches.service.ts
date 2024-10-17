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
import { AuthenticationService } from '@alfresco/adf-core';

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

    readonly savedSearches$ = new ReplaySubject<SavedSearch[]>(1);

    private savedSearchFileNodeId: string;
    private currentUserLocalStorageKey: string;
    private createFileAttempt = false;

    constructor(private readonly apiService: AlfrescoApiService, private readonly authService: AuthenticationService) {}

    innit(): void {
        this.fetchSavedSearches();
    }

    /**
     * Gets a list of saved searches by user.
     *
     * @returns SavedSearch list containing user saved searches
     */
    getSavedSearches(): Observable<SavedSearch[]> {
        return this.getSavedSearchesNodeId().pipe(
            concatMap(() => {
                return from(
                    this.nodesApi.getNodeContent(this.savedSearchFileNodeId).then((content) => this.mapFileContentToSavedSearches(content))
                ).pipe(
                    catchError((error) => {
                        if (!this.createFileAttempt) {
                            this.createFileAttempt = true;
                            localStorage.removeItem(this.getLocalStorageKey());
                            return this.getSavedSearches();
                        }
                        return throwError(() => error);
                    })
                );
            })
        );
    }

    /**
     * Gets a list of saved searches by user.
     *
     * @param newSaveSearch object { name: string, description: string, encodedUrl: string }
     * @returns Adds and saves search also updating current saved search state
     */
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
        const localStorageKey = this.getLocalStorageKey();
        if (this.currentUserLocalStorageKey && this.currentUserLocalStorageKey !== localStorageKey) {
            this.savedSearches$.next([]);
        }
        this.currentUserLocalStorageKey = localStorageKey;
        let savedSearchesNodeId = localStorage.getItem(this.currentUserLocalStorageKey) ?? '';
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
                                localStorage.setItem(this.currentUserLocalStorageKey, savedSearchesNodeId);
                            } else {
                                return this.createSavedSearchesNode(parentNodeId).pipe(
                                    first(),
                                    map((node) => {
                                        localStorage.setItem(this.currentUserLocalStorageKey, node.entry.id);
                                        return node.entry.id;
                                    })
                                );
                            }
                            this.savedSearchFileNodeId = savedSearchesNodeId;
                            return savedSearchesNodeId;
                        })
                    )
                )
            );
        } else {
            this.savedSearchFileNodeId = savedSearchesNodeId;
            return of(savedSearchesNodeId);
        }
    }
    private createSavedSearchesNode(parentNodeId: string): Observable<NodeEntry> {
        return from(this.nodesApi.createNode(parentNodeId, { name: 'saved-searches.json', nodeType: 'cm:content' }));
    }

    private async mapFileContentToSavedSearches(blob: Blob): Promise<Array<SavedSearch>> {
        return blob.text().then((content) => (content ? JSON.parse(content) : []));
    }

    private getLocalStorageKey(): string {
        return `saved-searches-node-id__${this.authService.getUsername()}`;
    }

    private fetchSavedSearches(): void {
        this.getSavedSearches()
            .pipe(take(1))
            .subscribe((searches) => this.savedSearches$.next(searches));
    }
}
