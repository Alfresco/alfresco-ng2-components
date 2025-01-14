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
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { AlfrescoApiServiceMock } from '../../mock';
import { NodeEntry } from '@alfresco/js-api';
import { SavedSearchesService } from './saved-searches.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService } from '@alfresco/adf-core';
import { Subject } from 'rxjs';

describe('SavedSearchesService', () => {
    let service: SavedSearchesService;
    let authService: AuthenticationService;
    let testUserName: string;

    const testNodeId = 'test-node-id';
    const LOCAL_STORAGE_KEY = 'saved-searches-test-user-migrated';
    const SAVED_SEARCHES_CONTENT = JSON.stringify([
        { name: 'Search 1', description: 'Description 1', encodedUrl: 'url1', order: 0 },
        { name: 'Search 2', description: 'Description 2', encodedUrl: 'url2', order: 1 }
    ]);

    /**
     * Creates a stub with Promise returning a Blob
     *
     * @returns Promise with Blob
     */
    function createBlob() {
        return Promise.resolve(new Blob([SAVED_SEARCHES_CONTENT]));
    }

    beforeEach(() => {
        testUserName = 'test-user';
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
                { provide: AuthenticationService, useValue: { getUsername: () => {}, onLogin: new Subject() } },
                SavedSearchesService
            ]
        });
        service = TestBed.inject(SavedSearchesService);
        authService = TestBed.inject(AuthenticationService);
        spyOn(service.nodesApi, 'getNode').and.callFake(() => Promise.resolve({ entry: { id: testNodeId } } as NodeEntry));
        spyOn(service.nodesApi, 'getNodeContent').and.callFake(() => createBlob());
        spyOn(service.nodesApi, 'deleteNode').and.callFake(() => Promise.resolve());
        spyOn(service.preferencesApi, 'getPreference').and.callFake(() =>
            Promise.resolve({ entry: { id: 'saved-searches', value: SAVED_SEARCHES_CONTENT } })
        );
        spyOn(service.preferencesApi, 'updatePreference').and.callFake(() =>
            Promise.resolve({ entry: { id: 'saved-searches', value: SAVED_SEARCHES_CONTENT } })
        );
    });

    afterEach(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    });

    it('should retrieve saved searches from the preferences API', (done) => {
        spyOn(authService, 'getUsername').and.callFake(() => testUserName);
        spyOn(localStorage, 'getItem').and.callFake(() => 'true');
        service.init();

        service.getSavedSearches().subscribe((searches) => {
            expect(localStorage.getItem).toHaveBeenCalledWith(LOCAL_STORAGE_KEY);
            expect(service.preferencesApi.getPreference).toHaveBeenCalledWith('-me-', 'saved-searches');
            expect(searches.length).toBe(2);
            expect(searches[0].name).toBe('Search 1');
            expect(searches[1].name).toBe('Search 2');
            done();
        });
    });

    it('should automatically migrate saved searches if config.json file exists', (done) => {
        spyOn(localStorage, 'setItem');
        spyOn(authService, 'getUsername').and.callFake(() => testUserName);

        service.getSavedSearches().subscribe((searches) => {
            expect(service.nodesApi.getNode).toHaveBeenCalledWith('-my-', { relativePath: 'config.json' });
            expect(service.nodesApi.getNodeContent).toHaveBeenCalledWith(testNodeId);
            expect(localStorage.setItem).toHaveBeenCalledWith(LOCAL_STORAGE_KEY, 'true');
            expect(service.preferencesApi.updatePreference).toHaveBeenCalledWith('-me-', 'saved-searches', SAVED_SEARCHES_CONTENT);
            expect(service.nodesApi.deleteNode).toHaveBeenCalledWith(testNodeId, { permanent: true });
            expect(searches.length).toBe(2);
            done();
        });
    });

    it('should save a new search', (done) => {
        spyOn(authService, 'getUsername').and.callFake(() => testUserName);
        spyOn(localStorage, 'getItem').and.callFake(() => 'true');
        const newSearch = { name: 'Search 3', description: 'Description 3', encodedUrl: 'url3' };
        service.init();

        service.saveSearch(newSearch).subscribe(() => {
            expect(service.preferencesApi.updatePreference).toHaveBeenCalledWith('-me-', 'saved-searches', jasmine.any(String));
            expect(service.savedSearches$).toBeDefined();
            done();
        });
    });

    it('should emit initial saved searches on subscription', (done) => {
        spyOn(authService, 'getUsername').and.callFake(() => testUserName);
        spyOn(localStorage, 'getItem').and.returnValue('true');
        service.init();

        service.savedSearches$.pipe().subscribe((searches) => {
            expect(searches.length).toBe(2);
            expect(searches[0].name).toBe('Search 1');
            expect(service.preferencesApi.getPreference).toHaveBeenCalledWith('-me-', 'saved-searches');
            done();
        });

        service.getSavedSearches().subscribe();
    });

    it('should emit updated saved searches after saving a new search', (done) => {
        spyOn(authService, 'getUsername').and.callFake(() => testUserName);
        spyOn(localStorage, 'getItem').and.callFake(() => 'true');
        const newSearch = { name: 'Search 3', description: 'Description 3', encodedUrl: 'url3' };
        service.init();

        service.saveSearch(newSearch).subscribe(() => {
            service.savedSearches$.subscribe((searches) => {
                expect(searches.length).toBe(3);
                expect(searches[2].name).toBe('Search 2');
                expect(service.preferencesApi.updatePreference).toHaveBeenCalledWith('-me-', 'saved-searches', jasmine.any(String));
                done();
            });
        });
    });

    it('should edit a search', (done) => {
        const updatedSearch = { name: 'Search 3', description: 'Description 3', encodedUrl: 'url3', order: 0 };
        prepareDefaultMock();

        service.editSavedSearch(updatedSearch).subscribe(() => {
            service.savedSearches$.subscribe((searches) => {
                expect(searches.length).toBe(2);
                expect(searches[0].name).toBe('Search 3');
                expect(searches[0].order).toBe(0);

                expect(searches[1].name).toBe('Search 2');
                expect(searches[1].order).toBe(1);
                done();
            });
        });
    });

    it('should delete a search', (done) => {
        const searchToDelete = { name: 'Search 1', description: 'Description 1', encodedUrl: 'url1', order: 0 };
        prepareDefaultMock();

        service.deleteSavedSearch(searchToDelete).subscribe(() => {
            service.savedSearches$.subscribe((searches) => {
                expect(searches.length).toBe(1);
                expect(searches[0].name).toBe('Search 2');
                expect(searches[0].order).toBe(0);
                done();
            });
        });
    });

    /**
     * Prepares default mocks for service
     */
    function prepareDefaultMock(): void {
        spyOn(authService, 'getUsername').and.callFake(() => testUserName);
        spyOn(localStorage, 'getItem').and.callFake(() => 'true');
        service.init();
    }
});
