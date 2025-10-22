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

import { Observable } from 'rxjs';
import { NodeEntry } from '@alfresco/js-api';
import { SavedSearch } from './saved-search.interface';

/**
 * Contract that describes the public API for saved searches strategy.
 * Implemented by both the new and legacy SavedSearches services so callers
 * can depend on the same shape.
 */
export interface SavedSearchStrategy {
    savedSearches$: Observable<SavedSearch[]>;

    init(): void;

    /**
     * Gets a list of saved searches by user.
     *
     * @returns SavedSearch list containing user saved searches
     */
    getSavedSearches(): Observable<SavedSearch[]>;

    /**
     * Saves a new search into state and updates state. If there are less than 5 searches,
     * it will be pushed on first place, if more it will be pushed to 6th place.
     *
     * @param newSaveSearch object { name: string, description: string, encodedUrl: string }
     * @returns NodeEntry
     */
    saveSearch(newSaveSearch: Pick<SavedSearch, 'name' | 'description' | 'encodedUrl'>): Observable<NodeEntry>;

    /**
     * Replace Save Search with new one and also updates the state.
     *
     * @param updatedSavedSearch - updated Save Search
     * @returns NodeEntry
     */
    editSavedSearch(updatedSavedSearch: SavedSearch): Observable<NodeEntry>;

    /**
     * Deletes Save Search and update state.
     *
     * @param deletedSavedSearch - Save Search to delete
     * @returns NodeEntry
     */
    deleteSavedSearch(deletedSavedSearch: SavedSearch): Observable<NodeEntry>;

    /**
     * Reorders saved search place
     *
     * @param previousIndex - previous index of saved search
     * @param currentIndex - new index of saved search
     */
    changeOrder(previousIndex: number, currentIndex: number): void;
}
