/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { setupTestBed } from '@alfresco/adf-core';
import { DocumentListService } from './document-list.service';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';

declare let jasmine: any;

describe('DocumentListService', () => {

    let service: DocumentListService;

    const fakeFolder = {
        list: {
            pagination: { count: 1, hasMoreItems: false, totalItems: 1, skipCount: 0, maxItems: 20 },
            entries: [{
                entry: {
                    createdAt: '2016-12-06T13:03:14.880+0000',
                    path: {
                        name: '/Company Home/Sites/swsdp/documentLibrary/empty',
                        isComplete: true,
                        elements: [{
                            id: 'ed7ab80e-b398-4bed-b38d-139ae4cc592a',
                            name: 'Company Home'
                        }, { id: '99e1368f-e816-47fc-a8bf-3b358feaf31e', name: 'Sites' }, {
                            id: 'b4cff62a-664d-4d45-9302-98723eac1319',
                            name: 'swsdp'
                        }, {
                            id: '8f2105b4-daaf-4874-9e8a-2152569d109b',
                            name: 'documentLibrary'
                        }, { id: '17fa78d2-4d6b-4a46-876b-4b0ea07f7f32', name: 'empty' }]
                    },
                    isFolder: true,
                    isFile: false,
                    createdByUser: { id: 'admin', displayName: 'Administrator' },
                    modifiedAt: '2016-12-06T13:03:14.880+0000',
                    modifiedByUser: { id: 'admin', displayName: 'Administrator' },
                    name: 'fake-name',
                    id: 'aac546f6-1525-46ff-bf6b-51cb85f3cda7',
                    nodeType: 'cm:folder',
                    parentId: '17fa78d2-4d6b-4a46-876b-4b0ea07f7f32'
                }
            }]
        }
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(DocumentListService);
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should return the folder info', fakeAsync(() => {
        service.getFolder('/fake-root/fake-name').subscribe(
            (res) => {
                expect(res).toBeDefined();
                expect(res.list).toBeDefined();
                expect(res.list.entries).toBeDefined();
                expect(res.list.entries.length).toBe(1);
                expect(res.list.entries[0].entry.isFolder).toBeTruthy();
                expect(res.list.entries[0].entry.name).toEqual('fake-name');
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: fakeFolder
        });
    }));

    it('should add the includeTypes in the request Node Children if required', () => {
        const spyGetNodeInfo = spyOn(service['nodes'], 'listNodeChildren').and.callThrough();

        service.getFolder('/fake-root/fake-name', {}, ['isLocked']);

        expect(spyGetNodeInfo).toHaveBeenCalledWith('-root-', {
            includeSource: true,
            include: ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames', 'isLocked'],
            relativePath: '/fake-root/fake-name'
        });
    });

    it('should not add the includeTypes in the request Node Children if is duplicated', () => {
        const spyGetNodeInfo = spyOn(service['nodes'], 'listNodeChildren').and.callThrough();

        service.getFolder('/fake-root/fake-name', {}, ['allowableOperations']);

        expect(spyGetNodeInfo).toHaveBeenCalledWith('-root-', {
            includeSource: true,
            include: ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames'],
            relativePath: '/fake-root/fake-name'
        });
    });

    it('should add the includeTypes in the request getFolderNode if required', () => {
        const spyGetNodeInfo = spyOn(service['nodes'], 'getNode').and.callThrough();

        service.getFolderNode('test-id', ['isLocked']);

        expect(spyGetNodeInfo).toHaveBeenCalledWith('test-id', {
            includeSource: true,
            include: ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames', 'isLocked']
        });
    });

    it('should not add the includeTypes in the request getFolderNode if is duplicated', () => {
        const spyGetNodeInfo = spyOn(service['nodes'], 'getNode').and.callThrough();

        service.getFolderNode('test-id', ['allowableOperations']);

        expect(spyGetNodeInfo).toHaveBeenCalledWith('test-id', {
                includeSource: true,
                include: ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames']
            }
        );
    });

    it('should delete the folder', fakeAsync(() => {
        service.deleteNode('fake-id').subscribe(
            (res) => {
                expect(res).toBe('');
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 204,
            contentType: 'json'
        });
    }));

    it('should copy a node', (done) => {
        service.copyNode('node-id', 'parent-id').subscribe(() => done());

        expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
        expect(jasmine.Ajax.requests.mostRecent().url).toContain('/nodes/node-id/copy');
        expect(jasmine.Ajax.requests.mostRecent().params).toEqual(JSON.stringify({ targetParentId: 'parent-id' }));

        jasmine.Ajax.requests.mostRecent().respondWith({ status: 200, contentType: 'json' });
    });

    it('should move a node', (done) => {
        service.moveNode('node-id', 'parent-id').subscribe(() => done());

        expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
        expect(jasmine.Ajax.requests.mostRecent().url).toContain('/nodes/node-id/move');
        expect(jasmine.Ajax.requests.mostRecent().params).toEqual(JSON.stringify({ targetParentId: 'parent-id' }));

        jasmine.Ajax.requests.mostRecent().respondWith({ status: 200, contentType: 'json' });
    });
});
