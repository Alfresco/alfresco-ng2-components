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

import { DocumentListService } from './document-list.service';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NodeEntry, NodePaging } from '@alfresco/js-api';
import { CustomResourcesService } from './custom-resources.service';
import { NodesApiService } from '../../common';
import { provideApiTesting } from '../../testing/providers';

declare let jasmine: any;

describe('DocumentListService', () => {
    let service: DocumentListService;
    let customResourcesService: CustomResourcesService;
    let nodesApiService: NodesApiService;

    const fakeFolder = {
        list: {
            pagination: { count: 1, hasMoreItems: false, totalItems: 1, skipCount: 0, maxItems: 20 },
            entries: [
                {
                    entry: {
                        createdAt: '2016-12-06T13:03:14.880+0000',
                        path: {
                            name: '/Company Home/Sites/swsdp/documentLibrary/empty',
                            isComplete: true,
                            elements: [
                                {
                                    id: 'ed7ab80e-b398-4bed-b38d-139ae4cc592a',
                                    name: 'Company Home'
                                },
                                { id: '99e1368f-e816-47fc-a8bf-3b358feaf31e', name: 'Sites' },
                                {
                                    id: 'b4cff62a-664d-4d45-9302-98723eac1319',
                                    name: 'swsdp'
                                },
                                {
                                    id: '8f2105b4-daaf-4874-9e8a-2152569d109b',
                                    name: 'documentLibrary'
                                },
                                { id: '17fa78d2-4d6b-4a46-876b-4b0ea07f7f32', name: 'empty' }
                            ]
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
                }
            ]
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideApiTesting()]
        });
        service = TestBed.inject(DocumentListService);
        customResourcesService = TestBed.inject(CustomResourcesService);
        nodesApiService = TestBed.inject(NodesApiService);
        jasmine.Ajax.install();
    });

    it('should emit resetSelection$ when resetSelection is called', (done) => {
        service.resetSelection$.subscribe(() => {
            done();
        });
        service.resetSelection();
    });

    it('should emit reload$ when reload is called', (done) => {
        service.reload$.subscribe(() => {
            done();
        });
        service.reload();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should return the folder info', fakeAsync(() => {
        service.getFolder('/fake-root/fake-name').subscribe((res) => {
            expect(res).toBeDefined();
            expect(res.list).toBeDefined();
            expect(res.list.entries).toBeDefined();
            expect(res.list.entries.length).toBe(1);
            expect(res.list.entries[0].entry.isFolder).toBeTruthy();
            expect(res.list.entries[0].entry.name).toEqual('fake-name');
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: fakeFolder
        });
    }));

    it('should use rootFolderId provided in options', () => {
        const spyGetNodeInfo = spyOn(service.nodes, 'listNodeChildren').and.callThrough();

        service.getFolder('/fake-root/fake-name', { rootFolderId: 'testRoot' }, ['isLocked']);

        expect(spyGetNodeInfo).toHaveBeenCalledWith('testRoot', {
            includeSource: true,
            include: ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames', 'isLocked'],
            relativePath: '/fake-root/fake-name'
        });
    });

    it('should use provided other values passed in options', () => {
        const spyGetNodeInfo = spyOn(service.nodes, 'listNodeChildren').and.callThrough();

        service.getFolder('/fake-root/fake-name', { rootFolderId: 'testRoot', maxItems: 10, skipCount: 5, where: 'where', orderBy: ['order'] }, [
            'isLocked'
        ]);

        expect(spyGetNodeInfo).toHaveBeenCalledWith('testRoot', {
            includeSource: true,
            include: ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames', 'isLocked'],
            relativePath: '/fake-root/fake-name',
            maxItems: 10,
            skipCount: 5,
            where: 'where',
            orderBy: ['order']
        });
    });

    it('should add the includeTypes in the request Node Children if required', () => {
        const spyGetNodeInfo = spyOn(service.nodes, 'listNodeChildren').and.callThrough();

        service.getFolder('/fake-root/fake-name', {}, ['isLocked']);

        expect(spyGetNodeInfo).toHaveBeenCalledWith('-root-', {
            includeSource: true,
            include: ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames', 'isLocked'],
            relativePath: '/fake-root/fake-name'
        });
    });

    it('should not add the includeTypes in the request Node Children if is duplicated', () => {
        const spyGetNodeInfo = spyOn(service.nodes, 'listNodeChildren').and.callThrough();

        service.getFolder('/fake-root/fake-name', {}, ['allowableOperations']);

        expect(spyGetNodeInfo).toHaveBeenCalledWith('-root-', {
            includeSource: true,
            include: ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames'],
            relativePath: '/fake-root/fake-name'
        });
    });

    it('should add the includeTypes in the request getFolderNode if required', () => {
        const spyGetNodeInfo = spyOn(service.nodes, 'getNode').and.callThrough();

        service.getFolderNode('test-id', ['isLocked']);

        expect(spyGetNodeInfo).toHaveBeenCalledWith('test-id', {
            includeSource: true,
            include: ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames', 'isLocked']
        });
    });

    it('should not add the includeTypes in the request getFolderNode if is duplicated', () => {
        const spyGetNodeInfo = spyOn(service.nodes, 'getNode').and.callThrough();

        service.getFolderNode('test-id', ['allowableOperations']);

        expect(spyGetNodeInfo).toHaveBeenCalledWith('test-id', {
            includeSource: true,
            include: ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames']
        });
    });

    it('should add default includeTypes in the request getFolderNode if none is provided', () => {
        const spyGetNodeInfo = spyOn(service.nodes, 'getNode').and.callThrough();

        service.getFolderNode('test-id');

        expect(spyGetNodeInfo).toHaveBeenCalledWith('test-id', {
            includeSource: true,
            include: ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames']
        });
    });

    it('should delete the folder', fakeAsync(() => {
        service.deleteNode('fake-id').subscribe((res) => {
            expect(res).toBe('');
        });

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

    it('should call isCustomSource from customResourcesService when isCustomSourceService is called', () => {
        spyOn(customResourcesService, 'isCustomSource').and.returnValue(true);

        const isCustom = service.isCustomSourceService('fake-source-id');
        expect(isCustom).toBeTrue();
        expect(customResourcesService.isCustomSource).toHaveBeenCalledWith('fake-source-id');
    });

    it('should call getNode from nodes service with proper params when getNode is called', () => {
        spyOn(nodesApiService, 'getNode').and.returnValue(of(null));

        service.getNode('fake-node-id');

        expect(nodesApiService.getNode).toHaveBeenCalledWith('fake-node-id', {
            includeSource: true,
            include: ['path', 'properties', 'allowableOperations', 'permissions', 'definition']
        });
    });

    it('should removed duplicated include values for getNode', () => {
        spyOn(nodesApiService, 'getNode').and.returnValue(of(null));

        service.getNode('fake-node-id', ['aspectNames', 'path', 'properties', 'custom1', 'custom2']);

        expect(nodesApiService.getNode).toHaveBeenCalledWith('fake-node-id', {
            includeSource: true,
            include: ['path', 'properties', 'allowableOperations', 'permissions', 'definition', 'aspectNames', 'custom1', 'custom2']
        });
    });

    describe('loadFolderByNodeId', () => {
        const fakeFolderLocal: NodeEntry = {
            entry: {
                id: 'fake-id',
                name: 'fake-name',
                nodeType: 'cm:folder',
                isFolder: true,
                isFile: false,
                modifiedAt: new Date(),
                createdAt: new Date(),
                createdByUser: { id: 'fake-user', displayName: 'Fake User' },
                modifiedByUser: { id: 'fake-user', displayName: 'Fake User' },
                parentId: 'fake-parent-id'
            }
        };

        const fakeFolderPaging: NodePaging = {
            list: {
                pagination: { count: 1, hasMoreItems: false, totalItems: 1, skipCount: 0, maxItems: 20 },
                entries: [fakeFolderLocal]
            }
        };
        it('should call getFolder and getFolderNode when source is not custom', (done) => {
            spyOn(service, 'getFolder').and.returnValue(of(fakeFolderPaging));
            spyOn(service, 'getFolderNode').and.returnValue(of(fakeFolderLocal));
            spyOn(customResourcesService, 'isCustomSource').and.returnValue(false);

            service.loadFolderByNodeId('fake-id', { maxItems: 10, skipCount: 0 }, ['includeMe'], 'where', ['order']).subscribe((result) => {
                expect(service.getFolder).toHaveBeenCalledWith(
                    null,
                    { maxItems: 10, skipCount: 0, orderBy: ['order'], rootFolderId: 'fake-id', where: 'where' },
                    ['includeMe']
                );
                expect(service.getFolderNode).toHaveBeenCalledWith('fake-id', ['includeMe']);
                expect(result.currentNode).toEqual(fakeFolderLocal);
                expect(result.children).toEqual(fakeFolderPaging);
                done();
            });
        });

        it('should call customResourcesService.loadFolderByNodeId when source is custom', (done) => {
            spyOn(customResourcesService, 'isCustomSource').and.returnValue(true);
            spyOn(customResourcesService, 'loadFolderByNodeId').and.returnValue(of(fakeFolderPaging));

            service
                .loadFolderByNodeId('fake-id', { maxItems: 10, skipCount: 0 }, ['includeMe'], 'where', ['order'], ['filter'])
                .subscribe((result) => {
                    expect(customResourcesService.loadFolderByNodeId).toHaveBeenCalledWith(
                        'fake-id',
                        { maxItems: 10, skipCount: 0 },
                        ['includeMe'],
                        'where',
                        ['filter']
                    );
                    expect(result.currentNode).toBeNull();
                    expect(result.children).toEqual(fakeFolderPaging);
                    done();
                });
        });
    });
});
