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

import { NodesApi, NodeEntry, PreferencesApi, ContentFieldsQuery, PreferenceEntry } from '@alfresco/js-api';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable, of, from, ReplaySubject, throwError } from 'rxjs';
import { catchError, concatMap, first, map, switchMap, take, tap } from 'rxjs/operators';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { SavedSearch } from '../interfaces/saved-search.interface';
import { AuthenticationService } from '@alfresco/adf-core';

export interface SavedSearchesPreferencesApiService {
    getPreference: (personId: string, preferenceName: string, opts?: ContentFieldsQuery) => Promise<PreferenceEntry> | Observable<PreferenceEntry>;
    updatePreference: (personId: string, preferenceName: string, preferenceValue: string) => Promise<PreferenceEntry> | Observable<PreferenceEntry>;
}

export const SAVED_SEARCHES_SERVICE_PREFERENCES = new InjectionToken<SavedSearchesPreferencesApiService>('SAVED_SEARCHES_SERVICE_PREFERENCES');

@Injectable({
    providedIn: 'root'
})
export class SavedSearchesService {
    private savedSearchFileNodeId: string;
    private _nodesApi: NodesApi;
    private _preferencesApi: SavedSearchesPreferencesApiService;
    private preferencesService = inject(SAVED_SEARCHES_SERVICE_PREFERENCES, { optional: true });

    get nodesApi(): NodesApi {
        this._nodesApi = this._nodesApi ?? new NodesApi(this.apiService.getInstance());
        return this._nodesApi;
    }

    get preferencesApi(): SavedSearchesPreferencesApiService {
        if (this.preferencesService) {
            this._preferencesApi = this.preferencesService;
            return this._preferencesApi;
        }

        this._preferencesApi = this._preferencesApi ?? new PreferencesApi(this.apiService.getInstance());
        return this._preferencesApi;
    }

    readonly savedSearches$ = new ReplaySubject<SavedSearch[]>(1);

    constructor(private readonly apiService: AlfrescoApiService, private readonly authService: AuthenticationService) {}

    init(): void {
        this.fetchSavedSearches();
    }

    /**
     * Gets a list of saved searches by user.
     * @returns SavedSearch list containing user saved searches
     */
    getSavedSearches(): Observable<SavedSearch[]> {
        const savedSearchesMigrated = localStorage.getItem(this.getLocalStorageKey()) ?? '';
        if (savedSearchesMigrated === 'true') {
            return from(this.preferencesApi.getPreference('-me-', 'saved-searches')).pipe(
                map((preference) => JSON.parse(preference.entry.value)),
                catchError(() => of([]))
            );
        } else {
            return this.getSavedSearchesNodeId().pipe(
                take(1),
                concatMap(() => {
                    if (this.savedSearchFileNodeId !== '') {
                        return this.migrateSavedSearches();
                    } else {
                        return from(this.preferencesApi.getPreference('-me-', 'saved-searches')).pipe(
                            map((preference) => JSON.parse(preference.entry.value)),
                            catchError(() => of([]))
                        );
                    }
                })
            );
        }
    }

