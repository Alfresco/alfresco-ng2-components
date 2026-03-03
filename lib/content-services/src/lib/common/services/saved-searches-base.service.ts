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
import { SavedSearchStrategy } from '../interfaces/saved-searches-strategy.interface';
import { AuthenticationService } from '@alfresco/adf-core';
import { ReplaySubject, Observable, catchError, switchMap, take, tap, throwError, map } from 'rxjs';
import { LazyApi, NodeEntry, NodesApi } from '@alfresco/js-api';
import { SavedSearch } from '../interfaces/saved-search.interface';
import { AlfrescoApiService } from '../../services';

@Injectable()
export abstract class SavedSearchesBaseService implements SavedSearchStrategy {
    private static readonly SAVE_MODE_THRESHOLD = 5;

    protected readonly _savedSearches$ = new ReplaySubject<SavedSearch[]>(1);
    readonly savedSearches$: Observable<SavedSearch[]> = this._savedSearches$.asObservable();

    protected readonly apiService = inject(AlfrescoApiService);
    protected readonly authService = inject(AuthenticationService);

    @LazyApi((self: SavedSearchesBaseService) => new NodesApi(self.apiService.getInstance()))
    nodesApi: NodesApi;

    protected abstract fetchAllSavedSearches(): Observable<SavedSearch[]>;
    protected abstract updateSavedSearches(searches: SavedSearch[]): Observable<NodeEntry>;

    init(): void {
        this.fetchSavedSearches();
    }

    getSavedSearches(): Observable<SavedSearch[]> {
        return this.fetchAllSavedSearches();
    }

    saveSearch(newSaveSearch: Pick<SavedSearch, 'name' | 'description' | 'encodedUrl'>): Observable<NodeEntry> {
        const limit = SavedSearchesBaseService.SAVE_MODE_THRESHOLD;
        return this.fetchAllSavedSearches().pipe(
            take(1),
            switchMap((savedSearches) => {
                let updatedSavedSearches: SavedSearch[] = [];

                if (savedSearches.length < limit) {
                    updatedSavedSearches = [{ ...newSaveSearch, order: 0 }, ...savedSearches];
                } else {
                    const upToLimitSearches = savedSearches.slice(0, limit);
                    const restSearches = savedSearches.slice(limit);
                    updatedSavedSearches = [...upToLimitSearches, { ...newSaveSearch, order: limit }, ...restSearches];
                }

                updatedSavedSearches = updatedSavedSearches.map((search, index) => ({ ...search, order: index }));

                return this.updateSavedSearches(updatedSavedSearches).pipe(tap(() => this._savedSearches$.next(updatedSavedSearches)));
            }),
            catchError((error) => {
                console.error('Error saving new search:', error);
                return throwError(() => error);
            })
        );
    }

    editSavedSearch(updatedSavedSearch: SavedSearch): Observable<NodeEntry> {
        let previousSavedSearches: SavedSearch[];
        return this.savedSearches$.pipe(
            take(1),
            map((savedSearches) => {
                previousSavedSearches = [...savedSearches];
                return savedSearches.map((search) => (search.order === updatedSavedSearch.order ? updatedSavedSearch : search));
            }),
            tap((updatedSearches) => {
                this._savedSearches$.next(updatedSearches);
            }),
            switchMap((updatedSearches) => this.updateSavedSearches(updatedSearches)),
            catchError((error) => {
                this._savedSearches$.next(previousSavedSearches);
                return throwError(() => error);
            })
        );
    }

    deleteSavedSearch(deletedSavedSearch: SavedSearch): Observable<NodeEntry> {
        let previousSavedSearchesOrder: SavedSearch[];
        return this.savedSearches$.pipe(
            take(1),
            map((savedSearches) => {
                previousSavedSearchesOrder = [...savedSearches];
                const updatedSearches = savedSearches.filter((search) => search.order !== deletedSavedSearch.order);
                return updatedSearches.map((search, index) => ({ ...search, order: index }));
            }),
            tap((updatedSearches: SavedSearch[]) => {
                this._savedSearches$.next(updatedSearches);
            }),
            switchMap((updatedSearches: SavedSearch[]) => this.updateSavedSearches(updatedSearches)),
            catchError((error) => {
                this._savedSearches$.next(previousSavedSearchesOrder);
                return throwError(() => error);
            })
        );
    }

    changeOrder(previousIndex: number, currentIndex: number): void {
        let previousSavedSearchesOrder: SavedSearch[];
        this.savedSearches$
            .pipe(
                take(1),
                map((savedSearches) => {
                    previousSavedSearchesOrder = [...savedSearches];
                    const [movedSearch] = savedSearches.splice(previousIndex, 1);
                    savedSearches.splice(currentIndex, 0, movedSearch);
                    return savedSearches.map((search, index) => ({ ...search, order: index }));
                }),
                tap((savedSearches: SavedSearch[]) => this._savedSearches$.next(savedSearches)),
                switchMap((updatedSearches: SavedSearch[]) => this.updateSavedSearches(updatedSearches)),
                catchError((error) => {
                    this._savedSearches$.next(previousSavedSearchesOrder);
                    return throwError(() => error);
                })
            )
            .subscribe();
    }

    protected resetSavedSearchesStream(): void {
        this._savedSearches$.next([]);
    }

    private fetchSavedSearches(): void {
        this.getSavedSearches()
            .pipe(take(1))
            .subscribe((searches) => this._savedSearches$.next(searches));
    }
}
