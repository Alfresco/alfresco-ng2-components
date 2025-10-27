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

import { TestBed } from '@angular/core/testing';
import { AlfrescoApiService } from '../../services';
import { AlfrescoApiServiceMock } from '../../mock';
import { MockSavedSearchesService } from '../../mock/saved-searches-derived.mock';
import { SavedSearch } from '../interfaces/saved-search.interface';
import { Subject } from 'rxjs';
import { AuthenticationService } from '@alfresco/adf-core';

describe('SavedSearchesBaseService', () => {
    let service: MockSavedSearchesService;

    const SAVED_SEARCHES_CONTENT: SavedSearch[] = [
        { name: 'Search 1', description: 'Description 1', encodedUrl: 'url1', order: 0 },
        { name: 'Search 2', description: 'Description 2', encodedUrl: 'url2', order: 1 }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
                { provide: AuthenticationService, useValue: { getUsername: () => {}, onLogin: new Subject() } },
                MockSavedSearchesService
            ]
        });
        service = TestBed.inject(MockSavedSearchesService);
    });

    it('should emit loaded data in savedSearches$ on init', (done) => {
        service.savedSearches$.subscribe((value) => {
            expect(value).toEqual(SAVED_SEARCHES_CONTENT);
            done();
        });
        service.mockFetch(SAVED_SEARCHES_CONTENT);
        service.init();
    });

    it('should emit updated searches with correct order if total of saved searches is less than limit (5)', (done) => {
        service.mockFetch(SAVED_SEARCHES_CONTENT);
        const newSearch = { name: 'new-search' } as SavedSearch;
        service.saveSearch(newSearch).subscribe(() => {
            const args = (service.updateSpy as jasmine.Spy).calls.mostRecent().args[0];

            expect(args.length).toBe(1 + SAVED_SEARCHES_CONTENT.length);

            expect(args[0]).toEqual({ ...newSearch, order: 0 });

            service.savedSearches$.subscribe((savedSearches) => {
                expect(savedSearches).toEqual(args);
                done();
            });
        });
    });

    it('should emit updated searches with correct order if total of saved searches is more than limit (5)', (done) => {
        const moreSavedSearches = [...SAVED_SEARCHES_CONTENT, ...SAVED_SEARCHES_CONTENT, ...SAVED_SEARCHES_CONTENT];
        service.mockFetch(moreSavedSearches);
        const newSearch = { name: 'new-search' } as SavedSearch;
        service.saveSearch(newSearch).subscribe(() => {
            const args = (service.updateSpy as jasmine.Spy).calls.mostRecent().args[0];

            expect(args.length).toBe(1 + moreSavedSearches.length);

            expect(args[5]).toEqual({ ...newSearch, order: 5 });

            service.savedSearches$.subscribe((savedSearches) => {
                expect(savedSearches).toEqual(args);
                done();
            });
        });
    });

    it('should edit a search and emit updated saved searches', (done) => {
        service.mockFetch(SAVED_SEARCHES_CONTENT);
        service.init();
        const updatedSearch = { name: 'updated-search', order: 0 } as SavedSearch;
        service.editSavedSearch(updatedSearch).subscribe(() => {
            const args = (service.updateSpy as jasmine.Spy).calls.mostRecent().args[0];
            expect(args[0]).toEqual(updatedSearch);

            service.savedSearches$.subscribe((savedSearches) => {
                expect(savedSearches[0]).toEqual(updatedSearch);
                done();
            });
        });
    });

    it('should delete a search and emit updated saved searches', (done) => {
        service.mockFetch(SAVED_SEARCHES_CONTENT);
        service.init();
        const searchToDelete = { name: 'Search 1', order: 0 } as SavedSearch;
        service.deleteSavedSearch(searchToDelete).subscribe(() => {
            const args = (service.updateSpy as jasmine.Spy).calls.mostRecent().args[0];
            expect(args.find((savedSearch: SavedSearch) => savedSearch.name === 'Search 1')).toBeUndefined();

            service.savedSearches$.subscribe((savedSearches) => {
                expect(savedSearches.length).toBe(1);
                expect(savedSearches[0].name).toBe('Search 2');
                expect(savedSearches[0].order).toBe(0);
                done();
            });
        });
    });

    it('should change order of saved searches and emit updated saved searches', (done) => {
        const updatedOrder: SavedSearch[] = [
            { ...SAVED_SEARCHES_CONTENT[1], order: 0 },
            { ...SAVED_SEARCHES_CONTENT[0], order: 1 }
        ];
        service.mockFetch(SAVED_SEARCHES_CONTENT);
        service.init();
        service.changeOrder(1, 0);

        service.savedSearches$.subscribe((savedSearches) => {
            expect(service.updateSpy).toHaveBeenCalledWith(updatedOrder);

            expect(savedSearches.length).toBe(SAVED_SEARCHES_CONTENT.length);
            expect(savedSearches[0]).toEqual(updatedOrder[0]);
            expect(savedSearches[1]).toEqual(updatedOrder[1]);
            done();
        });
    });
});