    /**
     * Saves a new search into state and updates state. If there are less than 5 searches,
     * it will be pushed on first place, if more it will be pushed to 6th place.
     * @param newSaveSearch object { name: string, description: string, encodedUrl: string }
     * @returns NodeEntry
     */
    saveSearch(newSaveSearch: Pick<SavedSearch, 'name' | 'description' | 'encodedUrl'>): Observable<NodeEntry> {
        return this.getSavedSearches().pipe(
            take(1),
            switchMap((savedSearches: SavedSearch[]) => {
                let updatedSavedSearches: SavedSearch[] = [];

                if (savedSearches.length < 5) {
                    updatedSavedSearches = [{ ...newSaveSearch, order: 0 }, ...savedSearches];
                } else {
                    const firstFiveSearches = savedSearches.slice(0, 5);
                    const restOfSearches = savedSearches.slice(5);

                    updatedSavedSearches = [...firstFiveSearches, { ...newSaveSearch, order: 5 }, ...restOfSearches];
                }

                updatedSavedSearches = updatedSavedSearches.map((search, index) => ({
                    ...search,
                    order: index
                }));

                return from(this.preferencesApi.updatePreference('-me-', 'saved-searches', JSON.stringify(updatedSavedSearches))).pipe(
                    map((preference) => JSON.parse(preference.entry.value)),
                    tap(() => this.savedSearches$.next(updatedSavedSearches))
                );
            }),
            catchError((error) => {
                console.error('Error saving new search:', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Replace Save Search with new one and also updates the state.
     * @param updatedSavedSearch - updated Save Search
     * @returns NodeEntry
     */
    editSavedSearch(updatedSavedSearch: SavedSearch): Observable<NodeEntry> {
        let previousSavedSearches: SavedSearch[];
        return this.savedSearches$.pipe(
            take(1),
            map((savedSearches: SavedSearch[]) => {
                previousSavedSearches = [...savedSearches];
                return savedSearches.map((search) => (search.order === updatedSavedSearch.order ? updatedSavedSearch : search));
            }),
            tap((updatedSearches: SavedSearch[]) => {
                this.savedSearches$.next(updatedSearches);
            }),
            switchMap((updatedSearches: SavedSearch[]) =>
                from(this.preferencesApi.updatePreference('-me-', 'saved-searches', JSON.stringify(updatedSearches))).pipe(
                    map((preference) => JSON.parse(preference.entry.value))
                )
            ),
            catchError((error) => {
                this.savedSearches$.next(previousSavedSearches);
                return throwError(() => error);
            })
        );
    }

    /**
     * Deletes Save Search and update state.
     * @param deletedSavedSearch - Save Search to delete
     * @returns NodeEntry
     */
    deleteSavedSearch(deletedSavedSearch: SavedSearch): Observable<NodeEntry> {
        let previousSavedSearchesOrder: SavedSearch[];
        return this.savedSearches$.pipe(
            take(1),
            map((savedSearches: SavedSearch[]) => {
                previousSavedSearchesOrder = [...savedSearches];
                const updatedSearches = savedSearches.filter((search) => search.order !== deletedSavedSearch.order);
                return updatedSearches.map((search, index) => ({
                    ...search,
                    order: index
                }));
            }),
            tap((updatedSearches: SavedSearch[]) => {
                this.savedSearches$.next(updatedSearches);
            }),
            switchMap((updatedSearches: SavedSearch[]) =>
                from(this.preferencesApi.updatePreference('-me-', 'saved-searches', JSON.stringify(updatedSearches))).pipe(
                    map((preference) => JSON.parse(preference.entry.value))
                )
            ),
            catchError((error) => {
                this.savedSearches$.next(previousSavedSearchesOrder);
                return throwError(() => error);
            })
        );
    }

    /**
     * Reorders saved search place
     * @param previousIndex - previous index of saved search
     * @param currentIndex - new index of saved search
     */
    changeOrder(previousIndex: number, currentIndex: number): void {
        let previousSavedSearchesOrder: SavedSearch[];
        this.savedSearches$
            .pipe(
                take(1),
                map((savedSearches: SavedSearch[]) => {
                    previousSavedSearchesOrder = [...savedSearches];
                    const [movedSearch] = savedSearches.splice(previousIndex, 1);
                    savedSearches.splice(currentIndex, 0, movedSearch);
                    return savedSearches.map((search, index) => ({
                        ...search,
                        order: index
                    }));
                }),
                tap((savedSearches: SavedSearch[]) => this.savedSearches$.next(savedSearches)),
                switchMap((updatedSearches: SavedSearch[]) =>
                    from(this.preferencesApi.updatePreference('-me-', 'saved-searches', JSON.stringify(updatedSearches))).pipe(
                        map((preference) => JSON.parse(preference.entry.value))
                    )
                ),
                catchError((error) => {
                    this.savedSearches$.next(previousSavedSearchesOrder);
                    return throwError(() => error);
                })
            )
            .subscribe();
    }

    private getSavedSearchesNodeId(): Observable<string> {
        return from(this.nodesApi.getNode('-my-', { relativePath: 'config.json' })).pipe(
            first(),
            concatMap((configNode) => {
                this.savedSearchFileNodeId = configNode.entry.id;
                return configNode.entry.id;
            }),
            catchError((error) => {
                const errorStatusCode = JSON.parse(error.message).error.statusCode;
                if (errorStatusCode === 404) {
                    localStorage.setItem(this.getLocalStorageKey(), 'true');
                    return '';
                } else {
                    return throwError(() => error);
                }
            })
        );
    }

    private async mapFileContentToSavedSearches(blob: Blob): Promise<Array<SavedSearch>> {
        return blob
            .text()
            .then((content) => (content ? JSON.parse(content) : []))
            .catch(() => []);
    }

    private getLocalStorageKey(): string {
        return `saved-searches-${this.authService.getUsername()}-migrated`;
    }

    private fetchSavedSearches(): void {
        this.getSavedSearches()
            .pipe(take(1))
            .subscribe((searches) => this.savedSearches$.next(searches));
    }

    private migrateSavedSearches(): Observable<SavedSearch[]> {
        return from(this.nodesApi.getNodeContent(this.savedSearchFileNodeId).then((content) => this.mapFileContentToSavedSearches(content))).pipe(
            tap((savedSearches) => {
                this.preferencesApi.updatePreference('-me-', 'saved-searches', JSON.stringify(savedSearches));
                localStorage.setItem(this.getLocalStorageKey(), 'true');
                this.nodesApi.deleteNode(this.savedSearchFileNodeId, { permanent: true });
            })
        );
    }
}
