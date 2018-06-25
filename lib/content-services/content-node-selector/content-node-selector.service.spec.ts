/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { QueryBody } from 'alfresco-js-api';
import { SearchService, setupTestBed } from '@alfresco/adf-core';
import { ContentNodeSelectorService } from './content-node-selector.service';
import { ContentTestingModule } from '../testing/content.testing.module';

class SearchServiceMock {
    public query: QueryBody;
    searchByQueryBody(query: QueryBody) {
        this.query = query;
    }
}

describe('ContentNodeSelectorService', () => {

    let service: ContentNodeSelectorService;
    let search: SearchServiceMock;

    setupTestBed({
        imports: [ContentTestingModule],
        providers: [
            { provide: SearchService, useClass: SearchServiceMock }
        ]
    });

    beforeEach(() => {
        service = TestBed.get(ContentNodeSelectorService);
        search = TestBed.get(SearchService);
    });

    it('should have the proper main query for search string', () => {
        service.search('nuka cola quantum');

        expect(search.query.query).toEqual({
            query: 'nuka cola quantum* OR name:nuka cola quantum*'
        });
    });

    it('should make it including the path and allowableOperations', () => {
        service.search('nuka cola quantum');

        expect(search.query.include).toEqual(['path', 'allowableOperations']);
    });

    it('should make the search restricted to nodes only', () => {
        service.search('nuka cola quantum');

        expect(search.query.scope.locations).toEqual(['nodes']);
    });

    it('should set the maxItems and paging properly by parameters', () => {
        service.search('nuka cola quantum', null, 10, 100);

        expect(search.query.paging.maxItems).toEqual(100);
        expect(search.query.paging.skipCount).toEqual(10);
    });

    it('should set the maxItems and paging properly by default', () => {
        service.search('nuka cola quantum');

        expect(search.query.paging.maxItems).toEqual(25);
        expect(search.query.paging.skipCount).toEqual(0);
    });

    it('should filter the search only for folders', () => {
        service.search('nuka cola quantum');

        expect(search.query.filterQueries).toContain({ query: "TYPE:'cm:folder'" });
    });

    it('should filter out the "system-base" entries', () => {
        service.search('nuka cola quantum');

        expect(search.query.filterQueries).toContain({ query: 'NOT cm:creator:System' });
    });

    it('should filter for the provided ancestor if defined', () => {
        service.search('nuka cola quantum', 'diamond-city');

        expect(search.query.filterQueries).toContain({ query: 'ANCESTOR:\'workspace://SpacesStore/diamond-city\'' });
    });

    it('should NOT filter for the ancestor if NOT defined', () => {
        service.search('nuka cola quantum');

        expect(search.query.filterQueries).not.toContain({ query: 'ANCESTOR:\'workspace://SpacesStore/null\'' });
    });

    it('should filter for the extra provided ancestors if defined', () => {
        service.search('nuka cola quantum', 'diamond-city', 0, 25, ['extra-diamond-city']);

        expect(search.query.filterQueries).toContain({ query: 'ANCESTOR:\'workspace://SpacesStore/diamond-city\' OR ANCESTOR:\'workspace://SpacesStore/extra-diamond-city\'' });
    });

    it('should NOT filter for extra ancestors if an empty list of ids is provided', () => {
        service.search('nuka cola quantum', 'diamond-city', 0, 25, []);

        expect(search.query.filterQueries).toContain({ query: 'ANCESTOR:\'workspace://SpacesStore/diamond-city\'' });
    });

    it('should NOT filter for the extra provided ancestor if it\'s the same as the rootNodeId', () => {
        service.search('nuka cola quantum', 'diamond-city', 0, 25, ['diamond-city']);

        expect(search.query.filterQueries).toContain({ query: 'ANCESTOR:\'workspace://SpacesStore/diamond-city\'' });
    });
});
