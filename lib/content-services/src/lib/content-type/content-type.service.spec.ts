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

import { TypeEntry } from 'cli/node_modules/@alfresco/js-api';
import { AlfrescoApiService } from 'core';
import { of } from 'rxjs';
import { ContentTypeService } from './content-type.service';

describe('ContentTypeService', () => {

    const fakeEntryMock: TypeEntry = {
        entry: {
            id : 'fake-type-id',
            title: 'fake-title',
            description: 'optional-fake-description',
            parentId: 'cm:parent',
            properties: []
        }
    };

    const mockTypesApi = jasmine.createSpyObj('TypesApi', ['getType', 'listTypes']);
    const alfrescoApiService: AlfrescoApiService = new AlfrescoApiService(null, null);
    const contentTypeService: ContentTypeService = new ContentTypeService(alfrescoApiService);

    beforeEach(() => {
        spyOnProperty(alfrescoApiService, 'typesApi').and.returnValue(mockTypesApi);
    });

    it('should get a node type info', (done) => {
        mockTypesApi.getType.and.returnValue(of(fakeEntryMock));
        contentTypeService.getContentTypeByPrefix('whatever-whenever').subscribe((result) => {
            expect(result).toBeDefined();
            expect(result).not.toBeNull();
            expect(result.entry.id).toBe('fake-type-id');
            expect(mockTypesApi.getType).toHaveBeenCalledWith('whatever-whenever');
            done();
        });
    });

    it('should get the list of children types', (done) => {
        mockTypesApi.listTypes.and.returnValue(of({ list: {entries: [fakeEntryMock]}}));
        contentTypeService.getContentTypeChildren('whatever-whenever').subscribe((results: TypeEntry[]) => {
            expect(results).toBeDefined();
            expect(results).not.toBeNull();
            expect(results.length).toBe(1);
            expect(results[0].entry.id).toBe('fake-type-id');
            expect(mockTypesApi.listTypes).toHaveBeenCalledWith({ where: '(parentIds in (\'whatever-whenever\') and not namespaceUri matches(\'http://www.alfresco.org/model.*\'))' });
            done();
        });
    });

});
