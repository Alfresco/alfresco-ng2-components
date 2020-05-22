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
import { NodesApiService } from './nodes-api.service';
import { setupTestBed } from '../testing/setup-test-bed';
import { AlfrescoApiService } from './alfresco-api.service';
import { NodeMetadata } from '../models/node-metadata.model';
import { CoreTestingModule } from '../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('NodesApiService', () => {
    let service: NodesApiService;
    let apiService: AlfrescoApiService;

    const MODEL_NAMESPACE = 'activitiForms';
    const responseBody = {
        entry: {
            id: '111-222-33-44-1123',
            nodeType: 'typeTest',
            properties: {
                test: 'test',
                testdata: 'testdata'
            }
        }
    };
    const mockSpy = {
        core: {
            nodesApi: {
                getNode: jasmine.createSpy('getNode'),
                getNodeChildren: jasmine.createSpy('getNodeChildren'),
                addNode: jasmine.createSpy('addNode')
            }
        }
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(NodesApiService);
        apiService = TestBed.inject(AlfrescoApiService);
        spyOn(apiService, 'getInstance').and.returnValue(mockSpy);
    });

    afterEach(() => {
        mockSpy.core.nodesApi.getNode.calls.reset();
        mockSpy.core.nodesApi.getNodeChildren.calls.reset();
        mockSpy.core.nodesApi.addNode.calls.reset();
    });

    it('Should return the node information', (done) => {
        mockSpy.core.nodesApi.getNode.and.returnValue(Promise.resolve(responseBody));

        service.getNode('-nodeid-').subscribe((result) => {
            const args = [
                '-nodeid-',
                { 'include': ['path', 'properties', 'allowableOperations', 'permissions'] }
            ];
            expect(mockSpy.core.nodesApi.getNode.calls.mostRecent().args).toEqual(args);
            expect(result).toEqual(<any> responseBody.entry);
            done();
        });
    });

    it('Should return the node child information', (done) => {
        const fakeNodeList = {
            list: {
                entries: [
                    { entry: { id: 'fake-node-id', name: 'fake-node-name', isFolder: true } },
                    { entry: { id: 'fake-file-id', name: 'fake-file-name', isFolder: false } }
                ]
            }
        };
        mockSpy.core.nodesApi.getNodeChildren.and.returnValue(Promise.resolve(fakeNodeList));

        service.getNodeChildren('-nodeid-', {}).subscribe((result) => {
            const args = [
                '-nodeid-',
                {
                    'include': ['path', 'properties', 'allowableOperations', 'permissions'],
                    maxItems: 25,
                    skipCount: 0
                }
            ];
            expect(mockSpy.core.nodesApi.getNodeChildren.calls.mostRecent().args).toEqual(args);
            expect(result).toBe(<any> fakeNodeList);
            done();
        });
    });

    it('Should fetch and node metadata', (done) => {
        mockSpy.core.nodesApi.getNode.and.returnValue(Promise.resolve(responseBody));

        service.getNodeMetadata('-nodeid-').subscribe((result) => {
            const node = new NodeMetadata({
                test: 'test',
                testdata: 'testdata'
            }, 'typeTest');
            expect(result).toEqual(node);
            done();
        });
    });

    it('Should create a node with metadata', (done) => {
        const data = {
            test: 'test',
            testdata: 'testdata'
        };
        mockSpy.core.nodesApi.addNode.and.returnValue(Promise.resolve(responseBody));

        service.createNodeMetadata('typeTest', MODEL_NAMESPACE, data, '/Sites/swsdp/documentLibrary', 'testNode').subscribe((response) => {
            const args = [
                '-root-',
                {
                    'name': 'testNode',
                    'nodeType': 'typeTest',
                    'properties': {
                        'activitiForms:test': 'test',
                        'activitiForms:testdata': 'testdata'
                    },
                    'relativePath': '/Sites/swsdp/documentLibrary'
                },
                {}
            ];
            expect(mockSpy.core.nodesApi.addNode.calls.mostRecent().args).toEqual(args);
            expect(response).toBe(<any> responseBody);
            done();
        });
    });

    it('Should create a random name node with metadata', (done) => {
        const uuidRegex = /[0-9a-z]{8}-[0-9a-z]{4}-4[0-9a-z]{3}-[0-9a-z]{4}-[0-9a-z]{12}/;
        mockSpy.core.nodesApi.addNode.and.returnValue(Promise.resolve(responseBody));

        service.createNodeMetadata('typeTest', MODEL_NAMESPACE, {}, '/Sites/swsdp/documentLibrary').subscribe(() => {
            expect(mockSpy.core.nodesApi.addNode.calls.mostRecent().args[0]).toEqual('-root-');
            expect(uuidRegex.test(mockSpy.core.nodesApi.addNode.calls.mostRecent().args[1].name)).toBe(true);
            done();
        });
    });
});
