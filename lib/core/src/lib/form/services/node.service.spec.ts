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
import { NodeMetadata } from '../models/node-metadata.model';
import { EcmModelService } from './ecm-model.service';
import { NodeService } from './node.service';
import { setupTestBed } from '../../testing/setupTestBed';
import { CoreModule } from '../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { AlfrescoApiServiceMock } from '../../mock/alfresco-api.service.mock';

declare let jasmine: any;

describe('NodeService', () => {

    let service: NodeService;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    beforeEach(() => {
        service = TestBed.get(NodeService);
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('Should fetch and node metadata', (done) => {
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

        service.getNodeMetadata('-nodeid-').subscribe((result) => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('nodes/-nodeid-')).toBeTruthy();
            const node = new NodeMetadata({
                test: 'test',
                testdata: 'testdata'
            }, 'typeTest');
            expect(result).toEqual(node);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(responseBody)
        });
    });

    it('Should clean the metadata from :', (done) => {
        const responseBody = {
            entry: {
                id: '111-222-33-44-1123',
                nodeType: 'typeTest',
                properties: {
                    'metadata:test': 'test',
                    'metadata:testdata': 'testdata'
                }
            }
        };

        service.getNodeMetadata('-nodeid-').subscribe((result) => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('nodes/-nodeid-')).toBeTruthy();
            const node = new NodeMetadata({
                test: 'test',
                testdata: 'testdata'
            }, 'typeTest');
            expect(result).toEqual(node);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(responseBody)
        });
    });

    it('Should create a node with metadata', (done) => {
        const data = {
            test: 'test',
            testdata: 'testdata'
        };

        const responseBody = {
            id: 'a74d91fb-ea8a-4812-ad98-ad878366b5be',
            isFile: false,
            isFolder: true
        };

        service.createNodeMetadata('typeTest', EcmModelService.MODEL_NAMESPACE, data, '/Sites/swsdp/documentLibrary', 'testNode').subscribe(() => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('-root-/children')).toBeTruthy();
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(responseBody)
        });
    });

    it('Should add activitiForms suffix to the metadata properties', (done) => {
        const data = {
            test: 'test',
            testdata: 'testdata'
        };

        service.createNodeMetadata('typeTest', EcmModelService.MODEL_NAMESPACE, data, '/Sites/swsdp/documentLibrary').subscribe(() => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('-root-/children')).toBeTruthy();
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).properties[EcmModelService.MODEL_NAMESPACE + ':test']).toBeDefined();
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).properties[EcmModelService.MODEL_NAMESPACE + ':testdata']).toBeDefined();
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({})
        });
    });

    it('Should assign an UUID to the name when name not passed', (done) => {
        const data = {
            test: 'test',
            testdata: 'testdata'
        };

        service.createNodeMetadata('typeTest', EcmModelService.MODEL_NAMESPACE, data, '/Sites/swsdp/documentLibrary').subscribe(() => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('-root-/children')).toBeTruthy();
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).name).toBeDefined();
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({})
        });
    });
});
