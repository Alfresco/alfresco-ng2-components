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

import { async, TestBed } from '@angular/core/testing';
import { CookieService, CoreModule, LogService, LogServiceMock } from 'ng2-alfresco-core';
import { CookieServiceMock } from '../../../ng2-alfresco-core/src/assets/cookie.service.mock';
import { DocumentListService } from './document-list.service';

declare let jasmine: any;

describe('DocumentListService', () => {

    let service: DocumentListService;

    let fakeEntryNode = {
        'entry': {
            'aspectNames': ['cm:auditable'],
            'createdAt': '2016-12-06T15:58:32.408+0000',
            'isFolder': true,
            'isFile': false,
            'createdByUser': {'id': 'admin', 'displayName': 'Administrator'},
            'modifiedAt': '2016-12-06T15:58:32.408+0000',
            'modifiedByUser': {'id': 'admin', 'displayName': 'Administrator'},
            'name': 'fake-name',
            'id': '2214733d-a920-4dbe-af95-4230345fae82',
            'nodeType': 'cm:folder',
            'parentId': 'ed7ab80e-b398-4bed-b38d-139ae4cc592a'
        }
    };

    let fakeAlreadyExist = {
        'error': {
            'errorKey': 'Duplicate child name not allowed: empty',
            'statusCode': 409,
            'briefSummary': '11060002 Duplicate child name not' +
            ' allowed: empty',
            'stackTrace': 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
            'descriptionURL': 'https://api-explorer.alfresco.com'
        }
    };

    let fakeFolder = {
        'list': {
            'pagination': {'count': 1, 'hasMoreItems': false, 'totalItems': 1, 'skipCount': 0, 'maxItems': 20},
            'entries': [{
                'entry': {
                    'createdAt': '2016-12-06T13:03:14.880+0000',
                    'path': {
                        'name': '/Company Home/Sites/swsdp/documentLibrary/empty',
                        'isComplete': true,
                        'elements': [{
                            'id': 'ed7ab80e-b398-4bed-b38d-139ae4cc592a',
                            'name': 'Company Home'
                        }, {'id': '99e1368f-e816-47fc-a8bf-3b358feaf31e', 'name': 'Sites'}, {
                            'id': 'b4cff62a-664d-4d45-9302-98723eac1319',
                            'name': 'swsdp'
                        }, {
                            'id': '8f2105b4-daaf-4874-9e8a-2152569d109b',
                            'name': 'documentLibrary'
                        }, {'id': '17fa78d2-4d6b-4a46-876b-4b0ea07f7f32', 'name': 'empty'}]
                    },
                    'isFolder': true,
                    'isFile': false,
                    'createdByUser': {'id': 'admin', 'displayName': 'Administrator'},
                    'modifiedAt': '2016-12-06T13:03:14.880+0000',
                    'modifiedByUser': {'id': 'admin', 'displayName': 'Administrator'},
                    'name': 'fake-name',
                    'id': 'aac546f6-1525-46ff-bf6b-51cb85f3cda7',
                    'nodeType': 'cm:folder',
                    'parentId': '17fa78d2-4d6b-4a46-876b-4b0ea07f7f32'
                }
            }]
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            providers: [
                DocumentListService,
                { provide: CookieService, useClass: CookieServiceMock },
                { provide: LogService, useClass: LogServiceMock }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        service = TestBed.get(DocumentListService);
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should create a folder in the path', () => {
        service.createFolder('fake-name', 'fake-path').subscribe(
            res => {
                expect(res).toBeDefined();
                expect(res.entry).toBeDefined();
                expect(res.entry.isFolder).toBeTruthy();
                expect(res.entry.name).toEqual('fake-name');
                expect(res.entry.nodeType).toEqual('cm:folder');
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: fakeEntryNode
        });
    });

    xit('should emit an error when the folder already exist', () => {
        service.createFolder('fake-name', 'fake-path').subscribe(
            res => {

            },
            err => {
                expect(err).toBeDefined();
                expect(err.status).toEqual(409);
                expect(err.response).toBeDefined();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 409,
            contentType: 'json',
            responseText: fakeAlreadyExist
        });
    });

    it('should return the folder info', () => {
        service.getFolder('/fake-root/fake-name').subscribe(
            res => {
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
    });

    it('should delete the folder', () => {
        service.deleteNode('fake-id').subscribe(
            res => {
                expect(res).toBeNull();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 204,
            contentType: 'json'
        });
    });

    it('should copy a node', (done) => {
        service.copyNode('node-id', 'parent-id').subscribe(done);

        expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
        expect(jasmine.Ajax.requests.mostRecent().url).toContain('/nodes/node-id/copy');
        expect(jasmine.Ajax.requests.mostRecent().params).toEqual(JSON.stringify({ targetParentId: 'parent-id' }));

        jasmine.Ajax.requests.mostRecent().respondWith({ status: 200, contentType: 'json' });
    });

    it('should move a node', (done) => {
        service.moveNode('node-id', 'parent-id').subscribe(done);

        expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
        expect(jasmine.Ajax.requests.mostRecent().url).toContain('/nodes/node-id/move');
        expect(jasmine.Ajax.requests.mostRecent().params).toEqual(JSON.stringify({ targetParentId: 'parent-id' }));

        jasmine.Ajax.requests.mostRecent().respondWith({ status: 200, contentType: 'json' });
    });
});
