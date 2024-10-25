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

import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { NodeEntry } from '@alfresco/js-api';
import { SavedSearchesService } from './saved-searches.service';
import { AlfrescoApiServiceMock } from '@alfresco/adf-content-services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService } from '@alfresco/adf-core';
import { Subject, take } from 'rxjs';

describe('SavedSearchesService', () => {
    let service: SavedSearchesService;
    let authService: AuthenticationService;
    let testUserName: string;
    let getNodeContentSpy: jasmine.Spy;

    const testNodeId = 'test-node-id';
    const SAVED_SEARCHES_NODE_ID = 'saved-searches-node-id__';
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
                { provide: AuthenticationService, useValue: { getUsername: () => {}, onLogin: new Subject() } }
            ]
        });
        service = TestBed.inject(SavedSearchesService);
        authService = TestBed.inject(AuthenticationService);
        spyOn(service.nodesApi, 'getNode').and.callFake(() => Promise.resolve({ entry: { id: testNodeId } } as NodeEntry));
        spyOn(service.searchApi, 'search').and.callFake(() => Promise.resolve({ list: { entries: [] } }));
        spyOn(service.nodesApi, 'createNode').and.callFake(() => Promise.resolve({ entry: { id: 'new-node-id' } }));
        spyOn(service.nodesApi, 'updateNodeContent').and.callFake(() => Promise.resolve({ entry: {} } as NodeEntry));
        getNodeContentSpy = spyOn(service.nodesApi, 'getNodeContent').and.callFake(() => createBlob());
    });

    afterEach(fakeAsync(() => {
        flush();
        localStorage.removeItem(SAVED_SEARCHES_NODE_ID + testUserName);
    }));

    it('should retrieve saved searches from the saved-searches.json file', (done) => {
        spyOn(authService, 'getUsername').and.callFake(() => testUserName);
        spyOn(localStorage, 'getItem').and.callFake(() => testNodeId);
        service.innit();

        service.getSavedSearches().subscribe((searches) => {
            expect(localStorage.getItem).toHaveBeenCalledWith(SAVED_SEARCHES_NODE_ID + testUserName);
            expect(getNodeContentSpy).toHaveBeenCalledWith(testNodeId);
            expect(searches.length).toBe(2);
            expect(searches[0].name).toBe('Search 1');
            expect(searches[1].name).toBe('Search 2');
            done();
        });
    });

    it('should create saved-searches.json file if it does not exist', (done) => {
        spyOn(authService, 'getUsername').and.callFake(() => testUserName);
        getNodeContentSpy.and.callFake(() => Promise.resolve(new Blob([''])));
        service.innit();

        service.getSavedSearches().subscribe((searches) => {
            expect(service.nodesApi.getNode).toHaveBeenCalledWith('-my-');
            expect(service.searchApi.search).toHaveBeenCalled();
            expect(service.nodesApi.createNode).toHaveBeenCalledWith(testNodeId, jasmine.objectContaining({ name: 'saved-searches.json' }));
            expect(searches.length).toBe(0);
            done();
        });
    });

    it('should save a new search', (done) => {
        spyOn(authService, 'getUsername').and.callFake(() => testUserName);
        const nodeId = 'saved-searches-node-id';
        spyOn(localStorage, 'getItem').and.callFake(() => nodeId);
        const newSearch = { name: 'Search 3', description: 'Description 3', encodedUrl: 'url3' };
        service.innit();

        service.saveSearch(newSearch).subscribe(() => {
            expect(service.nodesApi.updateNodeContent).toHaveBeenCalledWith(nodeId, jasmine.any(String));
            expect(service.savedSearches$).toBeDefined();
            service.savedSearches$.subscribe((searches) => {
                expect(searches.length).toBe(3);
                expect(searches[2].name).toBe('Search 2');
                expect(searches[2].order).toBe(2);
                done();
            });
        });
    });

    it('should emit initial saved searches on subscription', (done) => {
        const nodeId = 'saved-searches-node-id';
        spyOn(localStorage, 'getItem').and.returnValue(nodeId);
        service.innit();

        service.savedSearches$.pipe().subscribe((searches) => {
            expect(searches.length).toBe(2);
            expect(searches[0].name).toBe('Search 1');
            done();
        });

        service.getSavedSearches().subscribe();
    });

    it('should emit updated saved searches after saving a new search', (done) => {
        spyOn(authService, 'getUsername').and.callFake(() => testUserName);
        spyOn(localStorage, 'getItem').and.callFake(() => testNodeId);
        const newSearch = { name: 'Search 3', description: 'Description 3', encodedUrl: 'url3' };
        service.innit();

        let emissionCount = 0;

        service.savedSearches$.subscribe((searches) => {
            emissionCount++;
            if (emissionCount === 1) {
                expect(searches.length).toBe(2);
            }
            if (emissionCount === 2) {
                expect(searches.length).toBe(3);
                expect(searches[2].name).toBe('Search 2');
                done();
            }
        });

        service.saveSearch(newSearch).subscribe();
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
        const nodeId = 'saved-searches-node-id';
        spyOn(localStorage, 'getItem').and.callFake(() => nodeId);
        service.innit();
    }
});
