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

import { TestBed } from '@angular/core/testing';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { NodeEntry } from '@alfresco/js-api';
import { skip } from 'rxjs/operators';
import { SavedSearchesService } from './saved-searches.service';
import { AlfrescoApiServiceMock } from '@alfresco/adf-content-services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService } from '@alfresco/adf-core';

describe('SavedSearchesService', () => {
    let service: SavedSearchesService;
    let authService: AuthenticationService;
    let testUserName: string;

    const testNodeId = 'test-node-id';
    const SAVED_SEARCHES_NODE_ID = 'saved-searches-node-id__';
    const SAVED_SEARCHES_CONTENT = JSON.stringify([
        { name: 'Search 1', description: 'Description 1', encodedUrl: 'url1', order: 0 },
        { name: 'Search 2', description: 'Description 2', encodedUrl: 'url2', order: 1 }
    ]);

    beforeEach(() => {
        testUserName = 'test-user';
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [SavedSearchesService, { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }]
        });
        service = TestBed.inject(SavedSearchesService);
        authService = TestBed.inject(AuthenticationService);
        spyOn(authService, 'getUsername').and.returnValue(testUserName);
    });

    afterEach(() => {
        localStorage.removeItem(SAVED_SEARCHES_NODE_ID + testUserName);
    });

    describe('getSavedSearches', () => {
        it('should retrieve saved searches from the saved-searches.json file', (done) => {
            spyOn(localStorage, 'getItem').and.returnValue(testNodeId);
            spyOn(service.nodesApi, 'getNodeContent').and.returnValue(Promise.resolve(new Blob([SAVED_SEARCHES_CONTENT])));

            service.getSavedSearches().subscribe((searches) => {
                expect(localStorage.getItem).toHaveBeenCalledWith(SAVED_SEARCHES_NODE_ID + testUserName);
                expect(service.nodesApi.getNodeContent).toHaveBeenCalledWith(testNodeId);
                expect(searches.length).toBe(2);
                expect(searches[0].name).toBe('Search 1');
                expect(searches[1].name).toBe('Search 2');
                done();
            });
        });

        it('should create saved-searches.json file if it does not exist', (done) => {
            const myNodeId = 'my-node-id';
            spyOn(service.searchApi, 'search').and.returnValue(Promise.resolve({ list: { entries: [] } }));
            spyOn(service.nodesApi, 'getNode').and.returnValue(Promise.resolve({ entry: { id: myNodeId } } as NodeEntry));
            spyOn(service.nodesApi, 'createNode').and.returnValue(Promise.resolve({ entry: { id: 'new-node-id' } }));
            spyOn(service.nodesApi, 'getNodeContent').and.returnValue(Promise.resolve(new Blob([''])));

            service.getSavedSearches().subscribe((searches) => {
                expect(service.nodesApi.getNode).toHaveBeenCalledWith('-my-');
                expect(service.searchApi.search).toHaveBeenCalled();
                expect(service.nodesApi.createNode).toHaveBeenCalledWith(myNodeId, jasmine.objectContaining({ name: 'saved-searches.json' }));
                expect(searches.length).toBe(0);
                done();
            });
        });

        it('should fetch new saved search file for differnt user', (done) => {
            spyOn(localStorage, 'getItem').and.returnValue(testNodeId);
            spyOn(service.nodesApi, 'getNodeContent').and.returnValue(Promise.resolve(new Blob([SAVED_SEARCHES_CONTENT])));

            service.getSavedSearches().subscribe(() => {
                localStorage.removeItem(SAVED_SEARCHES_NODE_ID + testUserName);
                testUserName = 'secondTestUser';
                service.savedSearches$.subscribe(() => {
                    expect(localStorage.getItem).toHaveBeenCalledWith([SAVED_SEARCHES_NODE_ID + testUserName, SAVED_SEARCHES_NODE_ID + testUserName]);
                    done();
                });
            });
        });
    });

    describe('saveSearch', () => {
        it('should save a new search', (done) => {
            const nodeId = 'saved-searches-node-id';
            spyOn(localStorage, 'getItem').and.returnValue(nodeId);
            spyOn(service.nodesApi, 'getNodeContent').and.returnValue(Promise.resolve(new Blob([SAVED_SEARCHES_CONTENT])));
            const newSearch = { name: 'Search 3', description: 'Description 3', encodedUrl: 'url3' };
            spyOn(service.nodesApi, 'updateNodeContent').and.returnValue(Promise.resolve({ entry: {} } as NodeEntry));

            service.saveSearch(newSearch).subscribe(() => {
                expect(service.nodesApi.updateNodeContent).toHaveBeenCalledWith(nodeId, jasmine.any(String));
                expect(service.savedSearches$).toBeDefined();
                service.savedSearches$.subscribe((searches) => {
                    expect(searches.length).toBe(3);
                    expect(searches[2].name).toBe('Search 3');
                    expect(searches[2].order).toBe(2);
                    done();
                });
            });
        });
    });

    describe('savedSearches$', () => {
        it('should emit initial saved searches on subscription', (done) => {
            const nodeId = 'saved-searches-node-id';
            spyOn(localStorage, 'getItem').and.returnValue(nodeId);
            spyOn(service.nodesApi, 'getNodeContent').and.returnValue(Promise.resolve(new Blob([SAVED_SEARCHES_CONTENT])));

            service.savedSearches$.pipe(skip(1)).subscribe((searches) => {
                expect(searches.length).toBe(2);
                expect(searches[0].name).toBe('Search 1');
                done();
            });

            service.getSavedSearches().subscribe();
        });

        it('should emit updated saved searches after saving a new search', (done) => {
            const nodeId = 'saved-searches-node-id';
            spyOn(localStorage, 'getItem').and.returnValue(nodeId);
            spyOn(service.nodesApi, 'getNodeContent').and.returnValue(Promise.resolve(new Blob([SAVED_SEARCHES_CONTENT])));
            const newSearch = { name: 'Search 3', description: 'Description 3', encodedUrl: 'url3' };
            spyOn(service.nodesApi, 'updateNodeContent').and.returnValue(Promise.resolve({ entry: {} } as NodeEntry));

            let emissionCount = 0;

            service.savedSearches$.subscribe((searches) => {
                emissionCount++;
                if (emissionCount === 1) {
                    expect(searches.length).toBe(2);
                }
                if (emissionCount === 2) {
                    expect(searches.length).toBe(3);
                    expect(searches[2].name).toBe('Search 3');
                    done();
                }
            });

            service.getSavedSearches().subscribe(() => {
                service.saveSearch(newSearch).subscribe();
            });
        });
    });
});
