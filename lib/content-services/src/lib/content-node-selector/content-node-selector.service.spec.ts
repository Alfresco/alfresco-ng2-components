/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { setupTestBed } from '@alfresco/adf-core';
import { ContentNodeSelectorService } from './content-node-selector.service';
import { ContentTestingModule } from '../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('ContentNodeSelectorService', () => {

    let service: ContentNodeSelectorService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(ContentNodeSelectorService);
    });

    it('should have the proper main query for search string', () => {
        const queryBody = service.createQuery('nuka cola quantum');

        expect(queryBody.query).toEqual({
            query: 'nuka cola quantum*'
        });
    });

    it('should make it including the path and allowableOperations', () => {
        const queryBody = service.createQuery('nuka cola quantum');

        expect(queryBody.include).toEqual(['path', 'allowableOperations', 'properties']);
    });

    it('should make the search restricted to nodes only', () => {
        const queryBody = service.createQuery('nuka cola quantum');

        expect(queryBody.scope.locations).toEqual('nodes');
    });

    it('should set the maxItems and paging properly by parameters', () => {
        const queryBody = service.createQuery('nuka cola quantum', null, 10, 100);

        expect(queryBody.paging.maxItems).toEqual(100);
        expect(queryBody.paging.skipCount).toEqual(10);
    });

    it('should set the maxItems and paging properly by default', () => {
        const queryBody = service.createQuery('nuka cola quantum');

        expect(queryBody.paging.maxItems).toEqual(25);
        expect(queryBody.paging.skipCount).toEqual(0);
    });

    it('should filter the search for folders', () => {
        const queryBody = service.createQuery('nuka cola quantum');

        expect(queryBody.filterQueries).toContain({ query: "TYPE:'cm:folder'" });
    });

    it('should filter the search for files', () => {
        const queryBody = service.createQuery('nuka cola quantum', null, 0, 25, [], true);

        expect(queryBody.filterQueries).toContain({ query: "TYPE:'cm:folder' OR TYPE:'cm:content'" });
    });

    it('should filter out the "system-base" entries', () => {
        const queryBody = service.createQuery('nuka cola quantum');

        expect(queryBody.filterQueries).toContain({ query: 'NOT cm:creator:System' });
    });

    it('should filter for the provided ancestor if defined', () => {
        const queryBody = service.createQuery('nuka cola quantum', 'diamond-city');

        expect(queryBody.filterQueries).toContain({ query: 'ANCESTOR:\'workspace://SpacesStore/diamond-city\'' });
    });

    it('should NOT filter for the ancestor if NOT defined', () => {
        const queryBody = service.createQuery('nuka cola quantum');

        expect(queryBody.filterQueries).not.toContain({ query: 'ANCESTOR:\'workspace://SpacesStore/null\'' });
    });

    it('should filter for the extra provided ancestors if defined', () => {
        const queryBody = service.createQuery('nuka cola quantum', 'diamond-city', 0, 25, ['extra-diamond-city']);

        expect(queryBody.filterQueries).toContain({ query: 'ANCESTOR:\'workspace://SpacesStore/diamond-city\' OR ANCESTOR:\'workspace://SpacesStore/extra-diamond-city\'' });
    });

    it('should NOT filter for extra ancestors if an empty list of ids is provided', () => {
        const queryBody = service.createQuery('nuka cola quantum', 'diamond-city', 0, 25, []);

        expect(queryBody.filterQueries).toContain({ query: 'ANCESTOR:\'workspace://SpacesStore/diamond-city\'' });
    });

    it('should NOT filter for the extra provided ancestor if it\'s the same as the rootNodeId', () => {
        const queryBody = service.createQuery('nuka cola quantum', 'diamond-city', 0, 25, ['diamond-city']);

        expect(queryBody.filterQueries).toContain({ query: 'ANCESTOR:\'workspace://SpacesStore/diamond-city\'' });
    });
});
